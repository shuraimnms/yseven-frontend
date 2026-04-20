import { useState, useEffect } from 'react';
import {
  Mail, Search, Eye, Edit, Trash2, MessageSquare,
  Clock, CheckCircle, AlertCircle, Calendar, RefreshCw, Package, Users, Globe, FileText, Newspaper
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { cn } from '@/lib/utils';

const STATUS_COLORS: Record<string, string> = {
  new:          'bg-blue-500/20 text-blue-400 border-blue-500/30',
  'in-progress':'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  resolved:     'bg-green-500/20 text-green-400 border-green-500/30',
  closed:       'bg-gray-500/20 text-gray-400 border-gray-500/30',
};
const PRIORITY_COLORS: Record<string, string> = {
  low:    'bg-gray-500/20 text-gray-400 border-gray-500/30',
  medium: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  high:   'bg-orange-500/20 text-orange-400 border-orange-500/30',
  urgent: 'bg-red-500/20 text-red-400 border-red-500/30',
};
const TYPE_ICONS: Record<string, any> = {
  general: MessageSquare, bulk: Package, partnership: Users,
  support: AlertCircle, media: Newspaper, export: Globe,
  press: FileText, chat: MessageSquare,
};

export default function ContactRequests() {
  const [contacts, setContacts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [selected, setSelected] = useState<any | null>(null);
  const [viewOpen, setViewOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editForm, setEditForm] = useState({ status: '', priority: '', notes: '' });
  const { toast } = useToast();

  async function load() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('contact_requests')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      setContacts(data || []);
    } catch (e: any) {
      setContacts([]);
    } finally {
      setLoading(false);
    }
  }

  async function update() {
    if (!selected) return;
    const { error } = await supabase
      .from('contact_requests')
      .update({ ...editForm, updated_at: new Date().toISOString() })
      .eq('id', selected.id);
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Updated' });
      setEditOpen(false);
      load();
    }
  }

  async function remove(id: string) {
    if (!confirm('Delete this contact request?')) return;
    await supabase.from('contact_requests').delete().eq('id', id);
    toast({ title: 'Deleted' });
    load();
  }

  useEffect(() => { load(); }, []);

  const filtered = contacts.filter(c => {
    const matchSearch = !search ||
      (c.full_name || '').toLowerCase().includes(search.toLowerCase()) ||
      (c.email || '').toLowerCase().includes(search.toLowerCase()) ||
      (c.subject || '').toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || c.status === statusFilter;
    const matchType = typeFilter === 'all' || c.type === typeFilter;
    return matchSearch && matchStatus && matchType;
  });

  const stats = {
    total: contacts.length,
    new: contacts.filter(c => c.status === 'new').length,
    inProgress: contacts.filter(c => c.status === 'in-progress').length,
    resolved: contacts.filter(c => c.status === 'resolved').length,
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-cream">Contact Requests</h1>
          <p className="text-cream/60">Manage customer inquiries from Supabase</p>
        </div>
        <Button onClick={load} variant="outline" size="sm" className="border-gold/30 text-cream hover:bg-gold/10">
          <RefreshCw className="w-4 h-4 mr-2" /> Refresh
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total', value: stats.total, color: 'text-cream', icon: MessageSquare },
          { label: 'New', value: stats.new, color: 'text-blue-400', icon: Clock },
          { label: 'In Progress', value: stats.inProgress, color: 'text-yellow-400', icon: AlertCircle },
          { label: 'Resolved', value: stats.resolved, color: 'text-green-400', icon: CheckCircle },
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
              placeholder="Search by name, email, subject..." className="pl-10 bg-obsidian border-gold/30 text-cream" />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40 bg-obsidian border-gold/30 text-cream">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="bg-charcoal border-gold/30">
              {['all','new','in-progress','resolved','closed'].map(s => (
                <SelectItem key={s} value={s}>{s === 'all' ? 'All Status' : s.replace('-',' ').replace(/\b\w/g, c => c.toUpperCase())}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-40 bg-obsidian border-gold/30 text-cream">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent className="bg-charcoal border-gold/30">
              {['all','general','bulk','partnership','support','media','export','press'].map(t => (
                <SelectItem key={t} value={t}>{t === 'all' ? 'All Types' : t.charAt(0).toUpperCase() + t.slice(1)}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* List */}
      <Card className="bg-charcoal border-gold/20">
        <CardHeader>
          <CardTitle className="text-cream">Requests ({filtered.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12">
              <MessageSquare className="w-12 h-12 text-cream/20 mx-auto mb-3" />
              <p className="text-cream/50">No contact requests found</p>
              <p className="text-cream/30 text-sm mt-1">
                {contacts.length === 0
                  ? 'Run the schema SQL to create the contact_requests table.'
                  : 'Try adjusting your filters.'}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filtered.map(c => {
                const Icon = TYPE_ICONS[c.type] || MessageSquare;
                return (
                  <div key={c.id} className="border border-gold/10 rounded-lg p-4 hover:bg-obsidian/50 transition-colors">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        <Icon className="w-5 h-5 text-cream/50 mt-0.5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <span className="text-cream font-medium">{c.full_name}</span>
                            <Badge className={cn(STATUS_COLORS[c.status] || STATUS_COLORS.new)}>
                              {(c.status || 'new').replace('-', ' ')}
                            </Badge>
                            <Badge className={cn(PRIORITY_COLORS[c.priority] || PRIORITY_COLORS.medium)}>
                              {c.priority || 'medium'}
                            </Badge>
                          </div>
                          <p className="text-cream/60 text-sm">{c.email}</p>
                          <p className="text-cream font-medium text-sm mt-1">{c.subject || 'No subject'}</p>
                          <p className="text-cream/60 text-sm line-clamp-2 mt-0.5">{c.message}</p>
                          <p className="text-cream/40 text-xs mt-1 flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(c.created_at).toLocaleDateString('en-IN')}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-1 flex-shrink-0">
                        <Button size="sm" variant="outline" onClick={() => { setSelected(c); setViewOpen(true); }}
                          className="border-gold/30 text-cream hover:bg-gold/10">
                          <Eye className="w-3 h-3" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => {
                          setSelected(c);
                          setEditForm({ status: c.status || 'new', priority: c.priority || 'medium', notes: c.notes || '' });
                          setEditOpen(true);
                        }} className="border-green-500/30 text-green-400 hover:bg-green-500/10">
                          <Edit className="w-3 h-3" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => remove(c.id)}
                          className="border-red-500/30 text-red-400 hover:bg-red-500/10">
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* View Dialog */}
      <Dialog open={viewOpen} onOpenChange={setViewOpen}>
        <DialogContent className="bg-charcoal border-gold/20 max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-cream">Contact Details</DialogTitle>
          </DialogHeader>
          {selected && (
            <div className="space-y-3 text-sm">
              {[['Name', selected.full_name], ['Email', selected.email], ['Phone', selected.phone], ['Subject', selected.subject]].map(([l, v]) => v ? (
                <div key={l}><p className="text-cream/60">{l}</p><p className="text-cream font-medium">{v}</p></div>
              ) : null)}
              <div><p className="text-cream/60">Message</p><p className="text-cream whitespace-pre-wrap">{selected.message}</p></div>
              {selected.notes && <div><p className="text-cream/60">Notes</p><p className="text-cream">{selected.notes}</p></div>}
              <div className="flex gap-2 flex-wrap">
                <Badge className={cn(STATUS_COLORS[selected.status])}>{selected.status}</Badge>
                <Badge className={cn(PRIORITY_COLORS[selected.priority])}>{selected.priority}</Badge>
                <Badge variant="outline" className="border-gold/30 text-cream/70">{selected.type}</Badge>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="bg-charcoal border-gold/20">
          <DialogHeader>
            <DialogTitle className="text-cream">Update Request</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="text-cream/80">Status</Label>
              <Select value={editForm.status} onValueChange={v => setEditForm(f => ({ ...f, status: v }))}>
                <SelectTrigger className="bg-obsidian border-gold/30 text-cream mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-charcoal border-gold/30">
                  {['new','in-progress','resolved','closed'].map(s => (
                    <SelectItem key={s} value={s}>{s.replace('-',' ').replace(/\b\w/g, c => c.toUpperCase())}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-cream/80">Priority</Label>
              <Select value={editForm.priority} onValueChange={v => setEditForm(f => ({ ...f, priority: v }))}>
                <SelectTrigger className="bg-obsidian border-gold/30 text-cream mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-charcoal border-gold/30">
                  {['low','medium','high','urgent'].map(p => (
                    <SelectItem key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-cream/80">Notes</Label>
              <Textarea value={editForm.notes} onChange={e => setEditForm(f => ({ ...f, notes: e.target.value }))}
                rows={3} className="bg-obsidian border-gold/30 text-cream mt-1" placeholder="Internal notes..." />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setEditOpen(false)} className="border-gold/30 text-cream hover:bg-gold/10">Cancel</Button>
              <Button onClick={update} className="bg-gold text-black hover:bg-gold/90">Update</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
