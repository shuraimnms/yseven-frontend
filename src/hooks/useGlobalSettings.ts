import { useEffect } from 'react';
import { useSettingsStore } from '@/store/settingsStore';

export const useGlobalSettings = (autoFetch = true) => {
  const { 
    settings, 
    isLoading, 
    fetchSettings, 
    shouldRefresh 
  } = useSettingsStore();

  useEffect(() => {
    if (autoFetch && shouldRefresh()) {
      fetchSettings();
    }
  }, [autoFetch, fetchSettings, shouldRefresh]);

  // Auto-refresh every 5 minutes when component is active
  useEffect(() => {
    if (!autoFetch) return;

    const interval = setInterval(() => {
      if (shouldRefresh()) {
        fetchSettings();
      }
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(interval);
  }, [autoFetch, fetchSettings, shouldRefresh]);

  return {
    settings,
    isLoading,
    refreshSettings: fetchSettings,
    // Convenience getters with fallbacks
    siteTitle: settings?.siteTitle || 'Y7 Sauces',
    supportEmail: settings?.supportEmail || 'support@ysevenfoods.com',
    supportPhone: settings?.supportPhone || '+91 9876543210',
    officeAddress: settings?.officeAddress || 'Y7 Sauces Pvt Ltd, Bangalore, Karnataka, India',
    socialMedia: settings?.socialMedia || {
      facebook: 'https://facebook.com/y7sauces',
      instagram: 'https://instagram.com/y7sauces',
      twitter: 'https://twitter.com/y7sauces',
      youtube: 'https://youtube.com/@y7sauces'
    },
    socialMediaHandles: settings?.socialMediaHandles || {
      facebook: 'y7sauces',
      instagram: 'y7sauces',
      twitter: 'y7sauces',
      youtube: 'y7sauces'
    },
    contactPageContent: settings?.contactPageContent || 'Get in touch with us for any queries or support. We are here to help you!',
    maintenanceMode: settings?.maintenanceMode || false,
    shippingRules: settings?.shippingRules || {
      freeShippingThreshold: 500,
      standardShippingRate: 50,
      expressShippingRate: 100
    },
    taxRate: settings?.taxRate || 18,
    downloadLinks: settings?.downloadLinks || {
      catalogUrl: '',
      brochureUrl: '',
      priceListUrl: '',
      certificatesUrl: ''
    }
  };
};