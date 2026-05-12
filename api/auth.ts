import { storage } from './storage';
import api from './client';
import type { AuthResponse, LoginPayload, RegisterPayload, User, Session } from '@/types';

export const authApi = {
  register: async (data: RegisterPayload): Promise<AuthResponse> => {
    const res = await api.post<AuthResponse>('/auth/register', data);
    await storage.setItem('access_token', res.data.accessToken);
    return res.data;
  },

  login: async (data: LoginPayload): Promise<AuthResponse> => {
    const res = await api.post<AuthResponse>('/auth/login', data);
    await storage.setItem('access_token', res.data.accessToken);
    return res.data;
  },

  getProfile: async (): Promise<User> => {
    const res = await api.get<User>('/auth/profile');
    return res.data;
  },

  logout: async () => {
    try {
      await api.post('/auth/logout');
    } catch {
      // ignore — token may already be invalid
    }
    await storage.deleteItem('access_token');
  },

  /** Check if a token exists in secure storage */
  hasToken: async (): Promise<boolean> => {
    const token = await storage.getItem('access_token');
    return !!token;
  },

  /** Get all active sessions (with isCurrent flag) */
  getSessions: async (): Promise<Session[]> => {
    const res = await api.get<Session[]>('/auth/sessions');
    return res.data;
  },

  /** Logout all sessions */
  logoutAllSessions: async (): Promise<void> => {
    await api.post('/auth/logout-all');
  },

  /** Revoke a specific session */
  revokeSession: async (id: string): Promise<void> => {
    await api.delete(`/auth/sessions/${id}`);
  },
};