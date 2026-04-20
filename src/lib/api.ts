import axios from 'axios';
import { supabase } from '@/lib/supabase';

// Get API base URL from environment or default to local development
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api/v1';

export const getApiBaseUrl = () => API_BASE_URL;

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
});

// ── Request interceptor: attach Supabase JWT ──────────────────
api.interceptors.request.use(
  async (config) => {
    // Get the live Supabase session token
    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (import.meta.env.DEV) {
      console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    }
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// ── Response interceptor: handle 401 ─────────────────────────
api.interceptors.response.use(
  (response) => {
    if (import.meta.env.DEV) {
      console.log(`API Response: ${response.status} ${response.config.url}`);
    }
    return response;
  },
  async (error) => {
    if (!error.response) {
      console.error('Network Error:', error.message);
      return Promise.reject(new Error('Network error. Please check your connection.'));
    }

    // On 401 try refreshing the Supabase session once
    if (error.response?.status === 401 && !error.config._retry) {
      error.config._retry = true;
      try {
        const { data: { session } } = await supabase.auth.refreshSession();
        if (session?.access_token) {
          error.config.headers.Authorization = `Bearer ${session.access_token}`;
          return api(error.config);
        }
      } catch {
        // refresh failed — redirect to login
        const currentPath = window.location.pathname;
        if (!currentPath.startsWith('/auth/login')) {
          window.location.href = '/auth/login';
        }
      }
    }

    const errorMessage = error.response?.data?.message || error.message || 'An error occurred';
    console.error('API Error:', errorMessage);
    return Promise.reject(error);
  }
);

// API endpoints
export const authAPI = {
  register: (data: RegisterData) => api.post('/auth/register', data),
  login: (data: LoginData) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  getMe: () => api.get('/auth/me'),
  sendOTP: (phone: string) => api.post('/auth/otp/send', { phone }),
  verifyOTP: (phone: string, code: string) => api.post('/auth/otp/verify', { phone, code }),
};

export const productAPI = {
  getAll: () => api.get('/products'),
  getBestSellers: () => api.get('/products/best-sellers'),
  getBySlug: (slug: string) => api.get(`/products/${slug}`),
};

export const cartAPI = {
  get: () => api.get('/cart'),
  add: (productId: string, quantity: number) => api.post('/cart', { productId, quantity }),
  update: (itemId: string, quantity: number) => api.put(`/cart/${itemId}`, { quantity }),
  remove: (itemId: string) => api.delete(`/cart/${itemId}`),
  clear: () => api.delete('/cart'),
};

export const orderAPI = {
  create: (data: CreateOrderData) => api.post('/orders', data),
  getAll: () => api.get('/orders'),
  getMy: () => api.get('/orders/my'),
};

export const paymentAPI = {
  startRazorpay: (orderId: string) => api.post('/payments/razorpay/start', { orderId }),
  startCashfree: (orderId: string) => api.post('/payments/cashfree/start', { orderId }),
  getStatus: (orderId: string) => api.get(`/payments/${orderId}/status`),
};

export const userAPI = {
  getProfile: () => api.get('/user/profile'),
  updateProfile: (data: UpdateProfileData) => api.put('/user/profile', data),
  getAddresses: () => api.get('/user/addresses'),
  addAddress: (data: AddressData) => api.post('/user/addresses', data),
  updateAddress: (id: string, data: AddressData) => api.put(`/user/addresses/${id}`, data),
  deleteAddress: (id: string) => api.delete(`/user/addresses/${id}`),
  getWishlist: () => api.get('/user/wishlist'),
  addToWishlist: (productId: string) => api.post('/user/wishlist', { productId }),
  removeFromWishlist: (productId: string) => api.delete(`/user/wishlist/${productId}`),
};

export const chatAPI = {
  initialize: () => api.get('/chat/init'),
  sendMessage: (sessionId: string, message: string, userId?: string) => 
    api.post('/chat/message', { sessionId, message, userId }),
  submitLead: (leadData: any) => api.post('/chat/lead', leadData),
  getChatHistory: (sessionId: string, limit?: number) => 
    api.get(`/chat/history/${sessionId}`, { params: { limit } }),
};

export const adminAPI = {
  // Products Management
  products: {
    getAll: () => api.get('/admin/products'),
    create: (data: CreateProductData) => api.post('/admin/products', data),
    update: (id: string, data: UpdateProductData) => api.put(`/admin/products/${id}`, data),
    delete: (id: string) => api.delete(`/admin/products/${id}`),
    toggleBestSeller: (id: string) => api.patch(`/admin/products/${id}/best-seller`),
  },
  
  // Orders Management
  orders: {
    getAll: () => api.get('/admin/orders'),
    updateStatus: (id: string, status: string) => api.patch(`/admin/orders/${id}/status`, { status }),
    getById: (id: string) => api.get(`/admin/orders/${id}`),
  },
  
  // Dashboard & Analytics
  dashboard: {
    getStats: () => api.get('/admin/dashboard'),
  },
  
  // Keep-Alive Management
  keepAlive: {
    getStatus: () => api.get('/admin/keep-alive/status'),
    manualPing: () => api.post('/admin/keep-alive/ping'),
    start: () => api.post('/admin/keep-alive/start'),
    stop: () => api.post('/admin/keep-alive/stop'),
  },
  
  // Customer Management
  customers: {
    getAll: () => api.get('/admin/customers'),
    getCount: () => api.get('/admin/customers/count'),
    getById: (id: string) => api.get(`/admin/customers/${id}`),
    block: (id: string) => api.patch(`/admin/customers/${id}/block`),
    unblock: (id: string) => api.patch(`/admin/customers/${id}/unblock`),
  },
  
  // Inventory Management
  inventory: {
    getLowStock: (threshold?: number) => api.get(`/admin/inventory/low-stock${threshold ? `?threshold=${threshold}` : ''}`),
    updateStock: (productId: string, stock: number) => api.patch(`/admin/inventory/${productId}/stock`, { stock }),
    getStockHistory: (productId: string) => api.get(`/admin/inventory/${productId}/history`),
  },
  
  // Payment Management
  payments: {
    getAll: () => api.get('/admin/payments'),
    getStats: () => api.get('/admin/payments/stats'),
    getByOrderId: (orderId: string) => api.get(`/admin/payments/order/${orderId}`),
  },
  
  // System & Settings
  system: {
    getHealth: () => api.get('/health'), // Use simple health endpoint
  },

  // Chat Management
  chat: {
    getLeads: (params?: any) => api.get('/admin/chat/leads', { params }),
    getLeadDetails: (id: string) => api.get(`/admin/chat/leads/${id}`),
    updateLeadStatus: (id: string, status: string) => api.put(`/admin/chat/leads/${id}/status`, { status }),
    getAnalytics: (days?: number) => api.get('/admin/chat/analytics', { params: { days } }),
    exportLeads: (params?: any) => api.get('/admin/chat/export', { params, responseType: 'blob' }),
  },
};

// Types
export interface RegisterData {
  name: string;
  email: string;
  phone: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface CreateOrderData {
  addressId: string;
  paymentMethod: 'cashfree' | 'razorpay';
}

export interface UpdateProfileData {
  name?: string;
  phone?: string;
}

export interface AddressData {
  name: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  isDefault?: boolean;
}

export interface CreateProductData {
  name: string;
  description?: string;
  mrp: number;
  sellingPrice: number;
  stock: number;
  category: string;
  image?: string;
}

export interface UpdateProductData extends Partial<CreateProductData> {}

export default api;