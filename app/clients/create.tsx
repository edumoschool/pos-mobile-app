import React, { useState } from 'react';
import { View, TouchableOpacity, ScrollView } from 'react-native';
import { Text } from '@/components/ui/text';
import { useColor } from '@/hooks/useColor';
import { router } from 'expo-router';
import { Header } from '@/components/ui/header';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { AvoidKeyboard } from '@/components/ui/avoid-keyboard';
import { useToast } from '@/components/ui/toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { clientsApi } from '@/api/partners';
import { getApiErrorMessage } from '@/api/client';
import { useTranslation } from 'react-i18next';
import * as Contacts from 'expo-contacts';
import { User, Phone, UserPlus } from 'lucide-react-native';

export default function CreateClientScreen() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { error: showError } = useToast();

  const [newClientName, setNewClientName] = useState('');
  const [newClientPhone, setNewClientPhone] = useState('');

  const bg = useColor('background');
  const card = useColor('card');
  const border = useColor('border');
  const text = useColor('text');
  const red = useColor('red');
  const primary = useColor('primary');
  const primaryForeground = useColor('primaryForeground');
  const muted = useColor('textMuted');

  const addClientMutation = useMutation({
    mutationFn: clientsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      router.navigate({ pathname: '/(tabs)/(home)', params: { tab: '0' } });
    },
    onError: (error: any) => {
      showError(t('common.error'), getApiErrorMessage(error));
    }
  });

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
        showError(t('common.error'), t('home.contactPermissionError'));
      }
    } catch (error) {
      console.log('Error picking contact:', error);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: bg }}>
      <Header title={t('home.addClient')} />
      <ScrollView contentContainerStyle={{ padding: 20, paddingTop: 10 }}>
        <View style={{ alignItems: 'center', marginBottom: 30 }}>
            <View style={{ 
                width: 80, 
                height: 80, 
                borderRadius: 40, 
                backgroundColor: primary + '15', 
                alignItems: 'center', 
                justifyContent: 'center',
                marginBottom: 12
            }}>
                <UserPlus size={40} color={primary} />
            </View>
            <Text style={{ fontSize: 24, fontWeight: '800', color: text }}>{t('home.addClient')}</Text>
            <Text style={{ fontSize: 14, color: muted, marginTop: 4 }}>{t('home.fillDetails')}</Text>
        </View>

        <View style={{ gap: 24 }}>
          <View>
            <Text style={{ fontSize: 14, fontWeight: '600', marginBottom: 8, color: text }}>
              {t('home.clientName')} <Text style={{ color: red }}>*</Text>
            </Text>
            <Input
              placeholder={t('home.placeholders.clientName')}
              value={newClientName}
              onChangeText={setNewClientName}
              variant="outline"
              containerStyle={{ height: 56, borderRadius: 16 }}
              icon={User}
            />
          </View>

          <View>
            <Text style={{ fontSize: 14, fontWeight: '600', marginBottom: 8, color: text }}>
              {t('home.clientPhone')} <Text style={{ color: red }}>*</Text>
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
                value={newClientPhone}
                onChangeText={setNewClientPhone}
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

          <Button
            onPress={handleAddClient}
            disabled={!newClientName || addClientMutation.isPending}
            loading={addClientMutation.isPending}
            style={{ marginTop: 12, height: 56, borderRadius: 16 }}
          >
            <Text style={{ color: primaryForeground, fontSize: 16, fontWeight: '700' }}>{t('home.addClient')}</Text>
          </Button>
        </View>
      </ScrollView>
      <AvoidKeyboard offset={20} />
    </View>
  );
}
