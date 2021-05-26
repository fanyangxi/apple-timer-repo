import * as React from 'react'
import Svg, { SvgProps, Path, Circle } from 'react-native-svg'

const SvgAlertBell = (props: SvgProps) => (
  <Svg width={64} height={64} fill="none" {...props}>
    <Path
      d="M38 44.354c0 3.226-2.5 5.771-5.5 5.771S27 47.58 27 44.355c0-.12.003-.238.01-.355h10.98c.007.117.01.235.01.354z"
      fill="#45BE93"
      stroke="#000"
      strokeWidth={2}
    />
    <Path
      d="M29.483 20.551l.11-.03.102-.052h0l.001-.001.009-.005.04-.02a10.273 10.273 0 01.733-.332c.487-.198.989-.352 1.331-.37.406-.022 1.01.127 1.603.339a10.486 10.486 0 01.895.37l.05.023.012.006h.001l.092.046.1.026c4.378 1.15 7.633 5.215 7.633 10.074v7.6c0 1.238.984 2.268 2.24 2.268.797 0 1.484.67 1.484 1.534 0 .861-.684 1.533-1.49 1.533H19.615c-.806 0-1.489-.67-1.489-1.533 0-.864.684-1.534 1.484-1.534 1.254 0 2.24-1.035 2.24-2.268v-7.6c0-4.86 3.256-8.925 7.634-10.074z"
      stroke="#000"
      strokeWidth={2}
    />
    <Path
      d="M21.85 30.625c0-4.833 3.217-8.878 7.557-10.054l.165-.015c.154-.015.37-.035.618-.056.5-.044 1.118-.093 1.62-.12.54-.029 1.244.016 1.843.073a24.814 24.814 0 01.945.11l.018.003c4.351 1.169 7.579 5.22 7.579 10.06v7.6c0 1.238.984 2.267 2.24 2.267.797 0 1.484.67 1.484 1.534 0 .861-.684 1.533-1.49 1.533H19.615c-.806 0-1.489-.67-1.489-1.533 0-.864.684-1.534 1.484-1.534 1.254 0 2.24-1.035 2.24-2.268v-7.6z"
      fill="#FFCE49"
      stroke="#000"
      strokeWidth={2}
    />
    <Circle
      cx={32}
      cy={16}
      r={4}
      fill="#FFCE49"
      stroke="#000"
      strokeWidth={2}
    />
  </Svg>
)

export default SvgAlertBell
