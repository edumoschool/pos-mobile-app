import React, { useEffect, useState } from 'react';
import { View, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Store, Globe, CreditCard, ChevronRight } from 'lucide-react-native';

import { Text } from '@/components/ui/text';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Picker } from '@/components/ui/picker';
import { Header } from '@/components/ui/header';
import { AvoidKeyboard } from '@/components/ui/avoid-keyboard';
import { useToast } from '@/components/ui/toast';
import { useColor } from '@/hooks/useColor';
import { useAuth } from '@/hooks/useAuth';
import { tenantsApi } from '@/api/tenants';
import { getApiErrorMessage } from '@/api/client';
import i18n from '@/i18n';
import type { Language } from '@/types';

const LANGUAGES: { label: string; value: Language }[] = [
  { label: 'English', value: 'en' },
  { label: "O'zbekcha", value: 'uz' },
  { label: 'Русский', value: 'ru' },
];

export default function BusinessScreen() {
  const { t, i18n: i18nInstance } = useTranslation();
  const qc = useQueryClient();
  const { user, refreshProfile } = useAuth();
  const { success: showSuccess, error: showError } = useToast();

  const bg = useColor('background');
  const card = useColor('card');
  const border = useColor('border');
  const text = useColor('text');
  const muted = useColor('textMuted');
  const primary = useColor('primary');

  const canEdit = user?.role === 'owner' || user?.role === 'super_admin';

  const { data: tenant, isLoading } = useQuery({
    queryKey: ['tenant', 'me'],
    queryFn: tenantsApi.getMine,
  });

  const [name, setName] = useState('');
  const [language, setLanguage] = useState<Language>('en');

  useEffect(() => {
    if (tenant) {
      setName(tenant.name);
      setLanguage((tenant.language as Language) ?? 'en');
    }
  }, [tenant]);

  const save = useMutation({
    mutationFn: () => tenantsApi.updateMine({ name: name.trim(), language }),
    onSuccess: async () => {
      qc.invalidateQueries({ queryKey: ['tenant', 'me'] });
      i18n.changeLanguage(language);
      await refreshProfile();
      showSuccess(t('common.success'), t('settings.business.saved'));
      router.back();
    },
    onError: (err) => showError(t('common.error'), getApiErrorMessage(err)),
  });

  if (isLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: bg }}>
        <Header title={t('settings.rows.business')} />
        <ActivityIndicator color={primary} style={{ marginTop: 40 }} />
      </View>
    );
  }

  const subEnd = tenant?.subscriptionEnd
    ? new Date(tenant.subscriptionEnd).toLocaleDateString(i18nInstance.language)
    : '—';

  return (
    <View style={{ flex: 1, backgroundColor: bg }}>
      <Header title={t('settings.rows.business')} />

      <ScrollView contentContainerStyle={{ padding: 16, gap: 16 }} keyboardShouldPersistTaps="handled">
        <View>
          <Text style={{ fontSize: 13, fontWeight: '600', color: muted, marginBottom: 6 }}>
            {t('auth.businessName')}
          </Text>
          <Input
            icon={Store}
            value={name}
            onChangeText={setName}
            variant="outline"
            editable={canEdit}
            disabled={!canEdit}
          />
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
            disabled={!canEdit}
            modalTitle={t('auth.language')}
          />
        </View>

        {/* Subscription summary */}
        <TouchableOpacity
          onPress={() => router.push('/settings/subscription' as any)}
          style={{ backgroundColor: card, borderRadius: 16, borderWidth: 1, borderColor: border + '60', padding: 16, flexDirection: 'row', alignItems: 'center' }}
        >
          <View style={{ width: 34, height: 34, borderRadius: 10, backgroundColor: primary + '18', alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
            <CreditCard size={18} color={primary} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 15, fontWeight: '600', color: text }}>
              {tenant?.subscriptionPlan?.name ?? t('settings.subscription.noPlan')}
            </Text>
            <Text style={{ fontSize: 12, color: muted, marginTop: 2 }}>
              {t(`settings.subscription.status.${tenant?.subscriptionStatus ?? 'trial'}` as any)} · {t('settings.subscription.until')} {subEnd}
            </Text>
          </View>
          <ChevronRight size={18} color={muted} />
        </TouchableOpacity>

        {!canEdit && (
          <Text style={{ fontSize: 12, color: muted }}>
            {t('settings.business.readOnlyForSeller')}
          </Text>
        )}
      </ScrollView>

      {canEdit && (
        <View style={{ padding: 16 }}>
          <Button onPress={() => save.mutate()} loading={save.isPending} disabled={!name.trim()}>
            {t('common.save')}
          </Button>
        </View>
      )}

      <AvoidKeyboard />
    </View>
  );
}
