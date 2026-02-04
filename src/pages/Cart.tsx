import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useCartStore } from '@/store/cartStore';
import { useToast } from '@/hooks/use-toast';
import SEO from '@/components/SEO';
import { generateSEO } from '@/lib/seo';

const Cart = () => {
  const { cart, isLoading, fetchCart, updateCartItem, removeFromCart } = useCartStore();
  const { toast } = useToast();

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const handleUpdateQuantity = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    try {
      await updateCartItem(itemId, newQuantity);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update cart item',
        variant: 'destructive',
      });
    }
  };

  const handleRemoveItem = async (itemId: string) => {
    try {
      await removeFromCart(itemId);
      toast({
        title: 'Item removed',
        description: 'Item has been removed from your cart',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to remove item from cart',
        variant: 'destructive',
      });
    }
  };

  const calculateTax = (subtotal: number) => subtotal * 0.18;
  const calculateShipping = (subtotal: number) => subtotal > 499 ? 0 : 49;
  const calculateTotal = (subtotal: number) => {
    const tax = calculateTax(subtotal);
    const shipping = calculateShipping(subtotal);
    return subtotal + tax + shipping;
  };

  const seoData = generateSEO({
    title: 'Shopping Cart - Y7 Sauces',
    description: 'Review your Y7 Sauces cart and proceed to checkout. Premium sauces and condiments ready for delivery.',
    canonical: 'https://ysevenfoods.com/cart',
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Loading cart...</div>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <>
        <SEO {...seoData} />
        <div className="min-h-screen bg-black text-white">
          <div className="container mx-auto px-4 py-16">
            <div className="text-center space-y-6">
              <ShoppingBag className="w-24 h-24 text-gray-600 mx-auto" />
              <h1 className="text-3xl font-bold">Your cart is empty</h1>
              <p className="text-gray-400 max-w-md mx-auto">
                Looks like you haven't added any premium sauces to your cart yet. 
                Start exploring our delicious collection!
              </p>
              <Link to="/shop">
                <Button className="bg-gold text-black hover:bg-yellow-600">
                  Start Shopping
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </>
    );
  }

  const subtotal = cart.subtotal;
  const tax = calculateTax(subtotal);
  const shipping = calculateShipping(subtotal);
  const total = calculateTotal(subtotal);

  return (
    <>
      <SEO {...seoData} />
      <div className="min-h-screen bg-black text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold text-gold mb-8">Shopping Cart</h1>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                {cart.items.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="bg-gray-900/50 border-gray-800">
                      <CardContent className="p-6">
                        <div className="flex items-center space-x-4">
                          <div className="w-20 h-20 bg-gray-800 rounded-lg flex items-center justify-center">
                            {item.image ? (
                              <img 
                                src={item.image} 
                                alt={item.name}
                                className="w-full h-full object-cover rounded-lg"
                              />
                            ) : (
                              <ShoppingBag className="w-8 h-8 text-gray-400" />
                            )}
                          </div>

                          <div className="flex-1">
                            <h3 className="font-semibold text-white">{item.name}</h3>
                            <p className="text-gold font-bold">₹{item.price}</p>
                          </div>

                          <div className="flex items-center space-x-3">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                              className="border-gray-700 text-white hover:bg-gray-800"
                            >
                              <Minus className="w-4 h-4" />
                            </Button>
                            
                            <span className="w-12 text-center font-semibold">
                              {item.quantity}
                            </span>
                            
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                              className="border-gray-700 text-white hover:bg-gray-800"
                            >
                              <Plus className="w-4 h-4" />
                            </Button>
                          </div>

                          <div className="text-right">
                            <p className="font-bold text-white">
                              ₹{(item.price * item.quantity).toLocaleString()}
                            </p>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleRemoveItem(item.id)}
                              className="text-red-400 hover:text-red-300 hover:bg-red-400/10 mt-2"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <Card className="bg-gray-900/50 border-gray-800 sticky top-8">
                  <CardContent className="p-6 space-y-4">
                    <h2 className="text-xl font-bold text-white">Order Summary</h2>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between text-gray-300">
                        <span>Subtotal ({cart.itemCount} items)</span>
                        <span>₹{subtotal.toLocaleString()}</span>
                      </div>
                      
                      <div className="flex justify-between text-gray-300">
                        <span>Tax (18% GST)</span>
                        <span>₹{tax.toLocaleString()}</span>
                      </div>
                      
                      <div className="flex justify-between text-gray-300">
                        <span>Shipping</span>
                        <span>
                          {shipping === 0 ? (
                            <span className="text-green-400">FREE</span>
                          ) : (
                            `₹${shipping}`
                          )}
                        </span>
                      </div>

                      {subtotal < 499 && (
                        <p className="text-sm text-yellow-400">
                          Add ₹{(499 - subtotal).toLocaleString()} more for free shipping!
                        </p>
                      )}
                      
                      <Separator className="bg-gray-700" />
                      
                      <div className="flex justify-between text-lg font-bold text-white">
                        <span>Total</span>
                        <span className="text-gold">₹{total.toLocaleString()}</span>
                      </div>
                    </div>

                    <Link to="/checkout" className="block">
                      <Button className="w-full bg-gold text-black hover:bg-yellow-600 font-semibold h-12">
                        Proceed to Checkout
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </Button>
                    </Link>

                    <Link to="/shop" className="block">
                      <Button variant="outline" className="w-full border-gray-700 text-white hover:bg-gray-800">
                        Continue Shopping
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Cart;