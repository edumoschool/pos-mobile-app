import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/theme/colors';
import { ThemeProvider } from '@/theme/theme-provider';
import { AuthProvider } from '@/hooks/useAuth';
import { QueryProvider } from '@/hooks/useQueryProvider';
import { PinLockProvider, usePinLock } from '@/hooks/usePinLock';
import { PinLockScreen } from '@/components/pin-lock-screen';
import { ToastProvider } from '@/components/ui/toast';
import * as NavigationBar from 'expo-navigation-bar';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { setBackgroundColorAsync } from 'expo-system-ui';
import React, { useEffect } from 'react';
import { Platform } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-reanimated';
import '@/i18n';

SplashScreen.setOptions({
  duration: 200,
  fade: true,
});

function RootNavigator() {
  const { isReady, isLocked } = usePinLock();

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name='(auth)' options={{ headerShown: false }} />
        <Stack.Screen name='(tabs)' options={{ headerShown: false }} />
        <Stack.Screen name='products/index' />
        <Stack.Screen name='products/new' options={{ headerShown: false }} />
        <Stack.Screen name='products/[id]/index' options={{ headerShown: false }} />
        <Stack.Screen name='transactions/create' />
        <Stack.Screen name='transactions/[id]/index' />
        <Stack.Screen name='sales/create' options={{ headerShown: false }} />
        <Stack.Screen name='sales/[id]/index' options={{ headerShown: false }} />
        <Stack.Screen name='settings/profile' options={{ headerShown: false }} />
        <Stack.Screen name='settings/password' options={{ headerShown: false }} />
        <Stack.Screen name='settings/business' options={{ headerShown: false }} />
        <Stack.Screen name='settings/branches/index' options={{ headerShown: false }} />
        <Stack.Screen name='settings/branches/[id]' options={{ headerShown: false }} />
        <Stack.Screen name='settings/catalog/[type]' options={{ headerShown: false }} />
        <Stack.Screen name='settings/subscription' options={{ headerShown: false }} />
        <Stack.Screen name='settings/security' options={{ headerShown: false }} />
        <Stack.Screen name='settings/sessions' options={{ headerShown: false }} />
        <Stack.Screen name='staff/create' options={{ headerShown: false }} />
        <Stack.Screen name='staff/[id]/index' options={{ headerShown: false }} />
        <Stack.Screen name='staff/[id]/edit' options={{ headerShown: false }} />
        <Stack.Screen name='admin/tenants/index' options={{ headerShown: false }} />
        <Stack.Screen name='admin/tenants/[id]' options={{ headerShown: false }} />
        <Stack.Screen name='admin/plans/index' options={{ headerShown: false }} />
        <Stack.Screen name='admin/plans/[id]' options={{ headerShown: false }} />
        <Stack.Screen name='inventory/index' options={{ headerShown: false }} />
        <Stack.Screen name='inventory/[id]' options={{ headerShown: false }} />
        <Stack.Screen name='+not-found' />
      </Stack>

      {isReady && isLocked && <PinLockScreen />}
    </>
  );
}

export default function RootLayout() {
  const colorScheme = useColorScheme() || 'light';

  useEffect(() => {
    if (Platform.OS === 'android') {
      NavigationBar.setButtonStyleAsync(
        colorScheme === 'light' ? 'dark' : 'light'
      );
    }
  }, [colorScheme]);

  // Keep the root view background color in sync with the current theme
  useEffect(() => {
    setBackgroundColorAsync(
      colorScheme === 'dark' ? Colors.dark.background : Colors.light.background
    );
  }, [colorScheme]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <QueryProvider>
          <ToastProvider>
            <PinLockProvider>
              <AuthProvider>
                <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} animated />
                <RootNavigator />
              </AuthProvider>
            </PinLockProvider>
          </ToastProvider>
        </QueryProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
