import { useEffect, ReactNode } from 'react';
import { useSettingsStore } from '@/store/settingsStore';

interface SettingsProviderProps {
  children: ReactNode;
}

export const SettingsProvider = ({ children }: SettingsProviderProps) => {
  const { fetchSettings, setSettings } = useSettingsStore();

  useEffect(() => {
    // ALWAYS fetch fresh settings on mount
    console.log('🚀 SettingsProvider mounted, fetching fresh settings...');
    fetchSettings(true);

    // Set up aggressive periodic refresh every 30 seconds
    const interval = setInterval(() => {
      console.log('⏰ Periodic settings refresh...');
      fetchSettings(true);
    }, 30 * 1000); // 30 seconds

    // Listen for visibility change to refresh when user returns
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        console.log('👁️ Tab visible again, refreshing settings...');
        fetchSettings(true); // Force refresh when tab becomes visible
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
          const { settings: newSettings, action } = JSON.parse(event.newValue);
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
      console.log('🎯 Window focused, fetching fresh settings...');
      fetchSettings(true);
    };

    // Listen for page show event (back/forward navigation)
    const handlePageShow = (event: PageTransitionEvent) => {
      if (event.persisted) {
        console.log('🔙 Page restored from cache, fetching fresh settings...');
        fetchSettings(true);
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