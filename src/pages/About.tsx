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
  Factory
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import SEOHead from '@/components/SEOHead';
import { pageSEO, generateFAQSchema, generateBreadcrumbSchema } from '@/lib/seo';
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
      answer: "Y7's mission is to make world-class sauces accessible to homes, restaurants, and food businesses worldwide through premium ingredient sourcing, rigorous quality control, and global flavor innovation."
    },
    {
      question: "Where are Y7 sauces manufactured?",
      answer: "Y7 sauces are manufactured in state-of-the-art facilities that are ISO 22000 certified and HACCP compliant, ensuring the highest food safety and quality standards."
    },
    {
      question: "What makes Y7 different from other sauce brands?",
      answer: "Y7 stands out through premium ingredient sourcing, international flavor profiles, multi-tier quality control, food safety excellence, small-batch precision, and consistent taste standards."
    }
  ];

  // Breadcrumb schema
  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'About Y7 Sauces', url: '/about' }
  ];

  const faqSchema = generateFAQSchema(aboutFAQs);
  const breadcrumbSchema = generateBreadcrumbSchema(breadcrumbs);

  const differentiators = [
    {
      icon: Award,
      title: 'Premium Ingredient Sourcing',
      description: 'We source the finest ingredients from trusted suppliers worldwide to ensure exceptional taste and quality in every bottle.'
    },
    {
      icon: Globe,
      title: 'International Flavor Profiles',
      description: 'Our diverse range captures authentic flavors from around the world, bringing global cuisine to your kitchen.'
    },
    {
      icon: Target,
      title: 'Multi-Tier Quality Control',
      description: 'Rigorous testing at every stage ensures consistent taste, safety, and premium quality standards.'
    },
    {
      icon: Shield,
      title: 'Food Safety & Hygiene Excellence',
      description: 'State-of-the-art facilities and strict hygiene protocols guarantee the highest food safety standards.'
    },
    {
      icon: Factory,
      title: 'Small-Batch Precision',
      description: 'Artisanal small-batch production methods ensure attention to detail and superior flavor development.'
    },
    {
      icon: CheckCircle,
      title: 'Consistent Taste Standards',
      description: 'Advanced quality control systems ensure every bottle delivers the same exceptional taste experience.'
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
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
          {/* Background Video/Image */}
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent z-10" />
            <img
              src={aboutImage}
              alt="Premium sauce crafting"
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
                PREMIUM GLOBAL BRAND
              </Badge>
              <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
                Crafting Flavor
                <br />
                <span className="text-yellow-500">Without Compromise</span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
                Premium sauces engineered for bold kitchens worldwide.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold">
                  Shop Now
                </Button>
                <Button size="lg" variant="outline" className="border-gray-600 text-white hover:bg-gray-800">
                  Contact for Bulk Orders
                </Button>
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

        {/* Who We Are */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <Badge className="bg-yellow-500 text-black mb-6">WHO WE ARE</Badge>
                <h2 className="text-4xl md:text-5xl font-bold mb-6">
                  Global Excellence in
                  <span className="text-yellow-500"> Every Drop</span>
                </h2>
                <p className="text-lg text-gray-300 mb-6 leading-relaxed">
                  Y7 is a premium global sauce and condiment brand dedicated to delivering bold, 
                  consistent, and internationally inspired flavors. We combine traditional culinary 
                  craftsmanship with modern food technology to create sauces that elevate everyday 
                  meals into gourmet experiences.
                </p>
                <p className="text-lg text-gray-300 leading-relaxed">
                  From our state-of-the-art facilities to our rigorous quality control processes, 
                  every aspect of our operation is designed to deliver uncompromising excellence 
                  that meets global food safety benchmarks.
                </p>
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
                  alt="Y7 production facility"
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

        {/* Mission & Vision */}
        <section className="py-20 bg-gray-900">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <Card className="bg-black border-gray-800 h-full">
                  <CardContent className="p-8">
                    <Target className="w-12 h-12 text-yellow-500 mb-6" />
                    <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
                    <p className="text-gray-300 leading-relaxed">
                      Our mission is to make world-class sauces accessible to homes, restaurants, 
                      and food businesses worldwide through premium ingredient sourcing, rigorous 
                      quality control, and global flavor innovation.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <Card className="bg-black border-gray-800 h-full">
                  <CardContent className="p-8">
                    <Zap className="w-12 h-12 text-yellow-500 mb-6" />
                    <h3 className="text-2xl font-bold mb-4">Our Vision</h3>
                    <p className="text-gray-300 leading-relaxed">
                      Our vision is to become a globally recognized flavor brand trusted for 
                      innovation, consistency, and uncompromising quality across continents, 
                      setting new standards in the premium condiment industry.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </section>

        {/* What Makes Us Different */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <Badge className="bg-yellow-500 text-black mb-6">WHAT MAKES US DIFFERENT</Badge>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Uncompromising
                <span className="text-yellow-500"> Excellence</span>
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Six pillars of quality that set Y7 apart in the global condiment industry
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {differentiators.map((item, index) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <Card className="bg-gray-900 border-gray-800 h-full hover:border-yellow-500 transition-colors">
                      <CardContent className="p-6">
                        <Icon className="w-10 h-10 text-yellow-500 mb-4" />
                        <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                        <p className="text-gray-300 leading-relaxed">{item.description}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Product Philosophy */}
        <section className="py-20 bg-gray-900">
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
                  alt="Quality control process"
                  className="w-full rounded-lg shadow-2xl"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <Badge className="bg-yellow-500 text-black mb-6">PRODUCT PHILOSOPHY</Badge>
                <h2 className="text-4xl md:text-5xl font-bold mb-6">
                  Precision in
                  <span className="text-yellow-500"> Every Bottle</span>
                </h2>
                <p className="text-lg text-gray-300 mb-6 leading-relaxed">
                  Every Y7 product is crafted with precision, hygiene, and consistency to ensure 
                  a flawless flavor experience every time. From sourcing raw ingredients to 
                  packaging the final bottle, we follow strict quality standards that meet 
                  global food safety benchmarks.
                </p>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>ISO 22000 certified facilities</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>HACCP compliant processes</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>Third-party quality audits</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>Batch-to-batch consistency testing</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Global Reach & B2B */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <Badge className="bg-yellow-500 text-black mb-6">GLOBAL REACH</Badge>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Serving Excellence
                <span className="text-yellow-500"> Worldwide</span>
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-12">
                Y7 supplies premium sauces to retail customers, restaurants, cloud kitchens, 
                and food service partners across multiple continents.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8 mb-16">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <Card className="bg-gray-900 border-gray-800 text-center">
                  <CardContent className="p-8">
                    <Users className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-3">Retail Partners</h3>
                    <p className="text-gray-300">Premium placement in leading supermarkets and gourmet stores</p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="bg-gray-900 border-gray-800 text-center">
                  <CardContent className="p-8">
                    <Factory className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-3">Food Service</h3>
                    <p className="text-gray-300">Bulk supply to restaurants, hotels, and catering businesses</p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <Card className="bg-gray-900 border-gray-800 text-center">
                  <CardContent className="p-8">
                    <Truck className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-3">Private Label</h3>
                    <p className="text-gray-300">Custom formulations and private labeling solutions</p>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold">
                  Shop Now
                </Button>
                <Button size="lg" variant="outline" className="border-gray-600 text-white hover:bg-gray-800">
                  Contact for Bulk Orders
                </Button>
                <Button size="lg" variant="outline" className="border-gray-600 text-white hover:bg-gray-800">
                  Explore Our Flavors
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
}
