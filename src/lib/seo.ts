import { SEOData } from '@/types';

export const seoConfig = {
  defaultTitle: 'Y7 Sauces – Premium Global Condiments | One Brand. Endless Flavor',
  titleTemplate: '%s | Y7 Sauces',
  defaultDescription: 'Discover Y7\'s premium sauce collection - peri-peri, sambal, mayonnaise, hot sauce & gourmet condiments. Authentic global flavors delivered worldwide. Shop now!',
  siteUrl: 'https://ysevenfoods.com',
  defaultImage: '/og-image.jpg',
  siteName: 'Y7 Sauces',
  twitterHandle: '@Y7Sauces',
  facebookAppId: '1234567890',
  language: 'en',
  locale: 'en_US',
  type: 'website',
  author: 'Y7 Sauces',
  publisher: 'Y7 Sauces',
  brandTagline: 'One Brand. Endless Flavor.',
  keywords: {
    primary: ['premium sauces', 'peri peri sauce', 'sambal sauce', 'mayonnaise', 'hot sauce', 'condiments', 'gourmet sauces'],
    secondary: ['artisan condiments', 'international sauces', 'organic sauces', 'spicy sauces', 'bbq sauce', 'asian sauces'],
    branded: ['Y7 sauces', 'Y7 condiments', 'Y7 hot sauce', 'Y7 mayonnaise', 'Y7 peri peri']
  },
  schema: {
    organization: {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'Y7 Sauces',
      alternateName: 'Y Seven Sauces',
      url: 'https://ysevenfoods.com',
      logo: 'https://ysevenfoods.com/logo.png',
      description: 'Premium global sauce and condiment manufacturer specializing in authentic international flavors.',
      foundingDate: '2020',
      founders: [
        {
          '@type': 'Person',
          name: 'Y7 Founder'
        }
      ],
      address: {
        '@type': 'PostalAddress',
        addressCountry: 'IN',
        addressRegion: 'Maharashtra',
        addressLocality: 'Mumbai'
      },
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: '+91-1234567890',
        contactType: 'customer service',
        availableLanguage: ['English', 'Hindi']
      },
      sameAs: [
        'https://facebook.com/Y7Sauces',
        'https://instagram.com/Y7Sauces',
        'https://twitter.com/Y7Sauces',
        'https://linkedin.com/company/y7sauces'
      ]
    }
  }
};

export const generateSEO = (data: Partial<SEOData> = {}): SEOData => {
  const title = data.title 
    ? (data.title.includes('Y7') ? data.title : `${data.title} | Y7 Sauces`)
    : seoConfig.defaultTitle;

  const description = data.description || seoConfig.defaultDescription;
  const keywords = data.keywords || seoConfig.keywords.primary.join(', ');

  return {
    title,
    description,
    keywords,
    canonical: data.canonical || `${seoConfig.siteUrl}${data.path || ''}`,
    ogTitle: data.ogTitle || title,
    ogDescription: data.ogDescription || description,
    ogImage: data.ogImage || `${seoConfig.siteUrl}${seoConfig.defaultImage}`,
    ogType: data.ogType || 'website',
    ogSiteName: seoConfig.siteName,
    ogLocale: seoConfig.locale,
    twitterTitle: data.twitterTitle || title,
    twitterDescription: data.twitterDescription || description,
    twitterImage: data.twitterImage || data.ogImage || `${seoConfig.siteUrl}${seoConfig.defaultImage}`,
    twitterCard: data.twitterCard || 'summary_large_image',
    twitterSite: seoConfig.twitterHandle,
    author: data.author || seoConfig.author,
    publisher: data.publisher || seoConfig.publisher,
    robots: data.robots || 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
    googlebot: data.googlebot || 'index, follow',
    language: data.language || seoConfig.language,
    revisitAfter: data.revisitAfter || '7 days',
    rating: data.rating || 'general',
    distribution: data.distribution || 'global'
  };
};

