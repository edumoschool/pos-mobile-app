import React, { useEffect, useState } from 'react';
import { View, ScrollView, ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import {
  Package,
  MapPin,
  Truck,
  Banknote,
  Trash2,
  ArrowDownCircle,
  ArrowUpCircle,
  RefreshCw,
} from 'lucide-react-native';

import { Text } from '@/components/ui/text';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Picker } from '@/components/ui/picker';
import { Header } from '@/components/ui/header';
import { AvoidKeyboard } from '@/components/ui/avoid-keyboard';
import { AlertDialog, useAlertDialog } from '@/components/ui/alert-dialog';
import { useToast } from '@/components/ui/toast';
import { useColor } from '@/hooks/useColor';
import { useAuth } from '@/hooks/useAuth';
import { inventoryApi } from '@/api/inventory';
import { getApiErrorMessage } from '@/api/client';
import { formatAmount } from '@/lib/utils';
import type { Currency } from '@/types';

export default function InventoryDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { t, i18n } = useTranslation();
  const qc = useQueryClient();
  const { user } = useAuth();
  const { success: showSuccess, error: showError } = useToast();
  const deleteDialog = useAlertDialog();

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

  const canManage = user?.role === 'owner' || user?.role === 'super_admin';
  // Inventory management is owner/super_admin only — the backend enforces
  // this too (403), this just avoids a flash of an error screen for sellers.
  useEffect(() => {
    if (!canManage) router.back();
  }, [canManage]);

  const { data: inventory, isLoading } = useQuery({
    queryKey: ['inventory', id],
    queryFn: () => inventoryApi.getById(id!),
    enabled: !!id && canManage,
  });

  const [quantity, setQuantity] = useState('');
  const [minQuantity, setMinQuantity] = useState('');
  const [maxQuantity, setMaxQuantity] = useState('');
  const [costPrice, setCostPrice] = useState('');
  const [costCurrency, setCostCurrency] = useState<Currency>('UZS');
  const [location, setLocation] = useState('');
  const [note, setNote] = useState('');

  useEffect(() => {
    if (inventory) {
      setQuantity(String(inventory.quantity));
      setMinQuantity(inventory.minQuantity != null ? String(inventory.minQuantity) : '');
      setMaxQuantity(inventory.maxQuantity != null ? String(inventory.maxQuantity) : '');
      setCostPrice(String(inventory.costPrice ?? ''));
      setCostCurrency(inventory.costCurrency ?? 'UZS');
      setLocation(inventory.location ?? '');
    }
  }, [inventory]);

  const num = (s: string) => (s.trim() === '' ? undefined : Number(s.replace(/,/g, '')));

  const save = useMutation({
    mutationFn: () =>
      inventoryApi.adjust(id!, {
        quantity: num(quantity),
        minQuantity: num(minQuantity),
        maxQuantity: num(maxQuantity),
        costPrice: num(costPrice),
        costCurrency,
        location: location.trim() || undefined,
        note: note.trim() || undefined,
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['inventory'] });
      qc.invalidateQueries({ queryKey: ['inventory', id] });
      qc.invalidateQueries({ queryKey: ['products'] });
      setNote('');
      showSuccess(t('common.success'), t('inventory.adjusted'));
    },
    onError: (err) => showError(t('common.error'), getApiErrorMessage(err)),
  });

  const remove = useMutation({
    mutationFn: () => inventoryApi.delete(id!),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['inventory'] });
      deleteDialog.close();
      showSuccess(t('common.success'), t('inventory.deleted'));
      router.back();
    },
    onError: (err) => {
      deleteDialog.close();
      showError(t('common.error'), getApiErrorMessage(err));
    },
  });

  if (!canManage) return null;

  if (isLoading) {
    return (
      <View style={[styles.container, { backgroundColor: bg }]}>
        <Header title={t('inventory.title')} />
        <ActivityIndicator color={primary} style={{ marginTop: 40 }} />
      </View>
    );
  }
  if (!inventory) return null;

  const movementIcon = (type: string) =>
    type === 'in' ? ArrowDownCircle : type === 'out' ? ArrowUpCircle : RefreshCw;
  const movementColor = (type: string) => (type === 'in' ? green : type === 'out' ? red : orange);

  return (
    <View style={[styles.container, { backgroundColor: bg }]}>
      <Header
        title={inventory.product?.name ?? t('inventory.title')}
        right={
          canManage ? (
            <TouchableOpacity onPress={deleteDialog.open}>
              <Trash2 size={20} color={red} />
            </TouchableOpacity>
          ) : undefined
        }
      />

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }} keyboardShouldPersistTaps="handled">
        {/* Current stock hero */}
        <View style={{ alignItems: 'center', marginBottom: 20 }}>
          <Text style={{ fontSize: 13, color: muted, marginBottom: 4 }}>{t('inventory.currentStock')}</Text>
          <Text style={{ fontSize: 34, fontWeight: '800', color: text }}>
            {formatAmount(inventory.quantity)}{' '}
            <Text style={{ fontSize: 18, fontWeight: '600', color: muted }}>
              {inventory.product?.unit?.shortName ?? ''}
            </Text>
          </Text>
        </View>

        {/* Adjust form */}
        <View style={{ gap: 10, marginBottom: 20 }}>
          <Input icon={Package} placeholder={t('inventory.quantity')} value={quantity} onChangeText={(v) => setQuantity(v.replace(/[^0-9.]/g, ''))} keyboardType="decimal-pad" variant="outline" />

          <View style={{ flexDirection: 'row', gap: 10 }}>
            <View style={{ flex: 1 }}>
              <Input placeholder={t('inventory.minQuantity')} value={minQuantity} onChangeText={(v) => setMinQuantity(v.replace(/[^0-9.]/g, ''))} keyboardType="decimal-pad" variant="outline" />
            </View>
            <View style={{ flex: 1 }}>
              <Input placeholder={t('inventory.maxQuantity')} value={maxQuantity} onChangeText={(v) => setMaxQuantity(v.replace(/[^0-9.]/g, ''))} keyboardType="decimal-pad" variant="outline" />
            </View>
          </View>

          <View style={{ flexDirection: 'row', gap: 10 }}>
            <View style={{ flex: 1 }}>
              <Input icon={Banknote} placeholder={t('inventory.costPrice')} value={costPrice} onChangeText={(v) => setCostPrice(formatAmount(v))} keyboardType="decimal-pad" variant="outline" />
            </View>
            <View style={{ flex: 1 }}>
              <Picker
                value={costCurrency}
                onValueChange={(v) => setCostCurrency(v as Currency)}
                options={[{ label: 'UZS', value: 'UZS' }, { label: 'USD', value: 'USD' }]}
                variant="outline"
              />
            </View>
          </View>

          <Input icon={MapPin} placeholder={t('inventory.location')} value={location} onChangeText={setLocation} variant="outline" />

          {inventory.supplier && (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 4 }}>
              <Truck size={14} color={muted} />
              <Text style={{ fontSize: 13, color: muted }}>{inventory.supplier.name}</Text>
            </View>
          )}

          <Input placeholder={t('inventory.notePlaceholder')} value={note} onChangeText={setNote} variant="outline" />

          <Button onPress={() => save.mutate()} loading={save.isPending}>
            {t('inventory.saveChanges')}
          </Button>
        </View>

        {/* Movement history */}
        <Text style={{ fontSize: 13, fontWeight: '700', color: muted, marginBottom: 8 }}>
          {t('inventory.movements')}
        </Text>
        {(inventory.movements ?? []).length === 0 ? (
          <Text style={{ color: muted, fontSize: 13 }}>{t('inventory.noMovements')}</Text>
        ) : (
          <View style={{ borderRadius: 16, backgroundColor: card, borderWidth: 1, borderColor: border + '60', overflow: 'hidden' }}>
            {(inventory.movements ?? []).map((m, i) => {
              const Icon = movementIcon(m.type);
              const color = movementColor(m.type);
              return (
                <View key={m.id}>
                  {i > 0 && <View style={{ height: StyleSheet.hairlineWidth, backgroundColor: border, marginLeft: 56 }} />}
                  <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12 }}>
                    <View style={{ width: 32, height: 32, borderRadius: 8, backgroundColor: color + '18', alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
                      <Icon size={16} color={color} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: 13, fontWeight: '600', color: text }}>
                        {t(`inventory.movementTypes.${m.type}` as any)} · {formatAmount(m.before)} → {formatAmount(m.after)}
                      </Text>
                      <Text style={{ fontSize: 11, color: muted, marginTop: 2 }}>
                        {m.user?.fullName ?? '—'} · {new Date(m.createdAt).toLocaleString(i18n.language, { dateStyle: 'medium', timeStyle: 'short' })}
                      </Text>
                      {!!m.note && (
                        <Text style={{ fontSize: 11, color: muted, marginTop: 2 }} numberOfLines={1}>
                          {m.note}
                        </Text>
                      )}
                    </View>
                    <Text style={{ fontSize: 13, fontWeight: '700', color }}>
                      {m.type === 'out' ? '-' : '+'}{formatAmount(m.quantity)}
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>

      <AlertDialog
        isVisible={deleteDialog.isVisible}
        onClose={deleteDialog.close}
        title={t('inventory.deleteRecord')}
        description={t('inventory.deleteConfirm')}
        confirmText={t('common.delete')}
        cancelText={t('common.cancel')}
        onConfirm={() => remove.mutate()}
      />

      <AvoidKeyboard />
    </View>
  );
}

const styles = StyleSheet.create({ container: { flex: 1 } });
