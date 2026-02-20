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

  // Email validation - strict format checking
  if (!settings.supportEmail?.trim()) {
    errors.push({ field: 'supportEmail', message: 'Support email is required' });
  } else {
    const trimmedEmail = settings.supportEmail.trim();
    
    // Comprehensive email validation
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    
    if (!emailPattern.test(trimmedEmail)) {
      errors.push({ 
        field: 'supportEmail', 
        message: 'Please enter a valid email address (e.g., support@domain.com)' 
      });
    }
    
    // Check for common mistakes
    if (trimmedEmail.includes('@gmail') && !trimmedEmail.includes('@gmail.')) {
      errors.push({ 
        field: 'supportEmail', 
        message: 'Invalid Gmail format. Did you mean @gmail.com?' 
      });
    }
    
    if (trimmedEmail.includes('@yahoo') && !trimmedEmail.includes('@yahoo.')) {
      errors.push({ 
        field: 'supportEmail', 
        message: 'Invalid Yahoo format. Did you mean @yahoo.com?' 
      });
    }
    
    if (trimmedEmail.includes('@hotmail') && !trimmedEmail.includes('@hotmail.')) {
      errors.push({ 
        field: 'supportEmail', 
        message: 'Invalid Hotmail format. Did you mean @hotmail.com?' 
      });
    }
    
    // Check if email ends with a valid TLD
    if (!trimmedEmail.match(/\.(com|net|org|in|co|edu|gov|io|ai|tech|info|biz)$/i)) {
      errors.push({ 
        field: 'supportEmail', 
        message: 'Email must end with a valid domain extension (e.g., .com, .net, .in)' 
      });
    }
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
    
    if (settings.socialMedia.facebook?.trim() && !urlPattern.test(settings.socialMedia.facebook)) {
      errors.push({ field: 'facebook', message: 'Please enter a valid Facebook URL (must start with http:// or https://)' });
    }
    
    if (settings.socialMedia.instagram?.trim() && !urlPattern.test(settings.socialMedia.instagram)) {
      errors.push({ field: 'instagram', message: 'Please enter a valid Instagram URL (must start with http:// or https://)' });
    }
    
    if (settings.socialMedia.twitter?.trim() && !urlPattern.test(settings.socialMedia.twitter)) {
      errors.push({ field: 'twitter', message: 'Please enter a valid Twitter URL (must start with http:// or https://)' });
    }
    
    if (settings.socialMedia.youtube?.trim() && !urlPattern.test(settings.socialMedia.youtube)) {
      errors.push({ field: 'youtube', message: 'Please enter a valid YouTube URL (must start with http:// or https://)' });
    }
  }

  // Download links URL validation (optional but if provided should be valid)
  if (settings.downloadLinks) {
    const urlPattern = /^https?:\/\/.+/;
    
    if (settings.downloadLinks.catalogUrl?.trim() && !urlPattern.test(settings.downloadLinks.catalogUrl)) {
      errors.push({ field: 'catalogUrl', message: 'Please enter a valid catalog URL (must start with http:// or https://)' });
    }
    
    if (settings.downloadLinks.brochureUrl?.trim() && !urlPattern.test(settings.downloadLinks.brochureUrl)) {
      errors.push({ field: 'brochureUrl', message: 'Please enter a valid brochure URL (must start with http:// or https://)' });
    }
    
    if (settings.downloadLinks.priceListUrl?.trim() && !urlPattern.test(settings.downloadLinks.priceListUrl)) {
      errors.push({ field: 'priceListUrl', message: 'Please enter a valid price list URL (must start with http:// or https://)' });
    }
    
    if (settings.downloadLinks.certificatesUrl?.trim() && !urlPattern.test(settings.downloadLinks.certificatesUrl)) {
      errors.push({ field: 'certificatesUrl', message: 'Please enter a valid certificates URL (must start with http:// or https://)' });
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