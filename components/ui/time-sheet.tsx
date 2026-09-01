import { BottomSheet } from '@/components/ui/bottom-sheet';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { View } from '@/components/ui/view';
import { WheelPicker } from '@/components/ui/wheel-picker';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const MINUTE_STEP = 5;
const HOURS = Array.from({ length: 24 }, (_, h) => h.toString().padStart(2, '0'));
const MINUTES = Array.from({ length: 60 / MINUTE_STEP }, (_, i) => (i * MINUTE_STEP).toString().padStart(2, '0'));

interface TimeSheetProps {
  visible: boolean;
  /** "HH:mm" */
  value: string;
  onClose: () => void;
  onConfirm: (time: string) => void;
  title?: string;
}

function parseTime(value: string): { hourIndex: number; minuteIndex: number } {
  const match = /^(\d{2}):(\d{2})$/.exec(value);
  const hour = match ? parseInt(match[1], 10) : 9;
  const minute = match ? parseInt(match[2], 10) : 0;
  return {
    hourIndex: Math.min(23, Math.max(0, hour)),
    minuteIndex: Math.round(minute / MINUTE_STEP) % MINUTES.length,
  };
}

/** A bottom sheet for picking an "HH:mm" time — the time-only counterpart to
 * CalendarSheet, which always shows a date grid alongside its optional wheels. */
export function TimeSheet({ visible, value, onClose, onConfirm, title }: TimeSheetProps) {
  const { t } = useTranslation();
  const initial = parseTime(value);
  const [hourIndex, setHourIndex] = useState(initial.hourIndex);
  const [minuteIndex, setMinuteIndex] = useState(initial.minuteIndex);

  // Re-seed the draft from the current value every time the sheet opens, so a
  // cancelled edit never leaks into the next open. Adjusting state during
  // render (rather than in an effect) on the visible-flag's rising edge.
  const [prevVisible, setPrevVisible] = useState(visible);
  if (visible !== prevVisible) {
    setPrevVisible(visible);
    if (visible) {
      const seeded = parseTime(value);
      setHourIndex(seeded.hourIndex);
      setMinuteIndex(seeded.minuteIndex);
    }
  }

  const confirm = () => {
    onConfirm(`${HOURS[hourIndex]}:${MINUTES[minuteIndex]}`);
  };

  return (
    <BottomSheet isVisible={visible} onClose={onClose} title={title} snapPoints={[0.45]}>
      <View style={{ gap: 20 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8 }}>
          <WheelPicker data={HOURS} selectedIndex={hourIndex} onChange={setHourIndex} />
          <Text variant="title">:</Text>
          <WheelPicker data={MINUTES} selectedIndex={minuteIndex} onChange={setMinuteIndex} />
        </View>

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
