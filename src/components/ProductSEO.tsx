import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { generateProductSEO, addStructuredData } from '@/utils/seo';
import type { NormalizedProduct } from '@/types/supabase';

/**
 * AUTOMATIC Product SEO - Generates perfect SEO from Supabase product data
 * Just pass the product, everything else is automatic!
 */
interface ProductSEOProps {
  product: NormalizedProduct;
}

export const ProductSEO = ({ product }: ProductSEOProps) => {
  const seo = generateProductSEO(product);

  useEffect(() => {
    // Add product structured data
    if (seo.structuredData) {
      addStructuredData(seo.structuredData);
    }

    // Add breadcrumb for product
    addStructuredData({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: 'https://ysevenfoods.com/',
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Products',
          item: 'https://ysevenfoods.com/products',
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: product.category,
          item: `https://ysevenfoods.com/categories/${product.category.toLowerCase().replace(/\s+/g, '-')}`,
        },
        {
          '@type': 'ListItem',
          position: 4,
          name: product.name,
          item: `https://ysevenfoods.com/products/${product.slug}`,
        },
      ],
    });
  }, [product, seo.structuredData]);

  return (
    <Helmet>
      <title>{seo.title}</title>
      <meta name="description" content={seo.description} />
      {seo.keywords && <meta name="keywords" content={seo.keywords} />}
      <link rel="canonical" href={seo.canonical} />
      
      {/* Open Graph */}
      <meta property="og:title" content={seo.title} />
      <meta property="og:description" content={seo.description} />
      <meta property="og:type" content="product" />
      <meta property="og:url" content={seo.canonical} />
      <meta property="og:image" content={seo.ogImage} />
      <meta property="product:brand" content="Y7 Sauces" />
      <meta property="product:availability" content={product.inStock ? 'in stock' : 'out of stock'} />
      <meta property="product:condition" content="new" />
      <meta property="product:price:amount" content="299" />
      <meta property="product:price:currency" content="INR" />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={seo.title} />
      <meta name="twitter:description" content={seo.description} />
      <meta name="twitter:image" content={seo.ogImage} />
      <meta name="twitter:label1" content="Price" />
      <meta name="twitter:data1" content="₹299" />
      <meta name="twitter:label2" content="Availability" />
      <meta name="twitter:data2" content={product.inStock ? 'In Stock' : 'Out of Stock'} />
    </Helmet>
  );
};

export default ProductSEO;
