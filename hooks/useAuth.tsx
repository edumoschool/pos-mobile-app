import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { authApi } from '@/api/auth';
import { notificationsApi } from '@/api/notifications';
import { storage } from '@/api/storage';
import { setOnUnauthorized } from '@/api/client';
import { useRouter, useSegments } from 'expo-router';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import type { User, AuthResponse } from '@/types';

// ─── Types ──────────────────────────────────────────────────────────────────

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

interface AuthContextType extends AuthState {
  login: (phone: string, password: string) => Promise<void>;
  register: (phone: string, password: string, fullName: string, tenantName: string, language?: 'en' | 'uz' | 'ru') => Promise<void>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

// ─── Provider ───────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
  });

  const router = useRouter();
  const segments = useSegments();

  // ── Bootstrap: check for existing token on app launch ──────────────
  useEffect(() => {
    (async () => {
      try {
        const hasToken = await authApi.hasToken();
        if (hasToken) {
          const user = await authApi.getProfile();
          setState({ user, isLoading: false, isAuthenticated: true });
          // Register push token after successful auth bootstrap
          registerPushToken();
        } else {
          setState({ user: null, isLoading: false, isAuthenticated: false });
        }
      } catch {
        // Token is invalid or expired — clear it
        await storage.deleteItem('access_token');
        await storage.deleteItem('user_data');
        setState({ user: null, isLoading: false, isAuthenticated: false });
      }
    })();
  }, []);

  // ── Route guard: redirect unauthenticated users ────────────────────
  useEffect(() => {
    if (state.isLoading) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (!state.isAuthenticated && !inAuthGroup) {
      router.replace('/(auth)/login');
    } else if (state.isAuthenticated && inAuthGroup) {
      router.replace('/(tabs)/(home)' as any);
    }
  }, [state.isAuthenticated, state.isLoading, segments]);

  // ── Wire up the 401 interceptor to force logout ────────────────────
  useEffect(() => {
    setOnUnauthorized(() => {
      setState({ user: null, isLoading: false, isAuthenticated: false });
    });
    return () => setOnUnauthorized(null);
  }, []);

  // ── Push notification token registration ───────────────────────────
  const registerPushToken = useCallback(async () => {
    try {
      if (Platform.OS === 'web') return;
      const { granted } = (await Notifications.getPermissionsAsync()) as any;
      if (!granted) {
        const { granted: newGranted } = (await Notifications.requestPermissionsAsync()) as any;
        if (!newGranted) return;
      }
      const { data: token } = await Notifications.getExpoPushTokenAsync();
      await notificationsApi.registerToken(token);
    } catch {
      // Silently fail — push tokens are best-effort
    }
  }, []);

  // ── Auth actions ───────────────────────────────────────────────────

  const login = useCallback(async (phone: string, password: string) => {
    const res: AuthResponse = await authApi.login({ phone, password });
    await storage.setItem('user_data', JSON.stringify(res.user));
    setState({ user: res.user, isLoading: false, isAuthenticated: true });
    registerPushToken();
  }, [registerPushToken]);

  const register = useCallback(async (
    phone: string,
    password: string,
    fullName: string,
    tenantName: string,
    language?: 'en' | 'uz' | 'ru',
  ) => {
    const res: AuthResponse = await authApi.register({
      phone, password, fullName, tenantName, language,
    });
    await storage.setItem('user_data', JSON.stringify(res.user));
    setState({ user: res.user, isLoading: false, isAuthenticated: true });
    registerPushToken();
  }, [registerPushToken]);

  const logout = useCallback(async () => {
    try {
      if (Platform.OS !== 'web') {
        await notificationsApi.removeToken();
      }
    } catch { /* ignore */ }
    await authApi.logout();
    setState({ user: null, isLoading: false, isAuthenticated: false });
  }, []);

  const refreshProfile = useCallback(async () => {
    const user = await authApi.getProfile();
    await storage.setItem('user_data', JSON.stringify(user));
    setState((prev) => ({ ...prev, user }));
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

// ─── Hook ───────────────────────────────────────────────────────────────────

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}
