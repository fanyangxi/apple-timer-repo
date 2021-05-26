import * as default_dark from './default_dark'
import { Theme } from '@/theme2/theme.type'

type Themes = { [key: string]: Partial<Theme> }

export default {
  default_dark,
} as Themes
