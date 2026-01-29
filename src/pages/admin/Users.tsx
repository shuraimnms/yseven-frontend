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
  Eye,
  UserCog,
  Crown,
  User as UserIcon,
  Mail,
  Phone,
  Calendar,
  MapPin,
  ShoppingCart,
  Heart,
  Key,
  Clock,
  DollarSign,
  Package,
  Copy,
  AlertTriangle
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import SEO from '@/components/SEO';
import { generateSEO } from '@/lib/seo';
import { authApiFetch } from '@/utils/apiUtils';

interface User {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'customer' | 'admin';
  isBlocked: boolean;
  createdAt: string;
  updatedAt: string;
  lastLogin?: string;
  totalOrders: number;
  totalSpent: number;
  addresses?: Array<{
    _id: string;
    name: string;
    phone: string;
    line1: string;
    line2?: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
    isDefault: boolean;
  }>;
  wishlist?: string[];
  recentOrders?: Array<{
    _id: string;
    orderId: string;
    pricing: { total: number };
    status: string;
    createdAt: string;
  }>;
  cartItemsCount?: number;
  accountAge?: number;
  hasPassword?: boolean;
  passwordLastChanged?: string;
}

const UsersPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false);
  const [isUserDetailsOpen, setIsUserDetailsOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [detailedUser, setDetailedUser] = useState<User | null>(null);
  const [isChangingRole, setIsChangingRole] = useState(false);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const { toast } = useToast();

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      
      const response = await authApiFetch('/admin/customers');

      if (!response.ok) {
        if (response.status === 401) {
          toast({
            title: 'Authentication Required',
            description: 'Please log in as an admin to view users',
            variant: 'destructive',
          });
          setUsers([]);
          return;
        }
        throw new Error('Failed to fetch users');
      }

      const data = await response.json();
      const usersData = data.data?.users || [];
      setUsers(Array.isArray(usersData) ? usersData : []);
      
    } catch (error) {
      console.error('Users fetch error:', error);
      setUsers([]); // Ensure users is always an array
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
      const response = await authApiFetch(`/admin/customers/${userId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ isBlocked: !currentStatus })
      });

      if (!response.ok) {
        throw new Error('Failed to update user status');
      }

      // Update local state
      setUsers((Array.isArray(users) ? users : []).map(user => 
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

  const changeUserRole = async (userId: string, newRole: 'admin' | 'customer') => {
    try {
      setIsChangingRole(true);
      
      const response = await authApiFetch(`/admin/customers/${userId}/role`, {
        method: 'PATCH',
        body: JSON.stringify({ role: newRole })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update user role');
      }

      // Update local state
      setUsers((Array.isArray(users) ? users : []).map(user => 
        user._id === userId 
          ? { ...user, role: newRole }
          : user
      ));

      toast({
        title: 'Success',
        description: `User role changed to ${newRole} successfully`,
      });

      setIsRoleDialogOpen(false);
      setSelectedUser(null);

    } catch (error) {
      console.error('User role update error:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to update user role',
        variant: 'destructive',
      });
    } finally {
      setIsChangingRole(false);
    }
  };

  const openRoleDialog = (user: User) => {
    setSelectedUser(user);
    setIsRoleDialogOpen(true);
  };

  const fetchUserDetails = async (userId: string) => {
    try {
      setIsLoadingDetails(true);
      
      const response = await authApiFetch(`/admin/customers/${userId}`);

      if (!response.ok) {
        throw new Error('Failed to fetch user details');
      }

      const data = await response.json();
      setDetailedUser(data.data.user);
      
    } catch (error) {
      console.error('User details fetch error:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch user details',
        variant: 'destructive',
      });
    } finally {
      setIsLoadingDetails(false);
    }
  };

  const openUserDetails = async (user: User) => {
    setSelectedUser(user);
    setIsUserDetailsOpen(true);
    await fetchUserDetails(user._id);
  };

  const resetUserPassword = async (userId: string, password: string) => {
    try {
      setIsResettingPassword(true);
      
      const response = await authApiFetch(`/admin/customers/${userId}/password`, {
        method: 'PATCH',
        body: JSON.stringify({ newPassword: password })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to reset password');
      }

      toast({
        title: 'Success',
        description: 'User password reset successfully',
      });

      setNewPassword('');
      
    } catch (error) {
      console.error('Password reset error:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to reset password',
        variant: 'destructive',
      });
    } finally {
      setIsResettingPassword(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: 'Copied',
      description: 'Text copied to clipboard',
    });
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = (Array.isArray(users) ? users : []).filter(user => {
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
                  <p className="text-2xl font-bold text-cream mt-1">{Array.isArray(users) ? users.length : 0}</p>
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
                    {Array.isArray(users) ? users.filter(u => !u.isBlocked).length : 0}
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
                    {Array.isArray(users) ? users.filter(u => u.isBlocked).length : 0}
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
                    {Array.isArray(users) ? users.filter(u => u.role === 'admin').length : 0}
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
                              onClick={() => openUserDetails(user)}
                              className="text-cream/60 hover:text-cream"
                              title="View Details"
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openRoleDialog(user)}
                              className="text-gold hover:text-gold/80"
                              title="Change Role"
                            >
                              <UserCog className="w-4 h-4" />
                            </Button>

                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleUserStatus(user._id, user.isBlocked)}
                              className={cn(
                                user.isBlocked
                                  ? 'text-green-400 hover:text-green-300'
                                  : 'text-red-400 hover:text-red-300'
                              )}
                              title={user.isBlocked ? 'Unblock User' : 'Block User'}
                            >
                              {user.isBlocked ? (
                                <CheckCircle className="w-4 h-4" />
                              ) : (
                                <Ban className="w-4 h-4" />
                              )}
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
                <UsersIcon className="w-12 h-12 text-cream/40 mx-auto mb-4" />
                <p className="text-cream/60">No users found</p>
                <p className="text-cream/40 text-sm">Try adjusting your search or filters</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* User Details Dialog */}
        <Dialog open={isUserDetailsOpen} onOpenChange={setIsUserDetailsOpen}>
          <DialogContent className="bg-charcoal border-gold/20 max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-cream flex items-center">
                <Eye className="w-5 h-5 mr-2 text-gold" />
                User Details
              </DialogTitle>
              <DialogDescription className="text-cream/60">
                Complete information for {selectedUser?.name || 'this user'}
              </DialogDescription>
            </DialogHeader>
            
            {isLoadingDetails ? (
              <div className="flex items-center justify-center py-8">
                <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : detailedUser ? (
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-5 bg-obsidian">
                  <TabsTrigger value="overview" className="data-[state=active]:bg-gold/20">Overview</TabsTrigger>
                  <TabsTrigger value="personal" className="data-[state=active]:bg-gold/20">Personal</TabsTrigger>
                  <TabsTrigger value="orders" className="data-[state=active]:bg-gold/20">Orders</TabsTrigger>
                  <TabsTrigger value="addresses" className="data-[state=active]:bg-gold/20">Addresses</TabsTrigger>
                  <TabsTrigger value="security" className="data-[state=active]:bg-gold/20">Security</TabsTrigger>
                </TabsList>

                {/* Overview Tab */}
                <TabsContent value="overview" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="bg-obsidian border-gold/10">
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-gold/20 rounded-full flex items-center justify-center">
                            <UserIcon className="w-6 h-6 text-gold" />
                          </div>
                          <div>
                            <p className="font-medium text-cream">{detailedUser.name}</p>
                            <p className="text-sm text-cream/60">{detailedUser.email}</p>
                            <Badge className={cn(
                              "mt-1",
                              detailedUser.role === 'admin' 
                                ? 'bg-gold/20 text-gold border-gold/30'
                                : 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                            )}>
                              {detailedUser.role === 'admin' ? (
                                <>
                                  <Crown className="w-3 h-3 mr-1" />
                                  Admin
                                </>
                              ) : (
                                <>
                                  <UserIcon className="w-3 h-3 mr-1" />
                                  Customer
                                </>
                              )}
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-obsidian border-gold/10">
                      <CardContent className="p-4">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-cream/60 text-sm">Status</span>
                            <Badge className={cn(
                              detailedUser.isBlocked
                                ? 'bg-red-500/20 text-red-400 border-red-500/30'
                                : 'bg-green-500/20 text-green-400 border-green-500/30'
                            )}>
                              {detailedUser.isBlocked ? 'Blocked' : 'Active'}
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-cream/60 text-sm">Account Age</span>
                            <span className="text-cream text-sm">{detailedUser.accountAge || 0} days</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-cream/60 text-sm">Last Login</span>
                            <span className="text-cream text-sm">
                              {detailedUser.lastLogin 
                                ? new Date(detailedUser.lastLogin).toLocaleDateString()
                                : 'Never'
                              }
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="bg-obsidian border-gold/10">
                      <CardContent className="p-4 text-center">
                        <ShoppingCart className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                        <p className="text-2xl font-bold text-cream">{detailedUser.totalOrders || 0}</p>
                        <p className="text-cream/60 text-sm">Total Orders</p>
                      </CardContent>
                    </Card>

                    <Card className="bg-obsidian border-gold/10">
                      <CardContent className="p-4 text-center">
                        <DollarSign className="w-8 h-8 text-green-400 mx-auto mb-2" />
                        <p className="text-2xl font-bold text-cream">
                          {formatCurrency(detailedUser.totalSpent || 0)}
                        </p>
                        <p className="text-cream/60 text-sm">Total Spent</p>
                      </CardContent>
                    </Card>

                    <Card className="bg-obsidian border-gold/10">
                      <CardContent className="p-4 text-center">
                        <Heart className="w-8 h-8 text-red-400 mx-auto mb-2" />
                        <p className="text-2xl font-bold text-cream">{detailedUser.wishlist?.length || 0}</p>
                        <p className="text-cream/60 text-sm">Wishlist Items</p>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                {/* Personal Tab */}
                <TabsContent value="personal" className="space-y-4">
                  <Card className="bg-obsidian border-gold/10">
                    <CardHeader>
                      <CardTitle className="text-cream flex items-center">
                        <UserIcon className="w-5 h-5 mr-2" />
                        Personal Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-cream/60 text-sm">Full Name</label>
                          <div className="flex items-center space-x-2">
                            <Input 
                              value={detailedUser.name} 
                              readOnly 
                              className="bg-charcoal border-gold/20 text-cream"
                            />
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyToClipboard(detailedUser.name)}
                              className="text-cream/60 hover:text-cream"
                            >
                              <Copy className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-cream/60 text-sm">Email Address</label>
                          <div className="flex items-center space-x-2">
                            <Input 
                              value={detailedUser.email} 
                              readOnly 
                              className="bg-charcoal border-gold/20 text-cream"
                            />
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyToClipboard(detailedUser.email)}
                              className="text-cream/60 hover:text-cream"
                            >
                              <Copy className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-cream/60 text-sm">Phone Number</label>
                          <div className="flex items-center space-x-2">
                            <Input 
                              value={detailedUser.phone || 'Not provided'} 
                              readOnly 
                              className="bg-charcoal border-gold/20 text-cream"
                            />
                            {detailedUser.phone && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => copyToClipboard(detailedUser.phone!)}
                                className="text-cream/60 hover:text-cream"
                              >
                                <Copy className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-cream/60 text-sm">User ID</label>
                          <div className="flex items-center space-x-2">
                            <Input 
                              value={detailedUser._id} 
                              readOnly 
                              className="bg-charcoal border-gold/20 text-cream font-mono text-xs"
                            />
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyToClipboard(detailedUser._id)}
                              className="text-cream/60 hover:text-cream"
                            >
                              <Copy className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>

                      <Separator className="bg-gold/20" />

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-cream/60 text-sm">Account Created</label>
                          <Input 
                            value={new Date(detailedUser.createdAt).toLocaleString()} 
                            readOnly 
                            className="bg-charcoal border-gold/20 text-cream"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-cream/60 text-sm">Last Updated</label>
                          <Input 
                            value={new Date(detailedUser.updatedAt || detailedUser.createdAt).toLocaleString()} 
                            readOnly 
                            className="bg-charcoal border-gold/20 text-cream"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Orders Tab */}
                <TabsContent value="orders" className="space-y-4">
                  <Card className="bg-obsidian border-gold/10">
                    <CardHeader>
                      <CardTitle className="text-cream flex items-center">
                        <Package className="w-5 h-5 mr-2" />
                        Recent Orders
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {detailedUser.recentOrders && detailedUser.recentOrders.length > 0 ? (
                        <div className="space-y-3">
                          {detailedUser.recentOrders.map((order) => (
                            <div key={order._id} className="p-3 bg-charcoal rounded-lg border border-gold/10">
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="font-medium text-cream">{order.orderId}</p>
                                  <p className="text-sm text-cream/60">
                                    {new Date(order.createdAt).toLocaleDateString()}
                                  </p>
                                </div>
                                <div className="text-right">
                                  <p className="font-medium text-cream">
                                    {formatCurrency(order.pricing.total)}
                                  </p>
                                  <Badge className="text-xs">
                                    {order.status}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <Package className="w-12 h-12 text-cream/40 mx-auto mb-4" />
                          <p className="text-cream/60">No orders found</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Addresses Tab */}
                <TabsContent value="addresses" className="space-y-4">
                  <Card className="bg-obsidian border-gold/10">
                    <CardHeader>
                      <CardTitle className="text-cream flex items-center">
                        <MapPin className="w-5 h-5 mr-2" />
                        Saved Addresses
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {detailedUser.addresses && detailedUser.addresses.length > 0 ? (
                        <div className="space-y-4">
                          {detailedUser.addresses.map((address) => (
                            <div key={address._id} className="p-4 bg-charcoal rounded-lg border border-gold/10">
                              <div className="flex items-start justify-between">
                                <div className="space-y-1">
                                  <div className="flex items-center space-x-2">
                                    <p className="font-medium text-cream">{address.name}</p>
                                    {address.isDefault && (
                                      <Badge className="bg-gold/20 text-gold border-gold/30 text-xs">
                                        Default
                                      </Badge>
                                    )}
                                  </div>
                                  <p className="text-sm text-cream/60">{address.phone}</p>
                                  <p className="text-sm text-cream/80">
                                    {address.line1}
                                    {address.line2 && `, ${address.line2}`}
                                  </p>
                                  <p className="text-sm text-cream/80">
                                    {address.city}, {address.state} {address.pincode}
                                  </p>
                                  <p className="text-sm text-cream/60">{address.country}</p>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => copyToClipboard(
                                    `${address.name}\n${address.phone}\n${address.line1}${address.line2 ? ', ' + address.line2 : ''}\n${address.city}, ${address.state} ${address.pincode}\n${address.country}`
                                  )}
                                  className="text-cream/60 hover:text-cream"
                                >
                                  <Copy className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <MapPin className="w-12 h-12 text-cream/40 mx-auto mb-4" />
                          <p className="text-cream/60">No addresses saved</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Security Tab */}
                <TabsContent value="security" className="space-y-4">
                  <Card className="bg-obsidian border-gold/10">
                    <CardHeader>
                      <CardTitle className="text-cream flex items-center">
                        <Key className="w-5 h-5 mr-2" />
                        Security Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                        <div className="flex items-start space-x-2">
                          <AlertTriangle className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                          <div className="text-sm text-yellow-400">
                            <p className="font-medium mb-1">Security Notice:</p>
                            <p>For security reasons, passwords are encrypted and cannot be viewed. You can only reset them.</p>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-cream/60 text-sm">Password Status</label>
                          <div className="flex items-center space-x-2">
                            <div className={cn(
                              "w-3 h-3 rounded-full",
                              detailedUser.hasPassword ? 'bg-green-400' : 'bg-red-400'
                            )}></div>
                            <span className="text-cream text-sm">
                              {detailedUser.hasPassword ? 'Password Set' : 'No Password'}
                            </span>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-cream/60 text-sm">Last Password Change</label>
                          <span className="text-cream text-sm">
                            {detailedUser.passwordLastChanged 
                              ? new Date(detailedUser.passwordLastChanged).toLocaleDateString()
                              : 'Unknown'
                            }
                          </span>
                        </div>
                      </div>

                      <Separator className="bg-gold/20" />

                      <div className="space-y-4">
                        <h4 className="text-cream font-medium">Reset User Password</h4>
                        <div className="space-y-3">
                          <div className="space-y-2">
                            <label className="text-cream/60 text-sm">New Password</label>
                            <Input
                              type="password"
                              value={newPassword}
                              onChange={(e) => setNewPassword(e.target.value)}
                              placeholder="Enter new password (min 6 characters)"
                              className="bg-charcoal border-gold/20 text-cream"
                            />
                          </div>
                          <Button
                            onClick={() => resetUserPassword(detailedUser._id, newPassword)}
                            disabled={isResettingPassword || newPassword.length < 6}
                            className="bg-gold text-charcoal hover:bg-gold/80"
                          >
                            {isResettingPassword ? (
                              <>
                                <div className="w-4 h-4 border-2 border-charcoal border-t-transparent rounded-full animate-spin mr-2" />
                                Resetting...
                              </>
                            ) : (
                              <>
                                <Key className="w-4 h-4 mr-2" />
                                Reset Password
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            ) : (
              <div className="text-center py-8">
                <p className="text-cream/60">Failed to load user details</p>
              </div>
            )}

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsUserDetailsOpen(false)}
                className="border-gold/30 text-cream hover:bg-gold/10"
              >
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Role Change Dialog */}
        <Dialog open={isRoleDialogOpen} onOpenChange={setIsRoleDialogOpen}>
          <DialogContent className="bg-charcoal border-gold/20">
            <DialogHeader>
              <DialogTitle className="text-cream flex items-center">
                <UserCog className="w-5 h-5 mr-2 text-gold" />
                Change User Role
              </DialogTitle>
              <DialogDescription className="text-cream/60">
                Change the role for {selectedUser?.name || 'this user'}. This will affect their access permissions.
              </DialogDescription>
            </DialogHeader>
            
            {selectedUser && (
              <div className="space-y-4">
                <div className="p-4 bg-obsidian rounded-lg border border-gold/10">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gold/20 rounded-full flex items-center justify-center">
                      <UserIcon className="w-5 h-5 text-gold" />
                    </div>
                    <div>
                      <p className="font-medium text-cream">{selectedUser.name}</p>
                      <p className="text-sm text-cream/60">{selectedUser.email}</p>
                      <div className="flex items-center mt-1">
                        <span className="text-xs text-cream/40">Current Role: </span>
                        <Badge 
                          className={cn(
                            "ml-2",
                            (selectedUser.role || 'customer') === 'admin' 
                              ? 'bg-gold/20 text-gold border-gold/30'
                              : 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                          )}
                        >
                          {(selectedUser.role || 'customer') === 'admin' ? (
                            <>
                              <Crown className="w-3 h-3 mr-1" />
                              Admin
                            </>
                          ) : (
                            <>
                              <UserIcon className="w-3 h-3 mr-1" />
                              Customer
                            </>
                          )}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="text-sm font-medium text-cream">Select New Role:</p>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      variant="outline"
                      className={cn(
                        "h-auto p-4 flex flex-col items-center space-y-2 border-2 transition-all",
                        (selectedUser.role || 'customer') === 'customer'
                          ? 'border-blue-500/50 bg-blue-500/10 text-blue-400'
                          : 'border-gold/20 hover:border-blue-500/50 hover:bg-blue-500/10 text-cream hover:text-blue-400'
                      )}
                      onClick={() => changeUserRole(selectedUser._id, 'customer')}
                      disabled={isChangingRole || (selectedUser.role || 'customer') === 'customer'}
                    >
                      <UserIcon className="w-6 h-6" />
                      <div className="text-center">
                        <p className="font-medium">Customer</p>
                        <p className="text-xs opacity-80">Standard user access</p>
                      </div>
                    </Button>

                    <Button
                      variant="outline"
                      className={cn(
                        "h-auto p-4 flex flex-col items-center space-y-2 border-2 transition-all",
                        (selectedUser.role || 'customer') === 'admin'
                          ? 'border-gold/50 bg-gold/10 text-gold'
                          : 'border-gold/20 hover:border-gold/50 hover:bg-gold/10 text-cream hover:text-gold'
                      )}
                      onClick={() => changeUserRole(selectedUser._id, 'admin')}
                      disabled={isChangingRole || (selectedUser.role || 'customer') === 'admin'}
                    >
                      <Crown className="w-6 h-6" />
                      <div className="text-center">
                        <p className="font-medium">Admin</p>
                        <p className="text-xs opacity-80">Full system access</p>
                      </div>
                    </Button>
                  </div>
                </div>

                <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <Shield className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                    <div className="text-xs text-yellow-400">
                      <p className="font-medium mb-1">Important:</p>
                      <ul className="space-y-1 text-yellow-400/80">
                        <li>• Admin users can access the admin dashboard</li>
                        <li>• Admin users can manage other users and system settings</li>
                        <li>• This change takes effect immediately</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsRoleDialogOpen(false)}
                className="border-gold/30 text-cream hover:bg-gold/10"
                disabled={isChangingRole}
              >
                Cancel
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};

export default UsersPage;