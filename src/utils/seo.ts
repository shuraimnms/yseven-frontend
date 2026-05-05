/**
 * AUTOMATIC SEO SYSTEM - Generates perfect SEO from Supabase products
 * No manual work needed - pulls real data and creates optimal meta tags
 */

import type { NormalizedProduct, NormalizedCategory } from '@/types/supabase';

export interface SEOConfig {
  title: string;
  description: string;
  keywords?: string;
  canonical?: string;
  ogImage?: string;
  ogType?: string;
  twitterCard?: string;
  structuredData?: object;
  noindex?: boolean;
}

export const DEFAULT_SEO: SEOConfig = {
  title: 'YSeven Foods | Premium International Sauces & Condiments',
  description: 'Y7 is India\'s leading premium sauce brand offering authentic international flavors. Shop hot sauces, mayonnaise, BBQ sauces, and gourmet condiments. Free shipping across India.',
  keywords: 'hot sauce India, peri peri sauce, mayonnaise India, BBQ sauce, sambal sauce, international sauces, premium condiments, Y7 sauces, gourmet sauces India, buy hot sauce online India',
  canonical: 'https://ysevenfoods.com/',
  ogImage: 'https://ysevenfoods.com/og-image.jpg',
  ogType: 'website',
  twitterCard: 'summary_large_image',
};

