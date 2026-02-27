import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { apiFetch } from '@/utils/apiUtils';

export interface GlobalSettings {
  siteTitle: string;
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
  downloadLinks: {
    catalogUrl: string;
    brochureUrl: string;
    priceListUrl: string;
    certificatesUrl: string;
  };
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
  siteTitle: 'YSeven Foods',
  supportPhone: '+91 9876543210',
  officeAddress: 'YSeven Foods Pvt Ltd, Bangalore, Karnataka, India',
  socialMedia: {
    facebook: 'https://facebook.com/ysevenfoods',
    instagram: 'https://instagram.com/ysevenfoods',
    twitter: 'https://twitter.com/ysevenfoods',
    youtube: 'https://youtube.com/@ysevenfoods'
  },
  socialMediaHandles: {
    facebook: 'ysevenfoods',
    instagram: 'ysevenfoods',
    twitter: 'ysevenfoods',
    youtube: 'ysevenfoods'
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
        // Refresh if older than 5 minutes
        return now - lastFetch > 5 * 60 * 1000;
      },

      fetchSettings: async (force = false) => {
        try {
          const { setLoading, setSettings, shouldRefresh } = get();

          // Skip if recently fetched (unless forced)
          if (!force && !shouldRefresh()) {
            return;
          }

          setLoading(true);

          const response = await apiFetch('/admin/settings/public');

          if (response.ok) {
            const data = await response.json();
            if (data.data) {
              setSettings(data.data);
              // Trigger a custom event to notify all components
              window.dispatchEvent(new CustomEvent('settingsUpdated', { detail: data.data }));
            }
          }
        } catch (error) {
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
      // Force rehydration on every mount
      onRehydrateStorage: () => (state) => {
        if (state) {
          // Force fetch after rehydration
          setTimeout(() => {
            state.fetchSettings();
          }, 100);
        }
      },
    }
  )
);
