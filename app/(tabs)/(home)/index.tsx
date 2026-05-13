import React, { useState } from 'react';
import { View, TouchableOpacity, Platform, Image, StyleSheet } from 'react-native';
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
  Download
} from 'lucide-react-native';
import SegmentedControl from '@expo/ui/community/segmented-control';
import { FlashList } from '@shopify/flash-list';
import { router } from 'expo-router';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { SearchBar } from '@/components/ui/searchbar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { BottomSheet, useBottomSheet } from '@/components/ui/bottom-sheet';
import { AvoidKeyboard } from '@/components/ui/avoid-keyboard';
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { clientsApi, suppliersApi } from '@/api/partners';
import { usersApi } from '@/api/users';
import { ActivityIndicator, Keyboard, Alert, Linking } from 'react-native';
import { useTranslation } from 'react-i18next';
import * as Contacts from 'expo-contacts';


export default function HomeScreen() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { isVisible: isAddClientOpen, open: openAddClient, close: closeAddClient } = useBottomSheet();
  const [newClientName, setNewClientName] = useState('');
  const [newClientPhone, setNewClientPhone] = useState('');

  const bg = useColor('background');
  const card = useColor('card');
  const border = useColor('border');
  const text = useColor('text');
  const muted = useColor('textMuted');
  const primary = useColor('primary');
  const primaryForeground = useColor('primaryForeground');
  const red = useColor('red');
  const green = useColor('green');

  const segments = [t('home.segments.clients'), t('home.segments.suppliers'), t('home.segments.employees')];
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  const tenantName = user?.tenant?.name || 'Mening biznesimu...';

  const {
    data: clientsData,
    isLoading: isLoadingClients,
    fetchNextPage: fetchNextClients,
    hasNextPage: hasNextClients,
    isFetchingNextPage: isFetchingNextClients
  } = useInfiniteQuery({
    queryKey: ['clients', searchQuery],
    queryFn: ({ pageParam = 1 }) => clientsApi.getAll({ page: pageParam, limit: 20, search: searchQuery || undefined, sortBy: 'alphabetic', order: 'asc' }),
    getNextPageParam: (lastPage) => lastPage.meta.page < lastPage.meta.totalPages ? lastPage.meta.page + 1 : undefined,
    initialPageParam: 1,
  });

  const {
    data: suppliersData,
    isLoading: isLoadingSuppliers,
    fetchNextPage: fetchNextSuppliers,
    hasNextPage: hasNextSuppliers,
    isFetchingNextPage: isFetchingNextSuppliers
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
    isFetchingNextPage: isFetchingNextUsers
  } = useInfiniteQuery({
    queryKey: ['users', searchQuery],
    queryFn: ({ pageParam = 1 }) => usersApi.getAll({ page: pageParam, limit: 20, search: searchQuery || undefined }),
    getNextPageParam: (lastPage) => lastPage.meta.page < lastPage.meta.totalPages ? lastPage.meta.page + 1 : undefined,
    initialPageParam: 1,
  });

  const clients = clientsData?.pages.flatMap(page => page.data) || [];
  const suppliers = suppliersData?.pages.flatMap(page => page.data) || [];
  const usersData = usersQueryData?.pages.flatMap(page => page.data) || [];

  const getActiveData = () => {
    switch (selectedIndex) {
      case 0:
        return clients.map(c => ({ id: c.id, name: c.fullName, phone: c.phone || 'N/A', subtext: c.notes || t('home.roles.client'), balance: '0 UZS', avatarUrl: (c as any).avatarUrl }));
      case 1:
        return suppliers.map(s => ({ id: s.id, name: s.name, phone: s.phone || 'N/A', subtext: s.notes || t('home.roles.supplier'), balance: '0 UZS', avatarUrl: (s as any).avatarUrl }));
      case 2:
        return usersData.map(u => ({ id: u.id, name: u.fullName, phone: u.phone, subtext: u.role, balance: '0 UZS', avatarUrl: (u as any).avatarUrl }));
      default:
        return [];
    }
  };

  const addClientMutation = useMutation({
    mutationFn: clientsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      setNewClientName('');
      setNewClientPhone('');
      closeAddClient();
      Keyboard.dismiss();
    }
  });

  const downloadExcelMutation = useMutation({
    mutationFn: async () => {
      if (selectedIndex === 0) {
        return clientsApi.exportExcel();
      } else if (selectedIndex === 1) {
        return suppliersApi.exportExcel();
      }
      throw new Error("Export not supported for this tab");
    },
    onSuccess: (data) => {
      if (data?.url) {
        Linking.openURL(data.url);
      }
    },
    onError: () => {
      Alert.alert(t('common.error'), "Eksport qilishda xatolik yuz berdi");
    }
  });

  const handleDownloadExcel = () => {
    downloadExcelMutation.mutate();
  };

  const handleAddClient = () => {
    if (!newClientName) return;
    addClientMutation.mutate({
      fullName: newClientName,
      phone: newClientPhone ? `+998${newClientPhone.replace(/\s/g, '')}` : undefined
    });
  };

  const handlePickContact = async () => {
    try {
      const { status } = await Contacts.requestPermissionsAsync();
      if (status === 'granted') {
        const contact = await Contacts.presentContactPickerAsync();
        if (contact) {
          if (contact.name) {
            setNewClientName(contact.name);
          }
          if (contact.phoneNumbers && contact.phoneNumbers.length > 0) {
            let phone = contact.phoneNumbers[0].number || '';
            let digits = phone.replace(/\D/g, '');
            if (digits.length >= 9) {
              setNewClientPhone(digits.slice(-9));
            } else {
              setNewClientPhone(digits);
            }
          }
        }
      } else {
        Alert.alert(t('common.error'), "Kontaktlarga ruxsat berilmagan");
      }
    } catch (error) {
      console.log('Error picking contact:', error);
    }
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

      {/* ── Segments ──────────────────────────────────────────── */}
      <View style={{ paddingHorizontal: 2, paddingBottom: 16, marginHorizontal: 2 }}>
        <SegmentedControl
          values={segments}
          selectedIndex={selectedIndex}
          onChange={(event) => {
            setSelectedIndex(event.nativeEvent.selectedSegmentIndex);
          }}
          tintColor="#1b0d44ff"
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
            containerStyle={{ borderRadius: 22 }}
            showClearButton={true}
          />
        </View>

        {/* Filter Button */}
        <TouchableOpacity
          style={{
            width: 48,
            height: 48,
            borderRadius: 16,
            backgroundColor: card,
            alignItems: 'center',
            justifyContent: 'center',
            borderColor: border + '80'
          }}
        >
          <Filter size={22} color={primary} />
        </TouchableOpacity>
      </View>

      {/* ── List ──────────────────────────────────────────────── */}
      <View style={{ flex: 1 }}>
        {isLoading ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color={primary} />
          </View>
        ) : (
          <FlashList
            data={activeData}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: insets.bottom + 100 }}
            onEndReached={() => {
              if (selectedIndex === 0 && hasNextClients) fetchNextClients();
              if (selectedIndex === 1 && hasNextSuppliers) fetchNextSuppliers();
              if (selectedIndex === 2 && hasNextUsers) fetchNextUsers();
            }}
            onEndReachedThreshold={0.5}
            ListFooterComponent={() => {
              const isFetchingNext = (selectedIndex === 0 && isFetchingNextClients) ||
                (selectedIndex === 1 && isFetchingNextSuppliers) ||
                (selectedIndex === 2 && isFetchingNextUsers);
              if (!isFetchingNext) return null;
              return <ActivityIndicator size="small" color={primary} style={{ marginVertical: 16 }} />;
            }}
            renderItem={({ item }) => (
              <View style={{
                backgroundColor: card,
                padding: 12,
                borderRadius: 12,
                marginBottom: 8,
                flexDirection: 'row',
                alignItems: 'center',
              }}>
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
                    fontWeight: '600',
                    color: item.balance.startsWith('-') ? red : green,
                    marginBottom: 2
                  }}>
                    {item.balance}
                  </Text>
                  <Text style={{ fontSize: 11, color: muted }}>{item.subtext}</Text>
                </View>
              </View>
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
        <TouchableOpacity onPress={openAddClient} style={[styles.fab, { backgroundColor: primary, shadowColor: primary }]}>
          <UserPlus size={20} color={primaryForeground} />
        </TouchableOpacity>
      </View>

      {/* ── Add Client Bottom Sheet ───────────────────────────── */}
      <BottomSheet
        isVisible={isAddClientOpen}
        onClose={closeAddClient}
        title="Mijoz qo'shish"
        snapPoints={[0.45]}
      >
        <View style={{ gap: 20 }}>
          <View>
            <Text style={{ fontSize: 14, fontWeight: '600', marginBottom: 8, color: text }}>
              Ism <Text style={{ color: red }}>*</Text>
            </Text>
            <Input
              placeholder="Mijozni ismini kiriting"
              value={newClientName}
              onChangeText={setNewClientName}
              variant="outline"
            />
          </View>

          <View>
            <Text style={{ fontSize: 14, fontWeight: '600', marginBottom: 8, color: text }}>
              Telefon <Text style={{ color: red }}>*</Text>
            </Text>
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: card,
              borderRadius: 12,
              borderWidth: 1,
              borderColor: border,
              height: 52
            }}>
              <View style={{ paddingHorizontal: 16, borderRightWidth: 1, borderColor: border, height: '100%', justifyContent: 'center' }}>
                <Text style={{ fontSize: 16, color: text }}>+998</Text>
              </View>
              <Input
                placeholder="00 000 00 00"
                value={newClientPhone}
                onChangeText={setNewClientPhone}
                containerStyle={{ flex: 1, borderWidth: 0, marginVertical: 0, backgroundColor: 'transparent' }}
                inputStyle={{ backgroundColor: 'transparent', height: 50, borderBottomWidth: 0 }}
                keyboardType="phone-pad"
                maxLength={9}
                rightComponent={
                  <TouchableOpacity onPress={handlePickContact} style={{ paddingRight: 12 }} hitSlop={10}>
                    <User size={20} color={primary} />
                  </TouchableOpacity>
                }
              />
            </View>
          </View>

          <Button
            onPress={handleAddClient}
            disabled={!newClientName || addClientMutation.isPending}
            loading={addClientMutation.isPending}
            style={{ marginTop: 12 }}
          >
            Mijoz qo'shish
          </Button>
        </View>
        <AvoidKeyboard offset={20} />
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
