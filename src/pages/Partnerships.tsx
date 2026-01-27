import { Handshake, Store, Truck, Globe, ArrowRight, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useSettings } from '@/hooks/useSettings';

const partnerTypes = [
  { icon: Store, title: "Retail Partners", desc: "Stock Y7 in your stores" },
  { icon: Truck, title: "Distribution", desc: "Become a regional distributor" },
  { icon: Globe, title: "International", desc: "Expand Y7 to new markets" },
  { icon: Handshake, title: "Co-Branding", desc: "Collaborate on special editions" },
];

const Partnerships = () => {
  const { settings } = useSettings();
  
  return (
    <>
      <section className="relative py-32 lg:py-40 overflow-hidden pt-24">
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal to-obsidian" />
        <div className="relative z-10 container mx-auto px-6 lg:px-12 text-center">
          <p className="text-gold text-sm tracking-[0.3em] uppercase mb-6">Grow With Us</p>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-7xl font-bold text-cream mb-6">
            <span className="text-gradient-gold">Partnerships</span>
          </h1>
          <p className="text-cream/70 text-lg max-w-2xl mx-auto mb-8">
            Join forces with Y7. We're seeking strategic partners to bring 
            premium flavor to more kitchens worldwide.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {settings.downloadLinks.brochureUrl && (
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => window.open(settings.downloadLinks.brochureUrl, '_blank')}
                className="border-gold/30 text-gold hover:bg-gold/10"
              >
                <Download className="w-4 h-4 mr-2" />
                Download Brochure
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

      <section className="py-16 lg:py-24 bg-obsidian">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {partnerTypes.map((type) => (
              <div
                key={type.title}
                className="text-center p-8 bg-charcoal/50 border border-gold/10 rounded-lg hover:border-gold/30 transition-all"
              >
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gold/10 flex items-center justify-center">
                  <type.icon className="w-8 h-8 text-gold" />
                </div>
                <h3 className="font-display text-lg font-semibold text-cream mb-2">{type.title}</h3>
                <p className="text-cream/50 text-sm">{type.desc}</p>
              </div>
            ))}
          </div>

          <div className="max-w-2xl mx-auto">
            <div className="bg-charcoal border border-gold/10 rounded-lg p-8 lg:p-12">
              <h2 className="font-display text-2xl font-bold text-cream mb-6 text-center">
                Become a <span className="text-gradient-gold">Partner</span>
              </h2>
              <form className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-cream/60 text-sm mb-2">Company Name</label>
                    <Input className="bg-obsidian border-gold/20 text-cream focus:border-gold" />
                  </div>
                  <div>
                    <label className="block text-cream/60 text-sm mb-2">Partnership Type</label>
                    <Input className="bg-obsidian border-gold/20 text-cream focus:border-gold" placeholder="Retail, Distribution, etc." />
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-cream/60 text-sm mb-2">Contact Name</label>
                    <Input className="bg-obsidian border-gold/20 text-cream focus:border-gold" />
                  </div>
                  <div>
                    <label className="block text-cream/60 text-sm mb-2">Email</label>
                    <Input type="email" className="bg-obsidian border-gold/20 text-cream focus:border-gold" />
                  </div>
                </div>
                <div>
                  <label className="block text-cream/60 text-sm mb-2">Proposal Details</label>
                  <Textarea rows={4} className="bg-obsidian border-gold/20 text-cream focus:border-gold resize-none" />
                </div>
                <Button variant="gold" size="lg" className="w-full">
                  Submit Proposal
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

export default Partnerships;
