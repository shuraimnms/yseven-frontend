import { useEffect, useState } from 'react';
import { 
  CreditCard,
  Search,
  Download,
  RefreshCw,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Eye,
  ExternalLink
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import SEO from '@/components/SEO';
import { generateSEO } from '@/lib/seo';
import { getApiBaseUrl } from '@/lib/api';
import Cookies from 'js-cookie';

interface Payment {
  _id: string;
  orderId: string;
  transactionId: string;
  amount: number;
  status: 'pending' | 'paid' | 'failed' | 'refunded';
  gateway: 'cashfree' | 'razorpay';
  customer: {
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
  failureReason?: string;
}

const PaymentsPage = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [gatewayFilter, setGatewayFilter] = useState<string>('all');
  const { toast } = useToast();

  const fetchPayments = async () => {
    try {
      setIsLoading(true);
      
      const response = await fetch(`${getApiBaseUrl()}/admin/payments`, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${Cookies.get('accessToken')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch payments');
      }

      const data = await response.json();
      setPayments(data.data?.payments || data.data || []);
      
    } catch (error) {
      console.error('Payments fetch error:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch payments data',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = (payment.orderId || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (payment.transactionId || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (payment.customer?.email || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || (payment.status || 'pending') === statusFilter;
    const matchesGateway = gatewayFilter === 'all' || (payment.gateway || 'cashfree') === gatewayFilter;
    
    return matchesSearch && matchesStatus && matchesGateway;
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-400" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-400" />;
      case 'refunded':
        return <AlertTriangle className="w-4 h-4 text-orange-400" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'failed':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'refunded':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const exportPayments = () => {
    // Create CSV content
    const headers = ['Order ID', 'Transaction ID', 'Amount', 'Status', 'Gateway', 'Customer', 'Date'];
    const csvContent = [
      headers.join(','),
      ...filteredPayments.map(payment => [
        payment.orderId || '',
        payment.transactionId || '',
        payment.amount || 0,
        payment.status || 'pending',
        payment.gateway || 'cashfree',
        payment.customer?.email || '',
        new Date(payment.createdAt).toLocaleDateString('en-IN')
      ].join(','))
    ].join('\n');

    // Download CSV
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `payments-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    toast({
      title: 'Success',
      description: 'Payments data exported successfully',
    });
  };

  const seoData = generateSEO({
    title: 'Payments Management - Y7 Sauces Admin',
    description: 'View and manage payment transactions, track payment status, and handle refunds.',
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

  const totalAmount = payments.reduce((sum, payment) => sum + (payment.amount || 0), 0);
  const paidAmount = payments.filter(p => (p.status || 'pending') === 'paid').reduce((sum, payment) => sum + (payment.amount || 0), 0);
  const failedCount = payments.filter(p => (p.status || 'pending') === 'failed').length;
  const pendingCount = payments.filter(p => (p.status || 'pending') === 'pending').length;

  return (
    <>
      <SEO {...seoData} />
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-cream">Payments Management</h1>
            <p className="text-cream/60">Track transactions and payment status</p>
          </div>
          <div className="flex items-center space-x-3">
            <Button 
              onClick={exportPayments}
              variant="outline" 
              size="sm" 
              className="border-gold/30 text-cream hover:bg-gold/10"
            >
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
            <Button 
              onClick={fetchPayments}
              variant="outline" 
              size="sm" 
              className="border-gold/30 text-cream hover:bg-gold/10"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-charcoal border-gold/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-cream/60 text-sm font-medium">Total Transactions</p>
                  <p className="text-2xl font-bold text-cream mt-1">{payments.length}</p>
                </div>
                <CreditCard className="w-5 h-5 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-charcoal border-gold/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-cream/60 text-sm font-medium">Total Revenue</p>
                  <p className="text-2xl font-bold text-green-400 mt-1">{formatCurrency(paidAmount)}</p>
                </div>
                <CheckCircle className="w-5 h-5 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-charcoal border-gold/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-cream/60 text-sm font-medium">Failed Payments</p>
                  <p className="text-2xl font-bold text-red-400 mt-1">{failedCount}</p>
                </div>
                <XCircle className="w-5 h-5 text-red-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-charcoal border-gold/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-cream/60 text-sm font-medium">Pending Payments</p>
                  <p className="text-2xl font-bold text-yellow-400 mt-1">{pendingCount}</p>
                </div>
                <Clock className="w-5 h-5 text-yellow-400" />
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
                    placeholder="Search by order ID, transaction ID, or customer email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-obsidian border-gold/20 text-cream"
                  />
                </div>
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px] bg-obsidian border-gold/20 text-cream">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                  <SelectItem value="refunded">Refunded</SelectItem>
                </SelectContent>
              </Select>
              <Select value={gatewayFilter} onValueChange={setGatewayFilter}>
                <SelectTrigger className="w-[180px] bg-obsidian border-gold/20 text-cream">
                  <SelectValue placeholder="Filter by gateway" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Gateways</SelectItem>
                  <SelectItem value="cashfree">Cashfree</SelectItem>
                  <SelectItem value="razorpay">Razorpay</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Payments Table */}
        <Card className="bg-charcoal border-gold/20">
          <CardHeader>
            <CardTitle className="text-cream">Transactions ({filteredPayments.length})</CardTitle>
            <CardDescription>Payment transactions and their status</CardDescription>
          </CardHeader>
          <CardContent>
            {filteredPayments.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-gold/20">
                      <TableHead className="text-cream/80">Order ID</TableHead>
                      <TableHead className="text-cream/80">Transaction ID</TableHead>
                      <TableHead className="text-cream/80">Customer</TableHead>
                      <TableHead className="text-cream/80">Amount</TableHead>
                      <TableHead className="text-cream/80">Status</TableHead>
                      <TableHead className="text-cream/80">Gateway</TableHead>
                      <TableHead className="text-cream/80">Date</TableHead>
                      <TableHead className="text-cream/80">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPayments.map((payment) => (
                      <TableRow key={payment._id} className="border-gold/10">
                        <TableCell className="font-medium text-cream">
                          {payment.orderId || 'N/A'}
                        </TableCell>
                        <TableCell className="text-cream/80 font-mono text-sm">
                          {payment.transactionId || 'N/A'}
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium text-cream">{payment.customer?.name || 'N/A'}</p>
                            <p className="text-sm text-cream/60">{payment.customer?.email || 'N/A'}</p>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium text-cream">
                          {formatCurrency(payment.amount || 0)}
                        </TableCell>
                        <TableCell>
                          <Badge className={cn('flex items-center gap-1 w-fit', getStatusColor(payment.status || 'pending'))}>
                            {getStatusIcon(payment.status || 'pending')}
                            {(payment.status || 'pending').charAt(0).toUpperCase() + (payment.status || 'pending').slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            className={cn(
                              (payment.gateway || 'cashfree') === 'cashfree'
                                ? 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                                : 'bg-purple-500/20 text-purple-400 border-purple-500/30'
                            )}
                          >
                            {(payment.gateway || 'cashfree').charAt(0).toUpperCase() + (payment.gateway || 'cashfree').slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-cream/60 text-sm">
                          {new Date(payment.createdAt).toLocaleDateString('en-IN', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-cream/60 hover:text-cream"
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-cream/60 hover:text-cream"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-12">
                <CreditCard className="w-12 h-12 text-cream/40 mx-auto mb-4" />
                <p className="text-cream/60">No payments found</p>
                <p className="text-cream/40 text-sm">Try adjusting your search or filters</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default PaymentsPage;