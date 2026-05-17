import React, { useRef, useState } from 'react';
import { Pressable, ScrollView, TextInput, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Phone,
  Lock,
  Eye,
  EyeOff,
  User,
  Store,
  Globe,
  ChevronLeft,
} from 'lucide-react-native';
import { Text } from '@/components/ui/text';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { AvoidKeyboard } from '@/components/ui/avoid-keyboard';
import { Picker } from '@/components/ui/picker';
import { useAuth } from '@/hooks/useAuth';
import { useColor } from '@/hooks/useColor';
import { getApiErrorMessage } from '@/api/client';
import { useTranslation } from 'react-i18next';

type Language = 'en' | 'uz' | 'ru';
const LANGUAGES: { value: Language; label: string }[] = [
  { value: 'en', label: '🇺🇸 English' },
  { value: 'uz', label: '🇺🇿 O\'zbekcha' },
  { value: 'ru', label: '🇷🇺 Русский' },
];

export default function RegisterScreen() {
  const { register } = useAuth();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { t, i18n } = useTranslation();

  // Theme
  const bg = useColor('background');
  const primary = useColor('primary');
  const muted = useColor('textMuted');
  const red = useColor('red');

  // State
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [tenantName, setTenantName] = useState('');
  const [language, setLanguage] = useState<Language>(i18n.language as Language);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Refs
  const passwordRef = useRef<TextInput>(null);
  const fullNameRef = useRef<TextInput>(null);
  const tenantNameRef = useRef<TextInput>(null);

  const handleRegister = async () => {
    setError('');
    if (!fullName.trim()) { setError(t('auth.errors.fullNameRequired')); return; }
    if (!tenantName.trim()) { setError(t('auth.errors.businessNameRequired')); return; }
    if (!phone.trim()) { setError(t('auth.errors.phoneRequired')); return; }
    if (!password.trim()) { setError(t('auth.errors.passwordRequired')); return; }
    if (password.length < 6) { setError(t('auth.errors.passwordLength')); return; }

    setLoading(true);
    try {
      await register(phone.trim(), password, fullName.trim(), tenantName.trim(), language);
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const changeLanguage = (lang: Language) => {
    setLanguage(lang);
    i18n.changeLanguage(lang);
  };

  return (
    <View style={{ flex: 1, backgroundColor: bg }}>
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal: 24,
          paddingTop: insets.top + 16,
          paddingBottom: 24,
        }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* ── Back button ─────────────────────────────────────────── */}
        <Pressable
          onPress={() => router.back()}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 4,
            marginBottom: 24,
            alignSelf: 'flex-start',
          }}
        >
          <ChevronLeft size={22} color={primary} />
          <Text style={{ color: primary, fontSize: 17, fontWeight: '500' }}>
            {t('auth.back')}
          </Text>
        </Pressable>

        {/* ── Header ──────────────────────────────────────────────── */}
        <View style={{ marginBottom: 36 }}>
          <Text variant="heading" style={{ marginBottom: 8 }}>
            {t('auth.createAccount')}
          </Text>
          <Text variant="caption" style={{ fontSize: 17, lineHeight: 24 }}>
            {t('auth.registerDescription')}
          </Text>
        </View>

        {/* ── Form ────────────────────────────────────────────────── */}
        <View style={{ gap: 12, marginBottom: 24 }}>
          {/* Business Info */}
          <Input
            icon={User}
            placeholder={t('auth.fullName')}
            value={fullName}
            onChangeText={setFullName}
            autoCapitalize="words"
            autoComplete="name"
            returnKeyType="next"
            onSubmitEditing={() => tenantNameRef.current?.focus()}
            variant="filled"
          />

          <Input
            ref={tenantNameRef}
            icon={Store}
            placeholder={t('auth.businessName')}
            value={tenantName}
            onChangeText={setTenantName}
            autoCapitalize="words"
            returnKeyType="next"
            onSubmitEditing={() => fullNameRef.current?.focus()}
            variant="filled"
          />

          {/* Credentials */}
          <Input
            ref={fullNameRef}
            icon={Phone}
            placeholder="+998 90 123 45 67"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            autoCapitalize="none"
            autoComplete="tel"
            returnKeyType="next"
            onSubmitEditing={() => passwordRef.current?.focus()}
            variant="filled"
          />

          <Input
            ref={passwordRef}
            icon={Lock}
            placeholder={t('auth.minCharacters')}
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            autoCapitalize="none"
            autoComplete="new-password"
            returnKeyType="go"
            onSubmitEditing={handleRegister}
            variant="filled"
            rightComponent={() => (
              <Pressable
                onPress={() => setShowPassword((v) => !v)}
                hitSlop={8}
              >
                {showPassword ? (
                  <EyeOff size={20} color={muted} />
                ) : (
                  <Eye size={20} color={muted} />
                )}
              </Pressable>
            )}
          />

          {/* Language selector */}
          <Picker
            icon={Globe}
            label={t('auth.language')}
            options={LANGUAGES}
            value={language}
            onValueChange={(val) => changeLanguage(val as Language)}
            modalTitle={t('auth.language')}
          />
        </View>

        {/* ── Error ───────────────────────────────────────────────── */}
        {!!error && (
          <View
            style={{
              backgroundColor: red + '15',
              borderRadius: 12,
              paddingHorizontal: 16,
              paddingVertical: 12,
              marginBottom: 20,
            }}
          >
            <Text style={{ color: red, fontSize: 15, fontWeight: '500' }}>
              {error}
            </Text>
          </View>
        )}

        {/* ── Submit ──────────────────────────────────────────────── */}
        <Button
          onPress={handleRegister}
          loading={loading}
          disabled={loading}
          style={{ marginBottom: 16 }}
        >
          {t('auth.createAccount')}
        </Button>

        {/* ── Footer ──────────────────────────────────────────────── */}
        <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 4 }}>
          <Text variant="caption" style={{ fontSize: 15 }}>
            {t('auth.alreadyHaveAccount')}
          </Text>
          <Pressable onPress={() => router.back()}>
            <Text
              style={{
                fontSize: 15,
                fontWeight: '600',
                color: primary,
              }}
            >
              {t('auth.signIn')}
            </Text>
          </Pressable>
        </View>

        {/* Spacer + keyboard avoidance */}
        <View style={{ flex: 1 }} />
        <AvoidKeyboard offset={16} />
      </ScrollView>
    </View>
  );
}