// SEO data for different pages
export const pageSEO = {
  home: generateSEO({
    title: 'Y7 Sauces – Premium Global Condiments | One Brand. Endless Flavor',
    description: 'Discover Y7\'s premium sauce collection - peri-peri, sambal, mayonnaise, hot sauce & international condiments. Authentic global flavors delivered worldwide. Shop now!',
    keywords: 'premium sauces, peri peri sauce online, sambal sauce buy, mayonnaise brand, hot sauce premium, condiments gourmet, Y7 sauces, international sauces',
    path: '/',
    ogType: 'website'
  }),

  about: generateSEO({
    title: 'About Y7 Sauces - Premium Global Condiment Brand Story',
    description: 'Learn about Y7 Sauces - premium global sauce brand crafting authentic international flavors. Discover our mission, quality standards & commitment to excellence.',
    keywords: 'about Y7 sauces, premium sauce brand, sauce company story, food manufacturing, quality standards, international condiments',
    path: '/about',
    ogType: 'website'
  }),

  products: generateSEO({
    title: 'Premium Sauce Products - Peri-Peri, Sambal, Mayonnaise & More',
    description: 'Explore Y7\'s complete range of premium sauces & condiments. Peri-peri, sambal, mayonnaise, hot sauce, BBQ sauce & international flavors. Shop authentic taste.',
    keywords: 'Y7 products, peri peri sauce premium, sambal sauce authentic, mayonnaise gourmet, hot sauce collection, international sauces, premium condiments',
    path: '/products',
    ogType: 'website'
  }),

  shop: generateSEO({
    title: 'Shop Premium Sauces Online - Y7 Global Condiment Store',
    description: 'Buy premium Y7 sauces online. Peri-peri, sambal, mayonnaise, hot sauce & more. Fast worldwide delivery, secure payment. Free shipping over $50.',
    keywords: 'buy sauces online, Y7 shop, premium condiments online, peri peri sauce buy, sambal sauce order, mayonnaise premium',
    path: '/shop',
    ogType: 'website'
  }),

  contact: generateSEO({
    title: 'Contact Y7 Sauces - Premium Sauce Supplier & Partner',
    description: 'Contact Y7 Sauces for bulk orders, partnerships, wholesale inquiries & customer support. Premium sauce supplier for restaurants & retailers worldwide.',
    keywords: 'contact Y7 sauces, bulk sauce orders, wholesale condiments, sauce supplier, restaurant partnerships, premium sauce distributor',
    path: '/contact',
    ogType: 'website'
  }),

  blog: generateSEO({
    title: 'Y7 Sauce Blog - Recipes, Tips & Global Flavor Inspiration',
    description: 'Discover sauce recipes, cooking tips & flavor inspiration from Y7 Sauces. Learn to use peri-peri, sambal, mayonnaise & international sauces in your cooking.',
    keywords: 'sauce recipes, cooking tips, Y7 blog, peri peri recipes, sambal recipes, mayonnaise uses, hot sauce cooking, international cuisine',
    path: '/blog',
    ogType: 'website'
  }),

  // Category pages
  hotSauces: generateSEO({
    title: 'Premium Hot Sauce Collection - Peri-Peri, Ghost Pepper & More',
    description: 'Explore Y7\'s premium hot sauce collection. Peri-peri, ghost pepper, carolina reaper, sriracha & international spicy sauces. Authentic heat, premium quality.',
    keywords: 'premium hot sauce, peri peri sauce, ghost pepper sauce, carolina reaper, sriracha premium, spicy sauce collection, artisan hot sauce',
    path: '/hot-sauces',
    ogType: 'website'
  }),

  mayonnaise: generateSEO({
    title: 'Gourmet Mayonnaise Collection - Premium Spreads & Condiments',
    description: 'Discover Y7\'s gourmet mayonnaise collection. Garlic, chipotle, truffle, sriracha mayo & more. Premium quality, restaurant-grade spreads & condiments.',
    keywords: 'premium mayonnaise, gourmet mayo, garlic mayonnaise, chipotle mayo, truffle mayonnaise, artisan spreads, restaurant quality mayo',
    path: '/mayonnaise',
    ogType: 'website'
  }),

  international: generateSEO({
    title: 'International Sauce Collection - Authentic Global Flavors',
    description: 'Explore Y7\'s authentic international sauce collection. Sambal, harissa, chimichurri, gochujang, tahini & more. Genuine global flavors, premium quality.',
    keywords: 'international sauces, sambal sauce, harissa sauce, chimichurri, gochujang, tahini sauce, global condiments, authentic flavors',
    path: '/international',
    ogType: 'website'
  }),

  bbq: generateSEO({
    title: 'Premium BBQ Sauce Collection - Smoky, Sweet & Spicy Varieties',
    description: 'Discover Y7\'s premium BBQ sauce collection. Kansas City, Carolina, Texas styles & international BBQ flavors. Perfect for grilling & smoking.',
    keywords: 'premium bbq sauce, kansas city bbq, carolina bbq sauce, texas bbq, smoky bbq sauce, grilling sauce, barbecue condiments',
    path: '/bbq-sauces',
    ogType: 'website'
  })
};

// Generate product SEO
export const generateProductSEO = (product: any): SEOData => {
  const productKeywords = [
    product.name.toLowerCase(),
    `${product.category.toLowerCase()} sauce`,
    `buy ${product.name.toLowerCase()} online`,
    `premium ${product.category.toLowerCase()}`,
    `Y7 ${product.category.toLowerCase()}`,
    'gourmet sauce',
    'artisan condiment'
  ].join(', ');

  return generateSEO({
    title: `${product.name} - Premium ${product.category} | Y7 Sauces`,
    description: `Buy ${product.name} online - ${product.description || `Premium ${product.category.toLowerCase()} sauce`}. Authentic flavor, premium quality. ₹${product.sellingPrice}. Free shipping over ₹500.`,
    keywords: productKeywords,
    path: `/products/${product.slug}`,
    ogType: 'product',
    ogImage: product.image ? `${seoConfig.siteUrl}${product.image}` : undefined,
  });
};

