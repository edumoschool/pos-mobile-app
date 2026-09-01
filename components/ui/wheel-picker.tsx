import { Text } from '@/components/ui/text';
import { useColor } from '@/hooks/useColor';
import { useHaptics } from '@/hooks/useHaptics';
import { useRef } from 'react';
import { FlatList, NativeScrollEvent, NativeSyntheticEvent, View } from 'react-native';

const ITEM_HEIGHT = 40;
const VISIBLE_ITEMS = 5;
const PADDING = ITEM_HEIGHT * Math.floor(VISIBLE_ITEMS / 2);

interface WheelPickerProps {
  data: string[];
  selectedIndex: number;
  onChange: (index: number) => void;
  width?: number;
}

/** A native-feeling scroll-to-select wheel — used for hour/minute pickers in CalendarSheet/TimeSheet. */
export function WheelPicker({ data, selectedIndex, onChange, width = 72 }: WheelPickerProps) {
  const listRef = useRef<FlatList<string>>(null);
  const feedback = useHaptics(true);
  const lastIndex = useRef(selectedIndex);
  const text = useColor('text');
  const muted = useColor('textMuted');
  const border = useColor('border');

  const handleMomentumEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetY = e.nativeEvent.contentOffset.y;
    const index = Math.max(0, Math.min(data.length - 1, Math.round(offsetY / ITEM_HEIGHT)));
    if (index !== lastIndex.current) {
      lastIndex.current = index;
      feedback('selection');
      onChange(index);
    }
  };

  return (
    <View style={{ height: ITEM_HEIGHT * VISIBLE_ITEMS, width }}>
      <View
        pointerEvents="none"
        style={{
          position: 'absolute',
          top: PADDING,
          left: 0,
          right: 0,
          height: ITEM_HEIGHT,
          borderTopWidth: 1,
          borderBottomWidth: 1,
          borderColor: border,
          zIndex: 1,
        }}
      />
      <FlatList
        ref={listRef}
        data={data}
        keyExtractor={(item, i) => `${item}-${i}`}
        showsVerticalScrollIndicator={false}
        snapToInterval={ITEM_HEIGHT}
        decelerationRate="fast"
        initialScrollIndex={selectedIndex}
        getItemLayout={(_, index) => ({ length: ITEM_HEIGHT, offset: ITEM_HEIGHT * index, index })}
        contentContainerStyle={{ paddingVertical: PADDING }}
        onMomentumScrollEnd={handleMomentumEnd}
        renderItem={({ item, index }) => {
          const selected = index === selectedIndex;
          return (
            <View style={{ height: ITEM_HEIGHT, alignItems: 'center', justifyContent: 'center' }}>
              <Text
                style={{
                  fontSize: selected ? 20 : 17,
                  fontWeight: selected ? '600' : '400',
                  color: selected ? text : muted,
                }}
              >
                {item}
              </Text>
            </View>
          );
        }}
      />
    </View>
  );
}
