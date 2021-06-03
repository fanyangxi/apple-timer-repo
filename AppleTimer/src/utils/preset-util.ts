import { Preset, TickedPreset } from '@/models/preset'
import { TimerPhase } from '@/models/timer-phase'

export const getUpdatedPreset = (originalPreset: Preset, remainingPresetDurationSecs: number): TickedPreset => {
  if (remainingPresetDurationSecs === 0) {
    return {
      setsRemainingCount: 0,
      setCyclesRemainingCount: 0,
      setCurrentPhase: undefined,
      setPrepareRemainingSecs: 0,
      cycleWorkoutRemainingSecs: 0,
      cycleRestRemainingSecs: 0,
    }
  }

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
  let remainingElapsedSecs = elapsedSecs
  for (let setIndex = originalPreset.SetsCount; setIndex > 0; setIndex--) {
    remainingElapsedSecs = Math.abs(remainingElapsedSecs) - originalPreset.PrepareSecs
    if (remainingElapsedSecs < 0) {
      result = {
        ...result,
        setsRemainingCount: setIndex,
        setCurrentPhase: TimerPhase.Prepare,
        setPrepareRemainingSecs: Math.abs(remainingElapsedSecs),
      }
      return result
    }

    for (let cycleIndex = originalPreset.CyclesCount; cycleIndex > 0; cycleIndex--) {
      remainingElapsedSecs = Math.abs(remainingElapsedSecs) - originalPreset.WorkoutSecs
      if (remainingElapsedSecs < 0) {
        result = {
          ...result,
          setsRemainingCount: setIndex,
          setCyclesRemainingCount: cycleIndex,
          setCurrentPhase: TimerPhase.Workout,
          setPrepareRemainingSecs: 0,
          cycleWorkoutRemainingSecs: Math.abs(remainingElapsedSecs),
        }
        return result
      }

      remainingElapsedSecs = Math.abs(remainingElapsedSecs) - originalPreset.RestSecs
      if (remainingElapsedSecs < 0) {
        result = {
          ...result,
          setsRemainingCount: setIndex,
          setCyclesRemainingCount: cycleIndex,
          setCurrentPhase: TimerPhase.Rest,
          setPrepareRemainingSecs: 0,
          cycleWorkoutRemainingSecs: 0,
          cycleRestRemainingSecs: Math.abs(remainingElapsedSecs),
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
