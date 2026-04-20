import { useEffect, useState } from 'react';
import { CreditCard, Search, RefreshCw, CheckCircle, XCircle, Clock, Download } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { cn } from '@/lib/utils';

const STATUS_COLORS: Record<string, string> = {
  paid:     'bg-green-500/20 text-green-400 border-green-500/30',
  failed:   'bg-red-500/20 text-red-400 border-red-500/30',
  pending:  'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  refunded: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
};

const fmt = (n: number) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(n);

export default function PaymentsPage() {
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const { toast } = useToast();

  async function load() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('payments')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      setPayments(data || []);
    } catch {
      setPayments([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  const filtered = payments.filter(p => {
    const matchSearch = !search ||
      (p.order_id || '').toLowerCase().includes(search.toLowerCase()) ||
      (p.transaction_id || '').toLowerCase().includes(search.toLowerCase()) ||
      (p.customer_email || '').toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || p.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const paidTotal = payments.filter(p => p.status === 'paid').reduce((s, p) => s + (p.amount || 0), 0);

  function exportCSV() {
    const rows = [
      ['Order ID','Transaction ID','Amount','Status','Gateway','Customer','Date'],
      ...filtered.map(p => [p.order_id, p.transaction_id, p.amount, p.status, p.gateway, p.customer_email, new Date(p.created_at).toLocaleDateString()]),
    ];
    const blob = new Blob([rows.map(r => r.join(',')).join('\n')], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `payments-${Date.now()}.csv`;
    a.click();
    toast({ title: 'Exported' });
  }

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
          <h1 className="text-3xl font-bold text-cream">Payments</h1>
          <p className="text-cream/60">Payment transactions from Supabase</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={exportCSV} variant="outline" size="sm" className="border-gold/30 text-cream hover:bg-gold/10">
            <Download className="w-4 h-4 mr-2" /> Export
          </Button>
          <Button onClick={load} variant="outline" size="sm" className="border-gold/30 text-cream hover:bg-gold/10">
            <RefreshCw className="w-4 h-4 mr-2" /> Refresh
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total', value: payments.length, color: 'text-cream', icon: CreditCard },
          { label: 'Revenue', value: fmt(paidTotal), color: 'text-green-400', icon: CheckCircle },
          { label: 'Failed', value: payments.filter(p => p.status === 'failed').length, color: 'text-red-400', icon: XCircle },
          { label: 'Pending', value: payments.filter(p => p.status === 'pending').length, color: 'text-yellow-400', icon: Clock },
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
              placeholder="Search by order ID, transaction, email..." className="pl-10 bg-obsidian border-gold/30 text-cream" />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-44 bg-obsidian border-gold/30 text-cream">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent className="bg-charcoal border-gold/30">
              {['all','paid','pending','failed','refunded'].map(s => (
                <SelectItem key={s} value={s}>{s === 'all' ? 'All Status' : s.charAt(0).toUpperCase() + s.slice(1)}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="bg-charcoal border-gold/20">
        <CardHeader>
          <CardTitle className="text-cream">Transactions ({filtered.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {filtered.length === 0 ? (
            <div className="text-center py-12">
              <CreditCard className="w-12 h-12 text-cream/20 mx-auto mb-3" />
              <p className="text-cream/50">No payments found</p>
              <p className="text-cream/30 text-sm mt-1">
                {payments.length === 0
                  ? 'Create a "payments" table in Supabase to track transactions here.'
                  : 'Try adjusting your filters.'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-gold/20">
                    <TableHead className="text-cream/80">Order ID</TableHead>
                    <TableHead className="text-cream/80">Transaction</TableHead>
                    <TableHead className="text-cream/80">Customer</TableHead>
                    <TableHead className="text-cream/80">Amount</TableHead>
                    <TableHead className="text-cream/80">Status</TableHead>
                    <TableHead className="text-cream/80">Gateway</TableHead>
                    <TableHead className="text-cream/80">Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map(p => (
                    <TableRow key={p.id} className="border-gold/10 hover:bg-gold/5">
                      <TableCell className="text-cream font-mono text-sm">{p.order_id || '—'}</TableCell>
                      <TableCell className="text-cream/70 font-mono text-xs">{p.transaction_id || '—'}</TableCell>
                      <TableCell>
                        <p className="text-cream">{p.customer_name || '—'}</p>
                        <p className="text-cream/50 text-xs">{p.customer_email}</p>
                      </TableCell>
                      <TableCell className="text-cream font-medium">{fmt(p.amount || 0)}</TableCell>
                      <TableCell>
                        <Badge className={cn(STATUS_COLORS[p.status] || 'bg-gray-500/20 text-gray-400')}>
                          {p.status || 'pending'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                          {p.gateway || 'unknown'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-cream/60 text-sm">
                        {new Date(p.created_at).toLocaleDateString('en-IN')}
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
