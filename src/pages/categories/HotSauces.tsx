import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Flame, 
  Thermometer, 
  Award, 
  Star, 
  ShoppingCart,
  ArrowRight,
  ChefHat,
  Globe
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import SEOHead from '@/components/SEOHead';
import { pageSEO, generateFAQSchema, generateBreadcrumbSchema, generateProductSchema } from '@/lib/seo';

// Hot sauce products data
const hotSauceProducts = [
  {
    id: 1,
    name: 'Y7 Peri-Peri Sauce',
    slug: 'peri-peri-sauce',
    description: 'Authentic African bird\'s eye chili sauce with aromatic herbs and citrus notes',
    price: 299,
    originalPrice: 349,
    image: '/products/peri-peri.jpg',
    scoville: '50,000-100,000',
    origin: 'Mozambique',
    rating: 4.8,
    reviews: 1247,
    bestseller: true,
    tags: ['Authentic', 'Medium Heat', 'Citrusy']
  },
  {
    id: 2,
    name: 'Y7 Ghost Pepper Sauce',
    slug: 'ghost-pepper-sauce',
    description: 'Extreme heat sauce made with genuine Bhut jolokia peppers for serious spice lovers',
    price: 399,
    originalPrice: 449,
    image: '/products/ghost-pepper.jpg',
    scoville: '800,000-1,000,000',
    origin: 'India',
    rating: 4.6,
    reviews: 892,
    bestseller: false,
    tags: ['Extreme Heat', 'Smoky', 'Premium']
  },
  {
    id: 3,
    name: 'Y7 Sriracha Premium',
    slug: 'sriracha-premium',
    description: 'Gourmet sriracha with balanced heat, garlic depth, and subtle sweetness',
    price: 249,
    originalPrice: 299,
    image: '/products/sriracha.jpg',
    scoville: '2,500-5,000',
    origin: 'Thailand',
    rating: 4.9,
    reviews: 2156,
    bestseller: true,
    tags: ['Balanced', 'Garlicky', 'Versatile']
  },
  {
    id: 4,
    name: 'Y7 Habanero Fire',
    slug: 'habanero-fire',
    description: 'Fruity habanero sauce with tropical heat and complex flavor layers',
    price: 329,
    originalPrice: 379,
    image: '/products/habanero.jpg',
    scoville: '100,000-350,000',
    origin: 'Mexico',
    rating: 4.7,
    reviews: 743,
    bestseller: false,
    tags: ['Fruity', 'Hot', 'Complex']
  },
  {
    id: 5,
    name: 'Y7 Carolina Reaper',
    slug: 'carolina-reaper',
    description: 'World\'s hottest pepper sauce - use with extreme caution and respect',
    price: 499,
    originalPrice: 599,
    image: '/products/carolina-reaper.jpg',
    scoville: '2,200,000+',
    origin: 'USA',
    rating: 4.5,
    reviews: 456,
    bestseller: false,
    tags: ['World\'s Hottest', 'Extreme', 'Challenge']
  },
  {
    id: 6,
    name: 'Y7 Chipotle Smoke',
    slug: 'chipotle-smoke',
    description: 'Smoky chipotle sauce with deep, rich flavor and moderate heat',
    price: 279,
    originalPrice: 329,
    image: '/products/chipotle.jpg',
    scoville: '2,500-8,000',
    origin: 'Mexico',
    rating: 4.8,
    reviews: 1089,
    bestseller: true,
    tags: ['Smoky', 'Rich', 'BBQ Perfect']
  }
];

