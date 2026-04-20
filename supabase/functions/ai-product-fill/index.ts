// Supabase Edge Function — NVIDIA NIM proxy
// No CORS issues. Runs on Supabase servers.
//
// HOW TO DEPLOY (no CLI needed):
// 1. Go to https://supabase.com/dashboard/project/jegiuiwyykhptzhmuiab/functions
// 2. Click "Deploy a new function"
// 3. Name it: ai-product-fill
// 4. Paste this entire file
// 5. Click Deploy
// 6. Go to Settings → Secrets → Add: NVIDIA_API_KEY = nvapi-xxx

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, content-type, x-client-info, apikey",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: CORS });
  }

  try {
    const apiKey = Deno.env.get("NVIDIA_API_KEY");

    if (!apiKey) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "NVIDIA_API_KEY not set. Go to Supabase Dashboard → Edge Functions → ai-product-fill → Secrets → Add NVIDIA_API_KEY"
        }),
        { status: 503, headers: { ...CORS, "Content-Type": "application/json" } }
      );
    }

    const body = await req.json();

    const res = await fetch("https://integrate.api.nvidia.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    return new Response(
      JSON.stringify({ success: res.ok, data, status: res.status }),
      {
        status: res.ok ? 200 : res.status,
        headers: { ...CORS, "Content-Type": "application/json" }
      }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ success: false, message: String(err) }),
      { status: 500, headers: { ...CORS, "Content-Type": "application/json" } }
    );
  }
});
