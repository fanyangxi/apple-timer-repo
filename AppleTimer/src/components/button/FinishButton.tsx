import * as React from 'react'
import { Colors } from '@/theme/Variables'
import { SvgButton } from '@/components/button/SvgButton'
import SvgFinish from '@/assets/icons/Finish'
import { Color } from 'react-native-svg'

export const FinishButton: React.FC<{
  color?: Color
  onPress?: () => void
  disabled?: boolean
  testID?: string
}> = ({ color, onPress, disabled }) => {
  return (
    <SvgButton
      style={{ width: 40, height: 40 }}
      disabled={disabled}
      icon={<SvgFinish color={color ?? Colors.white} width={21} height={21} style={{ margin: 8 }} />}
      onPress={() => {
        onPress && onPress()
      }}
    />
  )
}
