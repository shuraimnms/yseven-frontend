import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AdminRoutes from '@/routes/AdminRoutes';
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Package, 
  FolderOpen, 
  Users, 
  MessageSquare, 
  BookOpen, 
  Home, 
  Search, 
  Tag, 
  Warehouse, 
  CreditCard, 
  Settings, 
  UserCog, 
  FileText, 
  Bell, 
  Menu, 
  X, 
  LogOut,
  User,
  Shield
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/authStore';

const sidebarItems = [
  { 
    id: 'dashboard', 
    label: 'Dashboard', 
    icon: LayoutDashboard, 
    path: '/admin',
    badge: null
  },
  { 
    id: 'orders', 
    label: 'Orders', 
    icon: ShoppingCart, 
    path: '/admin/orders',
    badge: '12'
  },
  { 
    id: 'products', 
    label: 'Products', 
    icon: Package, 
    path: '/admin/products',
    badge: null
  },
  { 
    id: 'categories', 
    label: 'Categories', 
    icon: FolderOpen, 
    path: '/admin/categories',
    badge: null
  },
  { 
    id: 'customers', 
    label: 'Customers', 
    icon: Users, 
    path: '/admin/customers',
    badge: null
  },
  { 
    id: 'contact-requests', 
    label: 'Contact Requests', 
    icon: MessageSquare, 
    path: '/admin/contact-requests',
    badge: '5'
  },
  { 
    id: 'blog-recipes', 
    label: 'Blog & Recipes', 
    icon: BookOpen, 
    path: '/admin/blog-recipes',
    badge: null
  },
  { 
    id: 'homepage-content', 
    label: 'Homepage Content', 
    icon: Home, 
    path: '/admin/homepage-content',
    badge: null
  },
  { 
    id: 'seo-manager', 
    label: 'SEO Manager', 
    icon: Search, 
    path: '/admin/seo-manager',
    badge: null
  },
  { 
    id: 'coupons', 
    label: 'Coupons', 
    icon: Tag, 
    path: '/admin/coupons',
    badge: null
  },
  { 
    id: 'inventory', 
    label: 'Inventory', 
    icon: Warehouse, 
    path: '/admin/inventory',
    badge: '3'
  },
  { 
    id: 'payments', 
    label: 'Payments', 
    icon: CreditCard, 
    path: '/admin/payments',
    badge: null
  },
  { 
    id: 'settings', 
    label: 'Settings', 
    icon: Settings, 
    path: '/admin/settings',
    badge: null
  },
  { 
    id: 'admin-users', 
    label: 'Admin Users', 
    icon: UserCog, 
    path: '/admin/admin-users',
    badge: null
  },
  { 
    id: 'logs', 
    label: 'Logs & Security', 
    icon: FileText, 
    path: '/admin/logs',
    badge: null
  }
];

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState(3);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuthStore();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/auth/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const isActive = (path: string) => {
    if (path === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-obsidian text-cream">
      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 w-72 bg-charcoal border-r border-gold/20 transform transition-transform duration-300 ease-in-out",
        sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        {/* Sidebar Header */}
        <div className="flex items-center justify-between h-20 px-6 border-b border-gold/20">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-gold to-yellow-600 rounded-lg flex items-center justify-center">
              <span className="text-obsidian font-bold text-lg">Y7</span>
            </div>
            <div>
              <h1 className="text-lg font-semibold text-cream">Admin Panel</h1>
              <p className="text-xs text-cream/60">Enterprise Dashboard</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden text-cream/60 hover:text-cream"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Admin Info */}
        <div className="p-6 border-b border-gold/10">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gold/20 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-gold" />
            </div>
            <div>
              <p className="font-medium text-cream">{user?.name}</p>
              <div className="flex items-center space-x-2">
                <Shield className="w-3 h-3 text-gold" />
                <span className="text-xs text-gold capitalize">{user?.role}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            
            return (
              <button
                key={item.id}
                onClick={() => {
                  navigate(item.path);
                  setSidebarOpen(false);
                }}
                className={cn(
                  "w-full flex items-center justify-between px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200",
                  active
                    ? "bg-gold/20 text-gold border border-gold/30"
                    : "text-cream/70 hover:text-cream hover:bg-gold/10"
                )}
              >
                <div className="flex items-center space-x-3">
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <Badge 
                    variant="secondary" 
                    className="bg-gold/20 text-gold text-xs px-2 py-1"
                  >
                    {item.badge}
                  </Badge>
                )}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-gold/20">
          <Button
            onClick={handleLogout}
            variant="ghost"
            className="w-full justify-start text-cream/70 hover:text-red-400 hover:bg-red-500/10"
          >
            <LogOut className="w-4 h-4 mr-3" />
            Sign Out
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:ml-72">
        {/* Top Header */}
        <header className="sticky top-0 z-40 bg-obsidian/95 backdrop-blur-sm border-b border-gold/20">
          <div className="flex items-center justify-between h-16 px-6">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden text-cream/60 hover:text-cream"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="w-5 h-5" />
              </Button>
              <div>
                <h2 className="text-lg font-semibold text-cream">
                  {sidebarItems.find(item => isActive(item.path))?.label || 'Dashboard'}
                </h2>
                <p className="text-sm text-cream/60">
                  {new Date().toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <Button
                variant="ghost"
                size="sm"
                className="relative text-cream/60 hover:text-cream"
              >
                <Bell className="w-5 h-5" />
                {notifications > 0 && (
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center text-xs"
                  >
                    {notifications}
                  </Badge>
                )}
              </Button>

              {/* User Menu */}
              <div className="flex items-center space-x-3 px-3 py-2 bg-charcoal rounded-lg border border-gold/20">
                <div className="w-8 h-8 bg-gold/20 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-gold" />
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm font-medium text-cream">{user?.name}</p>
                  <p className="text-xs text-cream/60 capitalize">{user?.role}</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          <AdminRoutes />
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-obsidian/50 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default AdminLayout;