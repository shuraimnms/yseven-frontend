import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Globe, 
  MapPin, 
  Award, 
  Star, 
  ShoppingCart,
  ArrowRight,
  ChefHat,
  Flag,
  Compass
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import SEOHead from '@/components/SEOHead';
import { pageSEO, generateFAQSchema, generateBreadcrumbSchema } from '@/lib/seo';

// International sauce products data
const internationalProducts = [
  {
    id: 1,
    name: 'Y7 Sambal Oelek',
    slug: 'sambal-oelek',
    description: 'Authentic Indonesian chili paste with fresh chilies, garlic, and traditional spices',
    price: 279,
    originalPrice: 329,
    image: '/products/sambal-oelek.jpg',
    origin: 'Indonesia',
    region: 'Southeast Asia',
    rating: 4.8,
    reviews: 1456,
    bestseller: true,
    tags: ['Authentic', 'Spicy', 'Fermented'],
    flag: '🇮🇩'
  },
  {
    id: 2,
    name: 'Y7 Harissa Sauce',
    slug: 'harissa-sauce',
    description: 'North African chili paste with roasted peppers, spices, and aromatic herbs',
    price: 299,
    originalPrice: 349,
    image: '/products/harissa.jpg',
    origin: 'Tunisia',
    region: 'North Africa',
    rating: 4.7,
    reviews: 1123,
    bestseller: true,
    tags: ['Smoky', 'Complex', 'Traditional'],
    flag: '🇹🇳'
  },
  {
    id: 3,
    name: 'Y7 Chimichurri',
    slug: 'chimichurri',
    description: 'Argentinian herb sauce with parsley, oregano, garlic, and red wine vinegar',
    price: 249,
    originalPrice: 299,
    image: '/products/chimichurri.jpg',
    origin: 'Argentina',
    region: 'South America',
    rating: 4.9,
    reviews: 987,
    bestseller: false,
    tags: ['Fresh', 'Herbal', 'Tangy'],
    flag: '🇦🇷'
  },
  {
    id: 4,
    name: 'Y7 Gochujang',
    slug: 'gochujang',
    description: 'Korean fermented chili paste with sweet, spicy, and umami flavors',
    price: 329,
    originalPrice: 379,
    image: '/products/gochujang.jpg',
    origin: 'Korea',
    region: 'East Asia',
    rating: 4.6,
    reviews: 834,
    bestseller: false,
    tags: ['Fermented', 'Umami', 'Sweet Heat'],
    flag: '🇰🇷'
  },
  {
    id: 5,
    name: 'Y7 Tahini Sauce',
    slug: 'tahini-sauce',
    description: 'Middle Eastern sesame seed paste with lemon, garlic, and Mediterranean herbs',
    price: 259,
    originalPrice: 309,
    image: '/products/tahini.jpg',
    origin: 'Lebanon',
    region: 'Middle East',
    rating: 4.7,
    reviews: 1267,
    bestseller: true,
    tags: ['Creamy', 'Nutty', 'Versatile'],
    flag: '🇱🇧'
  },
  {
    id: 6,
    name: 'Y7 Romesco Sauce',
    slug: 'romesco-sauce',
    description: 'Spanish red pepper sauce with almonds, tomatoes, and Catalan tradition',
    price: 289,
    originalPrice: 339,
    image: '/products/romesco.jpg',
    origin: 'Spain',
    region: 'Mediterranean',
    rating: 4.5,
    reviews: 692,
    bestseller: false,
    tags: ['Nutty', 'Rich', 'Traditional'],
    flag: '🇪🇸'
  }
];

