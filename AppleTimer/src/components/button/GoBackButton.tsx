import * as React from 'react'
import { Colors } from '@/theme/Variables'
import { SvgButton } from '@/components/button/SvgButton'
import { ReactElement } from 'react'
import { useNavigation } from '@react-navigation/native'
import BackArrow from '@/assets/icons/BackArrow'

export const GoBackButton: React.FC<{
  onPress?: () => void
  disabled?: boolean
  testID?: string
}> = ({ onPress, disabled }): ReactElement => {
  const { goBack } = useNavigation()
  return (
    <SvgButton
      style={{ width: 40, height: 40 }}
      disabled={disabled}
      icon={<BackArrow color={Colors.white} style={{ margin: 8 }} />}
      onPress={() => {
        onPress ? onPress() : goBack()
      }}
    />
  )
}
