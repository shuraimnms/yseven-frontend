export interface ValidationError {
  field: string;
  message: string;
}

export const validateSettings = (settings: any): ValidationError[] => {
  const errors: ValidationError[] = [];

  // Required fields validation
  if (!settings.siteTitle?.trim()) {
    errors.push({ field: 'siteTitle', message: 'Site title is required' });
  }

  if (!settings.supportEmail?.trim()) {
    errors.push({ field: 'supportEmail', message: 'Support email is required' });
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(settings.supportEmail)) {
    errors.push({ field: 'supportEmail', message: 'Please enter a valid email address' });
  }

  if (!settings.supportPhone?.trim()) {
    errors.push({ field: 'supportPhone', message: 'Support phone is required' });
  }

  if (!settings.officeAddress?.trim()) {
    errors.push({ field: 'officeAddress', message: 'Office address is required' });
  }

  // Tax rate validation
  if (settings.taxRate !== undefined) {
    if (settings.taxRate < 0 || settings.taxRate > 100) {
      errors.push({ field: 'taxRate', message: 'Tax rate must be between 0 and 100' });
    }
  }

  // Shipping rules validation
  if (settings.shippingRules) {
    const { freeShippingThreshold, standardShippingRate, expressShippingRate } = settings.shippingRules;
    
    if (freeShippingThreshold < 0) {
      errors.push({ field: 'freeShippingThreshold', message: 'Free shipping threshold cannot be negative' });
    }
    
    if (standardShippingRate < 0) {
      errors.push({ field: 'standardShippingRate', message: 'Standard shipping rate cannot be negative' });
    }
    
    if (expressShippingRate < 0) {
      errors.push({ field: 'expressShippingRate', message: 'Express shipping rate cannot be negative' });
    }
  }

  // Social media URL validation (optional but if provided should be valid)
  if (settings.socialMedia) {
    const urlPattern = /^https?:\/\/.+/;
    
    if (settings.socialMedia.facebook && !urlPattern.test(settings.socialMedia.facebook)) {
      errors.push({ field: 'facebook', message: 'Please enter a valid Facebook URL' });
    }
    
    if (settings.socialMedia.instagram && !urlPattern.test(settings.socialMedia.instagram)) {
      errors.push({ field: 'instagram', message: 'Please enter a valid Instagram URL' });
    }
    
    if (settings.socialMedia.twitter && !urlPattern.test(settings.socialMedia.twitter)) {
      errors.push({ field: 'twitter', message: 'Please enter a valid Twitter URL' });
    }
    
    if (settings.socialMedia.youtube && !urlPattern.test(settings.socialMedia.youtube)) {
      errors.push({ field: 'youtube', message: 'Please enter a valid YouTube URL' });
    }
  }

  return errors;
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
  }).format(amount);
};