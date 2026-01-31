import { Routes, Route } from 'react-router-dom';
import AdminDashboard from '@/pages/admin/AdminDashboard';
import OrdersPage from '@/pages/admin/Orders';
import ProductsPage from '@/pages/admin/Products';
import UsersPage from '@/pages/admin/Users';
import PaymentsPage from '@/pages/admin/Payments';
import ContactRequestsPage from '@/pages/admin/ContactRequests';
import ChatLeadsPage from '@/pages/admin/ChatLeads';
import SettingsPage from '@/pages/admin/Settings';

const AdminRoutes = () => {
  return (
    <Routes>
      <Route index element={<AdminDashboard />} />
      <Route path="products" element={<ProductsPage />} />
      <Route path="orders" element={<OrdersPage />} />
      <Route path="users" element={<UsersPage />} />
      <Route path="payments" element={<PaymentsPage />} />
      <Route path="contact-requests" element={<ContactRequestsPage />} />
      <Route path="chat-leads" element={<ChatLeadsPage />} />
      <Route path="settings" element={<SettingsPage />} />
    </Routes>
  );
};

export default AdminRoutes;