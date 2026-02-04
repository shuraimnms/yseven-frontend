// Prerendering utilities for better SEO
import { generateSEO, pageSEO, generateProductSEO, generateBlogSEO } from '@/lib/seo';
import { SEOData } from '@/types';

// Check if we're in a bot/crawler environment
export const isCrawler = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  const userAgent = navigator.userAgent.toLowerCase();
  const crawlers = [
    'googlebot',
    'bingbot',
    'slurp',
    'duckduckbot',
    'baiduspider',
    'yandexbot',
    'facebookexternalhit',
    'twitterbot',
    'rogerbot',
    'linkedinbot',
    'embedly',
    'quora link preview',
    'showyoubot',
    'outbrain',
    'pinterest/0.',
    'developers.google.com/+/web/snippet',
    'slackbot',
    'vkshare',
    'w3c_validator',
    'redditbot',
    'applebot',
    'whatsapp',
    'flipboard',
    'tumblr',
    'bitlybot',
    'skypeuripreview',
    'nuzzel',
    'discordbot',
    'google page speed',
    'qwantify'
  ];
  
  return crawlers.some(crawler => userAgent.includes(crawler));
};

// Prerender meta tags for crawlers
export const prerenderMetaTags = (seoData: SEOData): string => {
  return `
    <title>${seoData.title}</title>
    <meta name="description" content="${seoData.description}" />
    ${seoData.keywords ? `<meta name="keywords" content="${seoData.keywords}" />` : ''}
    ${seoData.canonical ? `<link rel="canonical" href="${seoData.canonical}" />` : ''}
    
    <!-- Open Graph -->
    <meta property="og:title" content="${seoData.ogTitle || seoData.title}" />
    <meta property="og:description" content="${seoData.ogDescription || seoData.description}" />
    <meta property="og:type" content="${seoData.ogType || 'website'}" />
    ${seoData.ogImage ? `<meta property="og:image" content="${seoData.ogImage}" />` : ''}
    ${seoData.canonical ? `<meta property="og:url" content="${seoData.canonical}" />` : ''}
    <meta property="og:site_name" content="Y7 Sauces" />
    
    <!-- Twitter -->
    <meta name="twitter:card" content="${seoData.twitterCard || 'summary_large_image'}" />
    <meta name="twitter:title" content="${seoData.twitterTitle || seoData.title}" />
    <meta name="twitter:description" content="${seoData.twitterDescription || seoData.description}" />
    ${seoData.twitterImage ? `<meta name="twitter:image" content="${seoData.twitterImage}" />` : ''}
    
    <!-- Additional -->
    <meta name="robots" content="${seoData.robots || 'index, follow'}" />
    ${seoData.author ? `<meta name="author" content="${seoData.author}" />` : ''}
  `;
};

// Generate static HTML for crawlers
export const generateStaticHTML = (
  seoData: SEOData,
  content: string,
  structuredData?: any[]
): string => {
  const metaTags = prerenderMetaTags(seoData);
  const schemas = structuredData?.map(schema => 
    `<script type="application/ld+json">${JSON.stringify(schema)}</script>`
  ).join('\n') || '';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  ${metaTags}
  ${schemas}
  <link rel="icon" type="image/png" href="/favicon.png" />
  <style>
    body { 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
    }
    .header { 
      border-bottom: 1px solid #eee; 
      padding-bottom: 20px; 
      margin-bottom: 30px;
    }
    .logo { 
      font-size: 24px; 
      font-weight: bold; 
      color: #D4AF37;
    }
    .nav { 
      margin-top: 10px;
    }
    .nav a { 
      margin-right: 20px; 
      text-decoration: none; 
      color: #666;
    }
    .content { 
      margin-bottom: 40px;
    }
    .footer { 
      border-top: 1px solid #eee; 
      padding-top: 20px; 
      text-align: center; 
      color: #666;
    }
    .product-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
      margin: 20px 0;
    }
    .product-card {
      border: 1px solid #eee;
      border-radius: 8px;
      padding: 15px;
      text-align: center;
    }
    .product-image {
      width: 100%;
      height: 200px;
      object-fit: cover;
      border-radius: 4px;
    }
    .btn {
      background: #D4AF37;
      color: white;
      padding: 10px 20px;
      border: none;
      border-radius: 4px;
      text-decoration: none;
      display: inline-block;
      margin-top: 10px;
    }
  </style>
</head>
<body>
  <header class="header">
    <div class="logo">Y7 Sauces</div>
    <nav class="nav">
      <a href="/">Home</a>
      <a href="/about">About</a>
      <a href="/products">Products</a>
      <a href="/shop">Shop</a>
      <a href="/blog">Blog</a>
      <a href="/contact">Contact</a>
    </nav>
  </header>
  
  <main class="content">
    ${content}
  </main>
  
  <footer class="footer">
    <p>&copy; 2024 Y7 Sauces. One Brand. Endless Flavor.</p>
    <p>Premium sauces and condiments delivered worldwide.</p>
  </footer>
  
  <script>
    // Redirect to full React app for human users
    if (!navigator.userAgent.match(/bot|crawler|spider|crawling/i)) {
      window.location.href = window.location.href;
    }
  </script>
