import { useEffect, ReactNode } from 'react';
import { useSettingsStore } from '@/store/settingsStore';

interface SettingsProviderProps {
  children: ReactNode;
}

export const SettingsProvider = ({ children }: SettingsProviderProps) => {
  const { fetchSettings, setSettings } = useSettingsStore();

  useEffect(() => {
    // Fetch on mount, but do not force hard refresh every time.
    fetchSettings();

    // Periodic refresh (5 min) to reduce noisy retries on temporary API errors.
    const interval = setInterval(() => {
      fetchSettings();
    }, 5 * 60 * 1000);

    // Listen for visibility change to refresh when user returns
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        fetchSettings();
      }
    };

    // Listen for settings updates from admin panel (same tab)
    const handleSettingsUpdate = (event: CustomEvent) => {
      console.log('🔄 Settings updated event received, refreshing all components...');
      console.log('📧 New settings:', event.detail);
      setSettings(event.detail);
      
      // Force re-render by updating localStorage timestamp
      localStorage.setItem('y7-settings-last-update', Date.now().toString());
    };

    // Listen for settings updates from other tabs (cross-tab sync)
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'settingsUpdate' && event.newValue) {
        try {
          const { settings: newSettings } = JSON.parse(event.newValue);
          console.log('🔄 Settings updated from another tab, syncing...');
          console.log('📧 New settings from storage:', newSettings);
          setSettings(newSettings);
        } catch (error) {
          console.error('Failed to parse settings update:', error);
        }
      }
      
      // Also listen for direct storage updates
      if (event.key === 'y7-settings-storage' && event.newValue) {
        try {
          const { state } = JSON.parse(event.newValue);
          console.log('🔄 Settings storage updated, syncing...');
          setSettings(state.settings);
        } catch (error) {
          console.error('Failed to parse storage update:', error);
        }
      }
    };

    // Listen for focus event to refresh settings
    const handleFocus = () => {
      fetchSettings();
    };

    // Listen for page show event (back/forward navigation)
    const handlePageShow = (event: PageTransitionEvent) => {
      if (event.persisted) {
        fetchSettings();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('settingsUpdated', handleSettingsUpdate as EventListener);
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('focus', handleFocus);
    window.addEventListener('pageshow', handlePageShow);

    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('settingsUpdated', handleSettingsUpdate as EventListener);
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('pageshow', handlePageShow);
    };
  }, [fetchSettings, setSettings]);

  return <>{children}</>;
};