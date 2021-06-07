import React, { ReactElement } from 'react'
import { StyleSheet, Text, TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native'
import { DefaultProps } from '@/common/props'
import { useNavigation } from '@react-navigation/native'
import { Colors, Fonts, Spacings } from '@/theme/Variables'
import BackArrow from '@/components/BackArrow'

const BackButton: React.FC<{
  onPress?: () => void
  testID?: string
}> = ({ onPress }): ReactElement => {
  const { goBack } = useNavigation()
  return (
    <TouchableOpacity
      style={[styles.barItem, styles.backButton]}
      onPress={() => {
        goBack()
        onPress && onPress()
      }}
    >
      <BackArrow />
    </TouchableOpacity>
  )
}

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
      return <BackButton onPress={props.backButtonAction} />
    }
    return props.left
  }

  const mergedRootContainerStyle = [
    styles.rootContainer,
    {
      height: NAVIGATION_BAR_HEIGHT,
      backgroundColor: props.backgroundColor || Colors.mineShaft,
    },
    props.hideShadow
      ? {}
      : {
          shadowColor: '#000',
          shadowOffset: { width: 1, height: 2 },
          shadowOpacity: 0.6,
          shadowRadius: 32,
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
  rootContainer: {
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
  barItem: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    textAlign: 'center',
    color: Colors.lightGray,
    ...Fonts.titleNormal,
  } as TextStyle,
  backButton: {
    padding: Spacings.s_8,
  },
})
