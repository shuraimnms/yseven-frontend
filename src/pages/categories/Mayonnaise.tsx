import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Heart, 
  Leaf, 
  Award, 
  Star, 
  ShoppingCart,
  ArrowRight,
  ChefHat,
  Sparkles,
  CheckCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import SEOHead from '@/components/SEOHead';
import { pageSEO, generateFAQSchema, generateBreadcrumbSchema } from '@/lib/seo';

// Mayonnaise products data
const mayonnaiseProducts = [
  {
    id: 1,
    name: 'Y7 Classic Mayonnaise',
    slug: 'classic-mayonnaise',
    description: 'Rich, creamy mayonnaise made with premium eggs and avocado oil for perfect texture',
    price: 199,
    originalPrice: 249,
    image: '/products/classic-mayo.jpg',
    type: 'Classic',
    base: 'Avocado Oil',
    rating: 4.9,
    reviews: 2847,
    bestseller: true,
    tags: ['Premium', 'Creamy', 'Versatile']
  },
  {
    id: 2,
    name: 'Y7 Garlic Aioli',
    slug: 'garlic-aioli',
    description: 'Gourmet garlic aioli with roasted garlic and herbs for elevated flavor',
    price: 229,
    originalPrice: 279,
    image: '/products/garlic-aioli.jpg',
    type: 'Flavored',
    base: 'Olive Oil',
    rating: 4.8,
    reviews: 1923,
    bestseller: true,
    tags: ['Gourmet', 'Garlicky', 'Restaurant Quality']
  },
  {
    id: 3,
    name: 'Y7 Truffle Mayo',
    slug: 'truffle-mayo',
    description: 'Luxury truffle mayonnaise with real truffle oil for gourmet experiences',
    price: 399,
    originalPrice: 499,
    image: '/products/truffle-mayo.jpg',
    type: 'Premium',
    base: 'Truffle Oil',
    rating: 4.7,
    reviews: 856,
    bestseller: false,
    tags: ['Luxury', 'Truffle', 'Gourmet']
  },
  {
    id: 4,
    name: 'Y7 Sriracha Mayo',
    slug: 'sriracha-mayo',
    description: 'Spicy sriracha mayonnaise with perfect heat balance for Asian fusion dishes',
    price: 249,
    originalPrice: 299,
    image: '/products/sriracha-mayo.jpg',
    type: 'Spicy',
    base: 'Sunflower Oil',
    rating: 4.8,
    reviews: 1654,
    bestseller: true,
    tags: ['Spicy', 'Asian Fusion', 'Balanced Heat']
  },
  {
    id: 5,
    name: 'Y7 Vegan Mayo',
    slug: 'vegan-mayo',
    description: 'Plant-based mayonnaise with aquafaba and organic ingredients, 100% vegan',
    price: 279,
    originalPrice: 329,
    image: '/products/vegan-mayo.jpg',
    type: 'Vegan',
    base: 'Aquafaba',
    rating: 4.6,
    reviews: 1247,
    bestseller: false,
    tags: ['Vegan', 'Plant-Based', 'Organic']
  },
  {
    id: 6,
    name: 'Y7 Chipotle Mayo',
    slug: 'chipotle-mayo',
    description: 'Smoky chipotle mayonnaise with authentic Mexican flavors and moderate heat',
    price: 259,
    originalPrice: 309,
    image: '/products/chipotle-mayo.jpg',
    type: 'Smoky',
    base: 'Avocado Oil',
    rating: 4.7,
    reviews: 1389,
    bestseller: false,
    tags: ['Smoky', 'Mexican', 'Authentic']
  }
];

