import { useState, useEffect, useRef, memo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import {
  ShoppingCart,
  MessageCircle,
  Star,
  ChevronRight,
  Sparkles,
  Package,
  Users,
  Building2,
  Factory,
  ArrowRight,
  Filter,
  Play
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import SEOHead from '@/components/SEOHead';
import { allProducts, getProductsByCategory, type ProductData } from '@/data/products';

// Product data structure - using shared type
interface Product extends ProductData {}

// Category data structure
interface CategoryData {
  slug: string;
  name: string;
  title: string;
  subtitle: string;
  description: string;
  videoUrl: string;
  videoPoster: string;
  highlights: Array<{ icon: string; text: string }>;
  subcategories: string[];
  products: Product[];
  featuredProduct?: Product;
  recipes: Array<{ title: string; image: string }>;
  seo: {
    title: string;
    description: string;
    keywords: string;
  };
}

// Mock category data - Replace with actual data from API/props
const getCategoryData = (slug: string): CategoryData => {
  // Map of category slugs to display names
  const categoryMap: Record<string, string> = {
    'sauces-condiments': 'Sauces & Condiments',
    'sauces-and-condiments': 'Sauces & Condiments',
    'flakes-powders-agro-products': 'Flakes & Powders (Agro Products)',
    'flakes-and-powders-agro-products': 'Flakes & Powders (Agro Products)',
    'raw-banana-powders': 'Raw Banana Powders',
    'fruit-vegetable-powders': 'Fruit & Vegetable Powders',
    'fruit-and-vegetable-powders': 'Fruit & Vegetable Powders'
  };

  const categoryName = categoryMap[slug] || slug.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');

  // Get products for this category
  const categoryProducts = getProductsByCategory(categoryName);
  
  // Find featured product (best seller)
  const featuredProduct = categoryProducts.find(p => p.isBestSeller) || categoryProducts[0];

  // This would come from your backend or data file
  return {
    slug: slug,
    name: categoryName,
    title: categoryName.toUpperCase(),
    subtitle: 'Bold Flavor. Premium Ingredients.',
    description: 'Crafted sauces designed for restaurants, chefs, and everyday kitchens.',
    videoUrl: '/Green-Chilli-Flakes.mp4',
    videoPoster: '/placeholder.svg',
    highlights: [
      { icon: 'leaf', text: 'Natural Ingredients' },
      { icon: 'star', text: 'Rich Flavor Profile' },
      { icon: 'tomato', text: 'Fresh Tomato Base' },
      { icon: 'package', text: 'Bulk Supply Available' },
      { icon: 'award', text: 'Export Quality' }
    ],
    subcategories: ['All'],
    products: categoryProducts,
    featuredProduct: featuredProduct,
    recipes: [
      { title: 'Pasta Recipe', image: '/placeholder.svg' },
      { title: 'Pizza Sauce Use', image: '/placeholder.svg' },
      { title: 'Burger Sauce', image: '/placeholder.svg' },
      { title: 'Street Food Use', image: '/placeholder.svg' }
    ],
    seo: {
      title: `Premium ${categoryName} | Y7 Foods`,
      description: `Discover Y7's premium ${categoryName.toLowerCase()} crafted with natural ingredients for restaurants and home kitchens.`,
      keywords: `premium ${categoryName.toLowerCase()}, Y7 foods, condiments, sauces`
    }
  };
};

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
const ProductCard = memo(({ product }: { product: Product }) => {
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

export default function CategoryPage() {
  const { category } = useParams<{ category: string }>();
  const [sortBy, setSortBy] = useState('best-selling');
  const [videoLoaded, setVideoLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);

  const categoryData = getCategoryData(category || 'sauces-condiments');

  useEffect(() => {
    // Scroll to top on mount
    window.scrollTo(0, 0);
  }, [category]);

  // Infinite scroll effect for carousel
  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    let animationId: number;
    let scrollPosition = 0;
    const scrollSpeed = 1.2;
    let isPaused = false;
    let lastScrollLeft = 0;
    let scrollTimeout: NodeJS.Timeout;

    const animate = () => {
      if (!isPaused) {
        scrollPosition += scrollSpeed;
        
        // Get the width of one set of items
        const scrollWidth = carousel.scrollWidth / 2;
        
        // Reset position when we've scrolled through one complete set
        if (scrollPosition >= scrollWidth) {
          scrollPosition = 0;
        }
        
        carousel.scrollLeft = scrollPosition;
        lastScrollLeft = scrollPosition;
      }
      animationId = requestAnimationFrame(animate);
    };

    // Detect manual scrolling
    const handleTouchStart = () => {
      isPaused = true;
    };

    const handleTouchEnd = () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        isPaused = false;
        scrollPosition = carousel.scrollLeft;
      }, 1000);
    };

    // Start animation
    animationId = requestAnimationFrame(animate);

    // Pause on hover (desktop)
    const handleMouseEnter = () => {
      isPaused = true;
    };

    const handleMouseLeave = () => {
      isPaused = false;
    };

    carousel.addEventListener('mouseenter', handleMouseEnter);
    carousel.addEventListener('mouseleave', handleMouseLeave);
    carousel.addEventListener('touchstart', handleTouchStart, { passive: true });
    carousel.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      cancelAnimationFrame(animationId);
      clearTimeout(scrollTimeout);
      carousel.removeEventListener('mouseenter', handleMouseEnter);
      carousel.removeEventListener('mouseleave', handleMouseLeave);
      carousel.removeEventListener('touchstart', handleTouchStart);
      carousel.removeEventListener('touchend', handleTouchEnd);
    };
  }, [categoryData.products]);

  // All products (no filtering by subcategory)
  const filteredProducts = categoryData.products;

  return (
    <>
      <SEOHead seo={categoryData.seo} />

      <div className="min-h-screen bg-black text-cream">
        {/* HERO VIDEO SECTION */}
        <section className="relative h-[55vh] overflow-hidden">
          {/* Video Background */}
          <video
            ref={videoRef}
            autoPlay
            muted
            loop
            playsInline
            poster={categoryData.videoPoster}
            onLoadedData={() => setVideoLoaded(true)}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
              videoLoaded ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <source src={categoryData.videoUrl} type="video/mp4" />
          </video>

          {/* Dark Gradient Overlay (60%) */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/60 to-black/40" />

          {/* Hero Content */}
          <div className="relative h-full flex items-center justify-center px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-center max-w-3xl"
            >
              <h1 className="font-display text-4xl md:text-6xl font-bold text-cream mb-4 tracking-wide">
                {categoryData.title}
              </h1>
              <p className="text-gold text-xl md:text-2xl font-semibold mb-3">
                {categoryData.subtitle}
              </p>
              <p className="text-cream/80 text-base md:text-lg mb-8 max-w-2xl mx-auto">
                {categoryData.description}
              </p>
              <Button
                size="lg"
                className="bg-gold text-black hover:bg-gold/90 font-semibold h-12 px-8"
              >
                Explore Products
                <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
            </motion.div>
          </div>
        </section>

        {/* CATEGORY INTRO SECTION */}
        <section className="py-12 px-4 bg-black">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto text-center"
          >
            <p className="font-body text-cream/85 text-base md:text-lg leading-relaxed">
              Our sauces are crafted with carefully selected ingredients to deliver rich flavor, 
              vibrant color, and restaurant-quality taste. Perfect for cooking, dipping, and fusion recipes.
            </p>
          </motion.div>
        </section>

        {/* QUICK HIGHLIGHTS - Horizontal Scroll Cards */}
        <section className="py-8 px-4 bg-obsidian">
          <div className="max-w-7xl mx-auto">
            <div className="flex gap-4 overflow-x-auto scrollbar-hide snap-x pb-4">
              {categoryData.highlights.map((highlight, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="flex-shrink-0 snap-center"
                >
                  <Card className="bg-black border-gold/20 hover:border-gold/40 transition-all duration-300 shadow-lg w-48">
                    <CardContent className="p-4 text-center">
                      <div className="w-10 h-10 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Sparkles className="w-5 h-5 text-gold" />
                      </div>
                      <p className="text-cream text-sm font-medium">{highlight.text}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* PRODUCTS CAROUSEL - Infinite Auto-Scrolling Product Names */}
        <section className="py-8 px-4 bg-black border-y border-gold/10 overflow-hidden">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-6"
            >
              <h3 className="font-display text-2xl md:text-3xl font-bold text-cream mb-2">
                Explore Our <span className="text-gold">Collection</span>
              </h3>
              <p className="text-cream/60 text-sm">
                {categoryData.products.length} premium products in this category
              </p>
            </motion.div>

            {/* Infinite Auto-Scrolling Carousel */}
            <div className="relative">
              {/* Gradient Overlays */}
              <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-black via-black/80 to-transparent z-10 pointer-events-none" />
              <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-black via-black/80 to-transparent z-10 pointer-events-none" />
              
              {/* Scrolling Container */}
              <div 
                ref={carouselRef}
                className="carousel-container overflow-x-auto scrollbar-hide"
                style={{
                  WebkitOverflowScrolling: 'touch'
                }}
              >
                <div className="inline-flex gap-3">
                  {/* Sort products: Best sellers first, then rest - Triple for true infinite loop */}
                  {[...categoryData.products]
                    .sort((a, b) => {
                      if (a.isBestSeller && !b.isBestSeller) return -1;
                      if (!a.isBestSeller && b.isBestSeller) return 1;
                      return 0;
                    })
                    .concat([...categoryData.products].sort((a, b) => {
                      if (a.isBestSeller && !b.isBestSeller) return -1;
                      if (!a.isBestSeller && b.isBestSeller) return 1;
                      return 0;
                    }))
                    .concat([...categoryData.products].sort((a, b) => {
                      if (a.isBestSeller && !b.isBestSeller) return -1;
                      if (!a.isBestSeller && b.isBestSeller) return 1;
                      return 0;
                    }))
                    .map((product, index) => (
                      <motion.div
                        key={`${product.id}-${index}`}
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.4, delay: (index % categoryData.products.length) * 0.02 }}
                        viewport={{ once: true }}
                        className="flex-shrink-0"
                      >
                        <Link to={`/products/${product.slug}`}>
                          <Card className="bg-gradient-to-br from-obsidian to-black border-gold/20 hover:border-gold hover:shadow-lg hover:shadow-gold/20 transition-all duration-300 group cursor-pointer w-[140px] h-[140px]">
                            <CardContent className="p-3 flex flex-col items-center justify-center text-center h-full relative">
                              {/* Best Seller Crown */}
                              {product.isBestSeller && (
                                <div className="absolute -top-1 -right-1 w-6 h-6 bg-gold rounded-full flex items-center justify-center shadow-lg shadow-gold/50 animate-pulse">
                                  <Star className="w-3 h-3 text-black fill-black" />
                                </div>
                              )}
                              
                              {/* Product Number Badge */}
                              <div className="w-7 h-7 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center mb-2 group-hover:bg-gold/20 group-hover:border-gold transition-all">
                                <span className="text-gold text-xs font-bold">
                                  {String((index % categoryData.products.length) + 1).padStart(2, '0')}
                                </span>
                              </div>
                              
                              {/* Product Name */}
                              <h4 className="font-display text-cream text-xs font-semibold mb-2 line-clamp-2 group-hover:text-gold transition-colors leading-tight">
                                {product.name}
                              </h4>
                              
                              {/* Single Badge - Priority: Best Seller > New > In Stock */}
                              <div className="flex justify-center">
                                {product.isBestSeller ? (
                                  <Badge className="bg-gold/20 text-gold border-gold/30 text-[10px] px-1.5 py-0">
                                    ⭐ Top
                                  </Badge>
                                ) : product.isNew ? (
                                  <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-[10px] px-1.5 py-0">
                                    New
                                  </Badge>
                                ) : product.inStock ? (
                                  <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-[10px] px-1.5 py-0">
                                    ✓
                                  </Badge>
                                ) : null}
                              </div>

                              {/* Hover Arrow */}
                              <div className="absolute bottom-1 opacity-0 group-hover:opacity-100 transition-all">
                                <ChevronRight className="w-3 h-3 text-gold" />
                              </div>
                            </CardContent>
                          </Card>
                        </Link>
                      </motion.div>
                    ))}
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

        {/* SMART FILTER - Sort By */}
        <section className="py-4 px-4 bg-obsidian">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gold" />
              <span className="text-cream/60 text-sm">Sort by:</span>
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-black border border-gold/30 text-gold rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-gold"
            >
              <option value="best-selling">Best Selling</option>
              <option value="newest">Newest</option>
              <option value="popular">Popular</option>
            </select>
          </div>
        </section>

        {/* PRODUCT GRID - 2 Columns Mobile */}
        <section className="py-12 px-4 bg-black">
          <div className="max-w-7xl mx-auto">
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <Package className="w-16 h-16 text-gold/30 mx-auto mb-4" />
                <p className="text-cream/60 text-lg">No products found in this category</p>
              </div>
            )}
          </div>
        </section>

        {/* FEATURED PRODUCT SECTION */}
        {categoryData.featuredProduct && (
          <section className="py-16 px-4 bg-gradient-to-b from-obsidian to-black">
            <div className="max-w-6xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <Card className="bg-black border-gold/30 overflow-hidden">
                  <div className="grid md:grid-cols-2 gap-8 p-6 md:p-10">
                    {/* Image */}
                    <div className="relative aspect-square rounded-lg overflow-hidden">
                      <OptimizedImage
                        src={categoryData.featuredProduct.image}
                        alt={categoryData.featuredProduct.name}
                      />
                      <Badge className="absolute top-4 left-4 bg-gold text-black">
                        <Star className="w-4 h-4 mr-1" />
                        Best Seller
                      </Badge>
                    </div>

                    {/* Content */}
                    <div className="flex flex-col justify-center">
                      <Badge className="w-fit mb-4 bg-gold/10 text-gold border-gold/30">
                        Featured Product
                      </Badge>
                      <h2 className="font-display text-3xl md:text-4xl font-bold text-cream mb-4">
                        {categoryData.featuredProduct.name}
                      </h2>
                      <p className="text-cream/70 text-base md:text-lg mb-6 leading-relaxed">
                        {categoryData.featuredProduct.description}
                      </p>
                      <Link to={`/products/${categoryData.featuredProduct.slug}`}>
                        <Button size="lg" className="bg-gold text-black hover:bg-gold/90 w-full md:w-auto">
                          View Product
                          <ArrowRight className="w-5 h-5 ml-2" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </Card>
              </motion.div>
            </div>
          </section>
        )}

        {/* RECIPE / USAGE IDEAS */}
        <section className="py-12 px-4 bg-obsidian">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-8"
            >
              <h2 className="font-display text-3xl md:text-4xl font-bold text-cream mb-3">
                Recipe <span className="text-gold">Inspiration</span>
              </h2>
              <p className="text-cream/60 text-base">Discover delicious ways to use our sauces</p>
            </motion.div>

            <div className="flex gap-4 overflow-x-auto scrollbar-hide snap-x pb-4">
              {categoryData.recipes.map((recipe, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="flex-shrink-0 snap-center w-64"
                >
                  <Card className="bg-black border-gold/20 hover:border-gold/40 transition-all duration-300 overflow-hidden group cursor-pointer">
                    <div className="relative aspect-video overflow-hidden">
                      <OptimizedImage
                        src={recipe.image}
                        alt={recipe.title}
                        className="group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Play className="w-12 h-12 text-gold" />
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-cream text-base">{recipe.title}</h3>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* BULK ORDER SECTION - B2B Conversion */}
        <section className="py-16 px-4 bg-gradient-to-b from-black to-obsidian">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <h2 className="font-display text-3xl md:text-5xl font-bold text-cream mb-4">
                Bulk Orders <span className="text-gold">Available</span>
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
      </div>
    </>
  );
}
