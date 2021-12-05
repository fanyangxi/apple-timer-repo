import { Preset, TickedPreset } from '@/models/preset'
import { TimerPhase } from '@/models/timer-phase'

export const getRawTickedPreset = (originalPreset: Preset) => {
  return getUpdatedPreset(originalPreset, getTotalPresetDurationSecs(originalPreset))
}

export const getUpdatedPreset = (originalPreset: Preset, remainingPresetDurationSecs: number): TickedPreset => {
  if (remainingPresetDurationSecs === 0) {
    return {
      cyclesRemainingCount: 0,
      cycleRepsRemainingCount: 0,
      cycleCurrentPhase: undefined,
      prepareRemainingSecs: 0,
      repWorkoutRemainingSecs: 0,
      repRestRemainingSecs: 0,
    }
  }

  const elapsedSecs = getTotalPresetDurationSecs(originalPreset) - remainingPresetDurationSecs
  if (isNaN(elapsedSecs) || elapsedSecs < 0) {
    throw new Error(
      `Invalid remaining-preset-duration-secs: ${remainingPresetDurationSecs}, ` +
        `should be less/equal than: ${getTotalPresetDurationSecs(originalPreset)}`,
    )
  }

  let result: TickedPreset = {
    cyclesRemainingCount: originalPreset.CyclesCount,
    cycleRepsRemainingCount: originalPreset.RepsCount,
    cycleCurrentPhase: undefined,
    prepareRemainingSecs: originalPreset.PrepareSecs,
    repWorkoutRemainingSecs: originalPreset.WorkoutSecs,
    repRestRemainingSecs: originalPreset.RestSecs,
  }
  let remainingElapsedSecs = elapsedSecs
  for (let cycleIndex = originalPreset.CyclesCount; cycleIndex > 0; cycleIndex--) {
    remainingElapsedSecs = Math.abs(remainingElapsedSecs) - originalPreset.PrepareSecs
    if (remainingElapsedSecs < 0) {
      result = {
        ...result,
        cyclesRemainingCount: cycleIndex,
        cycleCurrentPhase: TimerPhase.Prepare,
        prepareRemainingSecs: Math.abs(remainingElapsedSecs),
      }
      return result
    }

    for (let repIndex = originalPreset.RepsCount; repIndex > 0; repIndex--) {
      remainingElapsedSecs = Math.abs(remainingElapsedSecs) - originalPreset.WorkoutSecs
      if (remainingElapsedSecs < 0) {
        result = {
          ...result,
          cyclesRemainingCount: cycleIndex,
          cycleRepsRemainingCount: repIndex,
          cycleCurrentPhase: TimerPhase.Workout,
          prepareRemainingSecs: 0,
          repWorkoutRemainingSecs: Math.abs(remainingElapsedSecs),
        }
        return result
      }

      remainingElapsedSecs = Math.abs(remainingElapsedSecs) - originalPreset.RestSecs
      if (remainingElapsedSecs < 0) {
        result = {
          ...result,
          cyclesRemainingCount: cycleIndex,
          cycleRepsRemainingCount: repIndex,
          cycleCurrentPhase: TimerPhase.Rest,
          prepareRemainingSecs: 0,
          repWorkoutRemainingSecs: 0,
          repRestRemainingSecs: Math.abs(remainingElapsedSecs),
        }
        return result
      }
    }
  }

  throw new Error(
    `Failed to get TickedPreset from remaining-preset-duration-secs: ${remainingPresetDurationSecs}, ` +
      `for preset with total: ${getTotalPresetDurationSecs(originalPreset)}. The ` +
      `original-preset is: ${JSON.stringify(originalPreset)}`,
  )
}

export const getTotalPresetDurationSecs = (item?: Preset): number => {
  if (!item) {
    return 0
  }
  return (item.PrepareSecs + (item.WorkoutSecs + item.RestSecs) * item.RepsCount) * item.CyclesCount
}
