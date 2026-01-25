import { Helmet } from 'react-helmet-async';
import { SEOData } from '@/types';

interface SEOProps extends SEOData {
  children?: React.ReactNode;
}

const SEO: React.FC<SEOProps> = ({
  title,
  description,
  keywords,
  canonical,
  ogTitle,
  ogDescription,
  ogImage,
  twitterTitle,
  twitterDescription,
  twitterImage,
  children,
}) => {
  const siteUrl = 'https://y7sauces.com';
  const defaultImage = `${siteUrl}/og-image.jpg`;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      {canonical && <link rel="canonical" href={canonical} />}

      {/* Open Graph Meta Tags */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={ogTitle || title} />
      <meta property="og:description" content={ogDescription || description} />
      <meta property="og:image" content={ogImage || defaultImage} />
      <meta property="og:url" content={canonical || window.location.href} />
      <meta property="og:site_name" content="Y7 Sauces" />

      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={twitterTitle || ogTitle || title} />
      <meta name="twitter:description" content={twitterDescription || ogDescription || description} />
      <meta name="twitter:image" content={twitterImage || ogImage || defaultImage} />

      {/* Additional Meta Tags */}
      <meta name="robots" content="index, follow" />
      <meta name="author" content="Y7 Sauces" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta httpEquiv="Content-Language" content="en" />

      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "Y7 Sauces",
          "description": "Premium sauces and condiments - One Brand. Endless Flavor.",
          "url": siteUrl,
          "logo": `${siteUrl}/logo.png`,
          "contactPoint": {
            "@type": "ContactPoint",
            "telephone": "+91-XXXXXXXXXX",
            "contactType": "customer service"
          },
          "sameAs": [
            "https://facebook.com/y7sauces",
            "https://instagram.com/y7sauces",
            "https://twitter.com/y7sauces"
          ]
        })}
      </script>

      {children}
    </Helmet>
  );
};

export default SEO;
export { SEO };