import api from './api';
import { useAuthStore } from '@/store/auth.store';

export async function login(email: string, password: string) {
  const { data } = await api.post('/auth/login', { email, password });
  useAuthStore.getState().setTokens(data.accessToken, data.refreshToken || '');
  return data;
}

export async function register(email: string, password: string, name: string) {
  const { data } = await api.post('/auth/register', { email, password, name });
  useAuthStore.getState().setTokens(data.accessToken, data.refreshToken || '');
  return data;
}
