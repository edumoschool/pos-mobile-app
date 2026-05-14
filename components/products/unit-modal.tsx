import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Modal, ActivityIndicator, Alert } from 'react-native';
import { Text } from '@/components/ui/text';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useColor } from '@/hooks/useColor';
import { X } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { unitsApi } from '@/api/catalog';

interface UnitModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UnitModal({ open, onOpenChange }: UnitModalProps) {
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const [shortName, setShortName] = useState('');
  
  const bg = useColor('background');
  const card = useColor('card');
  const border = useColor('border');
  const text = useColor('text');
  
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (data: { name: string; shortName: string }) => unitsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['units'] });
      setName('');
      setShortName('');
      onOpenChange(false);
    },
    onError: () => {
      Alert.alert(t('common.error'), t('units.errors.createFailed'));
    }
  });

  const handleSave = () => {
    if (!name.trim() || !shortName.trim()) return;
    createMutation.mutate({ name, shortName });
  };

  return (
    <Modal
      visible={open}
      transparent
      animationType="fade"
      onRequestClose={() => onOpenChange(false)}
    >
      <View style={styles.overlay}>
        <View style={[styles.content, { backgroundColor: card, borderColor: border }]}>
          <View style={styles.header}>
            <Text style={styles.title}>{t('units.addUnit')}</Text>
            <TouchableOpacity onPress={() => onOpenChange(false)} style={styles.closeBtn}>
              <X size={20} color={text} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.body}>
            <Text style={styles.label}>{t('units.name') || 'Unit Name'}</Text>
            <Input
              placeholder={t('units.placeholders.name')}
              value={name}
              onChangeText={setName}
              autoFocus
              containerStyle={{ marginBottom: 16 }}
            />
            
            <Text style={styles.label}>{t('units.shortName') || 'Short Name (e.g. kg)'}</Text>
            <Input
              placeholder={t('units.placeholders.shortName')}
              value={shortName}
              onChangeText={setShortName}
            />
          </View>
          
          <View style={styles.footer}>
            <Button 
              variant="outline" 
              size="sm"
              onPress={() => onOpenChange(false)}
            >
              {t('common.cancel')}
            </Button>
            <Button 
              size="sm"
              onPress={handleSave}
              loading={createMutation.isPending}
              disabled={!name.trim() || !shortName.trim()}
            >
              {t('common.save')}
            </Button>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  content: {
    width: '100%',
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeBtn: {
    padding: 4,
  },
  body: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  footer: {
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between',
  }
});
