import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type AuthEvent =
  | { type: 'LOGIN_SUCCESS'; accessToken: string; refreshToken: string }
  | { type: 'TOKEN_REFRESHED'; accessToken: string; refreshToken?: string | null }
  | { type: 'LOGOUT' }
  | { type: 'HYDRATION_COMPLETE' };

export type AuthDispatch = (event: AuthEvent) => void;

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  hydrated: boolean;
  dispatch: AuthDispatch;
}

const syncAccessCookie = (token: string | null) => {
  if (typeof document === 'undefined') return;
  if (token) {
    document.cookie = `accessToken=${token}; path=/; sameSite=Lax`;
  } else {
    document.cookie = 'accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; sameSite=Lax';
  }
};

const reduceEvent = (state: AuthState, event: AuthEvent): Partial<AuthState> => {
  switch (event.type) {
    case 'LOGIN_SUCCESS':
      return { accessToken: event.accessToken, refreshToken: event.refreshToken };
    case 'TOKEN_REFRESHED':
      return {
        accessToken: event.accessToken,
        refreshToken: event.refreshToken ?? state.refreshToken,
      };
    case 'LOGOUT':
      return { accessToken: null, refreshToken: null };
    case 'HYDRATION_COMPLETE':
      return { hydrated: true };
    default:
      return {};
  }
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      accessToken: null,
      refreshToken: null,
      hydrated: false,
      dispatch: (event) => {
        set((current) => {
          const patch = reduceEvent(current, event);
          if (Object.prototype.hasOwnProperty.call(patch, 'accessToken')) {
            syncAccessCookie(patch.accessToken ?? null);
          }
          if (event.type === 'LOGOUT') {
            syncAccessCookie(null);
          }
          return { ...current, ...patch };
        });
      },
    }),
    {
      name: 'auth-storage',
      onRehydrateStorage: () => (state) => {
        if (!state) return;
        syncAccessCookie(state.accessToken);
        state.dispatch({ type: 'HYDRATION_COMPLETE' });
      },
    },
  ),
);

