import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  DollarSign, 
  ShoppingCart, 
  Users, 
  Package, 
  AlertTriangle,
  RefreshCw,
  TrendingUp
} from 'lucide-react';
import { adminAPI } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { useAuthStore } from '@/store/authStore';
import SEO from '@/components/SEO';
import { generateSEO } from '@/lib/seo';

interface DashboardStats {
  totalOrders: number;
  totalProducts: number;
  totalUsers: number;
  totalRevenue: number;
  lowStockCount: number;
}

interface RecentOrder {
  _id: string;
  orderId: string;
  status: string;
  pricing: {
    total: number;
  };
  createdAt: string;
  customer: {
    name: string;
    email: string;
  };
}

interface LowStockProduct {
  _id: string;
  name: string;
  stock: number;
  sellingPrice: number;
}

interface DashboardData {
  stats: DashboardStats;
  recentOrders: RecentOrder[];
  lowStockProducts: LowStockProduct[];
}

const AdminDashboard = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { toast } = useToast();
  const { isAuthenticated, user } = useAuthStore();

  const fetchDashboardData = async (silent = false) => {
    try {
      if (!silent) {
        setIsLoading(true);
      } else {
        setIsRefreshing(true);
      }

      console.log('Fetching dashboard data...');
      const response = await adminAPI.dashboard.getStats();
      console.log('Dashboard response:', response.data);

      if (response.data.success) {
        setData(response.data.data);
      } else {
        throw new Error(response.data.message || 'Failed to fetch dashboard data');
      }

    } catch (error: any) {
      console.error('Dashboard fetch error:', error);
      
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          'Failed to fetch dashboard data';
      
      if (!silent) {
        toast({
          title: 'Error',
          description: errorMessage,
          variant: 'destructive',
        });
      }
      
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && user?.role === 'admin') {
      fetchDashboardData();
    }
  }, [isAuthenticated, user?.role]);

  const handleRefresh = () => {
    fetchDashboardData(true);
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
    description: 'Y7 Sauces admin dashboard for managing products, orders, and business operations.',
  });

  if (!isAuthenticated || user?.role !== 'admin') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="bg-charcoal border-gold/20">
          <CardContent className="p-6">
            <p className="text-cream">Access denied. Admin privileges required.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
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
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-cream">Dashboard Overview</h1>
            <p className="text-cream/60">Welcome back, {user?.name}</p>
          </div>
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

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-charcoal to-charcoal/80 border-gold/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-cream/60 text-sm font-medium">Total Orders</p>
                  <p className="text-2xl font-bold text-cream mt-1">
                    {data?.stats.totalOrders || 0}
                  </p>
                </div>
                <div className="p-3 bg-blue-500/20 rounded-full">
                  <ShoppingCart className="w-6 h-6 text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-charcoal to-charcoal/80 border-gold/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-cream/60 text-sm font-medium">Total Revenue</p>
                  <p className="text-2xl font-bold text-cream mt-1">
                    {formatCurrency(data?.stats.totalRevenue || 0)}
                  </p>
                </div>
                <div className="p-3 bg-gold/20 rounded-full">
                  <DollarSign className="w-6 h-6 text-gold" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-charcoal to-charcoal/80 border-gold/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-cream/60 text-sm font-medium">Total Products</p>
                  <p className="text-2xl font-bold text-cream mt-1">
                    {data?.stats.totalProducts || 0}
                  </p>
                </div>
                <div className="p-3 bg-purple-500/20 rounded-full">
                  <Package className="w-6 h-6 text-purple-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-charcoal to-charcoal/80 border-gold/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-cream/60 text-sm font-medium">Total Users</p>
                  <p className="text-2xl font-bold text-cream mt-1">
                    {data?.stats.totalUsers || 0}
                  </p>
                </div>
                <div className="p-3 bg-green-500/20 rounded-full">
                  <Users className="w-6 h-6 text-green-400" />
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
              <CardTitle className="text-cream flex items-center">
                <TrendingUp className="w-5 h-5 mr-2" />
                Recent Orders
              </CardTitle>
              <CardDescription>Latest customer orders</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data?.recentOrders && data.recentOrders.length > 0 ? (
                  data.recentOrders.map((order) => (
                    <div key={order._id} className="flex items-center justify-between p-4 bg-obsidian rounded-lg border border-gold/10">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <p className="font-medium text-cream text-sm">{order.orderId}</p>
                          <Badge className={getStatusColor(order.status)}>
                            {order.status}
                          </Badge>
                        </div>
                        <p className="text-cream/60 text-sm">{order.customer.name}</p>
                        <p className="text-cream/60 text-xs">
                          {formatCurrency(order.pricing.total)} • {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>
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

          {/* Low Stock Alert */}
          <Card className="bg-charcoal border-gold/20">
            <CardHeader>
              <CardTitle className="text-cream flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2 text-red-400" />
                Low Stock Alert
                {data?.stats.lowStockCount > 0 && (
                  <Badge className="ml-2 bg-red-500/20 text-red-400">
                    {data.stats.lowStockCount}
                  </Badge>
                )}
              </CardTitle>
              <CardDescription>Products that need restocking</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data?.lowStockProducts && data.lowStockProducts.length > 0 ? (
                  data.lowStockProducts.map((product) => (
                    <div key={product._id} className="flex items-center justify-between p-4 bg-red-500/10 rounded-lg border border-red-500/20">
                      <div className="flex-1">
                        <p className="font-medium text-cream text-sm">{product.name}</p>
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