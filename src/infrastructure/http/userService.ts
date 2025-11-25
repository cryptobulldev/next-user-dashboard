import apiClient from './apiClient';
import { PaginatedUsersParams, UsersResponse } from '@/core/domain/user';

export interface UserPayload {
  id?: string;
  name: string;
  email: string;
  password?: string;
}

export const userService = {
  getUsers: async ({ page = 1, limit = 10, search = '' }: PaginatedUsersParams = {}) => {
    const { data } = await apiClient.get<UsersResponse>('/users', {
      params: { page, limit, search },
    });
    return data;
  },
  getUserById: async (id: string) => {
    const { data } = await apiClient.get(`/users/${id}`);
    return data;
  },
  createUser: async (payload: UserPayload) => {
    const { data } = await apiClient.post('/users', payload);
    return data;
  },
  updateUser: async (id: string, payload: Partial<UserPayload>) => {
    const { data } = await apiClient.patch(`/users/${id}`, payload);
    return data;
  },
  deleteUser: async (id: string) => {
    const { data } = await apiClient.delete(`/users/${id}`);
    return data;
  },
};

export type UserService = typeof userService;

