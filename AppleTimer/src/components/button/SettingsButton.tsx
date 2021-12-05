import * as React from 'react'
import SvgSettings from '@/assets/icons/Settings'
import { Colors } from '@/theme/Variables'
import { SvgButton } from '@/components/button/SvgButton'

export const SettingsButton: React.FC<{
  onPress?: () => void
  testID?: string
}> = ({ onPress }) => {
  return (
    <SvgButton
      style={{ width: 32, height: 32 }}
      icon={<SvgSettings color={Colors.white} width={20} height={20} style={{ margin: 8 }} />}
      onPress={() => {
        onPress && onPress()
      }}
    />
  )
}
