import React from 'react'
import { FlexStyle, LayoutChangeEvent, StatusBar, StyleProp, StyleSheet, View, ViewStyle } from 'react-native'
import { Colors } from '@/theme/Variables'
import { SafeAreaView } from 'react-native-safe-area-context'

export interface DefaultProps {
  testID?: string
  onLayout?: (event: LayoutChangeEvent) => void
  layout?: StyleProp<FlexStyle>
}

export enum BackgroundType {
  light = 'light',
  dark = 'dark',
}

export interface Props extends DefaultProps {
  backgroundType?: BackgroundType
  style?: StyleProp<ViewStyle>
}

const ScreenContainer: React.FC<Props> = props => {
  let backgroundStyle: StyleProp<ViewStyle> = {}
  if (props.backgroundType && props.backgroundType === BackgroundType.light) {
    backgroundStyle = { backgroundColor: Colors.text }
  }
  return (
    <SafeAreaView style={[styles.screen, props.style, backgroundStyle]}>
      <StatusBar barStyle={'light-content'} backgroundColor={'transparent'} />
      {props.children}
    </SafeAreaView>
  )
}

export const ScreenContent: React.FC<Props> = props => (
  <View style={[styles.content, props.style]}>{props.children}</View>
)

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.primary,
  },
  content: {
    flex: 1,
    paddingHorizontal: Colors.primary,
  },
})

export default ScreenContainer
