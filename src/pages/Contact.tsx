import { useState } from 'react';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Send, 
  Clock,
  Package,
  Users,
  HelpCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import SEO from '@/components/SEO';
import { pageSEO } from '@/lib/seo';
import { useGlobalSettings } from '@/hooks/useGlobalSettings';
import { useSettings } from '@/hooks/useSettings';
import { useFormSubmission } from '@/hooks/useFormSubmission';

export default function Contact() {
  const { 
    supportEmail, 
    supportPhone, 
    officeAddress, 
    contactPageContent
  } = useGlobalSettings();
  const { settings } = useSettings();
  const { submitForm, isSubmitting } = useFormSubmission();
  
  // Provide fallback values
  const safeContactContent = contactPageContent || 'Ready to elevate your culinary experience? Whether you\'re a home chef, restaurant owner, or looking for bulk orders, we\'re here to help.';
  const safeOfficeAddress = officeAddress || 'Y7 Sauces Pvt Ltd, Bangalore, Karnataka, India';
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const result = await submitForm({
      ...formData,
      type: formData.subject.toLowerCase().includes('bulk') ? 'bulk' :
            formData.subject.toLowerCase().includes('partnership') ? 'partnership' :
            formData.subject.toLowerCase().includes('support') ? 'support' :
            formData.subject.toLowerCase().includes('media') ? 'media' :
            'general'
    });

    if (result.success) {
      // Reset form on success
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
    }
  };

  return (
    <>
      <SEO {...pageSEO.contact} />
      
      <div className="min-h-screen bg-black text-white">
        {/* Hero Section */}
        <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent z-10" />
            <img
              src="/src/assets/hero-sauce.jpg"
              alt="Contact Y7 Sauces - Premium Sauce Collection"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="relative z-20 container mx-auto px-4 text-center">
            <Badge className="bg-yellow-500 text-black mb-6 text-sm px-4 py-2">
              GET IN TOUCH
            </Badge>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Let's Create Flavor
              <br />
              <span className="text-yellow-500">Together</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Questions, partnerships, or bulk orders? Our team is ready.
            </p>
          </div>
        </section>

        {/* Contact Form & Info */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-16">
              {/* Contact Form */}
              <div>
                <Card className="bg-gray-900 border-gray-800">
                  <CardContent className="p-8">
                    <h2 className="text-3xl font-bold mb-6">Send Message</h2>
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium mb-2">Full Name</label>
                        <Input
                          value={formData.fullName}
                          onChange={(e) => handleInputChange('fullName', e.target.value)}
                          placeholder="Enter your full name"
                          required
                          className="bg-gray-800 border-gray-700 text-white"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-2">Email Address</label>
                        <Input
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          placeholder="Enter your email"
                          required
                          className="bg-gray-800 border-gray-700 text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">Phone Number</label>
                        <Input
                          value={formData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          placeholder="Enter your phone number"
                          className="bg-gray-800 border-gray-700 text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">Subject</label>
                        <Select onValueChange={(value) => handleInputChange('subject', value)}>
                          <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                            <SelectValue placeholder="Select inquiry type" />
                          </SelectTrigger>
                          <SelectContent className="bg-gray-800 border-gray-700">
                            <SelectItem value="general">General Inquiry</SelectItem>
                            <SelectItem value="bulk">Bulk Orders</SelectItem>
                            <SelectItem value="partnership">Partnership</SelectItem>
                            <SelectItem value="support">Support</SelectItem>
                            <SelectItem value="media">Media & Press</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">Message</label>
                        <Textarea
                          value={formData.message}
                          onChange={(e) => handleInputChange('message', e.target.value)}
                          placeholder="Tell us about your inquiry..."
                          rows={5}
                          required
                          className="bg-gray-800 border-gray-700 text-white resize-none"
                        />
                      </div>

                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-semibold"
                      >
                        <Send className="w-4 h-4 mr-2" />
                        {isSubmitting ? 'Sending...' : 'Send Message'}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>

              {/* Contact Information */}
              <div className="space-y-8">
                <div>
                  <h2 className="text-3xl font-bold mb-6">Get in Touch</h2>
                  <p className="text-gray-300 text-lg leading-relaxed">
                    {safeContactContent}
                  </p>
                </div>

                {/* Direct Contact */}
                <Card className="bg-gray-900 border-gray-800">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-4">Direct Contact</h3>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <Mail className="w-5 h-5 text-yellow-500" />
                        <div>
                          <p className="font-medium">{supportEmail}</p>
                          <p className="text-sm text-gray-400">General inquiries & support</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <Phone className="w-5 h-5 text-yellow-500" />
                        <div>
                          <p className="font-medium">{supportPhone}</p>
                          <p className="text-sm text-gray-400">Customer service hotline</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <MapPin className="w-5 h-5 text-yellow-500 mt-1" />
                        <div>
                          <p className="font-medium">Registered Office</p>
                          <p className="text-sm text-gray-400">
                            {safeOfficeAddress.split(',').map((line, index) => (
                              <span key={index}>
                                {line.trim()}
                                {index < safeOfficeAddress.split(',').length - 1 && <br />}
                              </span>
                            ))}
                          </p>
                          <p className="text-xs text-green-500 mt-1">APEDA Registered Manufacturer Exporter</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3 pt-4 border-t border-gray-800">
                        <MapPin className="w-4 h-4 text-gray-500 mt-1" />
                        <div>
                          <p className="text-sm text-gray-500">Manufacturing Unit:</p>
                          <p className="text-xs text-gray-400">
                            Crush In Agro Products<br />
                            Chandigarh, Punjab, India
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Business Hours */}
                <Card className="bg-gray-900 border-gray-800">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                      <Clock className="w-5 h-5 text-yellow-500" />
                      Business Hours
                    </h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Monday - Saturday</span>
                        <span>10AM - 7PM IST</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Sunday</span>
                        <span className="text-gray-500">Closed</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Actions */}
                <div className="grid grid-cols-2 gap-4">
                  <Card className="bg-gray-900 border-gray-800 hover:border-yellow-500 transition-colors cursor-pointer">
                    <CardContent className="p-4 text-center">
                      <Package className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                      <p className="font-medium text-sm">Bulk Orders</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-gray-900 border-gray-800 hover:border-yellow-500 transition-colors cursor-pointer">
                    <CardContent className="p-4 text-center">
                      <Users className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                      <p className="font-medium text-sm">Partnerships</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* B2B CTA Section */}
        <section className="py-20 bg-gray-900">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <Badge className="bg-yellow-500 text-black mb-6">B2B PARTNERSHIPS</Badge>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Interested in Bulk Orders or
                <span className="text-yellow-500"> Partnerships?</span>
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
                We work with restaurants, hotels, distributors, and retailers worldwide. 
                Let's discuss how Y7 can enhance your business.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold">
                  Request a Call Back
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
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <Badge className="bg-yellow-500 text-black mb-6">QUICK ANSWERS</Badge>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Frequently Asked
                <span className="text-yellow-500"> Questions</span>
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {[
                {
                  question: "What are your minimum order quantities?",
                  answer: "For retail customers, there's no minimum order. For bulk orders, minimum quantities vary by product."
                },
                {
                  question: "Do you offer international shipping?",
                  answer: "Yes, we ship to 25+ countries worldwide. Shipping costs and delivery times vary by location."
                },
                {
                  question: "Can you create custom formulations?",
                  answer: "Absolutely! We offer custom sauce development and private labeling for qualified partners."
                },
                {
                  question: "What certifications do you have?",
                  answer: "We're ISO 22000 certified with HACCP compliance and regular third-party quality audits."
                }
              ].map((faq, index) => (
                <div key={index}>
                  <Card className="bg-gray-900 border-gray-800">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-3">
                        <HelpCircle className="w-5 h-5 text-yellow-500 mt-1 flex-shrink-0" />
                        <div>
                          <h3 className="font-semibold mb-2">{faq.question}</h3>
                          <p className="text-gray-300 text-sm">{faq.answer}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </>
  );
}