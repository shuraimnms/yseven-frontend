/**
 * AUTONOMOUS SITE CRAWLER ENGINE
 * Crawls all pages recursively, detects SEO issues
 * Runs via Supabase Cron (daily/hourly)
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const SITE_URL = Deno.env.get('SITE_URL') || 'https://ysevenfoods.com';

interface CrawlConfig {
  maxDepth: number;
  maxPages: number;
  followExternal: boolean;
  checkBrokenLinks: boolean;
  analyzeContent: boolean;
}

interface PageData {
  url: string;
  path: string;
  title: string | null;
  metaDescription: string | null;
  h1: string | null;
  canonicalUrl: string | null;
  statusCode: number;
  contentHash: string;
  wordCount: number;
  depth: number;
  isIndexable: boolean;
  links: string[];
  images: { src: string; alt: string | null }[];
  headings: { level: number; text: string }[];
  schemas: any[];
}

interface SEOIssue {
  issueType: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  category: string;
  title: string;
  description: string;
  impactScore: number;
  currentValue: string | null;
  recommendedValue: string | null;
  autoFixable: boolean;
  confidenceScore: number;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

    // Check if AI engine is enabled
    const { data: settings } = await supabase
      .from('seo_settings')
      .select('value')
      .eq('key', 'ai_engine_enabled')
      .single();

    if (!settings || settings.value === false) {
      return new Response(
        JSON.stringify({ message: 'AI SEO engine is disabled' }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get crawl config
    const config: CrawlConfig = {
      maxDepth: 10,
      maxPages: 1000,
      followExternal: false,
      checkBrokenLinks: true,
      analyzeContent: true,
    };

    // Create crawl session
    const { data: crawl, error: crawlError } = await supabase
      .from('seo_crawls')
      .insert({
        status: 'running',
        crawl_config: config,
      })
      .select()
      .single();

    if (crawlError) throw crawlError;

    console.log(`[Crawler] Started crawl session: ${crawl.id}`);

    // Start crawling
    const crawledPages = new Set<string>();
    const queue: { url: string; depth: number }[] = [{ url: SITE_URL, depth: 0 }];
    const issues: (SEOIssue & { pageUrl: string })[] = [];
    let pagesProcessed = 0;

    while (queue.length > 0 && pagesProcessed < config.maxPages) {
      const { url, depth } = queue.shift()!;

      if (crawledPages.has(url) || depth > config.maxDepth) continue;
      crawledPages.add(url);

      try {
        console.log(`[Crawler] Crawling: ${url} (depth: ${depth})`);

        // Fetch page
        const pageData = await crawlPage(url, depth);
        pagesProcessed++;

        // Save page to database
        const { data: savedPage } = await supabase
          .from('seo_pages')
          .upsert({
            url: pageData.url,
            path: pageData.path,
            title: pageData.title,
            meta_description: pageData.metaDescription,
            h1: pageData.h1,
            canonical_url: pageData.canonicalUrl,
            status_code: pageData.statusCode,
            content_hash: pageData.contentHash,
            word_count: pageData.wordCount,
            depth: pageData.depth,
            is_indexable: pageData.isIndexable,
            last_crawled_at: new Date().toISOString(),
          })
          .select()
          .single();

        if (!savedPage) continue;

        // Analyze page for issues
        const pageIssues = await analyzePage(pageData, config);
        
        // Save issues
        for (const issue of pageIssues) {
          await supabase.from('seo_issues').insert({
            page_id: savedPage.id,
            crawl_id: crawl.id,
            issue_type: issue.issueType,
            severity: issue.severity,
            category: issue.category,
            title: issue.title,
            description: issue.description,
            impact_score: issue.impactScore,
            current_value: issue.currentValue,
            recommended_value: issue.recommendedValue,
            auto_fixable: issue.autoFixable,
            confidence_score: issue.confidenceScore,
          });
        }

        issues.push(...pageIssues.map(i => ({ ...i, pageUrl: url })));

        // Add internal links to queue
        for (const link of pageData.links) {
          if (link.startsWith(SITE_URL) && !crawledPages.has(link)) {
            queue.push({ url: link, depth: depth + 1 });
          }
        }

        // Save internal links
        for (const link of pageData.links) {
          if (link.startsWith(SITE_URL)) {
            const { data: targetPage } = await supabase
              .from('seo_pages')
              .select('id')
              .eq('url', link)
              .single();

            if (targetPage) {
              await supabase.from('seo_internal_links').upsert({
                source_page_id: savedPage.id,
                target_page_id: targetPage.id,
                anchor_text: '', // Extract from HTML
                link_position: 'content',
                last_seen_at: new Date().toISOString(),
              });
            }
          }
        }

      } catch (error) {
        console.error(`[Crawler] Error crawling ${url}:`, error);
      }
    }

    // Mark orphan pages
    await markOrphanPages(supabase);

    // Update crawl session
    const duration = Math.floor((Date.now() - new Date(crawl.started_at).getTime()) / 1000);
    await supabase
      .from('seo_crawls')
      .update({
        status: 'completed',
        completed_at: new Date().toISOString(),
        pages_crawled: pagesProcessed,
        issues_found: issues.length,
        duration_seconds: duration,
      })
      .eq('id', crawl.id);

    console.log(`[Crawler] Completed. Pages: ${pagesProcessed}, Issues: ${issues.length}`);

    // Trigger AI analyzer
    await fetch(`${SUPABASE_URL}/functions/v1/seo-ai-analyzer`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
      },
      body: JSON.stringify({ crawlId: crawl.id }),
    });

    return new Response(
      JSON.stringify({
        success: true,
        crawlId: crawl.id,
        pagesProcessed,
        issuesFound: issues.length,
        duration,
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('[Crawler] Fatal error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

async function crawlPage(url: string, depth: number): Promise<PageData> {
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'Y7-SEO-Bot/1.0',
    },
  });

  const html = await response.text();
  const statusCode = response.status;

  // Parse HTML (simple regex-based parsing for Edge Function)
  const title = html.match(/<title[^>]*>([^<]+)<\/title>/i)?.[1] || null;
  const metaDescription = html.match(/<meta\s+name=["']description["']\s+content=["']([^"']+)["']/i)?.[1] || null;
  const h1 = html.match(/<h1[^>]*>([^<]+)<\/h1>/i)?.[1] || null;
  const canonical = html.match(/<link\s+rel=["']canonical["']\s+href=["']([^"']+)["']/i)?.[1] || null;

  // Extract links
  const linkMatches = html.matchAll(/<a\s+[^>]*href=["']([^"']+)["'][^>]*>/gi);
  const links = Array.from(linkMatches).map(m => {
    const href = m[1];
    if (href.startsWith('http')) return href;
    if (href.startsWith('/')) return new URL(href, url).href;
    return new URL(href, url).href;
  });

  // Extract images
  const imgMatches = html.matchAll(/<img\s+[^>]*src=["']([^"']+)["'][^>]*alt=["']([^"']*)["'][^>]*>/gi);
  const images = Array.from(imgMatches).map(m => ({
    src: m[1],
    alt: m[2] || null,
  }));

  // Extract headings
  const headingMatches = html.matchAll(/<h([1-6])[^>]*>([^<]+)<\/h\1>/gi);
  const headings = Array.from(headingMatches).map(m => ({
    level: parseInt(m[1]),
    text: m[2],
  }));

  // Word count (rough estimate)
  const textContent = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
  const wordCount = textContent.split(' ').length;

  // Content hash
  const contentHash = await hashString(textContent);

  // Check if indexable
  const robotsMeta = html.match(/<meta\s+name=["']robots["']\s+content=["']([^"']+)["']/i)?.[1] || '';
  const isIndexable = !robotsMeta.includes('noindex');

  return {
    url,
    path: new URL(url).pathname,
    title,
    metaDescription,
    h1,
    canonicalUrl: canonical,
    statusCode,
    contentHash,
    wordCount,
    depth,
    isIndexable,
    links: [...new Set(links)],
    images,
    headings,
    schemas: [], // TODO: Extract JSON-LD schemas
  };
}

async function analyzePage(page: PageData, config: CrawlConfig): Promise<SEOIssue[]> {
  const issues: SEOIssue[] = [];

  // Missing title
  if (!page.title || page.title.length === 0) {
    issues.push({
      issueType: 'missing_title',
      severity: 'critical',
      category: 'technical',
      title: 'Missing Page Title',
      description: 'Page has no title tag',
      impactScore: 95,
      currentValue: null,
      recommendedValue: 'Add descriptive title (50-60 characters)',
      autoFixable: true,
      confidenceScore: 1.0,
    });
  }

  // Title too short/long
  if (page.title && (page.title.length < 30 || page.title.length > 60)) {
    issues.push({
      issueType: 'title_length',
      severity: 'medium',
      category: 'content',
      title: 'Title Length Issue',
      description: `Title is ${page.title.length} characters (optimal: 50-60)`,
      impactScore: 60,
      currentValue: page.title,
      recommendedValue: 'Adjust title length to 50-60 characters',
      autoFixable: true,
      confidenceScore: 0.9,
    });
  }

  // Missing meta description
  if (!page.metaDescription) {
    issues.push({
      issueType: 'missing_meta_description',
      severity: 'high',
      category: 'technical',
      title: 'Missing Meta Description',
      description: 'Page has no meta description',
      impactScore: 85,
      currentValue: null,
      recommendedValue: 'Add compelling meta description (150-160 characters)',
      autoFixable: true,
      confidenceScore: 1.0,
    });
  }

  // Meta description too short/long
  if (page.metaDescription && (page.metaDescription.length < 120 || page.metaDescription.length > 160)) {
    issues.push({
      issueType: 'meta_description_length',
      severity: 'medium',
      category: 'content',
      title: 'Meta Description Length Issue',
      description: `Meta description is ${page.metaDescription.length} characters (optimal: 150-160)`,
      impactScore: 55,
      currentValue: page.metaDescription,
      recommendedValue: 'Adjust meta description to 150-160 characters',
      autoFixable: true,
      confidenceScore: 0.9,
    });
  }

  // Missing H1
  if (!page.h1) {
    issues.push({
      issueType: 'missing_h1',
      severity: 'high',
      category: 'content',
      title: 'Missing H1 Heading',
      description: 'Page has no H1 heading',
      impactScore: 80,
      currentValue: null,
      recommendedValue: 'Add H1 heading with primary keyword',
      autoFixable: false,
      confidenceScore: 1.0,
    });
  }

  // Multiple H1s
  const h1Count = page.headings.filter(h => h.level === 1).length;
  if (h1Count > 1) {
    issues.push({
      issueType: 'multiple_h1',
      severity: 'medium',
      category: 'content',
      title: 'Multiple H1 Headings',
      description: `Page has ${h1Count} H1 headings (should have exactly 1)`,
      impactScore: 65,
      currentValue: `${h1Count} H1 tags`,
      recommendedValue: 'Use only one H1 per page',
      autoFixable: false,
      confidenceScore: 1.0,
    });
  }

  // Thin content
  if (page.wordCount < 300) {
    issues.push({
      issueType: 'thin_content',
      severity: 'high',
      category: 'content',
      title: 'Thin Content',
      description: `Page has only ${page.wordCount} words (minimum: 300)`,
      impactScore: 75,
      currentValue: `${page.wordCount} words`,
      recommendedValue: 'Expand content to at least 300 words',
      autoFixable: false,
      confidenceScore: 1.0,
    });
  }

  // Missing canonical
  if (!page.canonicalUrl) {
    issues.push({
      issueType: 'missing_canonical',
      severity: 'medium',
      category: 'technical',
      title: 'Missing Canonical URL',
      description: 'Page has no canonical tag',
      impactScore: 70,
      currentValue: null,
      recommendedValue: page.url,
      autoFixable: true,
      confidenceScore: 1.0,
    });
  }

  // Images without alt text
  const imagesWithoutAlt = page.images.filter(img => !img.alt || img.alt.length === 0);
  if (imagesWithoutAlt.length > 0) {
    issues.push({
      issueType: 'missing_image_alt',
      severity: 'medium',
      category: 'accessibility',
      title: 'Images Missing Alt Text',
      description: `${imagesWithoutAlt.length} images have no alt text`,
      impactScore: 60,
      currentValue: `${imagesWithoutAlt.length} images`,
      recommendedValue: 'Add descriptive alt text to all images',
      autoFixable: false,
      confidenceScore: 1.0,
    });
  }

  // Not indexable
  if (!page.isIndexable) {
    issues.push({
      issueType: 'not_indexable',
      severity: 'critical',
      category: 'technical',
      title: 'Page Not Indexable',
      description: 'Page has noindex directive',
      impactScore: 100,
      currentValue: 'noindex',
      recommendedValue: 'Remove noindex if page should be indexed',
      autoFixable: false,
      confidenceScore: 1.0,
    });
  }

  // 404 or error status
  if (page.statusCode >= 400) {
    issues.push({
      issueType: 'http_error',
      severity: 'critical',
      category: 'technical',
      title: `HTTP ${page.statusCode} Error`,
      description: `Page returns ${page.statusCode} status code`,
      impactScore: 100,
      currentValue: `${page.statusCode}`,
      recommendedValue: 'Fix or redirect page',
      autoFixable: false,
      confidenceScore: 1.0,
    });
  }

  return issues;
}

async function markOrphanPages(supabase: any) {
  // Find pages with no incoming internal links
  const { data: pages } = await supabase
    .from('seo_pages')
    .select('id, url');

  if (!pages) return;

  for (const page of pages) {
    const { data: incomingLinks } = await supabase
      .from('seo_internal_links')
      .select('id')
      .eq('target_page_id', page.id)
      .limit(1);

    const isOrphan = !incomingLinks || incomingLinks.length === 0;

    await supabase
      .from('seo_pages')
      .update({ is_orphan: isOrphan })
      .eq('id', page.id);
  }
}

async function hashString(str: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(str);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}
