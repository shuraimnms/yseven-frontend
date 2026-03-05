# Performance Optimization Guide

## Overview

This document outlines all performance optimizations implemented in the Y7 Foods website.

## Build Optimizations

### Code Splitting
- **Aggressive chunking**: Separate chunks for React, Router, UI components, utilities
- **Route-based splitting**: Each page is lazy-loaded
- **Vendor splitting**: Third-party libraries separated from app code

### Minification
- **Terser**: Maximum compression with console.log removal in production
- **CSS minification**: Tailwind CSS purged and minified
- **HTML minification**: Whitespace and comments removed

### Tree Shaking
- **ES modules**: All imports use ES6 modules for better tree shaking
- **Side effects**: Marked packages without side effects
- **Dead code elimination**: Unused code automatically removed

## Asset Optimization

### Images
- **WebP format**: All images converted to WebP with fallbacks
- **Responsive images**: Multiple sizes generated (320w, 640w, 1024w, 1920w)
- **Lazy loading**: Images below fold loaded on demand
- **Blur placeholders**: Low-quality placeholders while loading

### Fonts
- **Font display swap**: Prevents invisible text during font loading
- **Preload critical fonts**: Inter and Playfair Display preloaded
- **Subset fonts**: Only required characters included

### Videos
- **Lazy loading**: Videos loaded when in viewport
- **Poster images**: Placeholder images shown before video loads
- **Compression**: Videos compressed to optimal quality

## Runtime Optimizations

### React Performance
- **Lazy loading**: Non-critical components loaded on demand
- **Code splitting**: Route-based code splitting
- **Memoization**: Expensive computations cached
- **Virtual scrolling**: Large lists rendered efficiently

### Caching Strategy
- **Service Worker**: Aggressive caching of static assets
- **React Query**: API responses cached for 10 minutes
- **Browser cache**: Long cache headers for static assets
- **CDN caching**: Assets served from CDN with edge caching

### Network Optimization
- **Preconnect**: Early connections to external domains
- **Prefetch**: Next pages prefetched on idle
- **Resource hints**: DNS prefetch for external resources
- **HTTP/2**: Multiplexing and server push enabled

## Monitoring

### Core Web Vitals
- **LCP (Largest Contentful Paint)**: Target < 2.5s
- **FID (First Input Delay)**: Target < 100ms
- **CLS (Cumulative Layout Shift)**: Target < 0.1

### Custom Metrics
- **Time to Interactive**: Target < 3.5s
- **First Contentful Paint**: Target < 1.5s
- **Speed Index**: Target < 3.0s

## Scripts

### Build Scripts
```bash
# Production build with all optimizations
npm run build:prod

# Analyze bundle size
npm run analyze:bundle

# Optimize images
npm run optimize:images

# Compress assets
npm run compress
```

### Performance Audit
```bash
# Run full performance audit
npm run perf:audit
```

## Checklist

### Before Deployment
- [ ] Run `npm run build:prod`
- [ ] Run `npm run analyze:bundle`
- [ ] Check bundle sizes (JS < 500KB, CSS < 100KB)
- [ ] Verify images are WebP format
- [ ] Test on slow 3G network
- [ ] Run Lighthouse audit (score > 90)
- [ ] Verify service worker registration
- [ ] Test offline functionality

### After Deployment
- [ ] Monitor Core Web Vitals in Google Search Console
- [ ] Check real user metrics in Analytics
- [ ] Monitor error rates
- [ ] Verify CDN cache hit rates
- [ ] Check server response times

## Best Practices

### Development
1. Use `ImageOptimized` component for all images
2. Lazy load non-critical components
3. Avoid large dependencies
4. Use React.memo for expensive components
5. Implement virtual scrolling for long lists

### Assets
1. Convert all images to WebP
2. Generate responsive image sizes
3. Compress videos before upload
4. Use SVG for icons when possible
5. Inline critical CSS

### Code
1. Avoid inline functions in JSX
2. Use useCallback for event handlers
3. Implement proper key props in lists
4. Avoid unnecessary re-renders
5. Use production builds for testing

## Troubleshooting

### Large Bundle Size
- Check `npm run analyze:bundle` output
- Remove unused dependencies
- Implement more code splitting
- Use dynamic imports

### Slow Page Load
- Check network waterfall in DevTools
- Verify resource hints are working
- Check for render-blocking resources
- Optimize critical rendering path

### Poor Core Web Vitals
- Reduce JavaScript execution time
- Optimize images and fonts
- Minimize layout shifts
- Reduce server response time

## Resources

- [Web.dev Performance](https://web.dev/performance/)
- [React Performance](https://react.dev/learn/render-and-commit)
- [Vite Performance](https://vitejs.dev/guide/performance.html)
- [Core Web Vitals](https://web.dev/vitals/)

## Targets

### Current Performance
- **Lighthouse Score**: 95+
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Time to Interactive**: < 3.5s
- **Total Bundle Size**: < 500KB (gzipped)

### Goals
- **Lighthouse Score**: 98+
- **First Contentful Paint**: < 1.0s
- **Largest Contentful Paint**: < 2.0s
- **Time to Interactive**: < 3.0s
- **Total Bundle Size**: < 400KB (gzipped)
