/**
 * AI Product Auto-Fill — NVIDIA NIM via Supabase Edge Function
 *
 * Architecture: Browser → Supabase Edge Function → NVIDIA NIM
 * No CORS. No backend. Pure frontend + Supabase.
 *
 * SETUP (one time, 2 minutes):
 * 1. Go to: https://supabase.com/dashboard/project/jegiuiwyykhptzhmuiab/functions
 * 2. Click "Deploy a new function" → name: ai-product-fill
 * 3. Paste the code from: supabase/functions/ai-product-fill/index.ts
 * 4. Click Deploy
 * 5. Go to the function → Secrets tab → Add secret:
 *    Name: NVIDIA_API_KEY
 *    Value: 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
 */

export interface AIProductData {
  name: string;
  tagline: string;
  description: string;
  ingredients: string;
  benefits: string[];
  features: string[];
  perfect_for: string[];
}

const MODEL = 'meta/llama-3.1-70b-instruct';

// Supabase Edge Function URL
const EDGE_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-product-fill`;

export async function aiGenerateProduct(
  productName: string,
  userPrompt: string,
  category: string
): Promise<AIProductData> {
  const systemPrompt = `You are a professional food product copywriter for Y7 Foods, a premium Indian food brand.
Generate compelling, accurate product details for food products.
Always respond with ONLY valid JSON — no markdown, no explanation, just the JSON object.`;

  const userMessage = `Generate complete product details for this food product:

Product Name: ${productName}
Category: ${category || 'Food Product'}
Additional context: ${userPrompt || 'Premium quality food product'}

Return ONLY this JSON (no markdown, no extra text):
{
  "name": "${productName}",
  "tagline": "short catchy tagline under 10 words",
  "description": "2-3 sentence product description highlighting quality and taste",
  "ingredients": "comma-separated list of main ingredients",
  "benefits": ["benefit 1", "benefit 2", "benefit 3", "benefit 4"],
  "features": ["feature 1", "feature 2", "feature 3"],
  "perfect_for": ["use case 1", "use case 2", "use case 3", "use case 4"]
}`;

  const response = await fetch(EDGE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage },
      ],
      temperature: 0.7,
      max_tokens: 600,
      stream: false,
    }),
  });

  // Edge function not deployed yet
  if (response.status === 404) {
    throw new Error(
      'Edge function not deployed yet.\n\n' +
      'Steps:\n' +
      '1. Go to supabase.com/dashboard/project/jegiuiwyykhptzhmuiab/functions\n' +
      '2. Click "Deploy a new function" → name: ai-product-fill\n' +
      '3. Paste code from: supabase/functions/ai-product-fill/index.ts\n' +
      '4. Add secret: NVIDIA_API_KEY = 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'
    );
  }

  const result = await response.json();

  if (!response.ok || !result.success) {
    const msg = result.message || `Error ${response.status}`;
    if (msg.includes('NVIDIA_API_KEY')) {
      throw new Error('NVIDIA_API_KEY not set in edge function secrets.\nGo to: Supabase Dashboard → Functions → ai-product-fill → Secrets');
    }
    if (result.status === 403) {
      throw new Error(
        'NVIDIA API key permission error (403).\n' +
        'Fix: Go to build.nvidia.com → your key → enable "Public API Endpoints" permission.\n' +
        'Or generate a new key — new keys have this enabled by default.'
      );
    }
    throw new Error(msg);
  }

  const content: string = result.data?.choices?.[0]?.message?.content || '';
  const jsonMatch = content.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error('AI returned unexpected response. Try again.');

  try {
    const parsed = JSON.parse(jsonMatch[0]) as AIProductData;
    parsed.benefits    = Array.isArray(parsed.benefits)    ? parsed.benefits    : [];
    parsed.features    = Array.isArray(parsed.features)    ? parsed.features    : [];
    parsed.perfect_for = Array.isArray(parsed.perfect_for) ? parsed.perfect_for : [];
    return parsed;
  } catch {
    throw new Error('AI returned malformed JSON. Try again.');
  }
}
