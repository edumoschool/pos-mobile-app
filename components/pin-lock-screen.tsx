import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { Lock } from 'lucide-react-native';
import { Text } from '@/components/ui/text';
import { useColor } from '@/hooks/useColor';
import { usePinLock, PIN_LENGTH } from '@/hooks/usePinLock';
import { PinPad } from '@/components/pin-pad';

/**
 * Full-screen lock gate. Rendered as an absolute overlay above the navigator
 * (see app/_layout.tsx) so the router stays mounted underneath.
 */
export function PinLockScreen() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const { unlock } = usePinLock();

  const bg = useColor('background');
  const primary = useColor('primary');

  const [value, setValue] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (value.length === PIN_LENGTH) {
      const ok = unlock(value);
      if (!ok) {
        setError(t('settings.security.wrongPin'));
        setValue('');
      }
    } else if (error) {
      setError('');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <View style={[styles.overlay, { backgroundColor: bg, paddingTop: insets.top + 48, paddingBottom: insets.bottom + 24 }]}>
      <View style={{ alignItems: 'center', marginBottom: 40 }}>
        <View
          style={{
            width: 64,
            height: 64,
            borderRadius: 20,
            backgroundColor: primary + '18',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Lock size={28} color={primary} />
        </View>
      </View>

      <PinPad
        value={value}
        onChange={setValue}
        title={t('settings.security.enterPin')}
        subtitle={t('settings.security.enterPinSubtitle')}
        error={error}
      />

      <View style={{ flex: 1 }} />
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
});
