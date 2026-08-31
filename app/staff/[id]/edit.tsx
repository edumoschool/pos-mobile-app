import React, { useEffect, useState } from 'react';
import { View, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { User as UserIcon, Lock, Shield, Building2, Globe, Power } from 'lucide-react-native';

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
import type { Language, UpdateUserPayload, UserRole } from '@/types';

const LANGUAGES: { label: string; value: Language }[] = [
  { label: '🇺🇸 English', value: 'en' },
  { label: "🇺🇿 O'zbekcha", value: 'uz' },
  { label: '🇷🇺 Русский', value: 'ru' },
];

export default function EditStaffScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { t } = useTranslation();
  const qc = useQueryClient();
  const { user: currentUser } = useAuth();
  const { success: showSuccess, error: showError } = useToast();

  // Staff management is owner/super_admin only — the backend enforces this
  // too (403), this just keeps sellers from ever reaching the form.
  const canView = currentUser?.role !== 'seller';
  useEffect(() => {
    if (!canView) router.back();
  }, [canView]);

  const bg = useColor('background');
  const text = useColor('text');
  const muted = useColor('textMuted');
  const primary = useColor('primary');
  const green = useColor('green');
  const red = useColor('red');

  const { data: user, isLoading } = useQuery({
    queryKey: ['user', id],
    queryFn: () => usersApi.getById(id!),
    enabled: !!id && canView,
  });
  const { data: branches = [] } = useQuery({
    queryKey: ['branches'],
    queryFn: branchesApi.getAll,
    enabled: canView,
  });

  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState<UserRole>('seller');
  const [branchId, setBranchId] = useState('');
  const [language, setLanguage] = useState<Language>('uz');
  const [isActive, setIsActive] = useState(true);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      setFullName(user.fullName);
      setRole(user.role);
      setBranchId(user.branchId ?? '');
      setLanguage((user.language as Language) ?? 'uz');
      setIsActive(user.isActive);
    }
  }, [user]);

  const save = useMutation({
    mutationFn: () => {
      const payload: UpdateUserPayload = {
        fullName: fullName.trim(),
        role,
        branchId: branchId || undefined,
        language,
        isActive,
      };
      if (password) payload.password = password;
      return usersApi.update(id!, payload);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['users'] });
      qc.invalidateQueries({ queryKey: ['user', id] });
      showSuccess(t('common.success'), t('staff.updated'));
      router.back();
    },
    onError: (err) => setError(getApiErrorMessage(err)),
  });

  const submit = () => {
    setError('');
    if (!fullName.trim()) return setError(t('auth.errors.fullNameRequired'));
    if (password && password.length < 6) return setError(t('auth.errors.passwordLength'));
    save.mutate();
  };

  if (!canView) return null;

  if (isLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: bg }}>
        <Header title={t('staff.edit')} />
        <ActivityIndicator color={primary} style={{ marginTop: 40 }} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: bg }}>
      <Header title={t('staff.edit')} />

      <ScrollView contentContainerStyle={{ padding: 16, gap: 12 }} keyboardShouldPersistTaps="handled">
        <Input icon={UserIcon} placeholder={t('auth.fullName')} value={fullName} onChangeText={setFullName} variant="outline" autoCapitalize="words" />

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

        <Input icon={Lock} placeholder={t('staff.newPassword')} value={password} onChangeText={setPassword} secureTextEntry autoCapitalize="none" variant="outline" />

        <TouchableOpacity
          onPress={() => setIsActive((v) => !v)}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 10,
            paddingVertical: 12,
            paddingHorizontal: 16,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: (isActive ? green : muted) + '80',
            backgroundColor: (isActive ? green : muted) + '12',
          }}
        >
          <Power size={18} color={isActive ? green : muted} />
          <Text style={{ fontSize: 15, fontWeight: '600', color: isActive ? green : muted }}>
            {isActive ? t('settings.branches.active') : t('settings.branches.inactive')}
          </Text>
        </TouchableOpacity>

        {!!error && <Text style={{ color: red, fontSize: 14, fontWeight: '500' }}>{error}</Text>}
        <Text style={{ fontSize: 12, color: muted }}>{t('staff.editHint')}</Text>
      </ScrollView>

      <View style={{ padding: 16 }}>
        <Button onPress={submit} loading={save.isPending} disabled={!fullName.trim()}>
          {t('common.save')}
        </Button>
      </View>

      <AvoidKeyboard />
    </View>
  );
}
