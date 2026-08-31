import React, { useState } from 'react';
import { View, ScrollView, Pressable } from 'react-native';
import { router } from 'expo-router';
import { useMutation } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Lock, Eye, EyeOff } from 'lucide-react-native';

import { Text } from '@/components/ui/text';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/ui/header';
import { AvoidKeyboard } from '@/components/ui/avoid-keyboard';
import { useToast } from '@/components/ui/toast';
import { useColor } from '@/hooks/useColor';
import { authApi } from '@/api/auth';
import { getApiErrorMessage } from '@/api/client';

export default function ChangePasswordScreen() {
  const { t } = useTranslation();
  const { success: showSuccess, error: showError } = useToast();

  const bg = useColor('background');
  const muted = useColor('textMuted');
  const red = useColor('red');

  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [show, setShow] = useState(false);
  const [error, setError] = useState('');

  const mutation = useMutation({
    mutationFn: () => authApi.changePassword({ currentPassword: current, newPassword: next }),
    onSuccess: () => {
      showSuccess(t('common.success'), t('settings.password.changed'));
      router.back();
    },
    onError: (err) => setError(getApiErrorMessage(err)),
  });

  const submit = () => {
    setError('');
    if (!current) return setError(t('settings.password.currentRequired'));
    if (next.length < 6) return setError(t('auth.errors.passwordLength'));
    if (next !== confirm) return setError(t('settings.password.mismatch'));
    mutation.mutate();
  };

  const eye = () => (
    <Pressable onPress={() => setShow((v) => !v)} hitSlop={8}>
      {show ? <EyeOff size={20} color={muted} /> : <Eye size={20} color={muted} />}
    </Pressable>
  );

  return (
    <View style={{ flex: 1, backgroundColor: bg }}>
      <Header title={t('settings.rows.password')} />

      <ScrollView contentContainerStyle={{ padding: 16, gap: 12 }} keyboardShouldPersistTaps="handled">
        <Input
          icon={Lock}
          placeholder={t('settings.password.current')}
          value={current}
          onChangeText={setCurrent}
          secureTextEntry={!show}
          autoCapitalize="none"
          variant="outline"
          rightComponent={eye}
        />
        <Input
          icon={Lock}
          placeholder={t('settings.password.new')}
          value={next}
          onChangeText={setNext}
          secureTextEntry={!show}
          autoCapitalize="none"
          variant="outline"
        />
        <Input
          icon={Lock}
          placeholder={t('settings.password.confirm')}
          value={confirm}
          onChangeText={setConfirm}
          secureTextEntry={!show}
          autoCapitalize="none"
          variant="outline"
        />

        {!!error && (
          <Text style={{ color: red, fontSize: 14, fontWeight: '500' }}>{error}</Text>
        )}

        <Text style={{ fontSize: 12, color: muted, marginTop: 4 }}>
          {t('settings.password.hint')}
        </Text>
      </ScrollView>

      <View style={{ padding: 16 }}>
        <Button onPress={submit} loading={mutation.isPending}>
          {t('settings.password.submit')}
        </Button>
      </View>

      <AvoidKeyboard />
    </View>
  );
}
