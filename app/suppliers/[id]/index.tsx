import React from 'react';
import { View, StyleSheet, TouchableOpacity, Platform, ActivityIndicator, RefreshControl } from 'react-native';
import { useLocalSearchParams, router, Stack } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { 
  Phone, 
  MapPin, 
  ArrowUpRight, 
  ArrowDownLeft,
  ChevronRight,
  Plus,
  Minus,
  MessageCircle,
  Trash2,
  Edit
} from 'lucide-react-native';
import { FlashList } from '@shopify/flash-list';

import { Text } from '@/components/ui/text';
import { useColor } from '@/hooks/useColor';
import { supplierTransactionsApi } from '@/api/party-transactions';
import { suppliersApi } from '@/api/partners';
import { getApiErrorMessage } from '@/api/client';
import { SupplierTransaction, PaymentMethod } from '@/types';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { BottomSheet } from '@/components/ui/bottom-sheet';
import { Input } from '@/components/ui/input';
import { Picker } from '@/components/ui/picker';
import { formatAmount } from '@/lib/utils';
import { AlertDialog, useAlertDialog } from '@/components/ui/alert-dialog';
import { useToast } from '@/components/ui/toast';

export default function SupplierDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const { t, i18n } = useTranslation();

  const bg = useColor('background');
  const card = useColor('card');
  const border = useColor('border');
  const text = useColor('text');
  const muted = useColor('textMuted');
  const primary = useColor('primary');
  const red = useColor('red');
  const green = useColor('green');

  const queryClient = useQueryClient();
  const deleteDialog = useAlertDialog();
  const deleteTxDialog = useAlertDialog();
  const { success: showSuccess, error: showError } = useToast();
  const [isSheetVisible, setIsSheetVisible] = React.useState(false);
  const [transactionType, setTransactionType] = React.useState<'income' | 'outcome'>('outcome');
  const [amount, setAmount] = React.useState('');
  const [currency, setCurrency] = React.useState<'USD' | 'UZS'>('USD');
  const [description, setDescription] = React.useState('');
  const [paymentMethod, setPaymentMethod] = React.useState<PaymentMethod>('cash');

  const [isDetailSheetVisible, setIsDetailSheetVisible] = React.useState(false);
  const [selectedTransaction, setSelectedTransaction] = React.useState<SupplierTransaction | null>(null);

  const { data, isLoading, error, refetch, isRefetching } = useQuery({
    queryKey: ['supplier-balance', id],
    queryFn: () => supplierTransactionsApi.getBalance(id!),
    enabled: !!id,
  });

  const createMutation = useMutation({
    mutationFn: (payload: any) => supplierTransactionsApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['supplier-balance', id] });
      showSuccess(t('common.success'), t('supplierDetail.paymentMade'));
      setIsSheetVisible(false);
      setAmount('');
      setDescription('');
    },
    onError: (err) => {
      showError(t('common.error'), getApiErrorMessage(err));
    }
  });

  const deleteMutation = useMutation({
    mutationFn: () => suppliersApi.delete(id!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
      showSuccess(t('common.success'), t('common.delete') + ' ' + t('common.success').toLowerCase());
      router.dismissAll();
      router.replace('/(tabs)/(home)');
    },
    onError: (err) => {
      showError(t('common.error'), getApiErrorMessage(err));
    }
  });

  const deleteTxMutation = useMutation({
    mutationFn: (txId: string) => supplierTransactionsApi.delete(txId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['supplier-balance', id] });
      showSuccess(t('common.success'), t('common.delete') + ' ' + t('common.success').toLowerCase());
      setIsDetailSheetVisible(false);
      setSelectedTransaction(null);
    },
    onError: (err) => {
      showError(t('common.error'), getApiErrorMessage(err));
    }
  });

  const handleCreateTransaction = () => {
    const rawAmount = amount.replace(/,/g, '');
    if (!rawAmount || isNaN(Number(rawAmount))) return;
    
    createMutation.mutate({
      supplierId: id!,
      type: transactionType,
      amount: Number(rawAmount),
      currency: currency,
      description: description || undefined,
      paymentMethod: paymentMethod,
    });
  };

  const openTransactionDetail = (tx: SupplierTransaction) => {
    setSelectedTransaction(tx);
    setIsDetailSheetVisible(true);
  };

  const handleTxDelete = () => {
    if (selectedTransaction) {
      deleteTxMutation.mutate(selectedTransaction.id);
    }
  };

  const openTransactionSheet = (type: 'income' | 'outcome') => {
    setTransactionType(type);
    setIsSheetVisible(true);
  };

  if (isLoading) {
    return (
      <View style={[styles.container, { backgroundColor: bg, justifyContent: 'center', alignItems: 'center', paddingTop: insets.top, paddingBottom: insets.bottom }]}>
        <ActivityIndicator size="large" color={primary} />
      </View>
    );
  }

  if (error || !data) {
    return (
      <View style={[styles.container, { backgroundColor: bg, justifyContent: 'center', alignItems: 'center', padding: 20, paddingTop: insets.top, paddingBottom: insets.bottom }]}>
        <Text style={{ color: red, textAlign: 'center', marginBottom: 12 }}>{t('common.error')}</Text>
        <Button onPress={() => router.back()}>{t('auth.back')}</Button>
      </View>
    );
  }

  const { supplier, totalAmountUzs, totalAmountUsd, totalAmount, transactions } = data;

  const renderHeader = () => (
    <View style={{ paddingBottom: 10 }}>
      {/* Centered Profile Section */}
      <View style={{ padding: 24, alignItems: 'center' }}>
        <Avatar size={90}>
          <AvatarFallback 
            style={{ backgroundColor: border }}
            textStyle={{ color: text, fontSize: 36, fontWeight: '700' }}
          >
            {supplier.name.substring(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>

        <Text style={{ fontSize: 22, fontWeight: 'bold', color: text, marginTop: 16, textAlign: 'center' }}>
          {supplier.name}
        </Text>

        <View style={{ 
          flexDirection: 'row', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          width: '100%', 
          marginTop: 4,
          paddingTop: 4,
          borderTopWidth: 1,
          borderTopColor: border + '50'
        }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={{ fontSize: 16, color: text, fontWeight: '600' }}>
              {supplier.phone || t('supplierDetail.noPhone')}
            </Text>
          </View>

          <View style={{ flexDirection: 'row', gap: 12 }}>
            <TouchableOpacity 
              style={{ width: 40, height: 40, borderRadius: 22, backgroundColor: '#0066ffff', alignItems: 'center', justifyContent: 'center' }}
              onPress={() => supplier.phone && require('react-native').Linking.openURL(`tel:${supplier.phone}`)}
            >
              <Phone size={20} color="#fff" fill="#fff" />
            </TouchableOpacity>
            <TouchableOpacity 
              style={{ width: 40, height: 40, borderRadius: 22, backgroundColor: '#ffa600ff', alignItems: 'center', justifyContent: 'center' }}
              onPress={() => supplier.phone && require('react-native').Linking.openURL(`sms:${supplier.phone}`)}
            >
              <MessageCircle size={20} color="#fff" fill="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Balance Cards */}
      <View style={{ paddingHorizontal: 10, gap: 8, marginTop: 8 }}>
        <View style={{ backgroundColor: '#FFF7ED', padding: 10, borderRadius: 12, flexDirection: 'row', alignItems: 'center' }}>
          <View style={{ width: 34, height: 34, borderRadius: 17, backgroundColor: '#FFEDD5', alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
            <Text style={{ color: '#EA580C', fontWeight: '800', fontSize: 16 }}>Σ</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 11, color: '#FB923C', fontWeight: '700' }}>{t('clientDetail.totalAmount')}</Text>
            <Text style={{ fontSize: 14, fontWeight: '800', color: '#7C2D12' }}>{formatAmount(totalAmount)} UZS</Text>
          </View>
        </View>

        <View style={{ backgroundColor: '#EFF6FF', padding: 10, borderRadius: 12, flexDirection: 'row', alignItems: 'center' }}>
          <View style={{ width: 34, height: 34, borderRadius: 17, backgroundColor: '#DBEAFE', alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
            <Text style={{ color: '#2d88f7ff', fontWeight: '800', fontSize: 16 }}>$</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 11, color: '#60A5FA', fontWeight: '700' }}>{t('clientDetail.balanceUsdLabel')}</Text>
            <Text style={{ fontSize: 14, fontWeight: '800', color: '#1E3A8A' }}>${formatAmount(totalAmountUsd)}</Text>
          </View>
        </View>
        
        <View style={{ backgroundColor: '#F0FDF4', padding: 10, borderRadius: 12, flexDirection: 'row', alignItems: 'center' }}>
          <View style={{ width: 34, height: 34, borderRadius: 17, backgroundColor: '#DCFCE7', alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
            <Text style={{ color: '#16A34A', fontWeight: '800', fontSize: 11 }}>UZS</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 11, color: '#4ADE80', fontWeight: '700' }}>{t('clientDetail.balanceUzsLabel')}</Text>
            <Text style={{ fontSize: 14, fontWeight: '800', color: '#14532D' }}>{formatAmount(totalAmountUzs)}</Text>
          </View>
        </View>
      </View>

      {/* Address Card */}
      <View style={{ paddingHorizontal: 10, marginTop: 20 }}>
        <TouchableOpacity 
          style={{ backgroundColor: card+'60', borderRadius: 6, padding: 16, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: border+'50' }}
          onPress={() => {
            if (supplier.address) {
              const query = encodeURIComponent(supplier.address);
              const appUrl = `yandexmaps://maps.yandex.ru/?text=${query}`;
              const webUrl = `https://yandex.com/maps/?text=${query}`;
              require('react-native').Linking.openURL(appUrl).catch(() => {
                require('react-native').Linking.openURL(webUrl);
              });
            }
          }}
        >
          <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: primary + '10', alignItems: 'center', justifyContent: 'center', marginRight: 16 }}>
            <MapPin size={22} color={primary} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 15, fontWeight: '700', color: text, marginBottom: 4 }}>{t('supplierDetail.address')}</Text>
            <Text style={{ fontSize: 13, color: muted, lineHeight: 18 }} numberOfLines={2}>
              {supplier.address || t('clientDetail.noAddress')}
            </Text>
          </View>
          <ChevronRight size={20} color={muted} />
        </TouchableOpacity>
      </View>


      {/* Recent Transactions Header */}
      <View style={{ marginTop: 20, paddingHorizontal: 20, marginBottom: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text style={{ fontSize: 18, fontWeight: '700', color: text }}>{t('clientDetail.recentTransactions')}</Text>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: bg, paddingBottom: insets.bottom }]}>
      <Stack.Screen 
        options={{
          headerTitle: t('supplierDetail.title'),
          headerShown: true,
          headerRight: () => (
            <View style={{ flexDirection: 'row', gap: 16, marginRight: 8 }}>
              <TouchableOpacity onPress={deleteDialog.open}>
                <Trash2 size={22} color={red} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => router.push(`/suppliers/${id}/edit` as any)}>
                <Edit size={22} color={primary} />
              </TouchableOpacity>
            </View>
          ),
          headerShadowVisible: false,
          headerStyle: { backgroundColor: bg },
          headerTintColor: text,
        }}
      />

      <FlashList<SupplierTransaction>
        data={transactions as SupplierTransaction[]}
        keyExtractor={(item: any) => item.id}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={{ paddingBottom: 100 }}
        refreshControl={
          <RefreshControl 
            refreshing={isRefetching} 
            onRefresh={refetch} 
            tintColor={primary}
            colors={[primary]}
          />
        }
        renderItem={({ item, index }: { item: SupplierTransaction, index: number }) => {
          const isIncome = item.type === 'income';
          const iconColor = isIncome ? green : red;
          const Icon = isIncome ? ArrowDownLeft : ArrowUpRight;
          
          return (
            <TouchableOpacity 
              style={{ paddingHorizontal: 10, marginBottom: 6 }}
              onPress={() => openTransactionDetail(item)}
            >
              <View style={{ 
                flexDirection: 'row', 
                alignItems: 'center', 
                padding: 10, 
                backgroundColor: card, 
                borderRadius: 12,
                borderWidth: 1,
                borderColor: border
              }}>
                <View style={{ 
                  width: 36, 
                  height: 36, 
                  borderRadius: 18, 
                  backgroundColor: iconColor + '15', 
                  alignItems: 'center', 
                  justifyContent: 'center' 
                }}>
                  <Icon size={18} color={iconColor} />
                </View>
                
                <View style={{ flex: 1, marginLeft: 12, gap: 0 }}>
                  <Text style={{ fontSize: 10, color: muted, textTransform: 'uppercase', fontWeight: '700' }}>
                    {isIncome ? t('supplierDetail.refundReceived') : t('supplierDetail.paymentMade')}
                  </Text>
                  <Text style={{ fontSize: 16, fontWeight: '900', color: iconColor }}>
                    {isIncome ? '+' : '-'}{formatAmount(item.amount)} {item.currency}
                  </Text>
                  <Text style={{ fontSize: 12, color: text, fontWeight: '600' }} numberOfLines={1}>
                    {item.description || (isIncome ? t('supplierDetail.refundReceived') : t('supplierDetail.paymentMade'))}
                  </Text>
                  <Text style={{ fontSize: 10, color: muted }}>
                    {new Date(item.createdAt).toLocaleString(i18n.language, { dateStyle: 'medium', timeStyle: 'short' })}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          );
        }}
        ListEmptyComponent={() => (
          <View style={{ paddingHorizontal: 10 }}>
            <View style={{ padding: 40, alignItems: 'center', backgroundColor: card+'60', borderRadius: 6, borderWidth: 1, borderColor: border+'50' }}>
              <Text style={{ color: muted }}>{t('supplierDetail.noHistory')}</Text>
            </View>
          </View>
        )}
      />

      {/* Action Buttons */}
      <View style={[styles.actions, { bottom: 20 }]}>
        <TouchableOpacity 
          style={[styles.actionButton, { backgroundColor: red }]}
          onPress={() => openTransactionSheet('outcome')}
        >
          <Minus size={20} color="#fff" />
          <Text style={{ color: '#fff', fontWeight: '600' }}>{t('supplierDetail.paySupplier')}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.actionButton, { backgroundColor: green }]}
          onPress={() => openTransactionSheet('income')}
        >
          <Plus size={20} color="#fff" />
          <Text style={{ color: '#fff', fontWeight: '600' }}>{t('supplierDetail.receiveRefund')}</Text>
        </TouchableOpacity>
      </View>

      {/* Transaction BottomSheet */}
      <BottomSheet
        isVisible={isSheetVisible}
        onClose={() => setIsSheetVisible(false)}
        title={transactionType === 'income' ? t('supplierDetail.receiveRefund') : t('supplierDetail.paySupplier')}
        snapPoints={[0.65]}
      >
        <View style={{ gap: 20, paddingTop: 10 }}>
          <Input
            label={t('clientDetail.amount') || 'Amount'}
            placeholder="0.00"
            value={amount}
            onChangeText={(val) => setAmount(formatAmount(val))}
            keyboardType="decimal-pad"
            variant="outline"
          />

          <Picker
            label={t('clientDetail.currency') || 'Currency'}
            value={currency}
            onValueChange={(val: any) => setCurrency(val)}
            options={[
              { label: 'USD ($)', value: 'USD' },
              { label: 'UZS (So\'m)', value: 'UZS' },
            ]}
            variant="outline"
          />

          <Picker
            label={t('common.paymentMethod') || 'Payment Method'}
            value={paymentMethod}
            onValueChange={(val: any) => setPaymentMethod(val)}
            options={[
              { label: t('common.paymentMethods.cash') || 'Cash', value: 'cash' },
              { label: t('common.paymentMethods.card') || 'Card', value: 'card' },
              { label: t('common.paymentMethods.transfer') || 'Bank Transfer', value: 'transfer' },
              { label: t('common.paymentMethods.other') || 'Other', value: 'other' },
            ]}
            variant="outline"
          />

          <Input
            label={t('clientDetail.description') || 'Description'}
            placeholder={t('clientDetail.optionalNotes') || 'Optional notes...'}
            value={description}
            onChangeText={setDescription}
            variant="outline"
            type="textarea"
            rows={3}
          />

          <Button 
            onPress={handleCreateTransaction}
            loading={createMutation.isPending}
            style={{ marginTop: 10 }}
          >
            {t('clientDetail.saveTransaction') || 'Save Transaction'}
          </Button>
        </View>
      </BottomSheet>

      <AlertDialog
        isVisible={deleteDialog.isVisible}
        onClose={deleteDialog.close}
        title={t('common.delete') || 'Delete Supplier'}
        description={t('products.deleteConfirmation') || 'Are you sure you want to delete this supplier?'}
        confirmText={t('common.delete') || 'Delete'}
        cancelText={t('common.cancel') || 'Cancel'}
        onConfirm={deleteMutation.mutate}
      />

      {/* Transaction Detail BottomSheet */}
      <BottomSheet
        isVisible={isDetailSheetVisible}
        onClose={() => setIsDetailSheetVisible(false)}
        disablePanGesture={false}
        snapPoints={[0.6]}
      >
        <View style={{ paddingBottom: insets.bottom }}>
          {/* Custom Header */}
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
            <View style={{ width: 40 }} />
            <Text style={{ fontSize: 18, fontWeight: '700', color: text }}>{t('clientDetail.transactionDetails')}</Text>
            <TouchableOpacity 
              style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: red + '10', alignItems: 'center', justifyContent: 'center' }}
              onPress={deleteTxDialog.open}
            >
              <Trash2 size={20} color={red} />
            </TouchableOpacity>
          </View>

          {/* Amount */}
          <View style={{ alignItems: 'center', marginBottom: 32 }}>
            <Text style={{ fontSize: 32, fontWeight: '800', color: selectedTransaction?.type === 'income' ? green : red }}>
              {selectedTransaction?.type === 'income' ? '+' : '-'}{formatAmount(selectedTransaction?.amount)} {selectedTransaction?.currency}
            </Text>
            <Text style={{ fontSize: 14, color: muted, marginTop: 4 }}>
              {selectedTransaction?.type === 'income' ? t('supplierDetail.refundReceived') : t('supplierDetail.paymentMade')}
            </Text>
          </View>

          {/* Details List */}
          <View style={{ backgroundColor: bg, borderRadius: 16, padding: 16, gap: 16, marginBottom: 32 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ color: muted }}>{t('home.sortOptions.createdAt')}</Text>
              <Text style={{ fontWeight: '600', color: text }}>
                {selectedTransaction && new Date(selectedTransaction.createdAt).toLocaleString(i18n.language, { dateStyle: 'medium', timeStyle: 'short' })}
              </Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ color: muted }}>{t('common.paymentMethod')}</Text>
              <Text style={{ fontWeight: '600', color: text }}>
                {selectedTransaction?.paymentMethod ? t(`common.paymentMethods.${selectedTransaction.paymentMethod}`) : '-'}
              </Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ color: muted }}>{t('clientDetail.currency')}</Text>
              <Text style={{ fontWeight: '600', color: text }}>{selectedTransaction?.currency}</Text>
            </View>
            {selectedTransaction?.description && (
              <View style={{ gap: 8 }}>
                <Text style={{ color: muted }}>{t('clientDetail.description')}</Text>
                <Text style={{ fontWeight: '500', color: text, lineHeight: 20 }}>{selectedTransaction.description}</Text>
              </View>
            )}
          </View>

          <Button 
            variant="outline" 
            onPress={() => setIsDetailSheetVisible(false)}
          >
            {t('common.cancel')}
          </Button>
        </View>
      </BottomSheet>

      <AlertDialog
        isVisible={deleteTxDialog.isVisible}
        onClose={deleteTxDialog.close}
        title={t('common.delete') || 'Delete Transaction'}
        description={t('clientDetail.deleteTxConfirmation') || 'Are you sure you want to delete this transaction?'}
        confirmText={t('common.delete') || 'Delete'}
        cancelText={t('common.cancel') || 'Cancel'}
        onConfirm={handleTxDelete}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  actions: {
    position: 'absolute',
    left: 20,
    right: 20,
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    height: 54,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#00000075',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 4,
  }
});
