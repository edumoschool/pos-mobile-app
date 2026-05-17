import React from 'react';
import { View, ScrollView, ActivityIndicator, StyleSheet } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { ArrowDown, ArrowUp, Trash2, Building2, Tag, FileText, User, Calendar } from 'lucide-react-native';

import { Text } from '@/components/ui/text';
import { useColor } from '@/hooks/useColor';
import { Header } from '@/components/ui/header';
import { AlertDialog, useAlertDialog } from '@/components/ui/alert-dialog';
import { transactionsApi } from '@/api/transactions';
import { formatAmount } from '@/lib/utils';
import { useToast } from '@/components/ui/toast';

export default function TransactionDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { t, i18n } = useTranslation();
  const qc = useQueryClient();
  const { error: showError } = useToast();
  const { isVisible, open: openDelete, close: closeDelete } = useAlertDialog();

  const bg = useColor('background');
  const card = useColor('card');
  const border = useColor('border');
  const text = useColor('text');
  const muted = useColor('textMuted');
  const green = useColor('green');
  const red = useColor('red');
  const primary = useColor('primary');

  const { data: tx, isLoading } = useQuery({
    queryKey: ['transaction', id],
    queryFn: () => transactionsApi.getById(id!),
    enabled: !!id,
  });

  const deleteMutation = useMutation({
    mutationFn: () => transactionsApi.delete(id!),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['transactions'] });
      qc.invalidateQueries({ queryKey: ['financial-summary'] });
      router.back();
    },
    onError: () => {
      showError(t('common.error'), t('common.exportError'));
      closeDelete();
    },
  });

  if (isLoading) {
    return (
      <View style={[styles.container, { backgroundColor: bg, justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={primary} />
      </View>
    );
  }

  if (!tx) return null;

  const isIncome = tx.type === 'income';
  const accentColor = isIncome ? green : red;
  const Icon = isIncome ? ArrowDown : ArrowUp;
  const categoryName = isIncome
    ? tx.incomeCategory?.name ?? t('transactions.income')
    : tx.expenseCategory?.name ?? t('transactions.expense');

  const rows: { icon: React.ComponentType<any>; label: string; value: string }[] = [
    {
      icon: Tag,
      label: t('transactions.category'),
      value: categoryName,
    },
    {
      icon: Building2,
      label: t('transactions.branch'),
      value: tx.branch?.name ?? '—',
    },
    {
      icon: User,
      label: t('home.roles.employee') ,
      value: tx.user?.fullName ?? '—',
    },
    {
      icon: Calendar,
      label: t('transactions.date'),
      value: new Date(tx.createdAt).toLocaleString(i18n.language, {
        dateStyle: 'long',
        timeStyle: 'short',
      }),
    },
    ...(tx.description
      ? [{ icon: FileText, label: t('clientDetail.optionalNotes'), value: tx.description }]
      : []),
  ];

  return (
    <View style={[styles.container, { backgroundColor: bg }]}>
      <Header
        title={t('transactions.detail')}
        right={
          <Trash2
            size={20}
            color={red}
            onPress={openDelete}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          />
        }
      />

      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        {/* ── Amount hero ─────────────────────────────────────────── */}
        <View style={{ alignItems: 'center', paddingVertical: 36, gap: 12 }}>
          <View style={{
            width: 72, height: 72, borderRadius: 36,
            backgroundColor: accentColor + '22',
            alignItems: 'center', justifyContent: 'center',
          }}>
            <Icon size={32} color={accentColor} />
          </View>
          <Text style={{ fontSize: 36, fontWeight: '800', color: accentColor }}>
            {isIncome ? '+' : '-'}{formatAmount(tx.amount)} {tx.currency}
          </Text>
          <View style={{
            paddingHorizontal: 12, paddingVertical: 4, borderRadius: 8,
            backgroundColor: accentColor + '22',
          }}>
            <Text style={{ fontSize: 13, fontWeight: '600', color: accentColor }}>
              {isIncome ? t('transactions.income') : t('transactions.expense')}
            </Text>
          </View>
        </View>

        {/* ── Detail rows ─────────────────────────────────────────── */}
        <View style={{ marginHorizontal: 16, borderRadius: 16, backgroundColor: card, overflow: 'hidden' }}>
          {rows.map(({ icon: RowIcon, label, value }, i) => (
            <View key={label}>
              {i > 0 && <View style={{ height: StyleSheet.hairlineWidth, backgroundColor: border, marginLeft: 56 }} />}
              <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14 }}>
                <View style={{
                  width: 32, height: 32, borderRadius: 8,
                  backgroundColor: primary + '18',
                  alignItems: 'center', justifyContent: 'center',
                  marginRight: 12,
                }}>
                  <RowIcon size={16} color={primary} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 12, color: muted, marginBottom: 2 }}>{label}</Text>
                  <Text style={{ fontSize: 15, fontWeight: '600', color: text }}>{value}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      <AlertDialog
        isVisible={isVisible}
        onClose={closeDelete}
        title={t('transactions.deleteTitle')}
        description={t('transactions.deleteConfirmation')}
        confirmText={t('common.delete')}
        cancelText={t('common.cancel')}
        onConfirm={() => deleteMutation.mutate()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});
