import React, { useState } from 'react';
import { View, ScrollView, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { router } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Building2, ChevronRight } from 'lucide-react-native';

import { Text } from '@/components/ui/text';
import { Header } from '@/components/ui/header';
import { SearchBar } from '@/components/ui/searchbar';
import { useColor } from '@/hooks/useColor';
import { tenantsApi } from '@/api/tenants';

export default function AdminTenantsScreen() {
  const { t, i18n } = useTranslation();
  const [search, setSearch] = useState('');

  const bg = useColor('background');
  const card = useColor('card');
  const border = useColor('border');
  const text = useColor('text');
  const muted = useColor('textMuted');
  const primary = useColor('primary');
  const green = useColor('green');
  const orange = useColor('orange');
  const red = useColor('red');

  const { data: tenants = [], isLoading, refetch, isRefetching } = useQuery({
    queryKey: ['admin', 'tenants'],
    queryFn: tenantsApi.getAll,
  });

  const filtered = tenants.filter((t2) =>
    t2.name.toLowerCase().includes(search.trim().toLowerCase()),
  );

  const statusColor = (s: string) =>
    s === 'active' ? green : s === 'trial' ? orange : red;

  return (
    <View style={{ flex: 1, backgroundColor: bg }}>
      <Header title={t('admin.tenants.title')} />

      <View style={{ paddingHorizontal: 16, paddingBottom: 8 }}>
        <SearchBar
          placeholder={t('home.searchPlaceholder')}
          value={search}
          onChangeText={setSearch}
          onClear={() => setSearch('')}
          containerStyle={{ height: 42, borderRadius: 12 }}
          showClearButton
        />
      </View>

      {isLoading ? (
        <ActivityIndicator color={primary} style={{ marginTop: 40 }} />
      ) : (
        <ScrollView
          contentContainerStyle={{ padding: 16, gap: 10 }}
          refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor={primary} />}
        >
          {filtered.length === 0 && (
            <Text style={{ color: muted, textAlign: 'center', marginTop: 40 }}>{t('admin.tenants.empty')}</Text>
          )}
          {filtered.map((tenant) => (
            <TouchableOpacity
              key={tenant.id}
              onPress={() => router.push(`/admin/tenants/${tenant.id}` as any)}
              style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: card, borderRadius: 14, borderWidth: 1, borderColor: border + '60', padding: 14 }}
            >
              <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: primary + '18', alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
                <Building2 size={18} color={primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 15, fontWeight: '700', color: text }}>{tenant.name}</Text>
                <Text style={{ fontSize: 12, color: muted, marginTop: 2 }}>
                  {tenant.subscriptionPlan?.name ?? t('settings.subscription.noPlan')} ·{' '}
                  {tenant.subscriptionEnd ? new Date(tenant.subscriptionEnd).toLocaleDateString(i18n.language) : '—'}
                </Text>
              </View>
              <View style={{ paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6, backgroundColor: statusColor(tenant.subscriptionStatus) + '20', marginRight: 6 }}>
                <Text style={{ fontSize: 10, fontWeight: '700', color: statusColor(tenant.subscriptionStatus) }}>
                  {t(`settings.subscription.status.${tenant.subscriptionStatus}` as any)}
                </Text>
              </View>
              <ChevronRight size={18} color={muted} />
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );
}
