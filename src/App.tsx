import { useEffect, Suspense } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';
import Layout from "./components/layout/Layout";
import AdminLayout from "./components/admin/AdminLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import ScrollToTop from "./components/ScrollToTop";
import ScrollRestoration from "./components/ScrollRestoration";
import SEOAnalytics from "./components/SEOAnalytics";
import PerformanceMonitor from "./components/PerformanceMonitor";
import { SettingsProvider } from "./components/providers/SettingsProvider";
import { useAuthStore } from "./store/authStore";
import { ChatBot } from "./components/chat/ChatBot";
import FloatingContactButtons from "./components/FloatingContactButtons";
import { initializeErrorHandling } from "./utils/errorHandler";
import { initializeResourceHints } from "./utils/preloadCritical";
import { lazyWithPreload } from "./utils/lazyWithPreload";

// Import watermark image
import watermarkImage from "./assets/y7-watermark.png";

// Critical pages (loaded immediately)
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

// Lazy load non-critical pages with preload capability
const About = lazyWithPreload(() => import("./pages/About"));
const Products = lazyWithPreload(() => import("./pages/Products"));
const Shop = lazyWithPreload(() => import("./pages/Shop"));
const Blog = lazyWithPreload(() => import("./pages/Blog"));
const BlogPost = lazyWithPreload(() => import("./pages/BlogPost"));
const Recipes = lazyWithPreload(() => import("./pages/Recipes"));
const Contact = lazyWithPreload(() => import("./pages/Contact"));
const BulkOrders = lazyWithPreload(() => import("./pages/BulkOrders"));
const Export = lazyWithPreload(() => import("./pages/Export"));
const Certifications = lazyWithPreload(() => import("./pages/Certifications"));
const Quality = lazyWithPreload(() => import("./pages/Quality"));
const FAQ = lazyWithPreload(() => import("./pages/FAQ"));
const Careers = lazyWithPreload(() => import("./pages/Careers"));
const Press = lazyWithPreload(() => import("./pages/Press"));
const Partnerships = lazyWithPreload(() => import("./pages/Partnerships"));
const Privacy = lazyWithPreload(() => import("./pages/Privacy"));
const Terms = lazyWithPreload(() => import("./pages/Terms"));
const Refund = lazyWithPreload(() => import("./pages/Refund"));
const Shipping = lazyWithPreload(() => import("./pages/Shipping"));

// Category Pages - HIGH PRIORITY with instant preload
const CategoryPage = lazyWithPreload(() => import("./pages/CategoryPage"));
const HotSauces = lazyWithPreload(() => import("./pages/categories/HotSauces"));
const Mayonnaise = lazyWithPreload(() => import("./pages/categories/Mayonnaise"));
const International = lazyWithPreload(() => import("./pages/categories/International"));
const BBQSauces = lazyWithPreload(() => import("./pages/categories/BBQSauces"));

// Auth Pages
const Login = lazyWithPreload(() => import("./pages/auth/Login"));
const Register = lazyWithPreload(() => import("./pages/auth/Register"));

// Protected Pages
const Cart = lazyWithPreload(() => import("./pages/Cart"));
const Checkout = lazyWithPreload(() => import("./pages/Checkout"));
const Profile = lazyWithPreload(() => import("./pages/Profile"));
const Orders = lazyWithPreload(() => import("./pages/Orders"));
const Wishlist = lazyWithPreload(() => import("./pages/Wishlist"));

// Admin Pages
const AdminDashboard = lazyWithPreload(() => import("./pages/admin/AdminDashboard"));

// Product Pages - HIGH PRIORITY
const ProductDetail = lazyWithPreload(() => import("./pages/ProductDetail"));

// Payment Pages
const PaymentSuccess = lazyWithPreload(() => import("./pages/payment/PaymentSuccess"));
const PaymentFailed = lazyWithPreload(() => import("./pages/payment/PaymentFailed"));
const PaymentLoading = lazyWithPreload(() => import("./pages/payment/PaymentLoading"));

// Optimized QueryClient with aggressive caching
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 10 * 60 * 1000, // 10 minutes
      gcTime: 30 * 60 * 1000, // 30 minutes
      retry: 1,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
    },
  },
});

// Loading component for Suspense
const PageLoader = () => (
  <div className="min-h-screen bg-black flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold"></div>
  </div>
);

