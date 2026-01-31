import { create } from 'zustand';
import { Product } from '@/types';
import { productAPI } from '@/lib/api';

interface ProductState {
  products: Product[];
  bestSellers: Product[];
  currentProduct: Product | null;
  isLoading: boolean;
  fetchProducts: () => Promise<void>;
  fetchBestSellers: () => Promise<void>;
  fetchProductBySlug: (slug: string) => Promise<void>;
  searchProducts: (query: string) => Product[];
  getProductsByCategory: (category: string) => Product[];
}

export const useProductStore = create<ProductState>((set, get) => ({
  products: [],
  bestSellers: [],
  currentProduct: null,
  isLoading: false,

  fetchProducts: async () => {
    set({ isLoading: true });
    try {
      const response = await productAPI.getAll();
      if (response.data.success) {
        set({ products: response.data.data.products, isLoading: false });
      }
    } catch (error) {
      console.error('Fetch products error:', error);
      set({ isLoading: false });
    }
  },

  fetchBestSellers: async () => {
    set({ isLoading: true });
    try {
      const response = await productAPI.getBestSellers();
      if (response.data.success) {
        set({ bestSellers: response.data.data.products, isLoading: false });
      }
    } catch (error) {
      console.error('Fetch best sellers error:', error);
      set({ isLoading: false });
    }
  },

  fetchProductBySlug: async (slug: string) => {
    set({ isLoading: true });
    try {
      const response = await productAPI.getBySlug(slug);
      if (response.data.success) {
        set({ currentProduct: response.data.data.product, isLoading: false });
      }
    } catch (error) {
      console.error('Fetch product error:', error);
      set({ isLoading: false });
    }
  },

  searchProducts: (query: string) => {
    const { products } = get();
    if (!query.trim()) return products;
    
    const lowercaseQuery = query.toLowerCase();
    return products.filter(product =>
      product.name.toLowerCase().includes(lowercaseQuery) ||
      product.description?.toLowerCase().includes(lowercaseQuery) ||
      product.category.toLowerCase().includes(lowercaseQuery)
    );
  },

  getProductsByCategory: (category: string) => {
    const { products } = get();
    return products.filter(product => 
      product.category.toLowerCase() === category.toLowerCase()
    );
  },
}));