import { Preset, TickedPreset } from '@/models/preset'
import { CountdownTimer, TickingType } from '@/services/countdown-timer'
import { TimerPhase } from '@/models/timer-phase'

export type PresetTickedEventHandler = (
  currentSet: number,
  currentCycle: number,
  currentPhase: TimerPhase,
  type: TickingType,
  secsLeft: number,
  tickedPreset: TickedPreset,
) => void

const runPreset = async (
  preset: Preset,
  onStarted?: () => void,
  onTicked?: PresetTickedEventHandler,
  onFinished?: () => void,
) => {
  let tickedPreset = {
    prepareRemainingSecs: preset.prepareSecs,
    workoutRemainingSecs: preset.workoutSecs,
    restRemainingSecs: preset.restSecs,
    cyclesRemainingCount: preset.cyclesCount,
    setsRemainingCount: preset.setsCount,
  }

  onStarted && onStarted()

  // Phase: 1.Prepare
  await CountdownTimer.startCountdown(preset.prepareSecs, (type: TickingType, secsLeft: number) => {
    tickedPreset = { ...tickedPreset, prepareRemainingSecs: secsLeft }
    onTicked && onTicked(0, 0, TimerPhase.Prepare, type, secsLeft, tickedPreset)
  })
  for (let setIndex = preset.setsCount; setIndex > 0; setIndex--) {
    for (let cycleIndex = preset.cyclesCount; cycleIndex > 0; cycleIndex--) {
      // Phase: 2.Workout
      await CountdownTimer.startCountdown(preset.workoutSecs, (type: TickingType, secsLeft: number) => {
        tickedPreset = {
          ...tickedPreset,
          workoutRemainingSecs: secsLeft,
          cyclesRemainingCount: cycleIndex,
          setsRemainingCount: setIndex,
        }
        onTicked && onTicked(setIndex, cycleIndex, TimerPhase.Workout, type, secsLeft, tickedPreset)
      })
      // Phase: 3.Rest
      await CountdownTimer.startCountdown(preset.restSecs, (type: TickingType, secsLeft: number) => {
        tickedPreset = {
          ...tickedPreset,
          restRemainingSecs: secsLeft,
          cyclesRemainingCount: cycleIndex,
          setsRemainingCount: setIndex,
        }
        onTicked && onTicked(setIndex, cycleIndex, TimerPhase.Rest, type, secsLeft, tickedPreset)
      })
    }
  }

  onFinished && onFinished()
}

const togglePause2 = () => {
  CountdownTimer.togglePause()
}

const stop = () => {
  CountdownTimer.stop()
}

export default {
  runPreset,
  togglePause2,
  stop,
}
