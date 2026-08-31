import React from 'react';
import { View, ScrollView, TouchableOpacity, ActivityIndicator, StyleSheet, RefreshControl } from 'react-native';
import { router } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Plus, GitBranch, ChevronRight, MapPin } from 'lucide-react-native';

import { Text } from '@/components/ui/text';
import { Header } from '@/components/ui/header';
import { useColor } from '@/hooks/useColor';
import { branchesApi } from '@/api/branches';

export default function BranchesListScreen() {
  const { t } = useTranslation();

  const bg = useColor('background');
  const card = useColor('card');
  const border = useColor('border');
  const text = useColor('text');
  const muted = useColor('textMuted');
  const primary = useColor('primary');
  const primaryForeground = useColor('primaryForeground');
  const green = useColor('green');
  const red = useColor('red');

  const { data: branches = [], isLoading, refetch, isRefetching } = useQuery({
    queryKey: ['branches'],
    queryFn: branchesApi.getAll,
  });

  return (
    <View style={{ flex: 1, backgroundColor: bg }}>
      <Header
        title={t('settings.rows.branches')}
        right={
          <TouchableOpacity
            onPress={() => router.push('/settings/branches/new' as any)}
            style={{ width: 34, height: 34, borderRadius: 10, backgroundColor: primary, alignItems: 'center', justifyContent: 'center' }}
          >
            <Plus size={18} color={primaryForeground} />
          </TouchableOpacity>
        }
      />

      {isLoading ? (
        <ActivityIndicator color={primary} style={{ marginTop: 40 }} />
      ) : (
        <ScrollView
          contentContainerStyle={{ padding: 16, gap: 10 }}
          refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor={primary} />}
        >
          {branches.length === 0 && (
            <Text style={{ color: muted, textAlign: 'center', marginTop: 40 }}>
              {t('settings.branches.empty')}
            </Text>
          )}
          {branches.map((b) => (
            <TouchableOpacity
              key={b.id}
              onPress={() => router.push(`/settings/branches/${b.id}` as any)}
              style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: card, borderRadius: 14, borderWidth: 1, borderColor: border + '60', padding: 14 }}
            >
              <View style={{ width: 34, height: 34, borderRadius: 10, backgroundColor: primary + '18', alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
                <GitBranch size={18} color={primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 15, fontWeight: '600', color: text }}>{b.name}</Text>
                {!!b.address && (
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 }}>
                    <MapPin size={12} color={muted} />
                    <Text style={{ fontSize: 12, color: muted }} numberOfLines={1}>{b.address}</Text>
                  </View>
                )}
              </View>
              <View style={[styles.badge, { backgroundColor: (b.isActive ? green : red) + '20' }]}>
                <Text style={{ fontSize: 10, fontWeight: '700', color: b.isActive ? green : red }}>
                  {b.isActive ? t('common.on') : t('common.off')}
                </Text>
              </View>
              <ChevronRight size={18} color={muted} style={{ marginLeft: 6 }} />
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  badge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
});
