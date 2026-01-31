import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Package, 
  Clock, 
  CheckCircle, 
  Truck, 
  XCircle,
  Eye,
  RotateCcw,
  Calendar,
  MapPin,
  CreditCard
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { orderAPI } from '@/lib/api';
import { Order } from '@/types';
import SEO from '@/components/SEO';
import { toast } from 'sonner';

const statusConfig = {
  PENDING: { color: 'bg-yellow-600', icon: Clock, label: 'Pending' },
  created: { color: 'bg-blue-600', icon: Package, label: 'Created' },
  confirmed: { color: 'bg-green-600', icon: CheckCircle, label: 'Confirmed' },
  shipped: { color: 'bg-purple-600', icon: Truck, label: 'Shipped' },
  delivered: { color: 'bg-green-700', icon: CheckCircle, label: 'Delivered' },
  cancelled: { color: 'bg-red-600', icon: XCircle, label: 'Cancelled' }
};

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await orderAPI.getMy();
      if (response.data.success) {
        setOrders(response.data.data.orders);
      }
    } catch (error) {
      console.error('Fetch orders error:', error);
      toast.error('Failed to fetch orders');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusIcon = (status: string) => {
    const config = statusConfig[status as keyof typeof statusConfig];
    if (!config) return statusConfig.PENDING;
    return config;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  return (
    <>
      <SEO 
        title="My Orders - Y7 Sauces"
        description="Track your orders and view order history for Y7 Sauces premium condiments."
      />
      
      <div className="min-h-screen bg-black text-white">
        <div className="container mx-auto px-4 py-8">
          <div>
            <h1 className="text-3xl font-bold mb-8">My Orders</h1>

            {orders.length === 0 ? (
              <Card className="bg-gray-900 border-gray-800">
                <CardContent className="text-center py-16">
                  <Package className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <h2 className="text-xl font-semibold mb-2">No orders yet</h2>
                  <p className="text-gray-400 mb-6">
                    Start shopping to see your orders here
                  </p>
                  <Button asChild>
                    <Link to="/shop">Start Shopping</Link>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                {orders.map((order) => {
                  const statusInfo = getStatusIcon(order.status);
                  const StatusIcon = statusInfo.icon;

                  return (
                    <div key={order._id}>
                      <Card className="bg-gray-900 border-gray-800 hover:border-gray-700 transition-colors">
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <div>
                              <CardTitle className="text-lg">Order #{order.orderId}</CardTitle>
                              <p className="text-sm text-gray-400 flex items-center gap-2 mt-1">
                                <Calendar className="w-4 h-4" />
                                {formatDate(order.createdAt)}
                              </p>
                            </div>
                            <div className="flex items-center gap-3">
                              <Badge className={`${statusInfo.color} text-white`}>
                                <StatusIcon className="w-3 h-3 mr-1" />
                                {statusInfo.label}
                              </Badge>
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => setSelectedOrder(order)}
                                  >
                                    <Eye className="w-4 h-4 mr-2" />
                                    View Details
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="bg-gray-900 border-gray-800 text-white max-w-2xl">
                                  <DialogHeader>
                                    <DialogTitle>Order Details - #{order.orderId}</DialogTitle>
                                  </DialogHeader>
                                  {selectedOrder && (
                                    <div className="space-y-6">
                                      {/* Order Status */}
                                      <div className="flex items-center gap-3">
                                        <StatusIcon className="w-5 h-5 text-yellow-500" />
                                        <span className="font-semibold">Status: {statusInfo.label}</span>
                                      </div>

                                      {/* Items */}
                                      <div>
                                        <h3 className="font-semibold mb-3">Items Ordered</h3>
                                        <div className="space-y-3">
                                          {selectedOrder.items.map((item, index) => (
                                            <div key={index} className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg">
                                              <img
                                                src={item.image || '/placeholder.svg'}
                                                alt={item.name}
                                                className="w-12 h-12 object-cover rounded"
                                              />
                                              <div className="flex-1">
                                                <p className="font-medium">{item.name}</p>
                                                <p className="text-sm text-gray-400">Qty: {item.quantity}</p>
                                              </div>
                                              <p className="font-semibold">₹{item.price * item.quantity}</p>
                                            </div>
                                          ))}
                                        </div>
                                      </div>

                                      {/* Pricing */}
                                      <div className="bg-gray-800 p-4 rounded-lg">
                                        <h3 className="font-semibold mb-3">Order Summary</h3>
                                        <div className="space-y-2">
                                          <div className="flex justify-between text-sm">
                                            <span>Subtotal</span>
                                            <span>₹{selectedOrder.pricing.subtotal}</span>
                                          </div>
                                          <div className="flex justify-between text-sm">
                                            <span>Tax (18% GST)</span>
                                            <span>₹{selectedOrder.pricing.tax}</span>
                                          </div>
                                          <div className="flex justify-between text-sm">
                                            <span>Shipping</span>
                                            <span>{selectedOrder.pricing.shipping === 0 ? 'FREE' : `₹${selectedOrder.pricing.shipping}`}</span>
                                          </div>
                                          <Separator className="bg-gray-700" />
                                          <div className="flex justify-between font-bold">
                                            <span>Total</span>
                                            <span className="text-yellow-500">₹{selectedOrder.pricing.total}</span>
                                          </div>
                                        </div>
                                      </div>

                                      {/* Shipping Address */}
                                      <div className="bg-gray-800 p-4 rounded-lg">
                                        <h3 className="font-semibold mb-3 flex items-center gap-2">
                                          <MapPin className="w-4 h-4" />
                                          Shipping Address
                                        </h3>
                                        <div className="text-sm text-gray-300">
                                          <p className="font-medium">{selectedOrder.shippingAddress.name}</p>
                                          <p>{selectedOrder.shippingAddress.phone}</p>
                                          <p className="mt-1">
                                            {selectedOrder.shippingAddress.line1}
                                            {selectedOrder.shippingAddress.line2 && `, ${selectedOrder.shippingAddress.line2}`}
                                            <br />
                                            {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} - {selectedOrder.shippingAddress.pincode}
                                          </p>
                                        </div>
                                      </div>

                                      {/* Payment Info */}
                                      <div className="bg-gray-800 p-4 rounded-lg">
                                        <h3 className="font-semibold mb-3 flex items-center gap-2">
                                          <CreditCard className="w-4 h-4" />
                                          Payment Information
                                        </h3>
                                        <div className="text-sm text-gray-300">
                                          <p>Method: {selectedOrder.payment.provider ? selectedOrder.payment.provider.charAt(0).toUpperCase() + selectedOrder.payment.provider.slice(1) : 'N/A'}</p>
                                          <p>Status: <span className={`font-medium ${selectedOrder.payment.status === 'paid' ? 'text-green-400' : 'text-yellow-400'}`}>
                                            {selectedOrder.payment.status.charAt(0).toUpperCase() + selectedOrder.payment.status.slice(1)}
                                          </span></p>
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </DialogContent>
                              </Dialog>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {/* Items Preview */}
                            <div>
                              <p className="text-sm text-gray-400 mb-2">Items ({order.items.length})</p>
                              <div className="flex -space-x-2">
                                {order.items.slice(0, 3).map((item, index) => (
                                  <img
                                    key={index}
                                    src={item.image || '/placeholder.svg'}
                                    alt={item.name}
                                    className="w-8 h-8 object-cover rounded-full border-2 border-gray-900"
                                  />
                                ))}
                                {order.items.length > 3 && (
                                  <div className="w-8 h-8 bg-gray-700 rounded-full border-2 border-gray-900 flex items-center justify-center text-xs">
                                    +{order.items.length - 3}
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Total Amount */}
                            <div>
                              <p className="text-sm text-gray-400 mb-2">Total Amount</p>
                              <p className="font-bold text-yellow-500">₹{order.pricing.total}</p>
                            </div>

                            {/* Payment Status */}
                            <div>
                              <p className="text-sm text-gray-400 mb-2">Payment</p>
                              <Badge className={order.payment.status === 'paid' ? 'bg-green-600' : 'bg-yellow-600'}>
                                {order.payment.status.charAt(0).toUpperCase() + order.payment.status.slice(1)}
                              </Badge>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-2">
                              {order.status === 'delivered' && (
                                <Button variant="outline" size="sm">
                                  <RotateCcw className="w-4 h-4 mr-2" />
                                  Reorder
                                </Button>
                              )}
                              {(order.status === 'PENDING' || order.status === 'created') && (
                                <Button variant="destructive" size="sm">
                                  Cancel
                                </Button>
                              )}
                            </div>
                          </div>

                          {/* Order Progress */}
                          <div className="mt-6">
                            <div className="flex items-center justify-between text-sm">
                              <div className={`flex items-center gap-2 ${
                                ['created', 'confirmed', 'shipped', 'delivered'].includes(order.status) ? 'text-green-400' : 'text-gray-400'
                              }`}>
                                <div className={`w-2 h-2 rounded-full ${
                                  ['created', 'confirmed', 'shipped', 'delivered'].includes(order.status) ? 'bg-green-400' : 'bg-gray-600'
                                }`} />
                                Order Placed
                              </div>
                              <div className={`flex items-center gap-2 ${
                                ['confirmed', 'shipped', 'delivered'].includes(order.status) ? 'text-green-400' : 'text-gray-400'
                              }`}>
                                <div className={`w-2 h-2 rounded-full ${
                                  ['confirmed', 'shipped', 'delivered'].includes(order.status) ? 'bg-green-400' : 'bg-gray-600'
                                }`} />
                                Confirmed
                              </div>
                              <div className={`flex items-center gap-2 ${
                                ['shipped', 'delivered'].includes(order.status) ? 'text-green-400' : 'text-gray-400'
                              }`}>
                                <div className={`w-2 h-2 rounded-full ${
                                  ['shipped', 'delivered'].includes(order.status) ? 'bg-green-400' : 'bg-gray-600'
                                }`} />
                                Shipped
                              </div>
                              <div className={`flex items-center gap-2 ${
                                order.status === 'delivered' ? 'text-green-400' : 'text-gray-400'
                              }`}>
                                <div className={`w-2 h-2 rounded-full ${
                                  order.status === 'delivered' ? 'bg-green-400' : 'bg-gray-600'
                                }`} />
                                Delivered
                              </div>
                            </div>
                            <div className="w-full bg-gray-700 h-1 rounded-full mt-2">
                              <div 
                                className="bg-green-400 h-1 rounded-full transition-all duration-500"
                                style={{
                                  width: order.status === 'delivered' ? '100%' : 
                                         order.status === 'shipped' ? '75%' :
                                         order.status === 'confirmed' ? '50%' :
                                         ['created', 'PENDING'].includes(order.status) ? '25%' : '0%'
                                }}
                              />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}