import { useEffect } from 'react';
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
import { useAuthStore } from "./store/authStore";

// Development helper (remove in production)
import './utils/adminHelper';

// Public Pages
import Index from "./pages/Index";
import About from "./pages/About";
import Products from "./pages/Products";
import Shop from "./pages/Shop";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import Recipes from "./pages/Recipes";
import Contact from "./pages/Contact";
import BulkOrders from "./pages/BulkOrders";
import Quality from "./pages/Quality";
import FAQ from "./pages/FAQ";
import Careers from "./pages/Careers";
import Press from "./pages/Press";
import Partnerships from "./pages/Partnerships";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Refund from "./pages/Refund";
import Shipping from "./pages/Shipping";
import NotFound from "./pages/NotFound";

// Category Pages
import HotSauces from "./pages/categories/HotSauces";
import Mayonnaise from "./pages/categories/Mayonnaise";
import International from "./pages/categories/International";
import BBQSauces from "./pages/categories/BBQSauces";

// Auth Pages
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

// Protected Pages
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Profile from "./pages/Profile";
import Orders from "./pages/Orders";
import Wishlist from "./pages/Wishlist";

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";

// Product Pages
import ProductDetail from "./pages/ProductDetail";

// Payment Pages
import PaymentSuccess from "./pages/payment/PaymentSuccess";
import PaymentFailed from "./pages/payment/PaymentFailed";
import PaymentLoading from "./pages/payment/PaymentLoading";

const queryClient = new QueryClient();

const App = () => {
  const { checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <QueryClientProvider client={queryClient}>
      <HelmetProvider>
        <TooltipProvider>
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
            <Routes>
              {/* Auth Routes (No Layout) */}
              <Route path="/auth/login" element={<Login />} />
              <Route path="/auth/register" element={<Register />} />

              {/* Public Routes (With Layout) */}
              <Route path="/" element={<Layout><Index /></Layout>} />
              <Route path="/about" element={<Layout><About /></Layout>} />
              <Route path="/products" element={<Layout><Products /></Layout>} />
              <Route path="/products/:slug" element={<Layout><ProductDetail /></Layout>} />
              <Route path="/shop" element={<Layout><Shop /></Layout>} />
              <Route path="/blog" element={<Layout><Blog /></Layout>} />
              <Route path="/blog/:slug" element={<Layout><BlogPost /></Layout>} />
              <Route path="/recipes" element={<Layout><Recipes /></Layout>} />
              <Route path="/contact" element={<Layout><Contact /></Layout>} />
              <Route path="/bulk-orders" element={<Layout><BulkOrders /></Layout>} />
              <Route path="/quality" element={<Layout><Quality /></Layout>} />
              <Route path="/faq" element={<Layout><FAQ /></Layout>} />
              <Route path="/careers" element={<Layout><Careers /></Layout>} />
              <Route path="/press" element={<Layout><Press /></Layout>} />
              <Route path="/partnerships" element={<Layout><Partnerships /></Layout>} />
              <Route path="/privacy" element={<Layout><Privacy /></Layout>} />
              <Route path="/terms" element={<Layout><Terms /></Layout>} />
              <Route path="/refund" element={<Layout><Refund /></Layout>} />
              <Route path="/shipping" element={<Layout><Shipping /></Layout>} />

              {/* Category Routes */}
              <Route path="/hot-sauces" element={<Layout><HotSauces /></Layout>} />
              <Route path="/mayonnaise" element={<Layout><Mayonnaise /></Layout>} />
              <Route path="/international" element={<Layout><International /></Layout>} />
              <Route path="/bbq-sauces" element={<Layout><BBQSauces /></Layout>} />

              {/* Protected Routes (With Layout) */}
              <Route path="/cart" element={
                <ProtectedRoute>
                  <Layout><Cart /></Layout>
                </ProtectedRoute>
              } />
              <Route path="/checkout" element={
                <ProtectedRoute>
                  <Layout><Checkout /></Layout>
                </ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <Layout><Profile /></Layout>
                </ProtectedRoute>
              } />
              <Route path="/orders" element={
                <ProtectedRoute>
                  <Layout><Orders /></Layout>
                </ProtectedRoute>
              } />
              <Route path="/wishlist" element={
                <ProtectedRoute>
                  <Layout><Wishlist /></Layout>
                </ProtectedRoute>
              } />

              {/* Payment Routes (No Layout) */}
              <Route path="/payment/success" element={
                <ProtectedRoute>
                  <PaymentSuccess />
                </ProtectedRoute>
              } />
              <Route path="/payment/failed" element={
                <ProtectedRoute>
                  <PaymentFailed />
                </ProtectedRoute>
              } />
              <Route path="/payment/loading" element={
                <ProtectedRoute>
                  <PaymentLoading />
                </ProtectedRoute>
              } />

              {/* Admin Routes (With Admin Layout) */}
              <Route path="/admin/*" element={
                <ProtectedRoute requireAdmin>
                  <AdminLayout />
                </ProtectedRoute>
              } />

              {/* 404 Route */}
              <Route path="*" element={<Layout><NotFound /></Layout>} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </HelmetProvider>
    </QueryClientProvider>
  );
};

export default App;
