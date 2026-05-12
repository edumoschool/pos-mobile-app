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
import { useAuth } from '@/hooks/useAuth';
import { useColor } from '@/hooks/useColor';
import { getApiErrorMessage } from '@/api/client';

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

  // Theme
  const bg = useColor('background');
  const primary = useColor('primary');
  const muted = useColor('textMuted');
  const card = useColor('card');
  const border = useColor('border');
  const red = useColor('red');

  // State
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [tenantName, setTenantName] = useState('');
  const [language, setLanguage] = useState<Language>('en');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Refs
  const passwordRef = useRef<TextInput>(null);
  const fullNameRef = useRef<TextInput>(null);
  const tenantNameRef = useRef<TextInput>(null);

  const handleRegister = async () => {
    setError('');
    if (!fullName.trim()) { setError('Full name is required'); return; }
    if (!tenantName.trim()) { setError('Business name is required'); return; }
    if (!phone.trim()) { setError('Phone number is required'); return; }
    if (!password.trim()) { setError('Password is required'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters'); return; }

    setLoading(true);
    try {
      await register(phone.trim(), password, fullName.trim(), tenantName.trim(), language);
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
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
            Back
          </Text>
        </Pressable>

        {/* ── Header ──────────────────────────────────────────────── */}
        <View style={{ marginBottom: 36 }}>
          <Text variant="heading" style={{ marginBottom: 8 }}>
            Create account
          </Text>
          <Text variant="caption" style={{ fontSize: 17, lineHeight: 24 }}>
            Set up your POS business in under a minute.{'\n'}
            You'll get a 30-day free trial.
          </Text>
        </View>

        {/* ── Form ────────────────────────────────────────────────── */}
        <View style={{ gap: 12, marginBottom: 24 }}>
          {/* Business Info */}
          <Input
            label="Your Name"
            icon={User}
            placeholder="John Doe"
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
            label="Business"
            icon={Store}
            placeholder="My Store"
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
            label="Phone"
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
            label="Password"
            icon={Lock}
            placeholder="Min 6 characters"
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
          <View style={{ gap: 8 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginLeft: 4 }}>
              <Globe size={15} color={muted} />
              <Text variant="caption">Language</Text>
            </View>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              {LANGUAGES.map((lang) => {
                const isSelected = language === lang.value;
                return (
                  <Pressable
                    key={lang.value}
                    onPress={() => setLanguage(lang.value)}
                    style={{
                      flex: 1,
                      paddingVertical: 10,
                      paddingHorizontal: 12,
                      borderRadius: 12,
                      backgroundColor: isSelected ? primary : card,
                      borderWidth: isSelected ? 0 : 1,
                      borderColor: border,
                      alignItems: 'center',
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 14,
                        fontWeight: isSelected ? '600' : '400',
                        color: isSelected ? '#fff' : muted,
                      }}
                    >
                      {lang.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
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
          Create Account
        </Button>

        {/* ── Footer ──────────────────────────────────────────────── */}
        <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 4 }}>
          <Text variant="caption" style={{ fontSize: 15 }}>
            Already have an account?
          </Text>
          <Pressable onPress={() => router.back()}>
            <Text
              style={{
                fontSize: 15,
                fontWeight: '600',
                color: primary,
              }}
            >
              Sign In
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
