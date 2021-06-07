import * as React from 'react'
import { Image, ImageSourcePropType, StyleSheet, TouchableOpacity } from 'react-native'
import { ReactElement } from 'react'
import { DefaultProps } from '@/common/props'

export interface BarItemProps extends DefaultProps {
  icon: ImageSourcePropType
  onPress: () => void
}

export const ImageButton: React.FC<{
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

const styles = StyleSheet.create({
  barItem: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
})
