import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Platform, ActivityIndicator, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { router } from 'expo-router';
import { Plus, Filter, Package, ChevronDown } from 'lucide-react-native';
import { FlashList } from '@shopify/flash-list';

import { Text } from '@/components/ui/text';
import { useColor } from '@/hooks/useColor';
import { productsApi } from '@/api/products';
import { SearchBar } from '@/components/ui/searchbar';
import { Product } from '@/types';

export default function ProductsScreen() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const listRef = useRef<any>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const bg = useColor('background');
  const card = useColor('card');
  const border = useColor('border');
  const text = useColor('text');
  const muted = useColor('textMuted');
  const primary = useColor('primary');
  const primaryForeground = useColor('primaryForeground');
  const red = useColor('red');
  const green = useColor('green');
  const orange = '#FF9500';

  const {
    data: productsData,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['products', searchQuery],
    queryFn: ({ pageParam = 1 }) =>
      productsApi.getAll({ page: pageParam, limit: 20, search: searchQuery || undefined }),
    getNextPageParam: (lastPage) =>
      lastPage.meta.page < lastPage.meta.totalPages ? lastPage.meta.page + 1 : undefined,
    initialPageParam: 1,
  });

  const products = productsData?.pages.flatMap((page) => page.data) || [];
  const totalCount = productsData?.pages[0]?.meta.total ?? 0;

  useEffect(() => {
    listRef.current?.scrollToOffset({ offset: 0, animated: true });
  }, [searchQuery]);

  const getStatusColor = (product: Product) => {
    if (product.inventoryStatus === 'low-stock') return orange;
    if (product.inventory?.[0]?.quantity === 0) return red;
    return green;
  };

  const getStatusLabel = (product: Product) => {
    if (product.inventory?.[0]?.quantity === 0) return t('products.outOfStock');
    if (product.inventoryStatus === 'low-stock') return t('products.lowStock');
    return t('products.inStock');
  };

  return (
    <View style={[styles.container, { backgroundColor: bg }]}>
      {/* ── Topbar ──────────────────────────────────────────── */}
      <View style={[styles.topbar, { paddingTop: insets.top, borderBottomColor: border }]}>
        <Text style={{ fontSize: 22, fontWeight: '800', color: text }}>{t('products.title')}</Text>
        <TouchableOpacity
          style={[styles.addButton, { backgroundColor: primary }]}
          onPress={() => router.push('/products/new' as any)}
        >
          <Plus size={20} color={primaryForeground} />
        </TouchableOpacity>
      </View>

      {/* ── Search & Filter ─────────────────────────────────── */}
      <View style={styles.searchRow}>
        <View style={{ flex: 1 }}>
          <SearchBar
            placeholder={t('products.searchPlaceholder')}
            value={searchQuery}
            onChangeText={setSearchQuery}
            onClear={() => setSearchQuery('')}
            containerStyle={{ height: 42, borderRadius: 12 }}
            showClearButton
          />
        </View>
        <TouchableOpacity style={[styles.filterButton, { borderColor: border, backgroundColor: card }]}>
          <Filter size={18} color={text} />
        </TouchableOpacity>
      </View>

      {/* ── Category Row ────────────────────────────────────── */}
      <View style={styles.categoryRow}>
        <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
          <Text style={{ fontSize: 14, fontWeight: '600', color: text }}>{t('products.allCategories')}</Text>
          <ChevronDown size={16} color={muted} />
        </TouchableOpacity>
        <Text style={{ fontSize: 13, color: muted }}>{totalCount.toLocaleString()} {t('products.items')}</Text>
      </View>

      {/* ── Product List ────────────────────────────────────── */}
      <View style={{ flex: 1 }}>
        {isLoading ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color={primary} />
          </View>
        ) : (
          <FlashList<Product>
            ref={listRef}
            data={products}
            keyExtractor={(item: any) => item.id}
            contentContainerStyle={{ paddingBottom: insets.bottom + 80 }}
            onEndReached={() => {
              if (hasNextPage) fetchNextPage();
            }}
            onEndReachedThreshold={0.5}
            ListFooterComponent={() => {
              if (!isFetchingNextPage) return null;
              return <ActivityIndicator size="small" color={primary} style={{ marginVertical: 16 }} />;
            }}
            renderItem={({ item }: { item: Product }) => {
              const statusColor = getStatusColor(item);
              const statusLabel = getStatusLabel(item);
              const qty = item.inventory?.[0]?.quantity ?? 0;

              return (
                <TouchableOpacity
                  style={[styles.productRow, { borderBottomColor: border }]}
                  onPress={() => router.push(`/products/${item.id}` as any)}
                  activeOpacity={0.7}
                >
                  {/* Thumbnail */}
                  <View style={[styles.thumbnail, { backgroundColor: card, borderColor: border }]}>
                    {item.imageUrl ? (
                      <Image source={{ uri: item.imageUrl }} style={styles.thumbImage} />
                    ) : (
                      <Package size={24} color={muted} />
                    )}
                  </View>

                  {/* Info */}
                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text style={{ fontSize: 15, fontWeight: '600', color: text }} numberOfLines={1}>
                      {item.name}
                    </Text>
                    <Text style={{ fontSize: 12, color: muted, marginTop: 2 }}>
                      {item.category?.name || t('products.uncategorized')}
                    </Text>
                    <Text style={{ fontSize: 11, color: muted, marginTop: 1 }}>
                      SKU: {item.id.substring(0, 8).toUpperCase()}
                    </Text>
                  </View>

                  {/* Right side — status, qty, price */}
                  <View style={{ alignItems: 'flex-end', marginLeft: 8 }}>
                    <View style={[styles.statusBadge, { backgroundColor: statusColor + '15' }]}>
                      <Text style={{ fontSize: 11, fontWeight: '700', color: statusColor }}>
                        {statusLabel}
                      </Text>
                    </View>
                    <Text style={{ fontSize: 16, fontWeight: '700', color: text, marginTop: 4 }}>
                      {qty}
                    </Text>
                    <Text style={{ fontSize: 13, fontWeight: '500', color: muted, marginTop: 1 }}>
                      {item.sellingPrice.toLocaleString()} {item.currency}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            }}
            ListEmptyComponent={() => (
              <View style={styles.emptyContainer}>
                <Image
                  source={require('@/assets/icons/no_product.png')}
                  style={{ width: 180, height: 180, marginBottom: 20, opacity: 0.85 }}
                  resizeMode="contain"
                />
                <Text style={{ color: text, fontSize: 18, fontWeight: '700', marginBottom: 6 }}>
                  {t('products.emptyTitle')}
                </Text>
                <Text style={{ color: muted, fontSize: 14, textAlign: 'center', lineHeight: 20, maxWidth: 260 }}>
                  {t('products.emptySubtitle')}
                </Text>
                <TouchableOpacity
                  style={[styles.emptyButton, { backgroundColor: primary }]}
                  onPress={() => router.push('/products/new' as any)}
                >
                  <Plus size={18} color={primaryForeground} />
                  <Text style={{ color: primaryForeground, fontWeight: '700', fontSize: 15 }}>
                    {t('products.addProduct')}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 10,
  },
  filterButton: {
    width: 42,
    height: 42,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  productRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  thumbnail: {
    width: 56,
    height: 56,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  thumbImage: {
    width: '100%',
    height: '100%',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  emptyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 14,
    marginTop: 24,
  },
});
