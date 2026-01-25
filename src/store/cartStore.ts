import { create } from 'zustand';
import { Cart, CartItem } from '@/types';
import { cartAPI } from '@/lib/api';

interface CartState {
  cart: Cart | null;
  isLoading: boolean;
  fetchCart: () => Promise<void>;
  addToCart: (productId: string, quantity: number) => Promise<void>;
  updateCartItem: (itemId: string, quantity: number) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  getItemCount: () => number;
  getSubtotal: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  cart: null,
  isLoading: false,

  fetchCart: async () => {
    set({ isLoading: true });
    try {
      const response = await cartAPI.get();
      if (response.data.success) {
        set({ cart: response.data.data.cart, isLoading: false });
      }
    } catch (error) {
      console.error('Fetch cart error:', error);
      set({ isLoading: false });
    }
  },

  addToCart: async (productId: string, quantity: number) => {
    set({ isLoading: true });
    try {
      const response = await cartAPI.add(productId, quantity);
      if (response.data.success) {
        set({ cart: response.data.data.cart, isLoading: false });
      }
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  updateCartItem: async (itemId: string, quantity: number) => {
    set({ isLoading: true });
    try {
      const response = await cartAPI.update(itemId, quantity);
      if (response.data.success) {
        set({ cart: response.data.data.cart, isLoading: false });
      }
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  removeFromCart: async (itemId: string) => {
    set({ isLoading: true });
    try {
      await cartAPI.remove(itemId);
      const { cart } = get();
      if (cart) {
        const updatedItems = cart.items.filter(item => item.id !== itemId);
        const subtotal = updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const itemCount = updatedItems.reduce((sum, item) => sum + item.quantity, 0);
        set({ 
          cart: { items: updatedItems, subtotal, itemCount }, 
          isLoading: false 
        });
      }
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  clearCart: async () => {
    set({ isLoading: true });
    try {
      await cartAPI.clear();
      set({ cart: { items: [], subtotal: 0, itemCount: 0 }, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  getItemCount: () => {
    const { cart } = get();
    return cart?.itemCount || 0;
  },

  getSubtotal: () => {
    const { cart } = get();
    return cart?.subtotal || 0;
  },
}));