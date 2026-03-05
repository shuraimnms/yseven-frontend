import { Link } from "react-router-dom";
import { useState, useRef, useEffect, useMemo, memo, useCallback, lazy, Suspense } from "react";
import { ArrowRight, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import SEOHead from "@/components/SEOHead";

// Lazy load ProductVideo for better performance
const ProductVideo = lazy(() => import("@/components/ProductVideo"));

// Import all product images
import tomatoKetchup from "@/assets/Tomato-Ketchup.png";
import tomatoSauce from "@/assets/Tomato-Sauce.png";
import snackSauce from "@/assets/Snack-Sauce.png";
import greenChilliSauce from "@/assets/Green-Chilli-Sauce.png";
import redChilliSauce from "@/assets/Red-Chilli-Sauce.png";
import soyaSauce from "@/assets/Soya-Sauce.png";
import vinegar from "@/assets/Vinegar.png";
import hotSpicySauce from "@/assets/Hot-&-Spicy-Sauce.png";
import garlicSauce from "@/assets/Garlic-Sauce.png";
import schezwanSauce from "@/assets/Schezwan-Sauce.png";
import liteMayonnaise from "@/assets/Lite-Mayonnaise.png";
import classicMayonnaise from "@/assets/Classic-Mayonnaise.png";
import cheeseBlend from "@/assets/Cheese-Blend.png";
import periPeriSauce from "@/assets/Peri-Peri-Sauce.png";
import romescoSauce from "@/assets/Romesco-Sauce.png";
import sambalSauce from "@/assets/Sambal-Sauce.png";
import greenChilliFlakesFallback from "@/assets/Green-Chilli-Flakes.png";
import greenChilliPowder from "@/assets/Green-Chilli-Powder.png";
import yelkahiBananaPowderFallback from "@/assets/Yelkahi-Banana-Powde.png";
import rasabaleBananaPowder from "@/assets/Rasabale-Banana-Powder.png";
import g9BananaPowder from "@/assets/G9-Banana-Powder.png";
import rawPapayaPowderFallback from "@/assets/Raw-Papaya-Powder.png";
import mangoPowder from "@/assets/Mango-Powder.png";
import guavaPowder from "@/assets/Guava-Powder.png";
import sweetPotatoPowder from "@/assets/Sweet-Potato-Powder.png";
import chikooSapotaPowder from "@/assets/Chikoo(Sapota)-Powder.png";

// Import videos
import tomatoKetchupVideo from "@/assets/Tomato-Ketchup.mp4";
import greenChilliFlakesVideo from "@/assets/Green-Chilli-Flakes.mp4";
import yelkahiBananaPowderVideo from "@/assets/Yelkahi-Banana-Powde.mp4";
import rawPapayaPowderVideo from "@/assets/Raw-Papaya-Powder.mp4";

// Map category names to category page slugs
const categorySlugMap: { [key: string]: string } = {
  "Sauces & Condiments": "sauces-condiments",
  "Flakes & Powders (Agro Products)": "flakes-powders",
  "Raw Banana Powders": "banana-powders",
  "Fruit & Vegetable Powders": "fruit-vegetable-powders"
};

// Optimized Image Component with Intersection Observer
const OptimizedImage = memo(({ src, alt, className, hasVideo = false, videoSrc = null }: {
  src: string;
  alt: string;
  className?: string;
  hasVideo?: boolean;
  videoSrc?: string | null;
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const imgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { 
        threshold: 0.1,
        rootMargin: '100px' // Load images 100px before they come into view
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={imgRef} className={className}>
      {isVisible ? (
        hasVideo && videoSrc ? (
          <Suspense fallback={
            <img
              src={src}
              alt={alt}
              className="w-full h-full object-cover"
              loading="lazy"
              decoding="async"
            />
          }>
            <ProductVideo
              videoSrc={videoSrc}
              fallbackImage={src}
              alt={alt}
              className="w-full h-full"
            />
          </Suspense>
        ) : (
          <img
            src={src}
            alt={alt}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
            decoding="async"
            onLoad={() => setImageLoaded(true)}
            style={{ opacity: imageLoaded ? 1 : 0, transition: 'opacity 0.3s' }}
          />
        )
      ) : (
        <div className="w-full h-full bg-obsidian/50 animate-pulse flex items-center justify-center">
          <div className="text-cream/30 text-sm">Loading...</div>
        </div>
      )}
    </div>
  );
});

OptimizedImage.displayName = 'OptimizedImage';

// Optimized Product Card
const ProductCard = memo(({ product, index }: { product: any; index: number }) => {
  const hasVideo = ['Tomato Ketchup', 'Green Chilli Flakes', 'Yelkahi Banana Powder', 'Raw Papaya Powder'].includes(product.name);
  
  const getVideoSrc = () => {
    switch (product.name) {
      case 'Tomato Ketchup': return tomatoKetchupVideo;
      case 'Green Chilli Flakes': return greenChilliFlakesVideo;
      case 'Yelkahi Banana Powder': return yelkahiBananaPowderVideo;
      case 'Raw Papaya Powder': return rawPapayaPowderVideo;
      default: return null;
    }
  };

  return (
    <div
      className={`grid lg:grid-cols-2 gap-12 items-center transition-all duration-500 ${
        index % 2 === 1 ? "lg:flex-row-reverse" : ""
      }`}
    >
      {/* Product Image/Video */}
      <div className={index % 2 === 1 ? "lg:order-2" : ""}>
        <div className="relative group">
          <div className="w-full h-96 overflow-hidden rounded-lg border border-gold/20">
            <OptimizedImage
              src={product.image}
              alt={product.name}
              className="w-full h-full"
              hasVideo={hasVideo}
              videoSrc={getVideoSrc()}
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-obsidian/60 via-transparent to-transparent rounded-lg" />
        </div>
      </div>

      {/* Product Details */}
      <div className={index % 2 === 1 ? "lg:order-1" : ""}>
        <Badge variant="outline" className="border-gold text-gold mb-4">
          {product.category}
        </Badge>
        
        <h3 className="text-product-title mb-4">
          {product.name}
        </h3>

        <p className="text-body-premium mb-6">
          {product.description}
        </p>

        {/* Stock Status */}
        <div className="mb-6">
          {product.inStock ? (
            <Badge variant="outline" className="border-green-500 text-green-500">
              In Stock
            </Badge>
          ) : (
            <Badge variant="outline" className="border-red-500 text-red-500">
              Out of Stock
            </Badge>
          )}
        </div>

        {/* Key Benefits */}
        <div className="mb-6">
          <h4 className="font-body-semibold text-cream mb-3">Key Benefits:</h4>
          <div className="flex flex-wrap gap-2">
            {product.benefits.map((benefit: string, benefitIndex: number) => (
              <Badge
                key={benefitIndex}
                variant="outline"
                className="border-gold/30 text-gold bg-gold/10"
              >
                {benefit}
              </Badge>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3">
          {product.slug && (
            <Link to={`/products/${product.slug}`}>
              <Button 
                variant="default" 
                className="bg-gold text-obsidian hover:bg-gold/90 transition-all duration-300"
              >
                <ArrowRight className="w-4 h-4 mr-2" />
                View Details
              </Button>
            </Link>
          )}
          <Link to="/bulk-orders">
            <Button 
              variant="outline" 
              className="border-gold text-gold hover:bg-gold/10 transition-all duration-300"
            >
              Bulk Order
            </Button>
          </Link>
          <Link to="/contact">
            <Button 
              variant="outline" 
              className="border-gold/30 text-gold hover:bg-gold/10 transition-all duration-300"
            >
              Get Quote
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
});

ProductCard.displayName = 'ProductCard';

// All 26 products data
const allProducts = [
  {
    id: 1,
    name: "Tomato Ketchup",
    slug: "tomato-ketchup",
    description: "Classic tomato ketchup made from ripe, high-quality tomatoes, blended with a balanced mix of spices for rich flavor and smooth texture.",
    benefits: ["Rich tomato antioxidants (lycopene)", "Enhances taste instantly", "Low-fat condiment", "Kid-friendly flavor"],
    uses: "Burgers, fries, sandwiches, snacks, wraps",
    category: "Sauces & Condiments",
    image: tomatoKetchup,
    inStock: true
  },
  {
    id: 2,
    name: "Tomato Sauce / Continental Sauce",
    slug: "tomato-sauce-continental",
    description: "A tangy, mildly spiced tomato-based sauce ideal for continental dishes and fusion recipes.",
    benefits: ["Improves digestion", "Adds depth of flavor", "Low calorie", "Versatile use"],
    uses: "Pasta, pizzas, sandwiches, gravies",
    category: "Sauces & Condiments",
    image: tomatoSauce,
    inStock: true
  },
  {
    id: 3,
    name: "Snack Sauce",
    slug: "snack-sauce",
    description: "A bold, tangy, spicy sauce crafted for Indian snacks and street food flavors.",
    benefits: ["Bold tangy flavor", "Perfect for Indian snacks", "Appetite stimulant", "No artificial flavors"],
    uses: "Samosas, pakoras, chaat, fries",
    category: "Sauces & Condiments",
    image: snackSauce,
    inStock: true
  },
  {
    id: 4,
    name: "Green Chilli Sauce",
    slug: "green-chilli-sauce",
    description: "Spicy sauce made from fresh green chilies, delivering sharp heat and bold aroma.",
    benefits: ["Made from fresh green chilies", "Sharp heat level", "Rich in Vitamin C", "Boosts metabolism"],
    uses: "Noodles, momos, stir-fries",
    category: "Sauces & Condiments",
    image: greenChilliSauce,
    inStock: true
  },
  {
    id: 5,
    name: "Red Chilli Sauce",
    slug: "red-chilli-sauce",
    description: "Fiery red chili sauce with rich color and intense flavor for spicy food lovers.",
    benefits: ["Intense red chili flavor", "Rich color", "Enhances metabolism", "Antioxidant rich"],
    uses: "Chinese dishes, snacks, spring rolls",
    category: "Sauces & Condiments",
    image: redChilliSauce,
    inStock: true
  },
  {
    id: 6,
    name: "Soya Sauce",
    slug: "soya-sauce",
    description: "Fermented soy-based sauce delivering deep umami flavor for Asian cuisines.",
    benefits: ["Authentic umami flavor", "Fermented goodness", "Low calorie", "Versatile use"],
    uses: "Fried rice, noodles, marinades",
    category: "Sauces & Condiments",
    image: soyaSauce,
    inStock: true
  },
  {
    id: 7,
    name: "Vinegar",
    slug: "vinegar",
    description: "Naturally fermented vinegar for culinary and health applications.",
    benefits: ["Natural fermentation", "Aids digestion", "Preservative properties", "Tangy flavor"],
    uses: "Salads, pickling, marinades",
    category: "Sauces & Condiments",
    image: vinegar,
    inStock: true
  },
  {
    id: 8,
    name: "Hot & Spicy Sauce",
    slug: "hot-spicy-sauce",
    description: "A powerful blend of chilies and spices for intense heat lovers.",
    benefits: ["Intense heat", "Bold flavor", "Metabolism booster", "Appetite enhancer"],
    uses: "Grills, wraps, burgers",
    category: "Sauces & Condiments",
    image: hotSpicySauce,
    inStock: true
  },
  {
    id: 9,
    name: "Garlic Sauce",
    slug: "garlic-sauce",
    description: "Creamy garlic-based sauce with bold aroma and savory richness.",
    benefits: ["Bold garlic flavor", "Creamy texture", "Heart health support", "Immunity booster"],
    uses: "Shawarma, wraps, dips",
    category: "Sauces & Condiments",
    image: garlicSauce,
    inStock: true
  },
  {
    id: 10,
    name: "Schezwan Sauce",
    slug: "schezwan-sauce",
    description: "Authentic Schezwan sauce made with red chilies, garlic, and aromatic spices.",
    benefits: ["Authentic Indo-Chinese flavor", "Perfect heat level", "Rich garlic blend", "Versatile cooking sauce"],
    uses: "Fried rice, noodles, momos",
    category: "Sauces & Condiments",
    image: schezwanSauce,
    inStock: true
  },
  {
    id: 11,
    name: "Lite Mayonnaise",
    slug: "lite-mayonnaise",
    description: "Low-fat creamy mayonnaise with smooth texture and mild flavor.",
    benefits: ["Low-fat formula", "Smooth texture", "Mild flavor", "Healthier option"],
    uses: "Sandwiches, burgers, dips",
    category: "Sauces & Condiments",
    image: liteMayonnaise,
    inStock: true
  },
  {
    id: 12,
    name: "Classic Mayonnaise",
    slug: "classic-mayonnaise",
    description: "Rich and creamy mayonnaise made from premium quality oils and fresh eggs.",
    benefits: ["Premium quality", "Creamy texture", "Fresh egg-based", "No trans fats"],
    uses: "Sandwiches, burgers, salads",
    category: "Sauces & Condiments",
    image: classicMayonnaise,
    inStock: true
  },
  {
    id: 13,
    name: "Cheese Blend",
    slug: "cheese-blend",
    description: "Creamy cheese-flavored sauce for rich, savory dishes.",
    benefits: ["Rich cheesy flavor", "Creamy texture", "Versatile use", "Kid-friendly"],
    uses: "Nachos, fries, pasta",
    category: "Sauces & Condiments",
    image: cheeseBlend,
    inStock: true
  },
  {
    id: 14,
    name: "Peri Peri Sauce",
    slug: "peri-peri-sauce",
    description: "Tangy, spicy African-style sauce made with bird's eye chilies.",
    benefits: ["African fire & flavor", "Tangy and spicy", "Rich in Vitamin C", "Metabolism booster"],
    uses: "Grilled chicken, fries",
    category: "Sauces & Condiments",
    image: periPeriSauce,
    inStock: true
  },
  {
    id: 15,
    name: "Romesco Sauce",
    slug: "romesco-sauce",
    description: "Spanish-style nutty tomato-based sauce with rich smoky flavor.",
    benefits: ["Spanish nutty delight", "Smoky flavor", "Rich in antioxidants", "Unique taste"],
    uses: "Grilled vegetables, pasta",
    category: "Sauces & Condiments",
    image: romescoSauce,
    inStock: true
  },
  {
    id: 16,
    name: "Sambal Sauce",
    slug: "sambal-sauce",
    description: "Indonesian-style chili sauce with bold spice and tangy notes.",
    benefits: ["Indonesian spicy tang", "Bold spice", "Tangy notes", "Authentic flavor"],
    uses: "Rice, noodles, stir-fries",
    category: "Sauces & Condiments",
    image: sambalSauce,
    inStock: true
  },
  {
    id: 17,
    name: "Green Chilli Flakes",
    slug: "green-chilli-flakes",
    description: "Dried green chilies crushed into flakes for bold heat and aroma.",
    benefits: ["Boosts metabolism", "Rich in Vitamin C", "Improves digestion", "Bold heat"],
    uses: "Pizza topping, spice blends",
    category: "Flakes & Powders (Agro Products)",
    image: greenChilliFlakesFallback,
    inStock: true
  },
  {
    id: 18,
    name: "Green Chilli Powder",
    slug: "green-chilli-powder",
    description: "Finely ground green chili powder with intense flavor.",
    benefits: ["Intense flavor", "Rich in Vitamin C", "Metabolism booster", "Versatile spice"],
    uses: "Curries, marinades",
    category: "Flakes & Powders (Agro Products)",
    image: greenChilliPowder,
    inStock: true
  },
  {
    id: 19,
    name: "Yelkahi Banana Powder",
    slug: "yelkahi-banana-powder",
    description: "Made from premium Yelkahi bananas grown near Tungabhadra River.",
    benefits: ["Resistant starch", "Gut health support", "Low glycemic index", "Energy booster"],
    uses: "Smoothies, porridge",
    category: "Raw Banana Powders",
    image: yelkahiBananaPowderFallback,
    inStock: true
  },
  {
    id: 20,
    name: "Rasabale Banana Powder",
    slug: "rasabale-banana-powder",
    description: "Powdered aromatic bananas from Cauvery river belt.",
    benefits: ["Energy boosting", "Rich in potassium", "Aromatic flavor", "Digestive support"],
    uses: "Smoothies, health drinks",
    category: "Raw Banana Powders",
    image: rasabaleBananaPowder,
    inStock: true
  },
  {
    id: 21,
    name: "G9 Banana Powder",
    slug: "g9-banana-powder",
    description: "Powder made from export-grade Grand Naine bananas.",
    benefits: ["Export-grade quality", "Rich in fiber", "Energy booster", "Nutrient-rich"],
    uses: "Smoothies, baking",
    category: "Raw Banana Powders",
    image: g9BananaPowder,
    inStock: true
  },
  {
    id: 22,
    name: "Raw Papaya Powder",
    slug: "raw-papaya-powder",
    description: "Unripe papaya powder rich in papain enzyme.",
    benefits: ["Improves digestion", "Anti-inflammatory", "Detox support", "Enzyme-rich"],
    uses: "Health drinks, cooking",
    category: "Fruit & Vegetable Powders",
    image: rawPapayaPowderFallback,
    inStock: true
  },
  {
    id: 23,
    name: "Mango Powder",
    slug: "mango-powder",
    description: "Naturally sweet mango powder from ripe mangoes.",
    benefits: ["Rich in Vitamin A & C", "Immunity booster", "Natural sweetness", "Antioxidant-rich"],
    uses: "Smoothies, desserts",
    category: "Fruit & Vegetable Powders",
    image: mangoPowder,
    inStock: true
  },
  {
    id: 24,
    name: "Guava Powder",
    slug: "guava-powder",
    description: "Powdered guava rich in fiber and antioxidants.",
    benefits: ["Fiber-rich", "Improves digestion", "Boosts immunity", "Antioxidant power"],
    uses: "Health drinks, smoothies",
    category: "Fruit & Vegetable Powders",
    image: guavaPowder,
    inStock: true
  },
  {
    id: 25,
    name: "Sweet Potato Powder",
    slug: "sweet-potato-powder",
    description: "Naturally sweet powder made from dried sweet potatoes.",
    benefits: ["Rich in fiber", "Blood sugar control", "Natural sweetness", "Nutrient-dense"],
    uses: "Baking, smoothies",
    category: "Fruit & Vegetable Powders",
    image: sweetPotatoPowder,
    inStock: true
  },
  {
    id: 26,
    name: "Chikoo (Sapota) Powder",
    slug: "chikoo-sapota-powder",
    description: "Sweet, nutrient-rich sapota powder.",
    benefits: ["Energy booster", "Digestive support", "Antioxidant rich", "Natural sweetness"],
    uses: "Smoothies, desserts",
    category: "Fruit & Vegetable Powders",
    image: chikooSapotaPowder,
    inStock: true
  }
];

const Products = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [isLoading, setIsLoading] = useState(false);

  // Memoize categories for performance
  const categories = useMemo(() => 
    ["All", ...Array.from(new Set(allProducts.map(product => product.category)))],
    []
  );

  // Memoize filtered products
  const filteredProducts = useMemo(() => 
    selectedCategory === "All" 
      ? allProducts 
      : allProducts.filter(product => product.category === selectedCategory),
    [selectedCategory]
  );

  // Optimized scroll function with requestAnimationFrame
  const smoothScrollTo = useCallback((targetY: number) => {
    const startY = window.pageYOffset;
    const distance = targetY - startY;
    const duration = 800;
    let start: number;

    const step = (timestamp: number) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const ease = 0.5 - Math.cos(progress * Math.PI) / 2; // easeInOutSine
      window.scrollTo(0, startY + distance * ease);
      
      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };

    requestAnimationFrame(step);
  }, []);

  // Optimized category scroll
  const scrollToCategory = useCallback((category: string) => {
    setIsLoading(true);
    setSelectedCategory(category);
    
    // Use requestAnimationFrame for smooth UI updates
    requestAnimationFrame(() => {
      const productsSection = document.getElementById('products-section');
      if (productsSection) {
        const offset = 100;
        const elementPosition = productsSection.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;
        smoothScrollTo(offsetPosition);
      }
      setIsLoading(false);
    });
  }, [smoothScrollTo]);

  const seoData = {
    title: "YSeven Foods Premium Products - Master Product Catalog | One Brand. Endless Flavor.",
    description: "Discover YSeven Foods' comprehensive range of premium sauces, condiments, and agro products. From classic tomato ketchup to exotic international sauces and nutritious fruit powders.",
    keywords: "YSeven Foods, premium condiments, tomato ketchup, mayonnaise, chili sauce, banana powder, fruit powders, agro products",
    canonical: "/products",
    ogTitle: "YSeven Foods Premium Products - Master Product Catalog",
    ogDescription: "Discover YSeven Foods' comprehensive range of premium sauces, condiments, and agro products. From classic tomato ketchup to exotic international sauces and nutritious fruit powders.",
    twitterTitle: "YSeven Foods Premium Products - Master Product Catalog",
    twitterDescription: "Discover YSeven Foods' comprehensive range of premium sauces, condiments, and agro products."
  };

  return (
    <>
      <SEOHead seo={seoData} />

      {/* Individual Products Section */}
      <section className="pt-20 pb-12 lg:pb-16 bg-obsidian">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <h2 className="text-section-title mb-6">
              Master <span className="text-gradient-gold">Product Catalog</span>
            </h2>
          </div>

          {/* Category Filter Section */}
          <div className="mb-16">
            <div className="flex items-center justify-center mb-8">
              <Filter className="w-5 h-5 text-gold mr-2" />
              <h3 className="text-nav font-body-semibold text-cream">Filter by Category</h3>
            </div>
            
            {/* Category Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {categories.slice(1).map((category) => {
                const categoryProducts = allProducts.filter(p => p.category === category);
                const firstProduct = categoryProducts[0];
                const categoryImage = firstProduct?.image;
                const categorySlug = categorySlugMap[category];
                
                return (
                  <Link
                    key={category}
                    to={categorySlug ? `/category/${categorySlug}` : '#'}
                    className="relative overflow-hidden rounded-lg border cursor-pointer transition-all duration-300 group block border-gold/20 hover:border-gold/40"
                  >
                    <div className="w-full h-64 overflow-hidden">
                      <OptimizedImage
                        src={categoryImage}
                        alt={category}
                        className="w-full h-full"
                        hasVideo={firstProduct?.name === "Tomato Ketchup"}
                        videoSrc={firstProduct?.name === "Tomato Ketchup" ? tomatoKetchupVideo : null}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-obsidian/80 via-obsidian/20 to-transparent" />
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h4 className="font-body-semibold text-cream text-sm mb-1">{category}</h4>
                      <p className="text-cream/60 text-xs">
                        {categoryProducts.length} product{categoryProducts.length !== 1 ? 's' : ''}
                      </p>
                      {categorySlug && (
                        <div className="mt-2 flex items-center text-gold text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                          <span>View Collection</span>
                          <ArrowRight className="w-3 h-3 ml-1" />
                        </div>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
            
            {/* Filter Buttons */}
            <div className="flex flex-wrap justify-center gap-3">
              {categories.map((category) => {
                const categorySlug = categorySlugMap[category];
                const isAll = category === "All";
                
                if (isAll) {
                  return (
                    <Button
                      key={category}
                      variant={selectedCategory === category ? "default" : "outline"}
                      onClick={() => scrollToCategory(category)}
                      disabled={isLoading}
                      className={`
                        ${selectedCategory === category 
                          ? "bg-gold text-obsidian hover:bg-gold/90" 
                          : "border-gold/30 text-gold hover:bg-gold/10"
                        }
                        transition-all duration-300
                      `}
                    >
                      {isLoading && selectedCategory === category ? (
                        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                      ) : null}
                      {category}
                      <Badge 
                        variant="secondary" 
                        className="ml-2 bg-obsidian/20 text-xs"
                      >
                        {allProducts.length}
                      </Badge>
                    </Button>
                  );
                }
                
                return categorySlug ? (
                  <Link key={category} to={`/category/${categorySlug}`}>
                    <Button
                      variant="outline"
                      className="border-gold/30 text-gold hover:bg-gold/10 transition-all duration-300 group"
                    >
                      {category}
                      <Badge 
                        variant="secondary" 
                        className="ml-2 bg-obsidian/20 text-xs"
                      >
                        {allProducts.filter(p => p.category === category).length}
                      </Badge>
                      <ArrowRight className="w-3 h-3 ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Button>
                  </Link>
                ) : (
                  <Button
                    key={category}
                    variant="outline"
                    onClick={() => scrollToCategory(category)}
                    disabled={isLoading}
                    className="border-gold/30 text-gold hover:bg-gold/10 transition-all duration-300"
                  >
                    {category}
                    <Badge 
                      variant="secondary" 
                      className="ml-2 bg-obsidian/20 text-xs"
                    >
                      {allProducts.filter(p => p.category === category).length}
                    </Badge>
                  </Button>
                );
              })}
            </div>

            {/* Results Count */}
            <div className="text-center mt-6">
              <p className="text-cream/60">
                Showing {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} 
                {selectedCategory !== "All" && ` in "${selectedCategory}"`}
              </p>
            </div>
          </div>

          {/* Individual Product Cards */}
          <div id="products-section">
            {filteredProducts.length > 0 ? (
              <div className="space-y-24">
                {filteredProducts.map((product, index) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    index={index}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="max-w-md mx-auto">
                  <Filter className="w-16 h-16 text-gold/30 mx-auto mb-6" />
                  <h3 className="text-section-title mb-4">
                    No Products Found
                  </h3>
                  <p className="text-body-large mb-6">
                    No products available in the "{selectedCategory}" category at the moment.
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => scrollToCategory("All")}
                    className="border-gold/30 text-gold hover:bg-gold/10"
                  >
                    View All Products
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 lg:py-16 bg-gradient-section">
        <div className="container mx-auto px-6 lg:px-12 text-center">
          <h2 className="text-section-title mb-6">
            Interested in <span className="text-gradient-gold">Bulk Orders?</span>
          </h2>
          <p className="text-body-large max-w-2xl mx-auto mb-10">
            Partner with Y7 for your restaurant, hotel, or retail business. 
            Premium pricing for premium partners.
          </p>
          <Link to="/bulk-orders">
            <Button variant="gold" size="lg">
              Request B2B Pricing
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </section>
    </>
  );
};

export default Products;
