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
    startOrResumeAnim: startOrResumeAnim0,
    pauseAnim: pauseAnim0,
    stopAndResetAnim: stopAnim0,
    animValue: animValue0,
  } = useAnimatedTimingValueEffect({
    from: 0,
    to: 100,
    durationMs: (stateOptionsRef.current.activePreset?.PrepareSecs ?? 0) * 1000,
    onFinished: () => {
      startOrResumeAnim1()
    },
  })

  const {
    startOrResumeAnim: startOrResumeAnim1,
    pauseAnim: pauseAnim1,
    stopAndResetAnim: stopAnim1,
    animValue: animValue1,
  } = useAnimatedTimingValueEffect({
    from: 0,
    to: 100,
    durationMs: (stateOptionsRef.current.activePreset?.WorkoutSecs ?? 0) * 1000,
    onFinished: () => {
      startOrResumeAnim2()
    },
  })

  const {
    startOrResumeAnim: startOrResumeAnim2,
    pauseAnim: pauseAnim2,
    stopAndResetAnim: stopAnim2,
    animValue: animValue2,
  } = useAnimatedTimingValueEffect({
    from: 0,
    to: 100,
    durationMs: (stateOptionsRef.current.activePreset?.RestSecs ?? 0) * 1000,
    onFinished: () => {},
  })

  const startOrResumeSetAnim = () => {
    const { ticked } = stateOptionsRef.current
    console.log(`>>> StartOrResumeSet: ${ticked?.setCurrentPhase}`)
    const theMap = {
      [`${TimerPhase.Prepare}`]: startOrResumeAnim0,
      [`${TimerPhase.Workout}`]: startOrResumeAnim1,
      [`${TimerPhase.Rest}`]: startOrResumeAnim2,
    }
    const resultFunc = theMap[`${ticked?.setCurrentPhase}`] ?? startOrResumeAnim0
    return resultFunc()
  }

  const pauseAnim = () => {
    const { ticked } = stateOptionsRef.current
    console.log(`>>> PauseSet: ${ticked?.setCurrentPhase}`)
    const theMap = {
      [`${TimerPhase.Prepare}`]: pauseAnim0,
      [`${TimerPhase.Workout}`]: pauseAnim1,
      [`${TimerPhase.Rest}`]: pauseAnim2,
    }
    const resultFunc = theMap[`${ticked?.setCurrentPhase}`] ?? pauseAnim0
    return resultFunc()
  }

  const resetSetAnim = () => {
    const { ticked } = stateOptionsRef.current
    console.log(`>>> ResetSet: ${ticked?.setCurrentPhase}`)
    stopAnim0()
    stopAnim1()
    stopAnim2()
  }

  const startOrResumeRepetitionAnim = () => {
    const { ticked } = stateOptionsRef.current
    console.log(`>>> StartRepetition: ${ticked?.setCurrentPhase}`)
    const theMap = {
      [`${TimerPhase.Workout}`]: startOrResumeAnim1,
      [`${TimerPhase.Rest}`]: startOrResumeAnim2,
    }
    const resultFunc = theMap[`${ticked?.setCurrentPhase}`] ?? startOrResumeAnim1
    return resultFunc()
  }

  const resetRepetitionAnim = () => {
    const { ticked } = stateOptionsRef.current
    console.log(`>>> ResetRepetition: ${ticked?.setCurrentPhase}`)
    stopAnim1()
    stopAnim2()
  }

  // startOrResume (from 0, or any) / pause (any) / resume (any) / stop|reset (any)
  return {
    startOrResumeSetAnim,
    resetSetAnim,
    pauseAnim,
    startOrResumeRepetitionAnim,
    resetRepetitionAnim,
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
