import { BottomSheet } from '@/components/ui/bottom-sheet';
import { Button } from '@/components/ui/button';
import { CalendarPicker } from '@/components/ui/calendar-picker';
import { Text } from '@/components/ui/text';
import { View } from '@/components/ui/view';
import { WheelPicker } from '@/components/ui/wheel-picker';
import { setHours, setMinutes, startOfDay } from 'date-fns';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const MINUTE_STEP = 5;
const HOURS = Array.from({ length: 24 }, (_, h) => h.toString().padStart(2, '0'));
const MINUTES = Array.from({ length: 60 / MINUTE_STEP }, (_, i) => (i * MINUTE_STEP).toString().padStart(2, '0'));

interface CalendarSheetProps {
  visible: boolean;
  value: Date;
  onClose: () => void;
  onConfirm: (date: Date) => void;
  minDate?: Date;
  title?: string;
  /** Show the hour/minute wheel pickers below the calendar. Defaults to true. */
  showTime?: boolean;
}

export function CalendarSheet({ visible, value, onClose, onConfirm, minDate, title, showTime = true }: CalendarSheetProps) {
  const { t } = useTranslation();
  const [draftDate, setDraftDate] = useState(value);
  const [hourIndex, setHourIndex] = useState(value.getHours());
  const [minuteIndex, setMinuteIndex] = useState(Math.round(value.getMinutes() / MINUTE_STEP) % MINUTES.length);

  // Re-seed the draft from the current value every time the sheet opens, so a
  // cancelled edit never leaks into the next open. Adjusting state during
  // render (rather than in an effect) on the visible-flag's rising edge.
  const [prevVisible, setPrevVisible] = useState(visible);
  if (visible !== prevVisible) {
    setPrevVisible(visible);
    if (visible) {
      setDraftDate(value);
      setHourIndex(value.getHours());
      setMinuteIndex(Math.round(value.getMinutes() / MINUTE_STEP) % MINUTES.length);
    }
  }

  const confirm = () => {
    const result = showTime
      ? setMinutes(setHours(draftDate, hourIndex), minuteIndex * MINUTE_STEP)
      : startOfDay(draftDate);
    onConfirm(result);
  };

  return (
    <BottomSheet isVisible={visible} onClose={onClose} title={title} snapPoints={[0.75]}>
      <View style={{ gap: 20 }}>
        <CalendarPicker value={draftDate} onChange={setDraftDate} minDate={minDate} />

        {showTime && (
          <View style={{ gap: 8 }}>
            <Text variant="caption">{t('common.time')}</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8 }}>
              <WheelPicker data={HOURS} selectedIndex={hourIndex} onChange={setHourIndex} />
              <Text variant="title">:</Text>
              <WheelPicker data={MINUTES} selectedIndex={minuteIndex} onChange={setMinuteIndex} />
            </View>
          </View>
        )}

        <View style={{ flexDirection: 'row', gap: 12 }}>
          <Button variant="secondary" style={{ flex: 1 }} onPress={onClose}>
            {t('common.cancel')}
          </Button>
          <Button style={{ flex: 1 }} onPress={confirm}>
            {t('common.confirm')}
          </Button>
        </View>
      </View>
    </BottomSheet>
  );
}
