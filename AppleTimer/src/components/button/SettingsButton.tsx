import * as React from 'react'
import SvgSettings from '@/assets/icons/Settings'
import { Colors } from '@/theme/Variables'
import { SvgButton } from '@/components/button/SvgButton'

export const SettingsButton: React.FC<{
  onPress?: () => void
  disabled?: boolean
  testID?: string
}> = ({ onPress, disabled }) => {
  return (
    <SvgButton
      style={{ width: 40, height: 40 }}
      disabled={disabled}
      icon={<SvgSettings color={Colors.white} width={20} height={20} style={{ margin: 8 }} />}
      onPress={() => {
        onPress && onPress()
      }}
    />
  )
}
