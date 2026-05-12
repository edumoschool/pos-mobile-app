import React from 'react';
import { View } from 'react-native';
import { WifiOff } from 'lucide-react-native';
import { Text } from '@/components/ui/text';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';
import { useColor } from '@/hooks/useColor';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  useAnimatedStyle,
  withTiming,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { useEffect } from 'react';

/**
 * Offline banner that slides down from the top when the device loses connectivity.
 * Place this at the top of your authenticated layout.
 */
export function OfflineBanner() {
  const { isConnected } = useNetworkStatus();
  const insets = useSafeAreaInsets();
  const orange = useColor('orange');

  const height = useSharedValue(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (!isConnected) {
      height.value = withSpring(36, { damping: 15, stiffness: 200 });
      opacity.value = withTiming(1, { duration: 300 });
    } else {
      opacity.value = withTiming(0, { duration: 200 });
      height.value = withTiming(0, { duration: 250 });
    }
  }, [isConnected]);

  const animatedStyle = useAnimatedStyle(() => ({
    height: height.value,
    opacity: opacity.value,
    overflow: 'hidden' as const,
  }));

  return (
    <Animated.View style={animatedStyle}>
      <View
        style={{
          backgroundColor: orange,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          paddingVertical: 8,
          paddingHorizontal: 16,
        }}
      >
        <WifiOff size={14} color="#fff" />
        <Text style={{ color: '#fff', fontSize: 13, fontWeight: '600' }}>
          You're offline — changes will sync when reconnected
        </Text>
      </View>
    </Animated.View>
  );
}
