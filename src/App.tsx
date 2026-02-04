import { useEffect, lazy, Suspense } from 'react';
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
import { initializeErrorHandling } from "./utils/errorHandler";

// Import watermark image
import watermarkImage from "./assets/y7-watermark.png";

// Development helper (remove in production)
import './utils/adminHelper';

// Critical pages (loaded immediately)
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

// Lazy load non-critical pages
const About = lazy(() => import("./pages/About"));
const Products = lazy(() => import("./pages/Products"));
const Shop = lazy(() => import("./pages/Shop"));
const Blog = lazy(() => import("./pages/Blog"));
const BlogPost = lazy(() => import("./pages/BlogPost"));
const Recipes = lazy(() => import("./pages/Recipes"));
const Contact = lazy(() => import("./pages/Contact"));
const BulkOrders = lazy(() => import("./pages/BulkOrders"));
const Export = lazy(() => import("./pages/Export"));
const Certifications = lazy(() => import("./pages/Certifications"));
const Quality = lazy(() => import("./pages/Quality"));
const FAQ = lazy(() => import("./pages/FAQ"));
const Careers = lazy(() => import("./pages/Careers"));
const Press = lazy(() => import("./pages/Press"));
const Partnerships = lazy(() => import("./pages/Partnerships"));
const Privacy = lazy(() => import("./pages/Privacy"));
const Terms = lazy(() => import("./pages/Terms"));
const Refund = lazy(() => import("./pages/Refund"));
const Shipping = lazy(() => import("./pages/Shipping"));

// Category Pages
const HotSauces = lazy(() => import("./pages/categories/HotSauces"));
const Mayonnaise = lazy(() => import("./pages/categories/Mayonnaise"));
const International = lazy(() => import("./pages/categories/International"));
const BBQSauces = lazy(() => import("./pages/categories/BBQSauces"));

// Auth Pages
const Login = lazy(() => import("./pages/auth/Login"));
const Register = lazy(() => import("./pages/auth/Register"));

// Protected Pages
const Cart = lazy(() => import("./pages/Cart"));
const Checkout = lazy(() => import("./pages/Checkout"));
const Profile = lazy(() => import("./pages/Profile"));
const Orders = lazy(() => import("./pages/Orders"));
const Wishlist = lazy(() => import("./pages/Wishlist"));

// Admin Pages
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));

// Product Pages
const ProductDetail = lazy(() => import("./pages/ProductDetail"));

// Payment Pages
const PaymentSuccess = lazy(() => import("./pages/payment/PaymentSuccess"));
const PaymentFailed = lazy(() => import("./pages/payment/PaymentFailed"));
const PaymentLoading = lazy(() => import("./pages/payment/PaymentLoading"));

// Optimized QueryClient with better defaults
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
      retry: 1,
      refetchOnWindowFocus: false,
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
  const { checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
    
    // Initialize error handling for browser extension errors
    initializeErrorHandling();
    
    // Set watermark image as CSS custom property
    document.documentElement.style.setProperty('--watermark-image', `url(${watermarkImage})`);
  }, [checkAuth]);

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
              trackingId="G-XXXXXXXXXX" 
              enableGoogleAnalytics={true}
              enableGoogleTagManager={true}
            />
            <ScrollToTop />
            <ScrollRestoration />
            <PerformanceMonitor />
            <ChatBot />
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

              {/* Category Routes */}
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
