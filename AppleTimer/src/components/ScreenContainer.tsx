import React from 'react'
import { ColorValue, StyleProp, StyleSheet, View, ViewStyle } from 'react-native'
import { Colors } from '@/theme/Variables'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { DefaultProps } from '@/common/props'

export interface Props extends DefaultProps {
  backgroundComponent?: () => React.ReactElement
  style?: StyleProp<ViewStyle>
  topInsetBackgroundColor?: ColorValue
  bottomInsetBackgroundColor?: ColorValue
}

const ScreenContainer: React.FC<Props> = ({ backgroundComponent, children, style }) => {
  const insets = useSafeAreaInsets()
  const backgroundStyle: StyleProp<ViewStyle> = backgroundComponent ? undefined : { backgroundColor: Colors.text }
  return (
    <View style={styles.screenRoot}>
      {backgroundComponent && <View style={styles.background}>{backgroundComponent()}</View>}
      <View style={[styles.top, { height: insets.top }]} />
      <View style={[styles.content, style, backgroundStyle]}>{children}</View>
      <View style={[styles.bottom, { height: insets.bottom }]} />
    </View>
  )
}

const styles = StyleSheet.create({
  screenRoot: {
    flex: 1,
  },
  content: {
    flex: 1,
    backgroundColor: 'grey',
  },
  background: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: '100%',
    height: '100%',
  },
  top: {
    // flex: 1,
    backgroundColor: 'red',
  },
  bottom: {
    // flex: 1,
    backgroundColor: 'blue',
  },
})

export default ScreenContainer
