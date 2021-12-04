import { Animated, Easing } from 'react-native'
import { useEffect, useRef, useState } from 'react'

export type AnimatedTimingValueEffectOptions = {
  from: number
  to: number
  durationMs: number
  onFinished?: () => void
}

export const useAnimatedTimingValueEffect = (options: AnimatedTimingValueEffectOptions) => {
  const stateOptions = useRef<AnimatedTimingValueEffectOptions>(options)
  const [currentValue, setCurrentValue] = useState<number>(options.from)
  const [theAnimValue] = useState(new Animated.Value(options.from))

  useEffect(() => {
    if (JSON.stringify(stateOptions.current) !== JSON.stringify(options)) {
      // console.log(`New animated-timing options received:${JSON.stringify(options)}`)
      stateOptions.current = options
    }
  }, [options])

  const startOrResume = () => {
    const { from, to, durationMs, onFinished } = stateOptions.current
    const remainingPercentage = (to - currentValue) / (to - from)
    console.log(`>>> start-or-resume: ${remainingPercentage}/${from}/${to}/${currentValue}; durationMs:${durationMs}`)
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
      setCurrentValue(value)
    })
  }

  const stopAndReset = () => {
    theAnimValue.stopAnimation()
    theAnimValue.setValue(stateOptions.current.from)
    setCurrentValue(stateOptions.current.from)
  }

  // start / pause / resume / stop|reset
  return {
    startOrResume: startOrResume,
    pause: pause,
    stopAndReset: stopAndReset,
    animValue: theAnimValue,
  }
}
