# Vercel Cache Issue - Immediate Fix Required

## Current Problem
Vercel is serving **OLD cached files** even after new deployment:
- Browser requests: `/js/Products-pdX3m8L7.js` (OLD hash)
- Local build has: `/js/Products-DORy1Ss7.js` (NEW hash)
- This causes MIME type error because old file doesn't exist

## IMMEDIATE ACTIONS REQUIRED

### Option 1: Force Redeploy in Vercel Dashboard (RECOMMENDED)

1. **Go to Vercel Dashboard:**
   - Visit: https://vercel.com/dashboard
   - Login with your account
   - Find your project: `yseven-frontend`

2. **Trigger Fresh Deployment:**
   - Click on "Deployments" tab
   - Find the latest deployment
   - Click the three dots menu (⋯) on the right
   - Select **"Redeploy"**
   - **IMPORTANT:** Uncheck "Use existing Build Cache"
   - Click "Redeploy" button

3. **Wait for Deployment:**
   - Watch the deployment progress (1-2 minutes)
   - Wait for "Ready" status
   - Note the deployment URL

4. **Purge CDN Cache:**
   - After deployment completes
   - Go to Project Settings → General
   - Scroll to "Deployment Protection"
   - Click "Purge Cache" if available

### Option 2: Use Vercel CLI (FASTEST)

```bash
# Install Vercel CLI globally
npm install -g vercel

# Login to Vercel
vercel login

# Navigate to project
cd yseven-frontend

# Force production deployment without cache
vercel --prod --force

# This will:
# - Skip build cache
# - Deploy fresh build
# - Purge CDN cache automatically
```

### Option 3: Delete and Reconnect Project (NUCLEAR OPTION)

If the above don't work:

1. Go to Vercel Dashboard
2. Project Settings → General
3. Scroll to bottom → "Delete Project"
4. Reconnect from GitHub:
   - New Project → Import from GitHub
   - Select `yseven-frontend` repository
   - Framework: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Deploy

## Why This Happens

### Vercel's Caching Layers:
1. **Build Cache** - Caches node_modules and build artifacts
2. **CDN Cache** - Caches deployed files globally
3. **Browser Cache** - Your browser caches files locally

### The Problem:
- Old `index.html` is cached in CDN
- Old `index.html` references old JS files (with old hashes)
- New JS files have new hashes
- Browser tries to load old hash → 404 → Gets HTML instead → MIME error

## Verify Deployment

After redeploying, check these:

### 1. Check Vercel Deployment URL
```
https://yseven-frontend-[random].vercel.app
```
- Visit the deployment URL directly (not your custom domain)
- Check if it works there
- If YES → Custom domain cache issue
- If NO → Build configuration issue

### 2. Check index.html
Visit: `https://ysevenfoods.com/index.html`
- View source (Ctrl+U)
- Find the script tag: `<script type="module" crossorigin src="/js/index-...`
- Note the hash in the filename
- Should be: `index-DqZh0pMZ.js` (current build)

### 3. Check JS File Directly
Visit: `https://ysevenfoods.com/js/index-DqZh0pMZ.js`
- Should show JavaScript code
- Should NOT show HTML
- Response headers should include:
  - `Content-Type: application/javascript`
  - `Cache-Control: public, max-age=31536000, immutable`

### 4. Test Navigation
- Visit: `https://ysevenfoods.com`
- Open DevTools Console (F12)
- Click "Products"
- Should load without MIME type error

## Browser Cache Clearing

After Vercel deployment completes:

### Chrome/Edge:
1. Open DevTools (F12)
2. Right-click the refresh button
3. Select "Empty Cache and Hard Reload"

OR

1. Press `Ctrl + Shift + Delete`
2. Select "Cached images and files"
3. Time range: "All time"
4. Click "Clear data"

### Firefox:
1. Press `Ctrl + Shift + Delete`
2. Select "Cache"
3. Time range: "Everything"
4. Click "Clear Now"

## Custom Domain Issues

If the Vercel deployment URL works but your custom domain doesn't:

### Check DNS/CDN:
1. Go to Vercel Dashboard → Project → Domains
2. Check domain status
3. If using Cloudflare or other CDN:
   - Login to Cloudflare
   - Go to Caching → Configuration
   - Click "Purge Everything"

### Verify Domain Configuration:
```bash
# Check DNS
nslookup ysevenfoods.com

# Check if pointing to Vercel
# Should show Vercel's IP addresses
```

## Configuration Files to Verify

### vercel.json (Current - Should be correct)
```json
{
  "rewrites": [
    {
      "source": "/((?!js/|css/|images/|assets/|.*\\..*).*)",
      "destination": "/index.html"
    }
  ]
}
```

### package.json - Build Script
```json
{
  "scripts": {
    "build": "node scripts/generate-seo.js && vite build"
  }
}
```

## Emergency Workaround

If nothing works, temporarily disable code splitting:

### vite.config.ts
```typescript
build: {
  rollupOptions: {
    output: {
      manualChunks: undefined, // Disable code splitting temporarily
    }
  }
}
```

Then rebuild and redeploy. This creates one large JS file instead of chunks.

## Contact Vercel Support

If issue persists after all attempts:

1. Go to: https://vercel.com/support
2. Provide:
   - Project name: `yseven-frontend`
   - Issue: "CDN serving old cached files after deployment"
   - Deployment ID: (from dashboard)
   - Error: "MIME type text/html instead of application/javascript"

## Success Checklist

- [ ] Vercel deployment shows "Ready" status
- [ ] Deployment URL works correctly
- [ ] Custom domain loads without errors
- [ ] DevTools Console shows no MIME type errors
- [ ] Navigation between pages works without refresh
- [ ] Direct URL access works (e.g., /products)
- [ ] Hard refresh works (Ctrl+Shift+R)

## Timeline

- **Push to GitHub:** Completed ✓
- **Vercel Auto-Deploy:** 1-2 minutes
- **CDN Propagation:** 5-10 minutes
- **Full Global Propagation:** Up to 1 hour

**Current Status:** Waiting for Vercel to deploy the latest push.

Check deployment status at: https://vercel.com/dashboard
