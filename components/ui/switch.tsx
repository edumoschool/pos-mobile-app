import { useColor } from '@/hooks/useColor';
import { useHaptics } from '@/hooks/useHaptics';
import { useEffect } from 'react';
import { Pressable } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

interface SwitchProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
  disabled?: boolean;
}

const WIDTH = 48;
const HEIGHT = 28;
const THUMB = 22;
const PADDING = 3;

export function Switch({ value, onValueChange, disabled }: SwitchProps) {
  const feedback = useHaptics(true);
  const primary = useColor('primary');
  const track = useColor('border');
  const thumbColor = useColor('primaryForeground');

  const progress = useSharedValue(value ? 1 : 0);
  useEffect(() => {
    progress.value = withTiming(value ? 1 : 0, { duration: 150 });
  }, [value, progress]);

  const trackStyle = useAnimatedStyle(() => ({
    backgroundColor: progress.value > 0.5 ? primary : track,
  }));
  const thumbStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: progress.value * (WIDTH - THUMB - PADDING * 2) }],
  }));

  return (
    <Pressable
      disabled={disabled}
      onPress={() => {
        feedback(value ? 'toggle-off' : 'toggle-on');
        onValueChange(!value);
      }}
      accessibilityRole='switch'
      accessibilityState={{ checked: value, disabled }}
      style={{ opacity: disabled ? 0.5 : 1 }}
    >
      <Animated.View
        style={[
          {
            width: WIDTH,
            height: HEIGHT,
            borderRadius: HEIGHT / 2,
            padding: PADDING,
            justifyContent: 'center',
          },
          trackStyle,
        ]}
      >
        <Animated.View
          style={[
            {
              width: THUMB,
              height: THUMB,
              borderRadius: THUMB / 2,
              backgroundColor: thumbColor,
            },
            thumbStyle,
          ]}
        />
      </Animated.View>
    </Pressable>
  );
}
