import { useEffect, useRef } from 'react'
import { Preset, TickedPreset } from '@/models/preset'
import { useAnimatedTimingValueEffect } from '@/common/use-animated-timing-value-effect'
import { TimerPhase } from '@/models/timer-phase'

export type HomeScreenEffectOptions = {
  activePreset?: Preset
  ticked?: TickedPreset
}

export const useHomeScreenEffect = (options: HomeScreenEffectOptions) => {
  const stateOptionsRef = useRef<HomeScreenEffectOptions>(options)

  useEffect(() => {
    if (JSON.stringify(stateOptionsRef.current) !== JSON.stringify(options)) {
      // console.log(`New options received:${JSON.stringify(options)}`)
      stateOptionsRef.current = options
    }
  }, [options])

  const {
    startOrResume: startOrResume0,
    pause: pause0,
    stopAndReset: stop0,
    animValue: animValue0,
  } = useAnimatedTimingValueEffect({
    from: 0,
    to: 100,
    durationMs: (stateOptionsRef.current.activePreset?.PrepareSecs ?? 0) * 1000,
    onFinished: () => {
      startOrResume1()
    },
  })

  const {
    startOrResume: startOrResume1,
    pause: pause1,
    stopAndReset: stop1,
    animValue: animValue1,
  } = useAnimatedTimingValueEffect({
    from: 0,
    to: 100,
    durationMs: (stateOptionsRef.current.activePreset?.WorkoutSecs ?? 0) * 1000,
    onFinished: () => {
      startOrResume2()
    },
  })

  const {
    startOrResume: startOrResume2,
    pause: pause2,
    stopAndReset: stop2,
    animValue: animValue2,
  } = useAnimatedTimingValueEffect({
    from: 0,
    to: 100,
    durationMs: (stateOptionsRef.current.activePreset?.RestSecs ?? 0) * 1000,
    onFinished: () => {},
  })

  const startOrResumeSet = () => {
    const { ticked } = stateOptionsRef.current
    console.log(`>>> StartOrResumeSet: ${ticked?.setCurrentPhase}`)
    const theMap = {
      [`${TimerPhase.Prepare}`]: startOrResume0,
      [`${TimerPhase.Workout}`]: startOrResume1,
      [`${TimerPhase.Rest}`]: startOrResume2,
    }
    const resultFunc = theMap[`${ticked?.setCurrentPhase}`] ?? startOrResume0
    return resultFunc()
  }

  const pause = () => {
    const { ticked } = stateOptionsRef.current
    console.log(`>>> PauseSet: ${ticked?.setCurrentPhase}`)
    const theMap = {
      [`${TimerPhase.Prepare}`]: pause0,
      [`${TimerPhase.Workout}`]: pause1,
      [`${TimerPhase.Rest}`]: pause2,
    }
    const resultFunc = theMap[`${ticked?.setCurrentPhase}`] ?? pause0
    return resultFunc()
  }

  const resetSet = () => {
    const { ticked } = stateOptionsRef.current
    console.log(`>>> ResetSet: ${ticked?.setCurrentPhase}`)
    stop0()
    stop1()
    stop2()
  }

  const startOrResumeRepetition = () => {
    const { ticked } = stateOptionsRef.current
    console.log(`>>> StartRepetition: ${ticked?.setCurrentPhase}`)
    const theMap = {
      [`${TimerPhase.Workout}`]: startOrResume1,
      [`${TimerPhase.Rest}`]: startOrResume2,
    }
    const resultFunc = theMap[`${ticked?.setCurrentPhase}`] ?? startOrResume1
    return resultFunc()
  }

  const resetRepetition = () => {
    const { ticked } = stateOptionsRef.current
    console.log(`>>> ResetRepetition: ${ticked?.setCurrentPhase}`)
    stop1()
    stop2()
  }

  // startOrResume (from 0, or any) / pause (any) / resume (any) / stop|reset (any)
  return {
    startOrResumeSet,
    resetSet,
    startOrResumeRepetition,
    resetRepetition,
    pause,
    animValue0: animValue0,
    animValue1: animValue1,
    animValue2: animValue2,
  }
}

// const [workoutPhaseAnimValue] = useState(new Animated.Value(options.from))
// const [workoutPhaseAnimValue] = useState(new Animated.Value(0))
// let workoutPhaseAnimTiming = Animated.timing(workoutPhaseAnimValue, {
//   toValue: 100,
//   duration: 8000,
//   easing: Easing.linear,
//   // Set this to 'False', to suppress the warning: `Sending "onAnimatedValueUpdate" with no listeners registered.`
//   useNativeDriver: false,
// })
// workoutPhaseAnimValue?.addListener(({ value }) => {
//   // console.log(`>>> value: ${value}`)
// })
