#!/usr/bin/env node

/**
 * SEO Generation Script
 * Generates sitemaps, robots.txt, and other SEO assets at build time
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const config = {
  siteUrl: 'https://ysevenfoods.com',
  outputDir: path.join(__dirname, '../public'),
  currentDate: new Date().toISOString().split('T')[0]
};

// Static routes with their priorities and change frequencies
const staticRoutes = [
  { loc: '/', priority: 1.0, changefreq: 'daily' },
  { loc: '/about', priority: 0.8, changefreq: 'monthly' },
  { loc: '/products', priority: 0.9, changefreq: 'daily' },
  { loc: '/shop', priority: 0.9, changefreq: 'daily' },
  { loc: '/blog', priority: 0.8, changefreq: 'daily' },
  { loc: '/recipes', priority: 0.7, changefreq: 'weekly' },
  { loc: '/contact', priority: 0.7, changefreq: 'monthly' },
  { loc: '/hot-sauces', priority: 0.8, changefreq: 'weekly' },
  { loc: '/mayonnaise', priority: 0.8, changefreq: 'weekly' },
  { loc: '/international', priority: 0.8, changefreq: 'weekly' },
  { loc: '/bbq-sauces', priority: 0.8, changefreq: 'weekly' },
  { loc: '/bulk-orders', priority: 0.6, changefreq: 'monthly' },
  { loc: '/export', priority: 0.6, changefreq: 'monthly' },
  { loc: '/certifications', priority: 0.6, changefreq: 'monthly' },
  { loc: '/quality', priority: 0.6, changefreq: 'monthly' },
  { loc: '/faq', priority: 0.5, changefreq: 'monthly' },
  { loc: '/careers', priority: 0.4, changefreq: 'monthly' },
  { loc: '/press', priority: 0.4, changefreq: 'monthly' },
  { loc: '/partnerships', priority: 0.5, changefreq: 'monthly' },
  { loc: '/privacy', priority: 0.3, changefreq: 'yearly' },
  { loc: '/terms', priority: 0.3, changefreq: 'yearly' },
  { loc: '/refund', priority: 0.4, changefreq: 'monthly' },
  { loc: '/shipping', priority: 0.4, changefreq: 'monthly' }
];

// Generate main sitemap
function generateSitemap() {
  const urls = staticRoutes.map(route => `  <url>
    <loc>${config.siteUrl}${route.loc}</loc>
    <lastmod>${config.currentDate}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`).join('\n');

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

  fs.writeFileSync(path.join(config.outputDir, 'sitemap.xml'), sitemap);
  console.log('✅ Generated sitemap.xml');
}

// Generate robots.txt
function generateRobotsTxt() {
  const robots = `User-agent: *
Allow: /

# Disallow admin and private areas
Disallow: /admin/
Disallow: /api/
Disallow: /auth/
Disallow: /_next/
Disallow: /static/
Disallow: /node_modules/
Disallow: /src/
Disallow: /dist/
Disallow: /checkout
Disallow: /cart
Disallow: /profile
Disallow: /orders
Disallow: /wishlist
Disallow: /payment/

# Allow important crawlers
User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

User-agent: Slurp
Allow: /

User-agent: DuckDuckBot
Allow: /

User-agent: Baiduspider
Allow: /

# Crawl delay for respectful crawling
Crawl-delay: 1

# Sitemap locations
Sitemap: ${config.siteUrl}/sitemap.xml
Sitemap: ${config.siteUrl}/sitemap-products.xml
Sitemap: ${config.siteUrl}/sitemap-blog.xml

# Host directive
Host: ${config.siteUrl}`;

  fs.writeFileSync(path.join(config.outputDir, 'robots.txt'), robots);
  console.log('✅ Generated robots.txt');
}

// Generate security.txt for security researchers
function generateSecurityTxt() {
  const security = `Contact: ysevenfoods@gmail.com
Expires: ${new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()}
Acknowledgments: ${config.siteUrl}/security-acknowledgments
Preferred-Languages: en
Canonical: ${config.siteUrl}/.well-known/security.txt`;

  const wellKnownDir = path.join(config.outputDir, '.well-known');
  if (!fs.existsSync(wellKnownDir)) {
    fs.mkdirSync(wellKnownDir, { recursive: true });
  }
  
  fs.writeFileSync(path.join(wellKnownDir, 'security.txt'), security);
  console.log('✅ Generated security.txt');
}

// Generate humans.txt
function generateHumansTxt() {
  const humans = `/* TEAM */
Developer: Y7 Development Team
Contact: ysevenfoods@gmail.com
Location: Mumbai, India

/* THANKS */
Thanks to all our customers and partners who make Y7 Sauces possible.

/* SITE */
Last update: ${config.currentDate}
Language: English
Doctype: HTML5
IDE: Visual Studio Code
Technologies: React, TypeScript, Vite, Tailwind CSS`;

  fs.writeFileSync(path.join(config.outputDir, 'humans.txt'), humans);
  console.log('✅ Generated humans.txt');
}

// Generate manifest.json for PWA
function generateManifest() {
  const manifest = {
    name: "Y7 Premium Sauces",
    short_name: "Y7 Sauces",
    description: "Premium global sauce brand - One Brand. Endless Flavor.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#D4AF37",
    orientation: "portrait-primary",
    icons: [
      {
        src: "/favicon.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any maskable"
      },
      {
        src: "/favicon.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any maskable"
      }
    ],
    categories: ["food", "shopping", "lifestyle"],
    lang: "en",
    dir: "ltr"
  };

  fs.writeFileSync(
    path.join(config.outputDir, 'manifest.json'), 
    JSON.stringify(manifest, null, 2)
  );
  console.log('✅ Generated manifest.json');
}

// Generate ads.txt for advertising transparency
function generateAdsTxt() {
  const ads = `# Y7 Sauces ads.txt
# Updated: ${config.currentDate}
# Contact: ysevenfoods@gmail.com

# Google AdSense (example - replace with actual publisher ID)
# google.com, pub-0000000000000000, DIRECT, f08c47fec0942fa0

# Add your actual advertising partners here`;

  fs.writeFileSync(path.join(config.outputDir, 'ads.txt'), ads);
  console.log('✅ Generated ads.txt');
}

// Main execution
function main() {
  console.log('🚀 Generating SEO assets...\n');
  
  try {
    generateSitemap();
    generateRobotsTxt();
    generateSecurityTxt();
    generateHumansTxt();
    generateManifest();
    generateAdsTxt();
    
    console.log('\n✨ All SEO assets generated successfully!');
    console.log(`📁 Output directory: ${config.outputDir}`);
    console.log(`🌐 Site URL: ${config.siteUrl}`);
    console.log(`📅 Generated on: ${config.currentDate}`);
  } catch (error) {
    console.error('❌ Error generating SEO assets:', error);
    process.exit(1);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export {
  generateSitemap,
  generateRobotsTxt,
  generateSecurityTxt,
  generateHumansTxt,
  generateManifest,
  generateAdsTxt,
  main
};