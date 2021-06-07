import React from 'react'
import { FlexStyle, LayoutChangeEvent, StatusBar, StyleProp, StyleSheet, View, ViewStyle } from 'react-native'
import { Colors } from '@/theme/Variables'
import { SafeAreaView } from 'react-native-safe-area-context'

export interface DefaultProps {
  testID?: string
  onLayout?: (event: LayoutChangeEvent) => void
  layout?: StyleProp<FlexStyle>
}

export interface Props extends DefaultProps {
  backgroundComponent?: () => React.ReactElement
  style?: StyleProp<ViewStyle>
}

const ScreenContainer: React.FC<Props> = ({ backgroundComponent, children, style }) => {
  const backgroundStyle: StyleProp<ViewStyle> = backgroundComponent ? undefined : { backgroundColor: Colors.text }
  return (
    <View style={styles.screenRoot}>
      {backgroundComponent && <View style={styles.background}>{backgroundComponent()}</View>}
      <SafeAreaView style={[styles.content, style, backgroundStyle]}>
        <StatusBar barStyle={'light-content'} backgroundColor={'transparent'} />
        {children}
      </SafeAreaView>
    </View>
  )
}

const styles = StyleSheet.create({
  screenRoot: {
    flex: 1,
  },
  content: {
    flex: 1,
    zIndex: 2,
  },
  background: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: '100%',
    height: '100%',
  },
})

export default ScreenContainer
