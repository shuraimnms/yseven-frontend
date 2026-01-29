import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  AlertTriangle,
  Eye,
  RefreshCw,
  Wifi,
  WifiOff,
  Activity,
  CreditCard,
  Server,
  Clock
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { adminAPI } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { useAuthStore } from '@/store/authStore';
import { cn } from '@/lib/utils';
import SEO from '@/components/SEO';
import DebugPanel from '@/components/admin/DebugPanel';

interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  totalProducts: number;
  activeUsers: number;
  serverStatus: 'online' | 'offline';
  lastOrderTime: string | null;
  paymentGatewayStatus: {
    cashfree: 'online' | 'offline';
    razorpay: 'online' | 'offline';
  };
  recentOrders: RecentOrder[];
  lowStockProducts: LowStockProduct[];
  pendingOrders: number;
}

interface RecentOrder {
  _id: string;
  orderId: string;
  customer: {
    email: string;
    phone?: string;
  };
  pricing: {
    total: number;
  };
  status: string;
  createdAt: string;
  items: Array<{
    name: string;
    quantity: number;
  }>;
}

interface LowStockProduct {
  _id: string;
  name: string;
  stock: number;
  category: string;
  sellingPrice: number;
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [serverHealth, setServerHealth] = useState<'online' | 'offline' | 'checking'>('checking');
  const { toast } = useToast();
  const { isAuthenticated, user } = useAuthStore();

  // Health check function
  const checkServerHealth = async (): Promise<boolean> => {
    try {
      // Use the simple health endpoint that doesn't require auth
      const baseUrl = import.meta.env.VITE_API_BASE_URL || 'https://yseven-backend.onrender.com';
      const response = await fetch(`${baseUrl.replace('/api/v1', '')}/health`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        return data.status === 'ok';
      }
      return false;
    } catch (error) {
      console.error('Health check failed:', error);
      return false;
    }
  };

