import React, { useImperativeHandle, useRef, useState } from 'react'
import { Animated, Easing, StyleProp, View, ViewStyle } from 'react-native'
import Svg, { Path, Circle } from 'react-native-svg'

export type CircleVerticalSliderRefObject = {
  startOrResumeAnim: () => void
  pauseAnim: () => void
  stopAndResetAnim: () => void
}

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
  animationDurationMs: number
  onAnimationFinished?: () => void
}

interface Coordinate {
  x: number
  y: number
}

const CircleVerticalSlider: React.FC<CircleVerticalSliderProps> = React.forwardRef((props, ref) => {
  const {
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
    animationDurationMs,
    onAnimationFinished,
  } = props
  const location = React.useRef({ x: 0, y: 0 })
  const viewRef = React.useRef<View>(null)

  const trackPathRef = React.useRef()
  const currentValueRef = useRef<number>(value)
  const [theAnimValue] = useState(new Animated.Value(value))

  useImperativeHandle(ref, () => ({
    startOrResumeAnim() {
      _startOrResumeAnim()
    },
    pauseAnim() {
      _pauseAnim()
    },
    stopAndResetAnim() {
      _stopAndResetAnim()
    },
  }))

  const width = trackRadius * 2 + trackStrokeWidth
  // noinspection JSSuspiciousNameCombination
  const height = width
  const centerCoord = { x: width / 2, y: width / 2 }

  // value-percentage: range is from 0.0 ~ 1.0;
  const toCartesianCoords = (
    centerX: number,
    centerY: number,
    radius: number,
    valuePercentage: number,
  ): [{ x: number; y: number }, { x: number; y: number }] => {
    const safeValuePercentage = valuePercentage === 0 ? 0.0001 : valuePercentage
    const oc = 2 * radius * (1 - safeValuePercentage) - radius
    const cb = Math.sqrt(Math.pow(radius, 2) - Math.pow(oc, 2))

    const leftCoord = { x: centerX - cb, y: centerY - oc }
    const rightCoord = { x: centerX + cb, y: centerY - oc }
    return [leftCoord, rightCoord]
  }

  const calculate = (inputValue: number): [number, { x: number; y: number }, { x: number; y: number }] => {
    const valuePercentage = (inputValue - minValue) / (maxValue - minValue)
    const [startCoord, endCoord] = toCartesianCoords(centerCoord.x, centerCoord.y, trackRadius, valuePercentage)
    return [valuePercentage, startCoord, endCoord]
  }

  const [initialValuePercentage, initialStartCoord, initialEndCoord] = calculate(value)

  const _startOrResumeAnim = () => {
    theAnimValue.addListener(theValue => {
      const [valuePercentage, startCoord, endCoord] = calculate(theValue.value)
      // @ts-ignore
      trackPathRef.current?.setNativeProps({
        d: [
          'M',
          startCoord.x,
          startCoord.y,
          'A',
          trackRadius,
          trackRadius,
          0,
          valuePercentage <= 0.5 ? '1' : '0',
          0,
          endCoord.x,
          endCoord.y,
          'z',
        ].join(' '),
      })
    })

    const remainingPercentage = (maxValue - currentValueRef.current) / (maxValue - minValue)

    Animated.timing(theAnimValue, {
      toValue: maxValue,
      duration: animationDurationMs * remainingPercentage,
      easing: Easing.linear,
      // Config to 'False', to suppress the warning: `Sending "onAnimatedValueUpdate" with no listeners registered.`
      useNativeDriver: false,
    }).start(result => {
      if (result.finished) {
        onAnimationFinished && onAnimationFinished()
      }
    })
  }

  const _pauseAnim = () => {
    theAnimValue.stopAnimation(stoppedAt => {
      console.log(`IN:pauseAnim:${stoppedAt}`)
      currentValueRef.current = stoppedAt
    })
  }

  const _stopAndResetAnim = () => {
    theAnimValue.stopAnimation(() => {
      console.log('IN:stopAndResetAnim:')
      theAnimValue.setValue(minValue)
      currentValueRef.current = minValue
    })
  }

  return (
    <View
      style={[{ width, height }, style]}
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
            initialStartCoord.x,
            initialStartCoord.y,
            'A',
            trackRadius,
            trackRadius,
            0,
            initialValuePercentage <= 0.5 ? '1' : '0',
            0,
            initialEndCoord.x,
            initialEndCoord.y,
            'z',
          ].join(' ')}
          // @ts-ignore
          ref={trackPathRef}
        />
      </Svg>
    </View>
  )
})
CircleVerticalSlider.defaultProps = {}

export default CircleVerticalSlider
