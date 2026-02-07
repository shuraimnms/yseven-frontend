import { useEffect, ReactNode } from 'react';
import { useSettingsStore } from '@/store/settingsStore';

interface SettingsProviderProps {
  children: ReactNode;
}

export const SettingsProvider = ({ children }: SettingsProviderProps) => {
  const { fetchSettings, shouldRefresh, setSettings } = useSettingsStore();

  useEffect(() => {
    // Initial fetch on app load
    if (shouldRefresh()) {
      fetchSettings();
    }

    // Set up periodic refresh
    const interval = setInterval(() => {
      if (shouldRefresh()) {
        fetchSettings();
      }
    }, 5 * 60 * 1000); // 5 minutes

    // Listen for visibility change to refresh when user returns
    const handleVisibilityChange = () => {
      if (!document.hidden && shouldRefresh()) {
        fetchSettings();
      }
    };

    // Listen for settings updates from admin panel (same tab)
    const handleSettingsUpdate = (event: CustomEvent) => {
      console.log('🔄 Settings updated event received, refreshing all components...');
      setSettings(event.detail);
    };

    // Listen for settings updates from other tabs (cross-tab sync)
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'settingsUpdate' && event.newValue) {
        try {
          const { settings: newSettings } = JSON.parse(event.newValue);
          console.log('🔄 Settings updated from another tab, syncing...');
          setSettings(newSettings);
        } catch (error) {
          console.error('Failed to parse settings update:', error);
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('settingsUpdated', handleSettingsUpdate as EventListener);
    window.addEventListener('storage', handleStorageChange);

    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('settingsUpdated', handleSettingsUpdate as EventListener);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [fetchSettings, shouldRefresh, setSettings]);

  return <>{children}</>;
};