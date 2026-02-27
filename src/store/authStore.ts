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
          // Silent error handling
        } finally {
          Cookies.remove('accessToken');
          Cookies.remove('refreshToken');
          set({ user: null, isAuthenticated: false });
        }
      },

      checkAuth: async () => {
        // If already checking, don't check again
        if (get().isLoading) {
          return;
        }
        
        const token = Cookies.get('accessToken');
        
        if (!token) {
          set({ user: null, isAuthenticated: false, isLoading: false });
          return;
        }

        // If we already have a user and are authenticated, don't check again unless forced
        const currentState = get();
        if (currentState.isAuthenticated && currentState.user) {
          return;
        }

        set({ isLoading: true });
        try {
          const response = await authAPI.getMe();
          
          if (response.data.success) {
            const user = response.data.data.user;
            set({ user, isAuthenticated: true, isLoading: false });
          } else {
            // Don't immediately log out, might be a temporary issue
            set({ isLoading: false });
          }
        } catch (error: any) {
          // Only log out if it's a 401 (unauthorized) error
          if (error.response?.status === 401) {
            set({ user: null, isAuthenticated: false, isLoading: false });
            Cookies.remove('accessToken');
            Cookies.remove('refreshToken');
          } else {
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
