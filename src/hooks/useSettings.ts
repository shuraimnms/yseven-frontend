import { useState, useEffect } from 'react';
import { apiFetch } from '@/utils/apiUtils';

interface DownloadLinks {
  catalogUrl: string;
  brochureUrl: string;
  priceListUrl: string;
  certificatesUrl: string;
}

interface Settings {
  siteTitle: string;
  supportEmail: string;
  supportPhone: string;
  officeAddress: string;
  socialMedia: {
    facebook: string;
    instagram: string;
    twitter: string;
    youtube: string;
  };
  socialMediaHandles: {
    facebook: string;
    instagram: string;
    twitter: string;
    youtube: string;
  };
  taxRate: number;
  shippingRules: {
    freeShippingThreshold: number;
    standardShippingRate: number;
    expressShippingRate: number;
  };
  maintenanceMode: boolean;
  contactPageContent: string;
  downloadLinks: DownloadLinks;
}

const defaultSettings: Settings = {
  siteTitle: 'Y7 Sauces',
  supportEmail: 'support@y7sauces.com',
  supportPhone: '+91 9876543210',
  officeAddress: 'Y7 Sauces Pvt Ltd, Bangalore, Karnataka, India',
  socialMedia: {
    facebook: 'https://facebook.com/y7sauces',
    instagram: 'https://instagram.com/y7sauces',
    twitter: 'https://twitter.com/y7sauces',
    youtube: 'https://youtube.com/@y7sauces'
  },
  socialMediaHandles: {
    facebook: 'y7sauces',
    instagram: 'y7sauces',
    twitter: 'y7sauces',
    youtube: 'y7sauces'
  },
  taxRate: 18,
  shippingRules: {
    freeShippingThreshold: 500,
    standardShippingRate: 50,
    expressShippingRate: 100
  },
  maintenanceMode: false,
  contactPageContent: 'Get in touch with us for any queries or support. We are here to help you!',
  downloadLinks: {
    catalogUrl: '',
    brochureUrl: '',
    priceListUrl: '',
    certificatesUrl: ''
  }
};

export const useSettings = () => {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSettings = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await apiFetch('/admin/settings/public');
      
      if (response.ok) {
        const data = await response.json();
        if (data.data) {
          setSettings(data.data);
        }
      } else {
        // Use default settings if fetch fails
        console.warn('Settings fetch failed, using defaults');
      }
      
    } catch (error) {
      console.error('Settings fetch error:', error);
      setError('Failed to load settings');
      // Keep default settings if fetch fails
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return {
    settings,
    isLoading,
    error,
    refetch: fetchSettings
  };
};

export type { Settings, DownloadLinks };