import { CalendarSheet } from '@/components/ui/calendar-sheet';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { TimeSheet } from '@/components/ui/time-sheet';
import { View } from '@/components/ui/view';
import { useColor } from '@/hooks/useColor';
import { CORNERS, FONT_SIZE, HEIGHT } from '@/theme/globals';
import { Calendar, CalendarClock, Clock } from 'lucide-react-native';
import { useState } from 'react';
import { TextStyle, TouchableOpacity, ViewStyle } from 'react-native';

export interface DatePickerProps {
  mode?: 'date' | 'time' | 'datetime';
  value?: Date;
  onChange?: (value: Date | undefined) => void;
  label?: string;
  error?: string;
  placeholder?: string;
  disabled?: boolean;
  style?: ViewStyle;
  minimumDate?: Date;
  timeFormat?: '12' | '24';
  variant?: 'filled' | 'outline' | 'group';
  labelStyle?: TextStyle;
  errorStyle?: TextStyle;
}

function toHHmm(date: Date): string {
  return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
}

/**
 * Date / time / datetime input. A themed trigger (matching Input/Picker)
 * that opens either CalendarSheet (date, datetime) or TimeSheet (time) —
 * see those files, plus calendar-picker and wheel-picker, for the actual
 * picking UI. This file only owns the trigger and mode → sheet wiring.
 */
export function DatePicker({
  mode = 'date',
  value,
  onChange,
  label,
  error,
  placeholder = 'Select date',
  disabled = false,
  style,
  minimumDate,
  timeFormat = '24',
  variant = 'filled',
  labelStyle,
  errorStyle,
}: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);

  const cardColor = useColor('card');
  const borderColor = useColor('border');
  const textMutedColor = useColor('textMuted');
  const textColor = useColor('text');
  const errorColor = useColor('red');

  const formatDisplayValue = () => {
    if (!value) return placeholder;
    const hour12 = timeFormat === '12';
    switch (mode) {
      case 'time':
        return value.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12 });
      case 'datetime': {
        const timeStr = value.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12 });
        return `${value.toLocaleDateString()} ${timeStr}`;
      }
      default:
        return value.toLocaleDateString();
    }
  };

  const handleDateConfirm = (date: Date) => {
    onChange?.(date);
    setIsOpen(false);
  };

  const handleTimeConfirm = (time: string) => {
    const [hours, minutes] = time.split(':').map(Number);
    const next = value ? new Date(value) : new Date();
    next.setHours(hours, minutes, 0, 0);
    onChange?.(next);
    setIsOpen(false);
  };

  const triggerStyle: ViewStyle = {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: variant === 'group' ? 0 : 16,
    borderWidth: variant === 'group' ? 0 : 1,
    borderColor: variant === 'outline' ? borderColor : cardColor,
    borderRadius: CORNERS,
    backgroundColor: variant === 'filled' ? cardColor : 'transparent',
    minHeight: variant === 'group' ? 'auto' : HEIGHT,
  };

  const ModeIcon = mode === 'time' ? Clock : mode === 'datetime' ? CalendarClock : Calendar;

  return (
    <>
      <TouchableOpacity
        style={[triggerStyle, disabled && { opacity: 0.5 }, style]}
        onPress={() => !disabled && setIsOpen(true)}
        disabled={disabled}
      >
        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <View style={{ width: label ? 120 : 'auto', flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Icon name={ModeIcon} size={20} strokeWidth={1} color={error ? errorColor : textMutedColor} />

            {label && (
              <View style={{ flex: 1 }}>
                <Text
                  variant="caption"
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={[{ color: error ? errorColor : textMutedColor }, labelStyle]}
                >
                  {label}
                </Text>
              </View>
            )}
          </View>

          <View style={{ flex: 1 }}>
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={{ color: value ? textColor : textMutedColor, fontSize: FONT_SIZE }}
            >
              {formatDisplayValue()}
            </Text>
          </View>
        </View>
      </TouchableOpacity>

      {error && (
        <Text variant="caption" style={[{ color: errorColor, marginTop: 4 }, errorStyle]}>
          {error}
        </Text>
      )}

      {mode === 'time' ? (
        <TimeSheet
          visible={isOpen}
          value={value ? toHHmm(value) : '09:00'}
          onClose={() => setIsOpen(false)}
          onConfirm={handleTimeConfirm}
          title={label || placeholder}
        />
      ) : (
        <CalendarSheet
          visible={isOpen}
          value={value || new Date()}
          onClose={() => setIsOpen(false)}
          onConfirm={handleDateConfirm}
          minDate={minimumDate}
          showTime={mode === 'datetime'}
          title={label || placeholder}
        />
      )}
    </>
  );
}
