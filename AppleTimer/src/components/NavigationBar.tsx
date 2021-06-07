import React, { ReactElement } from 'react'
import {
  Image,
  ImageSourcePropType,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native'
import { DefaultProps } from '@/common/props'
import { useNavigation } from '@react-navigation/native'
// import { HEADER_HEIGHT, STATUS_BAR_HEIGHT } from './Device'
// import { ColorType, defaultColor, defaultShadow, FontWeight } from '../../src/constants/theme'
// import { useNavigation } from 'react-navigation-hooks'
import { Colors, Fonts, Spacings } from '@/theme/Variables'
import BackArrow from '@/components/BackArrow'

export interface BarItemProps extends DefaultProps {
  icon: ImageSourcePropType
  onPress: () => void
}

const BackButton: React.FC<{
  onPress?: () => void
  testID?: string
}> = ({ onPress }): ReactElement => {
  const { goBack } = useNavigation()
  return (
    <TouchableOpacity
      style={styles.barItem}
      onPress={() => {
        goBack()
        onPress && onPress()
      }}
    >
      <BackArrow />
    </TouchableOpacity>
  )
}

const ActionButton: React.FC<{
  onPress: () => void
  icon: ImageSourcePropType
  testID?: string
}> = ({ onPress, icon }): ReactElement => {
  return (
    <TouchableOpacity style={styles.barItem} onPress={onPress}>
      <Image source={icon} />
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
  showBackButton: boolean
  backButtonAction?: () => void
  hideShadow?: boolean
  actionButton?: BarItemProps
}

export const NavigationBar: React.FC<NavigationBarProps> = props => {
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
        <View style={styles.left}>{props.showBackButton ? <BackButton onPress={props.backButtonAction} /> : null}</View>
        <View style={styles.right}>
          {props.actionButton && <ActionButton onPress={props.actionButton.onPress} icon={props.actionButton.icon} />}
        </View>
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
})
