import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Flame, 
  MapPin, 
  Award, 
  Star, 
  ShoppingCart,
  ArrowRight,
  ChefHat,
  Thermometer,
  Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import SEOHead from '@/components/SEOHead';
import { pageSEO, generateFAQSchema, generateBreadcrumbSchema } from '@/lib/seo';

// BBQ sauce products data
const bbqProducts = [
  {
    id: 1,
    name: 'Y7 Kansas City BBQ',
    slug: 'kansas-city-bbq',
    description: 'Sweet and tangy molasses-based BBQ sauce with tomato and brown sugar',
    price: 249,
    originalPrice: 299,
    image: '/products/kansas-city-bbq.jpg',
    style: 'Kansas City',
    region: 'Midwest USA',
    sweetness: 'High',
    rating: 4.8,
    reviews: 1847,
    bestseller: true,
    tags: ['Sweet', 'Tangy', 'Classic']
  },
  {
    id: 2,
    name: 'Y7 Carolina Gold BBQ',
    slug: 'carolina-gold-bbq',
    description: 'Mustard-based Carolina BBQ sauce with vinegar tang and spice blend',
    price: 269,
    originalPrice: 319,
    image: '/products/carolina-gold-bbq.jpg',
    style: 'Carolina Gold',
    region: 'South Carolina',
    sweetness: 'Medium',
    rating: 4.7,
    reviews: 1234,
    bestseller: true,
    tags: ['Tangy', 'Mustard', 'Traditional']
  },
  {
    id: 3,
    name: 'Y7 Texas Dry Rub BBQ',
    slug: 'texas-dry-rub-bbq',
    description: 'Bold Texas-style BBQ sauce with smoky spices and minimal sweetness',
    price: 279,
    originalPrice: 329,
    image: '/products/texas-bbq.jpg',
    style: 'Texas',
    region: 'Texas',
    sweetness: 'Low',
    rating: 4.9,
    reviews: 987,
    bestseller: false,
    tags: ['Smoky', 'Bold', 'Spicy']
  },
  {
    id: 4,
    name: 'Y7 Memphis Style BBQ',
    slug: 'memphis-style-bbq',
    description: 'Tomato-vinegar based Memphis BBQ with balanced sweet and heat',
    price: 259,
    originalPrice: 309,
    image: '/products/memphis-bbq.jpg',
    style: 'Memphis',
    region: 'Tennessee',
    sweetness: 'Medium',
    rating: 4.6,
    reviews: 1456,
    bestseller: false,
    tags: ['Balanced', 'Tomato', 'Vinegar']
  },
  {
    id: 5,
    name: 'Y7 Alabama White BBQ',
    slug: 'alabama-white-bbq',
    description: 'Unique mayonnaise-based Alabama white BBQ sauce with vinegar and pepper',
    price: 289,
    originalPrice: 339,
    image: '/products/alabama-white-bbq.jpg',
    style: 'Alabama White',
    region: 'Alabama',
    sweetness: 'Low',
    rating: 4.5,
    reviews: 743,
    bestseller: false,
    tags: ['Unique', 'Creamy', 'Tangy']
  },
  {
    id: 6,
    name: 'Y7 Korean BBQ Glaze',
    slug: 'korean-bbq-glaze',
    description: 'Asian-inspired BBQ glaze with soy, ginger, garlic, and sesame',
    price: 299,
    originalPrice: 349,
    image: '/products/korean-bbq.jpg',
    style: 'Korean',
    region: 'Asia Fusion',
    sweetness: 'Medium',
    rating: 4.8,
    reviews: 1123,
    bestseller: true,
    tags: ['Asian Fusion', 'Umami', 'Glaze']
  }
];

