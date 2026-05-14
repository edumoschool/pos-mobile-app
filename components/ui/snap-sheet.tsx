import React, { useEffect } from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View, ViewStyle } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useColor } from '@/hooks/useColor';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const SPRING_CONFIG = { damping: 22, stiffness: 220, mass: 0.8 };
const DISMISS_THRESHOLD = 80; // px dragged down to trigger dismiss

type SnapSheetProps = {
  isVisible: boolean;
  onClose: () => void;
  /** Sheet height as a fraction of screen height, e.g. 0.5 = 50%. Default 0.55 */
  snapHeight?: number;
  title?: string;
  children: React.ReactNode;
  contentContainerStyle?: ViewStyle;
};

export function SnapSheet({
  isVisible,
  onClose,
  snapHeight = 0.55,
  title,
  children,
  contentContainerStyle,
}: SnapSheetProps) {
  const sheetHeight = SCREEN_HEIGHT * snapHeight;
  const translateY = useSharedValue(sheetHeight);
  const dragStart = useSharedValue(0);

  const bg = useColor('background');
  const secondaryBg = useColor('secondary');
  const separator = useColor('border');
  const textPrimary = useColor('text');
  const textSecondary = useColor('textMuted');

  // Open / close
  useEffect(() => {
    if (isVisible) {
      translateY.value = withSpring(0, SPRING_CONFIG);
    } else {
      translateY.value = withTiming(sheetHeight, { duration: 260 });
    }
  }, [isVisible, sheetHeight]);

  const dismiss = () => {
    translateY.value = withTiming(sheetHeight, { duration: 260 }, () => {
      runOnJS(onClose)();
    });
  };

  const panGesture = Gesture.Pan()
    .onStart(() => {
      dragStart.value = translateY.value;
    })
    .onUpdate((e) => {
      // only allow downward drag
      const next = dragStart.value + e.translationY;
      translateY.value = next < 0 ? 0 : next;
    })
    .onEnd((e) => {
      if (e.translationY > DISMISS_THRESHOLD || e.velocityY > 600) {
        runOnJS(dismiss)();
      } else {
        translateY.value = withSpring(0, SPRING_CONFIG);
      }
    });

  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  if (!isVisible) return null;

  return (
    <Animated.View style={[styles.sheet, { height: sheetHeight, backgroundColor: bg }, sheetStyle]}>
      {/* Drag handle */}
      <GestureDetector gesture={panGesture}>
        <View style={styles.handleArea}>
          <View style={[styles.handle, { backgroundColor: separator }]} />
        </View>
      </GestureDetector>

      {/* Title row */}
      {title && (
        <View style={[styles.titleRow, { borderBottomColor: separator }]}>
          <Text style={[styles.titleText, { color: textPrimary }]}>{title}</Text>
          <TouchableOpacity onPress={dismiss} hitSlop={{ top: 8, bottom: 8, left: 12, right: 12 }}>
            <View style={[styles.closeBtn, { backgroundColor: secondaryBg }]}>
              <Text style={[styles.closeBtnText, { color: textSecondary }]}>✕</Text>
            </View>
          </TouchableOpacity>
        </View>
      )}

      {/* Scrollable content */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.scrollContent, contentContainerStyle]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {children}
      </ScrollView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  sheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 20,
    zIndex: 999,
  },
  handleArea: {
    width: '100%',
    paddingTop: 10,
    paddingBottom: 6,
    alignItems: 'center',
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  titleText: {
    fontSize: 16,
    fontWeight: '700',
    flex: 1,
  },
  closeBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtnText: {
    fontSize: 12,
    fontWeight: '700',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 36,
  },
});
