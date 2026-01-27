import { useState } from 'react';
import { Building2, Truck, HeadphonesIcon, Shield, ArrowRight, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from 'sonner';
import { useSettings } from '@/hooks/useSettings';

const BulkOrders = () => {
  const { settings } = useSettings();
  const [formData, setFormData] = useState({
    businessName: '',
    businessType: '',
    contactName: '',
    email: '',
    phone: '',
    monthlyVolume: '',
    details: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName: formData.contactName,
          email: formData.email,
          phone: formData.phone,
          subject: `Bulk Order Inquiry - ${formData.businessName}`,
          message: `Business Name: ${formData.businessName}\nBusiness Type: ${formData.businessType}\nEstimated Monthly Volume: ${formData.monthlyVolume}\n\nAdditional Details:\n${formData.details}`,
          type: 'bulk'
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message || 'Bulk order inquiry submitted successfully! Our B2B team will contact you within 24 hours.');
        setFormData({
          businessName: '',
          businessType: '',
          contactName: '',
          email: '',
          phone: '',
          monthlyVolume: '',
          details: ''
        });
      } else {
        toast.error(data.message || 'Failed to submit inquiry. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting bulk order inquiry:', error);
      toast.error('Failed to submit inquiry. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const benefits = [
    {
      icon: Building2,
      title: "Wholesale Pricing",
      description: "Competitive rates for restaurants, hotels, and retailers",
    },
    {
      icon: Truck,
      title: "Global Shipping",
      description: "Reliable delivery to 50+ countries worldwide",
    },
    {
      icon: HeadphonesIcon,
      title: "Dedicated Support",
      description: "Personal account manager for B2B clients",
    },
    {
      icon: Shield,
      title: "Quality Guaranteed",
      description: "Consistent premium quality in every shipment",
    },
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="relative py-32 lg:py-40 overflow-hidden pt-24">
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal to-obsidian" />
        <div className="relative z-10 container mx-auto px-6 lg:px-12 text-center">
          <p className="text-gold text-sm tracking-[0.3em] uppercase mb-6">B2B Partnership</p>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-7xl font-bold text-cream mb-6">
            Bulk <span className="text-gradient-gold">Orders</span>
          </h1>
          <p className="text-cream/70 text-lg max-w-2xl mx-auto mb-8">
            Partner with Y7 for your business. Premium sauces at wholesale pricing 
            for restaurants, hotels, caterers, and retailers.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {settings.downloadLinks.priceListUrl && (
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => window.open(settings.downloadLinks.priceListUrl, '_blank')}
                className="border-gold/30 text-gold hover:bg-gold/10"
              >
                <Download className="w-4 h-4 mr-2" />
                Download Price List
              </Button>
            )}
            {settings.downloadLinks.catalogUrl && (
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => window.open(settings.downloadLinks.catalogUrl, '_blank')}
                className="border-gold/30 text-gold hover:bg-gold/10"
              >
                <Download className="w-4 h-4 mr-2" />
                Download Catalog
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 lg:py-24 bg-obsidian">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit) => (
              <div
                key={benefit.title}
                className="text-center p-8 bg-charcoal/50 border border-gold/10 rounded-lg hover:border-gold/30 transition-all duration-300"
              >
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gold/10 flex items-center justify-center">
                  <benefit.icon className="w-8 h-8 text-gold" />
                </div>
                <h3 className="font-display text-xl font-semibold text-cream mb-2">
                  {benefit.title}
                </h3>
                <p className="text-cream/50 text-sm">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Inquiry Form */}
      <section className="py-16 lg:py-24 bg-gradient-section">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-12">
              <p className="text-gold text-sm tracking-[0.3em] uppercase mb-4">Get Started</p>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-cream mb-4">
                Request <span className="text-gradient-gold">B2B Pricing</span>
              </h2>
              <p className="text-cream/60">
                Fill out the form below and our B2B team will get back to you within 24 hours.
              </p>
            </div>

            <div className="bg-charcoal border border-gold/10 rounded-lg p-8 lg:p-12">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-cream/60 text-sm mb-2">Business Name</label>
                    <Input
                      value={formData.businessName}
                      onChange={(e) => handleInputChange('businessName', e.target.value)}
                      placeholder="Your Company"
                      required
                      className="bg-obsidian border-gold/20 text-cream placeholder:text-cream/30 focus:border-gold"
                    />
                  </div>
                  <div>
                    <label className="block text-cream/60 text-sm mb-2">Business Type</label>
                    <Input
                      value={formData.businessType}
                      onChange={(e) => handleInputChange('businessType', e.target.value)}
                      placeholder="Restaurant, Hotel, Retailer..."
                      required
                      className="bg-obsidian border-gold/20 text-cream placeholder:text-cream/30 focus:border-gold"
                    />
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-cream/60 text-sm mb-2">Contact Name</label>
                    <Input
                      value={formData.contactName}
                      onChange={(e) => handleInputChange('contactName', e.target.value)}
                      placeholder="John Doe"
                      required
                      className="bg-obsidian border-gold/20 text-cream placeholder:text-cream/30 focus:border-gold"
                    />
                  </div>
                  <div>
                    <label className="block text-cream/60 text-sm mb-2">Email Address</label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="john@company.com"
                      required
                      className="bg-obsidian border-gold/20 text-cream placeholder:text-cream/30 focus:border-gold"
                    />
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-cream/60 text-sm mb-2">Phone Number</label>
                    <Input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="+1 (234) 567-890"
                      className="bg-obsidian border-gold/20 text-cream placeholder:text-cream/30 focus:border-gold"
                    />
                  </div>
                  <div>
                    <label className="block text-cream/60 text-sm mb-2">Estimated Monthly Volume</label>
                    <Input
                      value={formData.monthlyVolume}
                      onChange={(e) => handleInputChange('monthlyVolume', e.target.value)}
                      placeholder="e.g., 100-500 units"
                      required
                      className="bg-obsidian border-gold/20 text-cream placeholder:text-cream/30 focus:border-gold"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-cream/60 text-sm mb-2">Additional Details</label>
                  <Textarea
                    value={formData.details}
                    onChange={(e) => handleInputChange('details', e.target.value)}
                    placeholder="Tell us more about your business needs..."
                    rows={4}
                    className="bg-obsidian border-gold/20 text-cream placeholder:text-cream/30 focus:border-gold resize-none"
                  />
                </div>
                <Button 
                  type="submit" 
                  variant="gold" 
                  size="lg" 
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Inquiry'}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default BulkOrders;