// Generate category SEO
export const generateCategorySEO = (category: string, products: any[]): SEOData => {
  const categoryKeywords = [
    `${category.toLowerCase()} sauce`,
    `premium ${category.toLowerCase()}`,
    `buy ${category.toLowerCase()} online`,
    `Y7 ${category.toLowerCase()}`,
    'gourmet sauce',
    'artisan condiment'
  ].join(', ');

  return generateSEO({
    title: `Premium ${category} Collection - Y7 Sauces`,
    description: `Explore Y7's premium ${category.toLowerCase()} collection. ${products.length}+ authentic flavors, restaurant quality. Shop ${category.toLowerCase()} sauces online with fast delivery.`,
    keywords: categoryKeywords,
    path: `/category/${category.toLowerCase().replace(/\s+/g, '-')}`,
    ogType: 'website'
  });
};

// Generate blog post SEO
export const generateBlogSEO = (post: any): SEOData => {
  const blogKeywords = [
    ...(post.tags || []),
    'sauce recipes',
    'cooking tips',
    'Y7 sauces',
    'gourmet cooking'
  ].join(', ');

  return generateSEO({
    title: post.title,
    description: post.excerpt || post.description,
    keywords: blogKeywords,
    path: `/blog/${post.slug}`,
    ogType: 'article',
    ogImage: post.image ? `${seoConfig.siteUrl}${post.image}` : undefined,
    author: post.author || seoConfig.author,
    publisher: seoConfig.publisher
  });
};

// Generate FAQ Schema
export const generateFAQSchema = (faqs: Array<{question: string, answer: string}>) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    }))
  };
};

// Generate Product Schema
export const generateProductSchema = (product: any) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.image ? `${seoConfig.siteUrl}${product.image}` : undefined,
    brand: {
      '@type': 'Brand',
      name: 'Y7 Sauces'
    },
    manufacturer: {
      '@type': 'Organization',
      name: 'Y7 Sauces'
    },
    category: product.category,
    sku: product.sku,
    offers: {
      '@type': 'Offer',
      price: product.sellingPrice,
      priceCurrency: 'INR',
      availability: product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      seller: {
        '@type': 'Organization',
        name: 'Y7 Sauces'
      }
    },
    aggregateRating: product.rating ? {
      '@type': 'AggregateRating',
      ratingValue: product.rating,
      reviewCount: product.reviewCount || 1
    } : undefined
  };
};

// Generate Breadcrumb Schema
export const generateBreadcrumbSchema = (breadcrumbs: Array<{name: string, url: string}>) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: `${seoConfig.siteUrl}${crumb.url}`
    }))
  };
};

// Generate Article Schema
export const generateArticleSchema = (article: any) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.excerpt,
    image: article.image ? `${seoConfig.siteUrl}${article.image}` : undefined,
    author: {
      '@type': 'Person',
      name: article.author || seoConfig.author
    },
    publisher: {
      '@type': 'Organization',
      name: seoConfig.publisher,
      logo: {
        '@type': 'ImageObject',
        url: `${seoConfig.siteUrl}/logo.png`
      }
    },
    datePublished: article.publishedAt,
    dateModified: article.updatedAt || article.publishedAt,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${seoConfig.siteUrl}/blog/${article.slug}`
    }
  };
};

// SEO Keywords by category
export const seoKeywords = {
  commercial: [
    'buy peri peri sauce online',
    'premium mayonnaise brand',
    'best hot sauce online',
    'sambal sauce buy',
    'gourmet condiments online',
    'artisan sauce collection',
    'international sauce variety',
    'bbq sauce premium',
    'spicy sauce collection',
    'organic sauce online'
  ],
  informational: [
    'what is peri peri sauce',
    'how to use sambal sauce',
    'best sauces for grilling',
    'mayonnaise recipe tips',
    'hot sauce heat levels',
    'international sauce guide',
    'sauce pairing ideas',
    'cooking with premium sauces',
    'sauce storage tips',
    'healthy sauce alternatives'
  ],
  longTail: [
    'where to buy authentic peri peri sauce online',
    'best premium mayonnaise brand in india',
    'how to use sambal oelek in cooking',
    'ghost pepper sauce heat level guide',
    'organic hot sauce without preservatives',
    'gourmet bbq sauce for grilling',
    'international sauce collection gift set',
    'restaurant quality mayonnaise online',
    'fermented hot sauce health benefits',
    'artisan condiment subscription box'
  ],
  branded: [
    'Y7 sauces',
    'Y7 peri peri sauce',
    'Y7 mayonnaise',
    'Y7 hot sauce collection',
    'Y7 sambal sauce',
    'Y7 international sauces',
    'Y7 bbq sauce',
    'Y7 gourmet condiments',
    'Y7 sauce subscription',
    'Y7 sauce gift sets'
  ]
};