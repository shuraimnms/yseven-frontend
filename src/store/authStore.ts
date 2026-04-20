import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '@/lib/supabase';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'customer';
}

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  updateUser: (user: AuthUser) => void;
}

// Fetch the user's role from the profiles table
async function fetchUserRole(userId: string): Promise<'admin' | 'customer'> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single();
    if (error) return 'customer'; // table may not exist yet
    return (data?.role as 'admin' | 'customer') || 'customer';
  } catch {
    return 'customer';
  }
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
          const { data, error } = await supabase.auth.signInWithPassword({ email, password });
          if (error) {
            // Map Supabase error codes to friendly messages
            if (error.message.includes('Invalid login credentials') || error.status === 400) {
              throw new Error('Invalid email or password. Please check your credentials.');
            }
            if (error.message.includes('Email not confirmed')) {
              throw new Error('Please confirm your email before logging in.');
            }
            throw new Error(error.message);
          }

          const session = data.session;
          const supaUser = data.user;
          if (!session || !supaUser) throw new Error('Login failed');

          const role = await fetchUserRole(supaUser.id);

          const user: AuthUser = {
            id: supaUser.id,
            name: supaUser.user_metadata?.name || email.split('@')[0],
            email: supaUser.email!,
            role,
          };

          set({ user, isAuthenticated: true, isLoading: false });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      logout: async () => {
        await supabase.auth.signOut();
        set({ user: null, isAuthenticated: false });
      },

      checkAuth: async () => {
        if (get().isLoading) return;

        // If already have a valid user, skip
        if (get().isAuthenticated && get().user) return;

        set({ isLoading: true });
        try {
          const { data: { session } } = await supabase.auth.getSession();

          if (!session?.user) {
            set({ user: null, isAuthenticated: false, isLoading: false });
            return;
          }

          const supaUser = session.user;
          const role = await fetchUserRole(supaUser.id);

          const user: AuthUser = {
            id: supaUser.id,
            name: supaUser.user_metadata?.name || supaUser.email!.split('@')[0],
            email: supaUser.email!,
            role,
          };

          set({ user, isAuthenticated: true, isLoading: false });
        } catch {
          set({ user: null, isAuthenticated: false, isLoading: false });
        }
      },

      updateUser: (user: AuthUser) => set({ user }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
);
