import { storage } from './storage';
import api from './client';
import type {
  AuthResponse,
  LoginPayload,
  RegisterPayload,
  ChangePasswordPayload,
  User,
  Session,
  MessageResponse,
  SseEvent,
} from '@/types';

export const authApi = {
  // ─── Public endpoints ───────────────────────────────────────────────

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

  // ─── Protected endpoints ────────────────────────────────────────────

  /** GET /auth/profile — includes tenant & branch relations */
  getProfile: async (): Promise<User> => {
    const res = await api.get<User>('/auth/profile');
    return res.data;
  },

  /** POST /auth/logout — blacklists the current session JWT */
  logout: async (): Promise<void> => {
    try {
      await api.post<MessageResponse>('/auth/logout');
    } catch {
      // ignore — token may already be invalid
    }
    await storage.deleteItem('access_token');
    await storage.deleteItem('user_data');
  },

  /** POST /auth/logout-all — revokes every session for the current user */
  logoutAll: async (): Promise<void> => {
    await api.post<MessageResponse>('/auth/logout-all');
  },

  /** PATCH /auth/change-password — verifies the current password server-side */
  changePassword: async (data: ChangePasswordPayload): Promise<MessageResponse> => {
    const res = await api.patch<MessageResponse>('/auth/change-password', data);
    return res.data;
  },

  // ─── Session management ─────────────────────────────────────────────

  /** GET /auth/sessions — list active sessions (each has isCurrent flag) */
  getSessions: async (): Promise<Session[]> => {
    const res = await api.get<Session[]>('/auth/sessions');
    return res.data;
  },

  /** DELETE /auth/sessions/:id — revoke a specific session */
  revokeSession: async (sessionId: string): Promise<MessageResponse> => {
    const res = await api.delete<MessageResponse>(`/auth/sessions/${sessionId}`);
    return res.data;
  },

  // ─── SSE (Server-Sent Events) ───────────────────────────────────────

  /**
   * Subscribe to real-time session events.
   * Returns an EventSource that emits `session_revoked` or `user_deactivated`.
   * The app should listen and force-logout when the current session is revoked.
   *
   * Usage:
   *   const es = authApi.subscribeToEvents(token);
   *   es.onmessage = (e) => { const data: SseEvent = JSON.parse(e.data); ... };
   *   es.onerror = () => es.close();
   */
  subscribeToEvents: (accessToken: string): EventSource => {
    const url = `${api.defaults.baseURL}/auth/events`;
    // EventSource doesn't support Authorization header natively;
    // the backend should accept ?token= or use polyfill (e.g. eventsource-polyfill)
    return new EventSource(url);
  },

  // ─── Helpers ────────────────────────────────────────────────────────

  /** Check if a token exists in secure storage */
  hasToken: async (): Promise<boolean> => {
    const token = await storage.getItem('access_token');
    return !!token;
  },
};