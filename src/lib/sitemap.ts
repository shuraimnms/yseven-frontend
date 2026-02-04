import { seoConfig } from './seo';

export interface SitemapUrl {
  loc: string;
  lastmod?: string;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
}

export const staticRoutes: SitemapUrl[] = [
  {
    loc: '/',
    lastmod: new Date().toISOString().split('T')[0],
    changefreq: 'daily',
    priority: 1.0
  },
  {
    loc: '/about',
    lastmod: new Date().toISOString().split('T')[0],
    changefreq: 'monthly',
    priority: 0.8
  },
  {
    loc: '/products',
    lastmod: new Date().toISOString().split('T')[0],
    changefreq: 'daily',
    priority: 0.9
  },
  {
    loc: '/shop',
    lastmod: new Date().toISOString().split('T')[0],
    changefreq: 'daily',
    priority: 0.9
  },
  {
    loc: '/blog',
    lastmod: new Date().toISOString().split('T')[0],
    changefreq: 'daily',
    priority: 0.8
  },
  {
    loc: '/recipes',
    lastmod: new Date().toISOString().split('T')[0],
    changefreq: 'weekly',
    priority: 0.7
  },
  {
    loc: '/contact',
    lastmod: new Date().toISOString().split('T')[0],
    changefreq: 'monthly',
    priority: 0.7
  },
  {
    loc: '/bulk-orders',
    lastmod: new Date().toISOString().split('T')[0],
    changefreq: 'monthly',
    priority: 0.6
  },
  {
    loc: '/export',
    lastmod: new Date().toISOString().split('T')[0],
    changefreq: 'monthly',
    priority: 0.6
  },
  {
    loc: '/certifications',
    lastmod: new Date().toISOString().split('T')[0],
    changefreq: 'monthly',
    priority: 0.6
  },
  {
    loc: '/quality',
    lastmod: new Date().toISOString().split('T')[0],
    changefreq: 'monthly',
    priority: 0.6
  },
  {
    loc: '/faq',
    lastmod: new Date().toISOString().split('T')[0],
    changefreq: 'monthly',
    priority: 0.5
  },
  {
    loc: '/careers',
    lastmod: new Date().toISOString().split('T')[0],
    changefreq: 'monthly',
    priority: 0.4
  },
  {
    loc: '/press',
    lastmod: new Date().toISOString().split('T')[0],
    changefreq: 'monthly',
    priority: 0.4
  },
  {
    loc: '/partnerships',
    lastmod: new Date().toISOString().split('T')[0],
    changefreq: 'monthly',
    priority: 0.5
  },
  {
    loc: '/privacy',
    lastmod: new Date().toISOString().split('T')[0],
    changefreq: 'yearly',
    priority: 0.3
  },
  {
    loc: '/terms',
    lastmod: new Date().toISOString().split('T')[0],
    changefreq: 'yearly',
    priority: 0.3
  },
  {
    loc: '/refund',
    lastmod: new Date().toISOString().split('T')[0],
    changefreq: 'monthly',
    priority: 0.4
  },
  {
    loc: '/shipping',
    lastmod: new Date().toISOString().split('T')[0],
    changefreq: 'monthly',
    priority: 0.4
  },
  // Category pages
  {
    loc: '/hot-sauces',
    lastmod: new Date().toISOString().split('T')[0],
    changefreq: 'weekly',
    priority: 0.8
  },
  {
    loc: '/mayonnaise',
    lastmod: new Date().toISOString().split('T')[0],
    changefreq: 'weekly',
    priority: 0.8
  },
  {
    loc: '/international',
    lastmod: new Date().toISOString().split('T')[0],
    changefreq: 'weekly',
    priority: 0.8
  },
  {
    loc: '/bbq-sauces',
    lastmod: new Date().toISOString().split('T')[0],
    changefreq: 'weekly',
    priority: 0.8
  }
];

export const generateSitemap = (
  products: any[] = [],
  blogPosts: any[] = []
): string => {
  const urls: SitemapUrl[] = [...staticRoutes];

  // Add product URLs
  products.forEach(product => {
    urls.push({
      loc: `/products/${product.slug}`,
      lastmod: product.updatedAt ? new Date(product.updatedAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      changefreq: 'weekly',
      priority: 0.7
    });
  });

  // Add blog post URLs
  blogPosts.forEach(post => {
    urls.push({
      loc: `/blog/${post.slug}`,
      lastmod: post.updatedAt ? new Date(post.updatedAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      changefreq: 'monthly',
      priority: 0.6
    });
  });

  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(url => `  <url>
    <loc>${seoConfig.siteUrl}${url.loc}</loc>
    ${url.lastmod ? `<lastmod>${url.lastmod}</lastmod>` : ''}
    ${url.changefreq ? `<changefreq>${url.changefreq}</changefreq>` : ''}
    ${url.priority ? `<priority>${url.priority}</priority>` : ''}
  </url>`).join('\n')}
</urlset>`;

  return sitemapXml;
};

export const generateRobotsTxt = (): string => {
  return `User-agent: *
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
Sitemap: ${seoConfig.siteUrl}/sitemap.xml
Sitemap: ${seoConfig.siteUrl}/sitemap-products.xml
Sitemap: ${seoConfig.siteUrl}/sitemap-blog.xml

# Host directive
Host: ${seoConfig.siteUrl}`;
};

// Generate product-specific sitemap
export const generateProductSitemap = (products: any[]): string => {
  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${products.map(product => `  <url>
    <loc>${seoConfig.siteUrl}/products/${product.slug}</loc>
    <lastmod>${product.updatedAt ? new Date(product.updatedAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
    ${product.image ? `<image:image>
      <image:loc>${seoConfig.siteUrl}${product.image}</image:loc>
      <image:title>${product.name}</image:title>
      <image:caption>${product.description || product.name}</image:caption>
    </image:image>` : ''}
  </url>`).join('\n')}
</urlset>`;

  return sitemapXml;
};

// Generate blog-specific sitemap
export const generateBlogSitemap = (blogPosts: any[]): string => {
  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${blogPosts.map(post => `  <url>
    <loc>${seoConfig.siteUrl}/blog/${post.slug}</loc>
    <lastmod>${post.updatedAt ? new Date(post.updatedAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
    ${post.publishedAt ? `<news:news>
      <news:publication>
        <news:name>Y7 Sauces Blog</news:name>
        <news:language>en</news:language>
      </news:publication>
      <news:publication_date>${new Date(post.publishedAt).toISOString()}</news:publication_date>
      <news:title>${post.title}</news:title>
    </news:news>` : ''}
  </url>`).join('\n')}
</urlset>`;

  return sitemapXml;
};