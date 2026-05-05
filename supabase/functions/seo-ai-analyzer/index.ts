/**
 * AI SEO ANALYZER + DECISION ENGINE
 * Uses NVIDIA API to analyze issues and recommend fixes
 * Prioritizes by impact, predicts ranking improvements
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { crawlId } = await req.json();
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

    // Get NVIDIA API key
    const { data: apiKeySetting } = await supabase
      .from('seo_settings')
      .select('value')
      .eq('key', 'nvidia_api_key')
      .single();

    const NVIDIA_API_KEY = apiKeySetting?.value || Deno.env.get('NVIDIA_API_KEY');

    console.log(`[AI Analyzer] Starting analysis for crawl: ${crawlId}`);

    // Get all open issues from this crawl
    const { data: issues } = await supabase
      .from('seo_issues')
      .select('*, seo_pages(url, title, path)')
      .eq('crawl_id', crawlId)
      .eq('status', 'open');

    if (!issues || issues.length === 0) {
      return new Response(
        JSON.stringify({ message: 'No issues to analyze' }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`[AI Analyzer] Analyzing ${issues.length} issues`);

    // Group issues by page
    const issuesByPage = issues.reduce((acc, issue) => {
      const pageId = issue.page_id;
      if (!acc[pageId]) acc[pageId] = [];
      acc[pageId].push(issue);
      return acc;
    }, {} as Record<string, any[]>);

    // Analyze each page with AI
    for (const [pageId, pageIssues] of Object.entries(issuesByPage)) {
      try {
        const page = pageIssues[0].seo_pages;
        
        // Prepare AI prompt
        const prompt = buildAnalysisPrompt(page, pageIssues);
        
        // Call NVIDIA API (or fallback to rule-based)
        const analysis = NVIDIA_API_KEY 
          ? await analyzeWithNVIDIA(prompt, NVIDIA_API_KEY)
          : analyzeWithRules(page, pageIssues);

        // Update issues with AI recommendations
        for (const issue of pageIssues) {
          const aiRec = analysis.recommendations.find(
            (r: any) => r.issueType === issue.issue_type
          );

          if (aiRec) {
            await supabase
              .from('seo_issues')
              .update({
                fix_priority: aiRec.priority,
                confidence_score: aiRec.confidence,
                recommended_value: aiRec.recommendedValue,
              })
              .eq('id', issue.id);

            // Create AI recommendation
            await supabase.from('seo_ai_recommendations').insert({
              page_id: pageId,
              recommendation_type: issue.issue_type,
              category: issue.category,
              title: aiRec.title,
              description: aiRec.description,
              current_state: issue.current_value,
              recommended_action: aiRec.action,
              expected_impact: aiRec.expectedImpact,
              confidence_score: aiRec.confidence,
              priority: aiRec.priority,
            });
          }
        }

        // Calculate page SEO score
        const seoScore = calculatePageScore(pageIssues);
        await supabase
          .from('seo_pages')
          .update({ seo_score: seoScore })
          .eq('id', pageId);

      } catch (error) {
        console.error(`[AI Analyzer] Error analyzing page ${pageId}:`, error);
      }
    }

    // Trigger auto-fix engine for high-confidence fixes
    await fetch(`${SUPABASE_URL}/functions/v1/seo-auto-fix`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
      },
      body: JSON.stringify({ crawlId }),
    });

    return new Response(
      JSON.stringify({
        success: true,
        issuesAnalyzed: issues.length,
        pagesAnalyzed: Object.keys(issuesByPage).length,
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('[AI Analyzer] Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

function buildAnalysisPrompt(page: any, issues: any[]): string {
  return `Analyze SEO issues for this page and provide fix recommendations:

Page URL: ${page.url}
Page Title: ${page.title || 'None'}
Path: ${page.path}

Issues Found:
${issues.map(i => `- ${i.title}: ${i.description}`).join('\n')}

For each issue, provide:
1. Priority (1-10, 10 = highest)
2. Confidence score (0-1)
3. Recommended fix
4. Expected impact on rankings
5. Specific action to take

Format as JSON array of recommendations.`;
}

async function analyzeWithNVIDIA(prompt: string, apiKey: string): Promise<any> {
  try {
    const response = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'meta/llama-3.1-70b-instruct',
        messages: [
          {
            role: 'system',
            content: 'You are an expert SEO analyst. Analyze issues and provide actionable recommendations with confidence scores.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.2,
        max_tokens: 2000,
      }),
    });

    const data = await response.json();
    const content = data.choices[0].message.content;
    
    // Parse JSON response
    const jsonMatch = content.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      return { recommendations: JSON.parse(jsonMatch[0]) };
    }

    throw new Error('Failed to parse AI response');
  } catch (error) {
    console.error('[AI Analyzer] NVIDIA API error:', error);
    throw error;
  }
}

function analyzeWithRules(page: any, issues: any[]): any {
  // Rule-based fallback when AI is not available
  const recommendations = issues.map(issue => {
    let priority = 5;
    let confidence = 0.8;
    let expectedImpact = { ranking: 0, traffic: 0 };

    // Prioritize by severity
    if (issue.severity === 'critical') {
      priority = 10;
      confidence = 1.0;
      expectedImpact = { ranking: 5, traffic: 10 };
    } else if (issue.severity === 'high') {
      priority = 8;
      confidence = 0.9;
      expectedImpact = { ranking: 3, traffic: 5 };
    } else if (issue.severity === 'medium') {
      priority = 5;
      confidence = 0.8;
      expectedImpact = { ranking: 2, traffic: 3 };
    } else {
      priority = 3;
      confidence = 0.7;
      expectedImpact = { ranking: 1, traffic: 1 };
    }

    return {
      issueType: issue.issue_type,
      title: `Fix ${issue.title}`,
      description: issue.description,
      priority,
      confidence,
      recommendedValue: issue.recommended_value,
      action: generateFixAction(issue),
      expectedImpact,
    };
  });

  return { recommendations };
}

function generateFixAction(issue: any): string {
  const actions: Record<string, string> = {
    missing_title: 'Generate SEO-optimized title based on page content and target keywords',
    title_length: 'Adjust title length to 50-60 characters while maintaining keyword relevance',
    missing_meta_description: 'Create compelling meta description highlighting key benefits',
    meta_description_length: 'Optimize meta description to 150-160 characters',
    missing_h1: 'Add H1 heading with primary keyword',
    missing_canonical: 'Add canonical tag pointing to this URL',
    missing_image_alt: 'Generate descriptive alt text for all images',
    thin_content: 'Expand content with relevant information, examples, and details',
    not_indexable: 'Review and remove noindex directive if page should be indexed',
  };

  return actions[issue.issue_type] || 'Manual review required';
}

function calculatePageScore(issues: any[]): number {
  let score = 100;

  for (const issue of issues) {
    if (issue.severity === 'critical') score -= 20;
    else if (issue.severity === 'high') score -= 10;
    else if (issue.severity === 'medium') score -= 5;
    else score -= 2;
  }

  return Math.max(0, Math.min(100, score));
}
