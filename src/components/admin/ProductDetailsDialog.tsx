import { 
  Eye,
  Package,
  DollarSign,
  Hash,
  FileText,
  Tag,
  Calendar,
  Star,
  StarOff,
  TrendingUp,
  TrendingDown,
  AlertTriangle
} from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

interface Product {
  _id: string;
  name: string;
  slug: string;
  sku: string;
  description: string;
  mrp: number;
  sellingPrice: number;
  stock: number;
  category: string;
  image?: string;
  isBestSeller: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ProductDetailsDialogProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (product: Product) => void;
}

const ProductDetailsDialog = ({ product, isOpen, onClose, onEdit }: ProductDetailsDialogProps) => {
  if (!product) return null;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStockStatus = (stock: number) => {
    if (stock === 0) {
      return { 
        label: 'Out of Stock', 
        color: 'bg-red-500/20 text-red-400 border-red-500/30',
        icon: <AlertTriangle className="w-4 h-4" />
      };
    } else if (stock <= 10) {
      return { 
        label: 'Low Stock', 
        color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
        icon: <TrendingDown className="w-4 h-4" />
      };
    } else {
      return { 
        label: 'In Stock', 
        color: 'bg-green-500/20 text-green-400 border-green-500/30',
        icon: <TrendingUp className="w-4 h-4" />
      };
    }
  };

  const calculateDiscount = () => {
    if (product.mrp > product.sellingPrice) {
      return Math.round(((product.mrp - product.sellingPrice) / product.mrp) * 100);
    }
    return 0;
  };

  const stockStatus = getStockStatus(product.stock);
  const discount = calculateDiscount();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-charcoal border-gold/30">
        <DialogHeader>
          <DialogTitle className="text-cream flex items-center">
            <Eye className="w-5 h-5 mr-2 text-gold" />
            Product Details
          </DialogTitle>
          <DialogDescription className="text-cream/60">
            Complete information about this product
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Product Image & Basic Info */}
          <div className="lg:col-span-1 space-y-4">
            {/* Product Image */}
            <Card className="bg-obsidian border-gold/20">
              <CardContent className="p-4">
                <div className="aspect-square bg-gold/20 rounded-lg flex items-center justify-center overflow-hidden">
                  {product.image ? (
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Package className="w-16 h-16 text-gold" />
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="bg-obsidian border-gold/20">
              <CardHeader>
                <CardTitle className="text-cream text-sm">Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-cream/60 text-sm">Status</span>
                  <Badge className={cn("text-xs flex items-center gap-1", stockStatus.color)}>
                    {stockStatus.icon}
                    {stockStatus.label}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-cream/60 text-sm">Best Seller</span>
                  <div className="flex items-center">
                    {product.isBestSeller ? (
                      <Star className="w-4 h-4 text-gold fill-current" />
                    ) : (
                      <StarOff className="w-4 h-4 text-cream/40" />
                    )}
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-cream/60 text-sm">Discount</span>
                  <span className="text-cream text-sm">
                    {discount > 0 ? `${discount}%` : 'No discount'}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Product Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <Card className="bg-obsidian border-gold/20">
              <CardHeader>
                <CardTitle className="text-cream flex items-center">
                  <FileText className="w-4 h-4 mr-2" />
                  Basic Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h2 className="text-2xl font-bold text-cream mb-2">{product.name}</h2>
                  <p className="text-cream/80 leading-relaxed">{product.description}</p>
                </div>

                <Separator className="bg-gold/20" />

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-cream/60 text-sm mb-1">SKU</p>
                    <p className="text-cream font-mono">{product.sku}</p>
                  </div>
                  <div>
                    <p className="text-cream/60 text-sm mb-1">Slug</p>
                    <p className="text-cream font-mono">{product.slug}</p>
                  </div>
                  <div>
                    <p className="text-cream/60 text-sm mb-1">Category</p>
                    <Badge variant="secondary" className="bg-gold/20 text-gold">
                      {product.category}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-cream/60 text-sm mb-1">Stock Quantity</p>
                    <p className="text-cream font-medium">{product.stock} units</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Pricing Information */}
            <Card className="bg-obsidian border-gold/20">
              <CardHeader>
                <CardTitle className="text-cream flex items-center">
                  <DollarSign className="w-4 h-4 mr-2" />
                  Pricing Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-charcoal rounded-lg">
                    <p className="text-cream/60 text-sm mb-1">MRP</p>
                    <p className="text-2xl font-bold text-cream">{formatCurrency(product.mrp)}</p>
                  </div>
                  <div className="text-center p-4 bg-charcoal rounded-lg">
                    <p className="text-cream/60 text-sm mb-1">Selling Price</p>
                    <p className="text-2xl font-bold text-gold">{formatCurrency(product.sellingPrice)}</p>
                  </div>
                  <div className="text-center p-4 bg-charcoal rounded-lg">
                    <p className="text-cream/60 text-sm mb-1">You Save</p>
                    <p className="text-2xl font-bold text-green-400">
                      {formatCurrency(product.mrp - product.sellingPrice)}
                    </p>
                    {discount > 0 && (
                      <p className="text-green-400 text-sm">({discount}% off)</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Timestamps */}
            <Card className="bg-obsidian border-gold/20">
              <CardHeader>
                <CardTitle className="text-cream flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  Timeline
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-cream/60 text-sm mb-1">Created</p>
                    <p className="text-cream">{formatDate(product.createdAt)}</p>
                  </div>
                  <div>
                    <p className="text-cream/60 text-sm mb-1">Last Updated</p>
                    <p className="text-cream">{formatDate(product.updatedAt)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 pt-6 border-t border-gold/20">
          <Button
            variant="outline"
            onClick={onClose}
            className="border-gold/30 text-cream hover:bg-gold/10"
          >
            Close
          </Button>
          <Button
            onClick={() => {
              onEdit(product);
              onClose();
            }}
            className="bg-gold hover:bg-gold/90 text-obsidian"
          >
            <FileText className="w-4 h-4 mr-2" />
            Edit Product
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductDetailsDialog;