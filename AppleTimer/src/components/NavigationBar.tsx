import React, { ReactElement } from 'react'
import {
  Image,
  ImageSourcePropType,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native'
import { DefaultProps } from '@/common/props'
import { useNavigation } from '@react-navigation/native'
// import { HEADER_HEIGHT, STATUS_BAR_HEIGHT } from './Device'
// import { ColorType, defaultColor, defaultShadow, FontWeight } from '../../src/constants/theme'
// import { useNavigation } from 'react-navigation-hooks'
import { Colors, defaultShadow } from '@/theme/Variables'
import BackArrow from '@/components/BackArrow'

export interface BarItemProps extends DefaultProps {
  icon: ImageSourcePropType
  onPress: () => void
}

export interface NavigationBarProps extends DefaultProps {
  style?: ViewStyle
  backgroundColor?: string
  title: string
  titleColor?: string
  titleTestID?: string
  showBackButton: boolean
  backButtonAction?: () => void
  backButtonTestID?: string
  hideShadow?: boolean
  actionButton?: BarItemProps
}

const BackButton: React.FC<{
  onPress?: () => void
  testID?: string
}> = ({ onPress, testID }): ReactElement => {
  const { goBack } = useNavigation()
  return (
    <TouchableOpacity
      style={styles.barItem}
      onPress={() => {
        goBack()
        onPress && onPress()
      }}
      testID={testID || 'back-button'}
    >
      <BackArrow />
    </TouchableOpacity>
  )
}

const ActionButton: React.FC<{
  onPress: () => void
  icon: ImageSourcePropType
  testID?: string
}> = ({ onPress, icon, testID }): ReactElement => {
  return (
    <TouchableOpacity style={styles.barItem} onPress={onPress} testID={testID || 'action-button'}>
      <Image source={icon} />
    </TouchableOpacity>
  )
}

export const STATUS_BAR_HEIGHT = Platform.select({ ios: 23, android: StatusBar.currentHeight || 0, default: 25 })
export const HEADER_HEIGHT = 44

export const NavigationBar: React.FC<NavigationBarProps> = props => {
  const headerStyle = [
    styles.header,
    {
      height: STATUS_BAR_HEIGHT + HEADER_HEIGHT,
      paddingTop: STATUS_BAR_HEIGHT,
      backgroundColor: props.backgroundColor || Colors.primary,
    },
    props.hideShadow ? {} : defaultShadow,
    props.style,
  ]
  // const titleColor = props.titleColor ? props.titleColor : Colors.text

  return (
    <View style={headerStyle}>
      <View style={styles.left}>
        {props.showBackButton ? <BackButton onPress={props.backButtonAction} testID={props.backButtonTestID} /> : null}
      </View>
      <Text style={styles.title}>{props.title}</Text>
      <View style={styles.right}>
        {props.actionButton && (
          <ActionButton
            onPress={props.actionButton.onPress}
            icon={props.actionButton.icon}
            testID={'props.actionButton.testID'}
          />
        )}
      </View>
    </View>
  )
}

const barItemWidth = 50
const styles = StyleSheet.create({
  header: {
    height: HEADER_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 999,
  },
  title: {
    flex: 1,
    textAlign: 'center',
    color: Colors.text,
  },
  left: {
    width: barItemWidth,
  },
  right: {
    width: barItemWidth,
  },
  barItem: {
    width: barItemWidth,
    height: HEADER_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  },
})
