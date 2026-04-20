import { useState } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';

export interface ContactRequestData {
  full_name: string;
  email: string;
  phone?: string;
  company?: string;
  subject: string;
  message: string;
  type: 'general' | 'bulk' | 'partnership' | 'support' | 'media' | 'export' | 'quote' | 'press';
  // extra fields stored in message as structured text
  product_interest?: string;
  quantity?: string;
  country?: string;
}

const SUCCESS_MESSAGES: Record<string, string> = {
  bulk:        'Bulk order inquiry submitted! Our B2B team will contact you within 24 hours.',
  quote:       'Quote request submitted! Our team will get back to you within 24 hours.',
  export:      'Export inquiry submitted! Our export team will contact you within 24 hours.',
  partnership: 'Partnership inquiry submitted! Our team will review and contact you soon.',
  support:     'Support request submitted! Our support team will assist you shortly.',
  media:       'Media inquiry submitted! Our PR team will get back to you soon.',
  general:     'Message sent! We will get back to you soon.',
  press:       'Press inquiry submitted! Our PR team will get back to you soon.',
};

export function useContactRequest() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function submitRequest(data: ContactRequestData) {
    setIsSubmitting(true);
    try {
      // Build enriched message with extra fields
      let enrichedMessage = data.message;
      const extras: string[] = [];
      if (data.company)          extras.push(`Company: ${data.company}`);
      if (data.product_interest) extras.push(`Product Interest: ${data.product_interest}`);
      if (data.quantity)         extras.push(`Quantity: ${data.quantity}`);
      if (data.country)          extras.push(`Country: ${data.country}`);
      if (extras.length)         enrichedMessage = `${extras.join('\n')}\n\n${data.message}`;

      // Map 'quote' type to 'bulk' for DB constraint (quote is a UI alias)
      const dbType = data.type === 'quote' ? 'bulk' : data.type;

      const { error } = await supabase.from('contact_requests').insert({
        full_name: data.full_name,
        email:     data.email,
        phone:     data.phone || null,
        subject:   data.subject,
        message:   enrichedMessage,
        type:      dbType,
        status:    'new',
        priority:  ['bulk', 'export', 'partnership'].includes(dbType) ? 'high' : 'medium',
      });

      if (error) throw error;

      toast.success(SUCCESS_MESSAGES[data.type] || SUCCESS_MESSAGES.general, { duration: 5000 });
      return { success: true };
    } catch (err: any) {
      toast.error(err.message || 'Failed to submit. Please try again.');
      return { success: false, error: err };
    } finally {
      setIsSubmitting(false);
    }
  }

  return { submitRequest, isSubmitting };
}
