import React, { useMemo, useState } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Plus, Pencil, Trash2, X, Tag } from 'lucide-react-native';

import { Text } from '@/components/ui/text';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/ui/header';
import { useToast } from '@/components/ui/toast';
import { useColor } from '@/hooks/useColor';
import { categoriesApi, brandCategoriesApi, unitsApi } from '@/api/catalog';
import { getApiErrorMessage } from '@/api/client';

type CatalogType = 'categories' | 'brand-categories' | 'units';
const TYPES: CatalogType[] = ['categories', 'brand-categories', 'units'];

const apiFor = (type: CatalogType) =>
  type === 'categories' ? categoriesApi : type === 'brand-categories' ? brandCategoriesApi : unitsApi;

interface Row { id: string; name: string; shortName?: string }

export default function CatalogManagerScreen() {
  const params = useLocalSearchParams<{ type: string }>();
  const type = (TYPES.includes(params.type as CatalogType) ? params.type : 'categories') as CatalogType;
  const { t } = useTranslation();
  const qc = useQueryClient();
  const { success: showSuccess, error: showError } = useToast();

  const bg = useColor('background');
  const card = useColor('card');
  const border = useColor('border');
  const text = useColor('text');
  const muted = useColor('textMuted');
  const primary = useColor('primary');
  const primaryForeground = useColor('primaryForeground');

  const isUnit = type === 'units';
  const api = apiFor(type);

  const { data: items = [], isLoading, refetch, isRefetching } = useQuery({
    queryKey: ['catalog', type],
    queryFn: () => api.getAll() as Promise<Row[]>,
  });

  const [editing, setEditing] = useState<Row | null>(null);
  const [creating, setCreating] = useState(false);
  const [name, setName] = useState('');
  const [shortName, setShortName] = useState('');

  const openCreate = () => {
    setCreating(true);
    setEditing(null);
    setName('');
    setShortName('');
  };
  const openEdit = (row: Row) => {
    setEditing(row);
    setCreating(false);
    setName(row.name);
    setShortName(row.shortName ?? '');
  };
  const closeModal = () => {
    setEditing(null);
    setCreating(false);
  };

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ['catalog', type] });
    // keep the product-screen dropdowns in sync
    qc.invalidateQueries({ queryKey: ['categories'] });
    qc.invalidateQueries({ queryKey: ['brandCategories'] });
    qc.invalidateQueries({ queryKey: ['units'] });
  };

  const saveMutation = useMutation({
    mutationFn: () => {
      const payload: any = isUnit
        ? { name: name.trim(), shortName: shortName.trim() }
        : { name: name.trim() };
      return editing ? (api.update as any)(editing.id, payload) : (api.create as any)(payload);
    },
    onSuccess: () => {
      invalidate();
      showSuccess(t('common.success'), t('common.save'));
      closeModal();
    },
    onError: (err) => showError(t('common.error'), getApiErrorMessage(err)),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => (api.delete as any)(id),
    onSuccess: () => {
      invalidate();
      closeModal();
    },
    onError: (err) => showError(t('common.error'), getApiErrorMessage(err)),
  });

  const title = t(`settings.catalog.${type}` as any);
  const modalOpen = creating || !!editing;
  const canSave = name.trim().length > 0 && (!isUnit || shortName.trim().length > 0);

  const tabs = useMemo(
    () => TYPES.map((tp) => ({ tp, label: t(`settings.catalog.${tp}` as any) })),
    [t],
  );

  return (
    <View style={{ flex: 1, backgroundColor: bg }}>
      <Header
        title={t('settings.rows.catalog')}
        right={
          <TouchableOpacity
            onPress={openCreate}
            style={{ width: 34, height: 34, borderRadius: 10, backgroundColor: primary, alignItems: 'center', justifyContent: 'center' }}
          >
            <Plus size={18} color={primaryForeground} />
          </TouchableOpacity>
        }
      />

      {/* type switcher */}
      <View style={{ flexDirection: 'row', gap: 8, paddingHorizontal: 16, paddingBottom: 8 }}>
        {tabs.map(({ tp, label }) => {
          const active = tp === type;
          return (
            <TouchableOpacity
              key={tp}
              onPress={() => router.replace(`/settings/catalog/${tp}` as any)}
              style={{
                paddingHorizontal: 12,
                paddingVertical: 7,
                borderRadius: 16,
                backgroundColor: active ? primary : card,
                borderWidth: 1,
                borderColor: active ? primary : border + '80',
              }}
            >
              <Text style={{ fontSize: 12, fontWeight: '600', color: active ? primaryForeground : muted }}>
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {isLoading ? (
        <ActivityIndicator color={primary} style={{ marginTop: 40 }} />
      ) : (
        <ScrollView
          contentContainerStyle={{ padding: 16, gap: 8 }}
          refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor={primary} />}
        >
          {items.length === 0 && (
            <Text style={{ color: muted, textAlign: 'center', marginTop: 40 }}>{title} — {t('sales.noResults')}</Text>
          )}
          {items.map((row) => (
            <TouchableOpacity
              key={row.id}
              onPress={() => openEdit(row)}
              style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: card, borderRadius: 12, borderWidth: 1, borderColor: border + '60', padding: 14 }}
            >
              <View style={{ width: 30, height: 30, borderRadius: 8, backgroundColor: primary + '18', alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
                <Tag size={15} color={primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 15, fontWeight: '600', color: text }}>{row.name}</Text>
                {!!row.shortName && (
                  <Text style={{ fontSize: 12, color: muted, marginTop: 1 }}>{row.shortName}</Text>
                )}
              </View>
              <Pencil size={16} color={muted} />
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {/* create / edit modal */}
      <Modal visible={modalOpen} transparent animationType="fade" onRequestClose={closeModal}>
        <View style={styles.overlay}>
          <View style={[styles.sheet, { backgroundColor: card, borderColor: border }]}>
            <View style={styles.sheetHeader}>
              <Text style={{ fontSize: 17, fontWeight: '700', color: text }}>
                {editing ? t('common.edit') : t('common.save')} · {title}
              </Text>
              <TouchableOpacity onPress={closeModal} hitSlop={8}>
                <X size={20} color={text} />
              </TouchableOpacity>
            </View>

            <View style={{ gap: 10, marginTop: 16 }}>
              <Input placeholder={t('categories.name')} value={name} onChangeText={setName} variant="outline" autoFocus />
              {isUnit && (
                <Input placeholder={t('units.shortName')} value={shortName} onChangeText={setShortName} variant="outline" />
              )}
            </View>

            <View style={{ flexDirection: 'row', gap: 10, marginTop: 20 }}>
              {editing && (
                <Button
                  variant="destructive"
                  size="sm"
                  icon={Trash2}
                  onPress={() => deleteMutation.mutate(editing.id)}
                  loading={deleteMutation.isPending}
                  style={{ flex: 1 }}
                >
                  {t('common.delete')}
                </Button>
              )}
              <Button
                size="sm"
                onPress={() => saveMutation.mutate()}
                loading={saveMutation.isPending}
                disabled={!canSave}
                style={{ flex: 1 }}
              >
                {t('common.save')}
              </Button>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 20 },
  sheet: { borderRadius: 18, borderWidth: 1, padding: 20 },
  sheetHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
});
