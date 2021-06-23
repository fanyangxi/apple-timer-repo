import * as React from 'react'
import { ImageSourcePropType, StyleProp, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native'
import { ReactElement } from 'react'
import { DefaultProps } from '@/common/props'

export interface BarItemProps extends DefaultProps {
  icon: ImageSourcePropType
  onPress: () => void
}

export const SvgButton: React.FC<{
  onPress: () => void
  icon: Element
  testID?: string
  style?: StyleProp<ViewStyle>
}> = ({ onPress, icon, style }): ReactElement => {
  return (
    <TouchableOpacity style={[styles.barItem, style]} onPress={onPress}>
      {icon}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  barItem: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: 20,
    height: 20,
  },
})
