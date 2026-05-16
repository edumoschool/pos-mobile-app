import React, { useState } from 'react';
import {
  View,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft, DollarSign, Grid3x3, FileText, TrendingUp, TrendingDown, Banknote, Building2 } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { Text } from '@/components/ui/text';
import { useColor } from '@/hooks/useColor';
import { Input } from '@/components/ui/input';
import { Picker } from '@/components/ui/picker';
import { Button } from '@/components/ui/button';
import { AvoidKeyboard } from '@/components/ui/avoid-keyboard';
import { transactionsApi } from '@/api/transactions';
import { branchesApi } from '@/api/branches';
import { expenseCategoriesApi, incomeCategoriesApi } from '@/api/catalog';
import { getApiErrorMessage } from '@/api/client';
import { useToast } from '@/components/ui/toast';
import { CreateTransactionPayload, TransactionType } from '@/types';
import { formatAmount } from '@/lib/utils';

export default function CreateTransactionScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const qc = useQueryClient();
  const { success: showSuccess, error: showError } = useToast();

  const bg = useColor('background');
  const card = useColor('card');
  const border = useColor('border');
  const text = useColor('text');
  const muted = useColor('textMuted');
  const primary = useColor('primary');
  const red = useColor('red');
  const green = useColor('green');

  // ── Form State ──────────────────────────────────────────────────────────
  const [txType, setTxType] = useState<TransactionType>('income');
  const [amount, setAmount] = useState('');
  const [branchId, setBranchId] = useState('');
  const [expenseCatId, setExpenseCatId] = useState('');
  const [incomeCatId, setIncomeCatId] = useState('');
  const [description, setDescription] = useState('');
  const [currency, setCurrency] = useState<'USD' | 'UZS'>('USD');

  // ── Queries ──────────────────────────────────────────────────────────────
  const { data: branches = [] } = useQuery({
    queryKey: ['branches'],
    queryFn: branchesApi.getAll,
  });

  const { data: expenseCategories = [] } = useQuery({
    queryKey: ['expense-categories'],
    queryFn: expenseCategoriesApi.getAll,
  });

  const { data: incomeCategories = [] } = useQuery({
    queryKey: ['income-categories'],
    queryFn: incomeCategoriesApi.getAll,
  });
  // ── Mutation ─────────────────────────────────────────────────────────────
  const createMutation = useMutation({
    mutationFn: (payload: CreateTransactionPayload) => transactionsApi.create(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['transactions'] });
      qc.invalidateQueries({ queryKey: ['financial-summary'] });
      showSuccess(t('common.success'), t('transactions.created'));
      router.back();
    },
    onError: (err) => {
      showError(t('common.error'), getApiErrorMessage(err));
    },
  });

  const handleCreate = () => {
    const raw = amount.replace(/,/g, '');
    if (!raw || isNaN(Number(raw))) {
      showError(t('common.error'), t('transactions.fillRequired'));
      return;
    }

    if (!branchId) {
      showError(t('common.error'), t('transactions.selectBranch'));
      return;
    }

    const payload: CreateTransactionPayload = {
      branchId,
      type: txType,
      amount: Number(raw),
      currency,
      expenseCategoryId: txType === 'expense' ? expenseCatId || undefined : undefined,
      incomeCategoryId: txType === 'income' ? incomeCatId || undefined : undefined,
      description: description || undefined,
    };

    createMutation.mutate(payload);
  };

  const isLoading =
    createMutation.isPending ||
    (txType === 'income' && incomeCategories.length === 0) ||
    (txType === 'expense' && expenseCategories.length === 0);

  const selectedCategories = txType === 'income' ? incomeCategories : expenseCategories;

  return (
    <View style={{ flex: 1, backgroundColor: bg }}>
      {/* ── Header ──────────────────────────────────────────────────── */}
      <View style={{ paddingTop: insets.top, backgroundColor: bg }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 16,
            paddingVertical: 12,
          }}
        >
          <TouchableOpacity onPress={() => router.back()}>
            <ArrowLeft size={24} color={text} />
          </TouchableOpacity>
          <Text style={{ fontSize: 18, fontWeight: '700', color: text }}>
            {t('transactions.addTransaction')}
          </Text>
          <View style={{ width: 24 }} />
        </View>
      </View>

      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* ── Transaction Type ────────────────────────────────────── */}
        <View style={{ marginBottom: 20 }}>
          <Text style={{ fontSize: 14, fontWeight: '600', color: text, marginBottom: 8 }}>
            {t('transactions.type')}
          </Text>
          <View style={{ flexDirection: 'row', gap: 12 }}>
            {[
              { type: 'income' as const, label: t('transactions.income'), icon: TrendingUp, color: green },
              { type: 'expense' as const, label: t('transactions.expense'), icon: TrendingDown, color: red },
            ].map(({ type, label, icon: Icon, color }) => (
              <TouchableOpacity
                key={type}
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  paddingVertical: 12,
                  borderRadius: 8,
                  borderWidth: 1.5,
                  backgroundColor: txType === type ? color + '15' : card,
                  borderColor: txType === type ? color : border,
                }}
                onPress={() => setTxType(type)}
              >
                <Icon size={18} color={txType === type ? color : muted} style={{ marginRight: 6 }} />
                <Text style={{ fontSize: 15, fontWeight: '600', color: txType === type ? color : muted }}>
                  {label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* ── Branch ──────────────────────────────────────────────── */}
        {branches.length > 0 && (
          <View style={{ marginBottom: 16 }}>
            <Picker
              icon={Building2}
              placeholder={t('transactions.selectBranch')}
              value={branchId}
              onValueChange={setBranchId}
              options={branches.map((b) => ({ label: b.name, value: b.id }))}
              variant="outline"
            />
          </View>
        )}

        {/* ── Amount ──────────────────────────────────────────────── */}
        <View style={{ marginBottom: 16 }}>
          <Input
            placeholder="0.00"
            icon={DollarSign}
            value={amount}
            onChangeText={(v) => setAmount(formatAmount(v))}
            keyboardType="decimal-pad"
            variant="outline"
          />
        </View>

        {/* ── Currency ────────────────────────────────────────────── */}
        <View style={{ marginBottom: 16 }}>
          <Picker
            icon={Banknote}
            value={currency}
            onValueChange={(v: any) => setCurrency(v)}
            options={[
              { label: " UZS (So'm)", value: 'UZS' },
              { label: ' USD ($)', value: 'USD' },
            ]}
            variant="outline"
          />
        </View>

        {/* ── Category ────────────────────────────────────────────── */}
        {selectedCategories.length > 0 && (
          <View style={{ marginBottom: 16 }}>
            <Picker
              icon={Grid3x3}
              placeholder={t('transactions.selectCategory')}
              value={txType === 'income' ? incomeCatId : expenseCatId}
              onValueChange={(v: any) => {
                if (txType === 'income') setIncomeCatId(v);
                else setExpenseCatId(v);
              }}
              options={selectedCategories.map((c) => ({ label: c.name, value: c.id }))}
              variant="outline"
            />
          </View>
        )}

        {/* ── Description ─────────────────────────────────────────── */}
        <View style={{ marginBottom: 16 }}>
          <Input
            placeholder={t('clientDetail.optionalNotes')}
            icon={FileText}
            value={description}
            onChangeText={setDescription}
            variant="outline"
            type="textarea"
            rows={3}
          />
        </View>
      </ScrollView>

      {/* ── Footer Button ───────────────────────────────────────────── */}
      <View
        style={{
          paddingHorizontal: 16,
          paddingTop: 12,
          paddingBottom: Math.max(insets.bottom, 16),
          backgroundColor: bg,
        }}
      >
        <Button onPress={handleCreate} loading={createMutation.isPending}>
          {t('clientDetail.saveTransaction')}
        </Button>
      </View>

      {/* ── Keyboard Avoider ────────────────────────────────────────── */}
      <AvoidKeyboard />
    </View>
  );
}
