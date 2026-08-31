import { Text } from '@/components/ui/text';
import { AlertCircle, Check, Info, X } from 'lucide-react-native';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import {
  Dimensions,
  Platform,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import { useColor } from '@/hooks/useColor';
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

export type ToastVariant = 'default' | 'success' | 'error' | 'warning' | 'info';

export interface ToastData {
  id: string;
  title?: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;
  action?: {
    label: string;
    onPress: () => void;
  };
}

interface ToastProps extends ToastData {
  onDismiss: (id: string) => void;
  index: number;
}

const { width: screenWidth } = Dimensions.get('window');
const TOAST_HEIGHT = 70;
const TOAST_MARGIN = 8;
const ENTER_DURATION = 380;
const EXIT_DURATION = 280;

const ENTER_EASING = Easing.out(Easing.cubic);
const EXIT_EASING = Easing.in(Easing.cubic);

export function Toast({
  id,
  title,
  description,
  variant = 'default',
  onDismiss,
  index,
  action,
  duration = 4000,
}: ToastProps) {
  const translateY = useSharedValue(-(TOAST_HEIGHT + 20));
  const translateX = useSharedValue(0);
  const opacity = useSharedValue(0);

  const backgroundColor = useColor('card');
  const mutedTextColor = useColor('textMuted');
  const successColor = useColor('green');
  const errorColor = useColor('red');
  const warningColor = useColor('orange');
  const infoColor = useColor('blue');
  const textColor = useColor('text');
  const primaryForegroundColor = useColor('primaryForeground');

  // Slide down + fade in on mount
  useEffect(() => {
    translateY.value = withTiming(0, { duration: ENTER_DURATION, easing: ENTER_EASING });
    opacity.value = withTiming(1, { duration: ENTER_DURATION - 60 });
  }, []);

  // Slide up + fade out, then remove
  const dismiss = useCallback(() => {
    translateY.value = withTiming(
      -(TOAST_HEIGHT + 20),
      { duration: EXIT_DURATION, easing: EXIT_EASING },
      (finished) => {
        if (finished) runOnJS(onDismiss)(id);
      }
    );
    opacity.value = withTiming(0, { duration: EXIT_DURATION - 30 });
  }, [id, onDismiss]);

  // Auto-dismiss with exit animation
  useEffect(() => {
    if (!duration || duration <= 0) return;
    const timer = setTimeout(dismiss, duration);
    return () => clearTimeout(timer);
  }, [dismiss]);

  const getVariantColor = () => {
    switch (variant) {
      case 'success':
        return successColor;
      case 'error':
        return errorColor;
      case 'warning':
        return warningColor;
      case 'info':
        return infoColor;
      default:
        return mutedTextColor;
    }
  };

  const getIcon = () => {
    // The icon sits on the white badge, so it carries the variant color
    // while the surrounding toast is filled with it.
    const iconProps = { size: 18, color: getVariantColor() };
    switch (variant) {
      case 'success':
        return <Check {...iconProps} />;
      case 'error':
        return <X {...iconProps} />;
      case 'warning':
        return <AlertCircle {...iconProps} />;
      case 'info':
        return <Info {...iconProps} />;
      default:
        return null;
    }
  };

  // `default` keeps the neutral card surface; every other variant fills with
  // its status color and switches the text to white for contrast.
  const isFilled = variant !== 'default';
  const surfaceColor = isFilled ? getVariantColor() : backgroundColor;
  const onSurfaceColor = isFilled ? '#FFFFFF' : textColor;
  const onSurfaceMutedColor = isFilled ? 'rgba(255,255,255,0.85)' : mutedTextColor;

  // Swipe horizontally to dismiss
  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      translateX.value = event.translationX;
      const absX = Math.abs(event.translationX);
      opacity.value = Math.max(0, 1 - absX / (screenWidth * 0.6));
    })
    .onEnd((event) => {
      const { translationX, velocityX } = event;
      if (
        Math.abs(translationX) > screenWidth * 0.3 ||
        Math.abs(velocityX) > 800
      ) {
        const direction = translationX > 0 ? screenWidth : -screenWidth;
        translateX.value = withTiming(direction, { duration: 220 });
        opacity.value = withTiming(0, { duration: 200 }, (finished) => {
          if (finished) runOnJS(onDismiss)(id);
        });
      } else {
        translateX.value = withTiming(0, { duration: 240, easing: ENTER_EASING });
        opacity.value = withTiming(1, { duration: 200 });
      }
    });

  const statusBarHeight = Platform.OS === 'ios' ? 59 : 24;
  const topPosition = statusBarHeight + index * (TOAST_HEIGHT + TOAST_MARGIN);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      { translateY: translateY.value },
      { translateX: translateX.value },
    ],
  }));

  const toastStyle: ViewStyle = {
    position: 'absolute',
    top: topPosition,
    left: 16,
    right: 16,
    backgroundColor: surfaceColor,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 13,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.22,
    shadowRadius: 16,
    elevation: 10,
    zIndex: 1000 + index,
  };

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View style={[toastStyle, animatedStyle]}>
        {getIcon() && (
          <View
            style={{
              width: 32,
              height: 32,
              borderRadius: 16,
              backgroundColor: '#FFFFFF',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: 12,
            }}
          >
            {getIcon()}
          </View>
        )}

        <View style={{ flex: 1, minWidth: 0 }}>
          {title && (
            <Text
              variant='subtitle'
              style={{
                color: onSurfaceColor,
                fontSize: 15,
                fontWeight: '600',
                marginBottom: description ? 2 : 0,
              }}
              numberOfLines={1}
              ellipsizeMode='tail'
            >
              {title}
            </Text>
          )}
          {description && (
            <Text
              variant='caption'
              style={{
                color: onSurfaceMutedColor,
                fontSize: 13,
                fontWeight: '400',
              }}
              numberOfLines={2}
              ellipsizeMode='tail'
            >
              {description}
            </Text>
          )}
        </View>

        {action && (
          <TouchableOpacity
            onPress={action.onPress}
            style={{
              marginLeft: 12,
              paddingHorizontal: 12,
              paddingVertical: 6,
              backgroundColor: isFilled ? '#FFFFFF' : getVariantColor(),
              borderRadius: 10,
            }}
          >
            <Text
              variant='caption'
              style={{ color: isFilled ? getVariantColor() : primaryForegroundColor, fontSize: 12, fontWeight: '600' }}
            >
              {action.label}
            </Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          onPress={dismiss}
          style={{ marginLeft: 8, padding: 4, borderRadius: 8 }}
        >
          <X size={14} color={onSurfaceMutedColor} />
        </TouchableOpacity>
      </Animated.View>
    </GestureDetector>
  );
}

