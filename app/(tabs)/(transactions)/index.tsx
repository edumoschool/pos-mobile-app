import React, { useMemo } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  Image,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Plus, Filter, ArrowDown, ArrowUp, PieChart } from 'lucide-react-native';
import { FlashList } from '@shopify/flash-list';

import { Text } from '@/components/ui/text';
import { useColor } from '@/hooks/useColor';
import { transactionsApi } from '@/api/transactions';
import { reportsApi } from '@/api/reports';
import { Transaction } from '@/types';
import { formatAmount } from '@/lib/utils';
import { useRouter } from 'expo-router';

function groupByDay(transactions: Transaction[], locale: string): { title: string; data: Transaction[] }[] {
  const map = new Map<string, Transaction[]>();
  for (const tx of transactions) {
    const day = new Date(tx.createdAt).toLocaleDateString(locale, { dateStyle: 'long' });
    if (!map.has(day)) map.set(day, []);
    map.get(day)!.push(tx);
  }
  return Array.from(map.entries()).map(([title, data]) => ({ title, data }));
}

type ListItem = { kind: 'header'; title: string } | { kind: 'tx'; tx: Transaction; isFirst: boolean; isLast: boolean };

export default function TransactionsScreen() {
  const { t, i18n } = useTranslation();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const muted = useColor('textMuted');
  const primary = useColor('primary');
  const background = useColor('background');
  const card = useColor('card');
  const text = useColor('text');
  const border = useColor('border');
  const green = useColor('green');
  const red = useColor('red');
  const blue = useColor('blue');

  // ── Queries ──────────────────────────────────────────────────────────────
  const { data: summary } = useQuery({
    queryKey: ['financial-summary'],
    queryFn: () => reportsApi.financialSummary(),
  });

  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
    isRefetching,
  } = useInfiniteQuery({
    queryKey: ['transactions'],
    queryFn: ({ pageParam = 1 }) =>
      transactionsApi.getAll({
        page: pageParam,
        limit: 30,
      }),
    getNextPageParam: (last) =>
      last.meta && last.meta.page < last.meta.totalPages ? last.meta.page + 1 : undefined,
    initialPageParam: 1,
  });

  const allTransactions = useMemo(
    () => data?.pages.flatMap((p) => p.data) ?? [],
    [data]
  );


  // ── Flat list items ──────────────────────────────────────────────────────
  const groups = useMemo(() => groupByDay(allTransactions, i18n.language), [allTransactions, i18n.language]);

  const listItems = useMemo<ListItem[]>(() => {
    const items: ListItem[] = [];
    for (const g of groups) {
      items.push({ kind: 'header', title: g.title });
      g.data.forEach((tx, i) => {
        items.push({ kind: 'tx', tx, isFirst: i === 0, isLast: i === g.data.length - 1 });
      });
    }
    return items;
  }, [groups]);

  // ── Render ───────────────────────────────────────────────────────────────
  const renderItem = ({ item }: { item: ListItem }) => {
    if (item.kind === 'header') {
      return (
        <Text style={{ fontSize: 14, fontWeight: '600', color: muted, paddingHorizontal: 16, paddingTop: 24, paddingBottom: 8 }}>
          {item.title}
        </Text>
      );
    }

    const { tx, isFirst, isLast } = item;
    const isIncome = tx.type === 'income';
    const iconColor = isIncome ? green : red;
    const iconBg = isIncome ? `${green}22` : `${red}22`;
    const Icon = isIncome ? ArrowDown : ArrowUp;
    const categoryName = isIncome
      ? tx.incomeCategory?.name ?? t('transactions.income')
      : tx.expenseCategory?.name ?? t('transactions.expense');

    return (
      <View style={{ marginHorizontal: 16 }}>
        <TouchableOpacity
          style={{
            backgroundColor: card,
            paddingHorizontal: 16,
            borderTopLeftRadius: isFirst ? 16 : 0,
            borderTopRightRadius: isFirst ? 16 : 0,
            borderBottomLeftRadius: isLast ? 16 : 0,
            borderBottomRightRadius: isLast ? 16 : 0,
          }}
          activeOpacity={0.7}
          onPress={() => router.push(`/transactions/${tx.id}` as any)}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 16 }}>
            <View style={{
              width: 44, height: 44, borderRadius: 22,
              backgroundColor: iconBg,
              alignItems: 'center', justifyContent: 'center', marginRight: 14,
            }}>
              <Icon size={20} color={iconColor} />
            </View>

            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 15, fontWeight: '700', color: text }}>{categoryName}</Text>
              <Text style={{ fontSize: 13, color: muted, marginTop: 3 }}>
                {tx.description ?? tx.branch?.name ?? '—'}
              </Text>
              <Text style={{ fontSize: 12, color: muted, marginTop: 2 }}>
                {new Date(tx.createdAt).toLocaleTimeString(i18n.language, { timeStyle: 'short' })}
              </Text>
            </View>

            <View style={{ alignItems: 'flex-end' }}>
              <Text style={{ fontSize: 15, fontWeight: '700', color: iconColor }}>
                {isIncome ? '+' : '-'}{formatAmount(tx.amount)} {tx.currency}
              </Text>
              <Text style={{ fontSize: 12, color: iconColor, marginTop: 4, fontWeight: '500' }}>
                {isIncome ? t('transactions.income') : t('transactions.expense')}
              </Text>
            </View>
          </View>

          {!isLast && <View style={{ height: StyleSheet.hairlineWidth, backgroundColor: border, marginLeft: 58 }} />}
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: background, paddingTop: insets.top }}>

      {/* ── Header ──────────────────────────────────────────────── */}
      <View style={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <TouchableOpacity hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <PieChart size={24} color={blue} />
        </TouchableOpacity>
        <Text style={{ fontSize: 18, fontWeight: '700', color: text }}>{t('transactions.title')}</Text>
        <TouchableOpacity hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <Filter size={22} color={text} />
        </TouchableOpacity>
      </View>

      {/* ── Summary Cards ───────────────────────────────────────── */}
      <View style={{ flexDirection: 'row', gap: 12, paddingHorizontal: 10, marginBottom: 12 }}>
        {/* Income Card */}
        <View style={{ flex: 1, backgroundColor: green, borderRadius: 16, padding: 14, shadowColor: green, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
            <View style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: 'rgba(255, 255, 255, 0.2)', alignItems: 'center', justifyContent: 'center', marginRight: 8 }}>
              <ArrowDown size={14} color="#FFFFFF" />
            </View>
            <Text style={{ flex: 1, fontSize: 13, color: 'rgba(255, 255, 255, 0.9)', fontWeight: '600' }} numberOfLines={1}>{t('transactions.totalIncome')}</Text>
          </View>
          <Text style={{ fontSize: 15, fontWeight: '800', color: '#FFFFFF' }} numberOfLines={1} adjustsFontSizeToFit>
            {formatAmount(summary?.totalIncome ?? 0)}
          </Text>
        </View>

        {/* Expense Card */}
        <View style={{ flex: 1, backgroundColor: red, borderRadius: 16, padding: 14, shadowColor: red, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
            <View style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: 'rgba(255, 255, 255, 0.2)', alignItems: 'center', justifyContent: 'center', marginRight: 8 }}>
              <ArrowUp size={14} color="#FFFFFF" />
            </View>
            <Text style={{ flex: 1, fontSize: 13, color: 'rgba(255, 255, 255, 0.9)', fontWeight: '600' }} numberOfLines={1}>{t('transactions.totalExpense')}</Text>
          </View>
          <Text style={{ fontSize: 15, fontWeight: '800', color: '#FFFFFF' }} numberOfLines={1} adjustsFontSizeToFit>
            {formatAmount(summary?.totalExpenses ?? 0)}
          </Text>
        </View>
      </View>


      {/* ── List ────────────────────────────────────────────────── */}
      {isLoading ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator color={primary} />
        </View>
      ) : (
        <FlashList
          data={listItems}
          keyExtractor={(item, i) => item.kind === 'header' ? `h-${item.title}` : item.tx.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}
          refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor={primary} colors={[primary]} />}
          onEndReached={() => hasNextPage && !isFetchingNextPage && fetchNextPage()}
          onEndReachedThreshold={0.3}
          ListEmptyComponent={() => (
            <View style={{ alignItems: 'center', paddingTop: 60 }}>
              <Image
                source={require('@/assets/icons/empty.png')}
                style={{ width: 150, height: 150, marginBottom: 16, opacity: 0.9 }}
                resizeMode="contain"
              />
              <Text style={{ color: muted, fontSize: 15 }}>{t('transactions.noResults')}</Text>
            </View>
          )}
          ListFooterComponent={isFetchingNextPage ? () => <ActivityIndicator color={primary} style={{ marginVertical: 16 }} /> : null}
        />
      )}

      {/* ── FAB ─────────────────────────────────────────────────── */}
      <TouchableOpacity
        style={{ position: 'absolute', right: 20, bottom: insets.bottom + 30, width: 60, height: 60, borderRadius: 30, backgroundColor: primary, alignItems: 'center', justifyContent: 'center', shadowColor: primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 6 }}
        onPress={() => router.push('/transactions/create')}
      >
        <Plus size={28} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({});

