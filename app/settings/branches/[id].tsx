import React, { useEffect, useState } from 'react';
import { View, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Store, MapPin, Phone, Power, Trash2 } from 'lucide-react-native';

import { Text } from '@/components/ui/text';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/ui/header';
import { AvoidKeyboard } from '@/components/ui/avoid-keyboard';
import { AlertDialog, useAlertDialog } from '@/components/ui/alert-dialog';
import { useToast } from '@/components/ui/toast';
import { useColor } from '@/hooks/useColor';
import { branchesApi } from '@/api/branches';
import { getApiErrorMessage } from '@/api/client';

export default function BranchFormScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const isNew = id === 'new';
  const { t } = useTranslation();
  const qc = useQueryClient();
  const { success: showSuccess, error: showError } = useToast();
  const deleteDialog = useAlertDialog();

  const bg = useColor('background');
  const text = useColor('text');
  const muted = useColor('textMuted');
  const primary = useColor('primary');
  const green = useColor('green');
  const red = useColor('red');

  const { data: branch, isLoading } = useQuery({
    queryKey: ['branch', id],
    queryFn: () => branchesApi.getById(id!),
    enabled: !isNew && !!id,
  });

  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    if (branch) {
      setName(branch.name);
      setAddress(branch.address ?? '');
      setPhone(branch.phone ?? '');
      setIsActive(branch.isActive);
    }
  }, [branch]);

  const save = useMutation({
    mutationFn: () => {
      const payload = {
        name: name.trim(),
        address: address.trim() || undefined,
        phone: phone.trim() || undefined,
      };
      return isNew
        ? branchesApi.create(payload)
        : branchesApi.update(id!, { ...payload, isActive });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['branches'] });
      qc.invalidateQueries({ queryKey: ['branch', id] });
      showSuccess(t('common.success'), isNew ? t('settings.branches.created') : t('settings.branches.updated'));
      router.back();
    },
    onError: (err) => showError(t('common.error'), getApiErrorMessage(err)),
  });

  const remove = useMutation({
    mutationFn: () => branchesApi.deactivate(id!),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['branches'] });
      deleteDialog.close();
      showSuccess(t('common.success'), t('settings.branches.deactivated'));
      router.back();
    },
    onError: (err) => {
      deleteDialog.close();
      showError(t('common.error'), getApiErrorMessage(err));
    },
  });

  if (!isNew && isLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: bg }}>
        <Header title={t('settings.rows.branches')} />
        <ActivityIndicator color={primary} style={{ marginTop: 40 }} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: bg }}>
      <Header title={isNew ? t('settings.branches.add') : t('settings.branches.edit')} />

      <ScrollView contentContainerStyle={{ padding: 16, gap: 12 }} keyboardShouldPersistTaps="handled">
        <Input icon={Store} placeholder={t('home.supplierName')} value={name} onChangeText={setName} variant="outline" />
        <Input icon={MapPin} placeholder={t('clientDetail.address')} value={address} onChangeText={setAddress} variant="outline" />
        <Input icon={Phone} placeholder={t('home.clientPhone')} value={phone} onChangeText={setPhone} keyboardType="phone-pad" variant="outline" />

        {!isNew && (
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
        )}
      </ScrollView>

      <View style={{ padding: 16, gap: 10 }}>
        <Button onPress={() => save.mutate()} loading={save.isPending} disabled={!name.trim()}>
          {t('common.save')}
        </Button>
        {!isNew && branch?.isActive && (
          <Button variant="destructive" icon={Trash2} onPress={deleteDialog.open} loading={remove.isPending}>
            {t('settings.branches.deactivate')}
          </Button>
        )}
      </View>

      <AlertDialog
        isVisible={deleteDialog.isVisible}
        onClose={deleteDialog.close}
        title={t('settings.branches.deactivate')}
        description={t('settings.branches.deactivateConfirm')}
        confirmText={t('settings.branches.deactivate')}
        cancelText={t('common.cancel')}
        onConfirm={() => remove.mutate()}
      />

      <AvoidKeyboard />
    </View>
  );
}
