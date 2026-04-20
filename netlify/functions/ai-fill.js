/**
 * Netlify Serverless Function — NVIDIA NIM proxy
 * Deployed automatically with the frontend. No CORS issues.
 *
 * Set env var in Netlify Dashboard → Site Settings → Environment Variables:
 *   NVIDIA_API_KEY = nvapi-xxxx
 *
 * Local dev: add to yseven-frontend/.env
 *   NVIDIA_API_KEY=nvapi-xxxx  (no VITE_ prefix — server-side only)
 */

const NVIDIA_URL = 'https://integrate.api.nvidia.com/v1/chat/completions';

exports.handler = async (event) => {
  const CORS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: CORS, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers: CORS, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  const apiKey = process.env.NVIDIA_API_KEY;
  if (!apiKey) {
    return {
      statusCode: 503,
      headers: { ...CORS, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        error: 'NVIDIA_API_KEY not set',
        hint: 'Add NVIDIA_API_KEY in Netlify Dashboard → Site Settings → Environment Variables',
      }),
    };
  }

  try {
    const body = JSON.parse(event.body || '{}');

    const res = await fetch(NVIDIA_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    return {
      statusCode: res.status,
      headers: { ...CORS, 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: { ...CORS, 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: err.message }),
    };
  }
};
