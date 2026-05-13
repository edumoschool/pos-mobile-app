import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView, Platform, ActivityIndicator, Image, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { router } from 'expo-router';
import { 
  ChevronLeft, 
  Image as ImageIcon, 
  ChevronDown,
  Upload
} from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';

import { Text } from '@/components/ui/text';
import { useColor } from '@/hooks/useColor';
import { productsApi } from '@/api/products';
import { categoriesApi } from '@/api/catalog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { AvoidKeyboard } from '@/components/ui/avoid-keyboard';

export default function AddProductScreen() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const queryClient = useQueryClient();

  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [costPrice, setCostPrice] = useState('');
  const [sellingPrice, setSellingPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [image, setImage] = useState<any>(null);

  const bg = useColor('background');
  const card = useColor('card');
  const border = useColor('border');
  const text = useColor('text');
  const muted = useColor('textMuted');
  const primary = useColor('primary');
  const primaryForeground = useColor('primaryForeground');
  const red = useColor('red');

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoriesApi.getAll(),
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => productsApi.create(data, image),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['inventory-report'] });
      router.back();
    },
    onError: (error) => {
      Alert.alert(t('common.error'), 'Could not create product');
    }
  });

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      const asset = result.assets[0];
      setImage({
        uri: asset.uri,
        name: asset.fileName || 'product.jpg',
        type: asset.mimeType || 'image/jpeg',
      });
    }
  };

  const handleSave = () => {
    if (!name || !sellingPrice) {
      Alert.alert(t('common.error'), 'Please fill in required fields');
      return;
    }

    createMutation.mutate({
      name,
      description: sku, // Using description for SKU in this demo
      categoryId: categoryId || undefined,
      costPrice: parseFloat(costPrice) || 0,
      sellingPrice: parseFloat(sellingPrice) || 0,
      quantity: parseInt(quantity) || 0,
      currency: 'USD',
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: bg }]}>
      {/* Navbar */}
      <View style={[styles.navbar, { paddingTop: insets.top, borderBottomColor: border, borderBottomWidth: 1 }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.navButton}>
          <ChevronLeft size={24} color={text} />
        </TouchableOpacity>
        <Text style={{ fontSize: 17, fontWeight: '700', color: text }}>{t('products.addProduct')}</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 100 }}>
        {/* Image Upload */}
        <Text style={styles.label}>{t('products.productImage')}</Text>
        <TouchableOpacity 
          style={[styles.imageUpload, { backgroundColor: card, borderColor: border }]}
          onPress={pickImage}
        >
          {image ? (
            <Image source={{ uri: image.uri }} style={styles.previewImage} />
          ) : (
            <View style={{ alignItems: 'center' }}>
              <View style={[styles.uploadIcon, { backgroundColor: primary + '10' }]}>
                <ImageIcon size={32} color={primary} />
              </View>
              <Text style={{ fontSize: 14, color: text, fontWeight: '600', marginTop: 12 }}>{t('products.uploadImage')}</Text>
              <Text style={{ fontSize: 12, color: muted, marginTop: 4 }}>PNG, JPG up to 5MB</Text>
            </View>
          )}
        </TouchableOpacity>

        {/* Form Fields */}
        <View style={{ gap: 20 }}>
          <View>
            <Text style={styles.label}>{t('products.productName')}</Text>
            <Input
              placeholder="Enter product name"
              value={name}
              onChangeText={setName}
            />
          </View>

          <View>
            <Text style={styles.label}>{t('products.sku')}</Text>
            <Input
              placeholder="Enter SKU"
              value={sku}
              onChangeText={setSku}
            />
          </View>

          <View>
            <Text style={styles.label}>{t('products.category')}</Text>
            <TouchableOpacity style={[styles.picker, { backgroundColor: card, borderColor: border }]}>
              <Text style={{ color: categoryId ? text : muted }}>
                {categoryId ? categories?.find(c => c.id === categoryId)?.name : 'Select category'}
              </Text>
              <ChevronDown size={18} color={muted} />
            </TouchableOpacity>
          </View>

          <View style={{ flexDirection: 'row', gap: 16 }}>
            <View style={{ flex: 1 }}>
              <Text style={styles.label}>{t('products.purchasePrice')}</Text>
              <Input
                placeholder="$ 0.00"
                value={costPrice}
                onChangeText={setCostPrice}
                keyboardType="numeric"
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.label}>{t('products.sellingPrice')}</Text>
              <Input
                placeholder="$ 0.00"
                value={sellingPrice}
                onChangeText={setSellingPrice}
                keyboardType="numeric"
              />
            </View>
          </View>

          <View>
            <Text style={styles.label}>{t('products.initialStock')}</Text>
            <Input
              placeholder="0"
              value={quantity}
              onChangeText={setQuantity}
              keyboardType="numeric"
            />
          </View>
        </View>

        <Button 
          style={{ marginTop: 40 }}
          onPress={handleSave}
          loading={createMutation.isPending}
        >
          {t('products.saveProduct')}
        </Button>
      </ScrollView>

      <AvoidKeyboard offset={20} />
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
  label: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 8,
    color: '#000',
  },
  imageUpload: {
    height: 180,
    borderRadius: 16,
    borderWidth: 1,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    overflow: 'hidden',
  },
  uploadIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  picker: {
    height: 52,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  }
});
