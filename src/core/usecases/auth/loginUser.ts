import {
  authService,
  AuthResponse,
  Credentials,
  RegistrationPayload,
} from '@/infrastructure/http/authService';
import { AuthDispatch, useAuthStore } from '@/state/auth.store';

export interface LoginDependencies {
  gateway: {
    login: (payload: Credentials) => Promise<AuthResponse>;
  };
  dispatch: AuthDispatch;
}

export const createLoginUser =
  ({ gateway, dispatch }: LoginDependencies) =>
  async (payload: Credentials) => {
    const data = await gateway.login(payload);
    dispatch({
      type: 'LOGIN_SUCCESS',
      accessToken: data.accessToken,
      refreshToken: data.refreshToken || '',
    });
    return data;
  };

export interface RegisterDependencies {
  gateway: {
    register: (payload: RegistrationPayload) => Promise<AuthResponse>;
  };
  dispatch: AuthDispatch;
}

export const createRegisterUser =
  ({ gateway, dispatch }: RegisterDependencies) =>
  async (payload: RegistrationPayload) => {
    const data = await gateway.register(payload);
    dispatch({
      type: 'LOGIN_SUCCESS',
      accessToken: data.accessToken,
      refreshToken: data.refreshToken || '',
    });
    return data;
  };

export const loginUser = createLoginUser({
  gateway: authService,
  dispatch: useAuthStore.getState().dispatch,
});

export const registerUser = createRegisterUser({
  gateway: authService,
  dispatch: useAuthStore.getState().dispatch,
});

