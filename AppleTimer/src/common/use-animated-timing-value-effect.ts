import { Animated, Easing } from 'react-native'
import { useEffect, useRef, useState } from 'react'

export type AnimatedTimingValueEffectOptions = {
  from: number
  to: number
  durationMs: number
  onFinished?: () => void
}

export const useAnimatedTimingValueEffect = (options: AnimatedTimingValueEffectOptions) => {
  const stateOptionsRef = useRef<AnimatedTimingValueEffectOptions>(options)
  const currentValueRef = useRef<number>(options.from)
  const [theAnimValue] = useState(new Animated.Value(options.from))

  useEffect(() => {
    if (JSON.stringify(stateOptionsRef.current) !== JSON.stringify(options)) {
      console.log(`New animated-timing options received:${JSON.stringify(options)}`)
      stateOptionsRef.current = options
    }
  }, [options])

  const startOrResumeAnim = () => {
    const { from, to, durationMs, onFinished } = stateOptionsRef.current
    const remainingPercentage = (to - currentValueRef.current) / (to - from)
    // eslint-disable-next-line max-len,prettier/prettier
    console.log(`IN:startOrResumeAnim:${remainingPercentage}/${from}/${to}/${currentValueRef.current};durationMs:${durationMs}`)
    Animated.timing(theAnimValue, {
      toValue: to,
      duration: durationMs * remainingPercentage,
      easing: Easing.linear,
      // Config to 'False', to suppress the warning: `Sending "onAnimatedValueUpdate" with no listeners registered.`
      useNativeDriver: false,
    }).start(result => {
      if (result.finished) {
        onFinished && onFinished()
      }
    })
  }

  const pauseAnim = () => {
    theAnimValue.stopAnimation(value => {
      console.log(`IN:pauseAnim:${value}`)
      currentValueRef.current = value
    })
  }

  const stopAndResetAnim = () => {
    theAnimValue.stopAnimation(() => {
      console.log('IN:stopAndResetAnim:')
      theAnimValue.setValue(stateOptionsRef.current.from)
      currentValueRef.current = stateOptionsRef.current.from
    })
  }

  // start / pause / resume / stop|reset
  return {
    startOrResumeAnim,
    pauseAnim,
    stopAndResetAnim,
    animValue: theAnimValue,
  }
}
