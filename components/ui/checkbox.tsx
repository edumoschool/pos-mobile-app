import { Icon } from '@/components/ui/icon';
import { useColor } from '@/hooks/useColor';
import { useHaptics } from '@/hooks/useHaptics';
import { Check } from 'lucide-react-native';
import { Pressable } from 'react-native';

interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  size?: number;
}

export function Checkbox({ checked, onChange, size = 24 }: CheckboxProps) {
  const feedback = useHaptics(true);
  const primary = useColor('primary');
  const primaryForeground = useColor('primaryForeground');
  const border = useColor('border');

  return (
    <Pressable
      onPress={() => {
        feedback(checked ? 'toggle-off' : 'toggle-on');
        onChange(!checked);
      }}
      accessibilityRole='checkbox'
      accessibilityState={{ checked }}
      style={{
        width: size,
        height: size,
        borderRadius: size * 0.28,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: checked ? primary : 'transparent',
        borderWidth: checked ? 0 : 1.5,
        borderColor: border,
      }}
    >
      {checked && <Icon name={Check} size={size * 0.65} color={primaryForeground} strokeWidth={3} />}
    </Pressable>
  );
}
