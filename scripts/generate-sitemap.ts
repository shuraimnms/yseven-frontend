/**
 * AUTOMATIC SITEMAP GENERATOR
 * Pulls all products and categories from Supabase and generates sitemap.xml
 * Run: npx tsx scripts/generate-sitemap.ts
 */

import { createClient } from '@supabase/supabase-js';
import { writeFileSync } from 'fs';
import { resolve } from 'path';
import * as dotenv from 'dotenv';

dotenv.config();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || '';

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

interface SitemapURL {
  loc: string;
  lastmod: string;
  changefreq: string;
  priority: string;
}

async function generateSitemap() {
  console.log('🚀 Generating sitemap from Supabase...\n');

  const urls: SitemapURL[] = [];
  const today = new Date().toISOString().split('T')[0];

  // Static pages
  const staticPages = [
    { loc: '/', priority: '1.0', changefreq: 'daily' },
    { loc: '/about', priority: '0.9', changefreq: 'monthly' },
    { loc: '/products', priority: '0.9', changefreq: 'daily' },
    { loc: '/shop', priority: '0.9', changefreq: 'daily' },
    { loc: '/contact', priority: '0.7', changefreq: 'monthly' },
    { loc: '/faq', priority: '0.6', changefreq: 'monthly' },
    { loc: '/bulk-orders', priority: '0.7', changefreq: 'monthly' },
    { loc: '/certifications', priority: '0.6', changefreq: 'monthly' },
    { loc: '/quality', priority: '0.6', changefreq: 'monthly' },
    { loc: '/privacy', priority: '0.3', changefreq: 'yearly' },
    { loc: '/terms', priority: '0.3', changefreq: 'yearly' },
    { loc: '/refund', priority: '0.4', changefreq: 'monthly' },
    { loc: '/shipping', priority: '0.4', changefreq: 'monthly' },
  ];

  staticPages.forEach(page => {
    urls.push({
      loc: `https://ysevenfoods.com${page.loc}`,
      lastmod: today,
      changefreq: page.changefreq,
      priority: page.priority,
    });
  });

  console.log(`✅ Added ${staticPages.length} static pages`);

  // Fetch categories from Supabase
  const { data: categories, error: catError } = await supabase
    .from('categories')
    .select('slug, created_at')
    .eq('status', 'active');

  if (catError) {
    console.error('⚠️  Category fetch error:', catError.message);
  } else if (categories && categories.length > 0) {
    categories.forEach(cat => {
      urls.push({
        loc: `https://ysevenfoods.com/categories/${cat.slug}`,
        lastmod: cat.created_at?.split('T')[0] || today,
        changefreq: 'weekly',
        priority: '0.8',
      });
    });
    console.log(`✅ Added ${categories.length} categories`);
  }

  // Fetch products from Supabase
  const { data: products, error: prodError } = await supabase
    .from('products')
    .select('slug, created_at')
    .eq('status', 'active');

  if (prodError) {
    console.error('⚠️  Product fetch error:', prodError.message);
  } else if (products && products.length > 0) {
    products.forEach(prod => {
      urls.push({
        loc: `https://ysevenfoods.com/products/${prod.slug}`,
        lastmod: prod.created_at?.split('T')[0] || today,
        changefreq: 'weekly',
        priority: '0.8',
      });
    });
    console.log(`✅ Added ${products.length} products`);
  }

  // Generate XML
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urls.map(url => `  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  // Write to file
  const outputPath = resolve(process.cwd(), 'public', 'sitemap.xml');
  writeFileSync(outputPath, xml, 'utf-8');

  console.log(`\n✅ Sitemap generated: ${outputPath}`);
  console.log(`📊 Total URLs: ${urls.length}`);
  console.log('\n🎯 Next steps:');
  console.log('   1. Deploy to production');
  console.log('   2. Submit to Google Search Console');
  console.log('   3. Sitemap URL: https://ysevenfoods.com/sitemap.xml\n');
}

generateSitemap().catch(err => {
  console.error('❌ Error:', err);
  process.exit(1);
});
