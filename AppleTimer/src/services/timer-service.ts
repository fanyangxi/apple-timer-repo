import { Preset, TickedPreset } from '@/models/preset'
import { startCountdown, TickingType } from '@/utils/date-util'
import { TimerPhase } from '@/models/timer-phase'

export type PresetTickedEventHandler = (
  currentSet: number,
  currentCycle: number,
  currentPhase: TimerPhase,
  type: TickingType,
  secsLeft: number,
  tickedPreset: TickedPreset,
) => void

export const runPreset = async (preset: Preset, onTicked: PresetTickedEventHandler) => {
  let tickedPreset = {
    prepareRemainingSecs: preset.prepareSecs,
    workoutRemainingSecs: preset.workoutSecs,
    restRemainingSecs: preset.restSecs,
    cyclesRemainingCount: preset.cyclesCount,
    setsRemainingCount: preset.setsCount,
  }

  // Phase: 1.Prepare
  await startCountdown(preset.prepareSecs, (type: TickingType, secsLeft: number) => {
    tickedPreset = { ...tickedPreset, prepareRemainingSecs: secsLeft }
    onTicked(0, 0, TimerPhase.Prepare, type, secsLeft, tickedPreset)
  })
  for (let setIndex = preset.setsCount; setIndex > 0; setIndex--) {
    for (let cycleIndex = preset.cyclesCount; cycleIndex > 0; cycleIndex--) {
      // Phase: 2.Workout
      await startCountdown(preset.workoutSecs, (type: TickingType, secsLeft: number) => {
        tickedPreset = {
          ...tickedPreset,
          workoutRemainingSecs: secsLeft,
          cyclesRemainingCount: cycleIndex,
          setsRemainingCount: setIndex,
        }
        onTicked(setIndex, cycleIndex, TimerPhase.Workout, type, secsLeft, tickedPreset)
      })
      // Phase: 3.Rest
      await startCountdown(preset.restSecs, (type: TickingType, secsLeft: number) => {
        tickedPreset = {
          ...tickedPreset,
          restRemainingSecs: secsLeft,
          cyclesRemainingCount: cycleIndex,
          setsRemainingCount: setIndex,
        }
        onTicked(setIndex, cycleIndex, TimerPhase.Rest, type, secsLeft, tickedPreset)
      })
    }
  }
}
