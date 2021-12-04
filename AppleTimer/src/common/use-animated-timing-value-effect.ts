import { Animated, Easing } from 'react-native'
import { useState } from 'react'

export type AnimatedTimingValueEffectOptions = {
  from: number
  to: number
  durationMs: number
  onFinished?: () => void
}

export const useAnimatedTimingValueEffect = (options: AnimatedTimingValueEffectOptions) => {
  const { from, to, durationMs, onFinished } = options
  const [currentValue, setCurrentValue] = useState<number>(from)
  const [workoutPhaseAnimValue] = useState(new Animated.Value(from))
  // let workoutPhaseAnimTiming = Animated.timing(workoutPhaseAnimValue, {
  //   toValue: 100,
  //   duration: 50000,
  //   easing: Easing.linear,
  //   // Set this to 'False', to suppress the warning: `Sending "onAnimatedValueUpdate" with no listeners registered.`
  //   useNativeDriver: false,
  // })

  const startOrResume = () => {
    const remainingPercentage = (to - currentValue) / (to - from)
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
      console.log(`======================> LLLL: ${result.finished}`)
    })
  }

  const pause = () => {
    workoutPhaseAnimValue.stopAnimation(value => {
      setCurrentValue(value)
    })
  }

  const stop = () => {
    workoutPhaseAnimValue.stopAnimation()
    workoutPhaseAnimValue.setValue(from)
  }

  // start / pause / resume / stop|reset
  return {
    startOrResume: startOrResume,
    pause: pause,
    stop: stop,
    animValue: workoutPhaseAnimValue,
  }
}
