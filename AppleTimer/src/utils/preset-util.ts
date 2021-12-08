import { Preset, TickedContext } from '@/models/preset'
import { TimerPhase } from '@/models/timer-phase'

export const getRawTickedContext = (originalPreset: Preset) => {
  return getUpdatedContext(originalPreset, getTotalPresetDurationSecs(originalPreset))
}

export const getUpdatedContext = (originalPreset: Preset, remainingPresetDurationSecs: number): TickedContext => {
  if (remainingPresetDurationSecs === 0) {
    return {
      cyclesRemainingCount: 0,
      cycleSetsRemainingCount: 0,
      cycleCurrentPhase: undefined,
      prepareRemainingSecs: 0,
      workoutRemainingSecs: 0,
      restRemainingSecs: 0,
    }
  }

  const originalPresetDurationSecs = getTotalPresetDurationSecs(originalPreset)
  const elapsedSecs = originalPresetDurationSecs - remainingPresetDurationSecs
  if (isNaN(elapsedSecs) || elapsedSecs < 0) {
    throw new Error(
      `Invalid remaining-preset-duration-secs: ${remainingPresetDurationSecs}, ` +
        `should be less/equal than: ${originalPresetDurationSecs}`,
    )
  }

  let result: TickedContext = {
    cyclesRemainingCount: originalPreset.CyclesCount,
    cycleSetsRemainingCount: originalPreset.SetsCount,
    cycleCurrentPhase: undefined,
    prepareRemainingSecs: originalPreset.PrepareSecs,
    workoutRemainingSecs: originalPreset.WorkoutSecs,
    restRemainingSecs: originalPreset.RestSecs,
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

    for (let repIndex = originalPreset.SetsCount; repIndex > 0; repIndex--) {
      remainingElapsedSecs = Math.abs(remainingElapsedSecs) - originalPreset.WorkoutSecs
      if (remainingElapsedSecs < 0) {
        result = {
          ...result,
          cyclesRemainingCount: cycleIndex,
          cycleSetsRemainingCount: repIndex,
          cycleCurrentPhase: TimerPhase.Workout,
          prepareRemainingSecs: 0,
          workoutRemainingSecs: Math.abs(remainingElapsedSecs),
        }
        return result
      }

      remainingElapsedSecs = Math.abs(remainingElapsedSecs) - originalPreset.RestSecs
      if (remainingElapsedSecs < 0) {
        result = {
          ...result,
          cyclesRemainingCount: cycleIndex,
          cycleSetsRemainingCount: repIndex,
          cycleCurrentPhase: TimerPhase.Rest,
          prepareRemainingSecs: 0,
          workoutRemainingSecs: 0,
          restRemainingSecs: Math.abs(remainingElapsedSecs),
        }
        return result
      }
    }
  }

  throw new Error(
    `Failed to get TickedContext from remaining-preset-duration-secs: ${remainingPresetDurationSecs}, ` +
      `for preset with total: ${originalPresetDurationSecs}. The ` +
      `original-preset is: ${JSON.stringify(originalPreset)}`,
  )
}

export const getTotalPresetDurationSecs = (item?: Preset): number => {
  if (!item) {
    return 0
  }
  return (item.PrepareSecs + (item.WorkoutSecs + item.RestSecs) * item.SetsCount) * item.CyclesCount
}

export const getCurrentPhaseRemainingSecs = (ticked?: TickedContext): number => {
  if (!ticked) {
    return 0
  }
  const theMap = {
    [`${TimerPhase.Prepare}`]: ticked.prepareRemainingSecs,
    [`${TimerPhase.Workout}`]: ticked.workoutRemainingSecs,
    [`${TimerPhase.Rest}`]: ticked.restRemainingSecs,
  }
  return theMap[`${ticked.cycleCurrentPhase}`] ?? 0
}