interface ToastContextType {
  toast: (toast: Omit<ToastData, 'id'>) => void;
  success: (title: string, description?: string) => void;
  error: (title: string, description?: string) => void;
  warning: (title: string, description?: string) => void;
  info: (title: string, description?: string) => void;
  dismiss: (id: string) => void;
  dismissAll: () => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

interface ToastProviderProps {
  children: React.ReactNode;
  maxToasts?: number;
}

export function ToastProvider({ children, maxToasts = 3 }: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const generateId = () => Math.random().toString(36).substr(2, 9);

  const addToast = useCallback(
    (toastData: Omit<ToastData, 'id'>) => {
      const id = generateId();
      const newToast: ToastData = {
        ...toastData,
        id,
        duration: toastData.duration ?? 4000,
      };

      setToasts((prev) => {
        const updated = [newToast, ...prev];
        return updated.slice(0, maxToasts);
      });
    },
    [maxToasts]
  );

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const dismissAll = useCallback(() => {
    setToasts([]);
  }, []);

  const createVariantToast = useCallback(
    (variant: ToastVariant, title: string, description?: string) => {
      addToast({
        title,
        description,
        variant,
      });
    },
    [addToast]
  );

  const contextValue: ToastContextType = {
    toast: addToast,
    success: (title, description) =>
      createVariantToast('success', title, description),
    error: (title, description) =>
      createVariantToast('error', title, description),
    warning: (title, description) =>
      createVariantToast('warning', title, description),
    info: (title, description) =>
      createVariantToast('info', title, description),
    dismiss: dismissToast,
    dismissAll,
  };

  const containerStyle: ViewStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    pointerEvents: 'box-none',
  };

  return (
    <ToastContext.Provider value={contextValue}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        {children}
        <View style={containerStyle} pointerEvents='box-none'>
          {toasts.map((toast, index) => (
            <Toast
              key={toast.id}
              {...toast}
              index={index}
              onDismiss={dismissToast}
            />
          ))}
        </View>
      </GestureHandlerRootView>
    </ToastContext.Provider>
  );
}

// Hook to use toast
export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }

  return context;
}
