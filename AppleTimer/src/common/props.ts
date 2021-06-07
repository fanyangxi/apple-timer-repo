import { FlexStyle, LayoutChangeEvent, StyleProp } from 'react-native'

export interface DefaultProps {
  testID?: string
  onLayout?: (event: LayoutChangeEvent) => void
  layout?: StyleProp<FlexStyle>
}
