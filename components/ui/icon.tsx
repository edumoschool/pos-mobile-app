import { useColor } from '@/hooks/useColor';
import { LucideProps } from 'lucide-react-native';
import React from 'react';

export type Props = LucideProps & {
  lightColor?: string;
  darkColor?: string;
  name: React.ComponentType<LucideProps>;
  /** Icons are decorative by default; set true to expose to screen readers. */
  accessible?: boolean;
};

export function Icon({
  lightColor,
  darkColor,
  name: IconComponent,
  color,
  size = 24,
  strokeWidth = 1.8,
  accessible = false,
  ...rest
}: Props) {
  const themedColor = useColor('icon', { light: lightColor, dark: darkColor });

  // Use provided color prop if available, otherwise use themed color
  const iconColor = color || themedColor;

  return (
    <IconComponent
      color={iconColor}
      size={size}
      strokeWidth={strokeWidth}
      strokeLinecap='round'
      // Icons are decorative by default, so hide them from screen readers
      // unless a caller opts in. `accessible` is not an SVG prop, so it is
      // translated to the RN accessibility props rather than forwarded.
      accessibilityElementsHidden={!accessible}
      importantForAccessibility={accessible ? 'yes' : 'no-hide-descendants'}
      {...rest}
    />
  );
}
