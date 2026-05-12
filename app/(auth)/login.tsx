import React, { useRef, useState } from 'react';
import { Pressable, ScrollView, TextInput, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Phone, Lock, Eye, EyeOff } from 'lucide-react-native';
import { Text } from '@/components/ui/text';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { AvoidKeyboard } from '@/components/ui/avoid-keyboard';
import { useAuth } from '@/hooks/useAuth';
import { useColor } from '@/hooks/useColor';
import { getApiErrorMessage } from '@/api/client';
import { useTranslation } from 'react-i18next';

export default function LoginScreen() {
  const { login } = useAuth();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();

  // Theme
  const bg = useColor('background');
  const primary = useColor('primary');
  const muted = useColor('textMuted');
  const card = useColor('card');
  const red = useColor('red');

  // State
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Refs
  const passwordRef = useRef<TextInput>(null);

  const handleLogin = async () => {
    setError('');
    if (!phone.trim()) { setError(t('auth.errors.phoneRequired')); return; }
    if (!password.trim()) { setError(t('auth.errors.passwordRequired')); return; }
    if (password.length < 6) { setError(t('auth.errors.passwordLength')); return; }

    setLoading(true);
    try {
      await login(phone.trim(), password);
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
          paddingTop: insets.top + 60,
          paddingBottom: 24,
        }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* ── Header ──────────────────────────────────────────────── */}
        <View style={{ marginBottom: 48 }}>
          {/* Logo / Brand mark */}
          <View
            style={{
              width: 64,
              height: 64,
              borderRadius: 20,
              backgroundColor: primary,
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 24,
            }}
          >
            <Text style={{ fontSize: 28, fontWeight: '800', color: '#fff' }}>P</Text>
          </View>

          <Text variant="heading" style={{ marginBottom: 8 }}>
            {t('auth.welcome')}
          </Text>
          <Text variant="caption" style={{ fontSize: 17, lineHeight: 24 }}>
            {t('auth.loginDescription')}
          </Text>
        </View>

        {/* ── Form ────────────────────────────────────────────────── */}
        <View style={{ gap: 12, marginBottom: 24 }}>
          <Input
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
            placeholder={t('auth.enterPassword')}
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            autoCapitalize="none"
            autoComplete="password"
            returnKeyType="go"
            onSubmitEditing={handleLogin}
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
          onPress={handleLogin}
          loading={loading}
          disabled={loading}
          style={{ marginBottom: 16 }}
        >
          {t('auth.signIn')}
        </Button>

        {/* ── Footer ──────────────────────────────────────────────── */}
        <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 4 }}>
          <Text variant="caption" style={{ fontSize: 15 }}>
            {t('auth.dontHaveAccount')}
          </Text>
          <Pressable onPress={() => router.push('/(auth)/register')}>
            <Text
              style={{
                fontSize: 15,
                fontWeight: '600',
                color: primary,
              }}
            >
              {t('auth.signUp')}
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
