/**
 * Category Helper Utilities
 * Utility functions for working with category data
 */

import { Category, Product } from '@/data/categoryData';

/**
 * Generate URL-friendly slug from text
 * @param text - Text to convert to slug
 * @returns URL-friendly slug
 */
export const generateSlug = (text: string): string => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-')      // Replace spaces with hyphens
    .replace(/-+/g, '-')       // Replace multiple hyphens with single hyphen
    .replace(/^-+|-+$/g, '');  // Remove leading/trailing hyphens
};

/**
 * Get category by slug
 * @param categories - Array of categories
 * @param slug - Category slug
 * @returns Category or undefined
 */
export const getCategoryBySlug = (
  categories: Category[],
  slug: string
): Category | undefined => {
  return categories.find(cat => cat.slug === slug);
};

/**
 * Get product by slug within a category
 * @param category - Category object
 * @param productSlug - Product slug
 * @returns Product or undefined
 */
export const getProductBySlug = (
  category: Category,
  productSlug: string
): Product | undefined => {
  return category.products.find(product => product.slug === productSlug);
};

/**
 * Get all products across all categories
 * @param categories - Array of categories
 * @returns Array of all products
 */
export const getAllProducts = (categories: Category[]): Product[] => {
  return categories.flatMap(category => category.products);
};

/**
 * Search products by name across all categories
 * @param categories - Array of categories
 * @param searchTerm - Search term
 * @returns Array of matching products
 */
export const searchProducts = (
  categories: Category[],
  searchTerm: string
): Product[] => {
  const term = searchTerm.toLowerCase();
  return getAllProducts(categories).filter(product =>
    product.name.toLowerCase().includes(term) ||
    product.shortDescription.toLowerCase().includes(term)
  );
};

/**
 * Get products with specific badge
 * @param categories - Array of categories
 * @param badge - Badge name (e.g., 'Bestseller', 'New')
 * @returns Array of products with the badge
 */
export const getProductsByBadge = (
  categories: Category[],
  badge: string
): Product[] => {
  return getAllProducts(categories).filter(
    product => product.badge?.toLowerCase() === badge.toLowerCase()
  );
};

/**
 * Get category statistics
 * @param category - Category object
 * @returns Statistics object
 */
export const getCategoryStats = (category: Category) => {
  const products = category.products;
  const totalProducts = products.length;
  const productsWithPrice = products.filter(p => p.price).length;
  const productsWithBadge = products.filter(p => p.badge).length;
  const averagePrice = products
    .filter(p => p.price)
    .reduce((sum, p) => sum + (p.price || 0), 0) / productsWithPrice || 0;

  return {
    totalProducts,
    productsWithPrice,
    productsWithBadge,
    averagePrice: Math.round(averagePrice),
    badges: [...new Set(products.map(p => p.badge).filter(Boolean))]
  };
};

/**
 * Sort products by various criteria
 * @param products - Array of products
 * @param sortBy - Sort criteria
 * @returns Sorted array of products
 */
export const sortProducts = (
  products: Product[],
  sortBy: 'name' | 'price-asc' | 'price-desc' | 'newest'
): Product[] => {
  const sorted = [...products];

  switch (sortBy) {
    case 'name':
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
    
    case 'price-asc':
      return sorted.sort((a, b) => (a.price || 0) - (b.price || 0));
    
    case 'price-desc':
      return sorted.sort((a, b) => (b.price || 0) - (a.price || 0));
    
    case 'newest':
      // Assumes products with 'New' badge are newest
      return sorted.sort((a, b) => {
        if (a.badge === 'New' && b.badge !== 'New') return -1;
        if (a.badge !== 'New' && b.badge === 'New') return 1;
        return 0;
      });
    
    default:
      return sorted;
  }
};

/**
 * Filter products by price range
 * @param products - Array of products
 * @param minPrice - Minimum price
 * @param maxPrice - Maximum price
 * @returns Filtered array of products
 */
export const filterByPriceRange = (
  products: Product[],
  minPrice: number,
  maxPrice: number
): Product[] => {
  return products.filter(
    product => product.price && product.price >= minPrice && product.price <= maxPrice
  );
};

/**
 * Get related products (same category, excluding current product)
 * @param categories - Array of categories
 * @param currentProductSlug - Current product slug
 * @param limit - Maximum number of related products
 * @returns Array of related products
 */
