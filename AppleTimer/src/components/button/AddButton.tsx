import * as React from 'react'
import { Colors } from '@/theme/Variables'
import { SvgButton } from '@/components/button/SvgButton'
import SvgAdd from '@/assets/icons/Add'
import { Color } from 'react-native-svg'

export const AddButton: React.FC<{
  color?: Color
  onPress?: () => void
  disabled?: boolean
  testID?: string
}> = ({ color, onPress, disabled }) => {
  return (
    <SvgButton
      style={{ width: 40, height: 40 }}
      disabled={disabled}
      icon={<SvgAdd color={color ?? Colors.white} width={22} height={22} style={{ margin: 8 }} />}
      onPress={() => {
        onPress && onPress()
      }}
    />
  )
}
