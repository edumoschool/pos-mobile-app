import React from 'react';
import { View, ScrollView, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { router } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Plus, Crown, ChevronRight } from 'lucide-react-native';

import { Text } from '@/components/ui/text';
import { Header } from '@/components/ui/header';
import { useColor } from '@/hooks/useColor';
import { subscriptionPlansApi } from '@/api/subscription-plans';
import { formatAmount } from '@/lib/utils';

export default function AdminPlansScreen() {
  const { t } = useTranslation();

  const bg = useColor('background');
  const card = useColor('card');
  const border = useColor('border');
  const text = useColor('text');
  const muted = useColor('textMuted');
  const primary = useColor('primary');
  const primaryForeground = useColor('primaryForeground');
  const green = useColor('green');
  const red = useColor('red');

  const { data: plans = [], isLoading, refetch, isRefetching } = useQuery({
    queryKey: ['subscription-plans'],
    queryFn: subscriptionPlansApi.getAll,
  });

  return (
    <View style={{ flex: 1, backgroundColor: bg }}>
      <Header
        title={t('admin.plans.title')}
        right={
          <TouchableOpacity
            onPress={() => router.push('/admin/plans/new' as any)}
            style={{ width: 34, height: 34, borderRadius: 10, backgroundColor: primary, alignItems: 'center', justifyContent: 'center' }}
          >
            <Plus size={18} color={primaryForeground} />
          </TouchableOpacity>
        }
      />

      {isLoading ? (
        <ActivityIndicator color={primary} style={{ marginTop: 40 }} />
      ) : (
        <ScrollView
          contentContainerStyle={{ padding: 16, gap: 10 }}
          refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor={primary} />}
        >
          {plans.length === 0 && (
            <Text style={{ color: muted, textAlign: 'center', marginTop: 40 }}>{t('admin.plans.empty')}</Text>
          )}
          {plans.map((plan) => (
            <TouchableOpacity
              key={plan.id}
              onPress={() => router.push(`/admin/plans/${plan.id}` as any)}
              style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: card, borderRadius: 14, borderWidth: 1, borderColor: border + '60', padding: 14 }}
            >
              <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: primary + '18', alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
                <Crown size={18} color={primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 15, fontWeight: '700', color: text }}>{plan.name}</Text>
                <Text style={{ fontSize: 12, color: muted, marginTop: 2 }}>
                  {formatAmount(plan.price)} · {plan.durationDays}d · {plan.maxUsers}👤 · {plan.maxProducts}📦
                </Text>
              </View>
              <Text style={{ fontSize: 10, fontWeight: '700', color: plan.isActive ? green : red, marginRight: 6 }}>
                {plan.isActive ? t('common.on') : t('common.off')}
              </Text>
              <ChevronRight size={18} color={muted} />
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );
}
