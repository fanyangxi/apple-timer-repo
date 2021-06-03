import { Preset, TickedPreset } from '@/models/preset'
import { CountdownTimer, TickingType, TimerStatus } from '@/services/countdown-timer'
import { TimerPhase } from '@/models/timer-phase'
import { PositiveOr0 } from '@/utils/common-util'

export type PresetTickedEventHandler = (
  currentSet: number,
  currentCycle: number,
  currentPhase: TimerPhase,
  type: TickingType,
  secsLeft: number,
  tickedPreset: TickedPreset,
) => void

let countdownTimer: CountdownTimer

const getUpdatedPreset = (originalPreset: Preset, remainingPresetDurationSecs: number): TickedPreset => {
  if (originalPreset.TotalPresetDurationSecs() < remainingPresetDurationSecs) {
    throw new Error(
      `Invalid remaining-preset-duration-secs: ${remainingPresetDurationSecs}, ` +
        `should be less/equal than: ${originalPreset.TotalPresetDurationSecs()}`,
    )
  }

  const ongoingSetRemainingSecs = remainingPresetDurationSecs % originalPreset.SetDurationSecs()
  const ongoingPrepareRemainingSecs = PositiveOr0(ongoingSetRemainingSecs - originalPreset.SetTotalCyclesDurationSecs())
  const ongoingCycleRemainingSecs = PositiveOr0(
    (ongoingSetRemainingSecs - ongoingPrepareRemainingSecs) % originalPreset.SetCycleDurationSecs(),
  )
  const ongoingWorkoutRemainingSecs = PositiveOr0(ongoingCycleRemainingSecs - originalPreset.RestSecs)
  const ongoingRestRemainingSecs = PositiveOr0(ongoingCycleRemainingSecs - ongoingWorkoutRemainingSecs)

  const setsRemainingCount = Math.ceil(remainingPresetDurationSecs / originalPreset.SetDurationSecs())
  const cyclesRemainingCount = Math.ceil(
    (ongoingSetRemainingSecs - originalPreset.PrepareSecs) / originalPreset.SetCycleDurationSecs(),
  )

  let currentPhase: TimerPhase | undefined
  if (ongoingPrepareRemainingSecs > 0 && ongoingPrepareRemainingSecs <= originalPreset.PrepareSecs) {
    currentPhase = TimerPhase.Prepare
  }
  if (ongoingWorkoutRemainingSecs > 0 && ongoingWorkoutRemainingSecs <= originalPreset.WorkoutSecs) {
    currentPhase = TimerPhase.Workout
  }
  if (ongoingRestRemainingSecs > 0 && ongoingRestRemainingSecs <= originalPreset.RestSecs) {
    currentPhase = TimerPhase.Rest
  }

  return {
    setsRemainingCount,
    setCyclesRemainingCount: cyclesRemainingCount,
    setCurrentPhase: currentPhase,
    setPrepareRemainingSecs: ongoingPrepareRemainingSecs || originalPreset.PrepareSecs,
    cycleWorkoutRemainingSecs: ongoingWorkoutRemainingSecs || originalPreset.WorkoutSecs,
    cycleRestRemainingSecs: ongoingRestRemainingSecs || originalPreset.RestSecs,
  }
}

