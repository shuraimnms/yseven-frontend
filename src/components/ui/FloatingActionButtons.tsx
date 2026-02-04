import React, { useState } from 'react';
import { MessageCircle, Phone } from 'lucide-react';

interface FloatingActionButtonsProps {
  onConciergeClick?: () => void;
  onWhatsAppClick?: () => void;
  onCallClick?: () => void;
  whatsappNumber?: string;
  phoneNumber?: string;
}

const FloatingActionButtons: React.FC<FloatingActionButtonsProps> = ({
  onConciergeClick,
  onWhatsAppClick,
  onCallClick,
  whatsappNumber = "+1234567890",
  phoneNumber = "+1234567890"
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleWhatsAppClick = () => {
    if (onWhatsAppClick) {
      onWhatsAppClick();
    } else {
      window.open(`https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}`, '_blank');
    }
  };

  const handleCallClick = () => {
    if (onCallClick) {
      onCallClick();
    } else {
      window.location.href = `tel:${phoneNumber}`;
    }
  };

  const handleConciergeClick = () => {
    if (onConciergeClick) {
      onConciergeClick();
    }
  };

  // WhatsApp Icon Component - Clean line art style
  const WhatsAppIcon = () => (
    <svg 
      width="20" 
      height="20" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="1.5"
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    </svg>
  );

  // Concierge Icon - Elegant chat bubble
  const ConciergeIcon = () => (
    <svg 
      width="20" 
      height="20" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="1.5"
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      <circle cx="9" cy="10" r="1" />
      <circle cx="15" cy="10" r="1" />
    </svg>
  );

  return (
    <div className="fixed bottom-6 right-6 z-[1000] flex flex-col items-end space-y-3">
      {/* Expanded Buttons */}
      <div className={`flex flex-col items-end space-y-3 transition-all duration-300 ease-out ${
        isExpanded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
      }`}>
        {/* Y7 Concierge Button - Premium Gold */}
        <button
          onClick={handleConciergeClick}
          className="group relative flex items-center justify-center w-14 h-14 bg-obsidian hover:bg-charcoal text-gold border border-gold/20 hover:border-gold/40 rounded-2xl transition-all duration-200 ease-out hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gold/30 backdrop-blur-sm"
          aria-label="Y7 Concierge"
        >
          <ConciergeIcon />
          <div className="absolute right-16 top-1/2 -translate-y-1/2 bg-obsidian/95 text-gold text-sm font-medium px-4 py-2 rounded-xl whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-200 border border-gold/20 backdrop-blur-sm">
            Y7 Concierge
          </div>
        </button>

        {/* WhatsApp Button - Clean White */}
        <button
          onClick={handleWhatsAppClick}
          className="group relative flex items-center justify-center w-14 h-14 bg-obsidian hover:bg-charcoal text-white border border-white/20 hover:border-white/40 rounded-2xl transition-all duration-200 ease-out hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white/30 backdrop-blur-sm"
          aria-label="WhatsApp Connect"
        >
          <WhatsAppIcon />
          <div className="absolute right-16 top-1/2 -translate-y-1/2 bg-obsidian/95 text-white text-sm font-medium px-4 py-2 rounded-xl whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-200 border border-white/20 backdrop-blur-sm">
            WhatsApp Connect
          </div>
        </button>

        {/* Call Button - Clean White */}
        <button
          onClick={handleCallClick}
          className="group relative flex items-center justify-center w-14 h-14 bg-obsidian hover:bg-charcoal text-white border border-white/20 hover:border-white/40 rounded-2xl transition-all duration-200 ease-out hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white/30 backdrop-blur-sm"
          aria-label="Call Y7"
        >
          <Phone size={20} className="text-white" />
          <div className="absolute right-16 top-1/2 -translate-y-1/2 bg-obsidian/95 text-white text-sm font-medium px-4 py-2 rounded-xl whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-200 border border-white/20 backdrop-blur-sm">
            Call Y7
          </div>
        </button>
      </div>

      {/* Main Toggle Button - Premium Gold Accent */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`flex items-center justify-center w-16 h-16 bg-obsidian hover:bg-charcoal text-gold border-2 border-gold/30 hover:border-gold/50 rounded-2xl transition-all duration-300 ease-out hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gold/40 backdrop-blur-sm ${
          isExpanded ? 'rotate-45' : 'rotate-0'
        }`}
        aria-label="Contact Options"
      >
        <div className={`transition-transform duration-300 ${isExpanded ? 'rotate-45' : 'rotate-0'}`}>
          {isExpanded ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="2" />
              <circle cx="12" cy="5" r="1" />
              <circle cx="12" cy="19" r="1" />
            </svg>
          )}
        </div>
      </button>
    </div>
  );
};

export default FloatingActionButtons;