export default function International() {
  // International sauce FAQs for schema
  const internationalFAQs = [
    {
      question: "Are Y7 international sauces made with authentic recipes?",
      answer: "Yes! Y7 international sauces are crafted using traditional recipes sourced directly from their countries of origin, with authentic ingredients and time-honored preparation methods to ensure genuine flavors."
    },
    {
      question: "How do I use international sauces in my cooking?",
      answer: "Each Y7 international sauce comes with detailed usage guides and recipe suggestions. Use as condiments, marinades, cooking ingredients, or flavor enhancers. Start with small amounts to understand the unique flavor profiles."
    },
    {
      question: "Are the ingredients in international sauces available globally?",
      answer: "Y7 sources authentic ingredients from their regions of origin while ensuring global availability. We work with trusted suppliers worldwide to maintain authenticity while meeting international food safety standards."
    },
    {
      question: "Can I use international sauces to create fusion dishes?",
      answer: "Absolutely! Y7 international sauces are perfect for fusion cooking. Mix sambal with mayo for Asian-fusion spreads, use harissa in Mediterranean dishes, or add gochujang to modern Korean-inspired creations."
    }
  ];

  // Breadcrumb schema
  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Products', url: '/products' },
    { name: 'International Sauces', url: '/international' }
  ];

  const faqSchema = generateFAQSchema(internationalFAQs);
  const breadcrumbSchema = generateBreadcrumbSchema(breadcrumbs);

  const getRegionColor = (region: string) => {
    switch (region) {
      case 'Southeast Asia': return 'text-green-400';
      case 'North Africa': return 'text-orange-400';
      case 'South America': return 'text-blue-400';
      case 'East Asia': return 'text-red-400';
      case 'Middle East': return 'text-purple-400';
      case 'Mediterranean': return 'text-yellow-400';
      default: return 'text-gray-400';
    }
  };

  const getRegionBadge = (region: string) => {
    switch (region) {
      case 'Southeast Asia': return { label: 'SE Asia', color: 'bg-green-500' };
      case 'North Africa': return { label: 'N. Africa', color: 'bg-orange-500' };
      case 'South America': return { label: 'S. America', color: 'bg-blue-500' };
      case 'East Asia': return { label: 'E. Asia', color: 'bg-red-500' };
      case 'Middle East': return { label: 'Middle East', color: 'bg-purple-500' };
      case 'Mediterranean': return { label: 'Mediterranean', color: 'bg-yellow-500' };
      default: return { label: region, color: 'bg-gray-500' };
    }
  };

  return (
    <>
      <SEOHead 
        seo={pageSEO.international} 
        schema={[faqSchema, breadcrumbSchema]}
      />
      
      <div className="min-h-screen bg-black text-white">
        {/* Hero Section */}
        <section className="relative py-20 lg:py-32 bg-gradient-to-b from-purple-900/20 to-black">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center max-w-4xl mx-auto"
            >
              <div className="flex items-center justify-center gap-2 mb-6">
                <Globe className="w-8 h-8 text-purple-500" />
                <Badge className="bg-purple-500 text-white text-sm px-4 py-2">
                  INTERNATIONAL SAUCE COLLECTION
                </Badge>
                <Globe className="w-8 h-8 text-purple-500" />
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                Authentic Global
                <br />
                <span className="text-purple-500">Flavors</span>
              </h1>
              
              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                Journey through world cuisines with our authentic international sauce collection. 
                From Indonesian sambal to Argentinian chimichurri, taste the world.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-purple-500 hover:bg-purple-600 text-white font-semibold">
                  Explore World Flavors
                </Button>
                <Button size="lg" variant="outline" className="border-gray-600 text-white hover:bg-gray-800">
                  Culinary Journey
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* World Map Section */}
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
                Flavors from Around the World
              </h2>
              <p className="text-gray-300 max-w-2xl mx-auto">
                Each sauce represents centuries of culinary tradition, bringing authentic 
                regional flavors to your kitchen.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-6">
              {[
                { region: 'Southeast Asia', count: 3, icon: '🌶️', color: 'bg-green-500' },
                { region: 'North Africa', count: 2, icon: '🏺', color: 'bg-orange-500' },
                { region: 'South America', count: 2, icon: '🌿', color: 'bg-blue-500' },
                { region: 'East Asia', count: 2, icon: '🥢', color: 'bg-red-500' },
                { region: 'Middle East', count: 3, icon: '🕌', color: 'bg-purple-500' },
                { region: 'Mediterranean', count: 2, icon: '🫒', color: 'bg-yellow-500' }
              ].map((region, index) => (
                <motion.div
                  key={region.region}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="bg-black border-gray-800 text-center h-full hover:border-purple-500 transition-colors cursor-pointer">
                    <CardContent className="p-4">
                      <div className={`w-12 h-12 ${region.color} rounded-full mx-auto mb-3 flex items-center justify-center text-2xl`}>
                        {region.icon}
                      </div>
                      <h3 className="font-semibold mb-1 text-sm">{region.region}</h3>
                      <p className="text-gray-400 text-xs">{region.count} Sauces</p>
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
                International Sauce Collection
              </h2>
              <p className="text-gray-300 max-w-2xl mx-auto">
                Authentic recipes from master chefs and traditional cooks, 
                bringing genuine global flavors to your kitchen.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {internationalProducts.map((product, index) => {
                const regionBadge = getRegionBadge(product.region);
                return (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <Card className="bg-gray-900 border-gray-800 hover:border-purple-500 transition-colors h-full group">
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
                            <Badge className="bg-purple-500 text-white">
                              <Star className="w-3 h-3 mr-1" />
                              Bestseller
                            </Badge>
                          )}
                          <Badge className={`${regionBadge.color} text-white`}>
                            {regionBadge.label}
                          </Badge>
                        </div>

                        {/* Origin Flag */}
                        <div className="absolute top-4 right-4">
                          <div className="bg-black/80 rounded-full p-2 text-2xl">
                            {product.flag}
                          </div>
                        </div>
                      </div>

                      <CardHeader className="pb-3">
                        <div className="flex items-center gap-2 mb-2">
                          <MapPin className="w-4 h-4 text-purple-500" />
                          <span className="text-sm text-gray-400">{product.origin}</span>
                        </div>
                        <h3 className="text-xl font-semibold group-hover:text-purple-500 transition-colors">
                          {product.name}
                        </h3>
                        <p className="text-gray-300 text-sm line-clamp-2">
                          {product.description}
                        </p>
                      </CardHeader>

                      <CardContent className="pt-0">
                        {/* Region */}
                        <div className="flex items-center gap-2 mb-3">
                          <Compass className="w-4 h-4 text-purple-500" />
                          <span className={`text-sm font-medium ${getRegionColor(product.region)}`}>
                            {product.region}
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
                          <Button className="flex-1 bg-purple-500 hover:bg-purple-600 text-white">
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

        {/* Cultural Stories */}
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
                Stories Behind the Sauces
              </h2>
              <p className="text-gray-300 max-w-2xl mx-auto">
                Every sauce has a story rooted in culture, tradition, and generations 
                of culinary wisdom.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  title: 'Indonesian Sambal Tradition',
                  description: 'Sambal has been the heart of Indonesian cuisine for over 1000 years, with each region developing unique variations.',
                  icon: '🌶️',
                  culture: 'Indonesian'
                },
                {
                  title: 'North African Harissa Heritage',
                  description: 'Harissa originated in Tunisia and spread across North Africa, becoming essential to Maghreb cuisine.',
                  icon: '🏺',
                  culture: 'Tunisian'
                },
                {
                  title: 'Argentinian Chimichurri Legacy',
                  description: 'Born in Argentina, chimichurri represents the gaucho tradition and is inseparable from grilled meats.',
                  icon: '🥩',
                  culture: 'Argentinian'
                }
              ].map((story, index) => (
                <motion.div
                  key={story.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="bg-black border-gray-800 h-full">
                    <CardContent className="p-6">
                      <div className="text-4xl mb-4">{story.icon}</div>
                      <h3 className="text-lg font-semibold mb-3">{story.title}</h3>
                      <p className="text-gray-300 text-sm mb-4">{story.description}</p>
                      <Badge variant="outline" className="border-purple-500 text-purple-400">
                        <Flag className="w-3 h-3 mr-1" />
                        {story.culture}
                      </Badge>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Usage Guide */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <h2 className="text-3xl font-bold mb-6">
                  Master International
                  <span className="text-purple-500"> Flavors</span>
                </h2>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold text-sm">1</span>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Start with Small Amounts</h3>
                      <p className="text-gray-300">International sauces have complex flavors - begin with small quantities to understand their intensity.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold text-sm">2</span>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Learn Traditional Pairings</h3>
                      <p className="text-gray-300">Each sauce has traditional food pairings - sambal with rice, harissa with couscous, chimichurri with grilled meats.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold text-sm">3</span>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Experiment with Fusion</h3>
                      <p className="text-gray-300">Once familiar with traditional uses, create fusion dishes by combining international sauces with local ingredients.</p>
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
                    src="/international-cooking.jpg"
                    alt="International cooking"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-6 -left-6 bg-purple-500 text-white p-6 rounded-lg">
                  <ChefHat className="w-8 h-8 mb-2" />
                  <div className="font-bold">Authentic Recipes</div>
                  <div className="text-sm opacity-90">Traditional Methods</div>
                </div>
              </motion.div>
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
                Begin Your Culinary Journey
              </h2>
              <p className="text-gray-300 mb-8">
                Explore authentic international flavors and bring the world's best 
                culinary traditions to your kitchen with Y7's international collection.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-purple-500 hover:bg-purple-600 text-white font-semibold">
                  Shop International Collection
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <Button size="lg" variant="outline" className="border-gray-600 text-white hover:bg-gray-800">
                  Explore Recipe Guide
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
}