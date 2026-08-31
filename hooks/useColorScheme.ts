import { useColorScheme as useRNColorScheme } from 'react-native';

/**
 * The one place the app's colour scheme is decided.
 *
 * React Native widened `ColorSchemeName` to include `null`/`'unspecified'`.
 * The theme is binary — `Colors` only has `light` and `dark` keys — so
 * collapse the other values here, once, and let every consumer keep indexing
 * with a two-value union.
 */
export function useColorScheme(): 'light' | 'dark' {
  return useRNColorScheme() === 'dark' ? 'dark' : 'light';
}
