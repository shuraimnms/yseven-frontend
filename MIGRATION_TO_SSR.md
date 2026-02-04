# Migration to Server-Side Rendering (SSR/SSG)

## The Problem
Your current Vite + React setup is **Client-Side Rendered (CSR)**, meaning:
- HTML is empty until JavaScript loads
- Search engines see minimal content
- Poor SEO performance despite meta tag optimizations

## Solutions to Fix SSR/SSG Problem

### Option 1: Migrate to Next.js (Recommended)

Next.js provides built-in SSR/SSG with minimal configuration changes.

#### Migration Steps:

1. **Install Next.js**
```bash
npm install next react react-dom
npm install -D @types/node
```

2. **Update package.json**
```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "export": "next export"
  }
}
```

3. **Create Next.js Configuration**
```javascript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // For static export
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  experimental: {
    appDir: true
  }
}

module.exports = nextConfig
```

4. **Convert Pages to Next.js Structure**
```
pages/
├── index.tsx          # Home page
├── about.tsx          # About page
├── products/
│   ├── index.tsx      # Products listing
│   └── [slug].tsx     # Dynamic product pages
├── blog/
│   ├── index.tsx      # Blog listing
│   └── [slug].tsx     # Dynamic blog posts
└── _app.tsx           # App wrapper
```

5. **Example Static Generation**
```typescript
// pages/products/[slug].tsx
import { GetStaticProps, GetStaticPaths } from 'next';

export const getStaticPaths: GetStaticPaths = async () => {
  // Fetch all product slugs
  const products = await fetchProducts();
  const paths = products.map((product) => ({
    params: { slug: product.slug }
  }));

  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const product = await fetchProduct(params?.slug);
  
  return {
    props: { product },
    revalidate: 3600 // Regenerate every hour
  };
};

export default function ProductPage({ product }) {
  return (
    <>
      <Head>
        <title>{product.name} | Y7 Sauces</title>
        <meta name="description" content={product.description} />
      </Head>
      {/* Product content */}
    </>
  );
}
```

### Option 2: Add Vite SSR Plugin

Keep Vite but add SSR capabilities.

#### Implementation:

1. **Install Vite SSR**
```bash
npm install -D vite-plugin-ssr
```

2. **Update vite.config.ts**
```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { ssr } from 'vite-plugin-ssr/plugin';

export default defineConfig({
  plugins: [
    react(),
    ssr({ prerender: true })
  ],
  // ... rest of config
});
```

3. **Create SSR Entry Points**
```typescript
// src/pages/index/index.page.tsx
export { Page };

function Page() {
  return (
    <>
      <h1>Y7 Premium Sauces</h1>
      <p>One Brand. Endless Flavor.</p>
    </>
  );
}

// src/pages/index/index.page.server.ts
export { onBeforeRender };

async function onBeforeRender() {
  const pageProps = {
    title: 'Y7 Premium Sauces | One Brand. Endless Flavor',
    description: 'Premium sauces crafted for bold kitchens worldwide.'
  };
  return {
    pageContext: {
      pageProps
    }
  };
}
```

### Option 3: Prerendering with Puppeteer

Generate static HTML files at build time.

#### Implementation:

1. **Install Dependencies**
```bash
npm install -D puppeteer prerender-spa-plugin
```

2. **Create Prerender Script**
```javascript
// scripts/prerender.js
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const routes = [
  '/',
  '/about',
  '/products',
  '/shop',
  '/contact',
  '/hot-sauces',
  '/mayonnaise',
  '/international',
  '/bbq-sauces'
];

async function prerenderRoutes() {
  const browser = await puppeteer.launch();
  
  for (const route of routes) {
    const page = await browser.newPage();
    await page.goto(`http://localhost:8080${route}`, {
      waitUntil: 'networkidle0'
    });
    
    const html = await page.content();
    const filePath = path.join(__dirname, '../dist', route === '/' ? 'index.html' : `${route}/index.html`);
    
    // Ensure directory exists
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    fs.writeFileSync(filePath, html);
    console.log(`✅ Prerendered: ${route}`);
  }
  
  await browser.close();
}

prerenderRoutes().catch(console.error);
```

3. **Update Build Process**
```json
{
  "scripts": {
    "build": "vite build && node scripts/prerender.js"
  }
}
```

### Option 4: Use Astro (Modern SSG)

Astro is designed for content-heavy sites with excellent SEO.

#### Migration to Astro:

1. **Install Astro**
```bash
npm create astro@latest y7-astro
cd y7-astro
npm install @astrojs/react @astrojs/tailwind
```

2. **Astro Configuration**
```javascript
// astro.config.mjs
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  integrations: [react(), tailwind()],
  output: 'static',
  site: 'https://ysevenfoods.com'
});
```

3. **Astro Pages**
```astro
---
// src/pages/index.astro
export const prerender = true;

const seoData = {
  title: 'Y7 Premium Sauces | One Brand. Endless Flavor',
  description: 'Premium sauces crafted for bold kitchens worldwide.'
};
---

<html lang="en">
  <head>
    <title>{seoData.title}</title>
    <meta name="description" content={seoData.description} />
    <!-- All your SEO meta tags -->
  </head>
  <body>
    <h1>Y7 Premium Sauces</h1>
    <p>One Brand. Endless Flavor.</p>
    <!-- React components can be used here -->
  </body>
</html>
```

## Immediate Quick Fix (Without Migration)

If you can't migrate immediately, here's a **quick fix** for your current setup:

### Enhanced Prerendering Script

```javascript
// scripts/generate-static-pages.js
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const routes = [
  { path: '/', title: 'Y7 Premium Sauces | One Brand. Endless Flavor', description: 'Premium sauces crafted for bold kitchens worldwide.' },
  { path: '/about', title: 'About Y7 Sauces', description: 'Learn about Y7 Sauces premium global condiment brand story.' },
  { path: '/products', title: 'Premium Sauce Products', description: 'Explore Y7\'s complete range of premium sauces & condiments.' }
];

async function generateStaticPages() {
  for (const route of routes) {
    const staticHTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${route.title}</title>
  <meta name="description" content="${route.description}">
  <meta name="robots" content="index, follow">
  <!-- All your enhanced meta tags -->
</head>
<body>
  <div id="static-content">
    <h1>${route.title}</h1>
    <p>${route.description}</p>
    <!-- Static content for crawlers -->
  </div>
  
  <div id="root"></div>
  <script>
    // Hide static content when React loads
    document.addEventListener('DOMContentLoaded', function() {
      const staticContent = document.getElementById('static-content');
      if (staticContent) staticContent.style.display = 'none';
    });
  </script>
  <script type="module" src="/src/main.tsx"></script>
</body>
</html>`;

    const filePath = route.path === '/' ? 'index.html' : `${route.path.slice(1)}.html`;
    fs.writeFileSync(path.join(__dirname, '../dist', filePath), staticHTML);
    console.log(`✅ Generated: ${filePath}`);
  }
}

generateStaticPages();
```

## Recommendation

**For Y7 Sauces, I recommend Option 1 (Next.js migration)** because:

1. ✅ **Minimal code changes** - Most React components work as-is
2. ✅ **Built-in SSG/SSR** - Perfect for e-commerce
3. ✅ **Excellent SEO** - Pre-rendered HTML for all pages
4. ✅ **Performance** - Automatic optimizations
5. ✅ **Vercel deployment** - Seamless hosting (you're already using Vercel)

Would you like me to help you implement any of these solutions?