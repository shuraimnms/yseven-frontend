import { Routes, Route } from 'react-router-dom';
import AdminDashboard from '@/pages/admin/AdminDashboard';
import OrdersPage from '@/pages/admin/Orders';
import ProductsPage from '@/pages/admin/Products';

// Placeholder components for other admin pages
const CategoriesPage = () => <div className="p-6 text-cream">Categories Management - Coming Soon</div>;
const CustomersPage = () => <div className="p-6 text-cream">Customers Management - Coming Soon</div>;
const ContactRequestsPage = () => <div className="p-6 text-cream">Contact Requests - Coming Soon</div>;
const BlogRecipesPage = () => <div className="p-6 text-cream">Blog & Recipes Management - Coming Soon</div>;
const HomepageContentPage = () => <div className="p-6 text-cream">Homepage Content Management - Coming Soon</div>;
const SEOManagerPage = () => <div className="p-6 text-cream">SEO Manager - Coming Soon</div>;
const CouponsPage = () => <div className="p-6 text-cream">Coupons Management - Coming Soon</div>;
const InventoryPage = () => <div className="p-6 text-cream">Inventory Management - Coming Soon</div>;
const PaymentsPage = () => <div className="p-6 text-cream">Payments Management - Coming Soon</div>;
const SettingsPage = () => <div className="p-6 text-cream">Settings - Coming Soon</div>;
const AdminUsersPage = () => <div className="p-6 text-cream">Admin Users Management - Coming Soon</div>;
const LogsPage = () => <div className="p-6 text-cream">Logs & Security - Coming Soon</div>;

const AdminRoutes = () => {
  return (
    <Routes>
      <Route index element={<AdminDashboard />} />
      <Route path="orders" element={<OrdersPage />} />
      <Route path="products" element={<ProductsPage />} />
      <Route path="categories" element={<CategoriesPage />} />
      <Route path="customers" element={<CustomersPage />} />
      <Route path="contact-requests" element={<ContactRequestsPage />} />
      <Route path="blog-recipes" element={<BlogRecipesPage />} />
      <Route path="homepage-content" element={<HomepageContentPage />} />
      <Route path="seo-manager" element={<SEOManagerPage />} />
      <Route path="coupons" element={<CouponsPage />} />
      <Route path="inventory" element={<InventoryPage />} />
      <Route path="payments" element={<PaymentsPage />} />
      <Route path="settings" element={<SettingsPage />} />
      <Route path="admin-users" element={<AdminUsersPage />} />
      <Route path="logs" element={<LogsPage />} />
    </Routes>
  );
};

export default AdminRoutes;