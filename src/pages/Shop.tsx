import { Bell, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import heroImage from "@/assets/hero-sauce.jpg";

const Shop = () => {
  return (
    <>
      {/* Coming Soon Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden -mt-20 pt-40">
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="Y7 Shop Coming Soon"
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-obsidian/80 via-obsidian/90 to-obsidian" />
        </div>

        {/* Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 border border-gold/10 rounded-full animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 border border-gold/5 rounded-full" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-gold/5 rounded-full" />
        </div>

        <div className="relative z-10 container mx-auto px-6 lg:px-12 text-center">
          <div className="max-w-3xl mx-auto">
            {/* Animated Icon */}
            <div className="w-24 h-24 mx-auto mb-8 rounded-full bg-gradient-to-br from-gold/20 to-deep-red/20 flex items-center justify-center animate-float">
              <Sparkles className="w-12 h-12 text-gold" />
            </div>

            <p className="text-gold text-sm tracking-[0.3em] uppercase mb-6 animate-pulse">
              Coming Soon
            </p>

            <h1 className="font-display text-4xl sm:text-5xl lg:text-7xl font-bold text-cream mb-6 leading-tight">
              Our Premium Sauces Are{" "}
              <span className="text-gradient-gold">Launching Soon</span>
            </h1>

            <p className="text-cream/60 text-lg sm:text-xl max-w-2xl mx-auto mb-4">
              Stay tuned for a flavor revolution.
            </p>

            <p className="text-cream/40 text-base max-w-xl mx-auto mb-12">
              We're putting the finishing touches on our online store. 
              Be the first to experience Y7's premium sauce collection 
              by signing up for exclusive early access.
            </p>

            {/* Email Signup */}
            <div className="max-w-md mx-auto mb-12">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1">
                  <Input
                    type="email"
                    placeholder="Enter your email address"
                    className="h-14 bg-charcoal border-gold/20 text-cream placeholder:text-cream/40 focus:border-gold text-center sm:text-left"
                  />
                </div>
                <Button variant="hero" size="hero" className="glow-gold">
                  <Bell className="w-4 h-4 mr-2" />
                  Notify Me
                </Button>
              </div>
              <p className="text-cream/30 text-xs mt-3">
                No spam. Just exclusive updates and early access.
              </p>
            </div>

            {/* Features Preview */}
            <div className="grid sm:grid-cols-3 gap-6 max-w-2xl mx-auto">
              {[
                { label: "Premium Quality", value: "100%" },
                { label: "Countries", value: "50+" },
                { label: "Sauce Varieties", value: "20+" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="p-6 bg-charcoal/30 border border-gold/10 rounded-lg"
                >
                  <div className="font-display text-3xl font-bold text-gradient-gold mb-2">
                    {stat.value}
                  </div>
                  <div className="text-cream/50 text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Shop;
