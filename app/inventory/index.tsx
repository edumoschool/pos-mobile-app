import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity, ActivityIndicator, Image, RefreshControl } from 'react-native';
import { router } from 'expo-router';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { FlashList } from '@shopify/flash-list';
import { Package, AlertTriangle, ChevronRight } from 'lucide-react-native';

import { Text } from '@/components/ui/text';
import { Header } from '@/components/ui/header';
import { useColor } from '@/hooks/useColor';
import { useAuth } from '@/hooks/useAuth';
import { inventoryApi } from '@/api/inventory';
import { formatAmount } from '@/lib/utils';
import type { Inventory } from '@/types';

export default function InventoryScreen() {
  const { t } = useTranslation();
  const { user } = useAuth();
  // Inventory management is owner/super_admin only — the backend enforces
  // this too (403), this just avoids a flash of an error screen for sellers.
  const canView = user?.role !== 'seller';

  useEffect(() => {
    if (!canView) router.back();
  }, [canView]);

  const bg = useColor('background');
  const card = useColor('card');
  const border = useColor('border');
  const text = useColor('text');
  const muted = useColor('textMuted');
  const primary = useColor('primary');
  const primaryForeground = useColor('primaryForeground');
  const green = useColor('green');
  const orange = useColor('orange');
  const red = useColor('red');

  const [lowStockOnly, setLowStockOnly] = useState(false);

  const {
    data,
    isLoading: isLoadingAll,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch: refetchAll,
    isRefetching: isRefetchingAll,
  } = useInfiniteQuery({
    queryKey: ['inventory'],
    queryFn: ({ pageParam = 1 }) => inventoryApi.getAll({ page: pageParam, limit: 20 }),
    getNextPageParam: (lastPage) =>
      lastPage.meta && lastPage.meta.page < lastPage.meta.totalPages ? lastPage.meta.page + 1 : undefined,
    initialPageParam: 1,
    enabled: canView && !lowStockOnly,
  });

  const {
    data: lowStockData,
    isLoading: isLoadingLowStock,
    refetch: refetchLowStock,
    isRefetching: isRefetchingLowStock,
  } = useQuery({
    queryKey: ['inventory', 'low-stock'],
    queryFn: () => inventoryApi.getLowStock({ limit: 200 }),
    enabled: canView && lowStockOnly,
  });

  const items: Inventory[] = lowStockOnly
    ? lowStockData?.data ?? []
    : data?.pages.flatMap((p) => p.data) ?? [];
  const total = lowStockOnly
    ? lowStockData?.meta?.total ?? lowStockData?.data?.length ?? 0
    : data?.pages[0]?.meta?.total ?? items.length;
  const isLoading = lowStockOnly ? isLoadingLowStock : isLoadingAll;
  const isRefetching = lowStockOnly ? isRefetchingLowStock : isRefetchingAll;
  const refetch = lowStockOnly ? refetchLowStock : refetchAll;

  const statusOf = (item: Inventory) => {
    const qty = Number(item.quantity);
    const min = item.minQuantity != null ? Number(item.minQuantity) : null;
    if (qty <= 0) return { label: t('products.outOfStock'), color: red };
    if (min != null && qty <= min) return { label: t('products.lowStock'), color: orange };
    return { label: t('products.inStock'), color: green };
  };

  if (!canView) return null;

  return (
    <View style={{ flex: 1, backgroundColor: bg }}>
      <Header title={t('inventory.title')} />

      {/* Tabs */}
      <View style={{ flexDirection: 'row', gap: 8, paddingHorizontal: 16, marginBottom: 12 }}>
        {[
          { key: false, label: t('inventory.allStock') },
          { key: true, label: t('inventory.lowStock') },
        ].map((tab) => {
          const active = lowStockOnly === tab.key;
          return (
            <TouchableOpacity
              key={String(tab.key)}
              onPress={() => setLowStockOnly(tab.key)}
              style={{
                flex: 1,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
                paddingVertical: 10,
                borderRadius: 12,
                backgroundColor: active ? primary : card,
                borderWidth: 1,
                borderColor: active ? primary : border + '80',
              }}
            >
              {tab.key && <AlertTriangle size={14} color={active ? primaryForeground : orange} />}
              <Text style={{ fontSize: 13, fontWeight: '700', color: active ? primaryForeground : muted }}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={{ paddingHorizontal: 20, paddingBottom: 8 }}>
        <Text style={{ fontSize: 13, color: muted }}>
          {total.toLocaleString()} {t('inventory.totalItems').toLowerCase()}
        </Text>
      </View>

      <View style={{ flex: 1 }}>
        {isLoading ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color={primary} />
          </View>
        ) : (
          <FlashList
            data={items}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 40 }}
            onEndReached={() => {
              if (!lowStockOnly && hasNextPage) fetchNextPage();
            }}
            onEndReachedThreshold={0.5}
            refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor={primary} />}
            ListFooterComponent={() => {
              if (!isFetchingNextPage) return null;
              return <ActivityIndicator size="small" color={primary} style={{ marginVertical: 16 }} />;
            }}
            ListEmptyComponent={() => (
              <View style={{ alignItems: 'center', paddingTop: 60 }}>
                <Image
                  source={require('@/assets/icons/empty.png')}
                  style={{ width: 140, height: 140, marginBottom: 16, opacity: 0.9 }}
                  resizeMode="contain"
                />
                <Text style={{ color: muted, fontSize: 15 }}>
                  {lowStockOnly ? t('inventory.noLowStock') : t('inventory.empty')}
                </Text>
              </View>
            )}
            renderItem={({ item }) => {
              const status = statusOf(item);
              return (
                <TouchableOpacity
                  onPress={() => router.push(`/inventory/${item.id}` as any)}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    backgroundColor: card,
                    borderRadius: 12,
                    padding: 12,
                    marginBottom: 8,
                    borderWidth: 1,
                    borderColor: border + '50',
                  }}
                >
                  <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: status.color + '18', alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
                    <Package size={20} color={status.color} />
                  </View>

                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 15, fontWeight: '600', color: text }} numberOfLines={1}>
                      {item.product?.name ?? '—'}
                    </Text>
                    <View style={{ backgroundColor: status.color + '18', alignSelf: 'flex-start', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, marginTop: 4 }}>
                      <Text style={{ fontSize: 10, fontWeight: '700', color: status.color }}>{status.label}</Text>
                    </View>
                  </View>

                  <View style={{ alignItems: 'flex-end' }}>
                    <Text style={{ fontSize: 16, fontWeight: '800', color: text }}>
                      {formatAmount(item.quantity)} {item.product?.unit?.shortName ?? ''}
                    </Text>
                    {item.minQuantity != null && (
                      <Text style={{ fontSize: 11, color: muted, marginTop: 2 }}>
                        {t('inventory.minLabel')}: {formatAmount(item.minQuantity)}
                      </Text>
                    )}
                  </View>
                  <ChevronRight size={18} color={muted} style={{ marginLeft: 6 }} />
                </TouchableOpacity>
              );
            }}
          />
        )}
      </View>
    </View>
  );
}
