import React from 'react';
import { View, ScrollView, ActivityIndicator, RefreshControl } from 'react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Smartphone, Monitor, LogOut } from 'lucide-react-native';

import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/ui/header';
import { AlertDialog, useAlertDialog } from '@/components/ui/alert-dialog';
import { useToast } from '@/components/ui/toast';
import { useColor } from '@/hooks/useColor';
import { useAuth } from '@/hooks/useAuth';
import { authApi } from '@/api/auth';
import { getApiErrorMessage } from '@/api/client';

export default function SessionsScreen() {
  const { t, i18n } = useTranslation();
  const qc = useQueryClient();
  const { logout } = useAuth();
  const { success: showSuccess, error: showError } = useToast();
  const logoutAllDialog = useAlertDialog();

  const bg = useColor('background');
  const card = useColor('card');
  const border = useColor('border');
  const text = useColor('text');
  const muted = useColor('textMuted');
  const primary = useColor('primary');
  const green = useColor('green');
  const red = useColor('red');

  const { data: sessions = [], isLoading, refetch, isRefetching } = useQuery({
    queryKey: ['sessions'],
    queryFn: authApi.getSessions,
  });

  const revoke = useMutation({
    mutationFn: (id: string) => authApi.revokeSession(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['sessions'] });
      showSuccess(t('common.success'), t('settings.sessions.revoked'));
    },
    onError: (err) => showError(t('common.error'), getApiErrorMessage(err)),
  });

  const logoutAll = useMutation({
    mutationFn: () => authApi.logoutAll(),
    onSuccess: async () => {
      logoutAllDialog.close();
      await logout();
    },
    onError: (err) => {
      logoutAllDialog.close();
      showError(t('common.error'), getApiErrorMessage(err));
    },
  });

  return (
    <View style={{ flex: 1, backgroundColor: bg }}>
      <Header title={t('settings.rows.sessions')} />

      {isLoading ? (
        <ActivityIndicator color={primary} style={{ marginTop: 40 }} />
      ) : (
        <ScrollView
          contentContainerStyle={{ padding: 16, gap: 10 }}
          refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor={primary} />}
        >
          {sessions.map((s) => {
            const isWeb = (s.userAgent ?? '').toLowerCase().includes('web');
            const DeviceIcon = isWeb ? Monitor : Smartphone;
            return (
              <View
                key={s.id}
                style={{ backgroundColor: card, borderRadius: 14, borderWidth: 1, borderColor: border + '60', padding: 14, flexDirection: 'row', alignItems: 'center', gap: 12 }}
              >
                <View style={{ width: 34, height: 34, borderRadius: 10, backgroundColor: primary + '18', alignItems: 'center', justifyContent: 'center' }}>
                  <DeviceIcon size={18} color={primary} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 14, fontWeight: '600', color: text }} numberOfLines={1}>
                    {s.userAgent || t('settings.sessions.unknownDevice')}
                  </Text>
                  <Text style={{ fontSize: 12, color: muted, marginTop: 2 }}>
                    {s.ipAddress || '—'} · {new Date(s.createdAt).toLocaleDateString(i18n.language)}
                  </Text>
                </View>
                {s.isCurrent ? (
                  <Text style={{ fontSize: 11, fontWeight: '700', color: green }}>
                    {t('settings.sessions.current')}
                  </Text>
                ) : (
                  <Text
                    onPress={() => revoke.mutate(s.id)}
                    style={{ fontSize: 12, fontWeight: '700', color: red }}
                  >
                    {t('settings.sessions.revoke')}
                  </Text>
                )}
              </View>
            );
          })}

          <Button
            variant="destructive"
            icon={LogOut}
            onPress={logoutAllDialog.open}
            style={{ marginTop: 16 }}
          >
            {t('settings.sessions.logoutAll')}
          </Button>
        </ScrollView>
      )}

      <AlertDialog
        isVisible={logoutAllDialog.isVisible}
        onClose={logoutAllDialog.close}
        title={t('settings.sessions.logoutAll')}
        description={t('settings.sessions.logoutAllConfirm')}
        confirmText={t('settings.sessions.logoutAll')}
        cancelText={t('common.cancel')}
        onConfirm={() => logoutAll.mutate()}
      />
    </View>
  );
}