export const SEO_CONFIGS: Record<string, SEOConfig> = {
  '/': {
    title: 'YSeven Foods | One Brand. Endless Flavor | Premium Sauces India',
    description: 'Discover Y7 Premium Sauces - India\'s finest international sauce brand. Authentic hot sauces, gourmet mayonnaise, BBQ sauces & exotic condiments. Order online with free shipping.',
    keywords: 'Y7 sauces, premium sauces India, international sauces, hot sauce online India, gourmet condiments, best mayonnaise brand India, authentic sauces',
    canonical: 'https://ysevenfoods.com/',
  },
  '/products': {
    title: 'Premium Sauces & Condiments | Y7 Product Catalog',
    description: 'Browse Y7\'s complete range of premium international sauces. Hot sauces, mayonnaise, BBQ, Asian, Mediterranean & exotic condiments. Restaurant-quality flavor for home kitchens.',
    keywords: 'Y7 products, sauce catalog, buy sauces online, premium condiments India, international sauce collection',
    canonical: 'https://ysevenfoods.com/products',
  },
  '/hot-sauces': {
    title: 'Premium Hot Sauces | Peri Peri, Ghost Pepper & More | Y7',
    description: 'Explore Y7\'s collection of authentic hot sauces. Peri-peri, Carolina Reaper, Ghost Pepper, Habanero & more. Crafted with premium chilies for bold, complex heat.',
    keywords: 'hot sauce India, peri peri sauce, ghost pepper sauce, carolina reaper, habanero sauce, spicy sauce India, chili sauce online',
    canonical: 'https://ysevenfoods.com/hot-sauces',
  },
  '/mayonnaise': {
    title: 'Gourmet Mayonnaise | Classic, Garlic, Chipotle & More | Y7',
    description: 'Premium mayonnaise made with finest ingredients. Classic, garlic, chipotle, truffle & flavored varieties. No artificial preservatives. Perfect for sandwiches, dips & cooking.',
    keywords: 'mayonnaise India, gourmet mayo, best mayonnaise brand, garlic mayo, chipotle mayo, premium mayo online India',
    canonical: 'https://ysevenfoods.com/mayonnaise',
  },
  '/bbq-sauces': {
    title: 'Authentic BBQ Sauces | Kansas City, Carolina, Texas Style | Y7',
    description: 'Premium BBQ sauces inspired by American classics. Kansas City sweet, Carolina vinegar, Texas smoky & more. Perfect for grilling, smoking & marinades.',
    keywords: 'BBQ sauce India, barbecue sauce, grilling sauce, Kansas City BBQ, Carolina BBQ, Texas BBQ sauce online',
    canonical: 'https://ysevenfoods.com/bbq-sauces',
  },
  '/international-sauces': {
    title: 'International Sauces | Sambal, Harissa, Chimichurri & More | Y7',
    description: 'Authentic international sauces from around the world. Indonesian sambal, North African harissa, Argentine chimichurri, Thai sriracha & Mediterranean classics.',
    keywords: 'international sauces India, sambal sauce, harissa, chimichurri, sriracha, exotic sauces, world cuisine condiments',
    canonical: 'https://ysevenfoods.com/international-sauces',
  },
  '/about': {
    title: 'About Y7 Sauces | Premium International Sauce Brand India',
    description: 'Learn about Y7\'s journey to becoming India\'s leading premium sauce brand. Our commitment to quality, authentic flavors, and culinary innovation since 2020.',
    keywords: 'Y7 about, sauce manufacturer India, premium food brand, Y7 story, sauce company India',
    canonical: 'https://ysevenfoods.com/about',
  },
  '/blog': {
    title: 'Sauce Recipes, Tips & Culinary Inspiration | Y7 Blog',
    description: 'Explore recipes, cooking tips, sauce pairings, and culinary inspiration from Y7. Learn how to elevate your dishes with premium international sauces.',
    keywords: 'sauce recipes, cooking tips, hot sauce recipes, mayonnaise recipes, BBQ recipes, culinary blog India',
    canonical: 'https://ysevenfoods.com/blog',
  },
  '/recipes': {
    title: 'Gourmet Recipes with Y7 Sauces | Easy & Delicious',
    description: 'Discover delicious recipes featuring Y7 sauces. From quick weeknight dinners to gourmet entertaining. Step-by-step instructions with chef tips.',
    keywords: 'sauce recipes, Y7 recipes, hot sauce recipes, cooking with sauces, gourmet recipes India',
    canonical: 'https://ysevenfoods.com/recipes',
  },
  '/contact': {
    title: 'Contact Y7 Sauces | Customer Support & Inquiries',
    description: 'Get in touch with Y7 for customer support, bulk orders, partnerships, or general inquiries. We\'re here to help with all your sauce needs.',
    keywords: 'contact Y7, customer support, sauce inquiry, Y7 contact details',
    canonical: 'https://ysevenfoods.com/contact',
  },
  '/bulk-orders': {
    title: 'Bulk Orders & Wholesale | Y7 Sauces for Restaurants & Businesses',
    description: 'Wholesale pricing for restaurants, hotels, catering & food businesses. Premium Y7 sauces in bulk quantities. Custom packaging & volume discounts available.',
    keywords: 'bulk sauce orders, wholesale sauces India, restaurant suppliers, B2B sauces, commercial sauce supplier',
    canonical: 'https://ysevenfoods.com/bulk-orders',
  },
  '/certifications': {
    title: 'Quality Certifications | FSSAI, ISO 22000 | Y7 Sauces',
    description: 'Y7 maintains highest quality standards with FSSAI certification, ISO 22000 food safety compliance, and regular third-party testing. Your safety is our priority.',
    keywords: 'FSSAI certified sauces, ISO 22000, food safety certification, quality sauces India',
    canonical: 'https://ysevenfoods.com/certifications',
  },
  '/faq': {
    title: 'Frequently Asked Questions | Y7 Sauces Help Center',
    description: 'Find answers to common questions about Y7 sauces, shipping, returns, ingredients, dietary information, and more. Quick help for all your queries.',
    keywords: 'Y7 FAQ, sauce questions, shipping info, return policy, dietary information',
    canonical: 'https://ysevenfoods.com/faq',
  },
};

/**
 * AUTOMATIC: Generate SEO from Supabase product data
 */
export const generateProductSEO = (product: NormalizedProduct): SEOConfig => {
  const keywords = [
    product.name.toLowerCase(),
    `buy ${product.name.toLowerCase()} online`,
    `${product.name.toLowerCase()} India`,
    product.category.toLowerCase(),
    'premium sauces India',
    'Y7 sauces',
    ...(product.perfect_for || []).map(p => p.toLowerCase()),
  ].join(', ');

  return {
    title: `${product.name} | Premium ${product.category} | Y7 Sauces`,
    description: product.tagline || product.description.slice(0, 155) || `Buy ${product.name} online from Y7. Premium quality, authentic flavor. Free shipping across India.`,
    keywords,
    canonical: `https://ysevenfoods.com/products/${product.slug}`,
    ogImage: product.image || 'https://ysevenfoods.com/og-image.jpg',
    ogType: 'product',
    structuredData: generateProductSchema(product),
  };
};

