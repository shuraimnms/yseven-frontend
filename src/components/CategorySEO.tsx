import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { generateCategorySEO, addStructuredData } from '@/utils/seo';
import type { NormalizedCategory, NormalizedProduct } from '@/types/supabase';

/**
 * AUTOMATIC Category SEO - Generates perfect SEO from Supabase category data
 * Just pass the category and products, everything else is automatic!
 */
interface CategorySEOProps {
  category: NormalizedCategory;
  products?: NormalizedProduct[];
}

export const CategorySEO = ({ category, products = [] }: CategorySEOProps) => {
  const seo = generateCategorySEO(category, products.length);

  useEffect(() => {
    // Add breadcrumb for category
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
          name: 'Categories',
          item: 'https://ysevenfoods.com/categories',
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: category.name,
          item: `https://ysevenfoods.com/categories/${category.slug}`,
        },
      ],
    });

    // Add ItemList schema for products in category
    if (products.length > 0) {
      addStructuredData({
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: `${category.name} Products`,
        description: `Complete range of ${category.name.toLowerCase()} from Y7 Sauces`,
        numberOfItems: products.length,
        itemListElement: products.slice(0, 10).map((product, index) => ({
          '@type': 'Product',
          position: index + 1,
          name: product.name,
          description: product.description,
          image: product.image,
          url: `https://ysevenfoods.com/products/${product.slug}`,
          brand: {
            '@type': 'Brand',
            name: 'Y7 Sauces',
          },
          offers: {
            '@type': 'Offer',
            priceCurrency: 'INR',
            price: '299',
            availability: product.inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
          },
        })),
      });
    }
  }, [category, products]);

  return (
    <Helmet>
      <title>{seo.title}</title>
      <meta name="description" content={seo.description} />
      {seo.keywords && <meta name="keywords" content={seo.keywords} />}
      <link rel="canonical" href={seo.canonical} />
      
      {/* Open Graph */}
      <meta property="og:title" content={seo.title} />
      <meta property="og:description" content={seo.description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={seo.canonical} />
      <meta property="og:image" content={seo.ogImage} />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={seo.title} />
      <meta name="twitter:description" content={seo.description} />
      <meta name="twitter:image" content={seo.ogImage} />
      {products.length > 0 && (
        <>
          <meta name="twitter:label1" content="Products" />
          <meta name="twitter:data1" content={`${products.length} items`} />
        </>
      )}
    </Helmet>
  );
};

export default CategorySEO;
