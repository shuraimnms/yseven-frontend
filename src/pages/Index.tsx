import { Link } from "react-router-dom";
import { ArrowRight, Play, ChefHat, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import SEOHead from "@/components/SEOHead";
import { pageSEO, seoConfig, generateFAQSchema } from "@/lib/seo";
import heroImage from "@/assets/hero-sauce.jpg";
import sauceClassic from "@/assets/sauce-classic.jpg";
import sauceSpicy from "@/assets/sauce-spicy.jpg";
import sauceInternational from "@/assets/sauce-international.jpg";
import sauceCreamy from "@/assets/sauce-creamy.jpg";
import SauceDrops from "@/components/home/SauceDrops";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import StatsSection from "@/components/home/StatsSection";
import FeaturesSection from "@/components/home/FeaturesSection";
import NewsletterSection from "@/components/home/NewsletterSection";
import InstagramSection from "@/components/home/InstagramSection";

const HeroSection = () => (
  <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
    {/* Animated Sauce Drops */}
    <SauceDrops />
    
    {/* Background Image with Overlay */}
    <div className="absolute inset-0">
      <img
        src={heroImage}
        alt="Y7 Premium Sauce"
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-obsidian/70 via-obsidian/50 to-obsidian" />
      <div className="absolute inset-0 bg-gradient-to-r from-obsidian/80 via-transparent to-obsidian/80" />
    </div>

    {/* Animated background elements */}
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <div className="absolute top-1/4 left-10 w-2 h-2 bg-gold/30 rounded-full animate-pulse" />
      <div className="absolute top-1/3 right-20 w-3 h-3 bg-gold/20 rounded-full animate-float" />
      <div className="absolute bottom-1/3 left-1/4 w-1.5 h-1.5 bg-deep-red/40 rounded-full animate-pulse" style={{ animationDelay: "1s" }} />
      <div className="absolute top-1/2 right-1/3 w-2 h-2 bg-gold/25 rounded-full animate-float" style={{ animationDelay: "2s" }} />
    </div>

    {/* Content */}
    <div className="relative z-10 container mx-auto px-6 lg:px-12 text-center">
      <div className="max-w-5xl mx-auto">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-gold/30 bg-gold/10 mb-8 animate-slide-up">
          <Sparkles className="w-4 h-4 text-gold" />
          <span className="text-gold text-sm tracking-wide">Premium Global Sauce Brand</span>
        </div>

        <h1 className="font-display text-5xl sm:text-6xl lg:text-8xl xl:text-9xl font-bold text-cream mb-6 leading-tight animate-slide-up" style={{ animationDelay: "0.1s" }}>
          One Brand.
          <br />
          <span className="text-gradient-gold relative">
            Endless Flavor.
            <span className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-gold/50 to-transparent" />
          </span>
        </h1>
        
        <p className="text-cream/70 text-lg sm:text-xl lg:text-2xl max-w-2xl mx-auto mb-12 font-light animate-slide-up" style={{ animationDelay: "0.2s" }}>
          Premium sauces crafted for bold kitchens worldwide. 
          Experience the art of flavor perfection.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: "0.3s" }}>
          <Link to="/shop">
            <Button variant="hero" size="hero" className="group relative overflow-hidden">
              <span className="relative z-10 flex items-center">
                Shop Now
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-gold to-gold-light opacity-0 group-hover:opacity-100 transition-opacity" />
            </Button>
          </Link>
          <Link to="/products">
            <Button variant="hero-outline" size="hero">
              Explore Our Range
            </Button>
          </Link>
        </div>

        {/* Trust badges */}
        <div className="flex flex-wrap items-center justify-center gap-8 mt-16 animate-slide-up" style={{ animationDelay: "0.4s" }}>
          <div className="flex items-center gap-2 text-cream/50">
            <ChefHat className="w-5 h-5" />
            <span className="text-sm">Chef Approved</span>
          </div>
          <div className="w-px h-4 bg-cream/20" />
          <div className="text-cream/50 text-sm">100% Natural</div>
          <div className="w-px h-4 bg-cream/20" />
          <div className="text-cream/50 text-sm">Global Shipping</div>
        </div>
      </div>
    </div>

    {/* Scroll Indicator */}
    <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-float">
      <div className="w-7 h-12 border-2 border-cream/30 rounded-full flex items-start justify-center p-2">
        <div className="w-1.5 h-3 bg-gold rounded-full animate-pulse" />
      </div>
      <p className="text-cream/40 text-xs mt-2 tracking-widest uppercase">Scroll</p>
    </div>
  </section>
);

