import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { View } from '@/components/ui/view';
import { useColor } from '@/hooks/useColor';
import { useHaptics } from '@/hooks/useHaptics';
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isBefore,
  isSameDay,
  isSameMonth,
  isToday,
  startOfDay,
  startOfMonth,
  startOfWeek,
  subMonths,
} from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable } from 'react-native';

const WEEKDAY_LABELS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const CELL_SIZE = 40;

interface CalendarPickerProps {
  value: Date;
  onChange: (date: Date) => void;
  minDate?: Date;
}

export function CalendarPicker({ value, onChange, minDate }: CalendarPickerProps) {
  const [visibleMonth, setVisibleMonth] = useState(startOfMonth(value));
  const feedback = useHaptics(true);
  const primary = useColor('primary');
  const primaryForeground = useColor('primaryForeground');
  const text = useColor('text');
  const muted = useColor('textMuted');
  const border = useColor('border');

  const days = eachDayOfInterval({
    start: startOfWeek(startOfMonth(visibleMonth)),
    end: endOfWeek(endOfMonth(visibleMonth)),
  });

  // Chunked into explicit week-rows rather than one flat array left to
  // `flexWrap` — flex-wrap breaks a row once it runs out of *width*, not
  // after a fixed count, so it only lines up with the 7-cell header by
  // coincidence (whenever the container happens to be exactly 7 × CELL_SIZE
  // wide). Any wider and an 8th cell fits before wrapping, which silently
  // shifts every date left of a whole weekday relative to the header.
  const weeks: Date[][] = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }

  const floorMinDate = minDate ? startOfDay(minDate) : null;

  return (
    <View style={{ gap: 12 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <Pressable
          onPress={() => {
            feedback('impact-light');
            setVisibleMonth((m) => subMonths(m, 1));
          }}
          hitSlop={8}
          style={{ padding: 6 }}
        >
          <Icon name={ChevronLeft} size={20} color={text} />
        </Pressable>
        <Text variant="subtitle">{format(visibleMonth, 'MMMM yyyy')}</Text>
        <Pressable
          onPress={() => {
            feedback('impact-light');
            setVisibleMonth((m) => addMonths(m, 1));
          }}
          hitSlop={8}
          style={{ padding: 6 }}
        >
          <Icon name={ChevronRight} size={20} color={text} />
        </Pressable>
      </View>

      <View style={{ flexDirection: 'row' }}>
        {WEEKDAY_LABELS.map((label, i) => (
          <View key={i} style={{ width: CELL_SIZE, alignItems: 'center' }}>
            <Text variant="caption">{label}</Text>
          </View>
        ))}
      </View>

      <View>
        {weeks.map((week) => (
          <View key={week[0].toISOString()} style={{ flexDirection: 'row' }}>
            {week.map((day) => {
              const inMonth = isSameMonth(day, visibleMonth);
              const selected = isSameDay(day, value);
              const disabled = floorMinDate ? isBefore(day, floorMinDate) : false;
              const todayMarker = isToday(day);

              return (
                <Pressable
                  key={day.toISOString()}
                  disabled={disabled}
                  onPress={() => {
                    feedback('selection');
                    onChange(day);
                  }}
                  style={{
                    width: CELL_SIZE,
                    height: CELL_SIZE,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <View
                    style={{
                      width: CELL_SIZE - 6,
                      height: CELL_SIZE - 6,
                      borderRadius: (CELL_SIZE - 6) / 2,
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: selected ? primary : 'transparent',
                      borderWidth: todayMarker && !selected ? 1 : 0,
                      borderColor: border,
                    }}
                  >
                    <Text
                      style={{
                        color: selected ? primaryForeground : disabled || !inMonth ? muted : text,
                        opacity: disabled ? 0.4 : inMonth ? 1 : 0.35,
                        fontWeight: selected ? '600' : '400',
                      }}
                    >
                      {format(day, 'd')}
                    </Text>
                  </View>
                </Pressable>
              );
            })}
          </View>
        ))}
      </View>
    </View>
  );
}
