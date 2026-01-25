import { Helmet } from 'react-helmet-async';
import { SEOData } from '@/types';
import { seoConfig } from '@/lib/seo';

interface SEOHeadProps {
  seo: SEOData;
  schema?: any[];
  noIndex?: boolean;
  noFollow?: boolean;
}

const SEOHead = ({ seo, schema = [], noIndex = false, noFollow = false }: SEOHeadProps) => {
  const robots = noIndex || noFollow 
    ? `${noIndex ? 'noindex' : 'index'}, ${noFollow ? 'nofollow' : 'follow'}`
    : seo.robots;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{seo.title}</title>
      <meta name="description" content={seo.description} />
      {seo.keywords && <meta name="keywords" content={seo.keywords} />}
      
      {/* Canonical URL */}
      {seo.canonical && <link rel="canonical" href={seo.canonical} />}
      
      {/* Robots & Crawling */}
      <meta name="robots" content={robots} />
      {seo.googlebot && <meta name="googlebot" content={seo.googlebot} />}
      
      {/* Language & Locale */}
      {seo.language && <meta name="language" content={seo.language} />}
      <meta httpEquiv="content-language" content={seo.language || 'en'} />
      
      {/* Author & Publisher */}
      {seo.author && <meta name="author" content={seo.author} />}
      {seo.publisher && <meta name="publisher" content={seo.publisher} />}
      
      {/* Additional Meta */}
      {seo.revisitAfter && <meta name="revisit-after" content={seo.revisitAfter} />}
      {seo.rating && <meta name="rating" content={seo.rating} />}
      {seo.distribution && <meta name="distribution" content={seo.distribution} />}
      
      {/* Open Graph Meta Tags */}
      <meta property="og:title" content={seo.ogTitle} />
      <meta property="og:description" content={seo.ogDescription} />
      <meta property="og:image" content={seo.ogImage} />
      <meta property="og:url" content={seo.canonical} />
      <meta property="og:type" content={seo.ogType || 'website'} />
      <meta property="og:site_name" content={seo.ogSiteName || seoConfig.siteName} />
      <meta property="og:locale" content={seo.ogLocale || seoConfig.locale} />
      
      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content={seo.twitterCard || 'summary_large_image'} />
      <meta name="twitter:title" content={seo.twitterTitle} />
      <meta name="twitter:description" content={seo.twitterDescription} />
      <meta name="twitter:image" content={seo.twitterImage} />
      {seo.twitterSite && <meta name="twitter:site" content={seo.twitterSite} />}
      
      {/* Facebook Meta Tags */}
      {seoConfig.facebookAppId && <meta property="fb:app_id" content={seoConfig.facebookAppId} />}
      
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
      
      {/* Structured Data */}
      {schema.length > 0 && schema.map((schemaItem, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaItem) }}
        />
      ))}
      
      {/* Organization Schema (Always include) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(seoConfig.schema.organization) }}
      />
      
      {/* Hreflang for International SEO */}
      <link rel="alternate" hrefLang="en" href={`${seoConfig.siteUrl}${seo.canonical?.replace(seoConfig.siteUrl, '') || ''}`} />
      <link rel="alternate" hrefLang="en-US" href={`${seoConfig.siteUrl}${seo.canonical?.replace(seoConfig.siteUrl, '') || ''}`} />
      <link rel="alternate" hrefLang="en-GB" href={`${seoConfig.siteUrl}/uk${seo.canonical?.replace(seoConfig.siteUrl, '') || ''}`} />
      <link rel="alternate" hrefLang="en-IN" href={`${seoConfig.siteUrl}/in${seo.canonical?.replace(seoConfig.siteUrl, '') || ''}`} />
      <link rel="alternate" hrefLang="x-default" href={`${seoConfig.siteUrl}${seo.canonical?.replace(seoConfig.siteUrl, '') || ''}`} />
    </Helmet>
  );
};

export default SEOHead;