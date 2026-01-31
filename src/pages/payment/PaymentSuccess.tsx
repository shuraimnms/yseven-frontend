import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle, Package, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { orderAPI } from '@/lib/api';
import { Order } from '@/types';
import SEO from '@/components/SEO';

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId');
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (orderId) {
      fetchOrderDetails();
    }
  }, [orderId]);

  const fetchOrderDetails = async () => {
    try {
      const response = await orderAPI.getMy();
      if (response.data.success) {
        const foundOrder = response.data.data.orders.find((o: Order) => o.orderId === orderId);
        if (foundOrder) {
          setOrder(foundOrder);
        }
      }
    } catch (error) {
      console.error('Fetch order error:', error);
    } finally {
      setIsLoading(false);
    }
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
        title="Payment Successful - Y7 Sauces"
        description="Your payment has been processed successfully. Thank you for your order!"
      />
      
      <div className="min-h-screen bg-black text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto text-center">
            {/* Success Icon */}
            <div className="w-24 h-24 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-8">
              <CheckCircle className="w-12 h-12 text-white" />
            </div>

            {/* Success Message */}
            <div>
              <h1 className="text-4xl font-bold mb-4">Payment Successful!</h1>
              <p className="text-xl text-gray-300 mb-8">
                Thank you for your order. Your payment has been processed successfully.
              </p>
            </div>

            {/* Order Details */}
            {order && (
              <div>
                <Card className="bg-gray-900 border-gray-800 mb-8">
                  <CardContent className="p-6">
                    <div className="grid md:grid-cols-2 gap-6 text-left">
                      <div>
                        <h3 className="font-semibold mb-4">Order Information</h3>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-400">Order ID:</span>
                            <span className="font-mono">{order.orderId}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Items:</span>
                            <span>{order.items.length} items</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Total Amount:</span>
                            <span className="font-bold text-yellow-500">₹{order.pricing.total}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Payment Status:</span>
                            <Badge className="bg-green-600 text-white">Paid</Badge>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="font-semibold mb-4">Delivery Information</h3>
                        <div className="text-sm text-gray-300">
                          <p className="font-medium">{order.shippingAddress.name}</p>
                          <p>{order.shippingAddress.phone}</p>
                          <p className="mt-1">
                            {order.shippingAddress.line1}
                            {order.shippingAddress.line2 && `, ${order.shippingAddress.line2}`}
                            <br />
                            {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* What's Next */}
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 mb-8">
              <h3 className="font-semibold mb-4">What happens next?</h3>
              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div className="text-center">
                  <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Package className="w-6 h-6 text-black" />
                  </div>
                  <p className="font-medium">Order Processing</p>
                  <p className="text-gray-400">We'll prepare your order for shipping</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Package className="w-6 h-6 text-white" />
                  </div>
                  <p className="font-medium">Shipping</p>
                  <p className="text-gray-400">Your order will be shipped within 2-3 days</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-2">
                    <CheckCircle className="w-6 h-6 text-white" />
                  </div>
                  <p className="font-medium">Delivery</p>
                  <p className="text-gray-400">Enjoy your premium sauces!</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild className="bg-yellow-500 hover:bg-yellow-600 text-black">
                <Link to="/orders">
                  <Package className="w-4 h-4 mr-2" />
                  Track Your Order
                </Link>
              </Button>
              
              <Button variant="outline" asChild>
                <Link to="/shop">
                  Continue Shopping
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </div>

            {/* Email Confirmation */}
            <p className="text-sm text-gray-400 mt-8">
              📧 A confirmation email has been sent to your registered email address.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}