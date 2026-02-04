import React from 'react';
import FloatingActionButtons from './FloatingActionButtons';

const FloatingActionButtonsDemo: React.FC = () => {
  const handleConciergeClick = () => {
    console.log('Y7 Concierge clicked - Opening chatbot...');
    // Here you would typically open your chatbot
    alert('Y7 Concierge - Premium assistance at your service');
  };

  const handleWhatsAppClick = () => {
    console.log('WhatsApp Connect clicked');
    // Custom WhatsApp logic or use default
  };

  const handleCallClick = () => {
    console.log('Call Y7 clicked');
    // Custom call logic or use default
  };

  return (
    <div className="min-h-screen bg-obsidian text-foreground">
      {/* Demo Content */}
      <div className="container mx-auto px-6 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-display font-bold text-gold mb-8 text-center">
            Y7 Premium Floating Action Buttons
          </h1>
          
          <div className="grid md:grid-cols-2 gap-12 mb-16">
            <div className="space-y-6">
              <h2 className="text-2xl font-display font-semibold text-white mb-4">
                Design Features
              </h2>
              <ul className="space-y-3 text-cream/80">
                <li className="flex items-start">
                  <span className="text-gold mr-3">•</span>
                  Ultra-premium minimalist design
                </li>
                <li className="flex items-start">
                  <span className="text-gold mr-3">•</span>
                  Luxury brand color palette (Black #0B0B0F + Gold #D4AF37)
                </li>
                <li className="flex items-start">
                  <span className="text-gold mr-3">•</span>
                  Flat design with no gradients or 3D effects
                </li>
                <li className="flex items-start">
                  <span className="text-gold mr-3">•</span>
                  Dark UI optimized with subtle borders
                </li>
                <li className="flex items-start">
                  <span className="text-gold mr-3">•</span>
                  Soft-rounded corners (rounded-2xl)
                </li>
                <li className="flex items-start">
                  <span className="text-gold mr-3">•</span>
                  Clean line icons with consistent stroke width
                </li>
              </ul>
            </div>

            <div className="space-y-6">
              <h2 className="text-2xl font-display font-semibold text-white mb-4">
                Interaction Design
              </h2>
              <ul className="space-y-3 text-cream/80">
                <li className="flex items-start">
                  <span className="text-gold mr-3">•</span>
                  Expandable menu with smooth animations
                </li>
                <li className="flex items-start">
                  <span className="text-gold mr-3">•</span>
                  Hover tooltips with backdrop blur
                </li>
                <li className="flex items-start">
                  <span className="text-gold mr-3">•</span>
                  Subtle scale effects on hover (1.05x)
                </li>
                <li className="flex items-start">
                  <span className="text-gold mr-3">•</span>
                  Focus rings for accessibility
                </li>
                <li className="flex items-start">
                  <span className="text-gold mr-3">•</span>
                  Mobile and desktop optimized
                </li>
                <li className="flex items-start">
                  <span className="text-gold mr-3">•</span>
                  High z-index (1000) for proper layering
                </li>
              </ul>
            </div>
          </div>

          <div className="bg-charcoal/50 rounded-2xl p-8 border border-gold/10">
            <h2 className="text-2xl font-display font-semibold text-white mb-6 text-center">
              Button Hierarchy
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-14 h-14 bg-obsidian border border-gold/20 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-gold">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                    <circle cx="9" cy="10" r="1" />
                    <circle cx="15" cy="10" r="1" />
                  </svg>
                </div>
                <h3 className="text-gold font-semibold mb-2">Y7 Concierge</h3>
                <p className="text-cream/60 text-sm">Premium chatbot assistance</p>
              </div>
              
              <div className="text-center">
                <div className="w-14 h-14 bg-obsidian border border-white/20 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-white">
                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                  </svg>
                </div>
                <h3 className="text-white font-semibold mb-2">WhatsApp Connect</h3>
                <p className="text-cream/60 text-sm">Direct messaging</p>
              </div>
              
              <div className="text-center">
                <div className="w-14 h-14 bg-obsidian border border-white/20 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-white">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                </div>
                <h3 className="text-white font-semibold mb-2">Call Y7</h3>
                <p className="text-cream/60 text-sm">Direct phone contact</p>
              </div>
            </div>
          </div>

          <div className="mt-16 text-center">
            <p className="text-cream/60 mb-4">
              Click the floating button in the bottom-right corner to test the interaction
            </p>
            <div className="inline-flex items-center space-x-2 text-gold">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M7 17L17 7" />
                <path d="M7 7h10v10" />
              </svg>
              <span className="text-sm font-medium">Look bottom-right</span>
            </div>
          </div>
        </div>
      </div>

      {/* The Floating Action Buttons */}
      <FloatingActionButtons
        onConciergeClick={handleConciergeClick}
        onWhatsAppClick={handleWhatsAppClick}
        onCallClick={handleCallClick}
        whatsappNumber="+1234567890"
        phoneNumber="+1234567890"
      />
    </div>
  );
};

export default FloatingActionButtonsDemo;