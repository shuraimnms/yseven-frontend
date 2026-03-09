import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageCircle,
  Star,
  ChevronRight,
  ChevronDown,
  Package,
  Users,
  Building2,
  Factory,
  Check,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import SEOHead from '@/components/SEOHead';
import { allProducts } from '@/data/products';

// Pack sizes data with image variants
const packSizes = {
  sachets: [
    { size: '8g', label: '8g', type: 'Sachet', imageVariant: 'sachet-8g' },
    { size: '40g', label: '40g', type: 'Sachet', imageVariant: 'sachet-40g' }
  ],
  bottles: [
    { size: '100ml', label: '100ml', type: 'Bottle', imageVariant: 'bottle-100ml' },
    { size: '250ml', label: '250ml', type: 'Bottle', imageVariant: 'bottle-250ml' },
    { size: '500ml', label: '500ml', type: 'Bottle', imageVariant: 'bottle-500ml' },
    { size: '1000ml', label: '1L', type: 'Bottle', imageVariant: 'bottle-1000ml' }
  ]
};

// Usage ideas
const usageIdeas = [
  { icon: '🍔', label: 'Burgers' },
  { icon: '🍟', label: 'Fries' },
  { icon: '🍕', label: 'Pizza' },
  { icon: '🌯', label: 'Wraps' },
  { icon: '🍗', label: 'Grilled' },
  { icon: '🥗', label: 'Salads' }
];

// Specifications data
const specifications = [
  {
    title: 'Ingredients',
    content: 'Tomatoes, Vinegar, Sugar, Salt, Spices, Natural Flavors, Preservatives (E211)'
  },
  {
    title: 'Shelf Life',
    content: '12 months from date of manufacture'
  },
  {
    title: 'Storage Instructions',
    content: 'Store in a cool, dry place. Refrigerate after opening and consume within 30 days.'
  },
  {
    title: 'Packaging Type',
    content: 'PET Bottles, Glass Bottles, Sachets, Pouches'
  },
  {
    title: 'Country of Origin',
    content: 'Made in India'
  }
];

