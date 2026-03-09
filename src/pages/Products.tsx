import { useState, useRef, useEffect, memo } from "react";
import { Link } from "react-router-dom";
import { motion, useInView, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Filter,
  SlidersHorizontal,
  Star,
  Award,
  Shield,
  TrendingUp,
  Package,
  Users,
  Building2,
  Factory,
  MessageCircle,
  X,
  ChevronRight,
  Sparkles,
  CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import SEOHead from "@/components/SEOHead";
import { allProducts, getCategoryNames } from "@/data/products";

// Optimized Image Component
const OptimizedImage = memo(({ src, alt, className }: { src: string; alt: string; className?: string }) => {
  const [loaded, setLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {!loaded && (
        <div className="absolute inset-0 bg-obsidian/50 animate-pulse" />
      )}
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        className={`w-full h-full object-cover transition-all duration-700 ${
          loaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
        }`}
        onLoad={() => setLoaded(true)}
        loading="lazy"
      />
    </div>
  );
});

OptimizedImage.displayName = 'OptimizedImage';

// Product Card Component
const ProductCard = memo(({ product, onClick }: { product: any; onClick?: () => void }) => {
  const cardRef = useRef(null);
  const isInView = useInView(cardRef, { once: true, margin: '-50px' });

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5 }}
      className="group"
    >
      <Link to={`/products/${product.slug}`}>
        <Card className="bg-black border-gold/20 hover:border-gold/40 transition-all duration-300 overflow-hidden h-full cursor-pointer hover:shadow-lg hover:shadow-gold/20">
          {/* Product Image */}
          <div className="relative aspect-square overflow-hidden">
            <OptimizedImage
              src={product.image}
              alt={product.name}
              className="group-hover:scale-110 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            
            {/* Badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-2">
              {product.isBestSeller && (
                <Badge className="bg-gold text-black text-xs font-semibold">
                  <Star className="w-3 h-3 mr-1 fill-black" />
                  Best Seller
                </Badge>
              )}
              {product.isNew && (
                <Badge className="bg-green-500 text-white text-xs font-semibold">
                  <Sparkles className="w-3 h-3 mr-1" />
                  New
                </Badge>
              )}
            </div>

            {/* Category Tag */}
            <div className="absolute bottom-3 left-3">
              <Badge variant="outline" className="border-gold/30 text-gold bg-black/60 backdrop-blur-sm text-xs">
                {product.category}
              </Badge>
            </div>
          </div>

          <CardContent className="p-4">
            {/* Product Name */}
            <h3 className="font-display text-cream text-base font-semibold mb-2 line-clamp-2 min-h-[3rem]">
              {product.name}
            </h3>
            
            {/* Tagline */}
            <p className="text-cream/60 text-xs mb-4 line-clamp-2 min-h-[2.5rem]">
              {product.tagline || product.description}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col gap-2.5 mt-4">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  window.location.href = `/products/${product.slug}`;
                }}
                className="w-full h-[42px] rounded-lg border border-gold/40 text-gold text-sm font-medium transition-all duration-300 hover:bg-gold hover:text-black flex items-center justify-center"
              >
                View Details
              </button>
              <button 
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  window.location.href = '/contact';
                }}
                className="w-full h-[42px] rounded-lg bg-gold text-black text-sm font-semibold transition-all duration-300 hover:bg-[#e6c35a] flex items-center justify-center gap-1.5"
              >
                <MessageCircle className="w-4 h-4" />
                GET QUOTE
              </button>
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
});

ProductCard.displayName = 'ProductCard';

