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

  const startOrResume = () => {
    const { from, to, durationMs, onFinished } = stateOptionsRef.current
    const remainingPercentage = (to - currentValueRef.current) / (to - from)
    // eslint-disable-next-line max-len,prettier/prettier
    console.log(`>>> IN:start-or-resume:${remainingPercentage}/${from}/${to}/${currentValueRef.current};durationMs:${durationMs}`)
    Animated.timing(theAnimValue, {
      toValue: to,
      duration: durationMs * remainingPercentage,
      easing: Easing.linear,
      // Set this to 'False', to suppress the warning: `Sending "onAnimatedValueUpdate" with no listeners registered.`
      useNativeDriver: false,
    }).start(result => {
      if (result.finished) {
        onFinished && onFinished()
      }
    })
  }

  const pause = () => {
    theAnimValue.stopAnimation(value => {
      console.log(`>>> IN:pause:${value}`)
      currentValueRef.current = value
    })
  }

  const stopAndReset = () => {
    theAnimValue.stopAnimation()
    theAnimValue.setValue(stateOptionsRef.current.from)
    currentValueRef.current = stateOptionsRef.current.from
  }

  // start / pause / resume / stop|reset
  return {
    startOrResume: startOrResume,
    pause: pause,
    stopAndReset: stopAndReset,
    animValue: theAnimValue,
  }
}
