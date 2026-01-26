import { useEffect, useState } from 'react';
import { 
  Users as UsersIcon,
  Search,
  MoreHorizontal,
  Shield,
  ShieldCheck,
  Ban,
  CheckCircle,
  XCircle,
  RefreshCw,
  Eye
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

interface User {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'customer' | 'admin';
  isBlocked: boolean;
  createdAt: string;
  lastLogin?: string;
  totalOrders: number;
  totalSpent: number;
}

const UsersPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const { toast } = useToast();

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      
      const response = await fetch('/api/v1/admin/customers', {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }

      const data = await response.json();
      setUsers(data.data?.users || data.data || []);
      
    } catch (error) {
      console.error('Users fetch error:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch users data',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleUserStatus = async (userId: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/v1/admin/customers/${userId}/status`, {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ isBlocked: !currentStatus })
      });

      if (!response.ok) {
        throw new Error('Failed to update user status');
      }

      // Update local state
      setUsers(users.map(user => 
        user._id === userId 
          ? { ...user, isBlocked: !currentStatus }
          : user
      ));

      toast({
        title: 'Success',
        description: `User ${!currentStatus ? 'blocked' : 'unblocked'} successfully`,
      });

    } catch (error) {
      console.error('User status update error:', error);
      toast({
        title: 'Error',
        description: 'Failed to update user status',
        variant: 'destructive',
      });
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(user => {
    const matchesSearch = (user.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (user.email || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || (user.role || 'customer') === roleFilter;
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'active' && !user.isBlocked) ||
                         (statusFilter === 'blocked' && user.isBlocked);
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const seoData = generateSEO({
    title: 'Users Management - Y7 Sauces Admin',
    description: 'Manage registered users, view user details, and control user access.',
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
            <h1 className="text-3xl font-bold text-cream">Users Management</h1>
            <p className="text-cream/60">Manage registered users and their access</p>
          </div>
          <Button 
            onClick={fetchUsers}
            variant="outline" 
            size="sm" 
            className="border-gold/30 text-cream hover:bg-gold/10"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-charcoal border-gold/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-cream/60 text-sm font-medium">Total Users</p>
                  <p className="text-2xl font-bold text-cream mt-1">{users.length}</p>
                </div>
                <UsersIcon className="w-5 h-5 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-charcoal border-gold/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-cream/60 text-sm font-medium">Active Users</p>
                  <p className="text-2xl font-bold text-green-400 mt-1">
                    {users.filter(u => !u.isBlocked).length}
                  </p>
                </div>
                <CheckCircle className="w-5 h-5 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-charcoal border-gold/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-cream/60 text-sm font-medium">Blocked Users</p>
                  <p className="text-2xl font-bold text-red-400 mt-1">
                    {users.filter(u => u.isBlocked).length}
                  </p>
                </div>
                <XCircle className="w-5 h-5 text-red-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-charcoal border-gold/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-cream/60 text-sm font-medium">Admins</p>
                  <p className="text-2xl font-bold text-gold mt-1">
                    {users.filter(u => u.role === 'admin').length}
                  </p>
                </div>
                <Shield className="w-5 h-5 text-gold" />
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
                    placeholder="Search users by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-obsidian border-gold/20 text-cream"
                  />
                </div>
              </div>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-[180px] bg-obsidian border-gold/20 text-cream">
                  <SelectValue placeholder="Filter by role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="customer">Customers</SelectItem>
                  <SelectItem value="admin">Admins</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px] bg-obsidian border-gold/20 text-cream">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="blocked">Blocked</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card className="bg-charcoal border-gold/20">
          <CardHeader>
            <CardTitle className="text-cream">Users ({filteredUsers.length})</CardTitle>
            <CardDescription>Manage user accounts and permissions</CardDescription>
          </CardHeader>
          <CardContent>
            {filteredUsers.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-gold/20">
                      <TableHead className="text-cream/80">User</TableHead>
                      <TableHead className="text-cream/80">Role</TableHead>
                      <TableHead className="text-cream/80">Status</TableHead>
                      <TableHead className="text-cream/80">Orders</TableHead>
                      <TableHead className="text-cream/80">Total Spent</TableHead>
                      <TableHead className="text-cream/80">Joined</TableHead>
                      <TableHead className="text-cream/80">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user) => (
                      <TableRow key={user._id} className="border-gold/10">
                        <TableCell>
                          <div>
                            <p className="font-medium text-cream">{user.name || 'N/A'}</p>
                            <p className="text-sm text-cream/60">{user.email || 'N/A'}</p>
                            {user.phone && (
                              <p className="text-xs text-cream/40">{user.phone}</p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            className={cn(
                              (user.role || 'customer') === 'admin' 
                                ? 'bg-gold/20 text-gold border-gold/30'
                                : 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                            )}
                          >
                            {(user.role || 'customer') === 'admin' ? (
                              <>
                                <ShieldCheck className="w-3 h-3 mr-1" />
                                Admin
                              </>
                            ) : (
                              'Customer'
                            )}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            className={cn(
                              user.isBlocked
                                ? 'bg-red-500/20 text-red-400 border-red-500/30'
                                : 'bg-green-500/20 text-green-400 border-green-500/30'
                            )}
                          >
                            {user.isBlocked ? 'Blocked' : 'Active'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-cream">
                          {user.totalOrders || 0}
                        </TableCell>
                        <TableCell className="text-cream">
                          {formatCurrency(user.totalSpent || 0)}
                        </TableCell>
                        <TableCell className="text-cream/60 text-sm">
                          {new Date(user.createdAt).toLocaleDateString('en-IN')}
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
                            {(user.role || 'customer') !== 'admin' && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => toggleUserStatus(user._id, user.isBlocked)}
                                className={cn(
                                  user.isBlocked
                                    ? 'text-green-400 hover:text-green-300'
                                    : 'text-red-400 hover:text-red-300'
                                )}
                              >
                                {user.isBlocked ? (
                                  <CheckCircle className="w-4 h-4" />
                                ) : (
                                  <Ban className="w-4 h-4" />
                                )}
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-12">
                <UsersIcon className="w-12 h-12 text-cream/40 mx-auto mb-4" />
                <p className="text-cream/60">No users found</p>
                <p className="text-cream/40 text-sm">Try adjusting your search or filters</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default UsersPage;