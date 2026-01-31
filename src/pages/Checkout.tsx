import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  CreditCard, 
  MapPin, 
  Plus, 
  Edit, 
  Trash2, 
  Check,
  ArrowLeft,
  Truck,
  Shield
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import { userAPI, orderAPI, paymentAPI } from '@/lib/api';
import { Address } from '@/types';
import SEO from '@/components/SEO';

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function Checkout() {
  const navigate = useNavigate();
  const { cart, fetchCart, clearCart } = useCartStore();
  const { user, isAuthenticated } = useAuthStore();
  
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<'razorpay' | 'cashfree'>('razorpay');
  const [isLoading, setIsLoading] = useState(false);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  
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
    if (!isAuthenticated) {
      navigate('/auth/login');
      return;
    }
    
    fetchCart();
    fetchAddresses();
  }, [isAuthenticated, navigate, fetchCart]);

  const fetchAddresses = async () => {
    try {
      const response = await userAPI.getAddresses();
      if (response.data.success) {
        setAddresses(response.data.data.addresses);
        // Auto-select default address
        const defaultAddress = response.data.data.addresses.find((addr: Address) => addr.isDefault);
        if (defaultAddress) {
          setSelectedAddress(defaultAddress._id);
        }
      }
    } catch (error) {
      console.error('Fetch addresses error:', error);
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
      if (selectedAddress === addressId) {
        setSelectedAddress('');
      }
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

  const calculatePricing = () => {
    const subtotal = cart.subtotal;
    const tax = Math.round(subtotal * 0.18); // 18% GST
    const shipping = subtotal >= 499 ? 0 : 49;
    const total = subtotal + tax + shipping;
    
    return { subtotal, tax, shipping, total };
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      toast.error('Please select a delivery address');
      return;
    }

    if (cart.items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    setIsLoading(true);

    try {
      // Create order
      const orderResponse = await orderAPI.create({
        addressId: selectedAddress,
        paymentMethod
      });

      if (!orderResponse.data.success) {
        throw new Error('Failed to create order');
      }

      const order = orderResponse.data.data.order;
      
      // Initiate payment
      if (paymentMethod === 'razorpay') {
        await initiateRazorpayPayment(order.orderId);
      } else {
        await initiateCashfreePayment(order.orderId);
      }
      
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to place order');
      setIsLoading(false);
    }
  };

  const initiateRazorpayPayment = async (orderId: string) => {
    try {
      const response = await paymentAPI.startRazorpay(orderId);
      const { razorpayOrderId, amount, currency, key } = response.data.data;

      const options = {
        key,
        amount,
        currency,
        order_id: razorpayOrderId,
        name: 'Y7 Sauces',
        description: 'Premium Sauces & Condiments',
        image: '/favicon.png',
        handler: async (response: any) => {
          // Payment successful
          toast.success('Payment successful! Redirecting...');
          await clearCart();
          navigate(`/payment/success?orderId=${orderId}`);
        },
        modal: {
          ondismiss: () => {
            setIsLoading(false);
            toast.error('Payment cancelled');
          }
        },
        theme: {
          color: '#EAB308'
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error: any) {
      toast.error('Failed to initiate payment');
      setIsLoading(false);
    }
  };

  const initiateCashfreePayment = async (orderId: string) => {
    try {
      const response = await paymentAPI.startCashfree(orderId);
      const { paymentSessionId } = response.data.data;
      
      // Redirect to Cashfree payment page
      window.location.href = `https://sandbox.cashfree.com/pg/view/order/${paymentSessionId}`;
    } catch (error: any) {
      toast.error('Failed to initiate payment');
      setIsLoading(false);
    }
  };

  const pricing = calculatePricing();

  if (!isAuthenticated) {
    return null;
  }

  if (cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold mb-4">Your cart is empty</h1>
        <p className="text-gray-400 mb-8">Add some delicious sauces to get started!</p>
        <Button asChild>
          <a href="/shop">Continue Shopping</a>
        </Button>
      </div>
    );
  }

  return (
    <>
      <SEO 
        title="Checkout - Y7 Sauces"
        description="Complete your order for premium sauces and condiments. Secure checkout with multiple payment options."
      />
      
      <div className="min-h-screen bg-black text-white">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/cart')}
              className="text-gray-400 hover:text-white"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Cart
            </Button>
            <h1 className="text-3xl font-bold">Checkout</h1>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Address & Payment */}
            <div className="lg:col-span-2 space-y-8">
              {/* Delivery Address */}
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-yellow-500" />
                      Delivery Address
                    </div>
                    <Dialog open={showAddressForm} onOpenChange={setShowAddressForm}>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Plus className="w-4 h-4 mr-2" />
                          Add New
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="bg-gray-900 border-gray-800 text-white">
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
                              <Label htmlFor="phone">Phone Number</Label>
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
                              {isLoading ? 'Saving...' : editingAddress ? 'Update Address' : 'Add Address'}
                            </Button>
                            <Button 
                              type="button" 
                              variant="outline" 
                              onClick={() => {
                                setShowAddressForm(false);
                                setEditingAddress(null);
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
                <CardContent className="space-y-4">
                  {addresses.length === 0 ? (
                    <p className="text-gray-400 text-center py-8">
                      No addresses found. Please add a delivery address.
                    </p>
                  ) : (
                    <RadioGroup value={selectedAddress} onValueChange={setSelectedAddress}>
                      {addresses.map((address) => (
                        <div key={address._id} className="flex items-start space-x-3 p-4 border border-gray-700 rounded-lg">
                          <RadioGroupItem value={address._id} id={address._id} className="mt-1" />
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-semibold">{address.name}</p>
                                <p className="text-sm text-gray-400">{address.phone}</p>
                              </div>
                              <div className="flex items-center gap-2">
                                {address.isDefault && (
                                  <Badge className="bg-yellow-500 text-black">Default</Badge>
                                )}
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
                            <p className="text-sm text-gray-300 mt-2">
                              {address.line1}
                              {address.line2 && `, ${address.line2}`}
                              <br />
                              {address.city}, {address.state} - {address.pincode}
                            </p>
                          </div>
                        </div>
                      ))}
                    </RadioGroup>
                  )}
                </CardContent>
              </Card>

              {/* Payment Method */}
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-yellow-500" />
                    Payment Method
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup value={paymentMethod} onValueChange={(value) => setPaymentMethod(value as 'razorpay' | 'cashfree')}>
                    <div className="flex items-center space-x-3 p-4 border border-gray-700 rounded-lg">
                      <RadioGroupItem value="razorpay" id="razorpay" />
                      <div className="flex-1">
                        <Label htmlFor="razorpay" className="font-semibold">Razorpay</Label>
                        <p className="text-sm text-gray-400">Credit/Debit Cards, UPI, Net Banking, Wallets</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-4 border border-gray-700 rounded-lg">
                      <RadioGroupItem value="cashfree" id="cashfree" />
                      <div className="flex-1">
                        <Label htmlFor="cashfree" className="font-semibold">Cashfree</Label>
                        <p className="text-sm text-gray-400">All payment methods supported</p>
                      </div>
                    </div>
                  </RadioGroup>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Order Summary */}
            <div>
              <Card className="bg-gray-900 border-gray-800 sticky top-8">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Items */}
                  <div className="space-y-3">
                    {cart.items.map((item) => (
                      <div key={item.id} className="flex items-center gap-3">
                        <img
                          src={item.image || '/placeholder.svg'}
                          alt={item.name}
                          className="w-12 h-12 object-cover rounded"
                        />
                        <div className="flex-1">
                          <p className="font-medium text-sm">{item.name}</p>
                          <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                        </div>
                        <p className="font-semibold">₹{item.price * item.quantity}</p>
                      </div>
                    ))}
                  </div>

                  <Separator className="bg-gray-700" />

                  {/* Pricing */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal ({cart.itemCount} items)</span>
                      <span>₹{pricing.subtotal}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Tax (18% GST)</span>
                      <span>₹{pricing.tax}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Shipping</span>
                      <span>{pricing.shipping === 0 ? 'FREE' : `₹${pricing.shipping}`}</span>
                    </div>
                    {pricing.shipping === 0 && (
                      <p className="text-xs text-green-500">
                        🎉 You saved ₹49 on shipping!
                      </p>
                    )}
                  </div>

                  <Separator className="bg-gray-700" />

                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span className="text-yellow-500">₹{pricing.total}</span>
                  </div>

                  {/* Features */}
                  <div className="space-y-2 pt-4">
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <Shield className="w-4 h-4 text-green-500" />
                      <span>Secure payment</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <Truck className="w-4 h-4 text-blue-500" />
                      <span>Fast delivery</span>
                    </div>
                  </div>

                  <Button
                    onClick={handlePlaceOrder}
                    disabled={!selectedAddress || isLoading || cart.items.length === 0}
                    className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-semibold"
                  >
                    {isLoading ? 'Processing...' : `Place Order - ₹${pricing.total}`}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}