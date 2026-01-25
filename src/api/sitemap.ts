import { 
  generateSitemap, 
  getStaticSitemapUrls, 
  generateBlogSitemapUrls,
  generateRobotsTxt 
} from '@/lib/sitemap';
import { blogPosts } from '@/data/blogPosts';

// Generate main sitemap
export const generateMainSitemap = (): string => {
  const staticUrls = getStaticSitemapUrls();
  return generateSitemap(staticUrls);
};

// Generate blog sitemap
export const generateBlogSitemap = (): string => {
  const blogUrls = generateBlogSitemapUrls(blogPosts);
  return generateSitemap(blogUrls);
};

// Generate robots.txt
export const generateRobotsFile = (): string => {
  return generateRobotsTxt();
};

// Generate sitemap index
export const generateSitemapIndex = (): string => {
  const baseUrl = 'https://y7sauces.com';
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${baseUrl}/sitemap.xml</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${baseUrl}/sitemap-blog.xml</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
  </sitemap>
</sitemapindex>`;
};

// API endpoints for Vite/React app
export const sitemapEndpoints = {
  '/sitemap.xml': generateMainSitemap,
  '/sitemap-blog.xml': generateBlogSitemap,
  '/sitemap-index.xml': generateSitemapIndex,
  '/robots.txt': generateRobotsFile
};