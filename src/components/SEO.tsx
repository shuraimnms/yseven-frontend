import { Helmet } from 'react-helmet-async';
import { useGlobalSettings } from '@/hooks/useGlobalSettings';
import { SEOData } from '@/types';
import { seoConfig } from '@/lib/seo';

interface SEOProps extends SEOData {
  children?: React.ReactNode;
  structuredData?: any[];
  noIndex?: boolean;
  noFollow?: boolean;
}

const SEO: React.FC<SEOProps> = ({
  title,
  description,
  keywords,
  canonical,
  ogTitle,
  ogDescription,
  ogImage,
  ogType,
  twitterTitle,
  twitterDescription,
  twitterImage,
  author,
  publisher,
  robots,
  children,
  structuredData = [],
  noIndex = false,
  noFollow = false,
}) => {
  const { siteTitle, supportPhone, supportEmail, socialMedia } = useGlobalSettings();

  // Provide fallback values
  const safeSiteTitle = siteTitle || 'Y7 Sauces';
  const safeSupportPhone = supportPhone || '+91 9876543210';
  const safeSupportEmail = supportEmail || 'y.sevenfoods@gmail.com';
  const safeSocialMedia = socialMedia || {
    facebook: 'https://facebook.com/y7sauces',
    instagram: 'https://instagram.com/y7sauces',
    twitter: 'https://twitter.com/y7sauces',
    youtube: 'https://youtube.com/@y7sauces'
  };

  // Handle robots meta
  const robotsContent = noIndex || noFollow 
    ? `${noIndex ? 'noindex' : 'index'}, ${noFollow ? 'nofollow' : 'follow'}`
    : robots || 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1';

  // Enhanced organization schema
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": safeSiteTitle,
    "alternateName": "Y Seven Sauces",
    "description": "Premium global sauce and condiment manufacturer specializing in authentic international flavors.",
    "url": seoConfig.siteUrl,
    "logo": {
      "@type": "ImageObject",
      "url": `${seoConfig.siteUrl}/logo.png`,
      "width": 200,
      "height": 200
    },
    "image": `${seoConfig.siteUrl}/og-image.jpg`,
    "foundingDate": "2020",
    "slogan": "One Brand. Endless Flavor.",
    "contactPoint": [
      {
        "@type": "ContactPoint",
        "telephone": safeSupportPhone,
        "contactType": "customer service",
        "availableLanguage": ["English", "Hindi"],
        "areaServed": "Worldwide"
      },
      {
        "@type": "ContactPoint",
        "contactType": "sales",
        "email": safeSupportEmail,
        "availableLanguage": ["English"]
      }
    ],
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "IN",
      "addressRegion": "Maharashtra",
      "addressLocality": "Mumbai"
    },
    "sameAs": [
      safeSocialMedia.facebook,
      safeSocialMedia.instagram,
      safeSocialMedia.twitter,
      safeSocialMedia.youtube
    ].filter(Boolean),
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Y7 Sauces Product Catalog",
      "itemListElement": [
        {
          "@type": "OfferCatalog",
          "name": "Hot Sauces",
          "description": "Premium hot sauce collection including peri-peri, ghost pepper, and international varieties"
        },
        {
          "@type": "OfferCatalog", 
          "name": "Mayonnaise",
          "description": "Gourmet mayonnaise collection with various flavors and preparations"
        },
        {
          "@type": "OfferCatalog",
          "name": "International Sauces",
          "description": "Authentic global sauces including sambal, harissa, and regional specialties"
        }
      ]
    }
  };

  // Website schema
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": safeSiteTitle,
    "url": seoConfig.siteUrl,
    "description": description,
    "publisher": {
      "@type": "Organization",
      "name": safeSiteTitle
    },
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${seoConfig.siteUrl}/search?q={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      {canonical && <link rel="canonical" href={canonical} />}

      {/* Robots and Crawling */}
      <meta name="robots" content={robotsContent} />
      <meta name="googlebot" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      <meta name="bingbot" content="index, follow" />

      {/* Language and Locale */}
      <meta httpEquiv="Content-Language" content="en" />
      <meta name="language" content="en" />

      {/* Author and Publisher */}
      {author && <meta name="author" content={author} />}
      {publisher && <meta name="publisher" content={publisher} />}

      {/* Open Graph Meta Tags */}
      <meta property="og:type" content={ogType || "website"} />
      <meta property="og:title" content={ogTitle || title} />
      <meta property="og:description" content={ogDescription || description} />
      <meta property="og:image" content={ogImage || `${seoConfig.siteUrl}${seoConfig.defaultImage}`} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:type" content="image/jpeg" />
      <meta property="og:url" content={canonical || (typeof window !== 'undefined' ? window.location.href : seoConfig.siteUrl)} />
      <meta property="og:site_name" content="Y7 Sauces" />
      <meta property="og:locale" content="en_US" />

      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@Y7Sauces" />
      <meta name="twitter:creator" content="@Y7Sauces" />
      <meta name="twitter:title" content={twitterTitle || ogTitle || title} />
      <meta name="twitter:description" content={twitterDescription || ogDescription || description} />
      <meta name="twitter:image" content={twitterImage || ogImage || `${seoConfig.siteUrl}${seoConfig.defaultImage}`} />

      {/* Additional SEO Meta Tags */}
      <meta name="theme-color" content="#D4AF37" />
      <meta name="msapplication-TileColor" content="#D4AF37" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />

      {/* Preconnect for Performance */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="preconnect" href="https://www.google-analytics.com" />
      <link rel="preconnect" href="https://www.googletagmanager.com" />

      {/* DNS Prefetch */}
      <link rel="dns-prefetch" href="//fonts.googleapis.com" />
      <link rel="dns-prefetch" href="//www.google-analytics.com" />
      <link rel="dns-prefetch" href="//connect.facebook.net" />

      {/* Structured Data - Organization */}
      <script type="application/ld+json">
        {JSON.stringify(organizationSchema)}
      </script>

      {/* Structured Data - Website */}
      <script type="application/ld+json">
        {JSON.stringify(websiteSchema)}
      </script>

      {/* Additional Structured Data */}
      {structuredData.map((schema, index) => (
        <script key={index} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}

      {/* Hreflang for International SEO */}
      <link rel="alternate" hrefLang="en" href={canonical || seoConfig.siteUrl} />
      <link rel="alternate" hrefLang="en-US" href={canonical || seoConfig.siteUrl} />
      <link rel="alternate" hrefLang="en-GB" href={`${seoConfig.siteUrl}/uk${canonical?.replace(seoConfig.siteUrl, '') || ''}`} />
      <link rel="alternate" hrefLang="en-IN" href={`${seoConfig.siteUrl}/in${canonical?.replace(seoConfig.siteUrl, '') || ''}`} />
      <link rel="alternate" hrefLang="x-default" href={canonical || seoConfig.siteUrl} />

      {children}
    </Helmet>
  );
};

export default SEO;
export { SEO };