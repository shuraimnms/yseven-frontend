import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

/**
 * Typography Showcase Component
 * Demonstrates the complete Y7 ultra-premium typography system
 * Use this component for testing and reference
 */
const TypographyShowcase = () => {
  return (
    <div className="min-h-screen bg-obsidian text-cream p-8">
      <div className="max-w-6xl mx-auto space-y-16">
        
        {/* Hero Section Example */}
        <section className="text-center py-16">
          <p className="text-caption mb-6">Y7 Premium Sauces</p>
          <h1 className="text-hero text-gradient-gold mb-6">
            Ultra-Premium <span className="text-gradient-gold">Typography</span>
          </h1>
          <p className="text-hero-sub max-w-3xl mx-auto mb-8">
            Experience the cinematic power of Y7's luxury typography system, 
            designed to feel like Apple × Netflix × Michelin-star dining × Ferrari branding.
          </p>
          <Button className="text-cta bg-gold text-obsidian hover:bg-gold/90 px-8 py-3">
            Explore Collection
          </Button>
        </section>

        {/* Typography Hierarchy */}
        <section className="space-y-12">
          <div className="text-center">
            <p className="text-caption mb-4">Typography Hierarchy</p>
            <h2 className="text-section-title">
              Font <span className="text-gradient-gold">System</span>
            </h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Display Font Examples */}
            <div className="space-y-8">
              <div>
                <Badge className="mb-4 bg-gold/20 text-gold">Display Font - Playfair Display</Badge>
                <div className="space-y-6">
                  <div>
                    <p className="text-sm text-cream/60 mb-2">Hero (H1) - .text-hero</p>
                    <h1 className="text-hero">Endless Flavor</h1>
                  </div>
                  <div>
                    <p className="text-sm text-cream/60 mb-2">Section Title (H2) - .text-section-title</p>
                    <h2 className="text-section-title">Premium Quality</h2>
                  </div>
                  <div>
                    <p className="text-sm text-cream/60 mb-2">Product Title (H3) - .text-product-title</p>
                    <h3 className="text-product-title">Tomato Ketchup</h3>
                  </div>
                  <div>
                    <p className="text-sm text-cream/60 mb-2">Quote - .text-quote</p>
                    <blockquote className="text-quote">
                      "Y7 sauces have transformed our kitchen into a culinary masterpiece."
                    </blockquote>
                  </div>
                </div>
              </div>
            </div>

            {/* Body Font Examples */}
            <div className="space-y-8">
              <div>
                <Badge className="mb-4 bg-gold/20 text-gold">Body Font - Montserrat</Badge>
                <div className="space-y-6">
                  <div>
                    <p className="text-sm text-cream/60 mb-2">Hero Subtitle - .text-hero-sub</p>
                    <p className="text-hero-sub">
                      Discover our comprehensive range of premium sauces and condiments.
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-cream/60 mb-2">Body Large - .text-body-large</p>
                    <p className="text-body-large">
                      From classic tomato ketchup to exotic international sauces, 
                      Y7 brings you quality and taste in every bottle.
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-cream/60 mb-2">Body Premium - .text-body-premium</p>
                    <p className="text-body-premium">
                      Our products are crafted with premium ingredients, ensuring 
                      exceptional flavor profiles that elevate every dish. Each sauce 
                      is carefully formulated to deliver consistent quality and taste.
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-cream/60 mb-2">Caption - .text-caption</p>
                    <p className="text-caption">Premium Quality Guaranteed</p>
                  </div>
                  <div>
                    <p className="text-sm text-cream/60 mb-2">Navigation - .text-nav</p>
                    <nav className="flex gap-6">
                      <a href="#" className="text-nav hover:text-gold transition-colors">Products</a>
                      <a href="#" className="text-nav hover:text-gold transition-colors">About</a>
                      <a href="#" className="text-nav hover:text-gold transition-colors">Contact</a>
                    </nav>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Font Weights */}
        <section className="space-y-8">
          <div className="text-center">
            <p className="text-caption mb-4">Font Weights</p>
            <h2 className="text-section-title">Weight <span className="text-gradient-gold">Variations</span></h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-product-title mb-6">Playfair Display</h3>
              <div className="space-y-3">
                <p className="font-display font-normal">Regular (400) - Elegant baseline</p>
                <p className="font-display font-medium">Medium (500) - Subtle emphasis</p>
                <p className="font-display font-display-medium">Display Medium (600) - Strong presence</p>
                <p className="font-display font-display-bold">Display Bold (700) - Authority</p>
                <p className="font-display font-extra-bold">Extra Bold (800) - Cinematic impact</p>
                <p className="font-display font-ultra-bold">Ultra Bold (900) - Maximum power</p>
              </div>
            </div>
            
            <div>
              <h3 className="text-product-title mb-6">Montserrat</h3>
              <div className="space-y-3">
                <p className="font-body font-light">Light (300) - Delicate touch</p>
                <p className="font-body font-normal">Regular (400) - Clean readability</p>
                <p className="font-body font-body-medium">Medium (500) - Balanced weight</p>
                <p className="font-body font-body-semibold">Semibold (600) - Confident tone</p>
                <p className="font-body font-body-bold">Bold (700) - Strong emphasis</p>
                <p className="font-body font-extra-bold">Extra Bold (800) - Powerful presence</p>
                <p className="font-body font-ultra-bold">Ultra Bold (900) - Maximum impact</p>
              </div>
            </div>
          </div>
        </section>

        {/* Letter Spacing */}
        <section className="space-y-8">
          <div className="text-center">
            <p className="text-caption mb-4">Letter Spacing</p>
            <h2 className="text-section-title">Spacing <span className="text-gradient-gold">Refinement</span></h2>
          </div>
          
          <div className="space-y-6">
            <div>
              <p className="text-sm text-cream/60 mb-2">Cinematic (.tracking-cinematic) - 0.04em</p>
              <p className="text-2xl font-display tracking-cinematic">PREMIUM LUXURY BRANDING</p>
            </div>
            <div>
              <p className="text-sm text-cream/60 mb-2">Elegant (.tracking-elegant) - 0.02em</p>
              <p className="text-xl font-display tracking-elegant">Sophisticated Typography</p>
            </div>
            <div>
              <p className="text-sm text-cream/60 mb-2">Refined (.tracking-refined) - 0.01em</p>
              <p className="text-lg font-body tracking-refined">Clean and readable body text</p>
            </div>
            <div>
              <p className="text-sm text-cream/60 mb-2">Luxury (.tracking-luxury) - 0.2em</p>
              <p className="text-sm font-body tracking-luxury uppercase">EXCLUSIVE COLLECTION</p>
            </div>
          </div>
        </section>

        {/* Color Applications */}
        <section className="space-y-8">
          <div className="text-center">
            <p className="text-caption mb-4">Color Applications</p>
            <h2 className="text-section-title">Typography <span className="text-gradient-gold">Colors</span></h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 border border-gold/20 rounded-lg">
              <h3 className="text-product-title text-gradient-gold mb-4">Gold Gradient</h3>
              <p className="text-body-premium">Primary brand headlines and hero text</p>
            </div>
            <div className="text-center p-6 border border-cream/20 rounded-lg">
              <h3 className="text-product-title text-cream mb-4">Cream White</h3>
              <p className="text-body-premium">Standard headings and important text</p>
            </div>
            <div className="text-center p-6 border border-cream/10 rounded-lg">
              <h3 className="text-product-title text-cream/70 mb-4">Muted Cream</h3>
              <p className="text-body-premium text-cream/70">Body text and secondary information</p>
            </div>
          </div>
        </section>

        {/* CTA Examples */}
        <section className="space-y-8">
          <div className="text-center">
            <p className="text-caption mb-4">Call-to-Action</p>
            <h2 className="text-section-title">Button <span className="text-gradient-gold">Typography</span></h2>
          </div>
          
          <div className="flex flex-wrap justify-center gap-4">
            <Button className="text-cta bg-gold text-obsidian hover:bg-gold/90">
              Explore Range
            </Button>
            <Button variant="outline" className="text-cta border-gold text-gold hover:bg-gold/10">
              Learn More
            </Button>
            <Button variant="ghost" className="text-cta text-cream hover:bg-cream/10">
              Explore Range
            </Button>
          </div>
        </section>

        {/* Mobile Responsiveness */}
        <section className="space-y-8">
          <div className="text-center">
            <p className="text-caption mb-4">Responsive Design</p>
            <h2 className="text-section-title">Mobile <span className="text-gradient-gold">Optimization</span></h2>
          </div>
          
          <div className="bg-charcoal/50 p-8 rounded-lg">
            <p className="text-body-large mb-4">
              All typography scales fluidly using clamp() functions:
            </p>
            <ul className="text-body-premium space-y-2 list-disc list-inside">
              <li>Hero text: 36px (mobile) → 96px (desktop)</li>
              <li>Section titles: 28px (mobile) → 56px (desktop)</li>
              <li>Body text: 16px (mobile) → 18px (desktop)</li>
              <li>Maintains readability across all screen sizes</li>
            </ul>
          </div>
        </section>

      </div>
    </div>
  );
};

export default TypographyShowcase;