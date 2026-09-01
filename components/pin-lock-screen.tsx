import { PinPad } from '@/components/pin-pad';
import { AlertDialog, useAlertDialog } from '@/components/ui/alert-dialog';
import { Text } from '@/components/ui/text';
import { useColor } from '@/hooks/useColor';
import { PIN_LENGTH, usePinLock } from '@/hooks/usePinLock';
import { Lock, ShieldAlert } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeIn } from 'react-native-reanimated';

/** mm:ss for a lockout countdown. */
function formatCountdown(ms: number): string {
  const total = Math.ceil(ms / 1000);
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

/**
 * Full-screen lock gate. Rendered as an absolute overlay above the navigator
 * (see app/_layout.tsx) so the router stays mounted underneath.
 */
export function PinLockScreen() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const {
    unlock,
    forgotPin,
    attemptsRemaining,
    isLockedOut,
    lockoutRemainingMs,
    failedAttempts,
  } = usePinLock();
  const forgotDialog = useAlertDialog();

  const bg = useColor('background');
  const primary = useColor('primary');
  const red = useColor('red');
  const muted = useColor('textMuted');

  const [value, setValue] = useState('');
  const [error, setError] = useState('');
  const [resetting, setResetting] = useState(false);

  const handleForgotPin = async () => {
    setResetting(true);
    try {
      await forgotPin();
      // No navigation call here: forgotPin() logs out, which drops
      // isAuthenticated, which is what makes this screen itself unmount —
      // AuthProvider's own route guard sends the app to /login.
    } finally {
      forgotDialog.close();
      setResetting(false);
    }
  };

  useEffect(() => {
    if (value.length !== PIN_LENGTH) {
      if (error) setError('');
      return;
    }
    if (!unlock(value)) {
      setError(t('settings.security.wrongPin'));
      setValue('');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  // Drop anything typed when a lockout starts, so the pad is empty on release.
  useEffect(() => {
    if (isLockedOut) setValue('');
  }, [isLockedOut]);

  const warnLow = !isLockedOut && failedAttempts > 0 && attemptsRemaining <= 2;

  return (
    <View
      style={[
        styles.overlay,
        {
          backgroundColor: bg,
          paddingTop: insets.top + 48,
          paddingBottom: insets.bottom + 24,
        },
      ]}
    >
      <View style={{ alignItems: 'center', marginBottom: 40 }}>
        <View
          style={[
            styles.badge,
            { backgroundColor: (isLockedOut ? red : primary) + '18' },
          ]}
        >
          {isLockedOut ? (
            <ShieldAlert size={28} color={red} />
          ) : (
            <Lock size={28} color={primary} />
          )}
        </View>
      </View>

      <PinPad
        value={value}
        onChange={setValue}
        title={t('settings.security.enterPin')}
        subtitle={t('settings.security.enterPinSubtitle')}
        error={error}
        disabled={isLockedOut || resetting}
        footer={
          isLockedOut ? (
            <Animated.View entering={FadeIn.duration(200)} style={{ alignItems: 'center' }}>
              <Text style={{ color: red, fontSize: 14, fontWeight: '700' }}>
                {t('settings.security.lockedOut')}
              </Text>
              <Text
                style={{
                  color: muted,
                  fontSize: 13,
                  marginTop: 4,
                  fontVariant: ['tabular-nums'],
                }}
              >
                {t('settings.security.tryAgainIn', {
                  time: formatCountdown(lockoutRemainingMs),
                })}
              </Text>
            </Animated.View>
          ) : warnLow ? (
            <Animated.View entering={FadeIn.duration(200)}>
              <Text style={{ color: red, fontSize: 13 }}>
                {t('settings.security.attemptsRemaining', { count: attemptsRemaining })}
              </Text>
            </Animated.View>
          ) : null
        }
      />

      <Pressable
        onPress={forgotDialog.open}
        disabled={resetting}
        hitSlop={12}
        style={{ marginTop: 24, opacity: resetting ? 0.5 : 1 }}
      >
        <Text style={{ color: primary, fontSize: 14, fontWeight: '600' }}>
          {t('settings.security.forgotPin')}
        </Text>
      </Pressable>

      <View style={{ flex: 1 }} />

      <AlertDialog
        isVisible={forgotDialog.isVisible}
        onClose={forgotDialog.close}
        title={t('settings.security.forgotPinConfirmTitle')}
        description={t('settings.security.forgotPinConfirmMessage')}
        confirmText={t('settings.security.forgotPinConfirmAction')}
        cancelText={t('common.cancel')}
        onConfirm={handleForgotPin}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9999,
    alignItems: 'center',
  },
  badge: {
    width: 64,
    height: 64,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
