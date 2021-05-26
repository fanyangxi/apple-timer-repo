import { ThemeImages, ThemeVariables } from '@/theme2/theme.type'

/**
 *
 * @param Theme can be spread like {Colors, NavigationColors, Gutters, Layout, Common, ...args}
 * @return {*}
 */
export default function ({}: ThemeVariables): ThemeImages {
  return {
    logo: require('@/Assets/Images/TOM.png'),
  }
}
