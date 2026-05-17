import React from 'react';
import { TouchableOpacity, View, ViewStyle } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text } from '@/components/ui/text';
import { useColor } from '@/hooks/useColor';

interface HeaderProps {
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
  right?: React.ReactNode;
  style?: ViewStyle;
  hidden?: boolean;
}

export function Header({
  title,
  showBack = true,
  onBack,
  right,
  style,
  hidden = false,
}: HeaderProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const primary = useColor('primary');
  const text = useColor('text');
  const bg = useColor('background');

  if (hidden) return null;

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  return (
    <View
      style={[
        {
          backgroundColor: bg,
          paddingTop: insets.top,
          paddingHorizontal: 16,
          paddingBottom: 12,
          flexDirection: 'row',
          alignItems: 'center',
          minHeight: insets.top + 52,
        },
        style,
      ]}
    >
      {/* Back button slot */}
      <View style={{ width: 40 }}>
        {showBack && (
          <TouchableOpacity
            onPress={handleBack}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            style={{ flexDirection: 'row', alignItems: 'center' }}
          >
            <ChevronLeft size={26} color={primary} />
          </TouchableOpacity>
        )}
      </View>

      {/* Title slot */}
      <View style={{ flex: 1, alignItems: 'center' }}>
        {title ? (
          <Text
            numberOfLines={1}
            style={{ fontSize: 17, fontWeight: '700', color: text }}
          >
            {title}
          </Text>
        ) : null}
      </View>

      {/* Right slot */}
      <View style={{ width: 40, alignItems: 'flex-end' }}>
        {right ?? null}
      </View>
    </View>
  );
}
