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
  getUpdatedPreset,
  runPreset,
  pause,
  resume,
  status,
  stop,
}
