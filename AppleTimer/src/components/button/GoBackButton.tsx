import * as React from 'react'
import { Colors } from '@/theme/Variables'
import { SvgButton } from '@/components/button/SvgButton'
import { ReactElement } from 'react'
import { useNavigation } from '@react-navigation/native'
import BackArrow from '@/assets/icons/BackArrow'

export const GoBackButton: React.FC<{
  onPress?: () => void
  testID?: string
}> = ({ onPress }): ReactElement => {
  const { goBack } = useNavigation()
  return (
    <SvgButton
      style={{ width: 32, height: 32 }}
      icon={<BackArrow color={Colors.white} style={{ margin: 8 }} />}
      onPress={() => {
        goBack()
        onPress && onPress()
      }}
    />
  )
}
