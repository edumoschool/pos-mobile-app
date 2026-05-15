import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Platform, StyleSheet, Keyboard, Alert, ScrollView, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text } from '@/components/ui/text';
import { useColor } from '@/hooks/useColor';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { AvoidKeyboard } from '@/components/ui/avoid-keyboard';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { suppliersApi } from '@/api/partners';
import { useTranslation } from 'react-i18next';
import * as Contacts from 'expo-contacts';
import { User, Phone, Edit3, Trash2, MapPin } from 'lucide-react-native';

export default function EditSupplierScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const queryClient = useQueryClient();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');

  const bg = useColor('background');
  const card = useColor('card');
  const border = useColor('border');
  const text = useColor('text');
  const red = useColor('red');
  const primary = useColor('primary');
  const primaryForeground = useColor('primaryForeground');
  const muted = useColor('textMuted');

  const { data: supplier, isLoading } = useQuery({
    queryKey: ['supplier', id],
    queryFn: () => suppliersApi.getById(id!),
    enabled: !!id,
  });

  useEffect(() => {
    if (supplier) {
      setName(supplier.name);
      setAddress(supplier.address || '');
      setNotes(supplier.notes || '');
      if (supplier.phone) {
        setPhone(supplier.phone.replace('+998', ''));
      }
    }
  }, [supplier]);

  const updateMutation = useMutation({
    mutationFn: (data: any) => suppliersApi.update(id!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
      queryClient.invalidateQueries({ queryKey: ['supplier', id] });
      queryClient.invalidateQueries({ queryKey: ['supplier-balance', id] });
      router.back();
    },
    onError: (error: any) => {
      Alert.alert(t('common.error'), error?.message || t('common.somethingWentWrong'));
    }
  });

  const deleteMutation = useMutation({
    mutationFn: () => suppliersApi.delete(id!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
      router.dismissAll();
      router.replace('/(tabs)/(home)' as any);
    },
    onError: (error: any) => {
      Alert.alert(t('common.error'), error?.message || t('common.somethingWentWrong'));
    }
  });

  const handleUpdate = () => {
    if (!name) return;
    updateMutation.mutate({
      name,
      phone: phone ? `+998${phone.replace(/\s/g, '')}` : undefined,
      address,
      notes
    });
  };

  const handleDelete = () => {
    Alert.alert(
      t('common.warning'),
      t('products.deleteConfirmation'), // Reusing product confirmation for now
      [
        { text: t('common.cancel'), style: 'cancel' },
        { text: t('common.delete'), style: 'destructive', onPress: () => deleteMutation.mutate() }
      ]
    );
  };

  const handlePickContact = async () => {
    try {
      const { status } = await Contacts.requestPermissionsAsync();
      if (status === 'granted') {
        const contact = await Contacts.presentContactPickerAsync();
        if (contact) {
          if (contact.name) setName(contact.name);
          if (contact.phoneNumbers && contact.phoneNumbers.length > 0) {
            let p = contact.phoneNumbers[0].number || '';
            let digits = p.replace(/\D/g, '');
            setPhone(digits.length >= 9 ? digits.slice(-9) : digits);
          }
        }
      }
    } catch (e) {
      console.log(e);
    }
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: bg, justifyContent: 'center' }}>
        <ActivityIndicator size="large" color={primary} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: bg }}>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: t('supplierDetail.edit'),
          headerStyle: { backgroundColor: bg },
          headerShadowVisible: false,
          headerRight: () => (
            <TouchableOpacity onPress={handleDelete} style={{ marginRight: 8 }}>
              <Trash2 size={22} color={red} />
            </TouchableOpacity>
          )
        }}
      />

      <ScrollView contentContainerStyle={{ padding: 20, paddingTop: 10 }}>
        <View style={{ gap: 24 }}>
          <View>
            <Text style={{ fontSize: 14, fontWeight: '600', marginBottom: 8, color: text }}>
              {t('home.supplierName')} <Text style={{ color: red }}>*</Text>
            </Text>
            <Input
              placeholder={t('supplierDetail.placeholders.name')}
              value={name}
              onChangeText={setName}
              variant="outline"
              containerStyle={{ height: 56, borderRadius: 16 }}
              icon={User}
            />
          </View>

          <View>
            <Text style={{ fontSize: 14, fontWeight: '600', marginBottom: 8, color: text }}>
              {t('home.supplierPhone')}
            </Text>
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: card,
              borderRadius: 16,
              borderWidth: 1,
              borderColor: border,
              height: 56
            }}>
              <View style={{ paddingHorizontal: 16, borderRightWidth: 1, borderColor: border, height: '100%', justifyContent: 'center' }}>
                <Text style={{ fontSize: 16, color: text, fontWeight: '600' }}>+998</Text>
              </View>
              <Input
                placeholder="00 000 00 00"
                value={phone}
                onChangeText={setPhone}
                containerStyle={{ flex: 1, borderWidth: 0, marginVertical: 0, backgroundColor: 'transparent' }}
                inputStyle={{ backgroundColor: 'transparent', height: 54, borderBottomWidth: 0, fontSize: 16 }}
                keyboardType="phone-pad"
                maxLength={9}
                rightComponent={
                  <TouchableOpacity onPress={handlePickContact} style={{ paddingRight: 16 }} hitSlop={10}>
                    <User size={20} color={primary} />
                  </TouchableOpacity>
                }
              />
            </View>
          </View>

          <View>
            <Text style={{ fontSize: 14, fontWeight: '600', marginBottom: 8, color: text }}>
              {t('clientDetail.address')}
            </Text>
            <Input
              placeholder={t('clientDetail.address')}
              value={address}
              onChangeText={setAddress}
              variant="outline"
              containerStyle={{ height: 56, borderRadius: 16 }}
              icon={MapPin}
            />
          </View>

          <View>
            <Text style={{ fontSize: 14, fontWeight: '600', marginBottom: 8, color: text }}>
              {t('clientDetail.notes')}
            </Text>
            <Input
              placeholder={t('clientDetail.notes')}
              value={notes}
              onChangeText={setNotes}
              variant="outline"
              containerStyle={{ height: 100, borderRadius: 16, alignItems: 'flex-start', paddingTop: 12 }}
              inputStyle={{ height: 80, textAlignVertical: 'top' }}
              multiline
            />
          </View>

          <Button
            onPress={handleUpdate}
            disabled={!name || updateMutation.isPending}
            loading={updateMutation.isPending}
            style={{ marginTop: 12, height: 56, borderRadius: 16 }}
          >
            <Text style={{ color: primaryForeground, fontSize: 16, fontWeight: '700' }}>{t('common.save')}</Text>
          </Button>
        </View>
      </ScrollView>
      <AvoidKeyboard offset={20} />
    </View>
  );
}
