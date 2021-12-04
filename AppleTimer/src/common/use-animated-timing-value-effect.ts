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
  const [workoutPhaseAnimValue] = useState(new Animated.Value(options.from))

  // let workoutPhaseAnimTiming = Animated.timing(workoutPhaseAnimValue, {
  //   toValue: 100,
  //   duration: 50000,
  //   easing: Easing.linear,
  //   // Set this to 'False', to suppress the warning: `Sending "onAnimatedValueUpdate" with no listeners registered.`
  //   useNativeDriver: false,
  // })

  useEffect(() => {
    // console.log(`**** options 333:${JSON.stringify(options)}`)
    if (JSON.stringify(stateOptions.current) !== JSON.stringify(options)) {
      console.log(`New animated-timing options received:${JSON.stringify(options)}`)
      stateOptions.current = options
    }
  }, [options])

  const startOrResume = () => {
    const { from, to, durationMs, onFinished } = stateOptions.current
    const remainingPercentage = (to - currentValue) / (to - from)
    console.log(`>>> startOrResume: ${remainingPercentage}/${from}/${to}/${currentValue}; durationMs:${durationMs}`)
    Animated.timing(workoutPhaseAnimValue, {
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
    workoutPhaseAnimValue.stopAnimation(value => {
      setCurrentValue(value)
    })
  }

  const stop = () => {
    workoutPhaseAnimValue.stopAnimation()
    workoutPhaseAnimValue.setValue(stateOptions.current.from)
  }

  // start / pause / resume / stop|reset
  return {
    startOrResume: startOrResume,
    pause: pause,
    stop: stop,
    animValue: workoutPhaseAnimValue,
  }
}
