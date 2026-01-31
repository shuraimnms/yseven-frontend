import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@/types';
import { authAPI } from '@/lib/api';
import Cookies from 'js-cookie';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: { name: string; email: string; phone: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  updateUser: (user: User) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (email: string, password: string) => {
        set({ isLoading: true });
        try {
          const response = await authAPI.login({ email, password });
          if (response.data.success) {
            const user = response.data.data.user;
            set({ user, isAuthenticated: true, isLoading: false });
          }
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      register: async (data) => {
        set({ isLoading: true });
        try {
          const response = await authAPI.register(data);
          if (response.data.success) {
            const user = response.data.data.user;
            set({ user, isAuthenticated: true, isLoading: false });
          }
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      logout: async () => {
        try {
          await authAPI.logout();
        } catch (error) {
          console.error('Logout error:', error);
        } finally {
          Cookies.remove('accessToken');
          Cookies.remove('refreshToken');
          set({ user: null, isAuthenticated: false });
        }
      },

      checkAuth: async () => {
        console.log('AuthStore: Starting checkAuth...');
        
        // If already checking, don't check again
        if (get().isLoading) {
          console.log('AuthStore: Already checking, skipping...');
          return;
        }
        
        const token = Cookies.get('accessToken');
        console.log('AuthStore: Token found:', !!token);
        
        if (!token) {
          console.log('AuthStore: No token, setting unauthenticated');
          set({ user: null, isAuthenticated: false, isLoading: false });
          return;
        }

        // If we already have a user and are authenticated, don't check again unless forced
        const currentState = get();
        if (currentState.isAuthenticated && currentState.user) {
          console.log('AuthStore: Already authenticated, skipping API call');
          return;
        }

        set({ isLoading: true });
        try {
          console.log('AuthStore: Making API call to /auth/me');
          const response = await authAPI.getMe();
          console.log('AuthStore: API response:', response.data);
          
          if (response.data.success) {
            const user = response.data.data.user;
            console.log('AuthStore: User authenticated:', user);
            set({ user, isAuthenticated: true, isLoading: false });
          } else {
            console.log('AuthStore: API returned success: false');
            // Don't immediately log out, might be a temporary issue
            set({ isLoading: false });
          }
        } catch (error) {
          console.error('AuthStore: Auth check error:', error);
          
          // Only log out if it's a 401 (unauthorized) error
          if (error.response?.status === 401) {
            console.log('AuthStore: 401 error, logging out');
            set({ user: null, isAuthenticated: false, isLoading: false });
            Cookies.remove('accessToken');
            Cookies.remove('refreshToken');
          } else {
            console.log('AuthStore: Non-401 error, keeping current state');
            set({ isLoading: false });
          }
        }
      },

      updateUser: (user: User) => {
        set({ user });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
);