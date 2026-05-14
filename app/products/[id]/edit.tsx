import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView, Platform, ActivityIndicator, Image, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { 
  ImageIcon, 
  X,
  Plus
} from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';

import { Text } from '@/components/ui/text';
import { useColor } from '@/hooks/useColor';
import { productsApi } from '@/api/products';
import { categoriesApi, brandCategoriesApi, unitsApi } from '@/api/catalog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { AvoidKeyboard } from '@/components/ui/avoid-keyboard';
import { CategoryModal } from '@/components/products/category-modal';
import { BrandCategoryModal } from '@/components/products/brand-category-modal';
import { UnitModal } from '@/components/products/unit-modal';
import { Switch } from '@/components/ui/switch';
import { Picker } from '@react-native-picker/picker';

function NativePicker({ 
  value, 
  onValueChange, 
  options, 
  placeholder 
}: { 
  value: string; 
  onValueChange: (val: string) => void; 
  options: { label: string, value: string }[];
  placeholder: string;
}) {
  const text = useColor('text');

  return (
    <Picker
      selectedValue={value || ''}
      onValueChange={(itemValue) => onValueChange(itemValue)}
      style={{ color: text, width: '100%', height: '100%' }}
      itemStyle={{ fontSize: 14 }}
      dropdownIconColor={text}
      mode="dropdown"
    >
      <Picker.Item label={placeholder} value="" />
      {options.map((opt) => (
        <Picker.Item key={opt.value} label={opt.label} value={opt.value} />
      ))}
    </Picker>
  );
}

