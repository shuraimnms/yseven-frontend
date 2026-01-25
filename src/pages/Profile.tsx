import { useState, useEffect } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Edit, 
  Save, 
  X, 
  Plus,
  Trash2,
  Shield,
  Package,
  Heart
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { useAuthStore } from '@/store/authStore';
import { userAPI } from '@/lib/api';
import { Address } from '@/types';
import SEO from '@/components/SEO';

export default function Profile() {
  const { user, updateUser } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || ''
  });

  const [addressForm, setAddressForm] = useState({
    name: '',
    phone: '',
    line1: '',
    line2: '',
    city: '',
    state: '',
    pincode: '',
    country: 'India',
    isDefault: false
  });

  useEffect(() => {
    if (user) {
      setProfileForm({
        name: user.name,
        email: user.email,
        phone: user.phone
      });
    }
    fetchAddresses();
  }, [user]);

  const fetchAddresses = async () => {
    try {
      const response = await userAPI.getAddresses();
      if (response.data.success) {
        setAddresses(response.data.data.addresses);
      }
    } catch (error) {
      console.error('Fetch addresses error:', error);
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await userAPI.updateProfile(profileForm);
      if (response.data.success) {
        updateUser(response.data.data.user);
        toast.success('Profile updated successfully');
        setIsEditing(false);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddressSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (editingAddress) {
        await userAPI.updateAddress(editingAddress._id, addressForm);
        toast.success('Address updated successfully');
      } else {
        await userAPI.addAddress(addressForm);
        toast.success('Address added successfully');
      }
      
      setShowAddressForm(false);
      setEditingAddress(null);
      resetAddressForm();
      fetchAddresses();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to save address');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAddress = async (addressId: string) => {
    try {
      await userAPI.deleteAddress(addressId);
      toast.success('Address deleted successfully');
      fetchAddresses();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete address');
    }
  };

  const handleEditAddress = (address: Address) => {
    setEditingAddress(address);
    setAddressForm({
      name: address.name,
      phone: address.phone,
      line1: address.line1,
      line2: address.line2 || '',
      city: address.city,
      state: address.state,
      pincode: address.pincode,
      country: address.country,
      isDefault: address.isDefault
    });
    setShowAddressForm(true);
  };

  const resetAddressForm = () => {
    setAddressForm({
      name: '',
      phone: '',
      line1: '',
      line2: '',
      city: '',
      state: '',
      pincode: '',
      country: 'India',
      isDefault: false
    });
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  return (
    <>
      <SEO 
        title="My Profile - Y7 Sauces"
        description="Manage your profile, addresses, and account settings for Y7 Sauces."
      />
      
      <div className="min-h-screen bg-black text-white">
        <div className="container mx-auto px-4 py-8">
          <div>
            <h1 className="text-3xl font-bold mb-8">My Profile</h1>

            <Tabs defaultValue="profile" className="space-y-8">
              <TabsList className="bg-gray-900 border-gray-800">
                <TabsTrigger value="profile" className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Profile
                </TabsTrigger>
                <TabsTrigger value="addresses" className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Addresses
                </TabsTrigger>
                <TabsTrigger value="security" className="flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Security
                </TabsTrigger>
              </TabsList>

              {/* Profile Tab */}
              <TabsContent value="profile">
                <div className="grid lg:grid-cols-3 gap-8">
                  {/* Profile Info */}
                  <div className="lg:col-span-2">
                    <Card className="bg-gray-900 border-gray-800">
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                          <span>Personal Information</span>
                          {!isEditing && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setIsEditing(true)}
                            >
                              <Edit className="w-4 h-4 mr-2" />
                              Edit
                            </Button>
                          )}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        {isEditing ? (
                          <form onSubmit={handleProfileUpdate} className="space-y-4">
                            <div>
                              <Label htmlFor="name">Full Name</Label>
                              <Input
                                id="name"
                                value={profileForm.name}
                                onChange={(e) => setProfileForm(prev => ({ ...prev, name: e.target.value }))}
                                required
                                className="bg-gray-800 border-gray-700"
                              />
                            </div>
                            <div>
                              <Label htmlFor="email">Email Address</Label>
                              <Input
                                id="email"
                                type="email"
                                value={profileForm.email}
                                onChange={(e) => setProfileForm(prev => ({ ...prev, email: e.target.value }))}
                                required
                                className="bg-gray-800 border-gray-700"
                              />
                            </div>
                            <div>
                              <Label htmlFor="phone">Phone Number</Label>
                              <Input
                                id="phone"
                                value={profileForm.phone}
                                onChange={(e) => setProfileForm(prev => ({ ...prev, phone: e.target.value }))}
                                required
                                className="bg-gray-800 border-gray-700"
                              />
                            </div>
                            <div className="flex gap-4">
                              <Button type="submit" disabled={isLoading}>
                                <Save className="w-4 h-4 mr-2" />
                                {isLoading ? 'Saving...' : 'Save Changes'}
                              </Button>
                              <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                  setIsEditing(false);
                                  setProfileForm({
                                    name: user.name,
                                    email: user.email,
                                    phone: user.phone
                                  });
                                }}
                              >
                                <X className="w-4 h-4 mr-2" />
                                Cancel
                              </Button>
                            </div>
                          </form>
                        ) : (
                          <div className="space-y-4">
                            <div className="flex items-center gap-3">
                              <User className="w-5 h-5 text-gray-400" />
                              <div>
                                <p className="font-medium">{user.name}</p>
                                <p className="text-sm text-gray-400">Full Name</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <Mail className="w-5 h-5 text-gray-400" />
                              <div>
                                <p className="font-medium">{user.email}</p>
                                <p className="text-sm text-gray-400">Email Address</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <Phone className="w-5 h-5 text-gray-400" />
                              <div>
                                <p className="font-medium">{user.phone}</p>
                                <p className="text-sm text-gray-400">Phone Number</p>
                              </div>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>

                  {/* Account Stats */}
                  <div className="space-y-6">
                    <Card className="bg-gray-900 border-gray-800">
                      <CardHeader>
                        <CardTitle>Account Status</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Email Verified</span>
                          <Badge className={user.emailVerified ? 'bg-green-600' : 'bg-red-600'}>
                            {user.emailVerified ? 'Verified' : 'Not Verified'}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Phone Verified</span>
                          <Badge className={user.phoneVerified ? 'bg-green-600' : 'bg-red-600'}>
                            {user.phoneVerified ? 'Verified' : 'Not Verified'}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Account Type</span>
                          <Badge className="bg-yellow-500 text-black capitalize">
                            {user.role}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-gray-900 border-gray-800">
                      <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <Button variant="outline" className="w-full justify-start">
                          <Package className="w-4 h-4 mr-2" />
                          My Orders
                        </Button>
                        <Button variant="outline" className="w-full justify-start">
                          <Heart className="w-4 h-4 mr-2" />
                          Wishlist
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>

              {/* Addresses Tab */}
              <TabsContent value="addresses">
                <Card className="bg-gray-900 border-gray-800">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>Saved Addresses</span>
                      <Dialog open={showAddressForm} onOpenChange={setShowAddressForm}>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Plus className="w-4 h-4 mr-2" />
                            Add New Address
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-gray-900 border-gray-800 text-white max-w-md">
                          <DialogHeader>
                            <DialogTitle>
                              {editingAddress ? 'Edit Address' : 'Add New Address'}
                            </DialogTitle>
                          </DialogHeader>
                          <form onSubmit={handleAddressSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label htmlFor="name">Full Name</Label>
                                <Input
                                  id="name"
                                  value={addressForm.name}
                                  onChange={(e) => setAddressForm(prev => ({ ...prev, name: e.target.value }))}
                                  required
                                  className="bg-gray-800 border-gray-700"
                                />
                              </div>
                              <div>
                                <Label htmlFor="phone">Phone</Label>
                                <Input
                                  id="phone"
                                  value={addressForm.phone}
                                  onChange={(e) => setAddressForm(prev => ({ ...prev, phone: e.target.value }))}
                                  required
                                  className="bg-gray-800 border-gray-700"
                                />
                              </div>
                            </div>
                            <div>
                              <Label htmlFor="line1">Address Line 1</Label>
                              <Input
                                id="line1"
                                value={addressForm.line1}
                                onChange={(e) => setAddressForm(prev => ({ ...prev, line1: e.target.value }))}
                                required
                                className="bg-gray-800 border-gray-700"
                              />
                            </div>
                            <div>
                              <Label htmlFor="line2">Address Line 2 (Optional)</Label>
                              <Input
                                id="line2"
                                value={addressForm.line2}
                                onChange={(e) => setAddressForm(prev => ({ ...prev, line2: e.target.value }))}
                                className="bg-gray-800 border-gray-700"
                              />
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                              <div>
                                <Label htmlFor="city">City</Label>
                                <Input
                                  id="city"
                                  value={addressForm.city}
                                  onChange={(e) => setAddressForm(prev => ({ ...prev, city: e.target.value }))}
                                  required
                                  className="bg-gray-800 border-gray-700"
                                />
                              </div>
                              <div>
                                <Label htmlFor="state">State</Label>
                                <Input
                                  id="state"
                                  value={addressForm.state}
                                  onChange={(e) => setAddressForm(prev => ({ ...prev, state: e.target.value }))}
                                  required
                                  className="bg-gray-800 border-gray-700"
                                />
                              </div>
                              <div>
                                <Label htmlFor="pincode">Pincode</Label>
                                <Input
                                  id="pincode"
                                  value={addressForm.pincode}
                                  onChange={(e) => setAddressForm(prev => ({ ...prev, pincode: e.target.value }))}
                                  required
                                  className="bg-gray-800 border-gray-700"
                                />
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id="isDefault"
                                checked={addressForm.isDefault}
                                onCheckedChange={(checked) => 
                                  setAddressForm(prev => ({ ...prev, isDefault: checked as boolean }))
                                }
                              />
                              <Label htmlFor="isDefault">Set as default address</Label>
                            </div>
                            <div className="flex gap-4">
                              <Button type="submit" disabled={isLoading} className="flex-1">
                                {isLoading ? 'Saving...' : editingAddress ? 'Update' : 'Add Address'}
                              </Button>
                              <Button 
                                type="button" 
                                variant="outline" 
                                onClick={() => {
                                  setShowAddressForm(false);
                                  setEditingAddress(null);
                                  resetAddressForm();
                                }}
                              >
                                Cancel
                              </Button>
                            </div>
                          </form>
                        </DialogContent>
                      </Dialog>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {addresses.length === 0 ? (
                      <div className="text-center py-12">
                        <MapPin className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                        <p className="text-gray-400 mb-4">No addresses saved yet</p>
                        <Button onClick={() => setShowAddressForm(true)}>
                          Add Your First Address
                        </Button>
                      </div>
                    ) : (
                      <div className="grid gap-4">
                        {addresses.map((address) => (
                          <div key={address._id} className="p-4 border border-gray-700 rounded-lg">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <p className="font-semibold">{address.name}</p>
                                  {address.isDefault && (
                                    <Badge className="bg-yellow-500 text-black">Default</Badge>
                                  )}
                                </div>
                                <p className="text-sm text-gray-400 mb-1">{address.phone}</p>
                                <p className="text-sm text-gray-300">
                                  {address.line1}
                                  {address.line2 && `, ${address.line2}`}
                                  <br />
                                  {address.city}, {address.state} - {address.pincode}
                                </p>
                              </div>
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleEditAddress(address)}
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDeleteAddress(address._id)}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Security Tab */}
              <TabsContent value="security">
                <Card className="bg-gray-900 border-gray-800">
                  <CardHeader>
                    <CardTitle>Security Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="p-4 border border-gray-700 rounded-lg">
                      <h3 className="font-semibold mb-2">Change Password</h3>
                      <p className="text-sm text-gray-400 mb-4">
                        Update your password to keep your account secure
                      </p>
                      <Button variant="outline">Change Password</Button>
                    </div>
                    
                    <div className="p-4 border border-gray-700 rounded-lg">
                      <h3 className="font-semibold mb-2">Two-Factor Authentication</h3>
                      <p className="text-sm text-gray-400 mb-4">
                        Add an extra layer of security to your account
                      </p>
                      <Button variant="outline">Enable 2FA</Button>
                    </div>

                    <div className="p-4 border border-red-800 rounded-lg">
                      <h3 className="font-semibold mb-2 text-red-400">Delete Account</h3>
                      <p className="text-sm text-gray-400 mb-4">
                        Permanently delete your account and all associated data
                      </p>
                      <Button variant="destructive">Delete Account</Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </>
  );
}