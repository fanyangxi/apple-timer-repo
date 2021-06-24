/* eslint-disable max-len */
import * as React from 'react'
import Svg, { SvgProps, Path } from 'react-native-svg'

const SvgFinish = (props: SvgProps) => (
  <Svg width="100%" height="100%" viewBox="0 0 510 510" fill="none" {...props}>
    <Path
      d="M150.45 206.55l-35.7 35.7L229.5 357l255-255-35.7-35.7-219.3 219.3-79.05-79.05zM459 255c0 112.2-91.8 204-204 204S51 367.2 51 255 142.8 51 255 51c20.4 0 38.25 2.55 56.1 7.65l40.801-40.8C321.3 7.65 288.15 0 255 0 114.75 0 0 114.75 0 255s114.75 255 255 255 255-114.75 255-255h-51z"
      fill={props.color || '#000'}
    />
  </Svg>
)

export default SvgFinish
