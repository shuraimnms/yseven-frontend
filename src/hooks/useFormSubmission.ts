import { useState, useRef } from 'react';
import { toast } from 'sonner';

interface FormData {
  fullName: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  type?: string;
}

export const useFormSubmission = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const lastSubmissionTime = useRef<number>(0);

  const submitForm = async (formData: FormData) => {
    // Prevent rapid successive submissions (debounce)
    const now = Date.now();
    const timeSinceLastSubmission = now - lastSubmissionTime.current;
    
    if (timeSinceLastSubmission < 2000) { // 2 second cooldown
      toast.warning('Please wait a moment before submitting again.');
      return { success: false, error: { type: 'debounce' } };
    }

    setIsSubmitting(true);
    lastSubmissionTime.current = now;

    try {
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'https://yseven-backend.onrender.com/api/v1';
      const response = await fetch(`${apiBaseUrl}/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          phone: formData.phone?.trim() || undefined,
          type: formData.type || 'general'
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Show success message based on form type
        const successMessages = {
          bulk: 'Bulk order inquiry submitted! Our B2B team will contact you within 24 hours.',
          export: 'Export quote request submitted! Our export team will contact you within 24 hours.',
          partnership: 'Partnership inquiry submitted! Our team will review and contact you soon.',
          support: 'Support request submitted! Our support team will assist you shortly.',
          media: 'Media inquiry submitted! Our PR team will get back to you soon.',
          chat: 'Business inquiry submitted! Our team will contact you within 24 hours.',
          general: 'Message sent successfully! We will get back to you soon.'
        };

        const message = successMessages[formData.type as keyof typeof successMessages] || successMessages.general;
        toast.success(message, { duration: 5000 });

        return { success: true, data };
      } else if (response.status === 429) {
        // Handle rate limiting specifically
        const retryAfter = response.headers.get('Retry-After');
        const waitTime = retryAfter ? `${retryAfter} seconds` : 'a few minutes';
        
        toast.error(`Too many requests. Please wait ${waitTime} before trying again.`, {
          duration: 5000,
        });
        
        return { success: false, error: { type: 'rate_limit', retryAfter } };
      } else {
        const errorMessage = data.message || 'Form submission failed. Please try again.';
        toast.error(errorMessage);
        return { success: false, error: data };
      }
    } catch (error: any) {
      console.error('Form submission error:', error);
      
      // Check if it's a network error that might be rate limiting
      if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
        toast.error('Network error. If you just submitted a form, please wait a moment before trying again.', {
          duration: 5000,
        });
      } else {
        toast.error('Network error. Please check your connection and try again.');
      }
      
      return { success: false, error };
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    submitForm,
    isSubmitting
  };
};