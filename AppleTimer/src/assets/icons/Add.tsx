/* eslint-disable */
import * as React from 'react'
import Svg, { SvgProps, Path } from 'react-native-svg'

const SvgAdd = (props: SvgProps) => (
  <Svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M12 1C5.9 1 1 5.9 1 12s4.9 11 11 11 11-4.9 11-11S18.1 1 12 1zm5 13h-3v3c0 1.1-.9 2-2 2s-2-.9-2-2v-3H7c-1.1 0-2-.9-2-2s.9-2 2-2h3V7c0-1.1.9-2 2-2s2 .9 2 2v3h3c1.1 0 2 .9 2 2s-.9 2-2 2z"
      fill={props.color || '#000'}
    />
  </Svg>
)

export default SvgAdd
