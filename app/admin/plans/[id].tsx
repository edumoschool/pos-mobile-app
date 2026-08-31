import React, { useEffect, useState } from 'react';
import { View, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Crown, Power, Trash2, Tag, Clock, GitBranch, Users, Package } from 'lucide-react-native';

import { Text } from '@/components/ui/text';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/ui/header';
import { AvoidKeyboard } from '@/components/ui/avoid-keyboard';
import { AlertDialog, useAlertDialog } from '@/components/ui/alert-dialog';
import { useToast } from '@/components/ui/toast';
import { useColor } from '@/hooks/useColor';
import { subscriptionPlansApi } from '@/api/subscription-plans';
import { getApiErrorMessage } from '@/api/client';
import { formatAmount } from '@/lib/utils';
import type { CreateSubscriptionPlanPayload } from '@/types';

const num = (s: string) => Number(s.replace(/,/g, '')) || 0;

export default function AdminPlanFormScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const isNew = id === 'new';
  const { t } = useTranslation();
  const qc = useQueryClient();
  const { success: showSuccess, error: showError } = useToast();
  const deactivateDialog = useAlertDialog();

  const bg = useColor('background');
  const text = useColor('text');
  const muted = useColor('textMuted');
  const primary = useColor('primary');
  const green = useColor('green');
  const red = useColor('red');

  const { data: plan, isLoading } = useQuery({
    queryKey: ['subscription-plan', id],
    queryFn: () => subscriptionPlansApi.getById(id!),
    enabled: !isNew && !!id,
  });

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [durationDays, setDurationDays] = useState('30');
  const [maxBranches, setMaxBranches] = useState('1');
  const [maxUsers, setMaxUsers] = useState('3');
  const [maxProducts, setMaxProducts] = useState('100');
  const [isActive, setIsActive] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (plan) {
      setName(plan.name);
      setDescription(plan.description ?? '');
      setPrice(String(plan.price));
      setDurationDays(String(plan.durationDays));
      setMaxBranches(String(plan.maxBranches));
      setMaxUsers(String(plan.maxUsers));
      setMaxProducts(String(plan.maxProducts));
      setIsActive(plan.isActive);
    }
  }, [plan]);

  const save = useMutation({
    mutationFn: () => {
      const payload: CreateSubscriptionPlanPayload = {
        name: name.trim(),
        description: description.trim() || undefined,
        price: num(price),
        durationDays: num(durationDays),
        maxBranches: num(maxBranches),
        maxUsers: num(maxUsers),
        maxProducts: num(maxProducts),
        isActive,
      };
      return isNew ? subscriptionPlansApi.create(payload) : subscriptionPlansApi.update(id!, payload);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['subscription-plans'] });
      qc.invalidateQueries({ queryKey: ['subscription-plan', id] });
      showSuccess(t('common.success'), isNew ? t('admin.plans.created') : t('admin.plans.updated'));
      router.back();
    },
    onError: (err) => setError(getApiErrorMessage(err)),
  });

  const deactivate = useMutation({
    mutationFn: () => subscriptionPlansApi.deactivate(id!),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['subscription-plans'] });
      deactivateDialog.close();
      showSuccess(t('common.success'), t('admin.plans.deactivated'));
      router.back();
    },
    onError: (err) => {
      deactivateDialog.close();
      showError(t('common.error'), getApiErrorMessage(err));
    },
  });

  const submit = () => {
    setError('');
    if (!name.trim()) return setError(t('admin.plans.nameRequired'));
    if (num(durationDays) < 1) return setError(t('admin.plans.durationRequired'));
    save.mutate();
  };

  if (!isNew && isLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: bg }}>
        <Header title={t('admin.plans.edit')} />
        <ActivityIndicator color={primary} style={{ marginTop: 40 }} />
      </View>
    );
  }

  const numFields: { icon: React.ComponentType<any>; label: string; value: string; set: (v: string) => void }[] = [
    { icon: Tag, label: t('admin.plans.price'), value: price, set: setPrice },
    { icon: Clock, label: t('admin.plans.durationDays'), value: durationDays, set: setDurationDays },
    { icon: GitBranch, label: t('admin.plans.maxBranches'), value: maxBranches, set: setMaxBranches },
    { icon: Users, label: t('admin.plans.maxUsers'), value: maxUsers, set: setMaxUsers },
    { icon: Package, label: t('admin.plans.maxProducts'), value: maxProducts, set: setMaxProducts },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: bg }}>
      <Header title={isNew ? t('admin.plans.add') : t('admin.plans.edit')} />

      <ScrollView contentContainerStyle={{ padding: 16, gap: 12 }} keyboardShouldPersistTaps="handled">
        <Input icon={Crown} placeholder={t('admin.plans.name')} value={name} onChangeText={setName} variant="outline" />
        <Input placeholder={t('admin.plans.description')} value={description} onChangeText={setDescription} variant="outline" type="textarea" rows={2} />

        {numFields.map((f) => (
          <View key={f.label}>
            <Text style={{ fontSize: 12, color: muted, marginBottom: 4, marginLeft: 4 }}>{f.label}</Text>
            <Input icon={f.icon} placeholder="0" value={f.value} onChangeText={(v) => f.set(v.replace(/[^0-9.]/g, ''))} keyboardType="decimal-pad" variant="outline" />
          </View>
        ))}

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
            {isActive ? t('common.on') : t('common.off')}
          </Text>
        </TouchableOpacity>

        {!!error && <Text style={{ color: red, fontSize: 14, fontWeight: '500' }}>{error}</Text>}
      </ScrollView>

      <View style={{ padding: 16, gap: 10 }}>
        <Button onPress={submit} loading={save.isPending} disabled={!name.trim()}>{t('common.save')}</Button>
        {!isNew && plan?.isActive && (
          <Button variant="destructive" icon={Trash2} onPress={deactivateDialog.open} loading={deactivate.isPending}>
            {t('admin.plans.deactivate')}
          </Button>
        )}
      </View>

      <AlertDialog
        isVisible={deactivateDialog.isVisible}
        onClose={deactivateDialog.close}
        title={t('admin.plans.deactivate')}
        description={t('admin.plans.deactivateConfirm')}
        confirmText={t('admin.plans.deactivate')}
        cancelText={t('common.cancel')}
        onConfirm={() => deactivate.mutate()}
      />

      <AvoidKeyboard />
    </View>
  );
}
