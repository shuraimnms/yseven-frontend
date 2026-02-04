import { motion } from 'framer-motion';
import { 
  Shield, 
  FileCheck, 
  Award, 
  Globe, 
  Building,
  CheckCircle,
  Calendar,
  MapPin,
  Factory,
  Download
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import SEOHead from '@/components/SEOHead';
import { useSettings } from '@/hooks/useSettings';

export default function Certifications() {
  const { settings } = useSettings();
  
  const seoData = {
    title: "Certifications & Export Registrations - APEDA Registered | Y7",
    description: "M/S Crush In Agro Products is APEDA registered with Government of India authorization for exporting processed fruits and vegetables. View our complete certifications and registrations.",
    keywords: "APEDA registration, export certification, food safety certification, government registered exporter, processed fruits vegetables",
    canonical: "/certifications",
    ogTitle: "Certifications & Export Registrations - Y7",
    ogDescription: "Government authorized APEDA registered manufacturer exporter with complete certifications for international trade.",
    twitterTitle: "Y7 Certifications & Export Registrations",
    twitterDescription: "APEDA registered manufacturer exporter with government authorization for global trade."
  };

  const certifications = [
    {
      title: "APEDA Registration Certificate",
      authority: "Agricultural and Processed Food Products Export Development Authority",
      registrationNumber: "RCMC/APEDA/24897/2025-2026",
      category: "Processed Fruits & Vegetables",
      subCategories: [
        "Other Processed Fruits & Vegetables",
        "Dried & Preserved Vegetables"
      ],
      registeredAs: "Manufacturer Exporter",
      validTill: "17/04/2026",
      status: "Active",
      icon: Shield,
      color: "green"
    },
    {
      title: "Import Export Code (IEC)",
      authority: "Directorate General of Foreign Trade (DGFT)",
      registrationNumber: "BQEPS7979D",
      category: "International Trade Authorization",
      subCategories: [
        "Export Authorization",
        "Import Authorization"
      ],
      registeredAs: "Proprietorship",
      validTill: "Permanent",
      status: "Valid",
      icon: Globe,
      color: "blue"
    }
  ];

  const complianceFeatures = [
    {
      icon: Shield,
      title: "Government Authorization",
      description: "Officially recognized by Government of India for international trade"
    },
    {
      icon: FileCheck,
      title: "Export Compliance",
      description: "Full compliance with national export regulations and standards"
    },
    {
      icon: Award,
      title: "Quality Assurance",
      description: "Certified processes ensuring consistent quality and safety"
    },
    {
      icon: Globe,
      title: "International Standards",
      description: "Meeting global food safety and quality benchmarks"
    }
  ];

  return (
    <>
      <SEOHead seo={seoData} />
      
      <div className="min-h-screen bg-black text-white">
        {/* Hero Section */}
        <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden -mt-20 pt-40">
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black z-10" />
          <div className="absolute inset-0 bg-gradient-to-r from-green-900/20 to-blue-900/20" />

          <div className="relative z-20 container mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Badge className="bg-green-500 text-black mb-6 text-sm px-4 py-2">
                GOVERNMENT CERTIFIED & REGISTERED
              </Badge>
              <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
                Certifications &
                <br />
                <span className="text-green-500">Export Registrations</span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-4xl mx-auto leading-relaxed">
                M/S Crush In Agro Products is officially registered and certified by the Government of India 
                for manufacturing and exporting processed agricultural products worldwide.
              </p>
              
              {settings.downloadLinks.certificatesUrl && (
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-green-500/30 text-green-500 hover:bg-green-500/10"
                  onClick={() => window.open(settings.downloadLinks.certificatesUrl, '_blank')}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download Certificates
                </Button>
              )}
            </motion.div>
          </div>
        </section>

        {/* Certification Details */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <Badge className="bg-yellow-500 text-black mb-6">OFFICIAL CERTIFICATIONS</Badge>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Government Authorized
                <span className="text-yellow-500"> Credentials</span>
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Complete documentation of our official registrations and certifications
              </p>
            </motion.div>

            <div className="space-y-12">
              {certifications.map((cert, index) => {
                const Icon = cert.icon;
                const colorClasses = {
                  green: "border-green-500/30 bg-green-500/5",
                  blue: "border-blue-500/30 bg-blue-500/5"
                };
                
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.2 }}
                    viewport={{ once: true }}
                  >
                    <Card className={`${colorClasses[cert.color as keyof typeof colorClasses]} border-2`}>
                      <CardContent className="p-8">
                        <div className="grid lg:grid-cols-3 gap-8">
                          {/* Certificate Header */}
                          <div className="lg:col-span-1">
                            <div className="flex items-center mb-6">
                              <div className={`w-16 h-16 rounded-full bg-${cert.color}-500/20 flex items-center justify-center mr-4`}>
                                <Icon className={`w-8 h-8 text-${cert.color}-500`} />
                              </div>
                              <div>
                                <h3 className="text-2xl font-bold text-white">{cert.title}</h3>
                                <Badge className={`bg-${cert.color}-500/20 text-${cert.color}-500 mt-2`}>
                                  {cert.status}
                                </Badge>
                              </div>
                            </div>
                            
                            <div className="space-y-3">
                              <div>
                                <p className="text-sm text-gray-400">Issuing Authority</p>
                                <p className="text-white font-semibold">{cert.authority}</p>
                              </div>
                              
                              <div>
                                <p className="text-sm text-gray-400">Registration Number</p>
                                <p className={`text-${cert.color}-500 font-mono text-lg font-bold`}>
                                  {cert.registrationNumber}
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Certificate Details */}
                          <div className="lg:col-span-2">
                            <div className="grid md:grid-cols-2 gap-6">
                              <div className="space-y-4">
                                <div className="border-l-4 border-yellow-500 pl-4">
                                  <p className="text-sm text-gray-400">Category</p>
                                  <p className="text-white font-semibold">{cert.category}</p>
                                </div>
                                
                                <div className="border-l-4 border-yellow-500 pl-4">
                                  <p className="text-sm text-gray-400">Sub-Categories</p>
                                  <ul className="text-white font-semibold">
                                    {cert.subCategories.map((subCat, subIndex) => (
                                      <li key={subIndex}>• {subCat}</li>
                                    ))}
                                  </ul>
                                </div>
                              </div>
                              
                              <div className="space-y-4">
                                <div className="border-l-4 border-yellow-500 pl-4">
                                  <p className="text-sm text-gray-400">Registered As</p>
                                  <p className="text-white font-semibold">{cert.registeredAs}</p>
                                </div>
                                
                                <div className="border-l-4 border-yellow-500 pl-4">
                                  <p className="text-sm text-gray-400">Valid Till</p>
                                  <p className="text-white font-semibold flex items-center gap-2">
                                    <Calendar className="w-4 h-4" />
                                    {cert.validTill}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Registered Office */}
        <section className="py-20 bg-gray-900">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <Badge className="bg-blue-500 text-black mb-6">REGISTERED OFFICE</Badge>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Official Business
                <span className="text-blue-500"> Address</span>
              </h2>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="max-w-2xl mx-auto"
            >
              <Card className="bg-black border-blue-500/30">
                <CardContent className="p-8 text-center">
                  <div className="flex items-center justify-center mb-6">
                    <Building className="w-12 h-12 text-blue-500 mr-4" />
                    <div>
                      <h3 className="text-2xl font-bold text-white">M/S Crush In Agro Products</h3>
                      <p className="text-blue-500">APEDA Registered Manufacturer Exporter</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start justify-center gap-3 mb-6">
                    <MapPin className="w-5 h-5 text-blue-500 mt-1" />
                    <div className="text-left">
                      <p className="text-white font-semibold mb-2">Registered Office Address:</p>
                      <p className="text-gray-300 leading-relaxed">
                        Plot 120, Survey No. 6, 8B, II Stage,<br />
                        Mundargi Industrial Estate,<br />
                        Ballari – 583101, Karnataka, India
                      </p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 pt-6 border-t border-blue-500/20">
                    <div className="text-center">
                      <p className="text-sm text-gray-400">IEC Number</p>
                      <p className="text-blue-500 font-mono font-bold">BQEPS7979D</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-400">RCMC Number</p>
                      <p className="text-green-500 font-mono font-bold">RCMC/APEDA/24897/2025-2026</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </section>

        {/* Compliance Features */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <Badge className="bg-yellow-500 text-black mb-6">COMPLIANCE BENEFITS</Badge>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                What Our Certifications
                <span className="text-yellow-500"> Mean</span>
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Our official registrations ensure quality, compliance, and trust in every business relationship
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {complianceFeatures.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <Card className="bg-gray-900 border-gray-800 h-full hover:border-yellow-500 transition-colors">
                      <CardContent className="p-6 text-center">
                        <Icon className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                        <p className="text-gray-300 leading-relaxed">{feature.description}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Trust Verification */}
        <section className="py-20 bg-gradient-to-r from-green-900/20 to-blue-900/20">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <Badge className="bg-green-500 text-black mb-6">VERIFICATION</Badge>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Verify Our
                <span className="text-green-500"> Credentials</span>
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
                All our certifications can be verified through official government portals and databases
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <div className="flex items-center gap-2 px-6 py-3 bg-green-500/20 border border-green-500/30 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-green-500 font-semibold">APEDA Verified</span>
                </div>
                <div className="flex items-center gap-2 px-6 py-3 bg-blue-500/20 border border-blue-500/30 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-blue-500" />
                  <span className="text-blue-500 font-semibold">DGFT Registered</span>
                </div>
                <div className="flex items-center gap-2 px-6 py-3 bg-yellow-500/20 border border-yellow-500/30 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-yellow-500" />
                  <span className="text-yellow-500 font-semibold">Government Authorized</span>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
}