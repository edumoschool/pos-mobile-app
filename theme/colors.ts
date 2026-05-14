import { Platform } from 'react-native';

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded:
      "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});

export const lightColors = {
  // Base colors
  background: '#FFFFFF',
  foreground: '#0F172A', // Slate 900

  // Card colors
  card: '#F8FAFC', // Slate 50
  cardForeground: '#0F172A',

  // Popover colors
  popover: '#FFFFFF',
  popoverForeground: '#0F172A',

  // Primary colors
  primary: '#2563EB', // Blue 600
  primaryForeground: '#FFFFFF',

  // Secondary colors
  secondary: '#F1F5F9', // Slate 100
  secondaryForeground: '#0F172A',

  // Muted colors
  muted: '#F1F5F9', // Slate 100
  mutedForeground: '#64748B', // Slate 500

  // Accent colors
  accent: '#F1F5F9',
  accentForeground: '#0F172A',

  // Destructive colors
  destructive: '#EF4444', // Red 600
  destructiveForeground: '#FFFFFF',

  // Border and input
  border: '#E2E8F0', // Slate 200
  input: '#E2E8F0',
  ring: '#2563EB',

  // Text colors
  text: '#0F172A',
  textMuted: '#64748B',

  // Legacy support for existing components
  tint: '#2563EB',
  icon: '#64748B',
  tabIconDefault: '#94A3B8',
  tabIconSelected: '#2563EB',

  // Default buttons, links, Send button, selected tabs
  blue: '#3B82F6',

  // Success states, FaceTime buttons, completed tasks
  green: '#10B981',

  // Delete buttons, error states, critical alerts
  red: '#EF4444',

  // VoiceOver highlights, warning states
  orange: '#F59E0B',

  // Notes app accent, Reminders highlights
  yellow: '#FBBF24',

  // Pink accent color for various UI elements
  pink: '#EC4899',

  // Purple accent for creative apps and features
  purple: '#8B5CF6',

  // Teal accent for communication features
  teal: '#14B8A6',

  // Indigo accent for system features
  indigo: '#6366F1',
};

export const darkColors = {
  // Base colors
  background: '#020617', // Slate 950
  foreground: '#F8FAFC', // Slate 50

  // Card colors
  card: '#0F172A', // Slate 900
  cardForeground: '#F8FAFC',

  // Popover colors
  popover: '#0F172A',
  popoverForeground: '#F8FAFC',

  // Primary colors
  primary: '#3B82F6', // Blue 500
  primaryForeground: '#FFFFFF',

  // Secondary colors
  secondary: '#1E293B', // Slate 800
  secondaryForeground: '#F8FAFC',

  // Muted colors
  muted: '#1E293B',
  mutedForeground: '#94A3B8', // Slate 400

  // Accent colors
  accent: '#1E293B',
  accentForeground: '#F8FAFC',

  // Destructive colors
  destructive: '#DC2626', // Red 600
  destructiveForeground: '#FFFFFF',

  // Border and input
  border: '#1E293B',
  input: '#1E293B',
  ring: '#3B82F6',

  // Text colors
  text: '#F8FAFC',
  textMuted: '#94A3B8',

  // Legacy support for existing components
  tint: '#3B82F6',
  icon: '#94A3B8',
  tabIconDefault: '#475569',
  tabIconSelected: '#3B82F6',

  // Default buttons, links, Send button, selected tabs
  blue: '#60A5FA',

  // Success states, FaceTime buttons, completed tasks
  green: '#34D399',

  // Delete buttons, error states, critical alerts
  red: '#F87171',

  // VoiceOver highlights, warning states
  orange: '#FBBF24',

  // Notes app accent, Reminders highlights
  yellow: '#FDE047',

  // Pink accent color for various UI elements
  pink: '#F472B6',

  // Purple accent for creative apps and features
  purple: '#A78BFA',

  // Teal accent for communication features
  teal: '#2DD4BF',

  // Indigo accent for system features
  indigo: '#818CF8',
};

export const Colors = {
  light: lightColors,
  dark: darkColors,
};
