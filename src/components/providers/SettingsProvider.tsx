import { useEffect, ReactNode } from 'react';
import { useSettingsStore } from '@/store/settingsStore';

interface SettingsProviderProps {
  children: ReactNode;
}

export const SettingsProvider = ({ children }: SettingsProviderProps) => {
  const { fetchSettings, shouldRefresh } = useSettingsStore();

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

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [fetchSettings, shouldRefresh]);

  return <>{children}</>;
};