import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface GlobalSettings {
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
  lastUpdated?: string;
}

interface SettingsStore {
  settings: GlobalSettings;
  isLoading: boolean;
  lastFetch: number;
  setSettings: (settings: GlobalSettings) => void;
  setLoading: (loading: boolean) => void;
  fetchSettings: () => Promise<void>;
  shouldRefresh: () => boolean;
}

const DEFAULT_SETTINGS: GlobalSettings = {
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
  contactPageContent: 'Get in touch with us for any queries or support. We are here to help you!'
};

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set, get) => ({
      settings: DEFAULT_SETTINGS,
      isLoading: false,
      lastFetch: 0,

      setSettings: (settings: GlobalSettings) => {
        set({ 
          settings: { ...settings, lastUpdated: new Date().toISOString() },
          lastFetch: Date.now()
        });
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      shouldRefresh: () => {
        const { lastFetch } = get();
        const now = Date.now();
        // Refresh if data is older than 5 minutes
        return now - lastFetch > 5 * 60 * 1000;
      },

      fetchSettings: async () => {
        try {
          const { setLoading, setSettings, shouldRefresh } = get();
          
          // Skip if recently fetched
          if (!shouldRefresh()) {
            return;
          }

          setLoading(true);

          const response = await fetch('/api/v1/settings/public', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json'
            }
          });

          if (response.ok) {
            const data = await response.json();
            if (data.data) {
              setSettings(data.data);
              console.log('Global settings updated:', data.data.siteTitle);
            }
          } else {
            console.warn('Failed to fetch public settings, using cached/default');
          }
        } catch (error) {
          console.error('Settings fetch error:', error);
          // Keep existing settings on error
        } finally {
          set({ isLoading: false });
        }
      }
    }),
    {
      name: 'y7-settings-storage',
      partialize: (state) => ({ 
        settings: state.settings, 
        lastFetch: state.lastFetch 
      }),
    }
  )
);