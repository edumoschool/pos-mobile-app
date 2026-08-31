import React, { useMemo, useState } from 'react';
import {
  View,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Switch,
  Image,
} from 'react-native';
import { router } from 'expo-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import {
  Plus,
  Minus,
  Trash2,
  User,
  Tag,
  Wallet,
  Banknote,
  ShoppingCart,
} from 'lucide-react-native';

import { Text } from '@/components/ui/text';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Picker } from '@/components/ui/picker';
import { Header } from '@/components/ui/header';
import { SearchBar } from '@/components/ui/searchbar';
import { AvoidKeyboard } from '@/components/ui/avoid-keyboard';
import { useToast } from '@/components/ui/toast';
import { useColor } from '@/hooks/useColor';
import { useAuth } from '@/hooks/useAuth';
import { productsApi } from '@/api/products';
import { clientsApi } from '@/api/partners';
import { salesApi } from '@/api/sales';
import { getApiErrorMessage } from '@/api/client';
import { formatAmount } from '@/lib/utils';
import type { Currency, PaymentMethod, Product, CreateSalePayload } from '@/types';

interface CartLine {
  productId: string;
  name: string;
  unitPrice: number;
  quantity: number;
  stock: number;
  unitShort: string;
}

export default function CreateSaleScreen() {
  const { t } = useTranslation();
  const qc = useQueryClient();
  const { user } = useAuth();
  const { success: showSuccess, error: showError } = useToast();

  const bg = useColor('background');
  const card = useColor('card');
  const border = useColor('border');
  const text = useColor('text');
  const muted = useColor('textMuted');
  const primary = useColor('primary');
  const primaryForeground = useColor('primaryForeground');
  const green = useColor('green');
  const red = useColor('red');
  const orange = useColor('orange');

  // ── Form state ────────────────────────────────────────────────────────────
  const [search, setSearch] = useState('');
  const [cart, setCart] = useState<CartLine[]>([]);
  const [clientId, setClientId] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
  const [currency, setCurrency] = useState<Currency>('UZS');
  const [discount, setDiscount] = useState('');
  const [fullyPaid, setFullyPaid] = useState(true);
  const [paidInput, setPaidInput] = useState('');
  const [note, setNote] = useState('');

  // ── Queries ───────────────────────────────────────────────────────────────
  const { data: productPage, isLoading: loadingProducts } = useQuery({
    queryKey: ['products', 'pos', search],
    queryFn: () => productsApi.getAll({ page: 1, limit: 20, search: search || undefined }),
  });

  const { data: clientPage } = useQuery({
    queryKey: ['clients', 'pos'],
    queryFn: () => clientsApi.getAll({ page: 1, limit: 100, sortBy: 'alphabetic', order: 'asc' }),
  });

  const products = productPage?.data ?? [];
  const clientOptions = useMemo(
    () => [
      { label: t('sales.pos.walkIn'), value: '' },
      ...(clientPage?.data ?? []).map((c) => ({ label: c.fullName, value: c.id })),
    ],
    [clientPage, t],
  );

  // ── Totals ────────────────────────────────────────────────────────────────
  const subtotal = useMemo(
    () => cart.reduce((sum, l) => sum + l.unitPrice * l.quantity, 0),
    [cart],
  );
  const discountValue = Number(discount.replace(/,/g, '')) || 0;
  const total = Math.max(0, subtotal - discountValue);
  const paidValue = fullyPaid ? total : Number(paidInput.replace(/,/g, '')) || 0;
  const debt = Math.max(0, total - paidValue);

  // ── Cart helpers ──────────────────────────────────────────────────────────
  const stockOf = (p: Product) => Number(p.inventory?.[0]?.quantity ?? 0);

  const addToCart = (p: Product) => {
    const stock = stockOf(p);
    if (stock <= 0) return;
    setCart((prev) => {
      const existing = prev.find((l) => l.productId === p.id);
      if (existing) {
        if (existing.quantity >= existing.stock) return prev;
        return prev.map((l) =>
          l.productId === p.id ? { ...l, quantity: l.quantity + 1 } : l,
        );
      }
      return [
        ...prev,
        {
          productId: p.id,
          name: p.name,
          unitPrice: Number(p.sellingPrice) || 0,
          quantity: 1,
          stock,
          unitShort: p.unit?.shortName ?? '',
        },
      ];
    });
  };

  const setQty = (productId: string, next: number) => {
    setCart((prev) =>
      prev.flatMap((l) => {
        if (l.productId !== productId) return [l];
        const clamped = Math.min(Math.max(next, 0), l.stock);
        return clamped === 0 ? [] : [{ ...l, quantity: clamped }];
      }),
    );
  };

  const removeLine = (productId: string) =>
    setCart((prev) => prev.filter((l) => l.productId !== productId));

  // ── Submit ────────────────────────────────────────────────────────────────
  const createMutation = useMutation({
    mutationFn: (payload: CreateSalePayload) => salesApi.create(payload),
    onSuccess: (sale) => {
      qc.invalidateQueries({ queryKey: ['sales'] });
      qc.invalidateQueries({ queryKey: ['sales-summary'] });
      qc.invalidateQueries({ queryKey: ['products'] });
      qc.invalidateQueries({ queryKey: ['inventory'] });
      qc.invalidateQueries({ queryKey: ['clients'] });
      qc.invalidateQueries({ queryKey: ['client-transactions'] });
      showSuccess(t('common.success'), t('sales.pos.success.saleCreated'));
      router.replace(`/sales/${sale.id}` as any);
    },
    onError: (err) => showError(t('common.error'), getApiErrorMessage(err)),
  });

  const handleCheckout = () => {
    if (cart.length === 0) {
      showError(t('common.error'), t('sales.pos.errors.emptyCart'));
      return;
    }
    if (debt > 0 && !clientId) {
      showError(t('common.error'), t('sales.pos.errors.clientRequiredForDebt'));
      return;
    }
    if (paidValue > total) {
      showError(t('common.error'), t('sales.pos.errors.paidExceedsTotal'));
      return;
    }

    const payload: CreateSalePayload = {
      items: cart.map((l) => ({
        productId: l.productId,
        quantity: l.quantity,
        unitPrice: l.unitPrice,
      })),
      clientId: clientId || undefined,
      paymentMethod,
      currency,
      paidAmount: paidValue,
      discount: discountValue || undefined,
      note: note.trim() || undefined,
      branchId: user?.branchId ?? undefined,
    };
    createMutation.mutate(payload);
  };

  const paymentOptions = [
    { label: t('common.paymentMethods.cash'), value: 'cash' },
    { label: t('common.paymentMethods.card'), value: 'card' },
    { label: t('common.paymentMethods.transfer'), value: 'transfer' },
    { label: t('common.paymentMethods.other'), value: 'other' },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: bg }}>
      <Header title={t('sales.pos.title')} />

      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* ── Product search ───────────────────────────────────────── */}
        <Text style={{ fontSize: 14, fontWeight: '700', color: text, marginTop: 12, marginBottom: 8 }}>
          {t('sales.pos.addItems')}
        </Text>
        <SearchBar
          placeholder={t('sales.pos.searchProducts')}
          value={search}
          onChangeText={setSearch}
          onClear={() => setSearch('')}
          containerStyle={{ height: 42, borderRadius: 12 }}
          showClearButton
        />

        <View style={{ marginTop: 8, borderRadius: 12, backgroundColor: card, borderWidth: 1, borderColor: border + '80' }}>
          {loadingProducts ? (
            <ActivityIndicator color={primary} style={{ margin: 20 }} />
          ) : products.length === 0 ? (
            <Text style={{ color: muted, textAlign: 'center', padding: 20 }}>
              {t('products.emptyTitle')}
            </Text>
          ) : (
            products.map((p, i) => {
              const stock = stockOf(p);
              const inCart = cart.find((l) => l.productId === p.id)?.quantity ?? 0;
              const disabled = stock <= 0 || inCart >= stock;
              return (
                <TouchableOpacity
                  key={p.id}
                  onPress={() => addToCart(p)}
                  disabled={disabled}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    padding: 12,
                    borderTopWidth: i === 0 ? 0 : 1,
                    borderTopColor: border + '60',
                    opacity: disabled ? 0.45 : 1,
                  }}
                >
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 14, fontWeight: '600', color: text }} numberOfLines={1}>
                      {p.name}
                    </Text>
                    <Text style={{ fontSize: 12, color: stock <= 0 ? red : muted, marginTop: 2 }}>
                      {stock <= 0
                        ? t('sales.pos.outOfStock')
                        : `${t('sales.pos.available')}: ${stock} ${p.unit?.shortName ?? ''}`}
                    </Text>
                  </View>
                  <Text style={{ fontSize: 14, fontWeight: '700', color: text, marginRight: 10 }}>
                    {formatAmount(p.sellingPrice)} {p.currency}
                  </Text>
                  <View
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 8,
                      backgroundColor: primary,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Plus size={16} color={primaryForeground} />
                  </View>
                </TouchableOpacity>
              );
            })
          )}
        </View>

        {/* ── Cart ─────────────────────────────────────────────────── */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 20, marginBottom: 8 }}>
          <ShoppingCart size={16} color={text} />
          <Text style={{ fontSize: 14, fontWeight: '700', color: text }}>
            {t('sales.pos.cart')} ({cart.length})
          </Text>
        </View>

        {cart.length === 0 ? (
          <View style={{ alignItems: 'center', paddingVertical: 24 }}>
            <Image
              source={require('@/assets/icons/empty.png')}
              style={{ width: 96, height: 96, opacity: 0.85, marginBottom: 8 }}
              resizeMode="contain"
            />
            <Text style={{ color: muted, fontSize: 13 }}>{t('sales.pos.cartEmpty')}</Text>
          </View>
        ) : (
          cart.map((l) => (
            <View
              key={l.productId}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: card,
                borderRadius: 12,
                padding: 12,
                marginBottom: 8,
                borderWidth: 1,
                borderColor: border + '60',
              }}
            >
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 14, fontWeight: '600', color: text }} numberOfLines={1}>
                  {l.name}
                </Text>
                <Text style={{ fontSize: 12, color: muted, marginTop: 2 }}>
                  {formatAmount(l.unitPrice)} × {l.quantity} {l.unitShort} ={' '}
                  <Text style={{ fontWeight: '700', color: text }}>
                    {formatAmount(l.unitPrice * l.quantity)}
                  </Text>
                </Text>
              </View>

              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <TouchableOpacity onPress={() => setQty(l.productId, l.quantity - 1)}>
                  <Minus size={18} color={primary} />
                </TouchableOpacity>
                <Text style={{ fontSize: 15, fontWeight: '700', color: text, minWidth: 20, textAlign: 'center' }}>
                  {l.quantity}
                </Text>
                <TouchableOpacity
                  onPress={() => setQty(l.productId, l.quantity + 1)}
                  disabled={l.quantity >= l.stock}
                >
                  <Plus size={18} color={l.quantity >= l.stock ? muted : primary} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => removeLine(l.productId)} style={{ marginLeft: 4 }}>
                  <Trash2 size={18} color={red} />
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}

        {/* ── Options ──────────────────────────────────────────────── */}
        <View style={{ gap: 12, marginTop: 8 }}>
          <Picker
            icon={User}
            searchable
            placeholder={t('sales.pos.client')}
            modalTitle={t('sales.pos.client')}
            value={clientId}
            onValueChange={setClientId}
            options={clientOptions}
            variant="outline"
          />

          <View style={{ flexDirection: 'row', gap: 12 }}>
            <View style={{ flex: 1 }}>
              <Picker
                icon={Wallet}
                value={paymentMethod}
                onValueChange={(v) => setPaymentMethod(v as PaymentMethod)}
                options={paymentOptions}
                variant="outline"
              />
            </View>
            <View style={{ flex: 1 }}>
              <Picker
                icon={Banknote}
                value={currency}
                onValueChange={(v) => setCurrency(v as Currency)}
                options={[
                  { label: 'UZS', value: 'UZS' },
                  { label: 'USD', value: 'USD' },
                ]}
                variant="outline"
              />
            </View>
          </View>

          <Input
            icon={Tag}
            placeholder={t('sales.pos.discount')}
            value={discount}
            onChangeText={(v) => setDiscount(formatAmount(v))}
            keyboardType="decimal-pad"
            variant="outline"
          />

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: card,
              borderRadius: 12,
              paddingHorizontal: 16,
              paddingVertical: 12,
              borderWidth: 1,
              borderColor: border,
            }}
          >
            <Text style={{ fontSize: 15, color: text, fontWeight: '600' }}>
              {t('sales.pos.fullyPaid')}
            </Text>
            <Switch
              value={fullyPaid}
              onValueChange={setFullyPaid}
              trackColor={{ true: primary }}
            />
          </View>

          {!fullyPaid && (
            <Input
              icon={Wallet}
              placeholder={t('sales.pos.paidAmount')}
              value={paidInput}
              onChangeText={(v) => setPaidInput(formatAmount(v))}
              keyboardType="decimal-pad"
              variant="outline"
            />
          )}

          <Input
            placeholder={t('clientDetail.optionalNotes')}
            value={note}
            onChangeText={setNote}
            variant="outline"
            type="textarea"
            rows={2}
          />
        </View>

        {/* ── Totals ───────────────────────────────────────────────── */}
        <View
          style={{
            marginTop: 16,
            backgroundColor: card,
            borderRadius: 12,
            padding: 16,
            borderWidth: 1,
            borderColor: border,
            gap: 8,
          }}
        >
          <Row label={t('sales.pos.subtotal')} value={`${formatAmount(subtotal)} ${currency}`} muted={muted} text={text} />
          {discountValue > 0 && (
            <Row label={t('sales.pos.discount')} value={`- ${formatAmount(discountValue)} ${currency}`} muted={muted} text={text} />
          )}
          <View style={{ height: 1, backgroundColor: border }} />
          <Row label={t('sales.pos.total')} value={`${formatAmount(total)} ${currency}`} bold text={text} muted={muted} />
          <Row label={t('sales.pos.toPay')} value={`${formatAmount(paidValue)} ${currency}`} valueColor={green} text={text} muted={muted} />
          {debt > 0 && (
            <Row label={t('sales.pos.debt')} value={`${formatAmount(debt)} ${currency}`} valueColor={orange} text={text} muted={muted} />
          )}
        </View>
      </ScrollView>

      <View style={{ paddingHorizontal: 16, paddingTop: 12, paddingBottom: 16, backgroundColor: bg }}>
        <Button
          onPress={handleCheckout}
          loading={createMutation.isPending}
          disabled={cart.length === 0}
        >
          {`${t('sales.pos.checkout')} · ${formatAmount(total)} ${currency}`}
        </Button>
      </View>

      <AvoidKeyboard />
    </View>
  );
}

function Row({
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
