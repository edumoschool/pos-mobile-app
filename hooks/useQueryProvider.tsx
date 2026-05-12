import React from 'react';
import {
  QueryClient,
  QueryClientProvider,
  focusManager,
  onlineManager,
} from '@tanstack/react-query';
import NetInfo from '@react-native-community/netinfo';
import { AppState, AppStateStatus, Platform } from 'react-native';
import { useEffect } from 'react';

// ─── Online Manager ─────────────────────────────────────────────────────────
// Hook NetInfo into React Query's online manager so it knows when we're offline
onlineManager.setEventListener((setOnline) => {
  return NetInfo.addEventListener((state) => {
    setOnline(!!state.isConnected);
  });
});

// ─── Focus Manager ──────────────────────────────────────────────────────────
// Refetch on app focus (mobile-specific — browser does this by default)
function useAppStateFocus() {
  useEffect(() => {
    const subscription = AppState.addEventListener(
      'change',
      (status: AppStateStatus) => {
        if (Platform.OS !== 'web') {
          focusManager.setFocused(status === 'active');
        }
      },
    );
    return () => subscription.remove();
  }, []);
}

// ─── Query Client ───────────────────────────────────────────────────────────
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Keep data fresh for 2 minutes
      staleTime: 2 * 60 * 1000,
      // Cache for 30 minutes (offline reads)
      gcTime: 30 * 60 * 1000,
      // Retry failed requests 2 times
      retry: 2,
      // Don't refetch when window refocuses on mobile (too aggressive)
      refetchOnWindowFocus: false,
      // Show stale data while revalidating
      refetchOnReconnect: 'always',
    },
    mutations: {
      // Retry mutations once
      retry: 1,
    },
  },
});

// ─── Provider ───────────────────────────────────────────────────────────────

export function QueryProvider({ children }: { children: React.ReactNode }) {
  useAppStateFocus();

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}

export { queryClient };
