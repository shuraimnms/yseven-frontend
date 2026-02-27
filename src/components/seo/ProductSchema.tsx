import { useEffect } from 'react';

interface ProductSchemaProps {
  product: {
    name: string;
    description: string;
    image: string;
    price?: number;
    sku: string;
    brand?: string;
    availability?: string;
  };
}

export const ProductSchema = ({ product }: ProductSchemaProps) => {
  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'product-schema';
    script.text = JSON.stringify({
      "@context": "https://schema.org/",
      "@type": "Product",
      "name": product.name,
      "image": product.image,
      "description": product.description,
      "sku": product.sku,
      "brand": {
        "@type": "Brand",
        "name": product.brand || "Y7 Premium Sauces"
      },
      "offers": {
        "@type": "Offer",
        "url": window.location.href,
        "priceCurrency": "INR",
        "price": product.price || "0",
        "availability": `https://schema.org/${product.availability || 'InStock'}`,
        "seller": {
          "@type": "Organization",
          "name": "Y7 Premium Sauces"
        }
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.8",
        "reviewCount": "127"
      }
    });
    document.head.appendChild(script);
    
    return () => {
      const existingScript = document.getElementById('product-schema');
      if (existingScript) {
        document.head.removeChild(existingScript);
      }
    };
  }, [product]);
  
  return null;
};
