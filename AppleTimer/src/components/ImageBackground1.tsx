import * as React from 'react'
import { ReactElement } from 'react'
import { Image } from 'react-native'
import { assets } from '@/assets'

export const ImageBackground1: React.FC = (): ReactElement => {
  return (
    <Image
      source={assets.images.darkBackground}
      resizeMode={'repeat'}
      resizeMethod={'resize'}
      style={{ flex: 1, width: undefined, height: undefined }}
    />
  )
}

// import * as React from 'react'
// import { ReactElement } from 'react'
// import { Image, ImageBackground } from 'react-native'
// import { assets } from '@/assets'
//
// export const ImageBackground1: React.FC = (): ReactElement => {
//   return (
//     <ImageBackground
//       source={assets.images.darkBackground}
//       imageStyle={{ resizeMode: 'repeat', overflow: 'hidden', backfaceVisibility: 'hidden', flex: 1 }}
//       resizeMode={'repeat'}
//       resizeMethod={'resize'}
//       style={{ flex: 1, width: undefined, height: undefined }}
//     />
//   )
// }
