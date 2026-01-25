import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Heart, 
  ShoppingCart, 
  Trash2, 
  Star,
  Package
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { useAuthStore } from '@/store/authStore';
import { useCartStore } from '@/store/cartStore';
import { userAPI } from '@/lib/api';
import { Product } from '@/types';
import SEO from '@/components/SEO';

export default function Wishlist() {
  const { user, isAuthenticated } = useAuthStore();
  const { addToCart } = useCartStore();
  const [wishlistProducts, setWishlistProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated) {
      fetchWishlist();
    }
  }, [isAuthenticated]);

  const fetchWishlist = async () => {
    try {
      const response = await userAPI.getWishlist();
      if (response.data.success) {
        setWishlistProducts(response.data.data.products);
      }
    } catch (error) {
      console.error('Fetch wishlist error:', error);
      toast.error('Failed to fetch wishlist');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveFromWishlist = async (productId: string) => {
    try {
      await userAPI.removeFromWishlist(productId);
      setWishlistProducts(prev => prev.filter(product => product._id !== productId));
      toast.success('Removed from wishlist');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to remove from wishlist');
    }
  };

  const handleAddToCart = async (product: Product) => {
    try {
      await addToCart(product._id, 1);
      toast.success(`${product.name} added to cart!`);
    } catch (error) {
      toast.error('Failed to add item to cart');
    }
  };

  const handleMoveToCart = async (product: Product) => {
    try {
      await addToCart(product._id, 1);
      await handleRemoveFromWishlist(product._id);
      toast.success(`${product.name} moved to cart!`);
    } catch (error) {
      toast.error('Failed to move item to cart');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
        <Heart className="w-16 h-16 text-gray-600 mb-4" />
        <h1 className="text-2xl font-bold mb-2">Please Login</h1>
        <p className="text-gray-400 mb-6">Login to view your wishlist</p>
        <Button asChild>
          <Link to="/auth/login">Login</Link>
        </Button>
      </div>
    );
  }

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
        title="My Wishlist - Y7 Sauces"
        description="View and manage your favorite Y7 Sauces products in your wishlist."
      />
      
      <div className="min-h-screen bg-black text-white">
        <div className="container mx-auto px-4 py-8">
          <div>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold">My Wishlist</h1>
                <p className="text-gray-400 mt-2">
                  {wishlistProducts.length} {wishlistProducts.length === 1 ? 'item' : 'items'} saved
                </p>
              </div>
              {wishlistProducts.length > 0 && (
                <Button 
                  onClick={() => {
                    wishlistProducts.forEach(product => handleAddToCart(product));
                  }}
                  className="bg-yellow-500 hover:bg-yellow-600 text-black"
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Add All to Cart
                </Button>
              )}
            </div>

            {wishlistProducts.length === 0 ? (
              <Card className="bg-gray-900 border-gray-800">
                <CardContent className="text-center py-16">
                  <Heart className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <h2 className="text-xl font-semibold mb-2">Your wishlist is empty</h2>
                  <p className="text-gray-400 mb-6">
                    Save your favorite products to buy them later
                  </p>
                  <Button asChild>
                    <Link to="/shop">Start Shopping</Link>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {wishlistProducts.map((product, index) => {
                  const discount = Math.round(((product.mrp - product.sellingPrice) / product.mrp) * 100);
                  
                  return (
                    <div key={product._id}>
                      <Card className="bg-gray-900 border-gray-800 hover:border-gray-700 transition-all duration-300 group">
                        <CardContent className="p-0">
                          {/* Product Image */}
                          <div className="relative aspect-square overflow-hidden rounded-t-lg">
                            <Link to={`/products/${product.slug}`}>
                              <img
                                src={product.image || '/placeholder.svg'}
                                alt={product.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                            </Link>
                            
                            {/* Badges */}
                            <div className="absolute top-3 left-3 flex flex-col gap-2">
                              {product.isBestSeller && (
                                <Badge className="bg-yellow-500 text-black">
                                  <Star className="w-3 h-3 mr-1" />
                                  Best Seller
                                </Badge>
                              )}
                              {discount > 0 && (
                                <Badge className="bg-red-600 text-white">
                                  {discount}% OFF
                                </Badge>
                              )}
                            </div>

                            {/* Remove from Wishlist */}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveFromWishlist(product._id)}
                              className="absolute top-3 right-3 bg-black/50 hover:bg-red-600 text-white p-2"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>

                            {/* Stock Status */}
                            {product.stock === 0 && (
                              <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                                <Badge className="bg-red-600 text-white">Out of Stock</Badge>
                              </div>
                            )}
                          </div>

                          {/* Product Info */}
                          <div className="p-4">
                            <Link to={`/products/${product.slug}`}>
                              <h3 className="font-semibold text-white mb-2 line-clamp-2 hover:text-yellow-500 transition-colors">
                                {product.name}
                              </h3>
                            </Link>
                            
                            <Badge variant="outline" className="border-gray-600 text-gray-300 mb-3">
                              {product.category}
                            </Badge>

                            {/* Price */}
                            <div className="flex items-center gap-2 mb-4">
                              <span className="text-lg font-bold text-yellow-500">
                                ₹{product.sellingPrice}
                              </span>
                              {product.mrp > product.sellingPrice && (
                                <span className="text-sm text-gray-500 line-through">
                                  ₹{product.mrp}
                                </span>
                              )}
                            </div>

                            {/* Stock Info */}
                            <div className="flex items-center gap-2 mb-4">
                              <div className={`w-2 h-2 rounded-full ${
                                product.stock > 10 ? 'bg-green-500' : 
                                product.stock > 0 ? 'bg-yellow-500' : 'bg-red-500'
                              }`} />
                              <span className="text-xs text-gray-400">
                                {product.stock > 10 ? 'In Stock' : 
                                 product.stock > 0 ? `Only ${product.stock} left` : 'Out of Stock'}
                              </span>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-2">
                              <Button
                                onClick={() => handleMoveToCart(product)}
                                disabled={product.stock === 0}
                                className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-black font-medium"
                                size="sm"
                              >
                                <ShoppingCart className="w-4 h-4 mr-2" />
                                Move to Cart
                              </Button>
                              <Button
                                onClick={() => handleAddToCart(product)}
                                disabled={product.stock === 0}
                                variant="outline"
                                className="border-gray-600 text-gray-300 hover:text-white"
                                size="sm"
                              >
                                <Package className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Continue Shopping */}
            {wishlistProducts.length > 0 && (
              <div className="text-center mt-12">
                <Button variant="outline" asChild>
                  <Link to="/shop">Continue Shopping</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}