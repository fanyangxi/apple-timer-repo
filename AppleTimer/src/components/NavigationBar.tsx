import React, { ReactElement } from 'react'
import { StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native'
import { DefaultProps } from '@/common/props'
import { Colors, Fonts, Spacings } from '@/theme/Variables'
import { GoBackButton } from '@/components/button/GoBackButton'

// const STATUS_BAR_HEIGHT = Platform.select({ ios: 23, android: StatusBar.currentHeight || 0, default: 25 })
const NAVIGATION_BAR_HEIGHT = 44

export interface NavigationBarProps extends DefaultProps {
  style?: ViewStyle
  backgroundColor?: string
  //
  title: string
  hideShadow?: boolean
  //
  left?: ReactElement
  right?: ReactElement
  showBackButton: boolean
  backButtonAction?: () => void
}

export const NavigationBar: React.FC<NavigationBarProps> = props => {
  const renderLeft = () => {
    if (props.showBackButton) {
      return <GoBackButton onPress={props.backButtonAction} />
    }
    return props.left
  }

  const mergedRootContainerStyle = [
    styles.contentContainer,
    {
      height: NAVIGATION_BAR_HEIGHT,
      backgroundColor: props.backgroundColor || Colors.mineShaft,
    },
    props.hideShadow
      ? {}
      : {
          shadowColor: '#000',
          shadowOffset: { width: 0.1, height: 2 },
          shadowOpacity: 0.6,
          shadowRadius: 2,
          elevation: 4,
        },
    props.style,
  ]

  return (
    <View style={{ overflow: 'hidden', paddingBottom: 4 }}>
      <View style={mergedRootContainerStyle}>
        <View style={styles.body}>
          <Text style={styles.title}>{props.title}</Text>
        </View>
        <View style={styles.left}>{renderLeft()}</View>
        <View style={styles.right}>{props.right}</View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  contentContainer: {
    height: NAVIGATION_BAR_HEIGHT,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'stretch',
    zIndex: 999,
  },
  body: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: 'lightblue',
  },
  left: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacings.s_8,
    position: 'absolute',
    height: '100%',
    left: 0,
    // backgroundColor: 'yellow',
  },
  right: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacings.s_8,
    position: 'absolute',
    height: '100%',
    right: 0,
    // backgroundColor: 'yellow',
  },
  title: {
    textAlign: 'center',
    color: Colors.lightGray,
    ...Fonts.titleRegular,
  } as TextStyle,
})
