import { useState } from "react";
import { ArrowRight, Clock, User, Play, ChefHat, Globe, Heart, Flame, Star, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import SEOHead from "@/components/SEOHead";
import { pageSEO, generateFAQSchema, generateBreadcrumbSchema } from "@/lib/seo";
import heroImage from "@/assets/hero-sauce.jpg";
import sauceSpicy from "@/assets/sauce-spicy.jpg";
import sauceInternational from "@/assets/sauce-international.jpg";
import sauceClassic from "@/assets/sauce-classic.jpg";
import sauceCreamy from "@/assets/sauce-creamy.jpg";

// Featured Gourmet Recipes
const featuredRecipes = [
  {
    id: 1,
    name: "Peri-Peri Glazed Salmon",
    image: sauceSpicy,
    cookingTime: "25 min",
    spiceLevel: "medium",
    sauce: "Peri-Peri",
    difficulty: "intermediate",
    chef: "Marcus Chen"
  },
  {
    id: 2,
    name: "Sambal Beef Rendang",
    image: sauceInternational,
    cookingTime: "2h 30min",
    spiceLevel: "hot",
    sauce: "Sambal",
    difficulty: "advanced",
    chef: "Sari Dewi"
  },
  {
    id: 3,
    name: "Truffle Cheese Risotto",
    image: sauceCreamy,
    cookingTime: "35 min",
    spiceLevel: "mild",
    sauce: "Cheese",
    difficulty: "intermediate",
    chef: "Giovanni Rossi"
  },
  {
    id: 4,
    name: "BBQ Glazed Wagyu",
    image: sauceClassic,
    cookingTime: "45 min",
    spiceLevel: "medium",
    sauce: "BBQ",
    difficulty: "advanced",
    chef: "James Mitchell"
  },
  {
    id: 5,
    name: "Spicy Mayo Tuna Tataki",
    image: heroImage,
    cookingTime: "20 min",
    spiceLevel: "medium",
    sauce: "Spicy Mayo",
    difficulty: "intermediate",
    chef: "Yuki Tanaka"
  },
  {
    id: 6,
    name: "Peri-Peri Chicken Tacos",
    image: sauceSpicy,
    cookingTime: "30 min",
    spiceLevel: "hot",
    sauce: "Peri-Peri",
    difficulty: "beginner",
    chef: "Maria Santos"
  }
];

// Blog Categories
const blogCategories = [
  { name: "Sauce Recipes", icon: ChefHat, count: 47 },
  { name: "Chef Tips", icon: Star, count: 23 },
  { name: "International Flavors", icon: Globe, count: 31 },
  { name: "Healthy Cooking", icon: Heart, count: 19 },
  { name: "Street Food Classics", icon: Flame, count: 28 },
  { name: "Gourmet Creations", icon: Star, count: 15 }
];

// Latest Blog Posts
const blogPosts = [
  {
    title: "7 Gourmet Ways to Use Peri-Peri Sauce",
    excerpt: "From marinades to finishing touches, discover how Michelin-starred chefs elevate dishes with our signature peri-peri blend.",
    image: sauceSpicy,
    author: "Chef Marcus Chen",
    readTime: "6 min read",
    category: "Chef Tips",
    featured: true,
  },
  {
    title: "The Science Behind Perfect Cheese Sauce",
    excerpt: "Understanding emulsification, temperature control, and ingredient ratios for restaurant-quality cheese sauces every time.",
    image: sauceCreamy,
    author: "Dr. Sarah Williams",
    readTime: "8 min read",
    category: "Technique",
    featured: true,
  },
  {
    title: "Street Food Classics Reinvented with Sambal",
    excerpt: "How traditional Indonesian sambal transforms global street food into gourmet experiences worth queuing for.",
    image: sauceInternational,
    author: "Sari Dewi",
    readTime: "5 min read",
    category: "International",
    featured: true,
  },
  {
    title: "How to Balance Heat and Flavor in Sauces",
    excerpt: "The culinary science of capsaicin, umami, and acid balance that separates amateur from professional sauce craft.",
    image: heroImage,
    author: "James Mitchell",
    readTime: "7 min read",
    category: "Science",
    featured: false,
  },
  {
    title: "Molecular Gastronomy Meets Classic BBQ",
    excerpt: "Spherification, gelification, and modern techniques that transform traditional BBQ sauce into avant-garde cuisine.",
    image: sauceClassic,
    author: "Dr. Elena Rodriguez",
    readTime: "9 min read",
    category: "Innovation",
    featured: false,
  },
  {
    title: "The Umami Revolution: Beyond Salt and Sweet",
    excerpt: "How Y7's fermentation process creates complex flavor profiles that rival century-old Asian condiment traditions.",
    image: sauceSpicy,
    author: "Kenji Nakamura",
    readTime: "6 min read",
    category: "Science",
    featured: false,
  }
];

// Recipe Videos
const recipeVideos = [
  {
    id: 1,
    title: "Perfect Peri-Peri Marinade Technique",
    thumbnail: sauceSpicy,
    duration: "3:24"
  },
  {
    id: 2,
    title: "Sambal Tempering Method",
    thumbnail: sauceInternational,
    duration: "2:47"
  },
  {
    id: 3,
    title: "Cheese Sauce Emulsification",
    thumbnail: sauceCreamy,
    duration: "4:12"
  }
];

const Blog = () => {
  const [email, setEmail] = useState("");
  const featuredPosts = blogPosts.filter((post) => post.featured);
  const regularPosts = blogPosts.filter((post) => !post.featured);

  // Blog FAQs for schema
  const blogFAQs = [
    {
      question: "How often does Y7 publish new recipes and cooking tips?",
      answer: "Y7 publishes new gourmet recipes, chef tips, and cooking techniques weekly, featuring expert content from professional chefs and culinary scientists to help you master premium sauce cooking."
    },
    {
      question: "Are Y7 recipes suitable for home cooks or just professionals?",
      answer: "Our recipes cater to all skill levels, from beginner-friendly 15-minute sauces to advanced molecular gastronomy techniques. Each recipe includes difficulty level, prep time, and detailed instructions."
    },
    {
      question: "Can I submit my own sauce recipes to Y7's blog?",
      answer: "Yes! We welcome recipe submissions from our community. Contact us with your Y7 sauce creations and cooking innovations - we feature the best community recipes in our monthly chef spotlight."
    },
    {
      question: "Do you provide nutritional information for your recipes?",
      answer: "All Y7 recipes include detailed nutritional information, dietary considerations (vegan, gluten-free, keto), and ingredient substitution suggestions to accommodate various dietary needs."
    }
  ];

  // Breadcrumb schema
  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Blog & Recipes', url: '/blog' }
  ];

  const faqSchema = generateFAQSchema(blogFAQs);
  const breadcrumbSchema = generateBreadcrumbSchema(breadcrumbs);

  const getSpiceLevelColor = (level: string) => {
    switch (level) {
      case 'mild': return 'text-green-400';
      case 'medium': return 'text-yellow-400';
      case 'hot': return 'text-red-400';
      default: return 'text-cream';
    }
  };

  const getSpiceLevelIcon = (level: string) => {
    switch (level) {
      case 'mild': return '🌿';
      case 'medium': return '🌶️';
      case 'hot': return '🔥';
      default: return '🌶️';
    }
  };

  return (
    <>
      <SEOHead 
        seo={pageSEO.blog} 
        schema={[faqSchema, breadcrumbSchema]}
      />
      {/* 1️⃣ HERO SECTION - Cinematic */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Video Simulation */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-obsidian/80 via-obsidian/60 to-obsidian/90 z-10" />
          <img 
            src={heroImage} 
            alt="Cinematic sauce pour"
            className="w-full h-full object-cover scale-110 animate-pulse"
          />
        </div>
        
        {/* Hero Content */}
        <div className="relative z-20 text-center px-6 lg:px-12 max-w-6xl mx-auto">
          <h1 className="font-display text-5xl sm:text-6xl lg:text-8xl font-bold text-cream mb-8 leading-tight">
            Where Flavor Meets <span className="text-gradient-gold">Mastery</span>
          </h1>
          <p className="text-cream/80 text-xl lg:text-2xl max-w-4xl mx-auto mb-12 leading-relaxed">
            Discover gourmet recipes, expert cooking tips, and bold sauce inspirations 
            crafted for serious food lovers.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button variant="gold" size="lg" className="text-lg px-8 py-4">
              Explore Recipes
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button variant="gold-outline" size="lg" className="text-lg px-8 py-4">
              Shop Premium Sauces
            </Button>
          </div>
        </div>
        
        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
          <div className="w-6 h-10 border-2 border-gold/50 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-gold rounded-full mt-2 animate-bounce" />
          </div>
        </div>
      </section>

      {/* 2️⃣ FEATURED RECIPES - Visual First */}
      <section className="py-24 lg:py-32 bg-gradient-to-b from-obsidian to-charcoal">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <p className="text-gold text-sm tracking-[0.3em] uppercase mb-4">Curated by Master Chefs</p>
            <h2 className="font-display text-4xl lg:text-6xl font-bold text-cream mb-6">
              Featured Gourmet <span className="text-gradient-gold">Recipes</span>
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredRecipes.map((recipe) => (
              <div
                key={recipe.id}
                className="group relative overflow-hidden rounded-2xl bg-charcoal border border-gold/20 hover:border-gold/50 transition-all duration-700 hover:scale-105 hover:shadow-2xl hover:shadow-gold/20"
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={recipe.image}
                    alt={recipe.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-transparent to-transparent opacity-80" />
                </div>
                
                {/* Recipe Info Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Badge variant="secondary" className="bg-gold/20 text-gold border-gold/30">
                      {recipe.sauce}
                    </Badge>
                    <span className={`text-sm ${getSpiceLevelColor(recipe.spiceLevel)}`}>
                      {getSpiceLevelIcon(recipe.spiceLevel)} {recipe.spiceLevel}
                    </span>
                  </div>
                  
                  <h3 className="font-display text-xl font-semibold text-cream mb-2 group-hover:text-gold transition-colors">
                    {recipe.name}
                  </h3>
                  
                  <div className="flex items-center justify-between text-cream/60 text-sm">
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {recipe.cookingTime}
                    </span>
                    <span className="flex items-center gap-1">
                      <ChefHat className="w-4 h-4" />
                      {recipe.chef}
                    </span>
                  </div>
                </div>
                
                {/* Hover CTA */}
                <div className="absolute inset-0 bg-obsidian/90 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                  <Button variant="gold" size="lg">
                    View Recipe
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3️⃣ BLOG CATEGORIES - SEO Silos */}
      <section className="py-24 lg:py-32 bg-charcoal">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl lg:text-5xl font-bold text-cream mb-6">
              Explore by <span className="text-gradient-gold">Flavor Category</span>
            </h2>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogCategories.map((category) => {
              const IconComponent = category.icon;
              return (
                <div
                  key={category.name}
                  className="group p-8 bg-obsidian border border-gold/20 rounded-xl hover:border-gold/50 transition-all duration-500 hover:scale-105 cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-4">
                    <IconComponent className="w-8 h-8 text-gold group-hover:scale-110 transition-transform" />
                    <span className="text-cream/60 text-sm">{category.count} articles</span>
                  </div>
                  <h3 className="font-display text-xl font-semibold text-cream group-hover:text-gold transition-colors">
                    {category.name}
                  </h3>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4️⃣ AUTHORITY CONTENT BLOCK */}
      <section className="py-24 lg:py-32 bg-gradient-to-r from-obsidian via-charcoal to-obsidian">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="font-display text-4xl lg:text-5xl font-bold text-cream mb-8">
              At Y7, we believe flavor is an <span className="text-gradient-gold">art form</span>
            </h2>
            <div className="text-cream/80 text-lg lg:text-xl leading-relaxed space-y-6">
              <p>
                Our Blog & Recipes hub is curated by chefs, food scientists, and culinary creators 
                to help you transform everyday meals into gourmet experiences.
              </p>
              <p>
                From bold peri-peri marinades to creamy cheese sauces and fiery sambal creations, 
                every recipe is crafted to showcase the full power of Y7 sauces.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5️⃣ LATEST BLOG POSTS - Editorial Style */}
      <section className="py-24 lg:py-32 bg-obsidian">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <p className="text-gold text-sm tracking-[0.3em] uppercase mb-4">Editorial</p>
            <h2 className="font-display text-4xl lg:text-5xl font-bold text-cream mb-6">
              Latest <span className="text-gradient-gold">Culinary Insights</span>
            </h2>
          </div>
          
          {/* Featured Posts Grid */}
          <div className="grid lg:grid-cols-3 gap-8 mb-16">
            {featuredPosts.map((post, index) => (
              <article
                key={post.title}
                className={`group relative overflow-hidden rounded-2xl bg-charcoal border border-gold/20 hover:border-gold/50 transition-all duration-700 ${
                  index === 0 ? "lg:col-span-2 lg:row-span-2" : ""
                }`}
              >
                <div className={`${index === 0 ? "aspect-[16/10] lg:aspect-auto lg:h-full" : "aspect-[4/3]"} overflow-hidden`}>
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/40 to-transparent" />
                </div>
                
                <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-8">
                  <Badge variant="secondary" className="bg-gold/20 text-gold border-gold/30 mb-4">
                    {post.category}
                  </Badge>
                  <h3 className={`font-display font-semibold text-cream mb-3 group-hover:text-gold transition-colors ${
                    index === 0 ? "text-2xl lg:text-3xl" : "text-xl"
                  }`}>
                    {post.title}
                  </h3>
                  <p className="text-cream/70 text-sm mb-4 line-clamp-2">{post.excerpt}</p>
                  <div className="flex items-center gap-4 text-cream/50 text-xs">
                    <span className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      {post.author}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {post.readTime}
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
          
          {/* Regular Posts */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {regularPosts.map((post) => (
              <article
                key={post.title}
                className="group relative overflow-hidden rounded-xl bg-charcoal border border-gold/20 hover:border-gold/50 transition-all duration-500"
              >
                <div className="aspect-video overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="p-6">
                  <Badge variant="secondary" className="bg-gold/10 text-gold border-gold/20 mb-4">
                    {post.category}
                  </Badge>
                  <h3 className="font-display text-lg font-semibold text-cream mb-3 group-hover:text-gold transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-cream/60 text-sm mb-4 line-clamp-2">{post.excerpt}</p>
                  <div className="flex items-center gap-4 text-cream/50 text-xs">
                    <span className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      {post.author}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {post.readTime}
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 6️⃣ RECIPE VIDEO SECTION */}
      <section className="py-24 lg:py-32 bg-gradient-to-b from-charcoal to-obsidian">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl lg:text-5xl font-bold text-cream mb-6">
              Watch. Cook. <span className="text-gradient-gold">Master Flavor.</span>
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {recipeVideos.map((video) => (
              <div
                key={video.id}
                className="group relative overflow-hidden rounded-xl bg-charcoal border border-gold/20 hover:border-gold/50 transition-all duration-500 cursor-pointer"
              >
                <div className="aspect-video overflow-hidden relative">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-obsidian/40 group-hover:bg-obsidian/20 transition-colors" />
                  
                  {/* Play Button */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 bg-gold/90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Play className="w-6 h-6 text-obsidian ml-1" fill="currentColor" />
                    </div>
                  </div>
                  
                  {/* Duration */}
                  <div className="absolute bottom-4 right-4 bg-obsidian/80 px-2 py-1 rounded text-cream text-sm">
                    {video.duration}
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="font-display text-lg font-semibold text-cream group-hover:text-gold transition-colors">
                    {video.title}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7️⃣ SEO CONTENT BLOCK */}
      <section className="py-24 lg:py-32 bg-obsidian">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-display text-3xl lg:text-4xl font-bold text-cream mb-8 text-center">
              The Science of <span className="text-gradient-gold">Premium Sauces</span>
            </h2>
            <div className="text-cream/80 text-lg leading-relaxed space-y-6">
              <p>
                Premium sauces represent the pinnacle of culinary craftsmanship, where traditional techniques meet modern food science. 
                Our peri peri sauce recipes showcase the complex interplay of African bird's eye chilies, aromatic herbs, and carefully 
                balanced acidity that creates the perfect heat-to-flavor ratio demanded by professional kitchens worldwide.
              </p>
              <p>
                Sambal sauce uses, rooted in centuries-old Indonesian fermentation methods, demonstrate how controlled microbial activity 
                develops umami compounds that rival the best cheese sauce formulations. The best cheese sauce achieves its silky texture 
                through precise temperature control and emulsification techniques that our culinary team has perfected over decades of 
                research and development.
              </p>
              <p>
                Gourmet condiments like our signature BBQ blends incorporate molecular gastronomy principles, utilizing natural enzymes 
                and pH manipulation to create complex flavor profiles. These international sauces bridge cultural culinary traditions 
                with contemporary cooking methods, offering both home cooks and professional chefs the tools to create restaurant-quality 
                dishes that celebrate global flavor heritage while pushing the boundaries of modern cuisine.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 8️⃣ EMAIL CAPTURE CTA */}
      <section className="py-24 lg:py-32 bg-gradient-to-r from-charcoal via-obsidian to-charcoal">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="font-display text-4xl lg:text-5xl font-bold text-cream mb-6">
              Get Flavor Delivered to <span className="text-gradient-gold">Your Inbox</span>
            </h2>
            <p className="text-cream/70 text-lg mb-8">
              Weekly gourmet recipes, chef tips, and exclusive sauce offers.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <div className="flex-1">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full px-6 py-4 bg-charcoal border border-gold/30 rounded-lg text-cream placeholder-cream/50 focus:border-gold focus:outline-none"
                />
              </div>
              <Button variant="gold" size="lg" className="px-8">
                <Mail className="w-4 h-4 mr-2" />
                Subscribe Now
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* 9️⃣ FINAL CONVERSION CTA */}
      <section className="py-24 lg:py-32 bg-obsidian">
        <div className="container mx-auto px-6 lg:px-12 text-center">
          <h2 className="font-display text-4xl lg:text-6xl font-bold text-cream mb-8">
            Ready to Elevate <span className="text-gradient-gold">Your Cooking?</span>
          </h2>
          <p className="text-cream/70 text-xl max-w-2xl mx-auto mb-12">
            Transform your kitchen into a gourmet laboratory with Y7's premium sauce collection.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button variant="gold" size="lg" className="text-lg px-10 py-4">
              Shop Y7 Sauces
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button variant="gold-outline" size="lg" className="text-lg px-10 py-4">
              Explore All Recipes
            </Button>
          </div>
        </div>
      </section>
    </>
  );
};

export default Blog;
