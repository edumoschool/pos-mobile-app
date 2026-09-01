import React, { useState } from 'react';
import { View, ScrollView, ActivityIndicator, StyleSheet } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Ban, User, Calendar, Wallet, Package, ChevronRight, Banknote } from 'lucide-react-native';

import { Text } from '@/components/ui/text';
import { useColor } from '@/hooks/useColor';
import { Header } from '@/components/ui/header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Picker } from '@/components/ui/picker';
import { BottomSheet, useBottomSheet } from '@/components/ui/bottom-sheet';
import { AlertDialog, useAlertDialog } from '@/components/ui/alert-dialog';
import { useToast } from '@/components/ui/toast';
import { salesApi } from '@/api/sales';
import { clientTransactionsApi } from '@/api/party-transactions';
import { getApiErrorMessage } from '@/api/client';
import { formatAmount } from '@/lib/utils';
import type { PaymentMethod } from '@/types';

export default function SaleDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { t, i18n } = useTranslation();
  const qc = useQueryClient();
  const { success: showSuccess, error: showError } = useToast();
  const { isVisible, open: openCancel, close: closeCancel } = useAlertDialog();
  const payDebt = useBottomSheet();
  const [payAmount, setPayAmount] = useState('');
  const [payMethod, setPayMethod] = useState<PaymentMethod>('cash');

  const bg = useColor('background');
  const card = useColor('card');
  const border = useColor('border');
  const text = useColor('text');
  const muted = useColor('textMuted');
  const primary = useColor('primary');
  const green = useColor('green');
  const orange = useColor('orange');
  const red = useColor('red');

  const { data: sale, isLoading } = useQuery({
    queryKey: ['sale', id],
    queryFn: () => salesApi.getById(id!),
    enabled: !!id,
  });

  const cancelMutation = useMutation({
    mutationFn: () => salesApi.cancel(id!),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['sales'] });
      qc.invalidateQueries({ queryKey: ['sale', id] });
      qc.invalidateQueries({ queryKey: ['sales-summary'] });
      qc.invalidateQueries({ queryKey: ['products'] });
      qc.invalidateQueries({ queryKey: ['inventory'] });
      qc.invalidateQueries({ queryKey: ['client-transactions'] });
      closeCancel();
      showSuccess(t('common.success'), t('sales.detail.cancelSuccess'));
    },
    onError: (err) => {
      closeCancel();
      showError(t('common.error'), getApiErrorMessage(err));
    },
  });

  const payMutation = useMutation({
    mutationFn: () =>
      clientTransactionsApi.create({
        clientId: sale!.client!.id,
        saleId: sale!.id,
        type: 'income',
        amount: Number(payAmount.replace(/,/g, '')),
        currency: sale!.currency,
        paymentMethod: payMethod,
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['sales'] });
      qc.invalidateQueries({ queryKey: ['sale', id] });
      qc.invalidateQueries({ queryKey: ['sales-summary'] });
      qc.invalidateQueries({ queryKey: ['client-balance', sale?.client?.id] });
      qc.invalidateQueries({ queryKey: ['client-transactions'] });
      payDebt.close();
      showSuccess(t('common.success'), t('sales.detail.paySuccess'));
    },
    onError: (err) => {
      showError(t('common.error'), getApiErrorMessage(err));
    },
  });

  const openPayDebt = () => {
    setPayAmount(sale ? formatAmount(sale.debtAmount) : '');
    setPayMethod('cash');
    payDebt.open();
  };

  if (isLoading) {
    return (
      <View style={[styles.container, { backgroundColor: bg, justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={primary} />
      </View>
    );
  }
  if (!sale) return null;

  const statusColor =
    sale.status === 'completed' ? green : sale.status === 'debt' ? orange : red;
  const statusLabel = t(`sales.status.${sale.status}` as any);
  const currency = sale.currency;

  const meta: { icon: React.ComponentType<any>; label: string; value: string }[] = [
    {
      icon: User,
      label: t('sales.detail.client'),
      value: sale.client?.fullName ?? t('sales.detail.walkIn'),
    },
    { icon: User, label: t('sales.detail.seller'), value: sale.user?.fullName ?? '—' },
    {
      icon: Wallet,
      label: t('common.paymentMethod'),
      value: t(`common.paymentMethods.${sale.paymentMethod}` as any),
    },
    {
      icon: Calendar,
      label: t('sales.detail.date'),
      value: new Date(sale.createdAt).toLocaleString(i18n.language, {
        dateStyle: 'long',
        timeStyle: 'short',
      }),
    },
  ];

  return (
    <View style={[styles.container, { backgroundColor: bg }]}>
      <Header title={t('sales.detail.title')} />

      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        {/* ── Hero ────────────────────────────────────────────────── */}
        <View style={{ alignItems: 'center', paddingVertical: 28, gap: 10 }}>
          <Text style={{ fontSize: 13, color: muted, fontWeight: '600', letterSpacing: 1 }}>
            #{sale.id.substring(0, 8).toUpperCase()}
          </Text>
          <Text style={{ fontSize: 34, fontWeight: '800', color: text }}>
            {formatAmount(sale.totalAmount)} {currency}
          </Text>
          <View style={{ paddingHorizontal: 12, paddingVertical: 4, borderRadius: 8, backgroundColor: statusColor + '22' }}>
            <Text style={{ fontSize: 13, fontWeight: '700', color: statusColor }}>{statusLabel}</Text>
          </View>
        </View>

        {/* ── Items ───────────────────────────────────────────────── */}
        <Text style={{ marginHorizontal: 16, marginBottom: 8, fontSize: 13, fontWeight: '700', color: muted }}>
          {t('sales.detail.items')} ({sale.items?.length ?? 0})
        </Text>
        <View style={{ marginHorizontal: 16, borderRadius: 16, backgroundColor: card, overflow: 'hidden' }}>
          {(sale.items ?? []).map((it, i) => (
            <View key={it.id}>
              {i > 0 && <View style={{ height: StyleSheet.hairlineWidth, backgroundColor: border, marginLeft: 56 }} />}
              <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14 }}>
                <View style={{ width: 32, height: 32, borderRadius: 8, backgroundColor: primary + '18', alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
                  <Package size={16} color={primary} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 15, fontWeight: '600', color: text }} numberOfLines={1}>
                    {it.product?.name ?? '—'}
                  </Text>
                  <Text style={{ fontSize: 12, color: muted, marginTop: 2 }}>
                    {formatAmount(it.unitPrice)} × {it.quantity} {it.product?.unit?.shortName ?? ''}
                  </Text>
                </View>
                <Text style={{ fontSize: 15, fontWeight: '700', color: text }}>
                  {formatAmount(it.totalPrice)}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* ── Totals ──────────────────────────────────────────────── */}
        <View style={{ marginHorizontal: 16, marginTop: 16, borderRadius: 16, backgroundColor: card, padding: 16, gap: 10 }}>
          <TotalRow label={t('sales.detail.subtotal')} value={`${formatAmount(Number(sale.totalAmount) + Number(sale.discount))} ${currency}`} muted={muted} text={text} />
          {Number(sale.discount) > 0 && (
            <TotalRow label={t('sales.detail.discount')} value={`- ${formatAmount(sale.discount)} ${currency}`} muted={muted} text={text} />
          )}
          <View style={{ height: 1, backgroundColor: border }} />
          <TotalRow label={t('sales.detail.total')} value={`${formatAmount(sale.totalAmount)} ${currency}`} bold muted={muted} text={text} />
          <TotalRow label={t('sales.detail.paid')} value={`${formatAmount(sale.paidAmount)} ${currency}`} valueColor={green} muted={muted} text={text} />
          {Number(sale.debtAmount) > 0 && (
            <TotalRow label={t('sales.detail.debt')} value={`${formatAmount(sale.debtAmount)} ${currency}`} valueColor={orange} muted={muted} text={text} />
          )}
        </View>

        {/* ── Meta ────────────────────────────────────────────────── */}
        <View style={{ marginHorizontal: 16, marginTop: 16, borderRadius: 16, backgroundColor: card, overflow: 'hidden' }}>
          {meta.map(({ icon: RowIcon, label, value }, i) => (
            <View key={label}>
              {i > 0 && <View style={{ height: StyleSheet.hairlineWidth, backgroundColor: border, marginLeft: 56 }} />}
              <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14 }}>
                <View style={{ width: 32, height: 32, borderRadius: 8, backgroundColor: primary + '18', alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
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

        {sale.note ? (
          <View style={{ marginHorizontal: 16, marginTop: 16 }}>
            <Text style={{ fontSize: 12, color: muted, marginBottom: 4 }}>{t('clientDetail.optionalNotes')}</Text>
            <Text style={{ fontSize: 14, color: text }}>{sale.note}</Text>
          </View>
        ) : null}

        {/* ── Linked client debt entries ─────────────────────────── */}
        {(sale.clientTransactions ?? []).length > 0 && (
          <View style={{ marginHorizontal: 16, marginTop: 16 }}>
            <Text style={{ fontSize: 13, fontWeight: '700', color: muted, marginBottom: 8 }}>
              {t('sales.detail.linkedDebt')}
            </Text>
            {(sale.clientTransactions ?? []).map((ct) => (
              <View
                key={ct.id}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  backgroundColor: card,
                  borderRadius: 12,
                  padding: 12,
                  marginBottom: 8,
                }}
              >
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 14, fontWeight: '600', color: text }}>
                    {ct.type === 'outcome' ? t('clientDetail.debtIssued') : t('clientDetail.paymentReceived')}
                  </Text>
                  <Text style={{ fontSize: 12, color: muted, marginTop: 2 }}>
                    {new Date(ct.createdAt).toLocaleDateString(i18n.language)}
                  </Text>
                </View>
                <Text style={{ fontSize: 14, fontWeight: '700', color: ct.type === 'outcome' ? orange : green }}>
                  {formatAmount(ct.amount)} {ct.currency}
                </Text>
                <ChevronRight size={16} color={muted} />
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {sale.status !== 'cancelled' && (
        <View style={{ paddingHorizontal: 16, paddingTop: 12, paddingBottom: 16, backgroundColor: bg, gap: 10 }}>
          {sale.status === 'debt' && sale.client && Number(sale.debtAmount) > 0 && (
            <Button icon={Banknote} onPress={openPayDebt}>
              {t('sales.detail.payDebt')}
            </Button>
          )}
          <Button variant="destructive" icon={Ban} onPress={openCancel} loading={cancelMutation.isPending}>
            {t('sales.detail.cancelSale')}
          </Button>
        </View>
      )}

      <AlertDialog
        isVisible={isVisible}
        onClose={closeCancel}
        title={t('sales.detail.cancelSale')}
        description={t('sales.detail.cancelConfirm')}
        confirmText={t('sales.detail.cancelSale')}
        cancelText={t('common.cancel')}
        onConfirm={() => cancelMutation.mutate()}
      />

      <BottomSheet
        isVisible={payDebt.isVisible}
        onClose={payDebt.close}
        title={t('sales.detail.payDebt')}
        snapPoints={[0.55]}
      >
        <View style={{ gap: 16, paddingTop: 10 }}>
          <Text style={{ fontSize: 13, color: muted }}>
            {t('sales.detail.remainingDebt')}: {formatAmount(sale.debtAmount)} {currency}
          </Text>

          <Input
            label={t('sales.pos.paidAmount')}
            placeholder="0"
            value={payAmount}
            onChangeText={(v) => setPayAmount(formatAmount(v))}
            keyboardType="decimal-pad"
            variant="outline"
          />

          <Picker
            label={t('common.paymentMethod')}
            value={payMethod}
            onValueChange={(v) => setPayMethod(v as PaymentMethod)}
            options={[
              { label: t('common.paymentMethods.cash'), value: 'cash' },
              { label: t('common.paymentMethods.card'), value: 'card' },
              { label: t('common.paymentMethods.transfer'), value: 'transfer' },
              { label: t('common.paymentMethods.other'), value: 'other' },
            ]}
            variant="outline"
          />

          <Button
            onPress={() => payMutation.mutate()}
            loading={payMutation.isPending}
            disabled={!payAmount || Number(payAmount.replace(/,/g, '')) <= 0}
          >
            {t('sales.detail.confirmPayment')}
          </Button>
        </View>
      </BottomSheet>
    </View>
  );
}

function TotalRow({
  label,
  value,
  bold,
  valueColor,
  muted,
  text,
}: {
  label: string;
  value: string;
  bold?: boolean;
  valueColor?: string;
  muted: string;
  text: string;
}) {
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
      <Text style={{ fontSize: bold ? 15 : 13, color: bold ? text : muted, fontWeight: bold ? '700' : '500' }}>
        {label}
      </Text>
      <Text style={{ fontSize: bold ? 16 : 14, color: valueColor ?? text, fontWeight: bold ? '800' : '600' }}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});
