import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Globe, 
  Shield, 
  FileCheck, 
  Factory, 
  Truck, 
  Award,
  CheckCircle,
  Users,
  Building,
  MapPin,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import SEOHead from '@/components/SEOHead';
import { Link } from 'react-router-dom';
import { useSettings } from '@/hooks/useSettings';
import { useFormSubmission } from '@/hooks/useFormSubmission';

export default function Export() {
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const { settings } = useSettings();
  const { submitForm, isSubmitting } = useFormSubmission();
  
  const [formData, setFormData] = useState({
    companyName: '',
    contactName: '',
    email: '',
    phone: '',
    country: '',
    productInterest: '',
    quantity: '',
    message: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmitQuote = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const result = await submitForm({
      fullName: formData.contactName,
      email: formData.email,
      phone: formData.phone,
      subject: `Export Quote Request - ${formData.companyName}`,
      message: `Company: ${formData.companyName}\nCountry: ${formData.country}\nProduct Interest: ${formData.productInterest}\nQuantity Required: ${formData.quantity}\n\nMessage:\n${formData.message}`,
      type: 'export'
    });

    if (result.success) {
      // Reset form and close modal on success
      setFormData({
        companyName: '',
        contactName: '',
        email: '',
        phone: '',
        country: '',
        productInterest: '',
        quantity: '',
        message: ''
      });
      setIsQuoteModalOpen(false);
    }
  };
  const seoData = {
    title: "Export & Bulk Supply - APEDA Registered Manufacturer Exporter | Y7",
    description: "M/S Crush In Agro Products is an APEDA-registered Manufacturer Exporter, authorized to supply processed fruits and vegetables to international buyers, wholesalers, and distributors.",
    keywords: "APEDA registered exporter, bulk supply, international export, processed fruits vegetables, manufacturer exporter, B2B supply",
    canonical: "/export",
    ogTitle: "Export & Bulk Supply - APEDA Registered Manufacturer Exporter",
    ogDescription: "Government authorized exporter of processed fruits and vegetables with global shipping support and regulatory compliance.",
    twitterTitle: "Export & Bulk Supply - Y7 APEDA Registered Exporter",
    twitterDescription: "APEDA registered manufacturer exporter for processed fruits and vegetables worldwide."
  };

  const exportCapabilities = [
    {
      icon: Globe,
      title: "Export-Ready Products",
      description: "Complete range of processed fruits and vegetables certified for international markets"
    },
    {
      icon: Factory,
      title: "Bulk Supply Capability",
      description: "Large-scale production capacity to meet wholesale and distributor requirements"
    },
    {
      icon: Award,
      title: "Private Label Manufacturing",
      description: "Custom formulations and private labeling solutions for international brands"
    },
    {
      icon: Truck,
      title: "Global Shipping Support",
      description: "End-to-end logistics support with international shipping and documentation"
    },
    {
      icon: Shield,
      title: "Regulatory Compliance",
      description: "Full compliance with India Export Standards and international food safety regulations"
    },
    {
      icon: Users,
      title: "B2B Partnership",
      description: "Dedicated support for wholesalers, distributors, and international buyers"
    }
  ];

  const certifications = [
    {
      title: "APEDA Registration",
      number: "RCMC/APEDA/24897/2025-2026",
      authority: "Government of India",
      status: "Active"
    },
    {
      title: "IEC Number",
      number: "BQEPS7979D",
      authority: "Directorate General of Foreign Trade",
      status: "Valid"
    }
  ];

  return (
    <>
      <SEOHead seo={seoData} />
      
      <div className="min-h-screen bg-black text-white">
        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent z-10" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black z-0" />

          <div className="relative z-20 container mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Badge className="bg-green-500 text-black mb-6 text-sm px-4 py-2">
                APEDA REGISTERED MANUFACTURER EXPORTER
              </Badge>
              <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
                Export & Bulk
                <br />
                <span className="text-yellow-500">Supply Solutions</span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-4xl mx-auto leading-relaxed">
                M/S Crush In Agro Products is an APEDA-registered Manufacturer Exporter, authorized to supply 
                processed fruits and vegetables to international buyers, wholesalers, and distributors.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  className="bg-green-500 hover:bg-green-600 text-black font-semibold"
                  onClick={() => setIsQuoteModalOpen(true)}
                >
                  Request Export Quote
                </Button>
                {settings.downloadLinks.catalogUrl && (
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="border-gray-600 text-white hover:bg-gray-800"
                    onClick={() => window.open(settings.downloadLinks.catalogUrl, '_blank')}
                  >
                    Download Catalog
                  </Button>
                )}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Government Authorization */}
        <section className="py-20 bg-gray-900">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <Badge className="bg-green-500 text-black mb-6">GOVERNMENT AUTHORIZATION</Badge>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Trusted & Registered
                <span className="text-green-500"> Exporter</span>
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Officially recognized by the Government of India for international trade in processed agricultural products
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8">
              {certifications.map((cert, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  viewport={{ once: true }}
                >
                  <Card className="bg-black border-green-500/30">
                    <CardContent className="p-8">
                      <div className="flex items-center mb-4">
                        <FileCheck className="w-8 h-8 text-green-500 mr-3" />
                        <div>
                          <h3 className="text-xl font-bold">{cert.title}</h3>
                          <Badge className="bg-green-500/20 text-green-500 mt-1">{cert.status}</Badge>
                        </div>
                      </div>
                      <p className="text-2xl font-mono text-yellow-500 mb-2">{cert.number}</p>
                      <p className="text-gray-400">{cert.authority}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Export Capabilities */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <Badge className="bg-yellow-500 text-black mb-6">EXPORT CAPABILITIES</Badge>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Complete Export
                <span className="text-yellow-500"> Solutions</span>
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                From production to delivery - we handle every aspect of international trade
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {exportCapabilities.map((capability, index) => {
                const Icon = capability.icon;
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
                        <Icon className="w-12 h-12 text-yellow-500 mb-4" />
                        <h3 className="text-xl font-semibold mb-3">{capability.title}</h3>
                        <p className="text-gray-300 leading-relaxed">{capability.description}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Product Categories for Export */}
        <section className="py-20 bg-gray-900">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <Badge className="bg-blue-500 text-black mb-6">EXPORT PRODUCT CATEGORIES</Badge>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                APEDA Authorized
                <span className="text-blue-500"> Product Range</span>
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <Card className="bg-black border-blue-500/30 h-full">
                  <CardContent className="p-8">
                    <h3 className="text-2xl font-bold mb-6 text-blue-500">Processed Fruits & Vegetables</h3>
                    <ul className="space-y-3">
                      <li className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span>Premium Sauces & Condiments</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span>Fruit & Vegetable Powders</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span>Raw Banana Powders</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span>Spice Blends & Flakes</span>
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
                <Card className="bg-black border-blue-500/30 h-full">
                  <CardContent className="p-8">
                    <h3 className="text-2xl font-bold mb-6 text-blue-500">Dried & Preserved Vegetables</h3>
                    <ul className="space-y-3">
                      <li className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span>Dehydrated Vegetable Powders</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span>Preserved Chili Products</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span>Dried Fruit Concentrates</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span>Custom Processing Solutions</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Contact for Export */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <Badge className="bg-yellow-500 text-black mb-6">GET IN TOUCH</Badge>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Ready to
                <span className="text-yellow-500"> Export?</span>
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
                Contact our export team for quotes, product catalogs, and partnership opportunities
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <Card className="bg-gray-900 border-gray-800">
                  <CardContent className="p-8">
                    <h3 className="text-2xl font-bold mb-6">Export Office Details</h3>
                    
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <Building className="w-5 h-5 text-yellow-500 mt-1" />
                        <div>
                          <p className="font-semibold">M/S Crush In Agro Products</p>
                          <p className="text-gray-400">APEDA Registered Manufacturer Exporter</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <MapPin className="w-5 h-5 text-yellow-500 mt-1" />
                        <div>
                          <p className="font-semibold">Registered Office</p>
                          <p className="text-gray-400">Plot 120, Survey No. 6, 8B, II Stage, Mundargi Industrial Estate, Ballari – 583101, Karnataka, India</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <FileCheck className="w-5 h-5 text-green-500" />
                        <span className="text-sm">RCMC No: RCMC/APEDA/24897/2025-2026</span>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <Globe className="w-5 h-5 text-blue-500" />
                        <span className="text-sm">IEC: BQEPS7979D</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="space-y-6"
              >
                <Button 
                  size="lg" 
                  className="bg-green-500 hover:bg-green-600 text-black font-semibold w-full"
                  onClick={() => setIsQuoteModalOpen(true)}
                >
                  Request Export Quote
                </Button>
                {settings.downloadLinks.catalogUrl && (
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="border-gray-600 text-white hover:bg-gray-800 w-full"
                    onClick={() => window.open(settings.downloadLinks.catalogUrl, '_blank')}
                  >
                    Download Product Catalog
                  </Button>
                )}
                <Link to="/contact">
                  <Button size="lg" variant="outline" className="border-yellow-500 text-yellow-500 hover:bg-yellow-500/10 w-full">
                    Contact Export Team
                  </Button>
                </Link>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Export Quote Modal */}
        <Dialog open={isQuoteModalOpen} onOpenChange={setIsQuoteModalOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center justify-between">
                <span>Request Export Quote</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsQuoteModalOpen(false)}
                  className="h-6 w-6 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </DialogTitle>
            </DialogHeader>
            
            <form onSubmit={handleSubmitQuote} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Company Name *</label>
                  <Input
                    value={formData.companyName}
                    onChange={(e) => handleInputChange('companyName', e.target.value)}
                    placeholder="Your Company Name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Contact Name *</label>
                  <Input
                    value={formData.contactName}
                    onChange={(e) => handleInputChange('contactName', e.target.value)}
                    placeholder="Your Full Name"
                    required
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Email Address *</label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="your@email.com"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Phone Number</label>
                  <Input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="+1 (234) 567-890"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Country *</label>
                  <Input
                    value={formData.country}
                    onChange={(e) => handleInputChange('country', e.target.value)}
                    placeholder="Your Country"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Product Interest *</label>
                  <Select onValueChange={(value) => handleInputChange('productInterest', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Product Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sauces-condiments">Premium Sauces & Condiments</SelectItem>
                      <SelectItem value="fruit-powders">Fruit & Vegetable Powders</SelectItem>
                      <SelectItem value="banana-powders">Raw Banana Powders</SelectItem>
                      <SelectItem value="spice-blends">Spice Blends & Flakes</SelectItem>
                      <SelectItem value="dehydrated-vegetables">Dehydrated Vegetable Powders</SelectItem>
                      <SelectItem value="preserved-chilies">Preserved Chili Products</SelectItem>
                      <SelectItem value="custom-processing">Custom Processing Solutions</SelectItem>
                      <SelectItem value="all-products">All Products</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Estimated Quantity Required *</label>
                <Input
                  value={formData.quantity}
                  onChange={(e) => handleInputChange('quantity', e.target.value)}
                  placeholder="e.g., 1000 kg per month, 500 units quarterly"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Additional Requirements</label>
                <Textarea
                  value={formData.message}
                  onChange={(e) => handleInputChange('message', e.target.value)}
                  placeholder="Please provide details about your specific requirements, target markets, packaging preferences, certifications needed, etc."
                  rows={4}
                />
              </div>

              <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400 mt-0.5" />
                  <div className="text-sm text-green-100">
                    <p className="font-semibold mb-1 text-green-300">APEDA Registered Exporter</p>
                    <p>We are officially authorized by the Government of India to export processed fruits and vegetables worldwide. All our products meet international quality standards.</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsQuoteModalOpen(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-green-500 hover:bg-green-600 text-black"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Quote Request'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}