// Quick Preview Modal Component
const QuickPreviewModal = ({ product, onClose }: { product: any; onClose: () => void }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-end md:items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: "spring", damping: 25 }}
        className="bg-obsidian border border-gold/30 rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-10 h-10 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-cream hover:bg-gold/20 transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Product Image */}
        <div className="relative h-64 md:h-80 overflow-hidden rounded-t-2xl">
          <OptimizedImage src={product.image} alt={product.name} />
          <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-transparent to-transparent" />
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Badges */}
          <div className="flex gap-2 mb-4">
            {product.isBestSeller && (
              <Badge className="bg-gold text-black">
                <Star className="w-3 h-3 mr-1" />
                Best Seller
              </Badge>
            )}
            <Badge variant="outline" className="border-gold/30 text-gold">
              {product.category}
            </Badge>
          </div>

          {/* Product Name */}
          <h2 className="font-display text-3xl font-bold text-cream mb-3">
            {product.name}
          </h2>

          {/* Description */}
          <p className="text-cream/70 text-base mb-6 leading-relaxed">
            {product.description}
          </p>

          {/* Benefits */}
          <div className="mb-6">
            <h3 className="font-semibold text-cream mb-3 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-gold" />
              Key Benefits
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {product.benefits.map((benefit: string, index: number) => (
                <div key={index} className="flex items-start gap-2 text-sm text-cream/60">
                  <span className="text-gold mt-1">•</span>
                  <span>{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Link to={`/products/${product.slug}`} className="flex-1">
              <Button className="w-full bg-gold text-black hover:bg-gold/90 h-12">
                View Full Product
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link to="/contact" className="flex-1">
              <Button variant="outline" className="w-full border-gold text-gold hover:bg-gold/10 h-12">
                Get Quote
              </Button>
            </Link>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Main Products Component
export default function Products() {
  const [selectedCategory, setSelectedCategory] = useState<string>(getCategoryNames()[0]);
  const [sortBy, setSortBy] = useState<string>("best-selling");
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const categoriesCarouselRef = useRef<HTMLDivElement>(null);

  const categories = getCategoryNames();

  // Helper function to convert category name to URL slug
  const categoryToSlug = (category: string): string => {
    return category
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[()]/g, '')
      .replace(/&/g, 'and');
  };

  // Filter and sort products
  const filteredProducts = allProducts.filter(p => p.category === selectedCategory);

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === "best-selling") {
      if (a.isBestSeller && !b.isBestSeller) return -1;
      if (!a.isBestSeller && b.isBestSeller) return 1;
      return 0;
    }
    if (sortBy === "newest") {
      if (a.isNew && !b.isNew) return -1;
      if (!a.isNew && b.isNew) return 1;
      return 0;
    }
    return 0;
  });

  // Featured products (best sellers)
  const featuredProducts = allProducts.filter(p => p.isBestSeller).slice(0, 4);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Infinite scroll effect for categories carousel
  useEffect(() => {
    const carousel = categoriesCarouselRef.current;
    if (!carousel) return;

    let animationId: number;
    let scrollPosition = 0;
    const scrollSpeed = 0.5;
    let isPaused = false;
    let scrollTimeout: NodeJS.Timeout;
    let touchStartX = 0;
    let touchStartY = 0;

    const animate = () => {
      if (!isPaused) {
        scrollPosition += scrollSpeed;
        
        const scrollWidth = carousel.scrollWidth / 3;
        
        if (scrollPosition >= scrollWidth) {
          scrollPosition = 0;
        }
        
        carousel.scrollLeft = scrollPosition;
      }
      animationId = requestAnimationFrame(animate);
    };

    // Detect scroll direction on touch start
    const handleTouchStart = (e: TouchEvent) => {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    };

    // Only pause if horizontal scroll is intended
    const handleTouchMove = (e: TouchEvent) => {
      const touchX = e.touches[0].clientX;
      const touchY = e.touches[0].clientY;
      const deltaX = Math.abs(touchX - touchStartX);
      const deltaY = Math.abs(touchY - touchStartY);
      
      // If horizontal movement is greater than vertical, pause auto-scroll
      if (deltaX > deltaY && deltaX > 10) {
        isPaused = true;
      }
    };

    const handleTouchEnd = () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        isPaused = false;
        scrollPosition = carousel.scrollLeft;
      }, 1500);
    };

    animationId = requestAnimationFrame(animate);

    const handleMouseEnter = () => {
      isPaused = true;
    };

    const handleMouseLeave = () => {
      isPaused = false;
      scrollPosition = carousel.scrollLeft;
    };

    carousel.addEventListener('mouseenter', handleMouseEnter);
    carousel.addEventListener('mouseleave', handleMouseLeave);
    carousel.addEventListener('touchstart', handleTouchStart, { passive: true });
    carousel.addEventListener('touchmove', handleTouchMove, { passive: true });
    carousel.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      cancelAnimationFrame(animationId);
      clearTimeout(scrollTimeout);
      carousel.removeEventListener('mouseenter', handleMouseEnter);
      carousel.removeEventListener('mouseleave', handleMouseLeave);
      carousel.removeEventListener('touchstart', handleTouchStart);
      carousel.removeEventListener('touchmove', handleTouchMove);
      carousel.removeEventListener('touchend', handleTouchEnd);
    };
  }, [categories]);

  const seoData = {
    title: "Premium Products - Y7 Foods | Sauces, Condiments & Agro Products",
    description: "Discover Y7's complete range of premium sauces, condiments, and agro products. From classic ketchup to exotic international flavors.",
    keywords: "Y7 products, premium sauces, condiments, agro products, food products"
  };

  return (
    <>
      <SEOHead seo={seoData} />

      <div className="min-h-screen bg-black text-cream">

        {/* PREMIUM HERO SECTION */}
        <section className="relative h-[35vh] md:h-[40vh] overflow-hidden">
          {/* Background Video/Image */}
          <div className="absolute inset-0">
            <div className="w-full h-full bg-gradient-to-br from-obsidian via-black to-obsidian" />
            <div className="absolute inset-0 opacity-20" style={{
              backgroundImage: 'url(/placeholder.svg)',
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }} />
          </div>

          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/40" />

          {/* Hero Content */}
          <div className="relative h-full flex items-center justify-center px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center max-w-3xl"
            >
              <h1 className="font-display text-4xl md:text-5xl font-bold text-cream mb-4">
                Y7 Product <span className="text-gold">Collection</span>
              </h1>
              <p className="text-cream/80 text-base md:text-lg mb-8 max-w-2xl mx-auto">
                Crafted flavors. Premium ingredients. Explore our full range of sauces, agro powders, and specialty food products.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  size="lg"
                  className="bg-gold text-black hover:bg-gold/90 h-12"
                  onClick={() => document.getElementById('categories')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  Explore Categories
                  <ChevronRight className="w-5 h-5 ml-2" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-gold text-gold hover:bg-gold/10 h-12"
                  onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  View All Products
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* CATEGORY EXPLORER - Infinite Auto-Scrolling Carousel */}
        <section id="categories" className="py-12 px-4 bg-obsidian overflow-hidden">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-8"
            >
              <h2 className="font-display text-3xl md:text-4xl font-bold text-cream mb-3">
                Explore by <span className="text-gold">Category</span>
              </h2>
              <p className="text-cream/60 text-base">Discover our premium product categories</p>
            </motion.div>

            {/* Infinite Auto-Scrolling Categories Carousel */}
            <div className="relative">
              {/* Gradient Overlays */}
              <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-obsidian via-obsidian/80 to-transparent z-10 pointer-events-none" />
              <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-obsidian via-obsidian/80 to-transparent z-10 pointer-events-none" />
              
              {/* Scrolling Container */}
              <div 
                ref={categoriesCarouselRef}
                className="carousel-container overflow-x-auto scrollbar-hide"
                style={{
                  WebkitOverflowScrolling: 'touch'
                }}
              >
                <div className="inline-flex gap-4">
                  {/* Triple the categories for true infinite loop */}
                  {[...categories, ...categories, ...categories].map((category, index) => {
                    const categoryProducts = allProducts.filter(p => p.category === category);
                    const firstProduct = categoryProducts[0];
                    const categorySlug = categoryToSlug(category);
                    const originalIndex = index % categories.length;

                    return (
                      <motion.div
                        key={`${category}-${index}`}
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.4, delay: originalIndex * 0.1 }}
                        viewport={{ once: true }}
                        className="flex-shrink-0 w-72"
                      >
                        <Link to={`/category/${categorySlug}`}>
                          <Card className="bg-black border-gold/20 hover:border-gold hover:shadow-lg hover:shadow-gold/20 transition-all duration-300 overflow-hidden group cursor-pointer h-full">
                            <div className="relative h-48 overflow-hidden">
                              {firstProduct && (
                                <OptimizedImage
                                  src={firstProduct.image}
                                  alt={category}
                                  className="group-hover:scale-110 transition-transform duration-700"
                                />
                              )}
                              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                              
                              {/* Best Category Badge */}
                              {categoryProducts.some(p => p.isBestSeller) && (
                                <div className="absolute top-3 right-3">
                                  <Badge className="bg-gold text-black text-xs">
                                    <Star className="w-3 h-3 mr-1" />
                                    Top Category
                                  </Badge>
                                </div>
                              )}
                              
                              <div className="absolute bottom-0 left-0 right-0 p-4">
                                <h3 className="font-display text-xl font-bold text-cream mb-1">
                                  {category}
                                </h3>
                                <p className="text-cream/60 text-sm mb-2">
                                  {categoryProducts.length} Product{categoryProducts.length !== 1 ? 's' : ''}
                                </p>
                                <div className="flex items-center text-gold text-sm opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-x-1">
                                  <span>Explore Category</span>
                                  <ArrowRight className="w-4 h-4 ml-1" />
                                </div>
                              </div>
                            </div>
                          </Card>
                        </Link>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Interactive Scroll Hints */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 1 }}
              className="flex items-center justify-center gap-6 mt-6"
            >
              <div className="flex items-center gap-2 text-cream/40 text-xs">
                <motion.div
                  animate={{ x: [-5, 5, -5] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="text-gold"
                >
                  ←
                </motion.div>
                <span>Seamless loop</span>
                <motion.div
                  animate={{ x: [-5, 5, -5] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="text-gold"
                >
                  →
                </motion.div>
              </div>
              <div className="h-4 w-px bg-gold/20" />
              <div className="flex items-center gap-2 text-cream/40 text-xs">
                <div className="w-2 h-2 rounded-full bg-gold animate-pulse" />
                <span>Auto-scrolling</span>
              </div>
            </motion.div>
          </div>
        </section>

        {/* FEATURED PRODUCTS SECTION */}
        <section className="py-12 px-4 bg-black">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-8"
            >
              <Badge className="bg-gold/20 text-gold border-gold/30 mb-4">
                <Star className="w-4 h-4 mr-2" />
                Featured Products
              </Badge>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-cream mb-3">
                Our <span className="text-gold">Best Sellers</span>
              </h2>
              <p className="text-cream/60 text-base">Premium products loved by chefs and food enthusiasts</p>
            </motion.div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {featuredProducts.map((product, index) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onClick={() => setSelectedProduct(product)}
                />
              ))}
            </div>
          </div>
        </section>

        {/* STICKY SMART FILTER BAR */}
        <div className="sticky top-0 z-40 bg-black/95 backdrop-blur-lg border-b border-gold/20 py-3 px-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 flex-1">
              <Button
                variant="outline"
                size="sm"
                className="border-gold/30 text-gold hover:bg-gold/10 h-10"
                onClick={() => setShowFilterModal(true)}
              >
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
              
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-black border border-gold/30 text-gold rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gold h-10"
              >
                <option value="best-selling">Best Selling</option>
                <option value="newest">Newest</option>
                <option value="popular">Popular</option>
              </select>
            </div>

            <Badge variant="outline" className="border-gold/30 text-gold">
              {sortedProducts.length} Products
            </Badge>
          </div>
        </div>

        {/* PRODUCT GRID - Main Section */}
        <section id="products" className="py-12 px-4 bg-obsidian">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {sortedProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onClick={() => setSelectedProduct(product)}
                />
              ))}
            </div>

            {sortedProducts.length === 0 && (
              <div className="text-center py-16">
                <Package className="w-16 h-16 text-gold/30 mx-auto mb-4" />
                <p className="text-cream/60 text-lg">No products found</p>
              </div>
            )}
          </div>
        </section>

        {/* TRUST / QUALITY SECTION */}
        <section className="py-12 px-4 bg-black">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-8"
            >
              <h2 className="font-display text-3xl md:text-4xl font-bold text-cream mb-3">
                Why Choose <span className="text-gold">Y7</span>
              </h2>
              <p className="text-cream/60 text-base">Premium quality you can trust</p>
            </motion.div>

            <div className="flex gap-4 overflow-x-auto scrollbar-hide snap-x pb-4">
              {[
                { icon: Award, title: "Premium Ingredients", desc: "Sourced from the finest suppliers" },
                { icon: Shield, title: "Export Quality", desc: "International standards certified" },
                { icon: TrendingUp, title: "Restaurant Grade", desc: "Trusted by professional chefs" },
                { icon: CheckCircle2, title: "Quality Tested", desc: "Rigorous quality control" }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="flex-shrink-0 snap-center w-64"
                >
                  <Card className="bg-gradient-to-br from-obsidian to-black border-gold/20 hover:border-gold/40 transition-all duration-300 h-full">
                    <CardContent className="p-6 text-center">
                      <div className="w-14 h-14 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <item.icon className="w-7 h-7 text-gold" />
                      </div>
                      <h3 className="font-semibold text-cream text-lg mb-2">{item.title}</h3>
                      <p className="text-cream/60 text-sm">{item.desc}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* BULK ORDER SECTION */}
        <section className="py-16 px-4 bg-gradient-to-b from-obsidian to-black">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <h2 className="font-display text-3xl md:text-5xl font-bold text-cream mb-4">
                Wholesale & Bulk Orders <span className="text-gold">Available</span>
              </h2>
              <p className="text-cream/70 text-lg mb-8 max-w-2xl mx-auto">
                Partner with Y7 for premium pricing and reliable supply
              </p>

              {/* Target Buyers */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10 max-w-4xl mx-auto">
                {[
                  { icon: Users, label: 'Restaurants' },
                  { icon: Building2, label: 'Retailers' },
                  { icon: Package, label: 'Distributors' },
                  { icon: Factory, label: 'Food Manufacturers' }
                ].map((buyer, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <Card className="bg-black border-gold/20 hover:border-gold/40 transition-all duration-300">
                      <CardContent className="p-6 text-center">
                        <buyer.icon className="w-8 h-8 text-gold mx-auto mb-3" />
                        <p className="text-cream font-medium text-sm">{buyer.label}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {/* CTA Button */}
              <Link to="/bulk-orders">
                <Button size="lg" className="bg-gold text-black hover:bg-gold/90 font-bold h-14 px-10 text-base">
                  Get Wholesale Quote
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </section>

        {/* Quick Preview Modal */}
        <AnimatePresence>
          {selectedProduct && (
            <QuickPreviewModal
              product={selectedProduct}
              onClose={() => setSelectedProduct(null)}
            />
          )}
        </AnimatePresence>

        {/* Filter Modal (Bottom Sheet) */}
        <AnimatePresence>
          {showFilterModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-end"
              onClick={() => setShowFilterModal(false)}
            >
              <motion.div
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", damping: 25 }}
                className="bg-obsidian border-t border-gold/30 rounded-t-3xl w-full max-h-[80vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-display text-2xl font-bold text-cream">Filter Products</h3>
                    <button
                      onClick={() => setShowFilterModal(false)}
                      className="w-10 h-10 bg-black/50 rounded-full flex items-center justify-center text-cream"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-cream mb-3">Category</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {categories.map((category) => (
                          <button
                            key={category}
                            onClick={() => {
                              setSelectedCategory(category);
                              setShowFilterModal(false);
                            }}
                            className={`px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                              selectedCategory === category
                                ? 'bg-gold text-black'
                                : 'bg-black border border-gold/30 text-gold hover:bg-gold/10'
                            }`}
                          >
                            {category}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
