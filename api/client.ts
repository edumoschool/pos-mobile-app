import { AxiosError, create } from 'axios';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import i18n from '@/i18n';
import { storage } from '@/api/storage';
import { API_URL } from '@/api/config';

const userAgent = `${Device.modelName ?? 'Unknown'} (${Platform.OS} ${Device.osVersion ?? ''})`;

const api = create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'User-Agent': userAgent,
  },
});

// Attach JWT + the active UI language to every request.
// The backend localises error messages and report exports from the
// authenticated user's stored language, falling back to this header
// (used for pre-login requests such as login/register).
api.interceptors.request.use(async (config) => {
  const token = await storage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  config.headers['Accept-Language'] = i18n.language || 'uz';
  return config;
});

// Global logout callback – set by AuthProvider so 401s trigger a full logout
let onUnauthorized: (() => void) | null = null;
export const setOnUnauthorized = (cb: (() => void) | null) => {
  onUnauthorized = cb;
};

// Handle 401 globally – only logout when the server explicitly rejects the token,
// not on network errors (offline / timeout)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await storage.deleteItem('access_token');
      await storage.deleteItem('user_data');
      onUnauthorized?.();
    }
    return Promise.reject(error);
  },
);

export default api;

/** Extract a user-friendly error message from API errors */
export const getApiErrorMessage = (error: unknown): string => {
  if (error instanceof AxiosError) {
    const data = error.response?.data;
    if (!data) return 'Network error. Check your connection.';
    if (Array.isArray(data.message)) return data.message.join('\n');
    return data.message || 'Something went wrong';
  }
  return 'An unexpected error occurred';
};