// Accordion Component
const Accordion = ({ title, content, isOpen, onToggle }: any) => (
  <div className="border-b border-gold/20">
    <button
      onClick={onToggle}
      className="w-full flex items-center justify-between py-4 text-left"
    >
      <span className="font-semibold text-cream">{title}</span>
      <ChevronDown className={`w-5 h-5 text-gold transition-transform ${isOpen ? 'rotate-180' : ''}`} />
    </button>
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden"
        >
          <p className="text-cream/70 text-sm pb-4 leading-relaxed">{content}</p>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

export default function ProductDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [selectedSize, setSelectedSize] = useState('250ml');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [openAccordion, setOpenAccordion] = useState<number | null>(0);
  const galleryRef = useRef<HTMLDivElement>(null);
  const topRef = useRef<HTMLDivElement>(null);

  // Find product
  const product = allProducts.find(p => p.slug === slug);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  // Handle pack size change
  const handleSizeChange = (size: string) => {
    setSelectedSize(size);
    setCurrentImageIndex(0);
    
    // Scroll to top smoothly
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    
    // Also scroll gallery to first image
    if (galleryRef.current) {
      galleryRef.current.scrollTo({
        left: 0,
        behavior: 'smooth'
      });
    }
  };

  if (!product) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-cream mb-4">Product Not Found</h1>
          <Link to="/products">
            <Button className="bg-gold text-black hover:bg-gold/90">
              Back to Products
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // Get image based on selected size
  const getImageForSize = (size: string) => {
    // In a real app, you'd have different images for each size
    // For now, we'll use the same image but you can add logic here
    return product.image;
  };

  // Mock multiple images based on selected size
  const productImages = [
    getImageForSize(selectedSize),
    product.image,
    product.image
  ];

  // Related products
  const relatedProducts = allProducts
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  // Get pack size details
  const getPackSizeDetails = (size: string) => {
    const allPacks = [...packSizes.sachets, ...packSizes.bottles];
    return allPacks.find(p => p.size === size);
  };

  const selectedPackDetails = getPackSizeDetails(selectedSize);

  const seoData = {
    title: `${product.name} - Premium ${product.category} | Y7 Foods`,
    description: product.description,
    keywords: `${product.name}, ${product.category}, Y7 Foods, premium sauces`
  };

  return (
    <>
      <SEOHead seo={seoData} />

      <div ref={topRef} className="min-h-screen bg-black text-cream">

        {/* 1. PRODUCT MEDIA SECTION */}
        <section className="relative h-[45vh] md:h-[50vh] bg-obsidian">
          <div 
            ref={galleryRef}
            className="h-full overflow-x-auto snap-x snap-mandatory scrollbar-hide flex"
          >
            {productImages.map((image, index) => (
              <div key={index} className="min-w-full h-full snap-center relative">
                <img
                  src={image}
                  alt={`${product.name} - Image ${index + 1}`}
                  className="w-full h-full object-contain"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              </div>
            ))}
          </div>

          {/* Premium Quality Badge */}
          <div className="absolute top-4 left-4 z-10">
            <Badge className="bg-gold text-black font-semibold">
              <Star className="w-3 h-3 mr-1 fill-black" />
              Premium Quality
            </Badge>
          </div>

          {/* Pack Size Badge */}
          {selectedPackDetails && (
            <div className="absolute top-4 right-4 z-10">
              <Badge className="bg-black/80 backdrop-blur-sm text-gold border border-gold/30 font-semibold">
                {selectedPackDetails.label} {selectedPackDetails.type}
              </Badge>
            </div>
          )}

          {/* Image Indicators */}
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
            {productImages.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setCurrentImageIndex(index);
                  galleryRef.current?.scrollTo({ left: index * window.innerWidth, behavior: 'smooth' });
                }}
                className={`w-2 h-2 rounded-full transition-all ${
                  currentImageIndex === index ? 'bg-gold w-6' : 'bg-cream/30'
                }`}
              />
            ))}
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 py-6">
          {/* 2. PRODUCT TITLE + CATEGORY */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6"
          >
            <h1 className="font-display text-3xl md:text-4xl font-bold text-cream mb-2">
              {product.name}
            </h1>
            <p className="text-gold text-lg mb-3">{product.tagline || product.description.substring(0, 60)}</p>
            
            <div className="flex items-center gap-2 mb-4">
              <Badge variant="outline" className="border-gold/30 text-gold">
                Category: {product.category}
              </Badge>
            </div>

            {/* Icons */}
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-1.5 text-sm text-cream/70">
                <span>🌶</span>
                <span>Spicy</span>
              </div>
              <div className="flex items-center gap-1.5 text-sm text-cream/70">
                <span>🍅</span>
                <span>Tomato Base</span>
              </div>
              <div className="flex items-center gap-1.5 text-sm text-cream/70">
                <span>🌿</span>
                <span>Natural Ingredients</span>
              </div>
            </div>
          </motion.div>

          {/* 3. PACK SIZE SELECTOR */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-8 bg-obsidian p-6 rounded-2xl border border-gold/20"
          >
            <h2 className="font-display text-xl font-bold text-cream mb-4">
              Available Pack Sizes
            </h2>

            {/* Sachet Packs */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-cream/80">Sachet Packs</h3>
                <Badge className="bg-gold/20 text-gold border-gold/30 text-xs">
                  Single Serve
                </Badge>
              </div>
              <div className="flex gap-3">
                {packSizes.sachets.map((pack) => (
                  <button
                    key={pack.size}
                    onClick={() => handleSizeChange(pack.size)}
                    className={`flex-1 h-[44px] rounded-lg font-medium text-sm transition-all duration-300 ${
                      selectedSize === pack.size
                        ? 'bg-gold text-black border-2 border-gold shadow-lg shadow-gold/30'
                        : 'bg-black border border-gold/30 text-gold hover:bg-gold/10'
                    }`}
                  >
                    {pack.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Bottle / Pouch Packs */}
            <div>
              <h3 className="text-sm font-semibold text-cream/80 mb-3">Bottle / Pouch Packs</h3>
              <div className="grid grid-cols-2 gap-3">
                {packSizes.bottles.map((pack) => (
                  <button
                    key={pack.size}
                    onClick={() => handleSizeChange(pack.size)}
                    className={`h-[44px] rounded-lg font-medium text-sm transition-all duration-300 ${
                      selectedSize === pack.size
                        ? 'bg-gold text-black border-2 border-gold scale-105 shadow-lg shadow-gold/30'
                        : 'bg-black border border-gold/30 text-gold hover:bg-gold/10'
                    }`}
                  >
                    {pack.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Selected Size Display */}
            <motion.div
              key={selectedSize}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="mt-4 p-3 bg-black/50 rounded-lg border border-gold/20"
            >
              <p className="text-xs text-cream/60 mb-1">Selected Size:</p>
              <p className="text-gold font-semibold text-lg">{selectedSize} {selectedPackDetails?.type}</p>
            </motion.div>
          </motion.div>

          {/* 4. KEY HIGHLIGHTS */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-8"
          >
            <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
              {product.benefits.map((benefit, index) => (
                <div
                  key={index}
                  className="flex-shrink-0 flex items-center gap-2 bg-obsidian px-4 py-2.5 rounded-full border border-gold/20"
                >
                  <Check className="w-4 h-4 text-gold" />
                  <span className="text-sm text-cream whitespace-nowrap">{benefit}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* 5. PRODUCT DESCRIPTION */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mb-8"
          >
            <h2 className="font-display text-2xl font-bold text-cream mb-4">
              Product Details
            </h2>
            <p className="text-cream/70 text-base leading-relaxed">
              {product.description}
            </p>
          </motion.div>

          {/* 6. USAGE / RECIPES */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mb-8"
          >
            <h2 className="font-display text-2xl font-bold text-cream mb-4">
              Perfect For
            </h2>
            <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
              {usageIdeas.map((idea, index) => (
                <Card
                  key={index}
                  className="flex-shrink-0 w-28 bg-obsidian border-gold/20 hover:border-gold/40 transition-all duration-300"
                >
                  <CardContent className="p-4 text-center">
                    <div className="text-3xl mb-2">{idea.icon}</div>
                    <p className="text-sm text-cream font-medium">{idea.label}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.div>

          {/* 7. BULK ORDER CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mb-8 bg-gradient-to-br from-gold/10 to-gold/5 p-6 rounded-2xl border border-gold/30"
          >
            <h2 className="font-display text-2xl font-bold text-cream mb-3">
              Bulk Supply <span className="text-gold">Available</span>
            </h2>
            <p className="text-cream/70 text-sm mb-4">
              Partner with Y7 for premium pricing and reliable supply
            </p>

            <div className="grid grid-cols-2 gap-3 mb-4">
              {[
                { icon: Users, label: 'Restaurants' },
                { icon: Building2, label: 'Retailers' },
                { icon: Package, label: 'Distributors' },
                { icon: Factory, label: 'Manufacturers' }
              ].map((buyer, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 bg-black/50 p-3 rounded-lg"
                >
                  <buyer.icon className="w-5 h-5 text-gold" />
                  <span className="text-sm text-cream">{buyer.label}</span>
                </div>
              ))}
            </div>

            <Link to="/bulk-orders">
              <Button className="w-full bg-gold text-black hover:bg-gold/90 h-12 font-semibold">
                Get Wholesale Quote
                <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </motion.div>

          {/* 8. SPECIFICATIONS */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mb-8"
          >
            <h2 className="font-display text-2xl font-bold text-cream mb-4">
              Specifications
            </h2>
            <div className="bg-obsidian rounded-2xl border border-gold/20 overflow-hidden">
              {specifications.map((spec, index) => (
                <Accordion
                  key={index}
                  title={spec.title}
                  content={spec.content}
                  isOpen={openAccordion === index}
                  onToggle={() => setOpenAccordion(openAccordion === index ? null : index)}
                />
              ))}
            </div>
          </motion.div>

          {/* 9. RELATED PRODUCTS */}
          {relatedProducts.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
              className="mb-8"
            >
              <h2 className="font-display text-2xl font-bold text-cream mb-4">
                Related Products
              </h2>
              <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
                {relatedProducts.map((relatedProduct) => (
                  <Link
                    key={relatedProduct.id}
                    to={`/products/${relatedProduct.slug}`}
                    className="flex-shrink-0 w-48"
                  >
                    <Card className="bg-obsidian border-gold/20 hover:border-gold/40 transition-all duration-300 overflow-hidden group">
                      <div className="relative aspect-square overflow-hidden">
                        <img
                          src={relatedProduct.image}
                          alt={relatedProduct.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                      </div>
                      <CardContent className="p-3">
                        <h3 className="font-semibold text-cream text-sm line-clamp-2 mb-1">
                          {relatedProduct.name}
                        </h3>
                        <p className="text-cream/60 text-xs line-clamp-1">
                          {relatedProduct.tagline}
                        </p>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </div>

        {/* 10. STICKY MOBILE CTA */}
        <div className="fixed bottom-0 left-0 right-0 bg-black/95 backdrop-blur-lg border-t border-gold/20 p-4 z-50">
          <div className="max-w-7xl mx-auto flex gap-3">
            <a
              href="https://wa.me/1234567890"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1"
            >
              <Button className="w-full bg-green-600 text-white hover:bg-green-700 h-[60px] font-semibold text-base">
                <MessageCircle className="w-5 h-5 mr-2" />
                WhatsApp Inquiry
              </Button>
            </a>
            <Link to="/contact" className="flex-1">
              <Button className="w-full bg-gold text-black hover:bg-gold/90 h-[60px] font-semibold text-base">
                Get Quote
              </Button>
            </Link>
          </div>
        </div>

        {/* Add padding at bottom for sticky CTA */}
        <div className="h-24" />
      </div>
    </>
  );
}
