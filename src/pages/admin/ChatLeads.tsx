import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Search, Download, Eye, MessageSquare, Phone, Mail, Calendar, Users, TrendingUp, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { cn } from '@/lib/utils';

// chat_leads table schema (add to Supabase if needed):
// id, name, phone, email, country, interest, message, status, created_at, updated_at

const STATUS_COLORS: Record<string, string> = {
  new:       'bg-blue-500/20 text-blue-400 border-blue-500/30',
  contacted: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  closed:    'bg-green-500/20 text-green-400 border-green-500/30',
};

export default function ChatLeads() {
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selected, setSelected] = useState<any | null>(null);
  const { toast } = useToast();

  async function load() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('chat_leads')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      setLeads(data || []);
    } catch {
      setLeads([]);
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(id: string, status: string) {
    const { error } = await supabase
      .from('chat_leads')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id);
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      setLeads(prev => prev.map(l => l.id === id ? { ...l, status } : l));
    }
  }

  function exportCSV() {
    const rows = [
      ['Name','Phone','Email','Country','Interest','Status','Message','Date'],
      ...filtered.map(l => [l.name, l.phone, l.email, l.country, l.interest, l.status, l.message, new Date(l.created_at).toLocaleDateString()]),
    ];
    const blob = new Blob([rows.map(r => r.join(',')).join('\n')], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `chat-leads-${Date.now()}.csv`;
    a.click();
    toast({ title: 'Exported' });
  }

  useEffect(() => { load(); }, []);

  const filtered = leads.filter(l => {
    const matchSearch = !search ||
      (l.name || '').toLowerCase().includes(search.toLowerCase()) ||
      (l.email || '').toLowerCase().includes(search.toLowerCase()) ||
      (l.phone || '').includes(search);
    const matchStatus = statusFilter === 'all' || l.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const stats = {
    total: leads.length,
    new: leads.filter(l => l.status === 'new').length,
    contacted: leads.filter(l => l.status === 'contacted').length,
    closed: leads.filter(l => l.status === 'closed').length,
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-cream">Chat Leads</h1>
          <p className="text-cream/60">Leads from chatbot conversations</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={exportCSV} variant="outline" size="sm" className="border-gold/30 text-cream hover:bg-gold/10">
            <Download className="w-4 h-4 mr-2" /> Export CSV
          </Button>
          <Button onClick={load} variant="outline" size="sm" className="border-gold/30 text-cream hover:bg-gold/10">
            <RefreshCw className="w-4 h-4 mr-2" /> Refresh
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total', value: stats.total, color: 'text-cream', icon: Users },
          { label: 'New', value: stats.new, color: 'text-blue-400', icon: MessageSquare },
          { label: 'Contacted', value: stats.contacted, color: 'text-yellow-400', icon: Phone },
          { label: 'Closed', value: stats.closed, color: 'text-green-400', icon: TrendingUp },
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
              placeholder="Search by name, email, phone..." className="pl-10 bg-obsidian border-gold/30 text-cream" />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40 bg-obsidian border-gold/30 text-cream">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent className="bg-charcoal border-gold/30">
              {['all','new','contacted','closed'].map(s => (
                <SelectItem key={s} value={s}>{s === 'all' ? 'All Status' : s.charAt(0).toUpperCase() + s.slice(1)}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="bg-charcoal border-gold/20">
        <CardHeader>
          <CardTitle className="text-cream">Leads ({filtered.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              {[1,2,3].map(i => <div key={i} className="h-12 bg-obsidian rounded animate-pulse" />)}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12">
              <MessageSquare className="w-12 h-12 text-cream/20 mx-auto mb-3" />
              <p className="text-cream/50">No leads found</p>
              <p className="text-cream/30 text-sm mt-1">
                {leads.length === 0
                  ? 'Create a "chat_leads" table in Supabase to store chatbot leads.'
                  : 'Try adjusting your filters.'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-gold/20">
                    <TableHead className="text-cream/80">Name</TableHead>
                    <TableHead className="text-cream/80">Contact</TableHead>
                    <TableHead className="text-cream/80">Interest</TableHead>
                    <TableHead className="text-cream/80">Status</TableHead>
                    <TableHead className="text-cream/80">Date</TableHead>
                    <TableHead className="text-cream/80">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map(l => (
                    <TableRow key={l.id} className="border-gold/10 hover:bg-gold/5">
                      <TableCell className="text-cream font-medium">{l.name || '—'}</TableCell>
                      <TableCell>
                        {l.phone && <p className="text-cream/70 text-xs flex items-center gap-1"><Phone className="w-3 h-3" />{l.phone}</p>}
                        {l.email && <p className="text-cream/70 text-xs flex items-center gap-1"><Mail className="w-3 h-3" />{l.email}</p>}
                        {l.country && <p className="text-cream/40 text-xs">{l.country}</p>}
                      </TableCell>
                      <TableCell>
                        <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 text-xs">
                          {(l.interest || 'general').replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Select value={l.status || 'new'} onValueChange={v => updateStatus(l.id, v)}>
                          <SelectTrigger className="w-32 h-8 bg-obsidian border-gold/30 text-cream text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-charcoal border-gold/30">
                            {['new','contacted','closed'].map(s => (
                              <SelectItem key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="text-cream/60 text-sm">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(l.created_at).toLocaleDateString('en-IN')}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Button size="sm" variant="outline" onClick={() => setSelected(l)}
                          className="border-gold/30 text-cream hover:bg-gold/10">
                          <Eye className="w-3 h-3" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Detail Dialog */}
      <Dialog open={!!selected} onOpenChange={v => !v && setSelected(null)}>
        <DialogContent className="bg-charcoal border-gold/20 max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-cream">Lead Details</DialogTitle>
          </DialogHeader>
          {selected && (
            <div className="space-y-3 text-sm">
              {[['Name', selected.name], ['Phone', selected.phone], ['Email', selected.email], ['Country', selected.country], ['Interest', selected.interest]].map(([l, v]) => v ? (
                <div key={l}><p className="text-cream/60">{l}</p><p className="text-cream font-medium">{v}</p></div>
              ) : null)}
              <div><p className="text-cream/60">Message</p><p className="text-cream whitespace-pre-wrap bg-obsidian p-3 rounded mt-1">{selected.message}</p></div>
              <div className="flex gap-2">
                <Badge className={cn(STATUS_COLORS[selected.status] || STATUS_COLORS.new)}>{selected.status}</Badge>
                <span className="text-cream/40 text-xs self-center">{new Date(selected.created_at).toLocaleString('en-IN')}</span>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