const App = () => {
  const { checkAuth, isAuthenticated } = useAuthStore();
  const gaTrackingId = import.meta.env.VITE_GA_TRACKING_ID || '';
  const gtmId = import.meta.env.VITE_GTM_ID || '';

  useEffect(() => {
    checkAuth();
    
    // Initialize error handling for browser extension errors
    initializeErrorHandling();
    
    // Initialize resource hints and preloading
    initializeResourceHints();
    
    // AGGRESSIVE PRELOADING STRATEGY - Preload ALL pages in priority order
    // This makes the ENTIRE website feel instant
    if ('requestIdleCallback' in window) {
      // Priority 1: Category pages (most visited)
      requestIdleCallback(() => {
        CategoryPage.preload();
        HotSauces.preload();
        Mayonnaise.preload();
        International.preload();
        BBQSauces.preload();
      }, { timeout: 1000 });
      
      // Priority 2: Product & Shop pages
      requestIdleCallback(() => {
        Products.preload();
        Shop.preload();
        ProductDetail.preload();
      }, { timeout: 2000 });
      
      // Priority 3: Info pages
      requestIdleCallback(() => {
        About.preload();
        Contact.preload();
        FAQ.preload();
        Blog.preload();
      }, { timeout: 3000 });
      
      // Priority 4: Secondary pages
      requestIdleCallback(() => {
        Recipes.preload();
        BulkOrders.preload();
        Export.preload();
        Certifications.preload();
        Quality.preload();
      }, { timeout: 4000 });
      
      // Priority 5: Legal & misc pages
      requestIdleCallback(() => {
        Privacy.preload();
        Terms.preload();
        Refund.preload();
        Shipping.preload();
        Careers.preload();
        Press.preload();
        Partnerships.preload();
      }, { timeout: 5000 });
      
      // Priority 6: Auth pages (if not authenticated)
      if (!isAuthenticated) {
        requestIdleCallback(() => {
          Login.preload();
          Register.preload();
        }, { timeout: 6000 });
      }
      
      // Priority 7: User pages (if authenticated)
      if (isAuthenticated) {
        requestIdleCallback(() => {
          Cart.preload();
          Profile.preload();
          Orders.preload();
          Wishlist.preload();
        }, { timeout: 6000 });
      }
    } else {
      // Fallback for browsers without requestIdleCallback
      setTimeout(() => {
        HotSauces.preload();
        Mayonnaise.preload();
        International.preload();
        BBQSauces.preload();
        Products.preload();
        Shop.preload();
      }, 1000);
    }
    
    // Set watermark image as CSS custom property
    document.documentElement.style.setProperty('--watermark-image', `url(${watermarkImage})`);
    
    // Performance optimization: Remove unused CSS
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => {
        // Clean up any unused styles
        document.querySelectorAll('style[data-vite-dev-id]').forEach(el => {
          if (!el.textContent?.trim()) el.remove();
        });
      });
    }
  }, [checkAuth, isAuthenticated]);

  return (
    <QueryClientProvider client={queryClient}>
      <HelmetProvider>
        <TooltipProvider>
          <SettingsProvider>
            <div className="prevent-zoom">
              <Toaster />
              <Sonner />
              <BrowserRouter>
            <SEOAnalytics 
              trackingId={gaTrackingId}
              gtmId={gtmId}
              enableGoogleAnalytics={Boolean(gaTrackingId)}
              enableGoogleTagManager={Boolean(gtmId)}
            />
            <ScrollToTop />
            <ScrollRestoration />
            <PerformanceMonitor />
            <ChatBot />
            <FloatingContactButtons />
            <Routes>
              {/* Auth Routes (No Layout) */}
              <Route path="/auth/login" element={
                <Suspense fallback={<PageLoader />}>
                  <Login />
                </Suspense>
              } />
              <Route path="/auth/register" element={
                <Suspense fallback={<PageLoader />}>
                  <Register />
                </Suspense>
              } />

              {/* Public Routes (With Layout) */}
              <Route path="/" element={<Layout><Index /></Layout>} />
              <Route path="/about" element={
                <Layout>
                  <Suspense fallback={<PageLoader />}>
                    <About />
                  </Suspense>
                </Layout>
              } />
              <Route path="/products" element={
                <Layout>
                  <Suspense fallback={<PageLoader />}>
                    <Products />
                  </Suspense>
                </Layout>
              } />
              <Route path="/products/:slug" element={
                <Layout>
                  <Suspense fallback={<PageLoader />}>
                    <ProductDetail />
                  </Suspense>
                </Layout>
              } />
              <Route path="/shop" element={
                <Layout>
                  <Suspense fallback={<PageLoader />}>
                    <Shop />
                  </Suspense>
                </Layout>
              } />
              <Route path="/blog" element={
                <Layout>
                  <Suspense fallback={<PageLoader />}>
                    <Blog />
                  </Suspense>
                </Layout>
              } />
              <Route path="/blog/:slug" element={
                <Layout>
                  <Suspense fallback={<PageLoader />}>
                    <BlogPost />
                  </Suspense>
                </Layout>
              } />
              <Route path="/recipes" element={
                <Layout>
                  <Suspense fallback={<PageLoader />}>
                    <Recipes />
                  </Suspense>
                </Layout>
              } />
              <Route path="/contact" element={
                <Layout>
                  <Suspense fallback={<PageLoader />}>
                    <Contact />
                  </Suspense>
                </Layout>
              } />
              <Route path="/bulk-orders" element={
                <Layout>
                  <Suspense fallback={<PageLoader />}>
                    <BulkOrders />
                  </Suspense>
                </Layout>
              } />
              <Route path="/export" element={
                <Layout>
                  <Suspense fallback={<PageLoader />}>
                    <Export />
                  </Suspense>
                </Layout>
              } />
              <Route path="/certifications" element={
                <Layout>
                  <Suspense fallback={<PageLoader />}>
                    <Certifications />
                  </Suspense>
                </Layout>
              } />
              <Route path="/quality" element={
                <Layout>
                  <Suspense fallback={<PageLoader />}>
                    <Quality />
                  </Suspense>
                </Layout>
              } />
              <Route path="/faq" element={
                <Layout>
                  <Suspense fallback={<PageLoader />}>
                    <FAQ />
                  </Suspense>
                </Layout>
              } />
              <Route path="/careers" element={
                <Layout>
                  <Suspense fallback={<PageLoader />}>
                    <Careers />
                  </Suspense>
                </Layout>
              } />
              <Route path="/press" element={
                <Layout>
                  <Suspense fallback={<PageLoader />}>
                    <Press />
                  </Suspense>
                </Layout>
              } />
              <Route path="/partnerships" element={
                <Layout>
                  <Suspense fallback={<PageLoader />}>
                    <Partnerships />
                  </Suspense>
                </Layout>
              } />
              <Route path="/privacy" element={
                <Layout>
                  <Suspense fallback={<PageLoader />}>
                    <Privacy />
                  </Suspense>
                </Layout>
              } />
              <Route path="/terms" element={
                <Layout>
                  <Suspense fallback={<PageLoader />}>
                    <Terms />
                  </Suspense>
                </Layout>
              } />
              <Route path="/refund" element={
                <Layout>
                  <Suspense fallback={<PageLoader />}>
                    <Refund />
                  </Suspense>
                </Layout>
              } />
              <Route path="/shipping" element={
                <Layout>
                  <Suspense fallback={<PageLoader />}>
                    <Shipping />
                  </Suspense>
                </Layout>
              } />

              // Category Routes
              <Route path="/category/:category" element={
                <Layout>
                  <Suspense fallback={<PageLoader />}>
                    <CategoryPage />
                  </Suspense>
                </Layout>
              } />
              <Route path="/hot-sauces" element={
                <Layout>
                  <Suspense fallback={<PageLoader />}>
                    <HotSauces />
                  </Suspense>
                </Layout>
              } />
              <Route path="/mayonnaise" element={
                <Layout>
                  <Suspense fallback={<PageLoader />}>
                    <Mayonnaise />
                  </Suspense>
                </Layout>
              } />
              <Route path="/international" element={
                <Layout>
                  <Suspense fallback={<PageLoader />}>
                    <International />
                  </Suspense>
                </Layout>
              } />
              <Route path="/bbq-sauces" element={
                <Layout>
                  <Suspense fallback={<PageLoader />}>
                    <BBQSauces />
                  </Suspense>
                </Layout>
              } />

              {/* Protected Routes (With Layout) */}
              <Route path="/cart" element={
                <ProtectedRoute>
                  <Layout>
                    <Suspense fallback={<PageLoader />}>
                      <Cart />
                    </Suspense>
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/checkout" element={
                <ProtectedRoute>
                  <Layout>
                    <Suspense fallback={<PageLoader />}>
                      <Checkout />
                    </Suspense>
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <Layout>
                    <Suspense fallback={<PageLoader />}>
                      <Profile />
                    </Suspense>
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/orders" element={
                <ProtectedRoute>
                  <Layout>
                    <Suspense fallback={<PageLoader />}>
                      <Orders />
                    </Suspense>
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/wishlist" element={
                <ProtectedRoute>
                  <Layout>
                    <Suspense fallback={<PageLoader />}>
                      <Wishlist />
                    </Suspense>
                  </Layout>
                </ProtectedRoute>
              } />

              {/* Payment Routes (No Layout) */}
              <Route path="/payment/success" element={
                <ProtectedRoute>
                  <Suspense fallback={<PageLoader />}>
                    <PaymentSuccess />
                  </Suspense>
                </ProtectedRoute>
              } />
              <Route path="/payment/failed" element={
                <ProtectedRoute>
                  <Suspense fallback={<PageLoader />}>
                    <PaymentFailed />
                  </Suspense>
                </ProtectedRoute>
              } />
              <Route path="/payment/loading" element={
                <ProtectedRoute>
                  <Suspense fallback={<PageLoader />}>
                    <PaymentLoading />
                  </Suspense>
                </ProtectedRoute>
              } />

              {/* Admin Routes (With Admin Layout) */}
              <Route path="/admin/*" element={
                <ProtectedRoute requireAdmin>
                  <Suspense fallback={<PageLoader />}>
                    <AdminLayout />
                  </Suspense>
                </ProtectedRoute>
              } />

              {/* 404 Route */}
              <Route path="*" element={<Layout><NotFound /></Layout>} />
            </Routes>
          </BrowserRouter>
        </div>
        </SettingsProvider>
      </TooltipProvider>
    </HelmetProvider>
  </QueryClientProvider>
  );
};

export default App;
