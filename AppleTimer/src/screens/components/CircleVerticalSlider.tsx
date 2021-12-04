import React from 'react'
import { StyleProp, View, ViewStyle } from 'react-native'
import Svg, { Path, Circle, G, Text } from 'react-native-svg'

export type CircleVerticalSliderProps = {
  // /** Size of Thumb*/
  // thumbRadius?: number
  /** Radius of the track-circle */
  trackRadius?: number
  /** Stroke width of the track-circle-path */
  trackStrokeWidth?: number
  /** Value between minValue to maxValue */
  value?: number
  /** Minimum value */
  minValue?: number
  /** Maximum value */
  maxValue?: number
  // /** onChange Handler */
  // onChange?: (angle: number) => any
  /** Color for Track Tint  */
  trackTintColor?: string
  /** Color for Track Tint Stroke */
  trackTintStrokeColor?: string
  /** Color for Track  */
  trackColor?: string
  /** Color for Track Stroke  */
  trackStrokeColor?: string
  // /** Color for Thumb  */
  // thumbColor?: string
  // /** Color for Text on Thumb  */
  // thumbTextColor?: string
  // /** Font size for Text on Thumb  */
  // thumbTextSize?: number
  // /** Show text on center of thumb  */
  // showThumbText?: boolean
  // /** Show Thumb on Track  */
  // noThumb?: boolean
  // /** Show text on center of circle  */
  // showText?: boolean
  // /** Text color for center of circle  */
  // textColor?: string
  // /** Text Size for center of circle  */
  // textSize?: number
  // /** Maximum arc angle in degrees i.e. its range is 0 to 359  */
  // maxAngle?: number
  // /** Minimum arc angle in degrees i.e. its range is 0 to 359  */
  // minAngle?: number
  /** Custom styles **/
  style?: StyleProp<ViewStyle>
}

interface Coordinate {
  x: number
  y: number
}

const CircleVerticalSlider: React.FC<CircleVerticalSliderProps> = ({
  /** prop1 description */
  // thumbRadius = 12,
  // trackRadius = 50,
  // trackWidth = 5,
  trackRadius = 50,
  trackStrokeWidth = 0,
  value = 10,
  minValue = 0,
  maxValue = 100,
  trackTintColor = '#3C3C3C',
  trackTintStrokeColor = '#3C3C3C',
  trackColor = '#E5D996',
  trackStrokeColor = '#E5D996',
  // minAngle = 179.9,
  // maxAngle = 359.9, // 359.9, 179.9
  // onChange,
  // thumbTextColor = 'white',
  // thumbTextSize = 10,
  // noThumb = false,
  // showText = false,
  // showThumbText = false,
  // thumbColor = '#2089dc',
  // textColor = '#2089dc',
  // textSize = 80,
  style,
}) => {
  const location = React.useRef({ x: 0, y: 0 })
  const viewRef = React.useRef<View>(null)

  // value-percentage: range is from 0.0 ~ 1.0;
  const toCartesianCoords = (
    centerX: number,
    centerY: number,
    radius: number,
    valuePercentage: number,
  ): [{ x: number; y: number }, { x: number; y: number }] => {
    console.log(`>>> centerX:${centerX}, centerY:${centerY}, radius:${radius}, value-percentage:${valuePercentage}`)
    const safeValuePercentage = valuePercentage === 0 ? 0.0001 : valuePercentage
    const oc = 2 * radius * (1 - safeValuePercentage) - radius
    console.log(`>>> oc:${oc}`)
    const cb = Math.sqrt(Math.pow(radius, 2) - Math.pow(oc, 2))

    const leftCoord = { x: centerX - cb, y: centerY - oc }
    const rightCoord = { x: centerX + cb, y: centerY - oc }
    console.log(`>>> left:${JSON.stringify(leftCoord)}, right:${JSON.stringify(rightCoord)}`)
    return [leftCoord, rightCoord]
  }

  const width = trackRadius * 2 + trackStrokeWidth
  const centerCoord = { x: width / 2, y: width / 2 }
  const valuePercentage = value / (2 * trackRadius)
  const [startCoord, endTintCoord] = toCartesianCoords(centerCoord.x, centerCoord.y, trackRadius, valuePercentage)

  return (
    <View
      style={[{ width, height: width }, style]}
      ref={viewRef}
      onLayout={() => {
        viewRef.current?.measure((x, y, w, h, px, py) => {
          location.current = {
            x: px + w / 2,
            y: py + h / 2,
          }
        })
      }}
    >
      <Svg width={width} height={width} ref={viewRef}>
        <Circle
          cx={centerCoord.x}
          cy={centerCoord.y}
          r={trackRadius}
          fill={trackTintColor}
          stroke={trackTintStrokeColor}
          strokeWidth={trackStrokeWidth}
        />
        <Path
          fill={trackColor}
          stroke={trackStrokeColor}
          strokeWidth={trackStrokeWidth}
          d={[
            'M',
            startCoord.x,
            startCoord.y,
            'A',
            trackRadius,
            trackRadius,
            0,
            valuePercentage <= 0.5 ? '1' : '0',
            0,
            endTintCoord.x,
            endTintCoord.y,
            'z',
          ].join(' ')}
        />
      </Svg>
    </View>
  )
}
CircleVerticalSlider.defaultProps = {}

export default CircleVerticalSlider
