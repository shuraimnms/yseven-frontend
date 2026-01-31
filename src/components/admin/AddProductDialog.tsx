import { useState } from 'react';
import { 
  Plus,
  Upload,
  X,
  Package,
  DollarSign,
  Hash,
  FileText,
  Tag,
  Image as ImageIcon
} from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { adminAPI } from '@/lib/api';
import { cn } from '@/lib/utils';

interface AddProductDialogProps {
  onProductAdded: () => void;
  existingCategories: string[];
}

interface ProductFormData {
  name: string;
  description: string;
  mrp: number;
  sellingPrice: number;
  stock: number;
  category: string;
  image: string;
}

const AddProductDialog = ({ onProductAdded, existingCategories }: AddProductDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    description: '',
    mrp: 0,
    sellingPrice: 0,
    stock: 0,
    category: '',
    image: ''
  });
  const [errors, setErrors] = useState<Partial<ProductFormData>>({});
  const [imagePreview, setImagePreview] = useState<string>('');
  const { toast } = useToast();

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      mrp: 0,
      sellingPrice: 0,
      stock: 0,
      category: '',
      image: ''
    });
    setErrors({});
    setImagePreview('');
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<ProductFormData> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Product name is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Product description is required';
    }

    if (formData.mrp <= 0) {
      newErrors.mrp = 'MRP must be greater than 0';
    }

    if (formData.sellingPrice <= 0) {
      newErrors.sellingPrice = 'Selling price must be greater than 0';
    }

    if (formData.sellingPrice > formData.mrp) {
      newErrors.sellingPrice = 'Selling price cannot be greater than MRP';
    }

    if (formData.stock < 0) {
      newErrors.stock = 'Stock cannot be negative';
    }

    if (!formData.category.trim()) {
      newErrors.category = 'Category is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof ProductFormData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast({
          title: 'Invalid File',
          description: 'Please select a valid image file',
          variant: 'destructive',
        });
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: 'File Too Large',
          description: 'Please select an image smaller than 5MB',
          variant: 'destructive',
        });
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setImagePreview(result);
        setFormData(prev => ({
          ...prev,
          image: result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await adminAPI.products.create({
        name: formData.name.trim(),
        description: formData.description.trim(),
        mrp: formData.mrp,
        sellingPrice: formData.sellingPrice,
        stock: formData.stock,
        category: formData.category.trim(),
        image: formData.image || undefined
      });

      if (response.data) {
        toast({
          title: 'Success',
          description: 'Product created successfully',
        });

        resetForm();
        setIsOpen(false);
        onProductAdded();
      }
    } catch (error: any) {
      console.error('Failed to create product:', error);
      
      let errorMessage = 'Failed to create product. Please try again.';
      
      if (error.response?.status === 409) {
        errorMessage = 'A product with this name already exists';
      } else if (error.response?.status === 400) {
        errorMessage = error.response.data?.message || 'Invalid product data';
      }

      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const calculateDiscount = () => {
    if (formData.mrp > 0 && formData.sellingPrice > 0 && formData.sellingPrice < formData.mrp) {
      return Math.round(((formData.mrp - formData.sellingPrice) / formData.mrp) * 100);
    }
    return 0;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gold hover:bg-gold/90 text-obsidian">
          <Plus className="w-4 h-4 mr-2" />
          Add Product
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-charcoal border-gold/30">
        <DialogHeader>
          <DialogTitle className="text-cream flex items-center">
            <Package className="w-5 h-5 mr-2 text-gold" />
            Add New Product
          </DialogTitle>
          <DialogDescription className="text-cream/60">
            Create a new product for your catalog. Fill in all the required information below.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Product Preview Card */}
          {(formData.name || imagePreview) && (
            <Card className="bg-obsidian border-gold/20">
              <CardContent className="p-4">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gold/20 rounded-lg flex items-center justify-center overflow-hidden">
                    {imagePreview ? (
                      <img 
                        src={imagePreview} 
                        alt="Preview" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Package className="w-8 h-8 text-gold" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-cream font-medium">
                      {formData.name || 'Product Name'}
                    </h3>
                    <p className="text-cream/60 text-sm">
                      {formData.category || 'Category'}
                    </p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-cream font-medium">
                        {formatCurrency(formData.sellingPrice)}
                      </span>
                      {formData.mrp > formData.sellingPrice && (
                        <>
                          <span className="text-cream/60 text-sm line-through">
                            {formatCurrency(formData.mrp)}
                          </span>
                          <Badge variant="destructive" className="text-xs">
                            {calculateDiscount()}% OFF
                          </Badge>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-cream font-medium flex items-center">
                <FileText className="w-4 h-4 mr-2" />
                Basic Information
              </h3>

              <div className="space-y-2">
                <Label htmlFor="name" className="text-cream">Product Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter product name"
                  className={cn(
                    "bg-obsidian border-gold/30 text-cream placeholder:text-cream/40",
                    errors.name && "border-red-500"
                  )}
                />
                {errors.name && (
                  <p className="text-red-400 text-sm">{errors.name}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-cream">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Enter product description"
                  rows={3}
                  className={cn(
                    "bg-obsidian border-gold/30 text-cream placeholder:text-cream/40",
                    errors.description && "border-red-500"
                  )}
                />
                {errors.description && (
                  <p className="text-red-400 text-sm">{errors.description}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="category" className="text-cream">Category *</Label>
                <Select 
                  value={formData.category} 
                  onValueChange={(value) => handleInputChange('category', value)}
                >
                  <SelectTrigger className={cn(
                    "bg-obsidian border-gold/30 text-cream",
                    errors.category && "border-red-500"
                  )}>
                    <SelectValue placeholder="Select or enter category" />
                  </SelectTrigger>
                  <SelectContent className="bg-charcoal border-gold/30">
                    {existingCategories.map(category => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  value={formData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  placeholder="Or enter new category"
                  className="bg-obsidian border-gold/30 text-cream placeholder:text-cream/40"
                />
                {errors.category && (
                  <p className="text-red-400 text-sm">{errors.category}</p>
                )}
              </div>
            </div>

            {/* Pricing & Inventory */}
            <div className="space-y-4">
              <h3 className="text-cream font-medium flex items-center">
                <DollarSign className="w-4 h-4 mr-2" />
                Pricing & Inventory
              </h3>

              <div className="space-y-2">
                <Label htmlFor="mrp" className="text-cream">MRP (Maximum Retail Price) *</Label>
                <Input
                  id="mrp"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.mrp || ''}
                  onChange={(e) => handleInputChange('mrp', parseFloat(e.target.value) || 0)}
                  placeholder="Enter MRP"
                  className={cn(
                    "bg-obsidian border-gold/30 text-cream placeholder:text-cream/40",
                    errors.mrp && "border-red-500"
                  )}
                />
                {errors.mrp && (
                  <p className="text-red-400 text-sm">{errors.mrp}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="sellingPrice" className="text-cream">Selling Price *</Label>
                <Input
                  id="sellingPrice"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.sellingPrice || ''}
                  onChange={(e) => handleInputChange('sellingPrice', parseFloat(e.target.value) || 0)}
                  placeholder="Enter selling price"
                  className={cn(
                    "bg-obsidian border-gold/30 text-cream placeholder:text-cream/40",
                    errors.sellingPrice && "border-red-500"
                  )}
                />
                {errors.sellingPrice && (
                  <p className="text-red-400 text-sm">{errors.sellingPrice}</p>
                )}
                {calculateDiscount() > 0 && (
                  <p className="text-green-400 text-sm">
                    Discount: {calculateDiscount()}% off MRP
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="stock" className="text-cream">Initial Stock *</Label>
                <Input
                  id="stock"
                  type="number"
                  min="0"
                  value={formData.stock || ''}
                  onChange={(e) => handleInputChange('stock', parseInt(e.target.value) || 0)}
                  placeholder="Enter stock quantity"
                  className={cn(
                    "bg-obsidian border-gold/30 text-cream placeholder:text-cream/40",
                    errors.stock && "border-red-500"
                  )}
                />
                {errors.stock && (
                  <p className="text-red-400 text-sm">{errors.stock}</p>
                )}
              </div>
            </div>
          </div>

          {/* Image Upload */}
          <div className="space-y-4">
            <h3 className="text-cream font-medium flex items-center">
              <ImageIcon className="w-4 h-4 mr-2" />
              Product Image
            </h3>

            <div className="space-y-4">
              <div className="flex items-center justify-center w-full">
                <label 
                  htmlFor="image-upload" 
                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-gold/30 border-dashed rounded-lg cursor-pointer bg-obsidian hover:bg-gold/5 transition-colors"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-4 text-gold" />
                    <p className="mb-2 text-sm text-cream">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-cream/60">PNG, JPG, JPEG up to 5MB</p>
                  </div>
                  <input 
                    id="image-upload" 
                    type="file" 
                    className="hidden" 
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                </label>
              </div>

              {imagePreview && (
                <div className="relative">
                  <img 
                    src={imagePreview} 
                    alt="Product preview" 
                    className="w-full h-48 object-cover rounded-lg border border-gold/20"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={() => {
                      setImagePreview('');
                      setFormData(prev => ({ ...prev, image: '' }));
                    }}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gold/20">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              className="border-gold/30 text-cream hover:bg-gold/10"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-gold hover:bg-gold/90 text-obsidian"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-obsidian border-t-transparent rounded-full animate-spin mr-2" />
                  Creating...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Product
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddProductDialog;