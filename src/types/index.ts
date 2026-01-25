export interface User {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: 'customer' | 'admin';
  emailVerified: boolean;
  phoneVerified: boolean;
  addresses: Address[];
  wishlist: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Address {
  _id: string;
  name: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  isDefault: boolean;
}

export interface Product {
  _id: string;
  name: string;
  slug: string;
  sku: string;
  description?: string;
  mrp: number;
  sellingPrice: number;
  stock: number;
  category: string;
  image?: string;
  isBestSeller: boolean;
  deletedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  itemCount: number;
}

export interface OrderItem {
  product: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface OrderPricing {
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
}

export interface PaymentInfo {
  provider: 'cashfree' | 'razorpay' | null;
  status: 'PENDING' | 'pending' | 'paid' | 'failed';
  providerOrderId?: string;
}

export interface Order {
  _id: string;
  orderId: string;
  user: string;
  items: OrderItem[];
  pricing: OrderPricing;
  customer: {
    email: string;
    phone: string;
  };
  shippingAddress: Address;
  payment: PaymentInfo;
  status: 'PENDING' | 'created' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

export interface SEOData {
  title: string;
  description: string;
  keywords?: string;
  canonical?: string;
  path?: string;
  
  // Open Graph
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogType?: string;
  ogSiteName?: string;
  ogLocale?: string;
  
  // Twitter
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  twitterCard?: string;
  twitterSite?: string;
  
  // Additional Meta
  author?: string;
  publisher?: string;
  robots?: string;
  googlebot?: string;
  language?: string;
  revisitAfter?: string;
  rating?: string;
  distribution?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image: string;
  category: string;
  tags: string[];
  author: string;
  publishedAt: string;
  seo: SEOData;
}