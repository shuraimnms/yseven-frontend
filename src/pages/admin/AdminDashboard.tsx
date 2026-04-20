import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DollarSign, ShoppingCart, Users, Package, AlertTriangle, RefreshCw, TrendingUp } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuthStore } from '@/store/authStore';
import { supabase } from '@/lib/supabase';

interface Stats {
  totalOrders: number;
  totalProducts: number;
  totalUsers: number;
  totalRevenue: number;
}

const STATUS_COLORS: Record<string, string> = {
  delivered: 'bg-green-500/20 text-green-400 border-green-500/30',
  shipped:   'bg-blue-500/20 text-blue-400 border-blue-500/30',
  pending:   'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  cancelled: 'bg-red-500/20 text-red-400 border-red-500/30',
};

const fmt = (n: number) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(n);

export default function AdminDashboard() {
  const { user } = useAuthStore();
  const { toast } = useToast();
  const [stats, setStats] = useState<Stats>({ totalOrders: 0, totalProducts: 0, totalUsers: 0, totalRevenue: 0 });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  async function load(silent = false) {
    if (!silent) setLoading(true);
    try {
      const [
        { count: productCount },
        { count: userCount },
        { data: orders },
      ] = await Promise.all([
        supabase.from('products').select('*', { count: 'exact', head: true }).eq('status', 'active'),
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('orders').select('id, order_number, status, total, created_at, customer_name, customer_email').order('created_at', { ascending: false }).limit(5),
      ]);

      const allOrders = orders || [];
      const revenue = allOrders.reduce((s: number, o: any) => s + (o.total || 0), 0);

      setStats({
        totalProducts: productCount || 0,
        totalUsers: userCount || 0,
        totalOrders: allOrders.length,
        totalRevenue: revenue,
      });
      setRecentOrders(allOrders);
    } catch (e: any) {
      if (!silent) toast({ title: 'Error', description: e.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  const statCards = [
    { label: 'Total Orders',   value: stats.totalOrders,                  icon: ShoppingCart, color: 'text-blue-400',   bg: 'bg-blue-500/20' },
    { label: 'Total Revenue',  value: fmt(stats.totalRevenue),             icon: DollarSign,   color: 'text-gold',       bg: 'bg-gold/20' },
    { label: 'Total Products', value: stats.totalProducts,                 icon: Package,      color: 'text-purple-400', bg: 'bg-purple-500/20' },
    { label: 'Total Users',    value: stats.totalUsers,                    icon: Users,        color: 'text-green-400',  bg: 'bg-green-500/20' },
  ];

  if (loading) return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {[1,2,3,4].map(i => (
        <Card key={i} className="bg-charcoal border-gold/20">
          <CardContent className="p-6 animate-pulse">
            <div className="h-4 bg-gold/20 rounded w-1/2 mb-2" />
            <div className="h-8 bg-gold/20 rounded w-3/4" />
          </CardContent>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-cream">Dashboard</h1>
          <p className="text-cream/60">Welcome back, {user?.name}</p>
        </div>
        <Button onClick={() => load(true)} variant="outline" size="sm" className="border-gold/30 text-cream hover:bg-gold/10">
          <RefreshCw className="w-4 h-4 mr-2" /> Refresh
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map(s => (
          <Card key={s.label} className="bg-charcoal border-gold/20">
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-cream/60 text-sm">{s.label}</p>
                <p className={`text-2xl font-bold mt-1 ${s.color}`}>{s.value}</p>
              </div>
              <div className={`p-3 rounded-full ${s.bg}`}>
                <s.icon className={`w-6 h-6 ${s.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Orders */}
      <Card className="bg-charcoal border-gold/20">
        <CardHeader>
          <CardTitle className="text-cream flex items-center gap-2">
            <TrendingUp className="w-5 h-5" /> Recent Orders
          </CardTitle>
          <CardDescription>Latest activity from Supabase</CardDescription>
        </CardHeader>
        <CardContent>
          {recentOrders.length === 0 ? (
            <div className="text-center py-8">
              <ShoppingCart className="w-12 h-12 text-cream/20 mx-auto mb-3" />
              <p className="text-cream/50">No orders yet</p>
              <p className="text-cream/30 text-sm mt-1">Orders will appear here once the orders table is set up in Supabase</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentOrders.map((o: any) => (
                <div key={o.id} className="flex items-center justify-between p-4 bg-obsidian rounded-lg border border-gold/10">
                  <div>
                    <p className="text-cream font-medium text-sm">{o.order_number || o.id?.slice(0,8)}</p>
                    <p className="text-cream/60 text-xs">{o.customer_name || o.customer_email}</p>
                    <p className="text-cream/40 text-xs">{fmt(o.total || 0)} · {new Date(o.created_at).toLocaleDateString()}</p>
                  </div>
                  <Badge className={STATUS_COLORS[o.status?.toLowerCase()] || 'bg-gray-500/20 text-gray-400'}>
                    {o.status || 'pending'}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: 'Manage Products', href: '/admin/supabase-products', icon: Package, desc: 'Add, edit, delete products' },
          { label: 'Manage Categories', href: '/admin/categories', icon: AlertTriangle, desc: 'Organise product categories' },
          { label: 'View Users', href: '/admin/users', icon: Users, desc: 'See registered users' },
        ].map(l => (
          <a key={l.label} href={l.href}>
            <Card className="bg-charcoal border-gold/20 hover:border-gold/50 transition-colors cursor-pointer">
              <CardContent className="p-5 flex items-center gap-4">
                <div className="p-3 bg-gold/10 rounded-full">
                  <l.icon className="w-5 h-5 text-gold" />
                </div>
                <div>
                  <p className="text-cream font-medium">{l.label}</p>
                  <p className="text-cream/50 text-xs">{l.desc}</p>
                </div>
              </CardContent>
            </Card>
          </a>
        ))}
      </div>
    </div>
  );
}
