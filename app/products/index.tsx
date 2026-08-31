import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Platform, ActivityIndicator, Image, ScrollView, RefreshControl } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { router } from 'expo-router';
import { Plus, Package, Check, ChevronDown } from 'lucide-react-native';
import { FlashList } from '@shopify/flash-list';

import { Text } from '@/components/ui/text';
import { useColor } from '@/hooks/useColor';
import { productsApi } from '@/api/products';
import { categoriesApi, brandCategoriesApi } from '@/api/catalog';
import { SearchBar } from '@/components/ui/searchbar';
import { Popover, PopoverBody, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Header } from '@/components/ui/header';
import { formatAmount } from '@/lib/utils';
import { Product } from '@/types';

export default function ProductsScreen() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const listRef = useRef<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedBrandCategory, setSelectedBrandCategory] = useState<string | null>(null);

  const bg = useColor('background');
  const card = useColor('card');
  const border = useColor('border');
  const text = useColor('text');
  const muted = useColor('textMuted');
  const primary = useColor('primary');
  const primaryForeground = useColor('primaryForeground');
  const red = useColor('red');
  const green = useColor('green');
  const orange = useColor('orange');

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoriesApi.getAll(),
  });

  const { data: brandCategories } = useQuery({
    queryKey: ['brandCategories'],
    queryFn: () => brandCategoriesApi.getAll(),
  });

  const {
    data: productsData,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
    isRefetching,
  } = useInfiniteQuery({
    queryKey: ['products', searchQuery, selectedCategory, selectedBrandCategory],
    queryFn: ({ pageParam = 1 }) =>
      productsApi.getAll({ 
        page: pageParam, 
        limit: 20, 
        search: searchQuery || undefined,
        categoryId: selectedCategory || undefined,
        brandCategoryId: selectedBrandCategory || undefined
      }),
    getNextPageParam: (lastPage) =>
      lastPage.meta && lastPage.meta.page < lastPage.meta.totalPages ? lastPage.meta.page + 1 : undefined,
    initialPageParam: 1,
  });

  const products = productsData?.pages.flatMap((page) => page.data) || [];
  const totalCount = productsData?.pages[0]?.meta?.total ?? products.length;

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
      <Header
        title={t('products.title')}
        showBack={true}
        right={
          <TouchableOpacity
            style={[styles.addButton, { backgroundColor: primary }]}
            onPress={() => router.push('/products/new' as any)}
          >
            <Plus size={20} color={primaryForeground} />
          </TouchableOpacity>
        }
      />
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
      </View>

      <View style={styles.filtersContainer}>
        <View style={styles.filterHeader}>
          <Text style={{ fontSize: 16, fontWeight: '700', color: text }}>{t('products.filters')}</Text>
          <TouchableOpacity onPress={() => { setSelectedCategory(null); setSelectedBrandCategory(null); }}>
            <Text style={{ fontSize: 14, color: primary, fontWeight: '500' }}>{t('products.clearAll')}</Text>
          </TouchableOpacity>
        </View>

        {/* Filter Row */}
        <View style={{ flexDirection: 'row', paddingHorizontal: 16, gap: 12, marginBottom: 12 }}>
          <FilterSelect
            label={t('products.allCategories')}
            value={selectedCategory}
            onChange={setSelectedCategory}
            options={categories?.map((c) => ({ label: c.name, value: c.id })) ?? []}
          />
          <FilterSelect
            label={t('products.allBrands')}
            value={selectedBrandCategory}
            onChange={setSelectedBrandCategory}
            options={brandCategories?.map((b) => ({ label: b.name, value: b.id })) ?? []}
          />
        </View>
      </View>

      {/* ── Category Row ────────────────────────────────────── */}
      <View style={styles.categoryRow}>
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
            refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor={primary} colors={[primary]} />}
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
                    <Text style={{ fontSize: 12, color: muted, marginTop: 2 }}>
                      {t('products.brand')}: {item.brandCategory?.name || t('products.na')}
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
                      {qty} {item.unit?.shortName || ''}
                    </Text>
                    <Text style={{ fontSize: 13, fontWeight: '500', color: muted, marginTop: 1 }}>
                      {formatAmount(item.sellingPrice)} {item.currency}
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

/**
 * Dropdown filter built on Popover.
 *
 * Replaces the platform Picker, which rendered as an inline iOS wheel and an
 * unstyleable Android dialog — neither of which could show the selected state
 * or match the surrounding controls. Selecting an already-selected option
 * clears the filter, so "all" needs no separate row.
 */
function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string | null;
  onChange: (next: string | null) => void;
  options: { label: string; value: string }[];
}) {
  const [open, setOpen] = useState(false);
  const card = useColor('card');
  const border = useColor('border');
  const text = useColor('text');
  const muted = useColor('textMuted');
  const primary = useColor('primary');

  const selected = options.find((o) => o.value === value);
  const active = !!selected;

  return (
    <View style={{ flex: 1 }}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <TouchableOpacity
            activeOpacity={0.7}
            style={{
              height: 40,
              borderRadius: 12,
              borderWidth: 1,
              borderColor: active ? primary : border,
              backgroundColor: active ? primary + '14' : card,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingHorizontal: 12,
              gap: 6,
            }}
          >
            <Text
              numberOfLines={1}
              style={{
                flex: 1,
                fontSize: 14,
                fontWeight: active ? '600' : '400',
                color: active ? primary : muted,
              }}
            >
              {selected?.label ?? label}
            </Text>
            <ChevronDown size={16} color={active ? primary : muted} />
          </TouchableOpacity>
        </PopoverTrigger>

        <PopoverContent align="start" maxWidth={260} style={{ padding: 0 }}>
          <PopoverBody style={{ padding: 6 }} maxHeight={280}>
            {options.length === 0 ? (
              <Text style={{ fontSize: 13, color: muted, padding: 12 }}>—</Text>
            ) : (
              options.map((opt) => {
                const isSelected = opt.value === value;
                return (
                  <TouchableOpacity
                    key={opt.value}
                    activeOpacity={0.7}
                    onPress={() => {
                      onChange(isSelected ? null : opt.value);
                      setOpen(false);
                    }}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: 8,
                      paddingVertical: 10,
                      paddingHorizontal: 10,
                      borderRadius: 8,
                      backgroundColor: isSelected ? primary + '14' : 'transparent',
                    }}
                  >
                    <Text
                      numberOfLines={1}
                      style={{
                        flex: 1,
                        fontSize: 14,
                        color: isSelected ? primary : text,
                        fontWeight: isSelected ? '600' : '400',
                      }}
                    >
                      {opt.label}
                    </Text>
                    {isSelected && <Check size={16} color={primary} />}
                  </TouchableOpacity>
                );
              })
            )}
          </PopoverBody>
        </PopoverContent>
      </Popover>
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
  filtersContainer: {
    paddingBottom: 8,
  },
  filterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  filterScrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    gap: 8,
  },
  filterPill: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 18,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
