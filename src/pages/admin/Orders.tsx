import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ShoppingCart,
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  MoreHorizontal,
  Calendar,
  Package,
  Truck,
  CheckCircle,
  Clock,
  X,
  RefreshCw
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import { adminAPI } from '@/lib/api';
import { cn } from '@/lib/utils';
import SEO from '@/components/SEO';
import { generateSEO } from '@/lib/seo';

interface Order {
  _id: string;
  orderId: string;
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  pricing: {
    subtotal: number;
    shipping: number;
    tax: number;
    total: number;
  };
  status: string;
  paymentStatus: string;
  shippingAddress: {
    name: string;
    line1: string;
    city: string;
    state: string;
    pincode: string;
  };
  createdAt: string;
  updatedAt: string;
}

const OrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [ordersPerPage] = useState(10);
  const { toast } = useToast();

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    filterOrders();
  }, [orders, searchTerm, statusFilter, dateFilter]);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const response = await adminAPI.orders.getAll();
      
      if (response.data.success) {
        const ordersData = response.data.data.orders || response.data.data || [];
        setOrders(ordersData);
        console.log(`Loaded ${ordersData.length} orders`);
      }
    } catch (error: any) {
      console.error('Failed to fetch orders:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch orders. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filterOrders = () => {
    let filtered = [...orders];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(order =>
        order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status.toLowerCase() === statusFilter.toLowerCase());
    }

    // Date filter
    if (dateFilter !== 'all') {
      const now = new Date();
      const filterDate = new Date();
      
      switch (dateFilter) {
        case 'today':
          filterDate.setHours(0, 0, 0, 0);
          filtered = filtered.filter(order => new Date(order.createdAt) >= filterDate);
          break;
        case 'week':
          filterDate.setDate(now.getDate() - 7);
          filtered = filtered.filter(order => new Date(order.createdAt) >= filterDate);
          break;
        case 'month':
          filterDate.setMonth(now.getMonth() - 1);
          filtered = filtered.filter(order => new Date(order.createdAt) >= filterDate);
          break;
      }
    }

    setFilteredOrders(filtered);
    setCurrentPage(1);
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      await adminAPI.orders.updateStatus(orderId, newStatus);
      
      // Update local state
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );

      toast({
        title: 'Success',
        description: `Order status updated to ${newStatus}`,
      });
    } catch (error: any) {
      console.error('Failed to update order status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update order status. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'shipped':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'processing':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'pending':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'cancelled':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return <CheckCircle className="w-4 h-4" />;
      case 'shipped':
        return <Truck className="w-4 h-4" />;
      case 'processing':
        return <Package className="w-4 h-4" />;
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'cancelled':
        return <X className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Pagination
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  const seoData = generateSEO({
    title: 'Orders Management - Y7 Sauces Admin',
    description: 'Manage and track all customer orders in the Y7 Sauces admin dashboard.',
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gold/20 rounded w-1/4 mb-4"></div>
          <div className="h-64 bg-charcoal rounded"></div>
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
            <h1 className="text-3xl font-bold text-cream">Orders Management</h1>
            <p className="text-cream/60">Track and manage all customer orders</p>
          </div>
          <div className="flex items-center space-x-3">
            <Button 
              onClick={fetchOrders}
              variant="outline" 
              size="sm" 
              className="border-gold/30 text-cream hover:bg-gold/10"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            <Button variant="outline" size="sm" className="border-gold/30 text-cream hover:bg-gold/10">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-charcoal border-gold/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-cream/60 text-sm font-medium">Total Orders</p>
                  <p className="text-2xl font-bold text-cream">{orders.length}</p>
                </div>
                <ShoppingCart className="w-8 h-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-charcoal border-gold/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-cream/60 text-sm font-medium">Pending</p>
                  <p className="text-2xl font-bold text-orange-400">
                    {orders.filter(o => o.status.toLowerCase() === 'pending').length}
                  </p>
                </div>
                <Clock className="w-8 h-8 text-orange-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-charcoal border-gold/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-cream/60 text-sm font-medium">Processing</p>
                  <p className="text-2xl font-bold text-yellow-400">
                    {orders.filter(o => o.status.toLowerCase() === 'processing').length}
                  </p>
                </div>
                <Package className="w-8 h-8 text-yellow-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-charcoal border-gold/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-cream/60 text-sm font-medium">Delivered</p>
                  <p className="text-2xl font-bold text-green-400">
                    {orders.filter(o => o.status.toLowerCase() === 'delivered').length}
                  </p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="bg-charcoal border-gold/20">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cream/40 w-4 h-4" />
                  <Input
                    placeholder="Search orders by ID, customer email, or name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-obsidian border-gold/30 text-cream placeholder:text-cream/40"
                  />
                </div>
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-48 bg-obsidian border-gold/30 text-cream">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent className="bg-charcoal border-gold/30">
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger className="w-48 bg-obsidian border-gold/30 text-cream">
                  <SelectValue placeholder="Filter by date" />
                </SelectTrigger>
                <SelectContent className="bg-charcoal border-gold/30">
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">Last 7 Days</SelectItem>
                  <SelectItem value="month">Last 30 Days</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Orders Table */}
        <Card className="bg-charcoal border-gold/20">
          <CardHeader>
            <CardTitle className="text-cream">
              Orders ({filteredOrders.length})
            </CardTitle>
            <CardDescription>
              Showing {indexOfFirstOrder + 1}-{Math.min(indexOfLastOrder, filteredOrders.length)} of {filteredOrders.length} orders
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-gold/20">
                    <TableHead className="text-cream/80">Order ID</TableHead>
                    <TableHead className="text-cream/80">Customer</TableHead>
                    <TableHead className="text-cream/80">Items</TableHead>
                    <TableHead className="text-cream/80">Total</TableHead>
                    <TableHead className="text-cream/80">Status</TableHead>
                    <TableHead className="text-cream/80">Date</TableHead>
                    <TableHead className="text-cream/80">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentOrders.map((order) => (
                    <TableRow key={order._id} className="border-gold/10 hover:bg-gold/5">
                      <TableCell className="font-medium text-cream">
                        {order.orderId}
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="text-cream font-medium">{order.customer.name}</p>
                          <p className="text-cream/60 text-sm">{order.customer.email}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="text-cream">{order.items.length} item(s)</p>
                          <p className="text-cream/60 text-sm">
                            {order.items.slice(0, 2).map(item => item.name).join(', ')}
                            {order.items.length > 2 && '...'}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="text-cream font-medium">
                        {formatCurrency(order.pricing.total)}
                      </TableCell>
                      <TableCell>
                        <Badge className={cn("flex items-center gap-1 w-fit", getStatusColor(order.status))}>
                          {getStatusIcon(order.status)}
                          {order.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-cream/80">
                        {formatDate(order.createdAt)}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="text-cream/60 hover:text-cream">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="bg-charcoal border-gold/30">
                            <DropdownMenuItem className="text-cream hover:bg-gold/10">
                              <Eye className="w-4 h-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="text-cream hover:bg-gold/10"
                              onClick={() => updateOrderStatus(order._id, 'processing')}
                            >
                              <Package className="w-4 h-4 mr-2" />
                              Mark Processing
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="text-cream hover:bg-gold/10"
                              onClick={() => updateOrderStatus(order._id, 'shipped')}
                            >
                              <Truck className="w-4 h-4 mr-2" />
                              Mark Shipped
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="text-cream hover:bg-gold/10"
                              onClick={() => updateOrderStatus(order._id, 'delivered')}
                            >
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Mark Delivered
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-6">
                <p className="text-cream/60 text-sm">
                  Page {currentPage} of {totalPages}
                </p>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="border-gold/30 text-cream hover:bg-gold/10"
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="border-gold/30 text-cream hover:bg-gold/10"
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default OrdersPage;