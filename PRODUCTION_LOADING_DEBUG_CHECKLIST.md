# Production Infinite Loader Debug Checklist (React + Vite)

## Why this repo is highly likely to fail only in production

### 1) API base URL fallback points to localhost in production
`getApiBaseUrl()` falls back to `http://localhost:4000/api/v1` when `VITE_API_BASE_URL` is missing. In production browsers, that points to each visitor's own machine, so all API requests fail. Locally this works, which matches your symptom pattern.

File: `src/utils/apiUtils.ts`

### 2) Service worker is always registered and can serve stale assets
The app always registers `/sw-ultra.js` at startup. If deployment invalidation is incomplete or HTML/js hashes drift, users can get old cached HTML that references missing chunks, resulting in loader/blank app behavior.

Files: `src/main.tsx`, `src/utils/performance.ts`, `public/sw-ultra.js`

### 3) Settings fetch runs aggressively and can mask deployment/API failures
Settings are force-fetched on mount and every 30 seconds. If API base URL is wrong or API returns HTML/error payloads, app logic may keep retrying and degrade initial render behavior.

Files: `src/components/providers/SettingsProvider.tsx`, `src/store/settingsStore.ts`

---

## Ordered debugging flow (do this exactly)

### Step 1 — Verify static shell loads
In DevTools -> Network (Disable cache + Preserve log), hard refresh.

Check:
- `index.html` loads with status 200.
- Main JS entry (from `index.html`) loads with status 200.
- Any `*.js`/`*.css` with status 404/403 indicates wrong deployed folder, stale index, or bad cache.

### Step 2 — Confirm whether API calls are trying localhost
In Network, filter by `Fetch/XHR` and inspect request URLs.

If you see requests like:
- `http://localhost:4000/api/v1/...`

Then root cause is missing `VITE_API_BASE_URL` at build time.

### Step 3 — Validate content-type of API responses
Open one failing API request -> Response headers.

If `content-type: text/html` instead of JSON, the frontend is likely hitting:
- wrong host/path
- frontend server fallback route
- misconfigured reverse proxy

### Step 4 — Rule out service worker cache poisoning
In DevTools -> Application:
1. Service Workers -> Unregister all
2. Clear storage -> Clear site data
3. Hard reload

If app starts working after this, your deploy has stale SW/cache invalidation issues.

### Step 5 — Check router rewrite behavior
Direct-open a non-root route (e.g. `/about`) in new tab.

If you get 404 from host/CDN, rewrites are missing for SPA fallback. Configure host rewrites to `/index.html`.

### Step 6 — Confirm base path/chunk URL correctness
In Elements, inspect script tags in `index.html` and chunk URLs in Network.

If app is served from subpath but chunk requests start with `/assets/...`, fix Vite `base` to subpath and rebuild.

---

## Exact build/deploy fixes

### A) Missing environment variable (most likely in this repo)
Set at build environment:

```bash
VITE_API_BASE_URL=https://<your-api-domain>/api/v1
```

Example `.env.production`:

```env
VITE_API_BASE_URL=https://api.ysevenfoods.com/api/v1
VITE_GA_TRACKING_ID=...
VITE_GTM_ID=...
```

Then rebuild and redeploy:

```bash
npm ci
npm run build
```

### B) Wrong folder deployed
For Vite, deploy only `dist/` output.

Build command:

```bash
npm run build
```

Publish directory must be:

```text
dist
```

### C) API still pointing to localhost
Audit final bundle after build:

```bash
npm run build
rg "localhost:4000|VITE_API_BASE_URL" dist -n
```

If localhost appears in `dist`, production env variable was not injected at build time.

### D) Incorrect base path
If hosted at domain root, keep:

```ts
base: '/'
```

If hosted at subpath (e.g. `/app/`), set:

```ts
base: '/app/'
```

Then rebuild + redeploy.

### E) Asset loading failures
Validate all chunk URLs return 200 and correct content-type (`application/javascript`, `text/css`).

If using CDN/proxy, ensure:
- no HTML fallback for JS chunk requests
- brotli/gzip files served with proper `content-encoding`

### F) SPA routing misconfiguration
Examples:

Netlify (`public/_redirects`):

```text
/* /index.html 200
```

Vercel (`vercel.json`):

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

Nginx:

```nginx
location / {
  try_files $uri $uri/ /index.html;
}
```

---

## Quick triage decision tree

1. JS/CSS chunks 404? -> wrong deploy artifact or stale SW/cache.
2. Fetch/XHR goes to localhost? -> missing `VITE_API_BASE_URL` in production build.
3. API returns HTML not JSON? -> wrong API URL or proxy route.
4. Only deep links fail? -> missing SPA rewrites.
5. Works after SW clear? -> cache invalidation / service worker strategy bug.

