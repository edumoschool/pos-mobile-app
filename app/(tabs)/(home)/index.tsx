import React, { useState, useRef, useEffect } from 'react';
import { View, TouchableOpacity, Platform, Image, StyleSheet, useColorScheme, Text as RNText } from 'react-native';
import { Marquee } from '@animatereactnative/marquee';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text } from '@/components/ui/text';
import { useColor } from '@/hooks/useColor';
import { useAuth } from '@/hooks/useAuth';
import {
  ShoppingBag,
  Calculator,
  Search,
  Filter,
  Menu,
  UserPlus,
  Bell,
  Layers,
  Package,
  User,
  Download,
  ArrowUpAZ,
  ArrowDownZA
} from 'lucide-react-native';
import SegmentedControl from '@expo/ui/community/segmented-control';
import { FlashList } from '@shopify/flash-list';
import { router, useLocalSearchParams } from 'expo-router';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { SearchBar } from '@/components/ui/searchbar';
import { BottomSheet, useBottomSheet } from '@/components/ui/bottom-sheet';
import { useInfiniteQuery, useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { clientsApi, suppliersApi } from '@/api/partners';
import { exchangeRatesApi } from '@/api/exchange-rates';
import { usersApi } from '@/api/users';
import { ActivityIndicator, Alert, Linking, RefreshControl } from 'react-native';
import { useTranslation } from 'react-i18next';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import { formatAmount } from '@/lib/utils';


export default function HomeScreen() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const listRef = useRef<any>(null);



  const [clientSortBy, setClientSortBy] = useState<'createdAt' | 'clientTransAmount' | 'alphabetic'>('alphabetic');
  const [clientOrder, setClientOrder] = useState<'asc' | 'desc'>('asc');
  const filterSheet = useBottomSheet();

  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const bg = useColor('background');
  const card = useColor('card');
  const border = useColor('border');
  const text = useColor('text');
  const muted = useColor('textMuted');
  const primary = useColor('primary');
  const primaryForeground = useColor('primaryForeground');
  const red = useColor('red');
  const green = useColor('green');

  const { data: exchangeRate } = useQuery({
    queryKey: ['exchange-rate-today'],
    queryFn: exchangeRatesApi.getToday,
    staleTime: 1000 * 60 * 60,
  });


  const segments = [t('home.segments.clients'), t('home.segments.suppliers'), t('home.segments.employees')];
  const { tab } = useLocalSearchParams<{ tab: string }>();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (tab === '1') {
      setSelectedIndex(1);
    } else if (tab === '0') {
      setSelectedIndex(0);
    } else if (tab === '2') {
      setSelectedIndex(2);
    }
  }, [tab]);

  const tenantName = user?.tenant?.name || t('home.defaultTenantName');

  const {
    data: clientsData,
    isLoading: isLoadingClients,
    fetchNextPage: fetchNextClients,
    hasNextPage: hasNextClients,
    isFetchingNextPage: isFetchingNextClients,
    refetch: refetchClients,
    isRefetching: isRefetchingClients
  } = useInfiniteQuery({
    queryKey: ['clients', searchQuery, clientSortBy, clientOrder],
    queryFn: ({ pageParam = 1 }) => clientsApi.getAll({
      page: pageParam,
      limit: 20,
      search: searchQuery || undefined,
      sortBy: clientSortBy,
      order: clientOrder
    }),
    getNextPageParam: (lastPage) => lastPage.meta.page < lastPage.meta.totalPages ? lastPage.meta.page + 1 : undefined,
    initialPageParam: 1,
  });
  const {
    data: suppliersData,
    isLoading: isLoadingSuppliers,
    fetchNextPage: fetchNextSuppliers,
    hasNextPage: hasNextSuppliers,
    isFetchingNextPage: isFetchingNextSuppliers,
    refetch: refetchSuppliers,
    isRefetching: isRefetchingSuppliers
  } = useInfiniteQuery({
    queryKey: ['suppliers', searchQuery],
    queryFn: ({ pageParam = 1 }) => suppliersApi.getAll({ page: pageParam, limit: 20, search: searchQuery || undefined }),
    getNextPageParam: (lastPage) => lastPage.meta.page < lastPage.meta.totalPages ? lastPage.meta.page + 1 : undefined,
    initialPageParam: 1,
  });

  const {
    data: usersQueryData,
    isLoading: isLoadingUsers,
    fetchNextPage: fetchNextUsers,
    hasNextPage: hasNextUsers,
    isFetchingNextPage: isFetchingNextUsers,
    refetch: refetchUsers,
    isRefetching: isRefetchingUsers
  } = useInfiniteQuery({
    queryKey: ['users', searchQuery],
    queryFn: ({ pageParam = 1 }) => usersApi.getAll({ page: pageParam, limit: 20, search: searchQuery || undefined }),
    getNextPageParam: (lastPage) => lastPage.meta.page < lastPage.meta.totalPages ? lastPage.meta.page + 1 : undefined,
    initialPageParam: 1,
  });

  const clients = clientsData?.pages.flatMap(page => page.data) || [];
  const suppliers = suppliersData?.pages.flatMap(page => page.data) || [];
  const usersData = usersQueryData?.pages.flatMap(page => page.data) || [];

  const isRefreshing = 
    selectedIndex === 0 ? isRefetchingClients :
    selectedIndex === 1 ? isRefetchingSuppliers :
    isRefetchingUsers;

  const handleRefresh = async () => {
    if (selectedIndex === 0) await refetchClients();
    else if (selectedIndex === 1) await refetchSuppliers();
    else if (selectedIndex === 2) await refetchUsers();
  };

  useEffect(() => {
    listRef.current?.scrollToOffset({ offset: 0, animated: true });
  }, [clientSortBy, clientOrder, selectedIndex, searchQuery]);

  const getActiveData = () => {
    switch (selectedIndex) {
      case 0:
        return clients.map(c => ({ 
          id: c.id, 
          name: c.fullName, 
          phone: c.phone || t('products.na'), 
          subtext: c.notes || t('home.roles.client'), 
          balance: `${formatAmount(c.totalAmount || 0)} UZS`,
          isNegative: (c.totalAmount || 0) < 0,
          avatarUrl: (c as any).avatarUrl 
        }));
      case 1:
        return suppliers.map(s => ({ 
          id: s.id, 
          name: s.name, 
          phone: s.phone || t('products.na'), 
          subtext: s.notes || t('home.roles.supplier'), 
          balance: `${formatAmount(s.totalAmount || 0)} UZS`,
          isNegative: (s.totalAmount || 0) < 0,
          avatarUrl: (s as any).avatarUrl 
        }));
      case 2:
        return usersData.map(u => ({ 
          id: u.id, 
          name: u.fullName, 
          phone: u.phone, 
          subtext: u.role, 
          balance: '0 UZS', 
          isNegative: false,
          avatarUrl: (u as any).avatarUrl 
        }));
      default:
        return [];
    }
  };



  const downloadExcelMutation = useMutation({
    mutationFn: async () => {
      let response;
      if (selectedIndex === 0) {
        response = await clientsApi.exportExcel();
      } else if (selectedIndex === 1) {
        response = await suppliersApi.exportExcel();
      } else {
        throw new Error(t('home.exportNotSupported'));
      }

      if (!response?.url) throw new Error(t('common.exportError'));

      const filename = response.url.split('/').pop() || 'export.xlsx';
      const fileUri = `${FileSystem.cacheDirectory}${filename}`;

      const downloadResumable = FileSystem.createDownloadResumable(
        response.url,
        fileUri,
        {}
      );

      const downloadResult = await downloadResumable.downloadAsync();
      if (!downloadResult) throw new Error(t('common.exportError'));

      return downloadResult.uri;
    },
    onSuccess: async (uri) => {
      const isSharingAvailable = await Sharing.isAvailableAsync();
      if (isSharingAvailable) {
        await Sharing.shareAsync(uri, {
          mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          dialogTitle: t('home.exportTitle') || 'Export Data',
          UTI: 'com.microsoft.excel.xlsx'
        });
      } else {
        // Fallback for web or platforms where sharing is not available
        Linking.openURL(uri);
      }
    },
    onError: (error: any) => {
      console.error('Export error:', error);
      Alert.alert(t('common.error'), t('common.exportError'));
    }
  });

  const handleDownloadExcel = () => {
    downloadExcelMutation.mutate();
  };





  const activeData = getActiveData();
  const isLoading = isLoadingClients || isLoadingSuppliers || isLoadingUsers;

  // filtering is now done server-side

  return (
    <View style={{ flex: 1, backgroundColor: bg, paddingTop: Platform.OS === 'ios' ? insets.top : insets.top }}>

      {/* ── Topbar ────────────────────────────────────────────── */}
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingBottom: 16,
        gap: 12
      }}>

        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Text
            numberOfLines={1}
            style={{ fontSize: 22, fontWeight: '800', flexShrink: 1 }}
          >
            {tenantName}
          </Text>
        </View>

        <View style={{ flexDirection: 'row', gap: 8 }}>
          <TouchableOpacity
            onPress={() => router.push('/products' as any)}
            style={[styles.iconButton, { backgroundColor: card, borderColor: border, borderWidth: 1 }]}
          >
            <ShoppingBag size={20} color={text} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.iconButton, { backgroundColor: card, borderColor: border, borderWidth: 1 }]}
          >
            <Package size={20} color={text} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => router.push('/calculator')}
            style={[styles.iconButton, { backgroundColor: card, borderColor: border, borderWidth: 1 }]}
          >
            <Calculator size={20} color={text} />
          </TouchableOpacity>
        </View>
      </View>

      {/* ── USD Rate Marquee ──────────────────────────────────── */}
      {exchangeRate && (
        <Marquee spacing={48} speed={0.6} style={{ marginBottom: 8 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            {[
              { currency: 'UZS' },
              { currency: "so'm" },
              { currency: 'сум' },
            ].map(({ currency }, i) => (
              <View key={i} style={{ flexDirection: 'row', alignItems: 'center', paddingRight: 48 }}>
                <RNText style={{ fontSize: 13, color: muted }}>🇺🇸 1 USD = </RNText>
                <RNText style={{ fontSize: 13, color: text, fontWeight: '700' }}>
                  {formatAmount(exchangeRate.usdToUzs)}
                </RNText>
                <RNText style={{ fontSize: 13, color: muted }}> {currency} 🇺🇿</RNText>
              </View>
            ))}
          </View>
        </Marquee>
      )}

      {/* ── Segments ──────────────────────────────────────────── */}
      <View style={{ paddingHorizontal: 2, paddingBottom: 16, marginHorizontal: 2 }}>
        <SegmentedControl
          values={segments}
          selectedIndex={selectedIndex}
          onChange={(event) => {
            setSelectedIndex(event.nativeEvent.selectedSegmentIndex);
          }}
          tintColor="#1b0d44ff"
          appearance={isDark ? 'dark' : 'light'}
          style={{ height: 40, }}
        />
      </View>

      {/* ── Search & Filter ───────────────────────────────────── */}
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingBottom: 20,
        gap: 12
      }}>
        {/* Search Bar */}
        <View style={{ flex: 1 }}>
          <SearchBar
            placeholder={t('home.searchPlaceholder')}
            value={searchQuery}
            onChangeText={setSearchQuery}
            onClear={() => setSearchQuery('')}
            containerStyle={{ height: 40, borderRadius: 20 }}
            showClearButton={true}
          />
        </View>

        {/* Filter & Sort Buttons */}
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <TouchableOpacity
            onPress={filterSheet.open}
            style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              backgroundColor: clientSortBy !== 'alphabetic' ? primary : card,
              alignItems: 'center',
              justifyContent: 'center',
              borderColor: clientSortBy !== 'alphabetic' ? primary : border + '80',
              borderWidth: 1,
            }}
          >
            <Filter size={20} color={clientSortBy !== 'alphabetic' ? primaryForeground : primary} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setClientOrder(clientOrder === 'asc' ? 'desc' : 'asc')}
            style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              backgroundColor: clientOrder !== 'asc' ? primary : card,
              alignItems: 'center',
              justifyContent: 'center',
              borderColor: clientOrder !== 'asc' ? primary : border + '80',
              borderWidth: 1,
            }}
          >
            {clientOrder === 'asc' ? (
              <ArrowUpAZ size={20} color={primary} />
            ) : (
              <ArrowDownZA size={20} color={primaryForeground} />
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* ── List ──────────────────────────────────────────────── */}
      <View style={{ flex: 1 }}>
        {isLoading ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color={primary} />
          </View>
        ) : (
          <FlashList
            ref={listRef}
            data={activeData}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: insets.bottom + 100 }}
            onEndReached={() => {
              if (selectedIndex === 0 && hasNextClients) fetchNextClients();
              if (selectedIndex === 1 && hasNextSuppliers) fetchNextSuppliers();
              if (selectedIndex === 2 && hasNextUsers) fetchNextUsers();
            }}
            onEndReachedThreshold={0.5}
            refreshControl={
              <RefreshControl 
                refreshing={isRefreshing} 
                onRefresh={handleRefresh} 
                tintColor={primary}
                colors={[primary]}
              />
            }
            ListFooterComponent={() => {
              const isFetchingNext = (selectedIndex === 0 && isFetchingNextClients) ||
                (selectedIndex === 1 && isFetchingNextSuppliers) ||
                (selectedIndex === 2 && isFetchingNextUsers);
              if (!isFetchingNext) return null;
              return <ActivityIndicator size="small" color={primary} style={{ marginVertical: 16 }} />;
            }}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => {
                  if (selectedIndex === 0) {
                    router.push(`/clients/${item.id}` as any);
                  } else if (selectedIndex === 1) {
                    router.push(`/suppliers/${item.id}` as any);
                  }
                }}
                style={{
                  backgroundColor: card,
                  padding: 12,
                  borderRadius: 12,
                  marginBottom: 8,
                  flexDirection: 'row',
                  alignItems: 'center',
                }}
              >
                {/* Left Icon (Avatar) */}
                <Avatar size={40} style={{ marginRight: 12 }}>
                  {item.avatarUrl && <AvatarImage source={{ uri: item.avatarUrl }} style={{ width: '100%', height: '100%' }} />}
                  <AvatarFallback
                    style={{ backgroundColor: primary }}
                    textStyle={{ color: primaryForeground, fontSize: 14, fontWeight: '700' }}
                  >
                    {item.name ? item.name.substring(0, 2).toUpperCase() : '??'}
                  </AvatarFallback>
                </Avatar>

                {/* Center Info */}
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 15, fontWeight: '600', color: text, marginBottom: 2 }}>{item.name}</Text>
                  <Text style={{ fontSize: 12, color: muted }}>{item.phone}</Text>
                </View>

                {/* Right Info */}
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={{
                    fontSize: 14,
                    fontWeight: '800',
                    color: item.isNegative ? red : green,
                    marginBottom: 2
                  }}>
                    {item.balance}
                  </Text>
                  <Text style={{ fontSize: 11, color: muted }}>{item.subtext}</Text>
                </View>
              </TouchableOpacity>
            )}
            ListEmptyComponent={() => (
              <View style={{ padding: 40, alignItems: 'center', marginTop: 20 }}>
                <Image
                  source={require('@/assets/icons/empty.png')}
                  style={{ width: 150, height: 150, marginBottom: 16, opacity: 0.9 }}
                  resizeMode="contain"
                />
                <Text style={{ color: muted, fontSize: 16, fontWeight: '500' }}>{t('home.noResults')}</Text>
              </View>
            )}
          />
        )}
      </View>

      {/* ── Floating Action Buttons ───────────────────────────── */}
      <View style={{
        position: 'absolute',
        bottom: insets.bottom + 20,
        right: 20,
        flexDirection: 'column',
        alignItems: 'flex-end',
        gap: 12,
        pointerEvents: 'box-none'
      }}>
        {(selectedIndex === 0 || selectedIndex === 1) && (
          <TouchableOpacity
            onPress={handleDownloadExcel}
            style={[styles.fab, { backgroundColor: primary, shadowColor: primary }]}
          >
            {downloadExcelMutation.isPending ? (
              <ActivityIndicator size="small" color={primaryForeground} />
            ) : (
              <Download size={20} color={primaryForeground} />
            )}
          </TouchableOpacity>
        )}
        {selectedIndex !== 2 && (
          <TouchableOpacity 
            onPress={() => router.push(selectedIndex === 0 ? '/clients/create' : '/suppliers/create')} 
            style={[styles.fab, { backgroundColor: primary, shadowColor: primary }]}
          >
            <UserPlus size={20} color={primaryForeground} />
          </TouchableOpacity>
        )}
      </View>

      {/* ── Filter Bottom Sheet ──────────────────────────────── */}
      <BottomSheet
        isVisible={filterSheet.isVisible}
        onClose={filterSheet.close}
        title={t('home.sortBy')}
        snapPoints={[0.35]}
        disablePanGesture
      >
        {[
          { label: t('home.sortOptions.alphabetic'), value: 'alphabetic' },
          { label: t('home.sortOptions.createdAt'), value: 'createdAt' },
          { label: t('home.sortOptions.balance'), value: 'clientTransAmount' },
        ].map((opt) => {
          const isSelected = clientSortBy === opt.value;
          return (
            <TouchableOpacity
              key={opt.value}
              onPress={() => {
                setClientSortBy(opt.value as any);
                filterSheet.close();
              }}
              style={{
                paddingVertical: 14,
                paddingHorizontal: 16,
                borderRadius: 12,
                backgroundColor: isSelected ? primary : 'transparent',
                marginBottom: 4,
                alignItems: 'center',
              }}
            >
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: isSelected ? '600' : '400',
                  color: isSelected ? primaryForeground : text,
                }}
              >
                {opt.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </BottomSheet>

    </View>
  );
}

const styles = StyleSheet.create({
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fab: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  }
});
