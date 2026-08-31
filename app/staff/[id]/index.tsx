import React, { useEffect } from 'react';
import { View, ScrollView, ActivityIndicator, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Phone, Shield, Building2, Globe, Power, Edit, Trash2 } from 'lucide-react-native';

import { Text } from '@/components/ui/text';
import { Header } from '@/components/ui/header';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { AlertDialog, useAlertDialog } from '@/components/ui/alert-dialog';
import { useToast } from '@/components/ui/toast';
import { useColor } from '@/hooks/useColor';
import { useAuth } from '@/hooks/useAuth';
import { usersApi } from '@/api/users';
import { getApiErrorMessage } from '@/api/client';

export default function StaffDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { t } = useTranslation();
  const qc = useQueryClient();
  const { user: currentUser } = useAuth();
  const { success: showSuccess, error: showError } = useToast();
  const deactivateDialog = useAlertDialog();

  // Staff management is owner/super_admin only — the backend enforces this
  // too (403), this just keeps sellers from ever reaching the screen.
  const canView = currentUser?.role !== 'seller';
  useEffect(() => {
    if (!canView) router.back();
  }, [canView]);

  const bg = useColor('background');
  const card = useColor('card');
  const border = useColor('border');
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

  const deactivate = useMutation({
    mutationFn: () => usersApi.deactivate(id!),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['users'] });
      qc.invalidateQueries({ queryKey: ['user', id] });
      deactivateDialog.close();
      showSuccess(t('common.success'), t('staff.deactivated'));
      router.back();
    },
    onError: (err) => {
      deactivateDialog.close();
      showError(t('common.error'), getApiErrorMessage(err));
    },
  });

  if (!canView) return null;

  if (isLoading) {
    return (
      <View style={[styles.container, { backgroundColor: bg }]}>
        <Header title={t('staff.detail')} />
        <ActivityIndicator color={primary} style={{ marginTop: 40 }} />
      </View>
    );
  }
  if (!user) return null;

  const rows: { icon: React.ComponentType<any>; label: string; value: string }[] = [
    { icon: Shield, label: t('staff.role'), value: t(`settings.roles.${user.role}` as any) },
    { icon: Building2, label: t('staff.branch'), value: user.branch?.name ?? t('staff.noBranch') },
    { icon: Globe, label: t('auth.language'), value: user.language?.toUpperCase() ?? '—' },
    { icon: Power, label: t('staff.status'), value: user.isActive ? t('settings.branches.active') : t('settings.branches.inactive') },
  ];

  return (
    <View style={[styles.container, { backgroundColor: bg }]}>
      <Header
        title={t('staff.detail')}
        right={
          <View style={{ flexDirection: 'row', gap: 14, alignItems: 'center' }}>
            {user.isActive && (
              <TouchableOpacity onPress={deactivateDialog.open}>
                <Trash2 size={20} color={red} />
              </TouchableOpacity>
            )}
            <TouchableOpacity onPress={() => router.push(`/staff/${id}/edit` as any)}>
              <Edit size={20} color={primary} />
            </TouchableOpacity>
          </View>
        }
      />

      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        <View style={{ alignItems: 'center', paddingVertical: 28 }}>
          <Avatar size={84}>
            <AvatarFallback style={{ backgroundColor: primary }} textStyle={{ color: '#fff', fontSize: 30, fontWeight: '700' }}>
              {user.fullName.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <Text style={{ fontSize: 21, fontWeight: '800', color: text, marginTop: 14 }}>{user.fullName}</Text>
          <TouchableOpacity
            onPress={() => user.phone && Linking.openURL(`tel:${user.phone}`)}
            style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 6 }}
          >
            <Phone size={14} color={primary} />
            <Text style={{ fontSize: 15, color: primary, fontWeight: '600' }}>{user.phone}</Text>
          </TouchableOpacity>
        </View>

        <View style={{ marginHorizontal: 16, borderRadius: 16, backgroundColor: card, borderWidth: 1, borderColor: border + '60', overflow: 'hidden' }}>
          {rows.map(({ icon: RowIcon, label, value }, i) => (
            <View key={label}>
              {i > 0 && <View style={{ height: StyleSheet.hairlineWidth, backgroundColor: border, marginLeft: 56 }} />}
              <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14 }}>
                <View style={{ width: 32, height: 32, borderRadius: 8, backgroundColor: primary + '18', alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
                  <RowIcon size={16} color={i === rows.length - 1 && !user.isActive ? red : primary} />
                </View>
                <Text style={{ flex: 1, fontSize: 13, color: muted }}>{label}</Text>
                <Text style={{ fontSize: 15, fontWeight: '600', color: i === rows.length - 1 ? (user.isActive ? green : red) : text }}>
                  {value}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {!user.isActive && (
        <View style={{ padding: 16 }}>
          <Button onPress={() => router.push(`/staff/${id}/edit` as any)}>{t('staff.reactivateHint')}</Button>
        </View>
      )}

      <AlertDialog
        isVisible={deactivateDialog.isVisible}
        onClose={deactivateDialog.close}
        title={t('staff.deactivate')}
        description={t('staff.deactivateConfirm')}
        confirmText={t('staff.deactivate')}
        cancelText={t('common.cancel')}
        onConfirm={() => deactivate.mutate()}
      />
    </View>
  );
}

const styles = StyleSheet.create({ container: { flex: 1 } });
