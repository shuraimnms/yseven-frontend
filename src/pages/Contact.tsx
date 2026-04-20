import { useState } from 'react';
import {
  Mail, Phone, MapPin, Send, Clock,
  Package, HelpCircle, FileText, Globe, Users, MessageSquare, Newspaper
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
import heroSauceImage from '@/assets/hero-sauce.jpg';
import { useContactRequest, type ContactRequestData } from '@/hooks/useContactRequest';

// Request types with icons and extra fields config
const REQUEST_TYPES = [
  { value: 'general',     label: 'General Inquiry',    icon: MessageSquare, extras: [] },
  { value: 'quote',       label: 'Request a Quote',    icon: FileText,      extras: ['product_interest', 'quantity'] },
  { value: 'bulk',        label: 'Bulk / Wholesale',   icon: Package,       extras: ['product_interest', 'quantity', 'company'] },
  { value: 'export',      label: 'Export Inquiry',     icon: Globe,         extras: ['product_interest', 'quantity', 'country', 'company'] },
  { value: 'partnership', label: 'Partnership',        icon: Users,         extras: ['company'] },
  { value: 'support',     label: 'Support',            icon: HelpCircle,    extras: [] },
  { value: 'media',       label: 'Media / Press',      icon: Newspaper,     extras: ['company'] },
] as const;

type RequestTypeValue = typeof REQUEST_TYPES[number]['value'];

const EMPTY_FORM = {
  full_name: '',
  email: '',
  phone: '',
  company: '',
  subject: '',
  message: '',
  type: 'general' as RequestTypeValue,
  product_interest: '',
  quantity: '',
  country: '',
};

export default function Contact() {
  const { supportEmail, supportPhone, officeAddress, contactPageContent } = useGlobalSettings();
  const { settings } = useSettings();
  const { submitRequest, isSubmitting } = useContactRequest();

  const safeContactContent = contactPageContent || "Ready to elevate your culinary experience? Whether you're a home chef, restaurant owner, or looking for bulk orders, we're here to help.";
  const safeOfficeAddress = officeAddress || 'YSeven Foods Pvt Ltd, Bangalore, Karnataka, India';

  const [form, setForm] = useState(EMPTY_FORM);
  const [submitted, setSubmitted] = useState(false);

  const set = (field: string, value: string) => setForm(prev => ({ ...prev, [field]: value }));

  const activeType = REQUEST_TYPES.find(t => t.value === form.type) || REQUEST_TYPES[0];
  const showExtra = (field: string) => (activeType.extras as readonly string[]).includes(field);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await submitRequest({
      ...form,
      type: form.type as ContactRequestData['type'],
      subject: form.subject || activeType.label,
    });
    if (result.success) {
      setForm(EMPTY_FORM);
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 6000);
    }
  };

  return (
    <>
      <SEO {...pageSEO.contact} />
      <div className="min-h-screen bg-black text-white">

        {/* Hero */}
        <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden -mt-20 pt-40">
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent z-10" />
            <img src={heroSauceImage} alt="Contact YSeven Foods" className="w-full h-full object-cover" />
          </div>
          <div className="relative z-20 container mx-auto px-4 text-center">
            <Badge className="bg-yellow-500 text-black mb-6 text-sm px-4 py-2">GET IN TOUCH</Badge>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Let's Create Flavor<br />
              <span className="text-yellow-500">Together</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Questions, partnerships, bulk orders, or quotes? Our team is ready.
            </p>
          </div>
        </section>

        {/* Form + Info */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-16">

              {/* Form */}
              <div>
                <Card className="bg-gray-900 border-gray-800">
                  <CardContent className="p-8">
                    <h2 className="text-3xl font-bold mb-2">Send a Request</h2>
                    <p className="text-gray-400 text-sm mb-6">All requests go directly to our team.</p>

                    {submitted && (
                      <div className="mb-6 p-4 rounded-lg bg-green-500/10 border border-green-500/30 text-green-400 text-sm">
                        Your request was submitted successfully. We'll be in touch soon.
                      </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">

                      {/* Request Type Selector */}
                      <div>
                        <label className="block text-sm font-medium mb-2">Request Type</label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                          {REQUEST_TYPES.map(t => (
                            <button
                              key={t.value}
                              type="button"
                              onClick={() => set('type', t.value)}
                              className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border text-sm font-medium transition-all ${
                                form.type === t.value
                                  ? 'bg-yellow-500 text-black border-yellow-500'
                                  : 'bg-gray-800 border-gray-700 text-gray-300 hover:border-yellow-500/50'
                              }`}
                            >
                              <t.icon className="w-4 h-4 flex-shrink-0" />
                              <span className="truncate">{t.label}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Name + Email */}
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-1">Full Name *</label>
                          <Input value={form.full_name} onChange={e => set('full_name', e.target.value)}
                            placeholder="Your name" required className="bg-gray-800 border-gray-700 text-white" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Email *</label>
                          <Input type="email" value={form.email} onChange={e => set('email', e.target.value)}
                            placeholder="you@example.com" required className="bg-gray-800 border-gray-700 text-white" />
                        </div>
                      </div>

                      {/* Phone + Company (conditional) */}
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-1">Phone</label>
                          <Input value={form.phone} onChange={e => set('phone', e.target.value)}
                            placeholder="+91 00000 00000" className="bg-gray-800 border-gray-700 text-white" />
                        </div>
                        {showExtra('company') && (
                          <div>
                            <label className="block text-sm font-medium mb-1">Company / Business</label>
                            <Input value={form.company} onChange={e => set('company', e.target.value)}
                              placeholder="Your company name" className="bg-gray-800 border-gray-700 text-white" />
                          </div>
                        )}
                      </div>

                      {/* Product Interest + Quantity (conditional) */}
                      {(showExtra('product_interest') || showExtra('quantity')) && (
                        <div className="grid sm:grid-cols-2 gap-4">
                          {showExtra('product_interest') && (
                            <div>
                              <label className="block text-sm font-medium mb-1">Product Interest</label>
                              <Input value={form.product_interest} onChange={e => set('product_interest', e.target.value)}
                                placeholder="e.g. Tomato Ketchup, Sauces" className="bg-gray-800 border-gray-700 text-white" />
                            </div>
                          )}
                          {showExtra('quantity') && (
                            <div>
                              <label className="block text-sm font-medium mb-1">Quantity / Volume</label>
                              <Input value={form.quantity} onChange={e => set('quantity', e.target.value)}
                                placeholder="e.g. 500 units / month" className="bg-gray-800 border-gray-700 text-white" />
                            </div>
                          )}
                        </div>
                      )}

                      {/* Country (conditional) */}
                      {showExtra('country') && (
                        <div>
                          <label className="block text-sm font-medium mb-1">Country / Destination</label>
                          <Input value={form.country} onChange={e => set('country', e.target.value)}
                            placeholder="e.g. UAE, USA, UK" className="bg-gray-800 border-gray-700 text-white" />
                        </div>
                      )}

                      {/* Subject */}
                      <div>
                        <label className="block text-sm font-medium mb-1">Subject</label>
                        <Input value={form.subject} onChange={e => set('subject', e.target.value)}
                          placeholder={`${activeType.label} — optional subject`}
                          className="bg-gray-800 border-gray-700 text-white" />
                      </div>

                      {/* Message */}
                      <div>
                        <label className="block text-sm font-medium mb-1">Message *</label>
                        <Textarea value={form.message} onChange={e => set('message', e.target.value)}
                          placeholder="Tell us more about your inquiry..."
                          rows={4} required className="bg-gray-800 border-gray-700 text-white resize-none" />
                      </div>

                      <Button type="submit" disabled={isSubmitting}
                        className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-semibold h-12">
                        <Send className="w-4 h-4 mr-2" />
                        {isSubmitting ? 'Submitting...' : 'Submit Request'}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>

              {/* Contact Info */}
              <div className="space-y-8">
                <div>
                  <h2 className="text-3xl font-bold mb-6">Get in Touch</h2>
                  <p className="text-gray-300 text-lg leading-relaxed">{safeContactContent}</p>
                </div>

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
                            {safeOfficeAddress.split(',').map((line, i, arr) => (
                              <span key={i}>{line.trim()}{i < arr.length - 1 && <br />}</span>
                            ))}
                          </p>
                          <p className="text-xs text-green-500 mt-1">APEDA Registered Manufacturer Exporter</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gray-900 border-gray-800">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                      <Clock className="w-5 h-5 text-yellow-500" />
                      Business Hours
                    </h3>
                    <div className="space-y-2 text-sm">
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

                {settings.downloadLinks?.catalogUrl && (
                  <Button size="lg" variant="outline" className="w-full border-gray-600 text-white hover:bg-gray-800"
                    onClick={() => window.open(settings.downloadLinks.catalogUrl, '_blank')}>
                    Download Catalog
                  </Button>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-20 bg-gray-900">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <Badge className="bg-yellow-500 text-black mb-6">QUICK ANSWERS</Badge>
              <h2 className="text-4xl font-bold mb-4">Frequently Asked <span className="text-yellow-500">Questions</span></h2>
            </div>
            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {[
                { q: "What are your minimum order quantities?", a: "For retail customers, there's no minimum order. For bulk orders, minimum quantities vary by product." },
                { q: "Do you offer international shipping?", a: "Yes, we ship to 25+ countries worldwide. Shipping costs and delivery times vary by location." },
                { q: "Can you create custom formulations?", a: "Absolutely! We offer custom sauce development and private labeling for qualified partners." },
                { q: "What certifications do you have?", a: "We're ISO 22000 certified with HACCP compliance and regular third-party quality audits." },
              ].map((faq, i) => (
                <Card key={i} className="bg-gray-800 border-gray-700">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-3">
                      <HelpCircle className="w-5 h-5 text-yellow-500 mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="font-semibold mb-2">{faq.q}</h3>
                        <p className="text-gray-300 text-sm">{faq.a}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
