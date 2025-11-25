import apiClient from './apiClient';

export interface Credentials {
  email: string;
  password: string;
}

export interface RegistrationPayload extends Credentials {
  name: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken?: string;
  [key: string]: unknown;
}

export const authService = {
  login: async (payload: Credentials): Promise<AuthResponse> => {
    const { data } = await apiClient.post('/auth/login', payload);
    return data;
  },
  register: async (payload: RegistrationPayload): Promise<AuthResponse> => {
    const { data } = await apiClient.post('/auth/register', payload);
    return data;
  },
};

export type AuthService = typeof authService;

