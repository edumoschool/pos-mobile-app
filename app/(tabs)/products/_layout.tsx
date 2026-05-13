import { Stack } from 'expo-router';
import { Platform, useColorScheme } from 'react-native';
import { isLiquidGlassAvailable } from 'expo-glass-effect';
import { useColor } from '@/hooks/useColor';

export default function ProductsLayout() {
  const theme = useColorScheme();
  const text = useColor('text');
  const background = useColor('background');

  return (
    <Stack
      screenOptions={{
        headerLargeTitle: false,
        headerTransparent: true,
        headerTintColor: text,
        headerBlurEffect: isLiquidGlassAvailable()
          ? undefined
          : theme === 'dark'
            ? 'systemMaterialDark'
            : 'systemMaterialLight',
        headerStyle: {
          backgroundColor: isLiquidGlassAvailable()
            ? 'transparent'
            : background,
        },
      }}
    >
      <Stack.Screen
        name='index'
        options={{
          headerShown: false,
        }}
      />    </Stack>
  );
}
