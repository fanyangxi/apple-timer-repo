import * as React from 'react'
import { Colors } from '@/theme/Variables'
import { SvgButton } from '@/components/button/SvgButton'
import SvgList from '@/assets/icons/List'
import { Color } from 'react-native-svg'

export const ListButton: React.FC<{
  color?: Color
  onPress?: () => void
  testID?: string
}> = ({ color, onPress }) => {
  return (
    <SvgButton
      style={{ width: 40, height: 40 }}
      icon={<SvgList color={color ?? Colors.white} width={24} height={24} style={{ margin: 8 }} />}
      onPress={() => {
        onPress && onPress()
      }}
    />
  )
}
