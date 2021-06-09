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

const ScreenContainer: React.FC<Props> = ({
  backgroundComponent,
  children,
  style,
  topInsetBackgroundColor,
  bottomInsetBackgroundColor,
}) => {
  const insets = useSafeAreaInsets()
  const backgroundStyle: StyleProp<ViewStyle> = backgroundComponent
    ? undefined
    : { backgroundColor: Colors.lineDarkest }
  return (
    <View style={styles.screenRoot}>
      {backgroundComponent && <View style={styles.background}>{backgroundComponent()}</View>}
      <View style={[styles.top, { height: insets.top, backgroundColor: topInsetBackgroundColor }]} />
      <View style={[styles.content, { marginLeft: insets.left, marginRight: insets.right }, backgroundStyle, style]}>
        {children}
      </View>
      <View style={[styles.bottom, { height: insets.bottom, backgroundColor: bottomInsetBackgroundColor }]} />
    </View>
  )
}

const styles = StyleSheet.create({
  screenRoot: {
    flex: 1,
  },
  background: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: '100%',
    height: '100%',
  },
  top: {
    // backgroundColor: 'red',
  },
  content: {
    flex: 1,
    // backgroundColor: 'grey',
  },
  bottom: {
    // backgroundColor: 'blue',
  },
})

export default ScreenContainer
