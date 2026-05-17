import React from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, Image, Platform } from 'react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useLocalSearchParams, router } from 'expo-router';
import {
  Pen,
  Trash2,
  Package,
  ChevronRight,
} from 'lucide-react-native';

import { Text } from '@/components/ui/text';
import { useColor } from '@/hooks/useColor';
import { productsApi } from '@/api/products';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, useAlertDialog } from '@/components/ui/alert-dialog';
import { Header } from '@/components/ui/header';
import { formatAmount } from '@/lib/utils';

export default function ProductDetailScreen() {
  const { t } = useTranslation();
  const { id } = useLocalSearchParams<{ id: string }>();
  const queryClient = useQueryClient();
  const { isVisible: isDeleteDialogVisible, open: openDeleteDialog, close: closeDeleteDialog } = useAlertDialog();

  const bg = useColor('background');
  const card = useColor('card');
  const border = useColor('border');
  const text = useColor('text');
  const muted = useColor('textMuted');
  const primary = '#0066FF';
  const primaryForeground = useColor('primaryForeground');
  const red = '#FF3B30';
  const green = '#34C759';
  const orange = '#FF9500';

  const { data: product, isLoading } = useQuery({
    queryKey: ['product', id],
    queryFn: () => productsApi.getById(id!),
    enabled: !!id,
  });

  const deleteMutation = useMutation({
    mutationFn: () => productsApi.deactivate(id!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      router.replace('/products' as any);
    },
    onSettled: () => {
      closeDeleteDialog();
    }
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
      <Header
        title={product.name}
        right={
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => router.push(`/products/${id}/edit` as any)}
            >
              <Pen size={20} color={primary} strokeWidth={2.5} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={openDeleteDialog}
            >
              <Trash2 size={20} color={red} strokeWidth={2.5} />
            </TouchableOpacity>
          </View>
        }
      />
        <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Product Image */}
        <View style={styles.imageContainer}>
          {product.imageUrl ? (
            <Image source={{ uri: product.imageUrl }} style={styles.mainImage} resizeMode="contain" />
          ) : (
            <Package size={120} color={muted} />
          )}
        </View>

        <View style={{ paddingHorizontal: 20 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
            <Text style={{ fontSize: 24, fontWeight: '800', color: text }}>{product.name}</Text>
            <Badge variant={product.inventoryStatus === 'low-stock' ? 'destructive' : 'success'}>
              {product.inventoryStatus === 'low-stock' ? t('products.lowStock') : t('products.inStock')}
            </Badge>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4 }}>
            <Badge variant="secondary" textStyle={{ fontSize: 12, paddingVertical: 2, paddingHorizontal: 6 }}>
              {product.category?.name || t('products.uncategorized')}
            </Badge>
            {product.brandCategory?.name && (
              <Badge variant="outline" textStyle={{ fontSize: 12, paddingVertical: 2, paddingHorizontal: 6 }}>
                {product.brandCategory.name}
              </Badge>
            )}
          </View>

          {/* Stock Stats */}
          <View style={styles.stockGrid}>
            <View style={[styles.stockCard, { backgroundColor: card, borderColor: border }]}>
              <Text style={styles.stockLabel}>{t('products.stockQuantity')}</Text>
              <Text style={[styles.stockValue, { color: primary }]}>{inventory?.quantity || 0}</Text>
            </View>
            <View style={[styles.stockCard, { backgroundColor: card, borderColor: border }]}>
              <Text style={styles.stockLabel}>{t('products.reorderLevel')}</Text>
              <Text style={[styles.stockValue, { color: red }]}>{inventory?.minQuantity || 0}</Text>
            </View>
          </View>

          {/* Pricing */}
          <View style={{ marginTop: 32 }}>
            <Text style={[styles.sectionTitle, { color: text }]}>{t('products.pricing')}</Text>
            <View style={[styles.pricingCard, { backgroundColor: card, borderColor: border }]}>
              <View style={{ flex: 1 }}>
                <Text style={styles.priceLabel}>{t('products.purchasePrice')}</Text>
                <Text style={[styles.priceValue, { color: text }]}>{formatAmount(product.costPrice)} {product.currency}</Text>
              </View>
              <View style={{ width: 1, height: 40, backgroundColor: border }} />
              <View style={{ flex: 1, paddingLeft: 20 }}>
                <Text style={styles.priceLabel}>{t('products.sellingPrice')}</Text>
                <Text style={[styles.priceValue, { color: text }]}>{formatAmount(product.sellingPrice)} {product.currency}</Text>
              </View>
            </View>
          </View>

          {/* Supplier */}
          {inventory?.supplier && (
            <TouchableOpacity style={[styles.supplierRow, { borderBottomColor: border, borderBottomWidth: 1 }]}>
              <View>
                <Text style={[styles.sectionTitle, { color: text }]}>{t('products.supplier')}</Text>
                <Text style={{ fontSize: 14, color: text, fontWeight: '500', marginTop: 4 }}>{inventory.supplier.name}</Text>
              </View>
              <ChevronRight size={20} color={muted} />
            </TouchableOpacity>
          )}

          {/* Description */}
          <View style={{ marginTop: 24 }}>
            <Text style={[styles.sectionTitle, { color: text }]}>{t('products.description')}</Text>
            <Text style={{ fontSize: 14, color: muted, lineHeight: 22, marginTop: 8 }}>
              {product.description || t('products.noDescription')}
            </Text>
          </View>
        </View>
      </ScrollView>

      <AlertDialog
        isVisible={isDeleteDialogVisible}
        onClose={closeDeleteDialog}
        title={t('products.deleteProduct')}
        description={t('products.deleteConfirmation')}
        confirmText={t('common.delete')}
        cancelText={t('common.cancel')}
        onConfirm={() => {
          deleteMutation.mutate();
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  navButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    width: 40,
    height: 40,
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
  },
  supplierRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
    marginTop: 12,
  }
});
