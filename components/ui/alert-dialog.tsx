import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useColor } from '@/hooks/useColor';
import { BORDER_RADIUS } from '@/theme/globals';
import React, { useEffect } from 'react';
import {
  Modal,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
  ViewStyle,
} from 'react-native';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

export type AlertDialogProps = {
  isVisible: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children?: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  dismissible?: boolean;
  showCancelButton?: boolean;
  /** Cancel is 'secondary' by default; the confirm action stays 'destructive'
   *  unless overridden — pass 'default' for a non-destructive confirmation. */
  confirmVariant?: 'destructive' | 'default';
  style?: ViewStyle;
};

// A centered alert card — fades and scales in over a dimmed backdrop, in the
// vein of a native confirm dialog rather than a generic bottom sheet.
export function AlertDialog({
  isVisible,
  onClose,
  title,
  description,
  children,
  confirmText = 'OK',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  dismissible = true,
  showCancelButton = true,
  confirmVariant = 'destructive',
  style,
}: AlertDialogProps) {
  const cardColor = useColor('card');
  const shadowColor = useColor('foreground');

  const [modalVisible, setModalVisible] = React.useState(false);
  const backdropOpacity = useSharedValue(0);
  const cardOpacity = useSharedValue(0);
  const cardScale = useSharedValue(0.92);

  useEffect(() => {
    if (isVisible) {
      setModalVisible(true);
      backdropOpacity.value = withTiming(1, { duration: 220 });
      cardOpacity.value = withTiming(1, { duration: 200 });
      cardScale.value = withTiming(1, { duration: 220 });
    } else {
      backdropOpacity.value = withTiming(0, { duration: 200 }, (finished) => {
        if (finished) {
          runOnJS(setModalVisible)(false);
        }
      });
      cardOpacity.value = withTiming(0, { duration: 150 });
      cardScale.value = withTiming(0.92, { duration: 150 });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isVisible]);

  const rBackdropStyle = useAnimatedStyle(() => ({
    opacity: backdropOpacity.value,
  }));

  const rCardFadeStyle = useAnimatedStyle(() => ({
    opacity: cardOpacity.value,
    transform: [{ scale: cardScale.value }],
  }));

  const animateClose = () => {
    'worklet';
    backdropOpacity.value = withTiming(0, { duration: 200 }, (finished) => {
      if (finished) {
        runOnJS(onClose)();
      }
    });
    cardOpacity.value = withTiming(0, { duration: 150 });
    cardScale.value = withTiming(0.92, { duration: 150 });
  };

  const handleBackdropPress = () => {
    if (dismissible) {
      animateClose();
      if (onCancel) onCancel();
    }
  };

  const handleCancel = () => {
    if (onCancel) onCancel();
    animateClose();
  };

  const handleConfirm = () => {
    if (onConfirm) onConfirm();
    animateClose();
  };

  return (
    <Modal
      visible={modalVisible}
      transparent
      statusBarTranslucent
      animationType="none"
    >
      <Animated.View style={[styles.backdrop, rBackdropStyle]}>
        <TouchableWithoutFeedback onPress={handleBackdropPress}>
          <Animated.View style={styles.backdropTouchableArea} />
        </TouchableWithoutFeedback>

        {/* Shadow lives on this outer view. It can't also clip to rounded
            corners — `overflow: hidden` on the same node silently kills the
            shadow on both platforms — so corner-clipping is a separate inner
            view below. */}
        <View
          style={[
            styles.shadowWrapper,
            { backgroundColor: cardColor, shadowColor },
            style,
          ]}
        >
          <View style={styles.clipWrapper}>
            {/* Only fade/scale the inner content */}
            <Animated.View style={[styles.innerContent, rCardFadeStyle]}>
              <Card
                // Card has no rounded corners, background or shadow of its
                // own (delegated to shadowWrapper/clipWrapper above) — just
                // the padding.
                style={{ backgroundColor: 'transparent', elevation: 0, shadowOpacity: 0 }}
              >
                {(title || description) && (
                  <CardHeader style={{ alignItems: 'center', marginBottom: 4 }}>
                    {title ? (
                      <CardTitle style={{ fontSize: 18, fontWeight: '700', textAlign: 'center' }}>
                        {title}
                      </CardTitle>
                    ) : null}
                    {description ? (
                      <CardDescription
                        style={{ textAlign: 'center', lineHeight: 20, marginTop: title ? 4 : 0 }}
                      >
                        {description}
                      </CardDescription>
                    ) : null}
                  </CardHeader>
                )}
                {children ? <CardContent>{children}</CardContent> : null}
                <CardFooter style={{ flexDirection: 'column', gap: 10, marginTop: 20 }}>
                  <Button
                    size="sm"
                    variant={confirmVariant}
                    onPress={handleConfirm}
                    style={{ width: '100%' }}
                  >
                    {confirmText}
                  </Button>
                  {showCancelButton && (
                    <Button
                      variant="secondary"
                      size="sm"
                      onPress={handleCancel}
                      style={{ width: '100%' }}
                    >
                      {cancelText}
                    </Button>
                  )}
                </CardFooter>
              </Card>
            </Animated.View>
          </View>
        </View>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  backdropTouchableArea: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  // Carries the shadow. Rounded to match clipWrapper (so the shadow itself
  // reads as a rounded silhouette) but deliberately has no `overflow`, which
  // would otherwise clip the shadow away along with everything else.
  shadowWrapper: {
    width: '100%',
    maxWidth: 400,
    borderRadius: BORDER_RADIUS,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.2,
    shadowRadius: 24,
    elevation: 16,
  },
  // Clips the card's own corners; static (non-animated) like its parent.
  clipWrapper: {
    borderRadius: BORDER_RADIUS,
    overflow: 'hidden',
  },
  // Inner content can render freely (only opacity/scale is animated)
  innerContent: {
    width: '100%',
  },
});

export function useAlertDialog() {
  const [isVisible, setIsVisible] = React.useState(false);
  const open = React.useCallback(() => setIsVisible(true), []);
  const close = React.useCallback(() => setIsVisible(false), []);
  const toggle = React.useCallback(() => setIsVisible((v) => !v), []);
  return { isVisible, open, close, toggle };
}
