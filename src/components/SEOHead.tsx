import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { getSEOConfig, updateMetaTags } from '../utils/seo';

/**
 * SEO Head Component
 * Dynamically updates meta tags based on current route
 */
export const SEOHead = () => {
  const location = useLocation();
  const seoConfig = getSEOConfig(location.pathname);

  useEffect(() => {
    updateMetaTags(seoConfig);
  }, [location.pathname, seoConfig]);

  return (
    <Helmet>
      <title>{seoConfig.title}</title>
      <meta name="description" content={seoConfig.description} />
      {seoConfig.keywords && <meta name="keywords" content={seoConfig.keywords} />}
      <link rel="canonical" href={seoConfig.canonical || `https://ysevenfoods.com${location.pathname}`} />
      
      {/* Open Graph */}
      <meta property="og:title" content={seoConfig.title} />
      <meta property="og:description" content={seoConfig.description} />
      <meta property="og:type" content={seoConfig.ogType || 'website'} />
      <meta property="og:url" content={seoConfig.canonical || `https://ysevenfoods.com${location.pathname}`} />
      <meta property="og:image" content={seoConfig.ogImage || 'https://ysevenfoods.com/og-image.jpg'} />
      
      {/* Twitter */}
      <meta name="twitter:card" content={seoConfig.twitterCard || 'summary_large_image'} />
      <meta name="twitter:title" content={seoConfig.title} />
      <meta name="twitter:description" content={seoConfig.description} />
      <meta name="twitter:image" content={seoConfig.ogImage || 'https://ysevenfoods.com/og-image.jpg'} />
      
      {/* Robots */}
      {seoConfig.noindex && <meta name="robots" content="noindex, nofollow" />}
    </Helmet>
  );
};

export default SEOHead;
