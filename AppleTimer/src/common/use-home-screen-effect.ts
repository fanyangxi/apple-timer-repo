import { useEffect, useRef } from 'react'
import { Preset, TickedPreset } from '@/models/preset'
import { useAnimatedTimingValueEffect } from '@/common/use-animated-timing-value-effect'
import { TimerPhase } from '@/models/timer-phase'

export type HomeScreenEffectOptions = {
  activePreset?: Preset
  ticked?: TickedPreset
}

/**
 * The animation handling follows bellow pattern:
 *
 * -- on-timer-started
 * -- #A-cycle:
 * --     prepare-started/cycle-started (resetCycleAnim, startOrResumePreparePhaseAnim)
 * --     #1
 * --     workout-started/set-stared (resetSetAnim, startOrResumeWorkoutPhaseAnim)
 * --     rest-started (startOrResumeSetPhaseAnim)
 * --     #2
 * --     workout-started/set-stared (resetSetAnim, startOrResumeWorkoutPhaseAnim)
 * --     rest-started (startOrResumeSetPhaseAnim)
 * --     #3
 * --     ...
 * -- #B-cycle:
 * --     ......
 * -- on-timer-completed
 * */
export const useHomeScreenEffect = (options: HomeScreenEffectOptions) => {
  const stateOptionsRef = useRef<HomeScreenEffectOptions>(options)

  useEffect(() => {
    if (JSON.stringify(stateOptionsRef.current) !== JSON.stringify(options)) {
      // console.log(`New options received:${JSON.stringify(options)}`)
      stateOptionsRef.current = options
    }
  }, [options])

  // For `Prepare` Phase:
  const {
    startOrResumeAnim: startOrResumeAnim0,
    pauseAnim: pauseAnim0,
    stopAndResetAnim: stopAndResetAnim0,
    animValue: animValue0,
  } = useAnimatedTimingValueEffect({
    from: 0,
    to: 100,
    durationMs: (stateOptionsRef.current.activePreset?.PrepareSecs ?? 0) * 1000,
    onFinished: () => {
      // This animation doesn't need to be triggered by `startOrResumeAnim0`. It can be triggered by
      // the `OnSetStarted` event.
      // startOrResumeAnim1()
    },
  })

  // For `Workout` Phase:
  const {
    startOrResumeAnim: startOrResumeAnim1,
    pauseAnim: pauseAnim1,
    stopAndResetAnim: stopAndResetAnim1,
    animValue: animValue1,
  } = useAnimatedTimingValueEffect({
    from: 0,
    to: 100,
    durationMs: (stateOptionsRef.current.activePreset?.WorkoutSecs ?? 0) * 1000,
    onFinished: () => {
      // Each anim should be started by its own phase-started event
      // startOrResumeAnim2()
    },
  })

  // For `Rest` Phase:
  const {
    startOrResumeAnim: startOrResumeAnim2,
    pauseAnim: pauseAnim2,
    stopAndResetAnim: stopAndResetAnim2,
    animValue: animValue2,
  } = useAnimatedTimingValueEffect({
    from: 0,
    to: 100,
    durationMs: (stateOptionsRef.current.activePreset?.RestSecs ?? 0) * 1000,
    onFinished: () => {},
  })

  const startOrResumeCycleAnim = () => {
    const { ticked } = stateOptionsRef.current
    console.log(`>>> startOrResumeCycleAnim: ${ticked?.cycleCurrentPhase}`)
    const theMap = {
      [`${TimerPhase.Prepare}`]: startOrResumeAnim0,
      [`${TimerPhase.Workout}`]: startOrResumeAnim1,
      [`${TimerPhase.Rest}`]: startOrResumeAnim2,
    }
    const resultFunc = theMap[`${ticked?.cycleCurrentPhase}`] ?? startOrResumeAnim0
    return resultFunc()
  }

  const pauseAnim = () => {
    const { ticked } = stateOptionsRef.current
    console.log(`>>> pauseAnim: ${ticked?.cycleCurrentPhase}`)
    const theMap = {
      [`${TimerPhase.Prepare}`]: pauseAnim0,
      [`${TimerPhase.Workout}`]: pauseAnim1,
      [`${TimerPhase.Rest}`]: pauseAnim2,
    }
    const resultFunc = theMap[`${ticked?.cycleCurrentPhase}`] ?? pauseAnim0
    return resultFunc()
  }

  const resetCycleAnim = () => {
    const { ticked } = stateOptionsRef.current
    console.log(`>>> resetCycleAnim: ${ticked?.cycleCurrentPhase}`)
    stopAndResetAnim0()
    stopAndResetAnim1()
    stopAndResetAnim2()
  }

  const resetSetAnim = () => {
    const { ticked } = stateOptionsRef.current
    console.log(`>>> resetSetAnim: ${ticked?.cycleCurrentPhase}`)
    stopAndResetAnim1()
    stopAndResetAnim2()
  }

  // startOrResume (from 0, or any) / pause (any) / resume (any) / stop|reset (any)
  return {
    startOrResumePreparePhaseAnim: startOrResumeAnim0,
    startOrResumeWorkoutPhaseAnim: startOrResumeAnim1,
    startOrResumeSetPhaseAnim: startOrResumeAnim2,
    startOrResumeCycleAnim,
    pauseAnim,
    resetCycleAnim,
    resetSetAnim,
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