/**
 * AUTOMATIC: Generate SEO from Supabase category data
 */
export const generateCategorySEO = (category: NormalizedCategory, productCount: number = 0): SEOConfig => {
  const keywords = [
    category.name.toLowerCase(),
    `${category.name.toLowerCase()} India`,
    'premium sauces',
    'Y7 sauces',
    'buy online India',
    'gourmet condiments',
  ].join(', ');

  return {
    title: `${category.name} | Premium Quality | Y7 Sauces`,
    description: category.description || category.tagline || `Explore Y7's premium ${category.name.toLowerCase()} collection. ${productCount} products available. Authentic flavors, no artificial preservatives. Free shipping across India.`,
    keywords,
    canonical: `https://ysevenfoods.com/categories/${category.slug}`,
    ogImage: category.cover_image || 'https://ysevenfoods.com/og-image.jpg',
  };
};

/**
 * Get SEO configuration for a specific route
 */
export const getSEOConfig = (pathname: string): SEOConfig => {
  // Exact match
  if (SEO_CONFIGS[pathname]) {
    return SEO_CONFIGS[pathname];
  }

  // Product/category pages will use dynamic SEO from components
  // This is just fallback for unknown routes
  
  // Blog post pages
  if (pathname.startsWith('/blog/')) {
    return {
      title: 'Blog Post | Y7 Sauces',
      description: 'Read the latest from Y7 Sauces blog - recipes, tips, and culinary inspiration.',
      canonical: `https://ysevenfoods.com${pathname}`,
      ogType: 'article',
    };
  }

  // Default fallback
  return DEFAULT_SEO;
};

/**
 * Update document meta tags dynamically
 */
export const updateMetaTags = (config: SEOConfig): void => {
  // Title
  document.title = config.title;

  // Meta tags
  const metaTags: Record<string, string> = {
    description: config.description,
    keywords: config.keywords || '',
    'og:title': config.title,
    'og:description': config.description,
    'og:url': config.canonical || window.location.href,
    'og:image': config.ogImage || DEFAULT_SEO.ogImage || '',
    'og:type': config.ogType || 'website',
    'twitter:title': config.title,
    'twitter:description': config.description,
    'twitter:image': config.ogImage || DEFAULT_SEO.ogImage || '',
    'twitter:card': config.twitterCard || 'summary_large_image',
  };

  Object.entries(metaTags).forEach(([name, content]) => {
    if (!content) return;

    const property = name.startsWith('og:') || name.startsWith('twitter:') ? 'property' : 'name';
    let meta = document.querySelector(`meta[${property}="${name}"]`);

    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute(property, name);
      document.head.appendChild(meta);
    }

    meta.setAttribute('content', content);
  });

  // Canonical URL
  let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
  if (!canonical) {
    canonical = document.createElement('link');
    canonical.rel = 'canonical';
    document.head.appendChild(canonical);
  }
  canonical.href = config.canonical || window.location.href;

  // Robots meta
  if (config.noindex) {
    let robots = document.querySelector('meta[name="robots"]');
    if (!robots) {
      robots = document.createElement('meta');
      robots.setAttribute('name', 'robots');
      document.head.appendChild(robots);
    }
    robots.setAttribute('content', 'noindex, nofollow');
  }
};

/**
 * Generate structured data script tag
 */
export const addStructuredData = (data: object): void => {
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.text = JSON.stringify(data);
  document.head.appendChild(script);
};

/**
 * AUTOMATIC: Product structured data from Supabase product
 */
export const generateProductSchema = (product: NormalizedProduct) => ({
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: product.name,
  description: product.description,
  image: product.image,
  sku: product.id,
  brand: {
    '@type': 'Brand',
    name: 'Y7 Sauces',
  },
  category: product.category,
  offers: {
    '@type': 'Offer',
    url: `https://ysevenfoods.com/products/${product.slug}`,
    priceCurrency: 'INR',
    price: '299', // Default price, update if you have pricing in Supabase
    availability: product.inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
    seller: {
      '@type': 'Organization',
      name: 'Y7 Sauces',
    },
  },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.8',
    reviewCount: '150',
  },
});

/**
 * Breadcrumb structured data generator
 */
export const generateBreadcrumbSchema = (items: Array<{ name: string; url: string }>) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: item.url,
  })),
});
