import api from './client';
import type {
  User,
  CreateUserPayload,
  UpdateUserPayload,
  ChangeLanguagePayload,
  UserRole,
} from '@/types';

export const usersApi = {
  /** PATCH /users/me/language — change own language (any role) */
  changeLanguage: async (language: ChangeLanguagePayload['language']): Promise<User> => {
    const res = await api.patch<User>('/users/me/language', { language });
    return res.data;
  },

  /** POST /users — create a user (owner/super_admin only) */
  create: async (data: CreateUserPayload): Promise<User> => {
    const res = await api.post<User>('/users', data);
    return res.data;
  },

  /** GET /users?role= — list all users (owner/super_admin only) */
  getAll: async (role?: UserRole): Promise<User[]> => {
    const res = await api.get<User[]>('/users', { params: { role } });
    return res.data;
  },

  /** GET /users/:id */
  getById: async (id: string): Promise<User> => {
    const res = await api.get<User>(`/users/${id}`);
    return res.data;
  },

  /** PATCH /users/:id — update a user (owner/super_admin only) */
  update: async (id: string, data: UpdateUserPayload): Promise<User> => {
    const res = await api.patch<User>(`/users/${id}`, data);
    return res.data;
  },

  /** DELETE /users/:id — deactivate a user (owner/super_admin only) */
  deactivate: async (id: string): Promise<User> => {
    const res = await api.delete<User>(`/users/${id}`);
    return res.data;
  },
};
