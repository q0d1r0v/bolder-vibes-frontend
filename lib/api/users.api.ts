import api from './axios';
import type { User, PaginatedResponse, PaginationParams } from '@/types';

export interface UpdateUserRequest {
  name?: string;
  role?: 'USER' | 'ADMIN';
}

export async function getUsers(params?: PaginationParams): Promise<PaginatedResponse<User>> {
  const res = await api.get<PaginatedResponse<User>>('/users', { params });
  return res.data;
}

export async function getUser(id: string): Promise<User> {
  const res = await api.get<User>(`/users/${id}`);
  return res.data;
}

export async function updateUser(id: string, data: UpdateUserRequest): Promise<User> {
  const res = await api.patch<User>(`/users/${id}`, data);
  return res.data;
}

export async function deleteUser(id: string): Promise<void> {
  await api.delete(`/users/${id}`);
}
