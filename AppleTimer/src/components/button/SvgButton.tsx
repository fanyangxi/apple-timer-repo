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
  disabled?: boolean
  testID?: string
  style?: StyleProp<ViewStyle>
}> = ({ onPress, icon, disabled, style }): ReactElement => {
  const disablingStyle = disabled ? { opacity: 0.3 } : {}
  return (
    <TouchableOpacity style={[styles.barItem, style, disablingStyle]} onPress={onPress} disabled={disabled}>
      {icon}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  barItem: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: 'green',
  },
})
