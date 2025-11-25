import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  hydrated: boolean;
  setTokens: (access: string, refresh: string) => void;
  clear: () => void;
  markHydrated: () => void;
}

const syncAccessCookie = (token: string | null) => {
  if (typeof document === 'undefined') return;
  if (token) {
    document.cookie = `accessToken=${token}; path=/; sameSite=Lax`;
  } else {
    document.cookie = 'accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; sameSite=Lax';
  }
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      accessToken: null,
      refreshToken: null,
      hydrated: false,
      setTokens: (access, refresh) => {
        syncAccessCookie(access);
        set({ accessToken: access, refreshToken: refresh });
      },
      clear: () => {
        syncAccessCookie(null);
        set({ accessToken: null, refreshToken: null });
      },
      markHydrated: () => {
        syncAccessCookie(get().accessToken);
        set({ hydrated: true });
      },
    }),
    {
      name: 'auth-storage',
      onRehydrateStorage: () => (state) => {
        state?.markHydrated();
      },
    },
  ),
);
