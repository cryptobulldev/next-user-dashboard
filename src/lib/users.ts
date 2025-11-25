// src/lib/users.ts
import api from './api';

export interface UserPayload {
  id?: string;
  name: string;
  email: string;
  password?: string;
}

export async function getUsers(page = 1, limit = 10) {
  const { data } = await api.get(`/users`, { params: { page, limit } });
  return data;
}

export async function getUserById(id: string) {
  const { data } = await api.get(`/users/${id}`);
  return data;
}

export async function createUser(payload: UserPayload) {
  const { data } = await api.post(`/users`, payload);
  return data;
}

export async function updateUser(id: string, payload: Partial<UserPayload>) {
  const { data } = await api.patch(`/users/${id}`, payload);
  return data;
}

export async function deleteUser(id: string) {
  const { data } = await api.delete(`/users/${id}`);
  return data;
}
