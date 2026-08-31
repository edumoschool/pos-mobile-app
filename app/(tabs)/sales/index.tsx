import React, { useState } from 'react';
import { View, TouchableOpacity, Platform, ActivityIndicator, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Text } from '@/components/ui/text';
import { useColor } from '@/hooks/useColor';
import {
  PieChart,
  Plus,
  FileText,
  ChevronRight,
  Filter
} from 'lucide-react-native';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { salesApi } from '@/api/sales';
import { FlashList } from '@shopify/flash-list';
import { RefreshControl } from 'react-native';
import { formatAmount } from '@/lib/utils';
import { useTranslation } from 'react-i18next';
import type { SaleStatus } from '@/types';

const STATUS_FILTERS: (SaleStatus | 'all')[] = ['all', 'completed', 'debt', 'cancelled'];

export default function SalesScreen() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const bg = useColor('background');
  const text = useColor('text');
  const muted = useColor('textMuted');
  const border = useColor('border');
  const primary = useColor('primary');
  const primaryForeground = useColor('primaryForeground');
  const card = useColor('card');
  const green = useColor('green');
  const orange = useColor('orange');
  const red = useColor('red');
  const secondary = useColor('secondary');

  const [showSummary, setShowSummary] = useState(true);
  const [showFilter, setShowFilter] = useState(false);
  const [status, setStatus] = useState<SaleStatus | 'all'>('all');

  const { data: summary } = useQuery({
    queryKey: ['sales-summary'],
    queryFn: () => salesApi.getSummary(),
    staleTime: 60 * 1000,
  });

  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
    isRefetching,
  } = useInfiniteQuery({
    queryKey: ['sales', status],
    queryFn: ({ pageParam = 1 }) => salesApi.getAll({
      page: pageParam,
      limit: 20,
      status: status === 'all' ? undefined : status,
    }),
    getNextPageParam: (lastPage) => lastPage.meta && lastPage.meta.page < lastPage.meta.totalPages ? lastPage.meta.page + 1 : undefined,
    initialPageParam: 1,
  });

  const sales = data?.pages.flatMap(page => page.data) || [];

  return (
    <View style={{ flex: 1, backgroundColor: bg, paddingTop: Platform.OS === 'ios' ? insets.top : insets.top }}>

      {/* Topbar */}
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: 16, paddingBottom: 16 }}>
        <TouchableOpacity onPress={() => setShowSummary((v) => !v)}>
          <PieChart size={24} color={showSummary ? primary : muted} />
        </TouchableOpacity>
        <Text style={{ fontSize: 18, fontWeight: '700', color: text }}>{t('sales.title')}</Text>
        <TouchableOpacity onPress={() => setShowFilter((v) => !v)}>
          <Filter size={22} color={status !== 'all' || showFilter ? primary : text} />
        </TouchableOpacity>
      </View>

      {/* Today's summary */}
      {showSummary && summary && (
        <View style={{ flexDirection: 'row', gap: 8, paddingHorizontal: 16, marginBottom: 12 }}>
          {[
            { label: t('sales.summary.revenue'), value: summary.totalRevenue, color: text },
            { label: t('sales.summary.profit'), value: summary.grossProfit, color: green },
            { label: t('sales.summary.debt'), value: summary.totalDebt, color: orange },
          ].map((s) => (
            <View key={s.label} style={{ flex: 1, backgroundColor: card, borderRadius: 12, padding: 12, borderWidth: 1, borderColor: border + '50' }}>
              <Text style={{ fontSize: 11, color: muted, marginBottom: 4 }} numberOfLines={1}>{s.label}</Text>
              <Text style={{ fontSize: 14, fontWeight: '800', color: s.color }} numberOfLines={1}>
                {formatAmount(s.value)}
              </Text>
            </View>
          ))}
        </View>
      )}

      {/* Status filter */}
      {showFilter && (
        <View style={{ flexDirection: 'row', gap: 8, paddingHorizontal: 16, marginBottom: 12 }}>
          {STATUS_FILTERS.map((s) => {
            const active = status === s;
            return (
              <TouchableOpacity
                key={s}
                onPress={() => setStatus(s)}
                style={{
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  borderRadius: 16,
                  backgroundColor: active ? primary : card,
                  borderWidth: 1,
                  borderColor: active ? primary : border + '80',
                }}
              >
                <Text style={{ fontSize: 12, fontWeight: '600', color: active ? primaryForeground : muted }}>
                  {t(`sales.tabs.${s}` as any)}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      )}

      {/* List */}
      <View style={{ flex: 1 }}>
        {isLoading ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color={primary} />
          </View>
        ) : (
          <FlashList
            data={sales}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: insets.bottom + 20 }}
            onEndReached={() => {
              if (hasNextPage) fetchNextPage();
            }}
            onEndReachedThreshold={0.5}
            refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor={primary} colors={[primary]} />}
            ListEmptyComponent={() => (
              <View style={{ alignItems: 'center', paddingTop: 60 }}>
                <Image
                  source={require('@/assets/icons/empty.png')}
                  style={{ width: 150, height: 150, marginBottom: 16, opacity: 0.9 }}
                  resizeMode="contain"
                />
                <Text style={{ color: muted, fontSize: 15 }}>{t('sales.noResults')}</Text>
              </View>
            )}
            ListFooterComponent={() => {
              if (!isFetchingNextPage) return null;
              return <ActivityIndicator size="small" color={primary} style={{ marginVertical: 16 }} />;
            }}
            renderItem={({ item }) => {
              let statusBg = secondary;
              let statusColor = muted;
              let displayStatus = t('sales.status.unknown');

              if (item.status === 'completed') {
                statusBg = green + '20';
                statusColor = green;
                displayStatus = t('sales.status.completed');
              } else if (item.status === 'debt') {
                statusBg = orange + '20';
                statusColor = orange;
                displayStatus = t('sales.status.debt');
              } else if (item.status === 'cancelled') {
                statusBg = red + '20';
                statusColor = red;
                displayStatus = t('sales.status.cancelled');
              }

              const customerName = item.client?.fullName || t('sales.walkInCustomer');
              const dateStr = new Date(item.createdAt).toLocaleString(undefined, {
                month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit'
              });
              const itemsCount = item.items?.length || 0;

              return (
                <TouchableOpacity
                  onPress={() => router.push(`/sales/${item.id}` as any)}
                  style={{
                    backgroundColor: card,
                    borderRadius: 12,
                    padding: 12,
                    marginBottom: 8,
                    flexDirection: 'row',
                    alignItems: 'center',
                    borderWidth: 1,
                    borderColor: border + '50'
                  }}
                >
                  {/* Icon */}
                  <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: statusBg, alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
                    <FileText size={20} color={statusColor} />
                  </View>

                  {/* Info */}
                  <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                      <Text style={{ fontSize: 15, fontWeight: '700', color: text }}>
                        {item.id.substring(0, 8).toUpperCase()}
                      </Text>
                      <View style={{ backgroundColor: statusBg, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 }}>
                        <Text style={{ color: statusColor, fontSize: 10, fontWeight: '600' }}>{displayStatus}</Text>
                      </View>
                    </View>
                    <Text style={{ fontSize: 13, color: muted, marginBottom: 2 }}>{customerName}</Text>
                    <Text style={{ fontSize: 11, color: muted }}>{dateStr}</Text>
                  </View>

                  {/* Right */}
                  <View style={{ alignItems: 'flex-end', justifyContent: 'center' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                      <View style={{ alignItems: 'flex-end' }}>
                        <Text style={{ fontSize: 15, fontWeight: '800', color: text, marginBottom: 2 }}>
                          {formatAmount(item.totalAmount)} {item.currency}
                        </Text>
                        <Text style={{ fontSize: 12, color: muted }}>{t('sales.items', { count: itemsCount })}</Text>
                      </View>
                      <ChevronRight size={18} color={muted} />
                    </View>
                  </View>
                </TouchableOpacity>
              );
            }}
          />
        )}
      </View>

      {/* Floating Action Button */}
      <TouchableOpacity
        onPress={() => router.push('/sales/create' as any)}
        style={{ position: 'absolute', right: 20, bottom: insets.bottom + 30, width: 60, height: 60, borderRadius: 30, backgroundColor: primary, alignItems: 'center', justifyContent: 'center', shadowColor: primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 6 }}
      >
        <Plus size={28} color={primaryForeground} />
      </TouchableOpacity>
    </View>
  );
}
