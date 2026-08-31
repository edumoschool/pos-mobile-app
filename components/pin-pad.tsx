import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Delete } from 'lucide-react-native';
import { Text } from '@/components/ui/text';
import { useColor } from '@/hooks/useColor';
import { PIN_LENGTH } from '@/hooks/usePinLock';

interface PinPadProps {
  value: string;
  onChange: (next: string) => void;
  title?: string;
  subtitle?: string;
  error?: string;
  length?: number;
}

/** Reusable numeric PIN entry: dot indicator + 0-9 keypad + backspace. */
export function PinPad({
  value,
  onChange,
  title,
  subtitle,
  error,
  length = PIN_LENGTH,
}: PinPadProps) {
  const text = useColor('text');
  const muted = useColor('textMuted');
  const primary = useColor('primary');
  const card = useColor('card');
  const border = useColor('border');
  const red = useColor('red');

  const press = (digit: string) => {
    if (value.length >= length) return;
    onChange(value + digit);
  };
  const backspace = () => onChange(value.slice(0, -1));

  return (
    <View style={{ alignItems: 'center' }}>
      {title ? (
        <Text style={{ fontSize: 20, fontWeight: '800', color: text, marginBottom: 6 }}>
          {title}
        </Text>
      ) : null}
      {subtitle ? (
        <Text style={{ fontSize: 14, color: muted, marginBottom: 24, textAlign: 'center' }}>
          {subtitle}
        </Text>
      ) : null}

      {/* Dots */}
      <View style={{ flexDirection: 'row', gap: 16, marginBottom: 12 }}>
        {Array.from({ length }).map((_, i) => (
          <View
            key={i}
            style={{
              width: 14,
              height: 14,
              borderRadius: 7,
              borderWidth: 1.5,
              borderColor: error ? red : primary,
              backgroundColor: i < value.length ? (error ? red : primary) : 'transparent',
            }}
          />
        ))}
      </View>

      <View style={{ height: 20, marginBottom: 12 }}>
        {!!error && <Text style={{ color: red, fontSize: 13 }}>{error}</Text>}
      </View>

      {/* Keypad */}
      <View style={styles.grid}>
        {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((d) => (
          <Key key={d} onPress={() => press(d)} card={card} border={border} text={text}>
            {d}
          </Key>
        ))}
        <View style={styles.key} />
        <Key onPress={() => press('0')} card={card} border={border} text={text}>
          0
        </Key>
        <TouchableOpacity style={styles.key} onPress={backspace} hitSlop={8}>
          <Delete size={24} color={text} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

function Key({
  children,
  onPress,
  card,
  border,
  text,
}: {
  children: React.ReactNode;
  onPress: () => void;
  card: string;
  border: string;
  text: string;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.6}
      style={[styles.key, { backgroundColor: card, borderColor: border }]}
    >
      <Text style={{ fontSize: 26, fontWeight: '600', color: text }}>{children}</Text>
    </TouchableOpacity>
  );
}

const KEY = 74;
const styles = StyleSheet.create({
  grid: {
    width: KEY * 3 + 40,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 16,
  },
  key: {
    width: KEY,
    height: KEY,
    borderRadius: KEY / 2,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: StyleSheet.hairlineWidth,
  },
});
