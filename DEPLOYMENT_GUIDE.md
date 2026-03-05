# 🚀 Deployment Guide - Fix Loading Issues

## Problem
After deployment, the site shows a blank page or doesn't load, even though there are no console errors. This is caused by aggressive service worker caching.

## Solution

### Option 1: Use Deployment Script (Recommended)
```bash
# Run the deployment script
deploy.bat

# This will:
# 1. Clean old build
# 2. Auto-increment service worker version
# 3. Build fresh production bundle
# 4. Prepare for deployment
```

### Option 2: Manual Deployment
```bash
# 1. Clean old build
rmdir /s /q dist

# 2. Increment CACHE_VERSION in public/sw-ultra.js
# Change: const CACHE_VERSION = 'v2';
# To:     const CACHE_VERSION = 'v3';

# 3. Build
npm run build

# 4. Deploy dist/ folder
```

## Important: After Deployment

### Clear Browser Cache
Users need to clear their cache to see the new version:

1. **Hard Refresh:**
   - Windows: `Ctrl + Shift + R` or `Ctrl + F5`
   - Mac: `Cmd + Shift + R`

2. **Clear Service Worker:**
   - Open DevTools (F12)
   - Go to Application tab
   - Click "Service Workers"
   - Click "Unregister" for ysevenfoods.com
   - Refresh page

3. **Clear All Cache:**
   - Open DevTools (F12)
   - Go to Application tab
   - Click "Clear storage"
   - Check all boxes
   - Click "Clear site data"
   - Refresh page

### For All Users (Automatic)
The updated service worker will:
- Auto-detect new version
- Clear old caches
- Reload page automatically
- This happens within 60 seconds of visiting

## Hosting Provider Cache

If using hosting with CDN/cache:

### Vercel
```bash
# Clear cache
vercel --prod --force
```

### Netlify
```bash
# Clear cache
netlify deploy --prod --clear-cache
```

### Cloudflare
1. Go to Cloudflare dashboard
2. Click "Caching"
3. Click "Purge Everything"

### Other Hosting
Check your hosting provider's documentation for cache clearing.

## Verification Checklist

After deployment, verify:

- [ ] Open site in incognito/private window
- [ ] Check console for SW version log
- [ ] Verify all pages load correctly
- [ ] Test navigation between pages
- [ ] Check images load properly
- [ ] Test on mobile device

## Troubleshooting

### Still Not Loading?

1. **Check Console:**
   ```
   F12 → Console tab
   Look for errors or SW logs
   ```

2. **Check Network:**
   ```
   F12 → Network tab
   Refresh page
   Look for 404 or failed requests
   ```

3. **Verify Files Uploaded:**
   - Check all files in dist/ are on server
   - Verify file paths are correct
   - Check .htaccess or server config

4. **Force Service Worker Update:**
   ```javascript
   // In browser console:
   navigator.serviceWorker.getRegistrations().then(registrations => {
     registrations.forEach(reg => reg.unregister());
   });
   location.reload();
   ```

## Prevention

To avoid this in future:

1. **Always use deploy.bat script**
2. **Increment CACHE_VERSION on each deploy**
3. **Test in incognito before announcing**
4. **Clear CDN cache after deploy**

## Current Service Worker Version

Check `public/sw-ultra.js`:
```javascript
const CACHE_VERSION = 'v2'; // Current version
```

Increment this number on each deployment!

## Need Help?

If issues persist:
1. Check browser console for errors
2. Verify all dist/ files uploaded correctly
3. Clear ALL caches (browser + CDN + hosting)
4. Test in multiple browsers
5. Check server configuration for SPA routing
