# Deployment Guide

## Production Build
```bash
# Create production build
npm run build

# Preview production build locally
npm run preview
```

## Environment Setup
Create `.env.production` with production values:
```env
VITE_API_URL=https://your-api-domain.com
VITE_RAZORPAY_KEY_ID=your_production_key
```

## Netlify Deployment
1. Connect repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Add environment variables in Netlify dashboard
5. Configure redirects in `netlify.toml`

## Vercel Deployment
1. Connect repository to Vercel
2. Framework preset: Vite
3. Build command: `npm run build`
4. Output directory: `dist`
5. Add environment variables in Vercel dashboard

## Performance Optimization
- Images are optimized and served in modern formats
- Code splitting implemented via React.lazy()
- Bundle analysis available via `npm run build -- --analyze`
- SEO meta tags configured for all routes

## Monitoring
- Error tracking via browser console
- Performance monitoring via Web Vitals
- SEO monitoring via structured data