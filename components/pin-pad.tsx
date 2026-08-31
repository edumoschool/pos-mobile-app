import { Text } from '@/components/ui/text';
import { useColor } from '@/hooks/useColor';
import { useHaptics } from '@/hooks/useHaptics';
import { PIN_LENGTH } from '@/hooks/usePinLock';
import { Delete } from 'lucide-react-native';
import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import {
  AccessibilityInfo,
  Platform,
  Pressable,
  StyleSheet,
  Vibration,
  View,
  useWindowDimensions,
} from 'react-native';
import Animated, {
  cancelAnimation,
  Easing,
  interpolateColor,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  type SharedValue,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface PinPadProps {
  value: string;
  onChange: (next: string) => void;
  title?: string;
  subtitle?: string;
  error?: string;
  length?: number;
  /** Disables input — use while an attempt is being verified or during lockout. */
  disabled?: boolean;
  /** Haptic feedback on key press. */
  haptic?: boolean;
  /** Rendered under the keypad, e.g. a "Forgot PIN?" or biometric action. */
  footer?: React.ReactNode;
}

/**
 * Numeric PIN entry: dot indicator + 0-9 keypad + backspace.
 *
 * Handles the parts that are easy to get subtly wrong on a payment device:
 * digits never render as text (so they cannot leak into screenshots, a11y
 * announcements or autofill), the shake-and-clear on a rejected PIN is driven
 * from `error` rather than duplicated in every caller, and the keypad scales
 * down on short screens instead of pushing the submit affordance off-screen.
 */
export function PinPad({
  value,
  onChange,
  title,
  subtitle,
  error,
  length = PIN_LENGTH,
  disabled = false,
  haptic = true,
  footer,
}: PinPadProps) {
  const text = useColor('text');
  const muted = useColor('textMuted');
  const primary = useColor('primary');
  const card = useColor('card');
  const border = useColor('border');
  const red = useColor('red');
  const feedback = useHaptics(haptic);

  const { height } = useWindowDimensions();
  // Small phones (SE-class, ~667pt) cannot fit the full-size grid alongside a
  // header and footer; scale the key rather than letting the layout clip.
  const keySize = height < 700 ? 62 : 74;
  const gap = height < 700 ? 12 : 16;

  const filled = value.length;
  const isError = !!error;

  // ── Rejected-PIN feedback ────────────────────────────────────────────
  // `error` going truthy is the single trigger: shake, buzz, and let the
  // caller clear `value`. Keeping it here means every screen using the pad
  // gets identical feedback without repeating it.
  const shake = useSharedValue(0);
  const errorProgress = useSharedValue(0);

  useEffect(() => {
    errorProgress.value = withTiming(isError ? 1 : 0, { duration: 180 });
    if (!isError) return;

    shake.value = withSequence(
      withTiming(-10, { duration: 45, easing: Easing.out(Easing.quad) }),
      withRepeat(withTiming(10, { duration: 90, easing: Easing.inOut(Easing.quad) }), 3, true),
      withSpring(0, { damping: 14, stiffness: 320 })
    );

    feedback('error');
    // expo-haptics has no Android equivalent for a rejection buzz strong enough
    // to feel on a counter-top device, so pair it with a short vibration there.
    if (Platform.OS === 'android') Vibration.vibrate(40);

    // Screen readers get no signal from a shake.
    AccessibilityInfo.announceForAccessibility?.(error!);
  }, [isError, error, shake, errorProgress, feedback]);

  useEffect(
    () => () => {
      cancelAnimation(shake);
      cancelAnimation(errorProgress);
    },
    [shake, errorProgress]
  );

  const dotsStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shake.value }],
  }));

  // ── Input ────────────────────────────────────────────────────────────
  // Guard on a ref as well as on `value.length`: presses can arrive faster
  // than React re-renders, which would otherwise overrun `length` and submit
  // a too-long PIN.
  const lengthRef = useRef(value.length);
  lengthRef.current = value.length;

  const press = useCallback(
    (digit: string) => {
      if (disabled || lengthRef.current >= length) return;
      lengthRef.current += 1;
      feedback('tick');
      onChange(value + digit);
    },
    [disabled, length, onChange, value, feedback]
  );

  const backspace = useCallback(() => {
    if (disabled || lengthRef.current === 0) return;
    lengthRef.current -= 1;
    feedback('selection');
    onChange(value.slice(0, -1));
  }, [disabled, onChange, value, feedback]);

  const clear = useCallback(() => {
    if (disabled || lengthRef.current === 0) return;
    lengthRef.current = 0;
    feedback('impact-medium');
    onChange('');
  }, [disabled, onChange, feedback]);

  const keys = useMemo(() => ['1', '2', '3', '4', '5', '6', '7', '8', '9'], []);

  return (
    <View style={{ alignItems: 'center', opacity: disabled ? 0.5 : 1 }}>
      {title ? (
        <Text
          accessibilityRole="header"
          style={{ fontSize: 20, fontWeight: '800', color: text, marginBottom: 6 }}
        >
          {title}
        </Text>
      ) : null}
      {subtitle ? (
        <Text style={{ fontSize: 14, color: muted, marginBottom: 24, textAlign: 'center' }}>
          {subtitle}
        </Text>
      ) : null}

      {/* Dots. Reports only how many digits are entered — never the digits. */}
      <Animated.View
        accessible
        accessibilityRole="text"
        accessibilityLabel={`${filled} of ${length} digits entered`}
        style={[{ flexDirection: 'row', gap: 16, marginBottom: 12 }, dotsStyle]}
      >
        {Array.from({ length }).map((_, i) => (
          <Dot
            key={i}
            index={i}
            filled={i < filled}
            primary={primary}
            red={red}
            border={border}
            errorProgress={errorProgress}
          />
        ))}
      </Animated.View>

      <View style={{ height: 20, marginBottom: 12, justifyContent: 'center' }}>
        {isError && (
          <Text style={{ color: red, fontSize: 13, fontWeight: '600' }}>{error}</Text>
        )}
      </View>

      {/* Keypad */}
      <View style={[styles.grid, { width: keySize * 3 + gap * 2, rowGap: gap }]}>
        {keys.map((d) => (
          <Key
            key={d}
            label={d}
            onPress={() => press(d)}
            disabled={disabled}
            size={keySize}
            card={card}
            border={border}
            text={text}
          />
        ))}

        {/* Long-press to clear: a discoverable shortcut that avoids four
            separate backspace presses, without adding a visible control. */}
        <Key
          label="0"
          onPress={() => press('0')}
          onLongPress={clear}
          disabled={disabled}
          size={keySize}
          card={card}
          border={border}
          text={text}
          style={{ marginLeft: keySize + gap }}
        />

        <Key
          onPress={backspace}
          onLongPress={clear}
          disabled={disabled || filled === 0}
          size={keySize}
          card="transparent"
          border="transparent"
          text={text}
          accessibilityLabel="Delete"
        >
          <Delete size={24} color={filled === 0 ? muted : text} />
        </Key>
      </View>

      {footer ? <View style={{ marginTop: 24 }}>{footer}</View> : null}
    </View>
  );
}