export default function BBQSauces() {
  // BBQ sauce FAQs for schema
  const bbqFAQs = [
    {
      question: "What are the different BBQ sauce styles and their characteristics?",
      answer: "Y7 offers authentic regional BBQ styles: Kansas City (sweet, molasses-based), Carolina Gold (mustard-based), Texas (smoky, low-sweet), Memphis (tomato-vinegar), Alabama White (mayo-based), and Korean (umami-rich fusion)."
    },
    {
      question: "How do I choose the right BBQ sauce for different meats?",
      answer: "Kansas City works great with ribs and chicken, Carolina Gold pairs perfectly with pork, Texas style complements  brisket, Memphis suits all meats, Alabama White is ideal for chicken and fish, Korean glaze enhances any grilled protein."
    },
    {
      question: "Can Y7 BBQ sauces be used for cooking or just as finishing sauces?",
      answer: "Y7 BBQ sauces are versatile - use as marinades (apply 2-4 hours before cooking), basting sauces (during cooking), glazes (final 10 minutes), or finishing sauces (after cooking). Each style has optimal applications."
    },
    {
      question: "Are Y7 BBQ sauces suitable for different dietary preferences?",
      answer: "Most Y7 BBQ sauces are gluten-free and contain no artificial preservatives. We offer sugar-reduced options and clearly label all ingredients. Check individual product labels for specific dietary information."
    }
  ];

  // Breadcrumb schema
  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Products', url: '/products' },
    { name: 'BBQ Sauces', url: '/bbq-sauces' }
  ];

  const faqSchema = generateFAQSchema(bbqFAQs);
  const breadcrumbSchema = generateBreadcrumbSchema(breadcrumbs);

  const getSweetnessColor = (sweetness: string) => {
    switch (sweetness) {
      case 'High': return 'text-red-400';
      case 'Medium': return 'text-yellow-400';
      case 'Low': return 'text-green-400';
      default: return 'text-gray-400';
    }
  };

  const getStyleBadge = (style: string) => {
    switch (style) {
      case 'Kansas City': return { label: 'KC Style', color: 'bg-red-500' };
      case 'Carolina Gold': return { label: 'Carolina', color: 'bg-yellow-500' };
      case 'Texas': return { label: 'Texas', color: 'bg-orange-500' };
      case 'Memphis': return { label: 'Memphis', color: 'bg-blue-500' };
      case 'Alabama White': return { label: 'Alabama', color: 'bg-gray-500' };
      case 'Korean': return { label: 'Korean', color: 'bg-purple-500' };
      default: return { label: style, color: 'bg-gray-500' };
    }
  };

  return (
    <>
      <SEOHead 
        seo={pageSEO.bbq} 
        schema={[faqSchema, breadcrumbSchema]}
      />
      
      <div className="min-h-screen bg-black text-white">
        {/* Hero Section */}
        <section className="relative py-20 lg:py-32 bg-gradient-to-b from-orange-900/20 to-black">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center max-w-4xl mx-auto"
            >
              <div className="flex items-center justify-center gap-2 mb-6">
                <Flame className="w-8 h-8 text-orange-500" />
                <Badge className="bg-orange-500 text-white text-sm px-4 py-2">
                  PREMIUM BBQ SAUCE COLLECTION
                </Badge>
                <Flame className="w-8 h-8 text-orange-500" />
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                Premium BBQ Sauce
                <br />
                <span className="text-orange-500">Collection</span>
              </h1>
              
              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                Master the art of BBQ with authentic regional sauces. From Kansas City sweet 
                to Texas smoky, discover the perfect sauce for every grill session.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white font-semibold">
                  Shop BBQ Sauces
                </Button>
                <Button size="lg" variant="outline" className="border-gray-600 text-white hover:bg-gray-800">
                  BBQ Style Guide
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* BBQ Styles Guide */}
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
                Regional BBQ Styles
              </h2>
              <p className="text-gray-300 max-w-2xl mx-auto">
                Each region has developed unique BBQ sauce characteristics based on local 
                ingredients, traditions, and preferred flavor profiles.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { 
                  style: 'Kansas City', 
                  base: 'Molasses & Tomato', 
                  flavor: 'Sweet & Tangy', 
                  color: 'bg-red-500',
                  description: 'Thick, sweet sauce perfect for ribs'
                },
                { 
                  style: 'Carolina Gold', 
                  base: 'Mustard & Vinegar', 
                  flavor: 'Tangy & Spicy', 
                  color: 'bg-yellow-500',
                  description: 'Mustard-based sauce ideal for pork'
                },
                { 
                  style: 'Texas', 
                  base: 'Tomato & Spices', 
                  flavor: 'Smoky & Bold', 
                  color: 'bg-orange-500',
                  description: 'Low-sweet sauce for  brisket'
                },
                { 
                  style: 'Memphis', 
                  base: 'Tomato & Vinegar', 
                  flavor: 'Balanced', 
                  color: 'bg-blue-500',
                  description: 'Versatile sauce for all meats'
                },
                { 
                  style: 'Alabama White', 
                  base: 'Mayonnaise', 
                  flavor: 'Creamy & Tangy', 
                  color: 'bg-gray-500',
                  description: 'Unique white sauce for chicken'
                },
                { 
                  style: 'Korean Fusion', 
                  base: 'Soy & Ginger', 
                  flavor: 'Umami Rich', 
                  color: 'bg-purple-500',
                  description: 'Asian-inspired glaze for modern BBQ'
                }
              ].map((style, index) => (
                <motion.div
                  key={style.style}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="bg-black border-gray-800 h-full hover:border-orange-500 transition-colors">
                    <CardContent className="p-6">
                      <div className={`w-12 h-12 ${style.color} rounded-full mx-auto mb-4 flex items-center justify-center`}>
                        <Flame className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-lg font-semibold mb-2 text-center">{style.style}</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Base:</span>
                          <span className="text-white">{style.base}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Flavor:</span>
                          <span className="text-white">{style.flavor}</span>
                        </div>
                      </div>
                      <p className="text-gray-300 text-sm mt-3 text-center">{style.description}</p>
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
                Our BBQ Sauce Collection
              </h2>
              <p className="text-gray-300 max-w-2xl mx-auto">
                Authentic regional recipes crafted with premium ingredients for 
                the ultimate BBQ experience.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {bbqProducts.map((product, index) => {
                const styleBadge = getStyleBadge(product.style);
                return (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <Card className="bg-gray-900 border-gray-800 hover:border-orange-500 transition-colors h-full group">
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
                            <Badge className="bg-orange-500 text-white">
                              <Star className="w-3 h-3 mr-1" />
                              Bestseller
                            </Badge>
                          )}
                          <Badge className={`${styleBadge.color} text-white`}>
                            {styleBadge.label}
                          </Badge>
                        </div>

                        {/* Region */}
                        <div className="absolute top-4 right-4">
                          <Badge variant="outline" className="border-gray-600 text-gray-300">
                            <MapPin className="w-3 h-3 mr-1" />
                            {product.region}
                          </Badge>
                        </div>
                      </div>

                      <CardHeader className="pb-3">
                        <h3 className="text-xl font-semibold group-hover:text-orange-500 transition-colors">
                          {product.name}
                        </h3>
                        <p className="text-gray-300 text-sm line-clamp-2">
                          {product.description}
                        </p>
                      </CardHeader>

                      <CardContent className="pt-0">
                        {/* Sweetness Level */}
                        <div className="flex items-center gap-2 mb-3">
                          <Thermometer className="w-4 h-4 text-orange-500" />
                          <span className="text-sm text-gray-400">Sweetness:</span>
                          <span className={`text-sm font-medium ${getSweetnessColor(product.sweetness)}`}>
                            {product.sweetness}
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
                          <Button className="flex-1 bg-orange-500 hover:bg-orange-600 text-white">
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

        {/* Grilling Guide */}
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
                  BBQ Sauce Application
                  <span className="text-orange-500"> Techniques</span>
                </h2>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <Clock className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Marinade (2-4 hours before)</h3>
                      <p className="text-gray-300">Use thinner sauces like Carolina or Memphis as marinades to infuse flavor deep into the meat.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <Flame className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Basting (during cooking)</h3>
                      <p className="text-gray-300">Apply sauce every 30 minutes during low-and-slow cooking to build layers of flavor.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <Star className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Glazing (final 10 minutes)</h3>
                      <p className="text-gray-300">Apply thick, sweet sauces like Kansas City in the final minutes to create a beautiful glaze.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <Award className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Finishing (after cooking)</h3>
                      <p className="text-gray-300">Serve additional sauce on the side for those who want extra flavor and heat.</p>
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
                    src="/bbq-grilling.jpg"
                    alt="BBQ grilling techniques"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-6 -left-6 bg-orange-500 text-white p-6 rounded-lg">
                  <ChefHat className="w-8 h-8 mb-2" />
                  <div className="font-bold">Pitmaster Approved</div>
                  <div className="text-sm opacity-90">Competition Quality</div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Meat Pairing Guide */}
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
                Perfect Sauce & Meat Pairings
              </h2>
              <p className="text-gray-300 max-w-2xl mx-auto">
                Match the right sauce style with your protein for the ultimate BBQ experience.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { meat: 'Ribs', sauce: 'Kansas City', reason: 'Sweet glaze complements rich pork' },
                { meat: 'Pulled Pork', sauce: 'Carolina Gold', reason: 'Mustard cuts through fatty pork' },
                { meat: 'Brisket', sauce: 'Texas Style', reason: 'Smoky flavors enhance ' },
                { meat: 'Chicken', sauce: 'Alabama White', reason: 'Creamy sauce perfect for poultry' }
              ].map((pairing, index) => (
                <motion.div
                  key={pairing.meat}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="bg-gray-900 border-gray-800 h-full text-center">
                    <CardContent className="p-6">
                      <h3 className="text-lg font-semibold mb-2">{pairing.meat}</h3>
                      <Badge className="bg-orange-500 text-white mb-3">
                        {pairing.sauce}
                      </Badge>
                      <p className="text-gray-300 text-sm">{pairing.reason}</p>
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
                Master the Art of BBQ
              </h2>
              <p className="text-gray-300 mb-8">
                Elevate your grilling game with authentic regional BBQ sauces. 
                From backyard cookouts to competition-level BBQ, we have the sauce for every occasion.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white font-semibold">
                  Shop BBQ Collection
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <Button size="lg" variant="outline" className="border-gray-600 text-white hover:bg-gray-800">
                  BBQ Recipe Guide
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
}