  // Fetch real dashboard data
  const fetchDashboardData = async (silent = false) => {
    try {
      if (!silent) {
        setIsLoading(true);
      } else {
        setIsRefreshing(true);
      }

      // Check server health first
      setServerHealth('checking');
      const isHealthy = await checkServerHealth();
      setServerHealth(isHealthy ? 'online' : 'offline');

      if (!isHealthy) {
        throw new Error('Server is not responding');
      }

      console.log('Dashboard: Starting data fetch...');

      // Fetch real analytics data from the backend using proper API
      console.log('Dashboard: Fetching analytics...');
      const analyticsResponse = await adminAPI.analytics.getDashboard();
      console.log('Dashboard: Analytics response:', analyticsResponse.data);
      const analytics = analyticsResponse.data.data;

      // Fetch recent orders using proper API
      console.log('Dashboard: Fetching orders...');
      const ordersResponse = await adminAPI.orders.getAll();
      console.log('Dashboard: Orders response:', ordersResponse.data);
      const allOrders = ordersResponse.data.data?.orders || ordersResponse.data.data || [];
      const recentOrders = allOrders
        .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5);
      
      const lastOrderTime = recentOrders.length > 0 ? recentOrders[0].createdAt : null;

      // Fetch low stock products using proper API
      console.log('Dashboard: Fetching products...');
      const productsResponse = await adminAPI.products.getAll();
      console.log('Dashboard: Products response:', productsResponse.data);
      const allProducts = productsResponse.data.data?.products || productsResponse.data.data || [];
      const lowStockProducts = allProducts
        .filter((product: any) => (product.stock || 0) < 10)
        .slice(0, 5);

      // Check payment gateway status (real implementation would ping actual gateways)
      const paymentGatewayStatus = {
        cashfree: 'online' as const,
        razorpay: 'online' as const
      };

      // Set real stats from analytics
      setStats({
        totalOrders: analytics.orders?.total || 0,
        totalRevenue: analytics.revenue?.allTime || 0,
        totalProducts: analytics.inventory?.totalProducts || 0,
        activeUsers: analytics.customers?.total || 0,
        pendingOrders: analytics.orders?.pending || 0,
        serverStatus: 'online',
        lastOrderTime,
        paymentGatewayStatus,
        recentOrders,
        lowStockProducts
      });

      setLastUpdated(new Date());
      console.log('Dashboard: Data fetch completed successfully');
      
    } catch (error: any) {
      console.error('Dashboard fetch error:', error);
      
      let errorMessage = 'Failed to fetch dashboard data';
      
      // Handle different types of errors
      if (error.message === 'Server is not responding') {
        errorMessage = 'Server is offline or not reachable';
      } else if (error.response?.status === 401) {
        errorMessage = 'Authentication failed. Please login again.';
        // Don't redirect here, let the axios interceptor handle it
      } else if (error.response?.status === 403) {
        errorMessage = 'Access denied. Admin privileges required.';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message?.includes('Network Error')) {
        errorMessage = 'Network error. Please check your connection.';
      } else if (error.message?.includes('JSON')) {
        errorMessage = 'Server returned invalid response. This might be a routing issue.';
        console.error('JSON parsing error details:', {
          url: error.config?.url,
          method: error.config?.method,
          status: error.response?.status,
          headers: error.response?.headers,
          data: typeof error.response?.data === 'string' ? error.response.data.substring(0, 200) : error.response?.data
        });
      }
      
      if (!silent) {
        toast({
          title: 'Error',
          description: errorMessage,
          variant: 'destructive',
        });
      }
      
      // Set offline stats - all zeros, no fake data
      setStats({
        totalOrders: 0,
        totalRevenue: 0,
        totalProducts: 0,
        activeUsers: 0,
        pendingOrders: 0,
        serverStatus: 'offline',
        lastOrderTime: null,
        paymentGatewayStatus: {
          cashfree: 'offline',
          razorpay: 'offline'
        },
        recentOrders: [],
        lowStockProducts: []
      });
      
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  // Auto-refresh every 30 seconds for production
  useEffect(() => {
    // Only fetch data if user is authenticated and is admin
    if (isAuthenticated && user?.role === 'admin') {
      console.log('Dashboard: User is authenticated admin, fetching data...');
      fetchDashboardData();
      
      const interval = setInterval(() => {
        fetchDashboardData(true);
      }, 30000); // 30 seconds

      return () => clearInterval(interval);
    } else {
      console.log('Dashboard: User not authenticated or not admin:', { isAuthenticated, role: user?.role });
      setIsLoading(false);
      
      // Set empty stats for non-admin users
      setStats({
        totalOrders: 0,
        totalRevenue: 0,
        totalProducts: 0,
        activeUsers: 0,
        pendingOrders: 0,
        serverStatus: 'offline',
        lastOrderTime: null,
        paymentGatewayStatus: {
          cashfree: 'offline',
          razorpay: 'offline'
        },
        recentOrders: [],
        lowStockProducts: []
      });
    }
  }, [isAuthenticated, user?.role]);

  // Manual refresh
  const handleRefresh = () => {
    fetchDashboardData();
    toast({
      title: 'Refreshed',
      description: 'Dashboard data has been updated.',
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'shipped':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'cancelled':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const seoData = generateSEO({
    title: 'Admin Dashboard - Y7 Sauces Management',
    description: 'Y7 Sauces production admin dashboard for managing products, orders, and business operations.',
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        {/* Loading Skeletons */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="bg-charcoal border-gold/20">
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-gold/20 rounded w-1/2 mb-2"></div>
                  <div className="h-8 bg-gold/20 rounded w-3/4"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      <SEO {...seoData} />
      <div className="space-y-8">
        {/* Debug Panel - only show in development */}
        {import.meta.env.DEV && <DebugPanel />}
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-cream">Dashboard Overview</h1>
            <div className="flex items-center gap-4 mt-1">
              <p className="text-cream/60">Live business metrics and system status</p>
              {lastUpdated && (
                <div className="flex items-center text-cream/40 text-sm">
                  <div className={cn(
                    "w-2 h-2 rounded-full mr-2",
                    isRefreshing ? "bg-yellow-400 animate-pulse" : "bg-green-400"
                  )}></div>
                  Last updated: {lastUpdated.toLocaleTimeString()}
                </div>
              )}
              {/* Server Status */}
              <div className="flex items-center text-cream/40 text-sm">
                {serverHealth === 'online' ? (
                  <>
                    <Wifi className="w-4 h-4 text-green-400 mr-1" />
                    <span className="text-green-400 font-medium">Online</span>
                  </>
                ) : serverHealth === 'offline' ? (
                  <>
                    <WifiOff className="w-4 h-4 text-red-400 mr-1" />
                    <span className="text-red-400 font-medium">Offline</span>
                  </>
                ) : (
                  <>
                    <Activity className="w-4 h-4 text-yellow-400 mr-1 animate-pulse" />
                    <span className="text-yellow-400 font-medium">Checking...</span>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Button 
              onClick={handleRefresh}
              variant="outline" 
              size="sm" 
              className="border-gold/30 text-cream hover:bg-gold/10"
              disabled={isRefreshing}
            >
              {isRefreshing ? (
                <div className="w-4 h-4 border-2 border-cream border-t-transparent rounded-full animate-spin mr-2" />
              ) : (
                <RefreshCw className="w-4 h-4 mr-2" />
              )}
              {isRefreshing ? 'Refreshing...' : 'Refresh'}
            </Button>
          </div>
        </div>

        {/* Core Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total Orders */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0 }}
          >
            <Card className="bg-gradient-to-br from-charcoal to-charcoal/80 border-gold/20 hover:border-gold/40 transition-colors">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-cream/60 text-sm font-medium">Total Orders</p>
                    <p className="text-2xl font-bold text-cream mt-1">
                      {stats?.totalOrders || 0}
                    </p>
                    <p className="text-cream/40 text-xs mt-1">Live count from database</p>
                  </div>
                  <div className="p-3 bg-blue-500/20 rounded-full">
                    <ShoppingCart className="w-6 h-6 text-blue-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Total Revenue */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="bg-gradient-to-br from-charcoal to-charcoal/80 border-gold/20 hover:border-gold/40 transition-colors">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-cream/60 text-sm font-medium">Total Revenue</p>
                    <p className="text-2xl font-bold text-cream mt-1">
                      {formatCurrency(stats?.totalRevenue || 0)}
                    </p>
                    <p className="text-cream/40 text-xs mt-1">Real sum from orders</p>
                  </div>
                  <div className="p-3 bg-gold/20 rounded-full">
                    <DollarSign className="w-6 h-6 text-gold" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Total Products */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-gradient-to-br from-charcoal to-charcoal/80 border-gold/20 hover:border-gold/40 transition-colors">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-cream/60 text-sm font-medium">Total Products</p>
                    <p className="text-2xl font-bold text-cream mt-1">
                      {stats?.totalProducts || 0}
                    </p>
                    <p className="text-cream/40 text-xs mt-1">Active products in catalog</p>
                  </div>
                  <div className="p-3 bg-purple-500/20 rounded-full">
                    <Package className="w-6 h-6 text-purple-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Active Users */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="bg-gradient-to-br from-charcoal to-charcoal/80 border-gold/20 hover:border-gold/40 transition-colors">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-cream/60 text-sm font-medium">Active Users</p>
                    <p className="text-2xl font-bold text-cream mt-1">
                      {stats?.activeUsers || 0}
                    </p>
                    <p className="text-cream/40 text-xs mt-1">Registered users</p>
                  </div>
                  <div className="p-3 bg-green-500/20 rounded-full">
                    <Users className="w-6 h-6 text-green-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* System Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {/* Server Status */}
          <Card className="bg-charcoal border-gold/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-cream/60 text-sm font-medium">Server Status</p>
                  <div className="flex items-center mt-2">
                    {stats?.serverStatus === 'online' ? (
                      <>
                        <div className="w-3 h-3 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                        <span className="text-green-400 font-medium text-sm">Online</span>
                      </>
                    ) : (
                      <>
                        <div className="w-3 h-3 bg-red-400 rounded-full mr-2"></div>
                        <span className="text-red-400 font-medium text-sm">Offline</span>
                      </>
                    )}
                  </div>
                  <p className="text-cream/40 text-xs mt-1">All Systems Operational</p>
                </div>
                <Server className={cn(
                  "w-5 h-5",
                  stats?.serverStatus === 'online' ? 'text-green-400' : 'text-red-400'
                )} />
              </div>
            </CardContent>
          </Card>

          {/* Pending Orders */}
          <Card className="bg-charcoal border-gold/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-cream/60 text-sm font-medium">Pending Orders</p>
                  <p className="text-xl font-bold text-yellow-400 mt-1">
                    {stats?.pendingOrders || 0}
                  </p>
                  <p className="text-cream/40 text-xs mt-1">Awaiting processing</p>
                </div>
                <div className="p-2 bg-yellow-500/20 rounded-full">
                  <Clock className="w-4 h-4 text-yellow-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Last Order */}
          <Card className="bg-charcoal border-gold/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-cream/60 text-sm font-medium">Last Order</p>
                  <p className="text-sm font-medium text-cream mt-1">
                    {stats?.lastOrderTime 
                      ? new Date(stats.lastOrderTime).toLocaleString('en-IN', {
                          day: '2-digit',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit'
                        })
                      : 'No orders yet'
                    }
                  </p>
                  <p className="text-cream/40 text-xs mt-1">Most recent order</p>
                </div>
                <div className="p-2 bg-blue-500/20 rounded-full">
                  <Activity className="w-4 h-4 text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Gateway Status */}
          <Card className="bg-charcoal border-gold/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-cream/60 text-sm font-medium">Payment Gateways</p>
                  <div className="flex items-center space-x-3 mt-2">
                    <div className="flex items-center">
                      <div className={cn(
                        "w-2 h-2 rounded-full mr-1",
                        stats?.paymentGatewayStatus.cashfree === 'online' ? 'bg-green-400' : 'bg-red-400'
                      )}></div>
                      <span className="text-xs text-cream/80">Cashfree</span>
                    </div>
                    <div className="flex items-center">
                      <div className={cn(
                        "w-2 h-2 rounded-full mr-1",
                        stats?.paymentGatewayStatus.razorpay === 'online' ? 'bg-green-400' : 'bg-red-400'
                      )}></div>
                      <span className="text-xs text-cream/80">Razorpay</span>
                    </div>
                  </div>
                  <p className="text-cream/40 text-xs mt-1">Gateway status</p>
                </div>
                <div className="p-2 bg-green-500/20 rounded-full">
                  <CreditCard className="w-4 h-4 text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Low Stock Alert */}
          <Card className="bg-charcoal border-gold/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-cream/60 text-sm font-medium">Low Stock Items</p>
                  <p className="text-xl font-bold text-red-400 mt-1">
                    {stats?.lowStockProducts.length || 0}
                  </p>
                  <p className="text-cream/40 text-xs mt-1">Need restocking</p>
                </div>
                <div className="p-2 bg-red-500/20 rounded-full">
                  <AlertTriangle className="w-4 h-4 text-red-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Orders */}
          <Card className="bg-charcoal border-gold/20">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-cream">Recent Orders</CardTitle>
                  <CardDescription>Latest customer orders</CardDescription>
                </div>
                <Button variant="outline" size="sm" className="border-gold/30 text-cream hover:bg-gold/10">
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats?.recentOrders && stats.recentOrders.length > 0 ? (
                  stats.recentOrders.map((order) => (
                    <div key={order._id} className="flex items-center justify-between p-4 bg-obsidian rounded-lg border border-gold/10">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <p className="font-medium text-cream text-sm">{order.orderId}</p>
                          <Badge className={getStatusColor(order.status)}>
                            {order.status}
                          </Badge>
                        </div>
                        <p className="text-cream/60 text-sm">{order.customer.email}</p>
                        <p className="text-cream/60 text-xs">
                          {order.items.length} item(s) • {formatCurrency(order.pricing.total)}
                        </p>
                      </div>
                      <Button variant="ghost" size="sm" className="text-cream/60 hover:text-cream">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <ShoppingCart className="w-12 h-12 text-cream/40 mx-auto mb-4" />
                    <p className="text-cream/60">No orders yet</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Low Stock Products */}
          <Card className="bg-charcoal border-gold/20">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-cream flex items-center">
                    <AlertTriangle className="w-5 h-5 mr-2 text-red-400" />
                    Low Stock Alert
                  </CardTitle>
                  <CardDescription>Products that need restocking</CardDescription>
                </div>
                <Button variant="outline" size="sm" className="border-gold/30 text-cream hover:bg-gold/10">
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats?.lowStockProducts && stats.lowStockProducts.length > 0 ? (
                  stats.lowStockProducts.map((product) => (
                    <div key={product._id} className="flex items-center justify-between p-4 bg-red-500/10 rounded-lg border border-red-500/20">
                      <div className="flex-1">
                        <p className="font-medium text-cream text-sm">{product.name}</p>
                        <p className="text-cream/60 text-xs">{product.category}</p>
                        <div className="flex items-center mt-1">
                          <span className="text-red-400 text-sm font-medium">
                            {product.stock} left
                          </span>
                          <span className="text-cream/60 text-sm ml-2">
                            • {formatCurrency(product.sellingPrice)}
                          </span>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="border-red-500/30 text-red-400 hover:bg-red-500/10">
                        Restock
                      </Button>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Package className="w-12 h-12 text-cream/40 mx-auto mb-4" />
                    <p className="text-cream/60">All products are well stocked</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;