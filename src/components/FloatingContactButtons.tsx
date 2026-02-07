import { useState } from 'react';
import { Phone, MessageCircle, X } from 'lucide-react';
import { useGlobalSettings } from '@/hooks/useGlobalSettings';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Floating Contact Buttons Component
 * Shows WhatsApp and Call buttons on the right side of the screen
 * Uses phone number from global settings
 * Responsive: Adjusts position for mobile devices
 */
export const FloatingContactButtons = () => {
  const { supportPhone } = useGlobalSettings();
  const [isExpanded, setIsExpanded] = useState(false);

  // Format phone number for WhatsApp (remove spaces, dashes, and add country code if needed)
  const formatPhoneForWhatsApp = (phone: string) => {
    // Remove all non-numeric characters except +
    let cleaned = phone.replace(/[^\d+]/g, '');
    
    // If doesn't start with +, assume it's Indian number and add +91
    if (!cleaned.startsWith('+')) {
      cleaned = '+91' + cleaned;
    }
    
    return cleaned;
  };

  // Format phone number for tel: link
  const formatPhoneForCall = (phone: string) => {
    return phone.replace(/[^\d+]/g, '');
  };

  const whatsappNumber = formatPhoneForWhatsApp(supportPhone);
  const callNumber = formatPhoneForCall(supportPhone);

  const handleWhatsAppClick = () => {
    const message = encodeURIComponent('Hello! I would like to inquire about Y7 Sauces products.');
    window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank');
  };

  const handleCallClick = () => {
    window.location.href = `tel:${callNumber}`;
  };

  return (
    <div className="fixed right-4 md:right-6 top-1/2 -translate-y-1/2 z-40 flex flex-col items-end gap-3">
      <AnimatePresence>
        {isExpanded && (
          <>
            {/* WhatsApp Button */}
            <motion.button
              initial={{ opacity: 0, x: 50, scale: 0.8 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 50, scale: 0.8 }}
              transition={{ duration: 0.2 }}
              onClick={handleWhatsAppClick}
              className="group flex items-center gap-2 md:gap-3 bg-[#25D366] hover:bg-[#20BA5A] text-white px-3 md:px-4 py-2 md:py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
              aria-label="Contact us on WhatsApp"
            >
              <span className="text-xs md:text-sm font-medium whitespace-nowrap">WhatsApp</span>
              <div className="w-10 h-10 md:w-12 md:h-12 bg-white rounded-full flex items-center justify-center">
                <MessageCircle className="w-5 h-5 md:w-6 md:h-6 text-[#25D366]" />
              </div>
            </motion.button>

            {/* Call Button */}
            <motion.button
              initial={{ opacity: 0, x: 50, scale: 0.8 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 50, scale: 0.8 }}
              transition={{ duration: 0.2, delay: 0.05 }}
              onClick={handleCallClick}
              className="group flex items-center gap-2 md:gap-3 bg-[#d4af37] hover:bg-[#c19b2a] text-obsidian px-3 md:px-4 py-2 md:py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
              aria-label="Call us"
            >
              <span className="text-xs md:text-sm font-medium whitespace-nowrap">Call Now</span>
              <div className="w-10 h-10 md:w-12 md:h-12 bg-white rounded-full flex items-center justify-center">
                <Phone className="w-5 h-5 md:w-6 md:h-6 text-[#d4af37]" />
              </div>
            </motion.button>
          </>
        )}
      </AnimatePresence>

      {/* Toggle Button */}
      <motion.button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`w-12 h-12 md:w-14 md:h-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center ${
          isExpanded 
            ? 'bg-red-500 hover:bg-red-600' 
            : 'bg-gradient-to-br from-[#25D366] to-[#d4af37] hover:scale-110'
        }`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        aria-label={isExpanded ? 'Close contact menu' : 'Open contact menu'}
      >
        <AnimatePresence mode="wait">
          {isExpanded ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </motion.div>
          ) : (
            <motion.div
              key="open"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col items-center justify-center"
            >
              <MessageCircle className="w-4 h-4 md:w-5 md:h-5 text-white mb-0.5" />
              <Phone className="w-3 h-3 md:w-4 md:h-4 text-white" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
};

export default FloatingContactButtons;
