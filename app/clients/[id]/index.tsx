import React from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView, Platform, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { 
  ChevronLeft, 
  Phone, 
  MapPin, 
  Notebook as Notes, 
  ArrowUpRight, 
  ArrowDownLeft,
  Calendar,
  MoreVertical,
  Plus,
  Minus
} from 'lucide-react-native';
import { FlashList } from '@shopify/flash-list';

import { Text } from '@/components/ui/text';
import { useColor } from '@/hooks/useColor';
import { clientTransactionsApi } from '@/api/party-transactions';
import { ClientTransaction } from '@/types';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

export default function ClientDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();

  const bg = useColor('background');
  const card = useColor('card');
  const border = useColor('border');
  const text = useColor('text');
  const muted = useColor('textMuted');
  const primary = useColor('primary');
  const primaryForeground = useColor('primaryForeground');
  const red = useColor('red');
  const green = useColor('green');

  const { data, isLoading, error } = useQuery({
    queryKey: ['client-balance', id],
    queryFn: () => clientTransactionsApi.getBalance(id!),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <View style={[styles.container, { backgroundColor: bg, justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={primary} />
      </View>
    );
  }

  if (error || !data) {
    return (
      <View style={[styles.container, { backgroundColor: bg, justifyContent: 'center', alignItems: 'center', padding: 20 }]}>
        <Text style={{ color: red, textAlign: 'center', marginBottom: 12 }}>{t('common.error')}</Text>
        <Button onPress={() => router.back()}>{t('auth.back')}</Button>
      </View>
    );
  }

  const { client, balanceUzs, balanceUsd, transactions } = data;

  const renderHeader = () => (
    <View style={{ paddingHorizontal: 20, paddingTop: 10, paddingBottom: 20 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
        <Avatar size={80}>
          <AvatarFallback 
            style={{ backgroundColor: primary }}
            textStyle={{ color: primaryForeground, fontSize: 24, fontWeight: '700' }}
          >
            {client.fullName.substring(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 24, fontWeight: '700', color: text, marginBottom: 4 }}>
            {client.fullName}
          </Text>
          <TouchableOpacity 
            style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}
            onPress={() => client.phone && require('react-native').Linking.openURL(`tel:${client.phone}`)}
          >
            <Phone size={14} color={primary} />
            <Text style={{ fontSize: 14, color: primary, fontWeight: '500' }}>
              {client.phone || t('clientDetail.noPhone')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Stats / Info */}
      <View style={{ flexDirection: 'row', gap: 12, marginTop: 20 }}>
        {client.address && (
          <View style={{ flex: 1, backgroundColor: card, padding: 12, borderRadius: 16, borderWidth: 1, borderColor: border }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 }}>
              <MapPin size={14} color={muted} />
              <Text style={{ fontSize: 12, color: muted, fontWeight: '500' }}>{t('clientDetail.address')}</Text>
            </View>
            <Text numberOfLines={2} style={{ fontSize: 13, color: text }}>{client.address}</Text>
          </View>
        )}
        {client.notes && (
          <View style={{ flex: 1, backgroundColor: card, padding: 12, borderRadius: 16, borderWidth: 1, borderColor: border }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 }}>
              <Notes size={14} color={muted} />
              <Text style={{ fontSize: 12, color: muted, fontWeight: '500' }}>{t('clientDetail.notes')}</Text>
            </View>
            <Text numberOfLines={2} style={{ fontSize: 13, color: text }}>{client.notes}</Text>
          </View>
        )}
      </View>

      {/* Balance Cards */}
      <View style={{ marginTop: 24, gap: 12 }}>
        <View style={{ 
          backgroundColor: primary, 
          padding: 20, 
          borderRadius: 24,
          shadowColor: primary,
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.2,
          shadowRadius: 12,
          elevation: 8
        }}>
          <Text style={{ color: primaryForeground + '99', fontSize: 14, fontWeight: '500', marginBottom: 4 }}>
            {t('clientDetail.balanceUzs')}
          </Text>
          <Text style={{ color: primaryForeground, fontSize: 32, fontWeight: '800' }}>
            {balanceUzs.toLocaleString()} UZS
          </Text>
        </View>

        <View style={{ 
          backgroundColor: card, 
          padding: 16, 
          borderRadius: 20, 
          borderWidth: 1, 
          borderColor: border,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <View>
            <Text style={{ color: muted, fontSize: 13, fontWeight: '500', marginBottom: 2 }}>{t('clientDetail.balanceUsd')}</Text>
            <Text style={{ color: text, fontSize: 18, fontWeight: '700' }}>
              {balanceUsd.toLocaleString()} USD
            </Text>
          </View>
          <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: primary + '10', alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ color: primary, fontWeight: '700' }}>$</Text>
          </View>
        </View>
      </View>

      <View style={{ marginTop: 32, marginBottom: 12 }}>
        <Text style={{ fontSize: 18, fontWeight: '700', color: text }}>{t('clientDetail.history')}</Text>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: bg }]}>
      {/* Navbar */}
      <View style={[styles.navbar, { paddingTop: insets.top, borderBottomColor: border, borderBottomWidth: 1 }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.navButton}>
          <ChevronLeft size={24} color={text} />
        </TouchableOpacity>
        <Text style={{ fontSize: 17, fontWeight: '600', color: text }}>{t('clientDetail.title')}</Text>
        <TouchableOpacity style={styles.navButton}>
          <MoreVertical size={20} color={text} />
        </TouchableOpacity>
      </View>

      <FlashList<ClientTransaction>
        data={transactions as ClientTransaction[]}
        keyExtractor={(item: any) => item.id}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}
        renderItem={({ item }: { item: ClientTransaction }) => {
          const isIncome = item.type === 'income'; // client pays us
          const Icon = isIncome ? ArrowDownLeft : ArrowUpRight;
          const iconColor = isIncome ? green : red;
          
          return (
            <View style={{
              paddingHorizontal: 20,
              paddingVertical: 12,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 12,
            }}>
              <View style={{ 
                width: 44, 
                height: 44, 
                borderRadius: 12, 
                backgroundColor: iconColor + '10', 
                alignItems: 'center', 
                justifyContent: 'center' 
              }}>
                <Icon size={20} color={iconColor} />
              </View>
              
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 15, fontWeight: '600', color: text, marginBottom: 2 }}>
                  {isIncome ? t('clientDetail.paymentReceived') : t('clientDetail.debtIssued')}
                </Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                  <Calendar size={12} color={muted} />
                  <Text style={{ fontSize: 12, color: muted }}>
                    {new Date(item.createdAt).toLocaleDateString('uz-UZ', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                  </Text>
                </View>
              </View>

              <View style={{ alignItems: 'flex-end' }}>
                <Text style={{ fontSize: 15, fontWeight: '700', color: iconColor }}>
                  {isIncome ? '+' : '-'}{item.amount.toLocaleString()} {item.currency}
                </Text>
                <Text style={{ fontSize: 11, color: muted }}>{item.paymentMethod || 'Naqd'}</Text>
              </View>
            </View>
          );
        }}
        ListEmptyComponent={() => (
          <View style={{ padding: 40, alignItems: 'center' }}>
            <Text style={{ color: muted }}>{t('clientDetail.noHistory')}</Text>
          </View>
        )}
      />

      {/* Action Buttons */}
      <View style={[styles.actions, { bottom: insets.bottom + 20 }]}>
        <TouchableOpacity 
          style={[styles.actionButton, { backgroundColor: red }]}
          onPress={() => {/* TODO: Issue debt */}}
        >
          <Minus size={20} color="#fff" />
          <Text style={{ color: '#fff', fontWeight: '600' }}>{t('clientDetail.giveDebt')}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.actionButton, { backgroundColor: green }]}
          onPress={() => {/* TODO: Record payment */}}
        >
          <Plus size={20} color="#fff" />
          <Text style={{ color: '#fff', fontWeight: '600' }}>{t('clientDetail.receivePayment')}</Text>
        </TouchableOpacity>
      </View>
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
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  }
});