</body>
</html>`;
};

// Page-specific content generators
export const generateHomeContent = (): string => {
  return `
    <h1>Y7 Premium Sauces - One Brand. Endless Flavor</h1>
    <p>Discover Y7's premium sauce collection featuring authentic international flavors. From peri-peri to sambal, mayonnaise to hot sauces, we craft gourmet condiments for bold kitchens worldwide.</p>
    
    <section>
      <h2>Featured Products</h2>
      <div class="product-grid">
        <div class="product-card">
          <h3>Peri-Peri Sauce</h3>
          <p>Authentic Portuguese-style peri-peri sauce with the perfect balance of heat and flavor.</p>
          <a href="/products/peri-peri-sauce" class="btn">View Product</a>
        </div>
        <div class="product-card">
          <h3>Sambal Sauce</h3>
          <p>Traditional Indonesian sambal with fresh chilies and aromatic spices.</p>
          <a href="/products/sambal-sauce" class="btn">View Product</a>
        </div>
        <div class="product-card">
          <h3>Premium Mayonnaise</h3>
          <p>Creamy, rich mayonnaise made with the finest ingredients for gourmet applications.</p>
          <a href="/products/premium-mayonnaise" class="btn">View Product</a>
        </div>
      </div>
    </section>
    
    <section>
      <h2>Why Choose Y7 Sauces?</h2>
      <ul>
        <li><strong>Premium Quality:</strong> Made with the finest ingredients and traditional recipes</li>
        <li><strong>Authentic Flavors:</strong> Genuine international taste profiles</li>
        <li><strong>Global Delivery:</strong> Worldwide shipping to bring flavors to your kitchen</li>
        <li><strong>Restaurant Grade:</strong> Professional quality for home and commercial use</li>
      </ul>
    </section>
  `;
};

export const generateProductsContent = (): string => {
  return `
    <h1>Premium Sauce Products</h1>
    <p>Explore Y7's complete range of premium sauces and condiments. Each product is crafted with authentic recipes and the finest ingredients to deliver exceptional flavor experiences.</p>
    
    <section>
      <h2>Hot Sauces</h2>
      <p>From mild to extreme heat levels, our hot sauce collection features peri-peri, ghost pepper, carolina reaper, and international varieties.</p>
      <a href="/hot-sauces" class="btn">View Hot Sauces</a>
    </section>
    
    <section>
      <h2>Mayonnaise Collection</h2>
      <p>Gourmet mayonnaise varieties including garlic, chipotle, truffle, and classic preparations for professional and home use.</p>
      <a href="/mayonnaise" class="btn">View Mayonnaise</a>
    </section>
    
    <section>
      <h2>International Sauces</h2>
      <p>Authentic global flavors including sambal, harissa, chimichurri, gochujang, and regional specialties from around the world.</p>
      <a href="/international" class="btn">View International</a>
    </section>
    
    <section>
      <h2>BBQ Sauces</h2>
      <p>Premium barbecue sauces in Kansas City, Carolina, Texas, and international styles perfect for grilling and smoking.</p>
      <a href="/bbq-sauces" class="btn">View BBQ Sauces</a>
    </section>
  `;
};

export const generateAboutContent = (): string => {
  return `
    <h1>About Y7 Sauces</h1>
    <p>Y7 Sauces is a premium global sauce brand dedicated to redefining flavor through innovation, precision, and uncompromising quality. We craft authentic international condiments for bold kitchens worldwide.</p>
    
    <section>
      <h2>Our Mission</h2>
      <p>To bring authentic global flavors to every kitchen, combining traditional recipes with modern quality standards to create exceptional sauce experiences.</p>
    </section>
    
    <section>
      <h2>Quality Standards</h2>
      <ul>
        <li>Premium ingredients sourced globally</li>
        <li>Traditional recipes with modern techniques</li>
        <li>Rigorous quality control processes</li>
        <li>Food safety certifications</li>
        <li>Sustainable packaging practices</li>
      </ul>
    </section>
    
    <section>
      <h2>Global Reach</h2>
      <p>From our production facilities, we deliver premium sauces to restaurants, retailers, and home kitchens across multiple continents, ensuring consistent quality and authentic taste worldwide.</p>
    </section>
  `;
};

// Export prerender utilities
export const prerenderUtils = {
  isCrawler,
  prerenderMetaTags,
  generateStaticHTML,
  generateHomeContent,
  generateProductsContent,
  generateAboutContent
};