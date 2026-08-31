import React, { useEffect, useState } from 'react';
import { View, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Store, Globe, CreditCard, Power, Trash2 } from 'lucide-react-native';

import { Text } from '@/components/ui/text';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Picker } from '@/components/ui/picker';
import { Header } from '@/components/ui/header';
import { AvoidKeyboard } from '@/components/ui/avoid-keyboard';
import { AlertDialog, useAlertDialog } from '@/components/ui/alert-dialog';
import { useToast } from '@/components/ui/toast';
import { useColor } from '@/hooks/useColor';
import { tenantsApi } from '@/api/tenants';
import { subscriptionPlansApi } from '@/api/subscription-plans';
import { getApiErrorMessage } from '@/api/client';
import type { Language, UpdateTenantPayload } from '@/types';

const LANGUAGES: { label: string; value: Language }[] = [
  { label: '🇺🇸 English', value: 'en' },
  { label: "🇺🇿 O'zbekcha", value: 'uz' },
  { label: '🇷🇺 Русский', value: 'ru' },
];

export default function AdminTenantDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { t } = useTranslation();
  const qc = useQueryClient();
  const { success: showSuccess, error: showError } = useToast();
  const deactivateDialog = useAlertDialog();

  const bg = useColor('background');
  const card = useColor('card');
  const border = useColor('border');
  const text = useColor('text');
  const muted = useColor('textMuted');
  const primary = useColor('primary');
  const green = useColor('green');
  const red = useColor('red');

  const { data: tenant, isLoading } = useQuery({
    queryKey: ['admin', 'tenant', id],
    queryFn: () => tenantsApi.getById(id!),
    enabled: !!id,
  });
  const { data: plans = [] } = useQuery({
    queryKey: ['subscription-plans'],
    queryFn: subscriptionPlansApi.getAll,
  });

  const [name, setName] = useState('');
  const [language, setLanguage] = useState<Language>('uz');
  const [planId, setPlanId] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (tenant) {
      setName(tenant.name);
      setLanguage((tenant.language as Language) ?? 'uz');
      setPlanId(tenant.subscriptionPlanId ?? '');
      setIsActive(tenant.isActive);
    }
  }, [tenant]);

  const save = useMutation({
    mutationFn: () => {
      const payload: UpdateTenantPayload = {
        name: name.trim(),
        language,
        subscriptionPlanId: planId || undefined,
        isActive,
      };
      return tenantsApi.update(id!, payload);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'tenants'] });
      qc.invalidateQueries({ queryKey: ['admin', 'tenant', id] });
      showSuccess(t('common.success'), t('admin.tenants.saved'));
      router.back();
    },
    onError: (err) => setError(getApiErrorMessage(err)),
  });

  const deactivate = useMutation({
    mutationFn: () => tenantsApi.deactivate(id!),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'tenants'] });
      deactivateDialog.close();
      showSuccess(t('common.success'), t('admin.tenants.deactivated'));
      router.back();
    },
    onError: (err) => {
      deactivateDialog.close();
      showError(t('common.error'), getApiErrorMessage(err));
    },
  });

  if (isLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: bg }}>
        <Header title={t('admin.tenants.detail')} />
        <ActivityIndicator color={primary} style={{ marginTop: 40 }} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: bg }}>
      <Header title={t('admin.tenants.detail')} />

      <ScrollView contentContainerStyle={{ padding: 16, gap: 12 }} keyboardShouldPersistTaps="handled">
        <Input icon={Store} placeholder={t('auth.businessName')} value={name} onChangeText={setName} variant="outline" />

        <Picker
          icon={Globe}
          value={language}
          onValueChange={(v) => setLanguage(v as Language)}
          options={LANGUAGES}
          variant="outline"
          modalTitle={t('auth.language')}
        />

        <Picker
          icon={CreditCard}
          placeholder={t('settings.subscription.noPlan')}
          value={planId}
          onValueChange={setPlanId}
          options={[{ label: t('settings.subscription.noPlan'), value: '' }, ...plans.map((p) => ({ label: p.name, value: p.id }))]}
          variant="outline"
          modalTitle={t('settings.rows.subscription')}
        />

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

        {/* counts */}
        {tenant?._count && (
          <View style={{ flexDirection: 'row', gap: 8 }}>
            {[
              { label: t('admin.tenants.users'), value: tenant._count.users },
              { label: t('admin.tenants.products'), value: tenant._count.products },
              { label: t('admin.tenants.branches'), value: tenant.branches?.length ?? 0 },
            ].map((s) => (
              <View key={s.label} style={{ flex: 1, backgroundColor: card, borderRadius: 12, borderWidth: 1, borderColor: border + '60', padding: 12, alignItems: 'center' }}>
                <Text style={{ fontSize: 18, fontWeight: '800', color: text }}>{s.value}</Text>
                <Text style={{ fontSize: 11, color: muted, marginTop: 2 }}>{s.label}</Text>
              </View>
            ))}
          </View>
        )}

        {!!error && <Text style={{ color: red, fontSize: 14, fontWeight: '500' }}>{error}</Text>}
      </ScrollView>

      <View style={{ padding: 16, gap: 10 }}>
        <Button onPress={() => save.mutate()} loading={save.isPending} disabled={!name.trim()}>
          {t('common.save')}
        </Button>
        {tenant?.isActive && (
          <Button variant="destructive" icon={Trash2} onPress={deactivateDialog.open} loading={deactivate.isPending}>
            {t('admin.tenants.deactivate')}
          </Button>
        )}
      </View>

      <AlertDialog
        isVisible={deactivateDialog.isVisible}
        onClose={deactivateDialog.close}
        title={t('admin.tenants.deactivate')}
        description={t('admin.tenants.deactivateConfirm')}
        confirmText={t('admin.tenants.deactivate')}
        cancelText={t('common.cancel')}
        onConfirm={() => deactivate.mutate()}
      />

      <AvoidKeyboard />
    </View>
  );
}
