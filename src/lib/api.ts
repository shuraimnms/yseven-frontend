import axios from 'axios';
import Cookies from 'js-cookie';

// Get API base URL from environment or default to production for deployment
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://yseven-backend.onrender.com/api/v1';

// Export the base URL for use in other files
export const getApiBaseUrl = () => API_BASE_URL;

// Create axios instance with production-ready configuration
export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  timeout: 30000, // 30 second timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token and logging
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Log API requests in development
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

// Response interceptor to handle token refresh and errors
api.interceptors.response.use(
  (response) => {
    // Log successful responses in development
    if (import.meta.env.DEV) {
      console.log(`API Response: ${response.status} ${response.config.url}`);
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Handle network errors
    if (!error.response) {
      console.error('Network Error:', error.message);
      return Promise.reject(new Error('Network error. Please check your connection.'));
    }

    // Handle 401 errors with token refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = Cookies.get('refreshToken');
        if (refreshToken) {
          const response = await axios.post(
            `${API_BASE_URL}/auth/refresh`,
            {},
            { 
              withCredentials: true,
              timeout: 10000 // 10 second timeout for refresh
            }
          );

          if (response.data.success) {
            return api(originalRequest);
          }
        }
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        // Refresh failed, redirect to login
        Cookies.remove('accessToken');
        Cookies.remove('refreshToken');
        
        // Only redirect if we're not already on the login page
        if (window.location.pathname !== '/auth/login') {
          window.location.href = '/auth/login';
        }
      }
    }

    // Handle other errors
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
  
  // Analytics & Dashboard
  analytics: {
    getDashboard: (timeRange?: string) => api.get(`/admin/analytics/dashboard${timeRange ? `?range=${timeRange}` : ''}`),
    getRevenue: (timeRange?: string) => api.get(`/admin/analytics/revenue${timeRange ? `?range=${timeRange}` : ''}`),
    getOrderStats: (timeRange?: string) => api.get(`/admin/analytics/orders${timeRange ? `?range=${timeRange}` : ''}`),
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
    getStats: () => api.get('/admin/system/stats'),
    getLogs: (type?: string) => api.get(`/admin/system/logs${type ? `?type=${type}` : ''}`),
    getHealth: () => api.get('/admin/system/health'),
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