export default function HotSauces() {
  // Hot sauce FAQs for schema
  const hotSauceFAQs = [
    {
      question: "What makes Y7 hot sauces different from regular hot sauces?",
      answer: "Y7 hot sauces are crafted with premium ingredients, authentic pepper varieties, and traditional fermentation methods. Each sauce balances heat with complex flavor profiles, using no artificial preservatives or fillers."
    },
    {
      question: "How do I choose the right heat level for my taste?",
      answer: "Start with our Scoville heat guide: Mild (0-5,000 SHU) for beginners, Medium (5,000-30,000 SHU) for regular spice lovers, Hot (30,000-100,000 SHU) for experienced users, and Extreme (100,000+ SHU) for serious heat enthusiasts."
    },
    {
      question: "Are Y7 hot sauces suitable for cooking or just as condiments?",
      answer: "Y7 hot sauces are versatile - perfect as condiments, marinades, cooking ingredients, and flavor enhancers. Each sauce includes suggested uses and recipe pairings for maximum culinary impact."
    },
    {
      question: "Do you offer sample sizes for trying different heat levels?",
      answer: "Yes! We offer hot sauce sample packs and gift sets that let you explore different heat levels and flavor profiles before committing to full-size bottles."
    }
  ];

  // Breadcrumb schema
  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Products', url: '/products' },
    { name: 'Hot Sauces', url: '/hot-sauces' }
  ];

  const faqSchema = generateFAQSchema(hotSauceFAQs);
  const breadcrumbSchema = generateBreadcrumbSchema(breadcrumbs);

  const getHeatLevelColor = (scoville: string) => {
    const shu = parseInt(scoville.replace(/[^\d]/g, ''));
    if (shu < 5000) return 'text-green-400';
    if (shu < 30000) return 'text-yellow-400';
    if (shu < 100000) return 'text-orange-400';
    return 'text-red-400';
  };

  const getHeatLevelBadge = (scoville: string) => {
    const shu = parseInt(scoville.replace(/[^\d]/g, ''));
    if (shu < 5000) return { label: 'Mild', color: 'bg-green-500' };
    if (shu < 30000) return { label: 'Medium', color: 'bg-yellow-500' };
    if (shu < 100000) return { label: 'Hot', color: 'bg-orange-500' };
    return { label: 'Extreme', color: 'bg-red-500' };
  };

  return (
    <>
      <SEOHead 
        seo={pageSEO.hotSauces} 
        schema={[faqSchema, breadcrumbSchema]}
      />
      
      <div className="min-h-screen bg-black text-white">
        {/* Hero Section */}
        <section className="relative py-20 lg:py-32 bg-gradient-to-b from-red-900/20 to-black">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center max-w-4xl mx-auto"
            >
              <div className="flex items-center justify-center gap-2 mb-6">
                <Flame className="w-8 h-8 text-red-500" />
                <Badge className="bg-red-500 text-white text-sm px-4 py-2">
                  HOT SAUCE COLLECTION
                </Badge>
                <Flame className="w-8 h-8 text-red-500" />
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                Premium Hot Sauce
                <br />
                <span className="text-red-500">Collection</span>
              </h1>
              
              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                From mild peri-peri to scorching Carolina Reaper, discover authentic heat 
                with complex flavor profiles that elevate every dish.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-red-500 hover:bg-red-600 text-white font-semibold">
                  Shop Hot Sauces
                </Button>
                <Button size="lg" variant="outline" className="border-gray-600 text-white hover:bg-gray-800">
                  Heat Level Guide
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Heat Level Guide */}
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
                Scoville Heat Scale Guide
              </h2>
              <p className="text-gray-300 max-w-2xl mx-auto">
                Understanding heat levels helps you choose the perfect sauce for your palate and culinary needs.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-4 gap-6">
              {[
                { level: 'Mild', range: '0-5,000 SHU', color: 'bg-green-500', description: 'Perfect for beginners and everyday use' },
                { level: 'Medium', range: '5,000-30,000 SHU', color: 'bg-yellow-500', description: 'Noticeable heat with great flavor' },
                { level: 'Hot', range: '30,000-100,000 SHU', color: 'bg-orange-500', description: 'Serious heat for spice lovers' },
                { level: 'Extreme', range: '100,000+ SHU', color: 'bg-red-500', description: 'For extreme heat enthusiasts only' }
              ].map((heat, index) => (
                <motion.div
                  key={heat.level}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="bg-black border-gray-800 text-center h-full">
                    <CardContent className="p-6">
                      <div className={`w-12 h-12 ${heat.color} rounded-full mx-auto mb-4 flex items-center justify-center`}>
                        <Thermometer className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-xl font-semibold mb-2">{heat.level}</h3>
                      <p className="text-gray-400 text-sm mb-3">{heat.range}</p>
                      <p className="text-gray-300 text-sm">{heat.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
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
                Our Hot Sauce Collection
              </h2>
              <p className="text-gray-300 max-w-2xl mx-auto">
                Each sauce is crafted with authentic peppers and traditional methods for 
                maximum flavor and heat balance.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {hotSauceProducts.map((product, index) => {
                const heatBadge = getHeatLevelBadge(product.scoville);
                return (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <Card className="bg-gray-900 border-gray-800 hover:border-red-500 transition-colors h-full group">
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
                          <Badge className={`${heatBadge.color} text-white`}>
                            {heatBadge.label}
                          </Badge>
                        </div>

                        {/* Origin */}
                        <div className="absolute top-4 right-4">
                          <Badge variant="outline" className="border-gray-600 text-gray-300">
                            <Globe className="w-3 h-3 mr-1" />
                            {product.origin}
                          </Badge>
                        </div>
                      </div>

                      <CardHeader className="pb-3">
                        <h3 className="text-xl font-semibold group-hover:text-red-500 transition-colors">
                          {product.name}
                        </h3>
                        <p className="text-gray-300 text-sm line-clamp-2">
                          {product.description}
                        </p>
                      </CardHeader>

                      <CardContent className="pt-0">
                        {/* Heat Level */}
                        <div className="flex items-center gap-2 mb-3">
                          <Flame className="w-4 h-4 text-red-500" />
                          <span className={`text-sm font-medium ${getHeatLevelColor(product.scoville)}`}>
                            {product.scoville} SHU
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
                          <Button className="flex-1 bg-red-500 hover:bg-red-600 text-white">
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
                  How to Use Hot Sauces
                  <span className="text-red-500"> Like a Pro</span>
                </h2>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold text-sm">1</span>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Start Small</h3>
                      <p className="text-gray-300">Begin with a few drops and gradually increase to find your perfect heat level.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold text-sm">2</span>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Pair with Purpose</h3>
                      <p className="text-gray-300">Match sauce heat and flavor profiles with your dish - fruity sauces with grilled meats, smoky with BBQ.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold text-sm">3</span>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Cook with Confidence</h3>
                      <p className="text-gray-300">Use as marinades, cooking ingredients, or finishing touches to build complex flavor layers.</p>
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
                <div className="aspect-square rounded-2xl overflow-hidden">
                  <img
                    src="/hot-sauce-cooking.jpg"
                    alt="Cooking with hot sauce"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-6 -left-6 bg-red-500 text-white p-6 rounded-lg">
                  <ChefHat className="w-8 h-8 mb-2" />
                  <div className="font-bold">Chef Approved</div>
                  <div className="text-sm opacity-90">Professional Quality</div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center max-w-2xl mx-auto"
            >
              <h2 className="text-3xl font-bold mb-4">
                Ready to Turn Up the Heat?
              </h2>
              <p className="text-gray-300 mb-8">
                Explore our complete hot sauce collection and discover your perfect heat level. 
                From mild to extreme, we have the sauce for every spice lover.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-red-500 hover:bg-red-600 text-white font-semibold">
                  Shop All Hot Sauces
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <Button size="lg" variant="outline" className="border-gray-600 text-white hover:bg-gray-800">
                  Try Sample Pack
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
}