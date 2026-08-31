import React, { useState } from 'react';
import { View, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { useMutation } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { User as UserIcon, Phone, Globe } from 'lucide-react-native';

import { Text } from '@/components/ui/text';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Picker } from '@/components/ui/picker';
import { Header } from '@/components/ui/header';
import { AvoidKeyboard } from '@/components/ui/avoid-keyboard';
import { useToast } from '@/components/ui/toast';
import { useColor } from '@/hooks/useColor';
import { useAuth } from '@/hooks/useAuth';
import { usersApi } from '@/api/users';
import { getApiErrorMessage } from '@/api/client';
import i18n from '@/i18n';
import type { Language } from '@/types';

const LANGUAGES: { label: string; value: Language }[] = [
  { label: '🇺🇸 English', value: 'en' },
  { label: "🇺🇿 O'zbekcha", value: 'uz' },
  { label: '🇷🇺 Русский', value: 'ru' },
];

export default function ProfileScreen() {
  const { t } = useTranslation();
  const { user, refreshProfile } = useAuth();
  const { success: showSuccess, error: showError } = useToast();

  const bg = useColor('background');
  const text = useColor('text');
  const muted = useColor('textMuted');

  const canEditName = user?.role === 'owner' || user?.role === 'super_admin';

  const [fullName, setFullName] = useState(user?.fullName ?? '');
  const [language, setLanguage] = useState<Language>((user?.language as Language) ?? 'en');

  const save = useMutation({
    mutationFn: async () => {
      if (language !== user?.language) {
        await usersApi.changeLanguage(language);
      }
      if (canEditName && fullName.trim() && fullName.trim() !== user?.fullName) {
        await usersApi.update(user!.id, { fullName: fullName.trim() });
      }
    },
    onSuccess: async () => {
      i18n.changeLanguage(language);
      await refreshProfile();
      showSuccess(t('common.success'), t('settings.profile.saved'));
      router.back();
    },
    onError: (err) => showError(t('common.error'), getApiErrorMessage(err)),
  });

  return (
    <View style={{ flex: 1, backgroundColor: bg }}>
      <Header title={t('settings.rows.profile')} />

      <ScrollView contentContainerStyle={{ padding: 16, gap: 16 }} keyboardShouldPersistTaps="handled">
        <View>
          <Text style={{ fontSize: 13, fontWeight: '600', color: muted, marginBottom: 6 }}>
            {t('auth.fullName')}
          </Text>
          <Input
            icon={UserIcon}
            value={fullName}
            onChangeText={setFullName}
            variant="outline"
            editable={canEditName}
            disabled={!canEditName}
            placeholder={t('auth.fullName')}
          />
          {!canEditName && (
            <Text style={{ fontSize: 12, color: muted, marginTop: 4 }}>
              {t('settings.profile.nameLockedForSeller')}
            </Text>
          )}
        </View>

        <View>
          <Text style={{ fontSize: 13, fontWeight: '600', color: muted, marginBottom: 6 }}>
            {t('auth.phone')}
          </Text>
          <Input icon={Phone} value={user?.phone ?? ''} variant="outline" editable={false} disabled />
        </View>

        <View>
          <Text style={{ fontSize: 13, fontWeight: '600', color: muted, marginBottom: 6 }}>
            {t('auth.language')}
          </Text>
          <Picker
            icon={Globe}
            value={language}
            onValueChange={(v) => setLanguage(v as Language)}
            options={LANGUAGES}
            variant="outline"
            modalTitle={t('auth.language')}
          />
        </View>
      </ScrollView>

      <View style={{ padding: 16 }}>
        <Button onPress={() => save.mutate()} loading={save.isPending}>
          {t('common.save')}
        </Button>
      </View>

      <AvoidKeyboard />
    </View>
  );
}
