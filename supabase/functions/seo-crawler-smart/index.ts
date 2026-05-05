/**
 * SMART SEO CRAWLER FOR SPA
 * Crawls pages from database + static routes
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

// Static routes from your React app
const STATIC_ROUTES = [
  '/',
  '/about',
  '/products',
  '/shop',
  '/blog',
  '/recipes',
  '/contact',
  '/bulk-orders',
  '/export',
  '/certifications',
  '/quality',
  '/faq',
  '/careers',
  '/press',
  '/partnerships',
  '/privacy',
  '/terms',
  '/refund',
  '/shipping',
  '/hot-sauces',
  '/mayonnaise',
  '/international',
  '/bbq-sauces',
];

serve(async (req) => {
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

    // Create crawl session
    const { data: crawl, error: crawlError } = await supabase
      .from('seo_crawls')
      .insert({ status: 'running', crawl_config: {} })
      .select()
      .single();

    if (crawlError) throw crawlError;

    console.log(`[Smart Crawler] Started crawl session: ${crawl.id}`);

    let pagesProcessed = 0;
    let issuesFound = 0;

    // 1. Crawl static routes
    for (const route of STATIC_ROUTES) {
      const url = `${SITE_URL}${route}`;
      const result = await crawlAndAnalyze(url, supabase, crawl.id);
      if (result) {
        pagesProcessed++;
        issuesFound += result.issuesCount;
      }
    }

    // 2. Crawl product pages from database
    const { data: products } = await supabase
      .from('products')
      .select('slug')
      .eq('status', 'active');

    if (products) {
      for (const product of products) {
        const url = `${SITE_URL}/products/${product.slug}`;
        const result = await crawlAndAnalyze(url, supabase, crawl.id);
        if (result) {
          pagesProcessed++;
          issuesFound += result.issuesCount;
        }
      }
    }

    // 3. Crawl category pages from database
    const { data: categories } = await supabase
      .from('categories')
      .select('slug');

    if (categories) {
      for (const category of categories) {
        const url = `${SITE_URL}/category/${category.slug}`;
        const result = await crawlAndAnalyze(url, supabase, crawl.id);
        if (result) {
          pagesProcessed++;
          issuesFound += result.issuesCount;
        }
      }
    }

    // Update crawl session
    const duration = Math.floor((Date.now() - new Date(crawl.started_at).getTime()) / 1000);
    await supabase
      .from('seo_crawls')
      .update({
        status: 'completed',
        completed_at: new Date().toISOString(),
        pages_crawled: pagesProcessed,
        issues_found: issuesFound,
        duration_seconds: duration,
      })
      .eq('id', crawl.id);

    console.log(`[Smart Crawler] Completed. Pages: ${pagesProcessed}, Issues: ${issuesFound}`);

    return new Response(
      JSON.stringify({
        success: true,
        crawlId: crawl.id,
        pagesProcessed,
        issuesFound,
        duration,
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('[Smart Crawler] Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

async function crawlAndAnalyze(url: string, supabase: any, crawlId: string) {
  try {
    console.log(`[Crawling] ${url}`);
    
    const response = await fetch(url, {
      headers: { 'User-Agent': 'Y7-SEO-Bot/1.0' },
    });

    const html = await response.text();
    const statusCode = response.status;

    // Parse HTML
    const title = html.match(/<title[^>]*>([^<]+)<\/title>/i)?.[1] || null;
    const metaDesc = html.match(/<meta\s+name=["']description["']\s+content=["']([^"']+)["']/i)?.[1] || null;
    const h1 = html.match(/<h1[^>]*>([^<]+)<\/h1>/i)?.[1] || null;
    const canonical = html.match(/<link\s+rel=["']canonical["']\s+href=["']([^"']+)["']/i)?.[1] || null;
    
    const textContent = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
    const wordCount = textContent.split(' ').length;
    
    const robotsMeta = html.match(/<meta\s+name=["']robots["']\s+content=["']([^"']+)["']/i)?.[1] || '';
    const isIndexable = !robotsMeta.includes('noindex');

    // Save page
    const { data: savedPage } = await supabase
      .from('seo_pages')
      .upsert({
        url,
        path: new URL(url).pathname,
        title,
        meta_description: metaDesc,
        h1,
        canonical_url: canonical,
        status_code: statusCode,
        content_hash: await hashString(textContent),
        word_count: wordCount,
        depth: 0,
        is_indexable: isIndexable,
        last_crawled_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (!savedPage) return null;

    // Analyze issues
    const issues = [];

    if (!title) {
      issues.push({
        page_id: savedPage.id,
        crawl_id: crawlId,
        issue_type: 'missing_title',
        severity: 'critical',
        category: 'technical',
        title: 'Missing Page Title',
        description: 'Page has no title tag',
        impact_score: 95,
        auto_fixable: true,
        confidence_score: 1.0,
      });
    }

    if (title && (title.length < 30 || title.length > 60)) {
      issues.push({
        page_id: savedPage.id,
        crawl_id: crawlId,
        issue_type: 'title_length',
        severity: 'medium',
        category: 'content',
        title: 'Title Length Issue',
        description: `Title is ${title.length} characters (optimal: 50-60)`,
        impact_score: 60,
        current_value: title,
        recommended_value: 'Adjust to 50-60 characters',
        auto_fixable: true,
        confidence_score: 0.9,
      });
    }

    if (!metaDesc) {
      issues.push({
        page_id: savedPage.id,
        crawl_id: crawlId,
        issue_type: 'missing_meta_description',
        severity: 'high',
        category: 'technical',
        title: 'Missing Meta Description',
        description: 'Page has no meta description',
        impact_score: 85,
        auto_fixable: true,
        confidence_score: 1.0,
      });
    }

    if (!h1) {
      issues.push({
        page_id: savedPage.id,
        crawl_id: crawlId,
        issue_type: 'missing_h1',
        severity: 'high',
        category: 'content',
        title: 'Missing H1 Heading',
        description: 'Page has no H1 heading',
        impact_score: 80,
        auto_fixable: false,
        confidence_score: 1.0,
      });
    }

    if (wordCount < 300) {
      issues.push({
        page_id: savedPage.id,
        crawl_id: crawlId,
        issue_type: 'thin_content',
        severity: 'high',
        category: 'content',
        title: 'Thin Content',
        description: `Page has only ${wordCount} words (minimum: 300)`,
        impact_score: 75,
        current_value: `${wordCount} words`,
        auto_fixable: false,
        confidence_score: 1.0,
      });
    }

    if (!canonical) {
      issues.push({
        page_id: savedPage.id,
        crawl_id: crawlId,
        issue_type: 'missing_canonical',
        severity: 'medium',
        category: 'technical',
        title: 'Missing Canonical URL',
        description: 'Page has no canonical tag',
        impact_score: 70,
        recommended_value: url,
        auto_fixable: true,
        confidence_score: 1.0,
      });
    }

    // Save issues
    for (const issue of issues) {
      await supabase.from('seo_issues').insert(issue);
    }

    // Calculate SEO score
    const score = Math.max(0, 100 - (issues.length * 10));
    await supabase
      .from('seo_pages')
      .update({ seo_score: score })
      .eq('id', savedPage.id);

    return { issuesCount: issues.length };

  } catch (error) {
    console.error(`[Error crawling] ${url}:`, error);
    return null;
  }
}

async function hashString(str: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(str);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}