export default function Mayonnaise() {
  // Mayonnaise FAQs for schema
  const mayonnaiseFAQs = [
    {
      question: "What makes Y7 mayonnaise different from regular mayonnaise?",
      answer: "Y7 mayonnaise is made with premium ingredients like avocado oil and organic eggs, contains no artificial preservatives, and offers gourmet flavor profiles that elevate any dish from ordinary to extraordinary."
    },
    {
      question: "Are Y7 mayonnaise products suitable for different dietary needs?",
      answer: "Yes! We offer vegan mayonnaise made with aquafaba, keto-friendly options with avocado oil, and organic varieties. All products are clearly labeled with dietary information and allergen warnings."
    },
    {
      question: "How should I store Y7 mayonnaise products?",
      answer: "Store unopened Y7 mayonnaise in a cool, dry place. After opening, refrigerate and use within 30 days for optimal freshness and flavor. Always use clean utensils to prevent contamination."
    },
    {
      question: "Can Y7 mayonnaise be used for cooking or just as a condiment?",
      answer: "Y7 mayonnaise is incredibly versatile - perfect as a condiment, sandwich spread, salad dressing base, marinade ingredient, and cooking component. Each variety includes suggested culinary applications and recipe ideas."
    }
  ];

  // Breadcrumb schema
  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Products', url: '/products' },
    { name: 'Mayonnaise', url: '/mayonnaise' }
  ];

  const faqSchema = generateFAQSchema(mayonnaiseFAQs);
  const breadcrumbSchema = generateBreadcrumbSchema(breadcrumbs);

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Classic': return 'text-blue-400';
      case 'Flavored': return 'text-green-400';
      case 'Premium': return 'text-yellow-400';
      case 'Spicy': return 'text-red-400';
      case 'Vegan': return 'text-purple-400';
      case 'Smoky': return 'text-orange-400';
      default: return 'text-gray-400';
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'Classic': return { label: 'Classic', color: 'bg-blue-500' };
      case 'Flavored': return { label: 'Flavored', color: 'bg-green-500' };
      case 'Premium': return { label: 'Premium', color: 'bg-yellow-500' };
      case 'Spicy': return { label: 'Spicy', color: 'bg-red-500' };
      case 'Vegan': return { label: 'Vegan', color: 'bg-purple-500' };
      case 'Smoky': return { label: 'Smoky', color: 'bg-orange-500' };
      default: return { label: type, color: 'bg-gray-500' };
    }
  };

  return (
    <>
      <SEOHead 
        seo={pageSEO.mayonnaise} 
        schema={[faqSchema, breadcrumbSchema]}
      />
      
      <div className="min-h-screen bg-black text-white">
        {/* Hero Section */}
        <section className="relative py-20 lg:py-32 bg-gradient-to-b from-yellow-900/20 to-black">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center max-w-4xl mx-auto"
            >
              <div className="flex items-center justify-center gap-2 mb-6">
                <Heart className="w-8 h-8 text-yellow-500" />
                <Badge className="bg-yellow-500 text-black text-sm px-4 py-2">
                  GOURMET MAYONNAISE COLLECTION
                </Badge>
                <Heart className="w-8 h-8 text-yellow-500" />
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                Gourmet Mayonnaise
                <br />
                <span className="text-yellow-500">Collection</span>
              </h1>
              
              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                From classic creamy to gourmet truffle, discover premium mayonnaise 
                made with the finest ingredients for culinary excellence.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold">
                  Shop Mayonnaise
                </Button>
                <Button size="lg" variant="outline" className="border-gray-600 text-white hover:bg-gray-800">
                  Recipe Ideas
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Quality Promise */}
        <section className="py-16 bg-gray-900">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold mb-4">
                Premium Quality Promise
              </h2>
              <p className="text-gray-300 max-w-2xl mx-auto">
                Every Y7 mayonnaise is crafted with premium ingredients and traditional methods 
                for superior taste and texture.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-4 gap-6">
              {[
                { icon: Leaf, title: 'Natural Ingredients', description: 'No artificial preservatives or additives' },
                { icon: Award, title: 'Premium Oils', description: 'Avocado, olive, and truffle oils' },
                { icon: CheckCircle, title: 'Quality Tested', description: 'Rigorous quality control standards' },
                { icon: Sparkles, title: 'Gourmet Flavors', description: 'Restaurant-quality taste profiles' }
              ].map((feature, index) => {
                const IconComponent = feature.icon;
                return (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <Card className="bg-black border-gray-800 text-center h-full">
                      <CardContent className="p-6">
                        <IconComponent className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                        <p className="text-gray-300 text-sm">{feature.description}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Products Grid */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold mb-4">
                Our Mayonnaise Collection
              </h2>
              <p className="text-gray-300 max-w-2xl mx-auto">
                From classic to gourmet, each mayonnaise is crafted for specific culinary 
                applications and flavor preferences.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {mayonnaiseProducts.map((product, index) => {
                const typeBadge = getTypeBadge(product.type);
                return (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <Card className="bg-gray-900 border-gray-800 hover:border-yellow-500 transition-colors h-full group">
                      <div className="relative">
                        <div className="aspect-square bg-gray-800 rounded-t-lg overflow-hidden">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        
                        {/* Badges */}
                        <div className="absolute top-4 left-4 flex flex-col gap-2">
                          {product.bestseller && (
                            <Badge className="bg-yellow-500 text-black">
                              <Star className="w-3 h-3 mr-1" />
                              Bestseller
                            </Badge>
                          )}
                          <Badge className={`${typeBadge.color} text-white`}>
                            {typeBadge.label}
                          </Badge>
                        </div>

                        {/* Base Oil */}
                        <div className="absolute top-4 right-4">
                          <Badge variant="outline" className="border-gray-600 text-gray-300">
                            <Leaf className="w-3 h-3 mr-1" />
                            {product.base}
                          </Badge>
                        </div>
                      </div>

                      <CardHeader className="pb-3">
                        <h3 className="text-xl font-semibold group-hover:text-yellow-500 transition-colors">
                          {product.name}
                        </h3>
                        <p className="text-gray-300 text-sm line-clamp-2">
                          {product.description}
                        </p>
                      </CardHeader>

                      <CardContent className="pt-0">
                        {/* Type */}
                        <div className="flex items-center gap-2 mb-3">
                          <Heart className="w-4 h-4 text-yellow-500" />
                          <span className={`text-sm font-medium ${getTypeColor(product.type)}`}>
                            {product.type} Mayo
                          </span>
                        </div>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-1 mb-4">
                          {product.tags.map(tag => (
                            <Badge key={tag} variant="outline" className="border-gray-600 text-gray-400 text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>

                        {/* Rating */}
                        <div className="flex items-center gap-2 mb-4">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < Math.floor(product.rating) 
                                    ? 'text-yellow-500 fill-current' 
                                    : 'text-gray-600'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-gray-400">
                            {product.rating} ({product.reviews} reviews)
                          </span>
                        </div>

                        {/* Price */}
                        <div className="flex items-center gap-2 mb-4">
                          <span className="text-2xl font-bold text-white">₹{product.price}</span>
                          <span className="text-lg text-gray-500 line-through">₹{product.originalPrice}</span>
                          <Badge className="bg-green-500 text-white text-xs">
                            Save ₹{product.originalPrice - product.price}
                          </Badge>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2">
                          <Button className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-black">
                            <ShoppingCart className="w-4 h-4 mr-2" />
                            Add to Cart
                          </Button>
                          <Link to={`/products/${product.slug}`}>
                            <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800">
                              <ArrowRight className="w-4 h-4" />
                            </Button>
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Usage Guide */}
        <section className="py-16 bg-gray-900">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <h2 className="text-3xl font-bold mb-6">
                  Culinary Applications for
                  <span className="text-yellow-500"> Every Dish</span>
                </h2>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-black font-bold text-sm">1</span>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Sandwich & Burger Spread</h3>
                      <p className="text-gray-300">Perfect base for gourmet sandwiches and burgers, adding richness and flavor depth.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-black font-bold text-sm">2</span>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Salad Dressing Base</h3>
                      <p className="text-gray-300">Mix with herbs, vinegar, or citrus to create custom salad dressings and marinades.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-black font-bold text-sm">3</span>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Cooking Ingredient</h3>
                      <p className="text-gray-300">Use in baking, as a marinade component, or to add richness to sauces and soups.</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="aspect-[4/3] rounded-2xl overflow-hidden">
                  <img
                    src="/mayonnaise-cooking.jpg"
                    alt="Cooking with mayonnaise"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-6 -left-6 bg-yellow-500 text-black p-6 rounded-lg">
                  <ChefHat className="w-8 h-8 mb-2" />
                  <div className="font-bold">Chef Approved</div>
                  <div className="text-sm opacity-90">Restaurant Quality</div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Recipe Ideas */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold mb-4">
                Recipe Inspiration
              </h2>
              <p className="text-gray-300 max-w-2xl mx-auto">
                Discover creative ways to use Y7 mayonnaise in your cooking with these 
                chef-approved recipe ideas.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  title: 'Truffle Mayo Deviled Eggs',
                  description: 'Elevate classic deviled eggs with our luxury truffle mayonnaise',
                  difficulty: 'Easy',
                  time: '15 min'
                },
                {
                  title: 'Sriracha Mayo Tuna Poke Bowl',
                  description: 'Asian fusion bowl with spicy sriracha mayo dressing',
                  difficulty: 'Medium',
                  time: '25 min'
                },
                {
                  title: 'Garlic Aioli Roasted Vegetables',
                  description: 'Roasted seasonal vegetables with gourmet garlic aioli',
                  difficulty: 'Easy',
                  time: '30 min'
                }
              ].map((recipe, index) => (
                <motion.div
                  key={recipe.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="bg-gray-900 border-gray-800 hover:border-yellow-500 transition-colors h-full group cursor-pointer">
                    <CardContent className="p-6">
                      <h3 className="text-lg font-semibold mb-3 group-hover:text-yellow-500 transition-colors">
                        {recipe.title}
                      </h3>
                      <p className="text-gray-300 text-sm mb-4">{recipe.description}</p>
                      <div className="flex items-center justify-between text-gray-400 text-sm">
                        <span>{recipe.difficulty}</span>
                        <span>{recipe.time}</span>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gray-900">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center max-w-2xl mx-auto"
            >
              <h2 className="text-3xl font-bold mb-4">
                Ready to Elevate Your Cooking?
              </h2>
              <p className="text-gray-300 mb-8">
                Discover the difference premium mayonnaise makes in your culinary creations. 
                From classic to gourmet, find your perfect match.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold">
                  Shop All Mayonnaise
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <Button size="lg" variant="outline" className="border-gray-600 text-white hover:bg-gray-800">
                  View Recipe Collection
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
}