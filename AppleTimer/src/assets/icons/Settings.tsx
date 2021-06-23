/* eslint-disable max-len */
import * as React from 'react'
import Svg, { SvgProps, Path } from 'react-native-svg'

const SvgSettings = (props: SvgProps) => (
  <Svg width="100%" height="100%" viewBox="0 0 484.371 484.371" {...props}>
    <Path
      d="M484.371 282.306v-80.24l-59.022-12.535a185.49 185.49 0 00-16.463-39.577l32.92-50.623-56.748-56.748-50.623 32.92a181.803 181.803 0 00-39.594-16.433L282.306 0h-80.24l-12.535 59.022a185.49 185.49 0 00-39.577 16.463l-50.623-32.92-56.748 56.749 32.92 50.623a185.49 185.49 0 00-16.463 39.577L0 202.066v80.24l59.07 12.535a181.788 181.788 0 0016.392 39.577l-32.92 50.623 56.748 56.748 50.623-32.92a185.49 185.49 0 0039.577 16.463l12.576 59.04h80.24l12.535-59.07a185.29 185.29 0 0039.577-16.392l50.623 32.92 56.748-56.748-32.92-50.623a185.235 185.235 0 0016.433-39.618zm-242.15 64.321c-57.681.02-104.457-46.724-104.477-104.406-.02-57.681 46.724-104.457 104.406-104.477 57.681-.02 104.457 46.724 104.477 104.406.01 57.677-46.729 104.448-104.406 104.477z"
      fill={props.color || '#000'}
    />
  </Svg>
)

export default SvgSettings