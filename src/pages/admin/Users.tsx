import { useEffect, useState } from 'react';
import { Users as UsersIcon, Search, RefreshCw, Shield, ShieldCheck, Ban, CheckCircle, XCircle, Eye } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { cn } from '@/lib/utils';

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const { toast } = useToast();

  async function load() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      setUsers(data || []);
    } catch (e: any) {
      setUsers([]);
      toast({ title: 'Error', description: e.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }

  async function setRole(id: string, role: 'admin' | 'customer') {
    const { error } = await supabase.from('profiles').update({ role }).eq('id', id);
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      setUsers(prev => prev.map(u => u.id === id ? { ...u, role } : u));
      toast({ title: `Role set to ${role}` });
    }
  }

  useEffect(() => { load(); }, []);

  const filtered = users.filter(u => {
    const matchSearch = !search ||
      (u.name || '').toLowerCase().includes(search.toLowerCase()) ||
      (u.email || '').toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === 'all' || u.role === roleFilter;
    return matchSearch && matchRole;
  });

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
          <h1 className="text-3xl font-bold text-cream">Users</h1>
          <p className="text-cream/60">Manage user profiles from Supabase</p>
        </div>
        <Button onClick={load} variant="outline" size="sm" className="border-gold/30 text-cream hover:bg-gold/10">
          <RefreshCw className="w-4 h-4 mr-2" /> Refresh
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {[
          { label: 'Total Users', value: users.length, color: 'text-cream', icon: UsersIcon },
          { label: 'Admins', value: users.filter(u => u.role === 'admin').length, color: 'text-gold', icon: ShieldCheck },
          { label: 'Customers', value: users.filter(u => u.role === 'customer').length, color: 'text-blue-400', icon: UsersIcon },
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
              placeholder="Search by name or email..." className="pl-10 bg-obsidian border-gold/30 text-cream" />
          </div>
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-44 bg-obsidian border-gold/30 text-cream">
              <SelectValue placeholder="All Roles" />
            </SelectTrigger>
            <SelectContent className="bg-charcoal border-gold/30">
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="customer">Customer</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="bg-charcoal border-gold/20">
        <CardHeader>
          <CardTitle className="text-cream">Users ({filtered.length})</CardTitle>
          <CardDescription>Profiles from Supabase auth</CardDescription>
        </CardHeader>
        <CardContent>
          {filtered.length === 0 ? (
            <div className="text-center py-12">
              <UsersIcon className="w-12 h-12 text-cream/20 mx-auto mb-3" />
              <p className="text-cream/50">No users found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-gold/20">
                    <TableHead className="text-cream/80">User</TableHead>
                    <TableHead className="text-cream/80">Role</TableHead>
                    <TableHead className="text-cream/80">Joined</TableHead>
                    <TableHead className="text-cream/80">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map(u => (
                    <TableRow key={u.id} className="border-gold/10 hover:bg-gold/5">
                      <TableCell>
                        <p className="text-cream font-medium">{u.name || '—'}</p>
                        <p className="text-cream/50 text-xs font-mono">{u.id?.slice(0,16)}…</p>
                      </TableCell>
                      <TableCell>
                        <Badge className={cn(
                          u.role === 'admin'
                            ? 'bg-gold/20 text-gold border-gold/30'
                            : 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                        )}>
                          {u.role === 'admin' ? <><ShieldCheck className="w-3 h-3 mr-1" />Admin</> : 'Customer'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-cream/60 text-sm">
                        {new Date(u.created_at).toLocaleDateString('en-IN')}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          {u.role !== 'admin' ? (
                            <Button size="sm" variant="outline" onClick={() => setRole(u.id, 'admin')}
                              className="border-gold/30 text-gold hover:bg-gold/10 text-xs">
                              Make Admin
                            </Button>
                          ) : (
                            <Button size="sm" variant="outline" onClick={() => setRole(u.id, 'customer')}
                              className="border-red-500/30 text-red-400 hover:bg-red-500/10 text-xs">
                              Remove Admin
                            </Button>
                          )}
                        </div>
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