const BrandStorySection = () => (
  <section className="py-24 lg:py-32 bg-gradient-section relative">
    {/* Decorative elements */}
    <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />
    
    <div className="container mx-auto px-6 lg:px-12">
      <div className="grid lg:grid-cols-2 gap-16 items-center">
        <div>
          <p className="text-gold text-sm tracking-[0.3em] uppercase mb-6">Our Story</p>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-cream mb-8 leading-tight">
            Redefining Flavor with <span className="text-gradient-gold">Innovation & Precision</span>
          </h2>
          <p className="text-cream/60 text-lg leading-relaxed mb-6">
            Y7 is a premium global sauce brand redefining flavor with innovation, 
            precision, and uncompromising quality. From kitchen staples to gourmet 
            creations, every bottle tells a story of culinary excellence.
          </p>
          <p className="text-cream/50 text-base leading-relaxed mb-8">
            Founded by passionate food enthusiasts, we source the finest ingredients 
            from around the world and blend them with cutting-edge techniques to create 
            sauces that elevate every dish.
          </p>
          <Link to="/about">
            <Button variant="gold-outline" size="lg">
              Discover Our Journey
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
        
        {/* Visual element */}
        <div className="relative">
          <div className="aspect-square rounded-2xl overflow-hidden border border-gold/20">
            <img
              src={sauceClassic}
              alt="Y7 Premium Sauce"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-obsidian/80 via-transparent to-transparent" />
          </div>
          {/* Floating accent */}
          <div className="absolute -bottom-6 -right-6 w-32 h-32 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center">
            <div className="text-center">
              <span className="block text-3xl font-display font-bold text-gold">25+</span>
              <span className="text-cream/60 text-xs">Unique Flavors</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const productRanges = [
  {
    name: "Classic Range",
    description: "Timeless flavors perfected over generations",
    image: sauceClassic,
    items: "8 Products",
  },
  {
    name: "Spicy Range",
    description: "Bold heat for the adventurous palate",
    image: sauceSpicy,
    items: "6 Products",
  },
  {
    name: "International Range",
    description: "World cuisines in every bottle",
    image: sauceInternational,
    items: "10 Products",
  },
  {
    name: "Creamy Range",
    description: "Rich indulgence meets artisan craft",
    image: sauceCreamy,
    items: "5 Products",
  },
];

const ProductRangeSection = () => (
  <section className="py-24 lg:py-32 bg-obsidian">
    <div className="container mx-auto px-6 lg:px-12">
      <div className="text-center mb-16">
        <p className="text-gold text-sm tracking-[0.3em] uppercase mb-4">Our Collection</p>
        <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-cream mb-4">
          Curated <span className="text-gradient-gold">Excellence</span>
        </h2>
        <p className="text-cream/50 max-w-2xl mx-auto">
          Explore our carefully crafted ranges, each designed to bring a unique 
          flavor experience to your culinary creations.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {productRanges.map((range, index) => (
          <Link
            to="/products"
            key={range.name}
            className="group relative overflow-hidden rounded-2xl bg-charcoal border border-gold/10 hover:border-gold/40 transition-all duration-500 transform hover:-translate-y-2"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="aspect-[4/5] overflow-hidden">
              <img
                src={range.image}
                alt={range.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/40 to-transparent" />
            </div>
            
            {/* Content overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <span className="inline-block px-3 py-1 text-xs text-gold bg-gold/10 rounded-full mb-3">
                {range.items}
              </span>
              <h3 className="font-display text-xl font-semibold text-cream mb-2 group-hover:text-gold transition-colors">
                {range.name}
              </h3>
              <p className="text-cream/50 text-sm">{range.description}</p>
            </div>

            {/* Hover arrow */}
            <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-gold/0 group-hover:bg-gold/20 flex items-center justify-center transition-all duration-300">
              <ArrowRight className="w-5 h-5 text-gold opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </Link>
        ))}
      </div>

      <div className="text-center mt-12">
        <Link to="/products">
          <Button variant="gold" size="lg">
            View All Products
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </Link>
      </div>
    </div>
  </section>
);

const recipes = [
  { name: "Spicy Garlic Mayo", tag: "Quick & Easy", time: "5 min" },
  { name: "Peri-Peri Mayo", tag: "Bold Heat", time: "10 min" },
  { name: "BBQ Mayo", tag: "Crowd Favorite", time: "8 min" },
  { name: "Sriracha Ranch", tag: "Fusion", time: "5 min" },
];

const RecipePreviewSection = () => (
  <section className="py-24 lg:py-32 bg-gradient-section relative overflow-hidden">
    {/* Decorative Elements */}
    <div className="absolute top-0 right-0 w-96 h-96 bg-gold/5 rounded-full blur-3xl" />
    <div className="absolute bottom-0 left-0 w-96 h-96 bg-deep-red/5 rounded-full blur-3xl" />

    <div className="container mx-auto px-6 lg:px-12 relative z-10">
      <div className="grid lg:grid-cols-2 gap-16 items-center">
        <div>
          <p className="text-gold text-sm tracking-[0.3em] uppercase mb-4">Recipe Ideas</p>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-cream mb-6">
            Elevate Your <span className="text-gradient-gold">Culinary Art</span>
          </h2>
          <p className="text-cream/60 text-lg leading-relaxed mb-8">
            Discover gourmet recipes crafted by world-class chefs, 
            designed to unlock the full potential of Y7 sauces. From quick 
            weeknight dinners to impressive dinner party dishes.
          </p>
          <Link to="/blog">
            <Button variant="gold-outline" size="lg">
              Explore Recipes
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>

        <div className="space-y-4">
          {recipes.map((recipe, index) => (
            <div
              key={recipe.name}
              className="group flex items-center justify-between p-5 bg-charcoal/50 border border-gold/10 rounded-xl hover:border-gold/30 hover:bg-charcoal transition-all duration-300 cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-gold/10 flex items-center justify-center group-hover:bg-gold/20 transition-colors">
                  <Play className="w-5 h-5 text-gold" />
                </div>
                <div>
                  <h4 className="font-display text-lg font-semibold text-cream group-hover:text-gold transition-colors">
                    {recipe.name}
                  </h4>
                  <div className="flex items-center gap-3 text-cream/50 text-sm">
                    <span>{recipe.tag}</span>
                    <span className="w-1 h-1 bg-cream/30 rounded-full" />
                    <span>{recipe.time}</span>
                  </div>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-gold opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

const FinalCTASection = () => (
  <section className="py-24 lg:py-40 bg-obsidian relative overflow-hidden">
    {/* Background Pattern */}
    <div className="absolute inset-0 opacity-5">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] border border-gold rounded-full animate-pulse-ring" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] border border-gold rounded-full animate-pulse-ring" style={{ animationDelay: "0.5s" }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-gold rounded-full animate-pulse-ring" style={{ animationDelay: "1s" }} />
    </div>

    {/* Gradient overlay */}
    <div className="absolute inset-0 bg-gradient-to-b from-obsidian via-transparent to-obsidian" />

    <div className="container mx-auto px-6 lg:px-12 relative z-10">
      <div className="max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-gold/30 bg-gold/10 mb-8">
          <span className="text-gold text-sm">Ready to Transform Your Kitchen?</span>
        </div>
        
        <h2 className="font-display text-4xl sm:text-5xl lg:text-7xl font-bold text-cream mb-6">
          Taste the <span className="text-gradient-gold">Difference</span>
        </h2>
        <p className="text-cream/60 text-xl max-w-2xl mx-auto mb-12">
          Join thousands of culinary enthusiasts who've discovered the Y7 difference. 
          Premium flavor awaits.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/shop">
            <Button variant="hero" size="hero" className="glow-gold">
              Shop Now
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
          <Link to="/contact">
            <Button variant="hero-outline" size="hero">
              Get In Touch
            </Button>
          </Link>
        </div>
      </div>
    </div>
  </section>
);

const Index = () => {
  // FAQ Schema for homepage
  const homepageFAQs = [
    {
      question: "What makes Y7 sauces premium quality?",
      answer: "Y7 sauces are crafted with premium ingredients sourced globally, undergo rigorous quality control, and are produced in small batches to ensure consistent flavor and quality in every bottle."
    },
    {
      question: "Do you ship internationally?",
      answer: "Yes, we ship Y7 sauces worldwide to over 25 countries including India, Middle East, UK, USA, and Southeast Asia with fast and secure delivery."
    },
    {
      question: "Are Y7 sauces suitable for restaurants and bulk orders?",
      answer: "Absolutely! We supply premium sauces to restaurants, hotels, and food service businesses with bulk ordering options and competitive wholesale pricing."
    },
    {
      question: "What sauce varieties does Y7 offer?",
      answer: "Y7 offers over 25 premium sauce varieties including peri-peri, sambal, mayonnaise, hot sauces, BBQ sauces, and international condiments across our Classic, Spicy, International, and Creamy ranges."
    }
  ];

  const faqSchema = generateFAQSchema(homepageFAQs);

  return (
    <>
      <SEOHead 
        seo={pageSEO.home} 
        schema={[faqSchema, seoConfig.schema.organization]}
      />
      <HeroSection />
      <StatsSection />
      <BrandStorySection />
      <FeaturesSection />
      <ProductRangeSection />
      <TestimonialsSection />
      <RecipePreviewSection />
      <NewsletterSection />
      <FinalCTASection />
      <InstagramSection />
    </>
  );
};

export default Index;
