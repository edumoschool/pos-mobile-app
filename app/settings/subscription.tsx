import React from 'react';
import { View, ScrollView, ActivityIndicator, StyleSheet } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Check, Crown } from 'lucide-react-native';

import { Text } from '@/components/ui/text';
import { Header } from '@/components/ui/header';
import { useColor } from '@/hooks/useColor';
import { useAuth } from '@/hooks/useAuth';
import { tenantsApi } from '@/api/tenants';
import { subscriptionPlansApi } from '@/api/subscription-plans';
import { formatAmount } from '@/lib/utils';

export default function SubscriptionScreen() {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();

  const bg = useColor('background');
  const card = useColor('card');
  const border = useColor('border');
  const text = useColor('text');
  const muted = useColor('textMuted');
  const primary = useColor('primary');
  const green = useColor('green');
  const orange = useColor('orange');
  const red = useColor('red');

  const { data: tenant } = useQuery({ queryKey: ['tenant', 'me'], queryFn: tenantsApi.getMine });
  const { data: plans = [], isLoading } = useQuery({
    queryKey: ['subscription-plans'],
    queryFn: subscriptionPlansApi.getAll,
  });

  const status = tenant?.subscriptionStatus ?? user?.tenant?.subscriptionStatus ?? 'trial';
  const currentPlanId = tenant?.subscriptionPlanId ?? user?.tenant?.subscriptionPlanId;
  const end = tenant?.subscriptionEnd ?? user?.tenant?.subscriptionEnd;

  const statusColor =
    status === 'active' ? green : status === 'trial' ? orange : red;

  return (
    <View style={{ flex: 1, backgroundColor: bg }}>
      <Header title={t('settings.rows.subscription')} />

      <ScrollView contentContainerStyle={{ padding: 16, gap: 16 }}>
        {/* current status */}
        <View style={{ backgroundColor: card, borderRadius: 16, borderWidth: 1, borderColor: border + '60', padding: 16 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <Crown size={18} color={primary} />
            <Text style={{ fontSize: 16, fontWeight: '700', color: text }}>
              {tenant?.subscriptionPlan?.name ?? t('settings.subscription.noPlan')}
            </Text>
          </View>
          <View style={[styles.badge, { backgroundColor: statusColor + '20', alignSelf: 'flex-start' }]}>
            <Text style={{ fontSize: 12, fontWeight: '700', color: statusColor }}>
              {t(`settings.subscription.status.${status}` as any)}
            </Text>
          </View>
          {!!end && (
            <Text style={{ fontSize: 13, color: muted, marginTop: 8 }}>
              {t('settings.subscription.renews')}: {new Date(end).toLocaleDateString(i18n.language)}
            </Text>
          )}
        </View>

        <Text style={{ fontSize: 12, fontWeight: '700', color: muted, textTransform: 'uppercase', letterSpacing: 0.5 }}>
          {t('settings.subscription.available')}
        </Text>

        {isLoading ? (
          <ActivityIndicator color={primary} />
        ) : (
          plans.map((plan) => {
            const isCurrent = plan.id === currentPlanId;
            return (
              <View
                key={plan.id}
                style={{
                  backgroundColor: card,
                  borderRadius: 16,
                  borderWidth: isCurrent ? 2 : 1,
                  borderColor: isCurrent ? primary : border + '60',
                  padding: 16,
                }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Text style={{ fontSize: 16, fontWeight: '700', color: text }}>{plan.name}</Text>
                  <Text style={{ fontSize: 16, fontWeight: '800', color: primary }}>
                    {formatAmount(plan.price)}
                  </Text>
                </View>
                {!!plan.description && (
                  <Text style={{ fontSize: 13, color: muted, marginTop: 4 }}>{plan.description}</Text>
                )}
                <View style={{ gap: 6, marginTop: 12 }}>
                  {[
                    t('settings.subscription.limits.days', { count: plan.durationDays }),
                    t('settings.subscription.limits.branches', { count: plan.maxBranches }),
                    t('settings.subscription.limits.users', { count: plan.maxUsers }),
                    t('settings.subscription.limits.products', { count: plan.maxProducts }),
                  ].map((line) => (
                    <View key={line} style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                      <Check size={14} color={green} />
                      <Text style={{ fontSize: 13, color: text }}>{line}</Text>
                    </View>
                  ))}
                </View>
                {isCurrent && (
                  <Text style={{ fontSize: 12, fontWeight: '700', color: primary, marginTop: 12 }}>
                    {t('settings.subscription.currentPlan')}
                  </Text>
                )}
              </View>
            );
          })
        )}

        <Text style={{ fontSize: 12, color: muted, textAlign: 'center', marginTop: 4 }}>
          {t('settings.subscription.contactToChange')}
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
});
