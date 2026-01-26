import { useEffect, useState } from 'react';
import { 
  Package,
  Search,
  Plus,
  Edit,
  Trash2,
  Star,
  StarOff,
  Eye,
  MoreHorizontal,
  RefreshCw,
  Download,
  AlertTriangle,
  TrendingUp,
  TrendingDown
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import { adminAPI } from '@/lib/api';
import { cn } from '@/lib/utils';
import SEO from '@/components/SEO';
import { generateSEO } from '@/lib/seo';
import AddProductDialog from '@/components/admin/AddProductDialog';
import EditProductDialog from '@/components/admin/EditProductDialog';
import ProductDetailsDialog from '@/components/admin/ProductDetailsDialog';

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

const ProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [stockFilter, setStockFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(10);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [viewingProduct, setViewingProduct] = useState<Product | null>(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [products, searchTerm, categoryFilter, stockFilter]);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const response = await adminAPI.products.getAll();
      
      if (response.data.success) {
        const productsData = response.data.data.products || response.data.data || [];
        setProducts(productsData);
        console.log(`Loaded ${productsData.length} products`);
      }
    } catch (error: any) {
      console.error('Failed to fetch products:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch products. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filterProducts = () => {
    let filtered = [...products];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(product =>
        (product.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.sku || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.category || '').toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(product => (product.category || '').toLowerCase() === categoryFilter.toLowerCase());
    }

    // Stock filter
    if (stockFilter !== 'all') {
      switch (stockFilter) {
        case 'in-stock':
          filtered = filtered.filter(product => product.stock > 10);
          break;
        case 'low-stock':
          filtered = filtered.filter(product => (product.stock || 0) > 0 && (product.stock || 0) <= 10);
          break;
        case 'out-of-stock':
          filtered = filtered.filter(product => (product.stock || 0) === 0);
          break;
      }
    }

    setFilteredProducts(filtered);
    setCurrentPage(1);
  };

  const toggleBestSeller = async (productId: string) => {
    try {
      await adminAPI.products.toggleBestSeller(productId);
      
      // Update local state
      setProducts(prevProducts =>
        prevProducts.map(product =>
          product._id === productId 
            ? { ...product, isBestSeller: !product.isBestSeller } 
            : product
        )
      );

      toast({
        title: 'Success',
        description: 'Best seller status updated successfully',
      });
    } catch (error: any) {
      console.error('Failed to toggle best seller:', error);
      toast({
        title: 'Error',
        description: 'Failed to update best seller status. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setIsEditDialogOpen(true);
  };

  const handleCloseEditDialog = () => {
    setEditingProduct(null);
    setIsEditDialogOpen(false);
  };

  const handleViewProduct = (product: Product) => {
    setViewingProduct(product);
    setIsDetailsDialogOpen(true);
  };

  const handleCloseDetailsDialog = () => {
    setViewingProduct(null);
    setIsDetailsDialogOpen(false);
  };

  const deleteProduct = async (productId: string) => {
    try {
      await adminAPI.products.delete(productId);
      
      // Update local state
      setProducts(prevProducts => prevProducts.filter(product => product._id !== productId));

      toast({
        title: 'Success',
        description: 'Product deleted successfully',
      });
    } catch (error: any) {
      console.error('Failed to delete product:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete product. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const getStockStatus = (stock: number) => {
    if (stock === 0) {
      return { label: 'Out of Stock', color: 'bg-red-500/20 text-red-400 border-red-500/30' };
    } else if (stock <= 10) {
      return { label: 'Low Stock', color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' };
    } else {
      return { label: 'In Stock', color: 'bg-green-500/20 text-green-400 border-green-500/30' };
    }
  };

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
      month: 'short',
      day: 'numeric',
    });
  };

  const getCategories = () => {
    const categories = [...new Set(products.map(product => product.category || 'Uncategorized'))];
    return categories.sort();
  };

  // Calculate stats
  const totalProducts = products.length;
  const inStockProducts = products.filter(p => (p.stock || 0) > 10).length;
  const lowStockProducts = products.filter(p => (p.stock || 0) > 0 && (p.stock || 0) <= 10).length;
  const outOfStockProducts = products.filter(p => (p.stock || 0) === 0).length;
  const bestSellers = products.filter(p => p.isBestSeller).length;

  // Pagination
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const seoData = generateSEO({
    title: 'Products Management - Y7 Sauces Admin',
    description: 'Manage product catalog, inventory, and pricing in the Y7 Sauces admin dashboard.',
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
            <h1 className="text-3xl font-bold text-cream">Products Management</h1>
            <p className="text-cream/60">Manage your product catalog and inventory</p>
          </div>
          <div className="flex items-center space-x-3">
            <Button 
              onClick={fetchProducts}
              variant="outline" 
              size="sm" 
              className="border-gold/30 text-cream hover:bg-gold/10"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            <Button variant="outline" size="sm" className="border-gold/30 text-cream hover:bg-gold/10">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <AddProductDialog 
              onProductAdded={fetchProducts}
              existingCategories={getCategories()}
            />
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <Card className="bg-charcoal border-gold/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-cream/60 text-sm font-medium">Total Products</p>
                  <p className="text-2xl font-bold text-cream">{totalProducts}</p>
                </div>
                <Package className="w-8 h-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-charcoal border-gold/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-cream/60 text-sm font-medium">In Stock</p>
                  <p className="text-2xl font-bold text-green-400">{inStockProducts}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-charcoal border-gold/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-cream/60 text-sm font-medium">Low Stock</p>
                  <p className="text-2xl font-bold text-yellow-400">{lowStockProducts}</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-yellow-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-charcoal border-gold/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-cream/60 text-sm font-medium">Out of Stock</p>
                  <p className="text-2xl font-bold text-red-400">{outOfStockProducts}</p>
                </div>
                <TrendingDown className="w-8 h-8 text-red-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-charcoal border-gold/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-cream/60 text-sm font-medium">Best Sellers</p>
                  <p className="text-2xl font-bold text-gold">{bestSellers}</p>
                </div>
                <Star className="w-8 h-8 text-gold" />
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
                    placeholder="Search products by name, SKU, or category..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-obsidian border-gold/30 text-cream placeholder:text-cream/40"
                  />
                </div>
              </div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-48 bg-obsidian border-gold/30 text-cream">
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent className="bg-charcoal border-gold/30">
                  <SelectItem value="all">All Categories</SelectItem>
                  {getCategories().map(category => (
                    <SelectItem key={category} value={category.toLowerCase()}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={stockFilter} onValueChange={setStockFilter}>
                <SelectTrigger className="w-48 bg-obsidian border-gold/30 text-cream">
                  <SelectValue placeholder="Filter by stock" />
                </SelectTrigger>
                <SelectContent className="bg-charcoal border-gold/30">
                  <SelectItem value="all">All Stock Levels</SelectItem>
                  <SelectItem value="in-stock">In Stock</SelectItem>
                  <SelectItem value="low-stock">Low Stock</SelectItem>
                  <SelectItem value="out-of-stock">Out of Stock</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Products Table */}
        <Card className="bg-charcoal border-gold/20">
          <CardHeader>
            <CardTitle className="text-cream">
              Products ({filteredProducts.length})
            </CardTitle>
            <CardDescription>
              Showing {indexOfFirstProduct + 1}-{Math.min(indexOfLastProduct, filteredProducts.length)} of {filteredProducts.length} products
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-gold/20">
                    <TableHead className="text-cream/80">Product</TableHead>
                    <TableHead className="text-cream/80">SKU</TableHead>
                    <TableHead className="text-cream/80">Category</TableHead>
                    <TableHead className="text-cream/80">Price</TableHead>
                    <TableHead className="text-cream/80">Stock</TableHead>
                    <TableHead className="text-cream/80">Status</TableHead>
                    <TableHead className="text-cream/80">Best Seller</TableHead>
                    <TableHead className="text-cream/80">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentProducts.map((product) => {
                    const stockStatus = getStockStatus(product.stock || 0);
                    const discount = (product.mrp || 0) > (product.sellingPrice || 0) 
                      ? Math.round(((product.mrp - product.sellingPrice) / product.mrp) * 100)
                      : 0;

                    return (
                      <TableRow key={product._id} className="border-gold/10 hover:bg-gold/5">
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-gold/20 rounded-lg flex items-center justify-center">
                              <Package className="w-6 h-6 text-gold" />
                            </div>
                            <div>
                              <p className="text-cream font-medium">{product.name || 'Unnamed Product'}</p>
                              <p className="text-cream/60 text-sm">{(product.description || 'No description').slice(0, 50)}...</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-cream font-mono">
                          {product.sku || 'N/A'}
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="bg-gold/20 text-gold">
                            {product.category || 'Uncategorized'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="text-cream font-medium">{formatCurrency(product.sellingPrice || 0)}</p>
                            {discount > 0 && (
                              <div className="flex items-center space-x-2">
                                <p className="text-cream/60 text-sm line-through">{formatCurrency(product.mrp || 0)}</p>
                                <Badge variant="destructive" className="text-xs">
                                  {discount}% OFF
                                </Badge>
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="text-cream font-medium">{product.stock || 0}</p>
                            <Badge className={cn("text-xs", stockStatus.color)}>
                              {stockStatus.label}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={cn(
                            "text-xs",
                            (product.stock || 0) > 0 
                              ? "bg-green-500/20 text-green-400 border-green-500/30"
                              : "bg-red-500/20 text-red-400 border-red-500/30"
                          )}>
                            {(product.stock || 0) > 0 ? 'Active' : 'Inactive'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleBestSeller(product._id)}
                            className={cn(
                              "p-2",
                              product.isBestSeller 
                                ? "text-gold hover:text-gold/80" 
                                : "text-cream/40 hover:text-gold"
                            )}
                          >
                            {product.isBestSeller ? <Star className="w-4 h-4 fill-current" /> : <StarOff className="w-4 h-4" />}
                          </Button>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="text-cream/60 hover:text-cream">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="bg-charcoal border-gold/30">
                              <DropdownMenuItem 
                                className="text-cream hover:bg-gold/10"
                                onClick={() => handleViewProduct(product)}
                              >
                                <Eye className="w-4 h-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                className="text-cream hover:bg-gold/10"
                                onClick={() => handleEditProduct(product)}
                              >
                                <Edit className="w-4 h-4 mr-2" />
                                Edit Product
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                className="text-red-400 hover:bg-red-500/10"
                                onClick={() => deleteProduct(product._id)}
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete Product
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-6">
                <p className="text-cream/60 text-sm">
                  Page {currentPage} of {totalPages}
                </p>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="border-gold/30 text-cream hover:bg-gold/10"
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="border-gold/30 text-cream hover:bg-gold/10"
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Edit Product Dialog */}
        <EditProductDialog
          product={editingProduct}
          isOpen={isEditDialogOpen}
          onClose={handleCloseEditDialog}
          onProductUpdated={fetchProducts}
          existingCategories={getCategories()}
        />

        {/* Product Details Dialog */}
        <ProductDetailsDialog
          product={viewingProduct}
          isOpen={isDetailsDialogOpen}
          onClose={handleCloseDetailsDialog}
          onEdit={handleEditProduct}
        />
      </div>
    </>
  );
};

export default ProductsPage;