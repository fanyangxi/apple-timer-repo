import * as React from 'react'
import { ReactElement } from 'react'
import { Image } from 'react-native'
import { assets } from '@/assets'

export const ImageBackground1: React.FC = (): ReactElement => {
  return (
    <Image
      source={assets.images.darkBackground}
      resizeMode={'repeat'}
      style={{ flex: 1, width: undefined, height: undefined }}
    />
  )
}
