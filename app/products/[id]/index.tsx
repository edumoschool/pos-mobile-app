import React from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView, Platform, ActivityIndicator, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useLocalSearchParams, router } from 'expo-router';
import { 
  ChevronLeft, 
  Edit3, 
  Package, 
  ChevronRight,
  TrendingUp,
  Info
} from 'lucide-react-native';

import { Text } from '@/components/ui/text';
import { useColor } from '@/hooks/useColor';
import { productsApi } from '@/api/products';
import { Button } from '@/components/ui/button';

export default function ProductDetailScreen() {
  const { t } = useTranslation();
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();

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

  const { data: product, isLoading } = useQuery({
    queryKey: ['product', id],
    queryFn: () => productsApi.getById(id!),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <View style={[styles.container, { backgroundColor: bg, justifyContent: 'center' }]}>
        <ActivityIndicator size="large" color={primary} />
      </View>
    );
  }

  if (!product) return null;

  const inventory = product.inventory?.[0];

  return (
    <View style={[styles.container, { backgroundColor: bg }]}>
      {/* Navbar */}
      <View style={[styles.navbar, { paddingTop: insets.top }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.navButton}>
          <ChevronLeft size={24} color={text} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton}>
          <Text style={{ color: primary, fontWeight: '700' }}>{t('products.editProduct')}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Product Image */}
        <View style={styles.imageContainer}>
          {product.imageUrl ? (
            <Image source={{ uri: product.imageUrl }} style={styles.mainImage} resizeMode="contain" />
          ) : (
            <Package size={120} color={muted} />
          )}
          <View style={styles.paginationDots}>
            <View style={[styles.dot, { backgroundColor: primary }]} />
            <View style={[styles.dot, { backgroundColor: muted + '40' }]} />
            <View style={[styles.dot, { backgroundColor: muted + '40' }]} />
          </View>
        </View>

        <View style={{ paddingHorizontal: 20 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
            <Text style={{ fontSize: 24, fontWeight: '800', color: text }}>{product.name}</Text>
            <View style={[styles.statusBadge, { backgroundColor: product.inventoryStatus === 'low-stock' ? orange + '15' : green + '15' }]}>
              <Text style={{ fontSize: 12, fontWeight: '700', color: product.inventoryStatus === 'low-stock' ? orange : green }}>
                {product.inventoryStatus === 'low-stock' ? t('products.lowStock') : t('products.inStock')}
              </Text>
            </View>
          </View>
          <Text style={{ fontSize: 14, color: muted }}>{product.category?.name || 'Electronics'} • SKU: {product.id.substring(0, 8).toUpperCase()}</Text>

          {/* Stock Stats */}
          <View style={styles.stockGrid}>
            <View style={[styles.stockCard, { backgroundColor: card, borderColor: border }]}>
              <Text style={styles.stockLabel}>{t('products.stockQuantity')}</Text>
              <Text style={[styles.stockValue, { color: primary }]}>{inventory?.quantity || 0}</Text>
            </View>
            <View style={[styles.stockCard, { backgroundColor: card, borderColor: border }]}>
              <Text style={styles.stockLabel}>{t('products.available')}</Text>
              <Text style={[styles.stockValue, { color: green }]}>{inventory?.quantity || 0}</Text>
            </View>
            <View style={[styles.stockCard, { backgroundColor: card, borderColor: border }]}>
              <Text style={styles.stockLabel}>{t('products.reserved')}</Text>
              <Text style={[styles.stockValue, { color: orange }]}>0</Text>
            </View>
            <View style={[styles.stockCard, { backgroundColor: card, borderColor: border }]}>
              <Text style={styles.stockLabel}>{t('products.reorderLevel')}</Text>
              <Text style={[styles.stockValue, { color: red }]}>{inventory?.minQuantity || 0}</Text>
            </View>
          </View>

          {/* Pricing */}
          <View style={{ marginTop: 32 }}>
            <Text style={styles.sectionTitle}>{t('products.pricing')}</Text>
            <View style={[styles.pricingCard, { backgroundColor: card, borderColor: border }]}>
              <View style={{ flex: 1 }}>
                <Text style={styles.priceLabel}>{t('products.purchasePrice')}</Text>
                <Text style={styles.priceValue}>${product.costPrice.toLocaleString()}</Text>
              </View>
              <View style={{ width: 1, height: 40, backgroundColor: border }} />
              <View style={{ flex: 1, paddingLeft: 20 }}>
                <Text style={styles.priceLabel}>{t('products.sellingPrice')}</Text>
                <Text style={styles.priceValue}>${product.sellingPrice.toLocaleString()}</Text>
              </View>
            </View>
          </View>

          {/* Supplier */}
          <TouchableOpacity style={[styles.supplierRow, { borderBottomColor: border, borderBottomWidth: 1 }]}>
            <View>
              <Text style={styles.sectionTitle}>{t('products.supplier')}</Text>
              <Text style={{ fontSize: 14, color: text, fontWeight: '500', marginTop: 4 }}>TechStore Inc.</Text>
            </View>
            <ChevronRight size={20} color={muted} />
          </TouchableOpacity>

          {/* Description */}
          <View style={{ marginTop: 24 }}>
            <Text style={styles.sectionTitle}>{t('products.description')}</Text>
            <Text style={{ fontSize: 14, color: muted, lineHeight: 22, marginTop: 8 }}>
              {product.description || 'No description provided for this product.'}
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  navbar: {
    height: Platform.OS === 'ios' ? 94 : 64,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
  navButton: {
    width: 60,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageContainer: {
    height: 300,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  mainImage: {
    width: '80%',
    height: '80%',
  },
  paginationDots: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 20,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  stockGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 24,
  },
  stockCard: {
    width: '48%',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
  },
  stockLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#8e8e93',
    marginBottom: 4,
  },
  stockValue: {
    fontSize: 22,
    fontWeight: '800',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
  },
  pricingCard: {
    flexDirection: 'row',
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    marginTop: 12,
    alignItems: 'center',
  },
  priceLabel: {
    fontSize: 12,
    color: '#8e8e93',
    fontWeight: '500',
    marginBottom: 4,
  },
  priceValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
  },
  supplierRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
    marginTop: 12,
  }
});
