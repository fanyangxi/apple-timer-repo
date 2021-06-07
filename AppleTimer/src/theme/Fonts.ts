/**
 * This file contains all application's style relative to fonts
 */
import { StyleSheet } from 'react-native'
import { ThemeVariables, ThemeFonts } from '@/theme/theme.type'
import {FontSizes} from "@/theme/Variables";

/**
 *
 * @param Theme can be spread like {Colors, NavigationColors, Gutters, Layout, Common, ...args}
 * @return {*}
 */
export default function ({ Colors }: ThemeVariables): ThemeFonts {
  return StyleSheet.create({
    textSmall: {
      fontSize: FontSizes.f16,
      color: Colors.text,
    },
    textRegular: {
      fontSize: FontSizes.f20,
      color: Colors.text,
    },
    textLarge: {
      fontSize: FontSizes.f40,
      color: Colors.text,
    },
    titleSmall: {
      fontSize: FontSizes.f16 * 2,
      fontWeight: 'bold',
      color: Colors.text,
    },
    titleRegular: {
      fontSize: FontSizes.f20 * 2,
      fontWeight: 'bold',
      color: Colors.text,
    },
    titleLarge: {
      fontSize: FontSizes.f40 * 2,
      fontWeight: 'bold',
      color: Colors.text,
    },
    textCenter: {
      textAlign: 'center',
    },
    textJustify: {
      textAlign: 'justify',
    },
    textLeft: {
      textAlign: 'left',
    },
    textRight: {
      textAlign: 'right',
    },
  })
}
