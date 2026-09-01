import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { Text } from '@/components/ui/text';
import { useColor } from '@/hooks/useColor';
import { router, useLocalSearchParams } from 'expo-router';
import { Header } from '@/components/ui/header';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { AvoidKeyboard } from '@/components/ui/avoid-keyboard';
import { AlertDialog, useAlertDialog } from '@/components/ui/alert-dialog';
import { useToast } from '@/components/ui/toast';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { clientsApi } from '@/api/partners';
import { getApiErrorMessage } from '@/api/client';
import { useTranslation } from 'react-i18next';
import * as Contacts from 'expo-contacts';
import { User, MapPin } from 'lucide-react-native';

export default function EditClientScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { error: showError } = useToast();
  const deleteDialog = useAlertDialog();

  const [fullName, setFullName] = useState('');
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

  const { data: client, isLoading } = useQuery({
    queryKey: ['client', id],
    queryFn: () => clientsApi.getById(id!),
    enabled: !!id,
  });

  useEffect(() => {
    if (client) {
      setFullName(client.fullName);
      setAddress(client.address || '');
      setNotes(client.notes || '');
      if (client.phone) {
        setPhone(client.phone.replace('+998', ''));
      }
    }
  }, [client]);

  const updateMutation = useMutation({
    mutationFn: (data: any) => clientsApi.update(id!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      queryClient.invalidateQueries({ queryKey: ['client', id] });
      queryClient.invalidateQueries({ queryKey: ['client-balance', id] });
      router.back();
    },
    onError: (error: any) => {
      showError(t('common.error'), getApiErrorMessage(error));
    }
  });

  const deleteMutation = useMutation({
    mutationFn: () => clientsApi.delete(id!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      router.dismissAll();
      router.replace('/(tabs)/(home)' as any);
    },
    onError: (error: any) => {
      deleteDialog.close();
      showError(t('common.error'), getApiErrorMessage(error));
    }
  });

  const handleUpdate = () => {
    if (!fullName) return;
    updateMutation.mutate({
      fullName,
      phone: phone ? `+998${phone.replace(/\s/g, '')}` : undefined,
      address,
      notes
    });
  };

  const handleDelete = () => {
    deleteDialog.open();
  };

  const handlePickContact = async () => {
    try {
      const { status } = await Contacts.requestPermissionsAsync();
      if (status === 'granted') {
        const contact = await Contacts.presentContactPickerAsync();
        if (contact) {
          if (contact.name) setFullName(contact.name);
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
      <Header
        title={t('common.save')}
      />
      <ScrollView contentContainerStyle={{ padding: 20, paddingTop: 10 }}>
        <View style={{ gap: 24 }}>
          <View>
            <Text style={{ fontSize: 14, fontWeight: '600', marginBottom: 8, color: text }}>
              {t('home.clientName')} <Text style={{ color: red }}>*</Text>
            </Text>
            <Input
              placeholder={t('home.placeholders.clientName')}
              value={fullName}
              onChangeText={setFullName}
              variant="outline"
              containerStyle={{ height: 56, borderRadius: 16 }}
              icon={User}
            />
          </View>

          <View>
            <Text style={{ fontSize: 14, fontWeight: '600', marginBottom: 8, color: text }}>
              {t('home.clientPhone')}
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
            disabled={!fullName || updateMutation.isPending}
            loading={updateMutation.isPending}
            style={{ marginTop: 12, height: 56, borderRadius: 16 }}
          >
            <Text style={{ color: primaryForeground, fontSize: 16, fontWeight: '700' }}>{t('common.save')}</Text>
          </Button>
        </View>
      </ScrollView>

      <AlertDialog
        isVisible={deleteDialog.isVisible}
        onClose={deleteDialog.close}
        title={t('common.warning')}
        description={t('products.deleteConfirmation')}
        confirmText={t('common.delete')}
        cancelText={t('common.cancel')}
        onConfirm={() => deleteMutation.mutate()}
      />

      <AvoidKeyboard offset={20} />
    </View>
  );
}
