/* eslint-disable */
import * as React from 'react'
import Svg, { SvgProps, Path } from 'react-native-svg'

const BackArrow = (props: SvgProps) => (
  <Svg width={9} height={16} fill="none" {...props}>
    <Path
      d="M7.521 16L9 14.59 2.839 8.707a.968.968 0 010-1.414l6.16-5.883L7.522 0 .614 6.586a1.935 1.935 0 000 2.828L7.521 16z"
      fill={props.color || '#000'}
    />
  </Svg>
)

export default BackArrow