export const getRelatedProducts = (
  categories: Category[],
  currentProductSlug: string,
  limit: number = 4
): Product[] => {
  // Find the category containing the current product
  const category = categories.find(cat =>
    cat.products.some(p => p.slug === currentProductSlug)
  );

  if (!category) return [];

  // Get other products from the same category
  return category.products
    .filter(p => p.slug !== currentProductSlug)
    .slice(0, limit);
};

/**
 * Validate category data structure
 * @param category - Category object to validate
 * @returns Validation result with errors
 */
export const validateCategory = (category: Category): {
  valid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];

  if (!category.slug) errors.push('Category slug is required');
  if (!category.title) errors.push('Category title is required');
  if (!category.tagline) errors.push('Category tagline is required');
  if (!category.video) errors.push('Category video is required');
  if (!category.videoPoster) errors.push('Category video poster is required');
  if (!category.products || category.products.length === 0) {
    errors.push('Category must have at least one product');
  }

  // Validate products
  category.products?.forEach((product, index) => {
    if (!product.id) errors.push(`Product ${index + 1}: ID is required`);
    if (!product.name) errors.push(`Product ${index + 1}: Name is required`);
    if (!product.slug) errors.push(`Product ${index + 1}: Slug is required`);
    if (!product.image) errors.push(`Product ${index + 1}: Image is required`);
    if (!product.shortDescription) {
      errors.push(`Product ${index + 1}: Short description is required`);
    }
  });

  return {
    valid: errors.length === 0,
    errors
  };
};

/**
 * Generate breadcrumb data for category page
 * @param category - Category object
 * @param productSlug - Optional product slug
 * @returns Breadcrumb array
 */
export const generateBreadcrumbs = (
  category: Category,
  productSlug?: string
) => {
  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Products', url: '/products' },
    { name: category.title, url: `/category/${category.slug}` }
  ];

  if (productSlug) {
    const product = getProductBySlug(category, productSlug);
    if (product) {
      breadcrumbs.push({
        name: product.name,
        url: `/products/${product.slug}`
      });
    }
  }

  return breadcrumbs;
};

/**
 * Format price with currency
 * @param price - Price number
 * @param currency - Currency symbol (default: ₹)
 * @returns Formatted price string
 */
export const formatPrice = (price: number, currency: string = '₹'): string => {
  return `${currency}${price.toLocaleString('en-IN')}`;
};

/**
 * Calculate discount percentage
 * @param originalPrice - Original price
 * @param discountedPrice - Discounted price
 * @returns Discount percentage
 */
export const calculateDiscount = (
  originalPrice: number,
  discountedPrice: number
): number => {
  return Math.round(((originalPrice - discountedPrice) / originalPrice) * 100);
};

/**
 * Check if product is new (has 'New' badge)
 * @param product - Product object
 * @returns Boolean indicating if product is new
 */
export const isNewProduct = (product: Product): boolean => {
  return product.badge?.toLowerCase() === 'new';
};

/**
 * Check if product is bestseller
 * @param product - Product object
 * @returns Boolean indicating if product is bestseller
 */
export const isBestseller = (product: Product): boolean => {
  return product.badge?.toLowerCase() === 'bestseller';
};

/**
 * Get unique badges across all categories
 * @param categories - Array of categories
 * @returns Array of unique badge names
 */
export const getUniqueBadges = (categories: Category[]): string[] => {
  const badges = getAllProducts(categories)
    .map(p => p.badge)
    .filter(Boolean) as string[];
  
  return [...new Set(badges)];
};

/**
 * Export category data as JSON
 * @param categories - Array of categories
 * @returns JSON string
 */
export const exportCategoryData = (categories: Category[]): string => {
  return JSON.stringify(categories, null, 2);
};

/**
 * Get price range for a category
 * @param category - Category object
 * @returns Object with min and max prices
 */
export const getPriceRange = (category: Category): {
  min: number;
  max: number;
} => {
  const prices = category.products
    .map(p => p.price)
    .filter(Boolean) as number[];

  if (prices.length === 0) {
    return { min: 0, max: 0 };
  }

  return {
    min: Math.min(...prices),
    max: Math.max(...prices)
  };
};