export default function EditProductScreen() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const queryClient = useQueryClient();
  const { id } = useLocalSearchParams<{ id: string }>();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [brandCategoryId, setBrandCategoryId] = useState('');
  const [unitId, setUnitId] = useState('');
  const [costPrice, setCostPrice] = useState('');
  const [sellingPrice, setSellingPrice] = useState('');
  const [currency, setCurrency] = useState<'UZS' | 'USD'>('UZS');
  const [quantity, setQuantity] = useState('');
  const [minQuantity, setMinQuantity] = useState('');
  const [isActive, setIsActive] = useState(true);
  
  const [existingImageUrl, setExistingImageUrl] = useState<string | null>(null);
  const [newImage, setNewImage] = useState<any>(null);
  const [removeExistingImage, setRemoveExistingImage] = useState(false);

  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isBrandCategoryModalOpen, setIsBrandCategoryModalOpen] = useState(false);
  const [isUnitModalOpen, setIsUnitModalOpen] = useState(false);

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

  const { data: brandCategories } = useQuery({
    queryKey: ['brandCategories'],
    queryFn: () => brandCategoriesApi.getAll(),
  });

  const { data: units } = useQuery({
    queryKey: ['units'],
    queryFn: () => unitsApi.getAll(),
  });

  const { data: product, isLoading: isFetchingProduct } = useQuery({
    queryKey: ['product', id],
    queryFn: () => productsApi.getById(id!),
    enabled: !!id,
  });

  console.log(product)

  useEffect(() => {
    if (product) {
      setName(product.name || '');
      setDescription(product.description || '');
      setCategoryId(product.categoryId || '');
      setBrandCategoryId(product.brandCategoryId || '');
      setUnitId(product.unitId || '');
      setCostPrice(product.costPrice?.toString() || '');
      setSellingPrice(product.sellingPrice?.toString() || '');
      setCurrency(product.currency as 'UZS' | 'USD' || 'UZS');
      setIsActive(product.isActive ?? true);
      
      const inv = product.inventory?.[0];
      if (inv) {
        setQuantity(inv.quantity?.toString() || '0');
        if (inv.minQuantity !== undefined && inv.minQuantity !== null) {
          setMinQuantity(inv.minQuantity?.toString() || '0');
        } else {
          setMinQuantity('0');
        }
      }
      
      if (product.imageUrl) {
        setExistingImageUrl(product.imageUrl);
      }
    }
  }, [product]);

  const updateMutation = useMutation({
    mutationFn: async (payload: any) => {
      // 1. Update text data
      const updatedProduct = await productsApi.update(id!, {
        name: payload.name,
        description: payload.description,
        categoryId: payload.categoryId,
        brandCategoryId: payload.brandCategoryId,
        unitId: payload.unitId,
        costPrice: payload.costPrice,
        sellingPrice: payload.sellingPrice,
        currency: payload.currency,
        quantity: payload.quantity,
        minQuantity: payload.minQuantity,
        isActive: payload.isActive,
      });

      // 2. Handle image changes
      if (payload.removeExistingImage) {
        await productsApi.removeImage(id!);
      } else if (payload.newImage) {
        await productsApi.uploadImage(id!, payload.newImage);
      }

      return updatedProduct;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['product', id] });
      queryClient.invalidateQueries({ queryKey: ['inventory-report'] });
      router.back();
    },
    onError: (error) => {
      Alert.alert(t('common.error'), t('products.errors.updateFailed') || 'Failed to update product');
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
      setNewImage({
        uri: asset.uri,
        name: asset.fileName || 'product.jpg',
        type: asset.mimeType || 'image/jpeg',
      });
      setRemoveExistingImage(false);
    }
  };

  const handleRemoveImage = () => {
    setNewImage(null);
    if (existingImageUrl) {
      setRemoveExistingImage(true);
      setExistingImageUrl(null);
    }
  };

  const handleSave = () => {
    if (!name || !sellingPrice) {
      Alert.alert(t('common.error'), t('common.fillRequiredFields'));
      return;
    }

    updateMutation.mutate({
      name,
      description,
      categoryId: categoryId || undefined,
      brandCategoryId: brandCategoryId || undefined,
      unitId: unitId || undefined,
      costPrice: parseFloat(costPrice) || 0,
      sellingPrice: parseFloat(sellingPrice) || 0,
      currency,
      quantity: quantity ? parseInt(quantity) : undefined,
      minQuantity: minQuantity ? parseInt(minQuantity) : undefined,
      isActive,
      newImage,
      removeExistingImage
    });
  };

  const categoryOptions = React.useMemo(() => {
    return categories?.map(c => ({ value: c.id, label: c.name })) || [];
  }, [categories]);

  const brandCategoryOptions = React.useMemo(() => {
    return brandCategories?.map(b => ({ value: b.id, label: b.name })) || [];
  }, [brandCategories]);

  const unitOptions = React.useMemo(() => {
    return units?.map(u => ({ value: u.id, label: u.name })) || [];
  }, [units]);

  const currentImageUri = newImage?.uri || existingImageUrl;

  if (isFetchingProduct) {
    return (
      <View style={[styles.container, { backgroundColor: bg, justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={primary} />
      </View>
    );
  }

  return (
    <>
      <Stack.Screen 
        options={{
          headerShown: true,
          title: t('products.editProduct') || 'Edit Product',
          headerStyle: { backgroundColor: bg },
          headerShadowVisible: true,
        }}
      />
      <View style={[styles.container, { backgroundColor: bg }]}>
        <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 100 }}>
        {/* Image Upload */}
        <Text style={[styles.label, { color: text }]}>{t('products.productImage')}</Text>
        <TouchableOpacity 
          style={[styles.imageUpload, { backgroundColor: card, borderColor: border }]}
          onPress={pickImage}
        >
          {currentImageUri ? (
            <View style={styles.previewImageContainer}>
              <Image source={{ uri: currentImageUri }} style={styles.previewImage} />
              <TouchableOpacity
                style={styles.removeImageBtn}
                onPress={handleRemoveImage}
              >
                <X size={16} color="#FFF" />
              </TouchableOpacity>
            </View>
          ) : (
            <View style={{ alignItems: 'center' }}>
              <View style={[styles.uploadIcon, { backgroundColor: primary + '10' }]}>
                <ImageIcon size={32} color={primary} />
              </View>
              <Text style={{ fontSize: 14, color: text, fontWeight: '600', marginTop: 12 }}>{t('products.uploadImage')}</Text>
              <Text style={{ fontSize: 12, color: muted, marginTop: 4 }}>{t('products.imageRequirements')}</Text>
            </View>
          )}
        </TouchableOpacity>

        {/* Form Fields */}
        <View style={{ gap: 20 }}>
          <View>
            <Text style={[styles.label, { color: text }]}>{t('products.productName')}</Text>
            <Input
              placeholder={t('products.placeholders.name')}
              value={name}
              onChangeText={setName}
            />
          </View>

          <View>
            <Text style={[styles.label, { color: text }]}>{t('products.description')}</Text>
            <Input
              placeholder={t('products.placeholders.description')}
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={3}
            />
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 12 }}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.label, { color: text }]}>{t('products.category')}</Text>
              <View style={[styles.pickerContainer, { backgroundColor: card, borderColor: border }]}>
                <NativePicker
                  value={categoryId}
                  onValueChange={setCategoryId}
                  options={categoryOptions}
                  placeholder={t('products.placeholders.selectCategory')}
                />
              </View>
            </View>
            <TouchableOpacity 
              style={[styles.plusButton, { backgroundColor: primary + '15' }]}
              onPress={() => setIsCategoryModalOpen(true)}
            >
              <Plus size={20} color={primary} strokeWidth={2.5} />
            </TouchableOpacity>
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 12 }}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.label, { color: text }]}>{t('products.brandCategory')}</Text>
              <View style={[styles.pickerContainer, { backgroundColor: card, borderColor: border }]}>
                <NativePicker
                  value={brandCategoryId}
                  onValueChange={setBrandCategoryId}
                  options={brandCategoryOptions}
                  placeholder={t('products.placeholders.selectBrandCategory') || 'Select brand category'}
                />
              </View>
            </View>
            <TouchableOpacity 
              style={[styles.plusButton, { backgroundColor: primary + '15' }]}
              onPress={() => setIsBrandCategoryModalOpen(true)}
            >
              <Plus size={20} color={primary} strokeWidth={2.5} />
            </TouchableOpacity>
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 12 }}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.label, { color: text }]}>{t('products.unit') || 'Unit'}</Text>
              <View style={[styles.pickerContainer, { backgroundColor: card, borderColor: border }]}>
                <NativePicker
                  value={unitId}
                  onValueChange={setUnitId}
                  options={unitOptions}
                  placeholder={t('products.placeholders.selectUnit') || 'Select unit'}
                />
              </View>
            </View>
            <TouchableOpacity 
              style={[styles.plusButton, { backgroundColor: primary + '15' }]}
              onPress={() => setIsUnitModalOpen(true)}
            >
              <Plus size={20} color={primary} strokeWidth={2.5} />
            </TouchableOpacity>
          </View>

          <View style={{ flexDirection: 'row', gap: 16 }}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.label, { color: text }]}>{t('products.purchasePrice')}</Text>
              <Input
                placeholder="0.00"
                value={costPrice}
                onChangeText={setCostPrice}
                keyboardType="numeric"
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.label, { color: text }]}>{t('products.sellingPrice')}</Text>
              <Input
                placeholder="0.00"
                value={sellingPrice}
                onChangeText={setSellingPrice}
                keyboardType="numeric"
              />
            </View>
          </View>

          <View style={{ flexDirection: 'row', gap: 16 }}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.label, { color: text }]}>{t('products.initialStock')}</Text>
              <Input
                placeholder="0"
                value={quantity}
                onChangeText={setQuantity}
                keyboardType="numeric"
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.label, { color: text }]}>{t('products.reorderLevel')}</Text>
              <Input
                placeholder="0"
                value={minQuantity}
                onChangeText={setMinQuantity}
                keyboardType="numeric"
              />
            </View>
          </View>
          
          <View>
            <Text style={[styles.label, { color: text }]}>{t('products.currency')}</Text>
            <View style={{ flexDirection: 'row', gap: 12 }}>
              <TouchableOpacity
                style={[
                  styles.currencyButton,
                  { 
                    backgroundColor: currency === 'UZS' ? primary : card,
                    borderColor: currency === 'UZS' ? primary : border
                  }
                ]}
                onPress={() => setCurrency('UZS')}
              >
                <Text style={{ 
                  color: currency === 'UZS' ? primaryForeground : text,
                  fontWeight: '600'
                }}>
                  UZS
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.currencyButton,
                  { 
                    backgroundColor: currency === 'USD' ? primary : card,
                    borderColor: currency === 'USD' ? primary : border
                  }
                ]}
                onPress={() => setCurrency('USD')}
              >
                <Text style={{ 
                  color: currency === 'USD' ? primaryForeground : text,
                  fontWeight: '600'
                }}>
                  USD
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 }}>
            <Text style={[styles.label, { color: text, marginBottom: 0 }]}>{t('products.isActive') || 'Is Active'}</Text>
            <Switch
              value={isActive}
              onValueChange={setIsActive}
            />
          </View>

        </View>

        <Button 
          style={{ marginTop: 40 }}
          onPress={handleSave}
          loading={updateMutation.isPending}
        >
          {t('products.saveProduct') || 'Save Product'}
        </Button>
      </ScrollView>

      <AvoidKeyboard offset={20} />
      </View>
      <CategoryModal
        open={isCategoryModalOpen}
        onOpenChange={setIsCategoryModalOpen}
      />
      <BrandCategoryModal
        open={isBrandCategoryModalOpen}
        onOpenChange={setIsBrandCategoryModalOpen}
      />
      <UnitModal
        open={isUnitModalOpen}
        onOpenChange={setIsUnitModalOpen}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 8,
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
  previewImageContainer: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  removeImageBtn: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(0, 0, 0, 0.34)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pickerContainer: {
    height: 52,
    borderRadius: 12,
    borderWidth: 1,
    justifyContent: 'center',
    overflow: 'hidden',
  },
  currencyButton: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  plusButton: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
  }
});