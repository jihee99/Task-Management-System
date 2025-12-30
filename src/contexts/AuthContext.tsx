import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AuthStore } from '@/types/auth';

const REDIRECT_PATH_KEY = 'redirect-after-login-path';

const getStoredRedirectPath = () => {
  if (typeof window === 'undefined') return null;
  try {
    return sessionStorage.getItem(REDIRECT_PATH_KEY);
  } catch {
    return null;
  }
};

const setStoredRedirectPath = (path: string | null) => {
  if (typeof window === 'undefined') return;
  try {
    if (path) {
      sessionStorage.setItem(REDIRECT_PATH_KEY, path);
    } else {
      sessionStorage.removeItem(REDIRECT_PATH_KEY);
    }
  } catch {
    // Ignore storage errors (e.g., Safari private mode).
  }
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // State
      accessToken: null,
      refreshToken: null,
      redirectAfterLoginPath: getStoredRedirectPath(),
      isAuthenticated: false,

      // Actions
      login: (tokens) => {
        console.log('[AuthStore] Setting tokens');
        set({
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
          isAuthenticated: true,
        });
      },

      logout: () => {
        console.log('[AuthStore] Clearing tokens');
        set({
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
        });
      },

      setRedirectPath: (path) => {
        set({ redirectAfterLoginPath: path });
        setStoredRedirectPath(path);
      },
    }),
    {
      name: 'auth-storage', // localStorage key
      partialize: (state) => ({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
        // Don't persist redirectAfterLoginPath
      }),
    }
  )
);
