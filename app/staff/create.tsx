import React, { useEffect, useState } from 'react';
import { View, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { User as UserIcon, Phone, Lock, Shield, Building2, Globe } from 'lucide-react-native';

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
import { branchesApi } from '@/api/branches';
import { getApiErrorMessage } from '@/api/client';
import type { CreateUserPayload, Language, UserRole } from '@/types';

const LANGUAGES: { label: string; value: Language }[] = [
  { label: '🇺🇸 English', value: 'en' },
  { label: "🇺🇿 O'zbekcha", value: 'uz' },
  { label: '🇷🇺 Русский', value: 'ru' },
];

export default function CreateStaffScreen() {
  const { t } = useTranslation();
  const qc = useQueryClient();
  const { user } = useAuth();
  const { success: showSuccess } = useToast();

  // Staff management is owner/super_admin only — the backend enforces this
  // too (403), this just keeps sellers from ever reaching the form.
  const canView = user?.role !== 'seller';
  useEffect(() => {
    if (!canView) router.back();
  }, [canView]);

  const bg = useColor('background');
  const muted = useColor('textMuted');
  const red = useColor('red');

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('seller');
  const [branchId, setBranchId] = useState('');
  const [language, setLanguage] = useState<Language>('uz');
  const [error, setError] = useState('');

  const { data: branches = [] } = useQuery({ queryKey: ['branches'], queryFn: branchesApi.getAll });

  const create = useMutation({
    mutationFn: (payload: CreateUserPayload) => usersApi.create(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['users'] });
      showSuccess(t('common.success'), t('staff.created'));
      router.navigate({ pathname: '/(tabs)/(home)', params: { tab: '2' } });
    },
    onError: (err) => setError(getApiErrorMessage(err)),
  });

  const submit = () => {
    setError('');
    if (!fullName.trim()) return setError(t('auth.errors.fullNameRequired'));
    if (phone.replace(/\D/g, '').length < 9) return setError(t('auth.errors.phoneRequired'));
    if (password.length < 6) return setError(t('auth.errors.passwordLength'));

    create.mutate({
      fullName: fullName.trim(),
      phone: `+998${phone.replace(/\D/g, '').slice(-9)}`,
      password,
      role,
      branchId: branchId || undefined,
      language,
    });
  };

  if (!canView) return null;

  return (
    <View style={{ flex: 1, backgroundColor: bg }}>
      <Header title={t('staff.add')} />

      <ScrollView contentContainerStyle={{ padding: 16, gap: 12 }} keyboardShouldPersistTaps="handled">
        <Input icon={UserIcon} placeholder={t('auth.fullName')} value={fullName} onChangeText={setFullName} variant="outline" autoCapitalize="words" />

        <Input
          icon={Phone}
          placeholder="+998 00 000 00 00"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
          maxLength={17}
          variant="outline"
        />

        <Input icon={Lock} placeholder={t('auth.password')} value={password} onChangeText={setPassword} secureTextEntry autoCapitalize="none" variant="outline" />

        <Picker
          icon={Shield}
          value={role}
          onValueChange={(v) => setRole(v as UserRole)}
          options={[
            { label: t('settings.roles.seller'), value: 'seller' },
            { label: t('settings.roles.owner'), value: 'owner' },
          ]}
          variant="outline"
          modalTitle={t('staff.role')}
        />

        <Picker
          icon={Building2}
          placeholder={t('staff.noBranch')}
          value={branchId}
          onValueChange={setBranchId}
          options={[{ label: t('staff.noBranch'), value: '' }, ...branches.map((b) => ({ label: b.name, value: b.id }))]}
          variant="outline"
          modalTitle={t('staff.branch')}
        />

        <Picker
          icon={Globe}
          value={language}
          onValueChange={(v) => setLanguage(v as Language)}
          options={LANGUAGES}
          variant="outline"
          modalTitle={t('auth.language')}
        />

        {!!error && <Text style={{ color: red, fontSize: 14, fontWeight: '500' }}>{error}</Text>}
        <Text style={{ fontSize: 12, color: muted }}>{t('staff.createHint')}</Text>
      </ScrollView>

      <View style={{ padding: 16 }}>
        <Button onPress={submit} loading={create.isPending}>{t('staff.add')}</Button>
      </View>

      <AvoidKeyboard />
    </View>
  );
}