/** A single indicator dot: springs up as it fills, tints red on error. */
function Dot({
  index,
  filled,
  primary,
  red,
  border,
  errorProgress,
}: {
  index: number;
  filled: boolean;
  primary: string;
  red: string;
  border: string;
  errorProgress: SharedValue<number>;
}) {
  const fill = useSharedValue(filled ? 1 : 0);

  useEffect(() => {
    fill.value = filled
      ? withSpring(1, { damping: 12, stiffness: 400, mass: 0.5 })
      : withTiming(0, { duration: 140 });
  }, [filled, fill]);

  useEffect(() => () => cancelAnimation(fill), [fill]);

  const active = useDerivedValue(() =>
    interpolateColor(errorProgress.value, [0, 1], [primary, red])
  );

  const style = useAnimatedStyle(() => ({
    transform: [{ scale: 1 + fill.value * 0.15 }],
    backgroundColor: fill.value > 0 ? active.value : 'transparent',
    borderColor: errorProgress.value > 0 ? red : fill.value > 0 ? active.value : border,
  }));

  return <Animated.View style={[styles.dot, style]} />;
}

/**
 * Keypad key. Scale + background respond on the UI thread so the press still
 * feels immediate while JS is busy verifying a completed PIN.
 */
function Key({
  children,
  label,
  onPress,
  onLongPress,
  disabled,
  size,
  card,
  border,
  text,
  style,
  accessibilityLabel,
}: {
  children?: React.ReactNode;
  label?: string;
  onPress: () => void;
  onLongPress?: () => void;
  disabled?: boolean;
  size: number;
  card: string;
  border: string;
  text: string;
  style?: object;
  accessibilityLabel?: string;
}) {
  const pressed = useSharedValue(0);

  useEffect(() => () => cancelAnimation(pressed), [pressed]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: 1 - pressed.value * 0.08 }],
    opacity: disabled ? 0.4 : 1 - pressed.value * 0.25,
  }));

  return (
    <AnimatedPressable
      onPress={onPress}
      onLongPress={onLongPress}
      delayLongPress={450}
      disabled={disabled}
      onPressIn={() => {
        pressed.value = withTiming(1, { duration: 70 });
      }}
      onPressOut={() => {
        pressed.value = withTiming(0, { duration: 140 });
      }}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityState={{ disabled: !!disabled }}
      hitSlop={6}
      style={[
        styles.key,
        { width: size, height: size, borderRadius: size / 2, backgroundColor: card, borderColor: border },
        animatedStyle,
        style,
      ]}
    >
      {children ?? (
        <Text style={{ fontSize: 26, fontWeight: '600', color: text }}>{label}</Text>
      )}
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  key: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: StyleSheet.hairlineWidth,
  },
  dot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 1.5,
  },
});
