import React from 'react';
import { View, ScrollView, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import {
  User,
  KeyRound,
  Building2,
  GitBranch,
  Tags,
  CreditCard,
  ShieldCheck,
  MonitorSmartphone,
  Palette,
  LogOut,
  ChevronRight,
  Crown,
} from 'lucide-react-native';

import { Text } from '@/components/ui/text';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ModeToggle } from '@/components/ui/mode-toggle';
import { useActionSheet } from '@/components/ui/action-sheet';
import { useColor } from '@/hooks/useColor';
import { useAuth } from '@/hooks/useAuth';
import { usePinLock } from '@/hooks/usePinLock';

export default function SettingsScreen() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const { user, logout } = useAuth();
  const { hasPin } = usePinLock();
  const logoutSheet = useActionSheet();

  const bg = useColor('background');
  const card = useColor('card');
  const border = useColor('border');
  const text = useColor('text');
  const muted = useColor('textMuted');
  const primary = useColor('primary');
  const primaryForeground = useColor('primaryForeground');
  const red = useColor('red');

  const isManager = user?.role === 'owner' || user?.role === 'super_admin';
  const isSuperAdmin = user?.role === 'super_admin';

  const sections: {
    title: string;
    rows: {
      icon: React.ComponentType<any>;
      label: string;
      value?: string;
      onPress: () => void;
      hidden?: boolean;
    }[];
  }[] = [
    {
      title: t('settings.sections.account'),
      rows: [
        { icon: User, label: t('settings.rows.profile'), value: user?.fullName, onPress: () => router.push('/settings/profile' as any) },
        { icon: KeyRound, label: t('settings.rows.password'), onPress: () => router.push('/settings/password' as any) },
      ],
    },
    {
      title: t('settings.sections.business'),
      rows: [
        { icon: Building2, label: t('settings.rows.business'), value: user?.tenant?.name, onPress: () => router.push('/settings/business' as any) },
        { icon: GitBranch, label: t('settings.rows.branches'), onPress: () => router.push('/settings/branches' as any), hidden: !isManager },
        { icon: Tags, label: t('settings.rows.catalog'), onPress: () => router.push('/settings/catalog/categories' as any), hidden: !isManager },
        { icon: CreditCard, label: t('settings.rows.subscription'), value: user?.tenant?.subscriptionStatus, onPress: () => router.push('/settings/subscription' as any) },
      ],
    },
    {
      title: t('settings.sections.security'),
      rows: [
        { icon: ShieldCheck, label: t('settings.rows.appLock'), value: hasPin ? t('common.on') : t('common.off'), onPress: () => router.push('/settings/security' as any) },
        { icon: MonitorSmartphone, label: t('settings.rows.sessions'), onPress: () => router.push('/settings/sessions' as any) },
      ],
    },
    {
      title: t('settings.sections.administration'),
      rows: [
        { icon: Building2, label: t('settings.rows.tenants'), onPress: () => router.push('/admin/tenants' as any), hidden: !isSuperAdmin },
        { icon: Crown, label: t('settings.rows.plans'), onPress: () => router.push('/admin/plans' as any), hidden: !isSuperAdmin },
      ],
    },
  ];

  const handleLogoutPress = () => {
    logoutSheet.show({
      title: t('settings.rows.logout'),
      message: t('settings.logoutConfirm'),
      cancelButtonTitle: t('common.cancel'),
      options: [
        {
          title: t('settings.rows.logout'),
          destructive: true,
          onPress: logout,
          icon: <LogOut size={18} color={red} />,
        },
      ],
    });
  };

  return (
    <View style={{ flex: 1, backgroundColor: bg }}>
      <ScrollView
        contentContainerStyle={{ paddingTop: insets.top + 12, paddingBottom: insets.bottom + 40, paddingHorizontal: 16 }}
        showsVerticalScrollIndicator={false}
      >
        <Text style={{ fontSize: 28, fontWeight: '800', color: text, marginBottom: 20 }}>
          {t('tabs.settings')}
        </Text>

        {/* Profile card */}
        <TouchableOpacity
          onPress={() => router.push('/settings/profile' as any)}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: card,
            borderRadius: 16,
            padding: 16,
            borderWidth: 1,
            borderColor: border + '60',
            marginBottom: 24,
          }}
        >
          <Avatar size={52} style={{ marginRight: 14 }}>
            <AvatarFallback
              style={{ backgroundColor: primary }}
              textStyle={{ color: primaryForeground, fontWeight: '700' }}
            >
              {user?.fullName?.substring(0, 2).toUpperCase() ?? '??'}
            </AvatarFallback>
          </Avatar>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 17, fontWeight: '700', color: text }}>{user?.fullName}</Text>
            <Text style={{ fontSize: 13, color: muted, marginTop: 2 }}>{user?.phone}</Text>
            <Text style={{ fontSize: 12, color: primary, marginTop: 2, fontWeight: '600' }}>
              {user?.role ? t(`settings.roles.${user.role}` as any) : ''}
            </Text>
          </View>
          <ChevronRight size={20} color={muted} />
        </TouchableOpacity>

        {sections.map((section) => {
          const rows = section.rows.filter((r) => !r.hidden);
          if (rows.length === 0) return null;
          return (
            <View key={section.title} style={{ marginBottom: 24 }}>
              <Text style={{ fontSize: 12, fontWeight: '700', color: muted, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8, marginLeft: 4 }}>
                {section.title}
              </Text>
              <View style={{ backgroundColor: card, borderRadius: 16, borderWidth: 1, borderColor: border + '60', overflow: 'hidden' }}>
                {rows.map((row, i) => (
                  <View key={row.label}>
                    {i > 0 && <View style={{ height: StyleSheet.hairlineWidth, backgroundColor: border, marginLeft: 52 }} />}
                    <TouchableOpacity
                      onPress={row.onPress}
                      style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14 }}
                    >
                      <View style={{ width: 30, height: 30, borderRadius: 8, backgroundColor: primary + '18', alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
                        <row.icon size={16} color={primary} />
                      </View>
                      <Text style={{ flex: 1, fontSize: 15, color: text, fontWeight: '500' }}>{row.label}</Text>
                      {!!row.value && (
                        <Text style={{ fontSize: 13, color: muted, marginRight: 6, maxWidth: 140 }} numberOfLines={1}>
                          {row.value}
                        </Text>
                      )}
                      <ChevronRight size={18} color={muted} />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            </View>
          );
        })}

        {/* Appearance */}
        <View style={{ marginBottom: 24 }}>
          <Text style={{ fontSize: 12, fontWeight: '700', color: muted, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8, marginLeft: 4 }}>
            {t('settings.sections.appearance')}
          </Text>
          <View style={{ backgroundColor: card, borderRadius: 16, borderWidth: 1, borderColor: border + '60', padding: 16, flexDirection: 'row', alignItems: 'center' }}>
            <View style={{ width: 30, height: 30, borderRadius: 8, backgroundColor: primary + '18', alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
              <Palette size={16} color={primary} />
            </View>
            <Text style={{ flex: 1, fontSize: 15, color: text, fontWeight: '500' }}>{t('settings.rows.theme')}</Text>
            <ModeToggle />
          </View>
        </View>

        {/* Logout */}
        <TouchableOpacity
          onPress={handleLogoutPress}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            backgroundColor: red + '15',
            borderRadius: 14,
            paddingVertical: 15,
          }}
        >
          <LogOut size={18} color={red} />
          <Text style={{ fontSize: 15, fontWeight: '700', color: red }}>{t('settings.rows.logout')}</Text>
        </TouchableOpacity>

        {Platform.OS === 'web' && <View style={{ height: 40 }} />}
      </ScrollView>

      {logoutSheet.ActionSheet}
    </View>
  );
}
