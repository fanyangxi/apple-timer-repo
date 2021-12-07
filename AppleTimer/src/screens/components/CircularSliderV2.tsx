import React, { useImperativeHandle, useRef, useState } from 'react'
import { Animated, Easing, StyleProp, View, ViewStyle } from 'react-native'
import Svg, { Path, Circle, G, Text } from 'react-native-svg'

export type CircularSliderRefObject = {
  startOrResumeAnim: () => void
  pauseAnim: () => void
  stopAndResetAnim: () => void
}

export type CircularSliderProps = {
  /** Radius of Circular Slider */
  trackRadius?: number
  /** Size of Thumb*/
  thumbRadius?: number
  /** Size of Track */
  trackWidth?: number
  /** Value between minValue to maxValue */
  value?: number
  /** Minimum value */
  minValue?: number
  /** Maximum value */
  maxValue?: number
  /** onChange Handler */
  onChange?: (angle: number) => any
  /** Color for Track  */
  trackColor?: string
  /** Color for Track Tint  */
  trackTintColor?: string
  /** Color for Thumb  */
  thumbColor?: string
  /** Color for Text on Thumb  */
  thumbTextColor?: string
  /** Font size for Text on Thumb  */
  thumbTextSize?: number
  /** Show text on center of thumb  */
  showThumbText?: boolean
  /** Show Thumb on Track  */
  noThumb?: boolean
  /** Show text on center of circle  */
  showText?: boolean
  /** Text color for center of circle  */
  textColor?: string
  /** Text Size for center of circle  */
  textSize?: number
  /** Maximum arc angle in degrees i.e. its range is 0 to 359  */
  maxAngle?: number
  /** Minimum arc angle in degrees i.e. its range is 0 to 359  */
  minAngle?: number
  /** Custom styles **/
  style?: StyleProp<ViewStyle>
  animationDurationMs: number
  onAnimationFinished?: () => void
}

const CircularSliderV2: React.FC<CircularSliderProps> = React.forwardRef((props, ref) => {
  const {
    /** prop1 description */
    thumbRadius = 12,
    trackRadius = 50,
    trackWidth = 5,
    trackTintColor = '#e1e8ee',
    trackColor = '#2089dc',
    value = 80,
    minValue = 60,
    maxValue = 100,
    minAngle = 179.9,
    maxAngle = 359.9, // 359.9, 179.9
    onChange,
    thumbTextColor = 'white',
    thumbTextSize = 10,
    noThumb = false,
    showText = false,
    showThumbText = false,
    thumbColor = '#2089dc',
    textColor = '#2089dc',
    textSize = 80,
    style,
    animationDurationMs,
    onAnimationFinished,
  } = props
  const location = React.useRef({ x: 0, y: 0 })
  const viewRef = React.useRef<View>(null)

  const trackPathRef = React.useRef()
  const trackThumbRef = React.useRef()
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

  const polarToCartesian = React.useCallback(
    (angleToChange: number) => {
      let r = trackRadius
      let hC = trackRadius + Math.max(thumbRadius, trackWidth)
      let a = ((angleToChange - 90) * Math.PI) / 180.0

      let x = hC + r * Math.cos(a)
      let y = hC + r * Math.sin(a)
      return { x, y }
    },
    [trackRadius, thumbRadius, trackWidth],
  )

  const calculate = (inputValue: number): [number, { x: number; y: number }] => {
    const valuePercentage = ((inputValue - minValue) * 100) / (maxValue - minValue)
    const valueAngle = (valuePercentage / 100) * (maxAngle - minAngle) + minAngle
    const endCoord = polarToCartesian(valueAngle) // 3.6
    return [valueAngle, endCoord]
  }

  // const cartesianToPolar = React.useCallback(
  //   (x, y) => {
  //     let hC = trackRadius + Math.max(thumbRadius, trackWidth)
  //
  //     if (x === 0) {
  //       return y > hC ? 0 : 180
  //     } else if (y === 0) {
  //       return x > hC ? 90 : 270
  //     } else {
  //       return Math.round((Math.atan((y - hC) / (x - hC)) * 180) / Math.PI) + (x > hC ? 90 : 270)
  //     }
  //   },
  //   [trackRadius, thumbRadius],
  // )

  const width = (trackRadius + Math.max(thumbRadius, trackWidth)) * 2
  // noinspection JSSuspiciousNameCombination
  const height = width
  const startCoord = polarToCartesian(minAngle)
  const endTintCoord = polarToCartesian(maxAngle)

  const [initialValueAngle, initialEndCoord] = calculate(value)
  const _startOrResumeAnim = () => {
    theAnimValue.addListener(theValue => {
      const [valueAngle, endCoord] = calculate(theValue.value)
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
          valueAngle - minAngle <= 180 ? 0 : 1,
          1,
          endCoord.x,
          endCoord.y,
        ].join(' '),
      })
      // @ts-ignore
      trackThumbRef.current?.setNativeProps({
        x: endCoord.x - thumbRadius,
        y: endCoord.y - thumbRadius,
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
        <Path
          stroke={trackTintColor}
          strokeWidth={trackWidth}
          d={[
            'M',
            startCoord.x,
            startCoord.y,
            'A',
            trackRadius,
            trackRadius,
            0,
            maxAngle <= 180 ? '0' : '1',
            1,
            endTintCoord.x,
            endTintCoord.y,
          ].join(' ')}
        />
        <Path
          stroke={trackColor}
          strokeWidth={trackWidth}
          fill="none"
          d={`M${startCoord.x} ${startCoord.y} A ${trackRadius} ${trackRadius} 0 ${
            initialValueAngle - minAngle <= 180 ? 0 : 1
          } 1 ${initialEndCoord.x} ${initialEndCoord.y}`}
          // @ts-ignore
          ref={trackPathRef}
        />
        {showText && (
          <Text
            x={trackRadius + thumbRadius}
            y={trackRadius + 40}
            fontSize={textSize}
            fill={textColor}
            textAnchor="middle"
          >
            {Math.ceil(value).toString()}
          </Text>
        )}

        {!noThumb && (
          <G
            x={initialEndCoord.x - thumbRadius}
            y={initialEndCoord.y - thumbRadius}
            // @ts-ignore
            ref={trackThumbRef}
          >
            <Circle r={thumbRadius} cx={thumbRadius} cy={thumbRadius} fill={thumbColor} />
            {/*{showThumbText && (*/}
            {/*  <Text*/}
            {/*    x={thumbRadius}*/}
            {/*    y={thumbRadius + thumbTextSize / 2}*/}
            {/*    fontSize={10}*/}
            {/*    fill={thumbTextColor}*/}
            {/*    textAnchor="middle"*/}
            {/*  >*/}
            {/*    {Math.ceil(value).toString().padStart(2, '0')}*/}
            {/*  </Text>*/}
            {/*)}*/}
          </G>
        )}
      </Svg>
    </View>
  )
})

CircularSliderV2.defaultProps = {}

export default CircularSliderV2