const getUpdatedPreset2 = (originalPreset: Preset, remainingPresetDurationSecs: number): TickedPreset => {
  const elapsedSecs = originalPreset.TotalPresetDurationSecs() - remainingPresetDurationSecs
  if (elapsedSecs < 0) {
    throw new Error(
      `Invalid remaining-preset-duration-secs: ${remainingPresetDurationSecs}, ` +
        `should be less/equal than: ${originalPreset.TotalPresetDurationSecs()}`,
    )
  }

  let result: TickedPreset = {
    setsRemainingCount: originalPreset.SetsCount,
    setCyclesRemainingCount: originalPreset.CyclesCount,
    setCurrentPhase: undefined,
    setPrepareRemainingSecs: originalPreset.PrepareSecs,
    cycleWorkoutRemainingSecs: originalPreset.WorkoutSecs,
    cycleRestRemainingSecs: originalPreset.RestSecs,
  }
  let togoSecsInPhase = elapsedSecs // remainingSecsInPhase
  for (let setIndex = originalPreset.SetsCount; setIndex > 0; setIndex--) {
    togoSecsInPhase = originalPreset.PrepareSecs - Math.abs(togoSecsInPhase)
    if (togoSecsInPhase > 0 && togoSecsInPhase <= originalPreset.PrepareSecs) {
      result = {
        ...result,
        setsRemainingCount: setIndex,
        setCurrentPhase: TimerPhase.Prepare,
        setPrepareRemainingSecs: togoSecsInPhase,
      }
      return result
    }

    for (let cycleIndex = originalPreset.CyclesCount; cycleIndex > 0; cycleIndex--) {
      togoSecsInPhase = originalPreset.WorkoutSecs - Math.abs(togoSecsInPhase)
      if (togoSecsInPhase > 0 && togoSecsInPhase <= originalPreset.WorkoutSecs) {
        result = {
          ...result,
          setCyclesRemainingCount: cycleIndex,
          setCurrentPhase: TimerPhase.Workout,
          setPrepareRemainingSecs: 0,
          cycleWorkoutRemainingSecs: togoSecsInPhase,
        }
        return result
      }

      togoSecsInPhase = originalPreset.RestSecs - Math.abs(togoSecsInPhase)
      if (togoSecsInPhase > 0 && togoSecsInPhase <= originalPreset.RestSecs) {
        result = {
          ...result,
          setCyclesRemainingCount: cycleIndex,
          setCurrentPhase: TimerPhase.Rest,
          setPrepareRemainingSecs: 0,
          cycleWorkoutRemainingSecs: 0,
          cycleRestRemainingSecs: togoSecsInPhase,
        }
        return result
      }
    }
  }

  throw new Error(
    `Failed to get TickedPreset from remaining-preset-duration-secs: ${remainingPresetDurationSecs}, ` +
      `for preset with total: ${originalPreset.TotalPresetDurationSecs()}`,
  )
}

const runPreset = async (
  preset: Preset,
  onStarted?: () => void,
  onTicked?: PresetTickedEventHandler,
  onFinished?: () => void,
) => {
  let tickedPreset = {
    setsRemainingCount: preset.SetsCount,
    setCyclesRemainingCount: preset.CyclesCount,
    setCurrentPhase: undefined,
    setPrepareRemainingSecs: preset.PrepareSecs,
    cycleWorkoutRemainingSecs: preset.WorkoutSecs,
    cycleRestRemainingSecs: preset.RestSecs,
  }

  onStarted && onStarted()

  // Phase: 1.Prepare
  // Phase: 2.Workout
  // Phase: 3.Rest

  countdownTimer = new CountdownTimer(preset.TotalPresetDurationSecs(), async (type: TickingType, secsLeft: number) => {
    tickedPreset = { ...tickedPreset, setPrepareRemainingSecs: secsLeft }
    onTicked && onTicked(0, 0, TimerPhase.Prepare, type, secsLeft, tickedPreset)
  })
  await countdownTimer.start()
  console.log('>>> 1.Prepare started')
  for (let setIndex = preset.SetsCount; setIndex > 0; setIndex--) {
    for (let cycleIndex = preset.CyclesCount; cycleIndex > 0; cycleIndex--) {
      countdownTimer = new CountdownTimer(preset.WorkoutSecs, async (type: TickingType, secsLeft: number) => {
        tickedPreset = {
          ...tickedPreset,
          setsRemainingCount: setIndex,
          setCyclesRemainingCount: cycleIndex,
          cycleWorkoutRemainingSecs: secsLeft,
        }
        onTicked && onTicked(setIndex, cycleIndex, TimerPhase.Workout, type, secsLeft, tickedPreset)
      })
      await countdownTimer.start()
      console.log(`>>> 2.Workout started: S${setIndex}C${cycleIndex}`)

      countdownTimer = new CountdownTimer(preset.RestSecs, async (type: TickingType, secsLeft: number) => {
        tickedPreset = {
          ...tickedPreset,
          setsRemainingCount: setIndex,
          setCyclesRemainingCount: cycleIndex,
          cycleRestRemainingSecs: secsLeft,
        }
        onTicked && onTicked(setIndex, cycleIndex, TimerPhase.Rest, type, secsLeft, tickedPreset)
      })
      await countdownTimer.start()
      console.log(`>>> 3.Rest started: S${setIndex}C${cycleIndex}`)
    }
  }

  onFinished && onFinished()
}

const pause = () => {
  countdownTimer && countdownTimer.pause()
}

const resume = async () => {
  countdownTimer && (await countdownTimer.resume())
}

const status = (): TimerStatus => {
  return countdownTimer && countdownTimer.Status
}

const stop = () => {
  countdownTimer && countdownTimer.stopAndReset()
  countdownTimer && countdownTimer.start()
}

export default {
  getUpdatedPreset2,
  runPreset,
  pause,
  resume,
  status,
  stop,
}
