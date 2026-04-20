import { useEffect, useState } from 'react';
import { ShoppingCart, Search, RefreshCw, Package, Truck, CheckCircle, Clock, X, MoreHorizontal } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { cn } from '@/lib/utils';

const STATUS_COLORS: Record<string, string> = {
  delivered:  'bg-green-500/20 text-green-400 border-green-500/30',
  shipped:    'bg-blue-500/20 text-blue-400 border-blue-500/30',
  processing: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  pending:    'bg-orange-500/20 text-orange-400 border-orange-500/30',
  cancelled:  'bg-red-500/20 text-red-400 border-red-500/30',
};

const fmt = (n: number) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(n);

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const { toast } = useToast();

  async function load() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (e: any) {
      // Table may not exist yet — show empty state gracefully
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(id: string, status: string) {
    const { error } = await supabase.from('orders').update({ status }).eq('id', id);
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
      toast({ title: 'Status updated' });
    }
  }

  useEffect(() => { load(); }, []);

  const filtered = orders.filter(o => {
    const matchSearch = !search ||
      (o.order_number || '').toLowerCase().includes(search.toLowerCase()) ||
      (o.customer_email || '').toLowerCase().includes(search.toLowerCase()) ||
      (o.customer_name || '').toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const counts = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    processing: orders.filter(o => o.status === 'processing').length,
    delivered: orders.filter(o => o.status === 'delivered').length,
  };

  if (loading) return (
    <div className="animate-pulse space-y-4">
      <div className="h-8 bg-gold/20 rounded w-1/4" />
      <div className="h-64 bg-charcoal rounded" />
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-cream">Orders</h1>
          <p className="text-cream/60">Manage customer orders from Supabase</p>
        </div>
        <Button onClick={load} variant="outline" size="sm" className="border-gold/30 text-cream hover:bg-gold/10">
          <RefreshCw className="w-4 h-4 mr-2" /> Refresh
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total', value: counts.total, color: 'text-cream', icon: ShoppingCart },
          { label: 'Pending', value: counts.pending, color: 'text-orange-400', icon: Clock },
          { label: 'Processing', value: counts.processing, color: 'text-yellow-400', icon: Package },
          { label: 'Delivered', value: counts.delivered, color: 'text-green-400', icon: CheckCircle },
        ].map(s => (
          <Card key={s.label} className="bg-charcoal border-gold/20">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-cream/60 text-sm">{s.label}</p>
                <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
              </div>
              <s.icon className={`w-6 h-6 ${s.color}`} />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card className="bg-charcoal border-gold/20">
        <CardContent className="p-4 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cream/40" />
            <Input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search by order ID, customer..." className="pl-10 bg-obsidian border-gold/30 text-cream" />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-44 bg-obsidian border-gold/30 text-cream">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent className="bg-charcoal border-gold/30">
              {['all','pending','processing','shipped','delivered','cancelled'].map(s => (
                <SelectItem key={s} value={s}>{s === 'all' ? 'All Status' : s.charAt(0).toUpperCase() + s.slice(1)}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="bg-charcoal border-gold/20">
        <CardHeader>
          <CardTitle className="text-cream">Orders ({filtered.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {filtered.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingCart className="w-12 h-12 text-cream/20 mx-auto mb-3" />
              <p className="text-cream/50">No orders found</p>
              <p className="text-cream/30 text-sm mt-1">
                {orders.length === 0
                  ? 'Create an "orders" table in Supabase to track orders here.'
                  : 'Try adjusting your filters.'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-gold/20">
                    <TableHead className="text-cream/80">Order</TableHead>
                    <TableHead className="text-cream/80">Customer</TableHead>
                    <TableHead className="text-cream/80">Total</TableHead>
                    <TableHead className="text-cream/80">Status</TableHead>
                    <TableHead className="text-cream/80">Date</TableHead>
                    <TableHead className="text-cream/80">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map(o => (
                    <TableRow key={o.id} className="border-gold/10 hover:bg-gold/5">
                      <TableCell className="text-cream font-mono text-sm">{o.order_number || o.id?.slice(0,8)}</TableCell>
                      <TableCell>
                        <p className="text-cream">{o.customer_name || '—'}</p>
                        <p className="text-cream/50 text-xs">{o.customer_email}</p>
                      </TableCell>
                      <TableCell className="text-cream">{fmt(o.total || 0)}</TableCell>
                      <TableCell>
                        <Badge className={cn(STATUS_COLORS[o.status?.toLowerCase()] || 'bg-gray-500/20 text-gray-400')}>
                          {o.status || 'pending'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-cream/60 text-sm">
                        {new Date(o.created_at).toLocaleDateString('en-IN')}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="text-cream/60 hover:text-cream">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="bg-charcoal border-gold/30">
                            {['processing','shipped','delivered','cancelled'].map(s => (
                              <DropdownMenuItem key={s} className="text-cream hover:bg-gold/10"
                                onClick={() => updateStatus(o.id, s)}>
                                Mark {s.charAt(0).toUpperCase() + s.slice(1)}
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
