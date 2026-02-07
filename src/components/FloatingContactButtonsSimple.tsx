import { Phone, MessageCircle } from 'lucide-react';
import { useGlobalSettings } from '@/hooks/useGlobalSettings';

/**
 * Simple Floating Contact Buttons Component
 * Shows WhatsApp and Call buttons stacked vertically on the right side
 * Always visible, no toggle needed
 */
export const FloatingContactButtonsSimple = () => {
  const { supportPhone } = useGlobalSettings();

  // Format phone number for WhatsApp (remove spaces, dashes, and add country code if needed)
  const formatPhoneForWhatsApp = (phone: string) => {
    let cleaned = phone.replace(/[^\d+]/g, '');
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
    <div className="fixed right-6 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-4">
      {/* WhatsApp Button */}
      <button
        onClick={handleWhatsAppClick}
        className="group relative w-14 h-14 bg-[#25D366] hover:bg-[#20BA5A] rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center hover:scale-110"
        aria-label="Contact us on WhatsApp"
      >
        <MessageCircle className="w-7 h-7 text-white" />
        
        {/* Tooltip */}
        <span className="absolute right-16 bg-obsidian text-cream px-3 py-2 rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          WhatsApp
        </span>
      </button>

      {/* Call Button */}
      <button
        onClick={handleCallClick}
        className="group relative w-14 h-14 bg-[#d4af37] hover:bg-[#c19b2a] rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center hover:scale-110"
        aria-label="Call us"
      >
        <Phone className="w-7 h-7 text-white" />
        
        {/* Tooltip */}
        <span className="absolute right-16 bg-obsidian text-cream px-3 py-2 rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          Call Now
        </span>
      </button>
    </div>
  );
};

export default FloatingContactButtonsSimple;
