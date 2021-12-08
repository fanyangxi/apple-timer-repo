/* eslint-disable */
import * as React from 'react'
import Svg, { SvgProps, G, Path } from 'react-native-svg'

const SvgList = (props: SvgProps) => (
  <Svg width="100%" height="100%" viewBox="6 6 36 36" fill="none" {...props}>
    <Path
      d="M10.001 10A2.001 2.001 0 008 12v2c0 1.104.896 2 2.001 2H12a2.001 2.001 0 002.001-2v-2A2.001 2.001 0 0012 10h-1.999zm0 10A2 2 0 008 22v2a2 2 0 002.001 2H12a2 2 0 002.001-2v-2A2 2 0 0012 20h-1.999zm0 10A2.001 2.001 0 008 32v2c0 1.104.896 2 2.001 2H12a2.001 2.001 0 002.001-2v-2A2.001 2.001 0 0012 30h-1.999zm8-20A2.001 2.001 0 0016 12v2c0 1.104.896 2 2.001 2h19.997A2.001 2.001 0 0040 14v-2a2.001 2.001 0 00-2.002-2H18.001zm0 10A2 2 0 0016 22v2a2 2 0 002.001 2h19.997A2 2 0 0040 24v-2a2 2 0 00-2.002-2H18.001zm0 10A2.001 2.001 0 0016 32v2c0 1.104.896 2 2.001 2h19.997A2.001 2.001 0 0040 34v-2a2.001 2.001 0 00-2.002-2H18.001z"
      fill={props.color || '#000'}
    />
  </Svg>
)

export default SvgList
