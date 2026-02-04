import { motion } from 'framer-motion';
import { 
  Award, 
  Globe, 
  Users, 
  Zap, 
  Shield, 
  Target,
  CheckCircle,
  Star,
  Truck,
  Factory,
  Heart,
  Leaf,
  Handshake,
  Lightbulb,
  Compass,
  Building,
  FileCheck,
  MapPin
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import SEOHead from '@/components/SEOHead';
import { pageSEO, generateFAQSchema, generateBreadcrumbSchema } from '@/lib/seo';
import { Link } from 'react-router-dom';
import aboutImage from '@/assets/about.png';
import heroSauce from '@/assets/hero-sauce.jpg';
import sauceClassic from '@/assets/sauce-classic.jpg';

export default function About() {
  const stats = [
    { number: '50+', label: 'Premium Products', icon: Award },
    { number: '25+', label: 'Countries Served', icon: Globe },
    { number: '100K+', label: 'Happy Customers', icon: Users },
    { number: '99.9%', label: 'Quality Standard', icon: Shield },
  ];

  // About page FAQs for schema
  const aboutFAQs = [
    {
      question: "What is Y7's mission?",
      answer: "Y7's mission is to deliver nature's finest agro-crushed products while preserving nutrition, supporting rural communities, and providing sustainable food solutions through traditional wisdom combined with modern processing."
    },
    {
      question: "What makes Y7 different from other brands?",
      answer: "Y7 stands out through our farm-to-table philosophy, sustainable sourcing, eco-friendly practices, precision processing that retains natural purity, and our commitment to community upliftment and environmental responsibility."
    },
    {
      question: "How does Y7 ensure quality?",
      answer: "We maintain quality through sourcing from the finest agricultural yields, precision processing, strict quality standards, small-batch careful crafting, and modern techniques combined with traditional methods."
    }
  ];

  // Breadcrumb schema
  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'About Y7', url: '/about' }
  ];

  const faqSchema = generateFAQSchema(aboutFAQs);
  const breadcrumbSchema = generateBreadcrumbSchema(breadcrumbs);

  // Core Values
  const coreValues = [
    {
      icon: Leaf,
      title: 'Sustainability',
      description: 'Environmental consciousness in every aspect of our operations, from sourcing to packaging.'
    },
    {
      icon: Heart,
      title: 'Quality-First Mindset',
      description: 'Uncompromising commitment to excellence in every product we create.'
    },
    {
      icon: Handshake,
      title: 'Ethical Sourcing',
      description: 'Fair partnerships with farmers and suppliers, ensuring mutual growth and respect.'
    },
    {
      icon: Users,
      title: 'Community Empowerment',
      description: 'Supporting rural communities and creating opportunities for local farmers.'
    },
    {
      icon: Lightbulb,
      title: 'Innovation',
      description: 'Blending traditional wisdom with modern processing techniques for superior results.'
    },
    {
      icon: Shield,
      title: 'Environmental Responsibility',
      description: 'Long-term focus on sustainable practices that protect our planet.'
    }
  ];

  // Our Process Steps
  const processSteps = [
    {
      icon: Compass,
      title: 'Premium Sourcing',
      description: 'Sourced from the finest agricultural yields with careful selection of raw materials.'
    },
    {
      icon: Factory,
      title: 'Precision Processing',
      description: 'Modern techniques combined with traditional methods for optimal results.'
    },
    {
      icon: Shield,
      title: 'Quality Assurance',
      description: 'Strict quality standards and multi-tier testing ensure consistency.'
    },
    {
      icon: CheckCircle,
      title: 'Natural Purity',
      description: 'Retaining natural nutrition and purity through careful crafting processes.'
    }
  ];

  // Who We Serve
  const customerSegments = [
    {
      icon: Users,
      title: 'Health-Conscious Consumers',
      description: 'Individuals seeking nutritious, pure, and sustainable food options for their families.'
    },
    {
      icon: Building,
      title: 'Food Industry Partners',
      description: 'Restaurants, food manufacturers, and businesses requiring premium ingredients.'
    },
    {
      icon: Leaf,
      title: 'Eco-Conscious Buyers',
      description: 'Customers who prioritize environmentally responsible and ethically sourced products.'
    },
    {
      icon: Heart,
      title: 'Traditional Food Enthusiasts',
      description: 'Those who appreciate authentic flavors and traditional food processing methods.'
    }
  ];

  return (
    <>
      <SEOHead 
        seo={pageSEO.about} 
        schema={[faqSchema, breadcrumbSchema]}
      />
      
      <div className="min-h-screen bg-black text-white">
        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden -mt-20 pt-40">
          {/* Background Video/Image */}
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent z-10" />
            <img
              src={aboutImage}
              alt="Premium agro products crafting"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="relative z-20 container mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Badge className="bg-yellow-500 text-black mb-6 text-sm px-4 py-2">
                NATURE'S FINEST AGRO PRODUCTS
              </Badge>
              <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
                Farm to Table
                <br />
                <span className="text-yellow-500">Excellence</span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
                Delivering nature's finest agro-crushed products with purity, sustainability, and traditional wisdom.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/products">
                  <Button size="lg" className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold">
                    Explore Products
                  </Button>
                </Link>
                <Link to="/contact">
                  <Button size="lg" variant="outline" className="border-gray-600 text-white hover:bg-gray-800">
                    Contact Us
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-20 bg-gray-900">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 md:grid-cols-4 gap-8"
            >
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div key={index} className="text-center">
                    <Icon className="w-8 h-8 text-yellow-500 mx-auto mb-4" />
                    <div className="text-3xl md:text-4xl font-bold mb-2">{stat.number}</div>
                    <div className="text-gray-400">{stat.label}</div>
                  </div>
                );
              })}
            </motion.div>
          </div>
        </section>

        {/* About the Brand */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <Badge className="bg-yellow-500 text-black mb-6">ABOUT THE BRAND</Badge>
                <h2 className="text-4xl md:text-5xl font-bold mb-6">
                  Purity and Quality in
                  <span className="text-yellow-500"> Every Product</span>
                </h2>
                <p className="text-lg text-gray-300 mb-6 leading-relaxed">
                  Y7 represents a commitment to delivering nature's finest agro-crushed products 
                  through our farm-to-table philosophy. We combine sustainable sourcing with 
                  eco-friendly practices to preserve nutrition and purity in every product.
                </p>
                <p className="text-lg text-gray-300 mb-6 leading-relaxed">
                  Our brand stands for trust, authenticity, and excellence - built on traditional 
                  wisdom enhanced by modern processing techniques. We believe in community upliftment 
                  and creating nutrition-focused products that benefit both consumers and farmers.
                </p>
                <p className="text-base text-gray-400 mb-6 leading-relaxed border-l-2 border-gold/30 pl-4">
                  Y-Seven is a registered trademark brand manufactured and packed by Crush In Agro Products, 
                  a food manufacturing company committed to quality, safety, and consistent taste standards.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-sm">Farm-to-Table Philosophy</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-sm">Sustainable Sourcing</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-sm">Eco-Friendly Practices</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-sm">Traditional + Modern</span>
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
                <img
                  src={heroSauce}
                  alt="Y7 agro products"
                  className="w-full rounded-lg shadow-2xl"
                />
                <div className="absolute -bottom-6 -right-6 bg-yellow-500 text-black p-6 rounded-lg">
                  <Star className="w-8 h-8 mb-2" />
                  <div className="font-bold">Premium Quality</div>
                  <div className="text-sm">Guaranteed</div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Founder Story */}
        <section className="py-20 bg-gray-900">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <Badge className="bg-yellow-500 text-black mb-6">FOUNDER STORY</Badge>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Agricultural Heritage Meets
                <span className="text-yellow-500"> Modern Innovation</span>
              </h2>
            </motion.div>

            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <div className="relative">
                  <div className="w-full h-96 bg-gradient-to-br from-yellow-500/20 to-gray-800 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-32 h-32 bg-yellow-500/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                        <Users className="w-16 h-16 text-yellow-500" />
                      </div>
                      <p className="text-gray-400">B. Shanthi - Founder</p>
                    </div>
                  </div>
                  <div className="absolute -bottom-6 -right-6 bg-yellow-500 text-black p-4 rounded-lg">
                    <Award className="w-6 h-6 mb-1" />
                    <div className="font-bold text-sm">Visionary</div>
                    <div className="text-xs">Leader</div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <div className="mb-8">
                  <h3 className="text-3xl font-bold mb-2">B. Shanthi</h3>
                  <p className="text-yellow-500 text-lg mb-4">Founder & Managing Director</p>
                  <p className="text-gray-400 mb-6">Entrepreneur | Agro-Processing Visionary | Sustainability Advocate</p>
                  
                  <p className="text-lg text-gray-300 mb-6 leading-relaxed">
                    B. Shanthi comes from a proud agricultural heritage where farming was not just a livelihood 
                    but a way of life. Growing up in a farming family, she developed a deep respect for nature, 
                    sustainability, and ethical food production from an early age.
                  </p>
                  
                  <p className="text-gray-300 mb-6 leading-relaxed">
                    Her entrepreneurial journey is driven by the vision to blend time-tested agricultural knowledge 
                    with modern processing techniques. Under her leadership, Y7 focuses on sourcing high-quality 
                    agricultural produce and processing it with precision to retain its natural purity and nutritional value.
                  </p>

                  <blockquote className="border-l-4 border-yellow-500 pl-6 italic text-gray-300">
                    "Our mission is to honor our agricultural heritage while embracing innovation to create 
                    sustainable, nutritious, and trustworthy agro products that empower rural communities."
                  </blockquote>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <Badge className="bg-yellow-500 text-black mb-6">OUR MISSION & VISION</Badge>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Guiding Principles That
                <span className="text-yellow-500"> Drive Us Forward</span>
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-12">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <Card className="bg-gray-900 border-gray-800 h-full">
                  <CardContent className="p-8">
                    <Target className="w-12 h-12 text-yellow-500 mb-6" />
                    <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
                    <p className="text-gray-300 leading-relaxed mb-4">
                      To deliver nature's finest agro-crushed products while preserving nutrition and purity, 
                      providing sustainable food solutions, and supporting rural communities through traditional 
                      wisdom combined with modern processing techniques.
                    </p>
                    <ul className="space-y-2 text-sm text-gray-400">
                      <li>• Preserve nutrition and purity in every product</li>
                      <li>• Add value to traditional crops</li>
                      <li>• Support rural communities and farmers</li>
                      <li>• Provide sustainable food solutions</li>
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <Card className="bg-gray-900 border-gray-800 h-full">
                  <CardContent className="p-8">
                    <Zap className="w-12 h-12 text-yellow-500 mb-6" />
                    <h3 className="text-2xl font-bold mb-4">Our Vision</h3>
                    <p className="text-gray-300 leading-relaxed mb-4">
                      To build a trusted agro brand that leads in sustainable agro-processing, 
                      blends tradition with innovation, and creates long-term growth and empowerment 
                      for farming communities worldwide.
                    </p>
                    <ul className="space-y-2 text-sm text-gray-400">
                      <li>• Build a globally trusted agro brand</li>
                      <li>• Lead in sustainable agro-processing</li>
                      <li>• Blend tradition with innovation</li>
                      <li>• Create long-term community empowerment</li>
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Our Values */}
        <section className="py-20 bg-gray-900">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <Badge className="bg-yellow-500 text-black mb-6">OUR VALUES</Badge>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Core Principles That
                <span className="text-yellow-500"> Define Us</span>
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                The fundamental values that guide every decision and action at Y7
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {coreValues.map((value, index) => {
                const Icon = value.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <Card className="bg-black border-gray-800 h-full hover:border-yellow-500 transition-colors">
                      <CardContent className="p-6 text-center">
                        <Icon className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
                        <p className="text-gray-300 leading-relaxed">{value.description}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Our Process */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="relative"
              >
                <img
                  src={sauceClassic}
                  alt="Y7 processing facility"
                  className="w-full rounded-lg shadow-2xl"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <Badge className="bg-yellow-500 text-black mb-6">OUR PROCESS</Badge>
                <h2 className="text-4xl md:text-5xl font-bold mb-6">
                  Quality Promise in
                  <span className="text-yellow-500"> Every Step</span>
                </h2>
                <p className="text-lg text-gray-300 mb-8 leading-relaxed">
                  From sourcing the finest agricultural yields to delivering the final product, 
                  our process combines traditional methods with modern precision to ensure 
                  exceptional quality and natural purity.
                </p>

                <div className="space-y-6">
                  {processSteps.map((step, index) => {
                    const Icon = step.icon;
                    return (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: index * 0.1 }}
                        viewport={{ once: true }}
                        className="flex items-start gap-4"
                      >
                        <div className="bg-yellow-500/20 p-3 rounded-lg">
                          <Icon className="w-6 h-6 text-yellow-500" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                          <p className="text-gray-300">{step.description}</p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Sustainability & Impact */}
        <section className="py-20 bg-gray-900">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <Badge className="bg-yellow-500 text-black mb-6">SUSTAINABILITY & IMPACT</Badge>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Environmental Responsibility &
                <span className="text-yellow-500"> Community Upliftment</span>
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Our commitment extends beyond products to creating positive environmental and social impact
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-12 mb-16">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <Card className="bg-black border-gray-800 h-full">
                  <CardContent className="p-8">
                    <Leaf className="w-12 h-12 text-green-500 mb-6" />
                    <h3 className="text-2xl font-bold mb-4">Environmental Sustainability</h3>
                    <ul className="space-y-3 text-gray-300">
                      <li className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                        <span>Environmentally conscious processing alternatives</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                        <span>Sustainable farming practice partnerships</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                        <span>Responsible sourcing from trusted suppliers</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                        <span>Long-term environmental focus and protection</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <Card className="bg-black border-gray-800 h-full">
                  <CardContent className="p-8">
                    <Users className="w-12 h-12 text-yellow-500 mb-6" />
                    <h3 className="text-2xl font-bold mb-4">Social Impact</h3>
                    <ul className="space-y-3 text-gray-300">
                      <li className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                        <span>Rural community upliftment and empowerment</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                        <span>Direct support for local farmers and suppliers</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                        <span>Fair trade practices and ethical partnerships</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                        <span>Creating sustainable livelihoods in agriculture</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center bg-yellow-500/10 rounded-lg p-8"
            >
              <h3 className="text-2xl font-bold mb-4">Our Commitment</h3>
              <p className="text-lg text-gray-300 leading-relaxed max-w-3xl mx-auto">
                We believe that business success should contribute to environmental protection and 
                community development. Every product we create supports sustainable agriculture 
                and empowers the farming communities that make our work possible.
              </p>
            </motion.div>
          </div>
        </section>
        {/* Compliance, Quality & Export Readiness */}
        <section className="py-20 bg-gray-900">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <Badge className="bg-green-500 text-black mb-6">COMPLIANCE, QUALITY & EXPORT READINESS</Badge>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Government Recognized
                <span className="text-yellow-500"> Export Authority</span>
              </h2>
              <p className="text-xl text-gray-300 max-w-4xl mx-auto mb-8">
                M/S Crush In Agro Products is a registered Manufacturer Exporter under APEDA (Government of India), 
                authorized to export processed fruits and vegetables globally. We comply with national export regulations 
                and operate under recognized agricultural trade standards, enabling us to serve international markets 
                with confidence and credibility.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-12 mb-16">
              {/* APEDA Registration Details */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <Card className="bg-black border-green-500/30 h-full">
                  <CardContent className="p-8">
                    <div className="flex items-center mb-6">
                      <FileCheck className="w-12 h-12 text-green-500 mr-4" />
                      <div>
                        <h3 className="text-2xl font-bold text-white">APEDA Registration</h3>
                        <p className="text-green-500">Government of India Authority</p>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="border-l-4 border-green-500 pl-4">
                        <p className="text-sm text-gray-400">Authority</p>
                        <p className="text-white font-semibold">Agricultural and Processed Food Products Export Development Authority (APEDA)</p>
                      </div>
                      
                      <div className="border-l-4 border-green-500 pl-4">
                        <p className="text-sm text-gray-400">Registration Number</p>
                        <p className="text-white font-semibold">RCMC/APEDA/24897/2025-2026</p>
                      </div>
                      
                      <div className="border-l-4 border-green-500 pl-4">
                        <p className="text-sm text-gray-400">Category</p>
                        <p className="text-white font-semibold">Processed Fruits & Vegetables</p>
                      </div>
                      
                      <div className="border-l-4 border-green-500 pl-4">
                        <p className="text-sm text-gray-400">Sub-Categories</p>
                        <ul className="text-white font-semibold">
                          <li>• Other Processed Fruits & Vegetables</li>
                          <li>• Dried & Preserved Vegetables</li>
                        </ul>
                      </div>
                      
                      <div className="border-l-4 border-green-500 pl-4">
                        <p className="text-sm text-gray-400">Registered As</p>
                        <p className="text-white font-semibold">Manufacturer Exporter</p>
                      </div>
                      
                      <div className="border-l-4 border-green-500 pl-4">
                        <p className="text-sm text-gray-400">Valid Till</p>
                        <p className="text-white font-semibold">17/04/2026</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Business Registration Details */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <Card className="bg-black border-yellow-500/30 h-full">
                  <CardContent className="p-8">
                    <div className="flex items-center mb-6">
                      <Building className="w-12 h-12 text-yellow-500 mr-4" />
                      <div>
                        <h3 className="text-2xl font-bold text-white">Business Registration</h3>
                        <p className="text-yellow-500">Export Compliance Details</p>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="border-l-4 border-yellow-500 pl-4">
                        <p className="text-sm text-gray-400">IEC Number</p>
                        <p className="text-white font-semibold">BQEPS7979D</p>
                      </div>
                      
                      <div className="border-l-4 border-yellow-500 pl-4">
                        <p className="text-sm text-gray-400">Nature of Business</p>
                        <p className="text-white font-semibold">Proprietorship</p>
                      </div>
                      
                      <div className="border-l-4 border-yellow-500 pl-4">
                        <p className="text-sm text-gray-400">Registered Office</p>
                        <p className="text-white font-semibold">Plot 120, Survey No. 6, 8B, II Stage, Mundargi Industrial Estate, Ballari – 583101, Karnataka, India</p>
                      </div>
                      
                      <div className="border-l-4 border-yellow-500 pl-4">
                        <p className="text-sm text-gray-400">Export Categories</p>
                        <ul className="text-white font-semibold">
                          <li>• Processed Fruits & Vegetables</li>
                          <li>• Dried & Preserved Vegetables</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Trust Indicators */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 md:grid-cols-4 gap-6"
            >
              <div className="text-center">
                <Shield className="w-12 h-12 text-green-500 mx-auto mb-3" />
                <h4 className="font-semibold text-white mb-2">APEDA Registered</h4>
                <p className="text-gray-400 text-sm">Government Authorized Exporter</p>
              </div>
              
              <div className="text-center">
                <Globe className="w-12 h-12 text-blue-500 mx-auto mb-3" />
                <h4 className="font-semibold text-white mb-2">Export Ready</h4>
                <p className="text-gray-400 text-sm">International Compliance</p>
              </div>
              
              <div className="text-center">
                <FileCheck className="w-12 h-12 text-yellow-500 mx-auto mb-3" />
                <h4 className="font-semibold text-white mb-2">Quality Certified</h4>
                <p className="text-gray-400 text-sm">Regulatory Standards</p>
              </div>
              
              <div className="text-center">
                <Factory className="w-12 h-12 text-purple-500 mx-auto mb-3" />
                <h4 className="font-semibold text-white mb-2">Manufacturer</h4>
                <p className="text-gray-400 text-sm">Direct Production</p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Who We Serve */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <Badge className="bg-yellow-500 text-black mb-6">WHO WE SERVE</Badge>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Serving Diverse Communities
                <span className="text-yellow-500"> Worldwide</span>
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                From health-conscious families to industry partners, we cater to those who value quality, 
                sustainability, and authentic flavors
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
              {customerSegments.map((segment, index) => {
                const Icon = segment.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <Card className="bg-gray-900 border-gray-800 text-center h-full hover:border-yellow-500 transition-colors">
                      <CardContent className="p-6">
                        <Icon className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-3">{segment.title}</h3>
                        <p className="text-gray-300 text-sm leading-relaxed">{segment.description}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/products">
                  <Button size="lg" className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold">
                    Explore Products
                  </Button>
                </Link>
                <Link to="/contact">
                  <Button size="lg" variant="outline" className="border-gray-600 text-white hover:bg-gray-800">
                    Contact Us
                  </Button>
                </Link>
                <Link to="/partnerships">
                  <Button size="lg" variant="outline" className="border-gray-600 text-white hover:bg-gray-800">
                    Partner With Us
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
}
