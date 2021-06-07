/**
 * This file contains the application's variables.
 *
 * Define color, sizes, etc. here instead of duplicating them throughout the components.
 * That allows to change them more easily later on.
 */

import { ThemeFontSize, ThemeMetricsSizes, ThemeNavigationColors } from '@/theme/theme.type'
import { TextStyle } from 'react-native'

/**
 * Colors
 */
export const Colors = {
  // Example colors:
  headerBackground: '#28282A',
  transparent: 'rgba(0,0,0,0)',
  inputBackground: '#FFFFFF',
  white: '#ffffff',
  text: '#212529',
  primary: '#E14032',
  success: '#28a745',
  error: '#dc3545',
}

export const NavigationColors: Partial<ThemeNavigationColors> = {
  primary: Colors.primary,
}

/**
 * FontSize
 */
export const FontSize: ThemeFontSize = {
  small: 16,
  regular: 20,
  large: 40,
}

/**
 * Metrics Sizes
 */
const tiny = 5 // 10
const small = tiny * 2 // 10
const regular = tiny * 3 // 15
const large = regular * 2 // 30
export const MetricsSizes: ThemeMetricsSizes = {
  tiny,
  small,
  regular,
  large,
}

export const Spacings = {
  s_4: 4,
  s_8: 8,
  s_12: 12,
  s_16: 16,
  s_24: 24,
  s_32: 32,
  s_40: 40,
  s_48: 48,
}

export const Radiuses = {
  r4: 4,
  r8: 8,
}

export const FontSizes = {
  f10: 10,
  f12: 12,
  f14: 14,
  f16: 16,
  f20: 20,
  f30: 30,
  f40: 40,
}
export const FontColors = {
  white: {
    color: 'white',
  } as TextStyle,
  red: {
    color: 'red',
  } as TextStyle,
  black: {
    color: 'black',
  } as TextStyle,
}

// - text-display-64,
// - text-heading-40,
// - text-subheading-20,
// - text-paragraph-12,
// - text-body-16,
// - text-caption-12,
// - text-label-14
// fontFamily?: string;
// fontSize?: number;
// fontStyle?: 'normal' | 'italic';
// fontWeight?: 'normal' | 'bold' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900';
// letterSpacing?: number;
// lineHeight?: number;
export const Fonts = {
  textCaption30: {
    fontSize: FontSizes.f30,
    fontStyle: 'normal',
    fontWeight: 'normal',
    // fontFamily: '',
    // letterSpacing?: number;
    // lineHeight?: number;
  } as TextStyle,
  textSmall: {
    fontSize: FontSizes.f12,
    fontStyle: 'normal',
    fontWeight: 'normal',
    // fontFamily: '',
    // letterSpacing?: number;
    // lineHeight?: number;
  } as TextStyle,
  textRegular: {
    fontSize: FontSizes.f20,
    fontStyle: 'normal',
    fontWeight: 'normal',
  } as TextStyle,
  textLarge: {
    fontSize: FontSizes.f40,
    fontStyle: 'normal',
    fontWeight: 'normal',
  } as TextStyle,
  titleSmall: {
    fontSize: FontSize.small * 2,
    fontWeight: 'bold',
  } as TextStyle,
  titleRegular: {
    fontSize: FontSize.regular * 2,
    fontWeight: 'bold',
  } as TextStyle,
}
