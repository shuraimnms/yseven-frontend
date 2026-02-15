import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { apiFetch } from '@/utils/apiUtils';

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
  siteTitle: 'Y7 Sauces',
  supportEmail: 'ysevenfoods@gmail.com',
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

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set, get) => ({
      settings: DEFAULT_SETTINGS,
      isLoading: false,
      lastFetch: 0,

      setSettings: (settings: GlobalSettings) => {
        console.log('💾 Saving settings to store:', settings.siteTitle);
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
        // Always refresh if older than 30 seconds (very aggressive)
        return now - lastFetch > 30 * 1000;
      },

      fetchSettings: async (force = false) => {
        try {
          const { setLoading, setSettings, shouldRefresh } = get();

          // Skip if recently fetched (unless forced)
          if (!force && !shouldRefresh()) {
            console.log('⏭️ Skipping settings fetch (recently fetched)');
            return;
          }

          setLoading(true);
          console.log('🔄 Fetching settings from API...');

          const response = await apiFetch('/settings/public');

          if (response.ok) {
            const data = await response.json();
            if (data.data) {
              setSettings(data.data);
              console.log('✅ Global settings updated across entire website:', data.data.siteTitle);
              console.log('📧 Support Email:', data.data.supportEmail);
              
              // Trigger a custom event to notify all components
              window.dispatchEvent(new CustomEvent('settingsUpdated', { detail: data.data }));
            }
          } else {
            console.warn('⚠️ Failed to fetch public settings, using cached/default');
          }
        } catch (error) {
          console.error('❌ Settings fetch error:', error);
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
          console.log('🔄 Rehydrated settings from storage, will fetch fresh data...');
          // Force fetch after rehydration
          setTimeout(() => {
            state.fetchSettings(true);
          }, 100);
        }
      },
    }
  )
);