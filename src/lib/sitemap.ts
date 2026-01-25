import { seoConfig } from './seo';

export interface SitemapUrl {
  loc: string;
  lastmod?: string;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
}

export const generateSitemap = (urls: SitemapUrl[]): string => {
  const urlsXml = urls.map(url => `
  <url>
    <loc>${url.loc}</loc>
    ${url.lastmod ? `<lastmod>${url.lastmod}</lastmod>` : ''}
    ${url.changefreq ? `<changefreq>${url.changefreq}</changefreq>` : ''}
    ${url.priority ? `<priority>${url.priority}</priority>` : ''}
  </url>`).join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${urlsXml}
</urlset>`;
};

export const getStaticSitemapUrls = (): SitemapUrl[] => {
  const baseUrl = seoConfig.siteUrl;
  const currentDate = new Date().toISOString().split('T')[0];

  return [
    // Main pages
    {
      loc: baseUrl,
      lastmod: currentDate,
      changefreq: 'daily',
      priority: 1.0
    },
    {
      loc: `${baseUrl}/about`,
      lastmod: currentDate,
      changefreq: 'monthly',
      priority: 0.8
    },
    {
      loc: `${baseUrl}/shop`,
      lastmod: currentDate,
      changefreq: 'daily',
      priority: 0.9
    },
    {
      loc: `${baseUrl}/products`,
      lastmod: currentDate,
      changefreq: 'daily',
      priority: 0.9
    },
    {
      loc: `${baseUrl}/contact`,
      lastmod: currentDate,
      changefreq: 'monthly',
      priority: 0.7
    },
    {
      loc: `${baseUrl}/blog`,
      lastmod: currentDate,
      changefreq: 'daily',
      priority: 0.8
    },
    
    // Category pages
    {
      loc: `${baseUrl}/hot-sauces`,
      lastmod: currentDate,
      changefreq: 'weekly',
      priority: 0.8
    },
    {
      loc: `${baseUrl}/mayonnaise`,
      lastmod: currentDate,
      changefreq: 'weekly',
      priority: 0.8
    },
    {
      loc: `${baseUrl}/international`,
      lastmod: currentDate,
      changefreq: 'weekly',
      priority: 0.8
    },
    {
      loc: `${baseUrl}/bbq-sauces`,
      lastmod: currentDate,
      changefreq: 'weekly',
      priority: 0.8
    },
    {
      loc: `${baseUrl}/condiments`,
      lastmod: currentDate,
      changefreq: 'weekly',
      priority: 0.8
    },
    
    // Special pages
    {
      loc: `${baseUrl}/recipes`,
      lastmod: currentDate,
      changefreq: 'weekly',
      priority: 0.7
    },
    {
      loc: `${baseUrl}/gift-sets`,
      lastmod: currentDate,
      changefreq: 'weekly',
      priority: 0.7
    },
    {
      loc: `${baseUrl}/subscription`,
      lastmod: currentDate,
      changefreq: 'monthly',
      priority: 0.6
    },
    {
      loc: `${baseUrl}/wholesale`,
      lastmod: currentDate,
      changefreq: 'monthly',
      priority: 0.6
    },
    
    // Legal pages
    {
      loc: `${baseUrl}/privacy`,
      lastmod: currentDate,
      changefreq: 'yearly',
      priority: 0.3
    },
    {
      loc: `${baseUrl}/terms`,
      lastmod: currentDate,
      changefreq: 'yearly',
      priority: 0.3
    },
    {
      loc: `${baseUrl}/shipping`,
      lastmod: currentDate,
      changefreq: 'monthly',
      priority: 0.4
    },
    {
      loc: `${baseUrl}/refund`,
      lastmod: currentDate,
      changefreq: 'monthly',
      priority: 0.4
    }
  ];
};

export const generateProductSitemapUrls = (products: any[]): SitemapUrl[] => {
  const baseUrl = seoConfig.siteUrl;
  
  return products.map(product => ({
    loc: `${baseUrl}/products/${product.slug}`,
    lastmod: product.updatedAt ? new Date(product.updatedAt).toISOString().split('T')[0] : undefined,
    changefreq: 'weekly' as const,
    priority: product.isBestSeller ? 0.9 : 0.7
  }));
};

export const generateBlogSitemapUrls = (posts: any[]): SitemapUrl[] => {
  const baseUrl = seoConfig.siteUrl;
  
  return posts.map(post => ({
    loc: `${baseUrl}/blog/${post.slug}`,
    lastmod: post.updatedAt ? new Date(post.updatedAt).toISOString().split('T')[0] : undefined,
    changefreq: 'monthly' as const,
    priority: 0.6
  }));
};

export const generateRobotsTxt = (): string => {
  const baseUrl = seoConfig.siteUrl;
  
  return `User-agent: *
Allow: /

# Disallow admin and private areas
Disallow: /admin/
Disallow: /api/
Disallow: /auth/
Disallow: /_next/
Disallow: /static/

# Allow important crawlers
User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

User-agent: Slurp
Allow: /

# Crawl delay
Crawl-delay: 1

# Sitemap location
Sitemap: ${baseUrl}/sitemap.xml
Sitemap: ${baseUrl}/sitemap-products.xml
Sitemap: ${baseUrl}/sitemap-blog.xml

# Host
Host: ${baseUrl}`;
};