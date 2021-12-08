import { Preset, TickedContext, TickingEvent, UnpackedPresetMap } from '@/models/preset'
import { TimerPhase } from '@/models/timer-phase'

export const getUnpackedPresetMap = (originalPreset: Preset): UnpackedPresetMap => {
  const presetTotalDurationSecs = getTotalPresetDurationSecs(originalPreset)
  const generated: UnpackedPresetMap = {}
  for (let secondIndex = presetTotalDurationSecs; secondIndex >= 0; secondIndex--) {
    const ticked = getUpdatedContext(originalPreset, secondIndex)
    Object.assign(generated, { [`${secondIndex}s`]: ticked })
  }
  // console.log('>>> The unpacked-preset-map:', generated)
  return generated
}

export const getRawTickedContext = (originalPreset: Preset) => {
  return getUpdatedContext(originalPreset, getTotalPresetDurationSecs(originalPreset))
}

export const getUpdatedContext = (preset: Preset, remainingDurationSecs: number): TickedContext => {
  const PHASE_CLOSING_SECS = 3
  if (remainingDurationSecs === 0) {
    return {
      totalRemainingSeconds: remainingDurationSecs,
      events: [],
      cyclesRemainingCount: 0,
      cycleSetsRemainingCount: 0,
      cycleCurrentPhase: undefined,
      prepareRemainingSecs: 0,
      workoutRemainingSecs: 0,
      restRemainingSecs: 0,
    }
  }

  const originalPresetDurationSecs = getTotalPresetDurationSecs(preset)
  const elapsedSecs = originalPresetDurationSecs - remainingDurationSecs
  if (isNaN(elapsedSecs) || elapsedSecs < 0) {
    throw new Error(
      `Invalid remaining-preset-duration-secs: ${remainingDurationSecs}, ` +
        `should be less/equal than: ${originalPresetDurationSecs}`,
    )
  }

  let result: TickedContext = {
    totalRemainingSeconds: remainingDurationSecs,
    events: [],
    cyclesRemainingCount: preset.CyclesCount,
    cycleSetsRemainingCount: preset.SetsCount,
    cycleCurrentPhase: undefined,
    prepareRemainingSecs: preset.PrepareSecs,
    workoutRemainingSecs: preset.WorkoutSecs,
    restRemainingSecs: preset.RestSecs,
  }

  const getPreparePhaseEvents = (elapsedSecsDiff: number): TickingEvent[] => {
    if (elapsedSecsDiff === -preset.PrepareSecs && elapsedSecsDiff < 0 && elapsedSecsDiff >= -PHASE_CLOSING_SECS) {
      return [TickingEvent.CycleStarted, TickingEvent.PreparePhaseStarted, TickingEvent.PreparePhaseClosing]
    }
    if (elapsedSecsDiff === -preset.PrepareSecs) {
      return [TickingEvent.CycleStarted, TickingEvent.PreparePhaseStarted]
    }
    if (elapsedSecsDiff === -PHASE_CLOSING_SECS) {
      return [TickingEvent.PreparePhaseClosing]
    }
    return []
  }

  const getWorkoutPhaseEvents = (elapsedSecsDiff: number): TickingEvent[] => {
    if (elapsedSecsDiff === -preset.WorkoutSecs && elapsedSecsDiff < 0 && elapsedSecsDiff >= -PHASE_CLOSING_SECS) {
      return [TickingEvent.SetStarted, TickingEvent.WorkoutPhaseStarted, TickingEvent.WorkoutPhaseClosing]
    }
    if (elapsedSecsDiff === -preset.WorkoutSecs) {
      return [TickingEvent.SetStarted, TickingEvent.WorkoutPhaseStarted]
    }
    if (elapsedSecsDiff === -PHASE_CLOSING_SECS) {
      return [TickingEvent.WorkoutPhaseClosing]
    }
    return []
  }

  const getRestPhaseEvents = (elapsedSecsDiff: number): TickingEvent[] => {
    if (elapsedSecsDiff === -preset.RestSecs && elapsedSecsDiff < 0 && elapsedSecsDiff >= -PHASE_CLOSING_SECS) {
      return [TickingEvent.RestPhaseStarted, TickingEvent.RestPhaseClosing]
    }
    if (elapsedSecsDiff === -preset.RestSecs) {
      return [TickingEvent.RestPhaseStarted]
    }
    if (elapsedSecsDiff === -PHASE_CLOSING_SECS) {
      return [TickingEvent.RestPhaseClosing]
    }
    return []
  }

  let tempElapsedSecs = elapsedSecs
  for (let cycleIndex = preset.CyclesCount; cycleIndex > 0; cycleIndex--) {
    tempElapsedSecs = Math.abs(tempElapsedSecs) - preset.PrepareSecs
    if (tempElapsedSecs < 0) {
      result = {
        ...result,
        events: getPreparePhaseEvents(tempElapsedSecs),
        cyclesRemainingCount: cycleIndex,
        cycleCurrentPhase: TimerPhase.Prepare,
        prepareRemainingSecs: Math.abs(tempElapsedSecs),
      }
      return result
    }

    for (let repIndex = preset.SetsCount; repIndex > 0; repIndex--) {
      tempElapsedSecs = Math.abs(tempElapsedSecs) - preset.WorkoutSecs
      if (tempElapsedSecs < 0) {
        result = {
          ...result,
          events: getWorkoutPhaseEvents(tempElapsedSecs),
          cyclesRemainingCount: cycleIndex,
          cycleSetsRemainingCount: repIndex,
          cycleCurrentPhase: TimerPhase.Workout,
          prepareRemainingSecs: 0,
          workoutRemainingSecs: Math.abs(tempElapsedSecs),
        }
        return result
      }

      tempElapsedSecs = Math.abs(tempElapsedSecs) - preset.RestSecs
      if (tempElapsedSecs < 0) {
        result = {
          ...result,
          events: getRestPhaseEvents(tempElapsedSecs),
          cyclesRemainingCount: cycleIndex,
          cycleSetsRemainingCount: repIndex,
          cycleCurrentPhase: TimerPhase.Rest,
          prepareRemainingSecs: 0,
          workoutRemainingSecs: 0,
          restRemainingSecs: Math.abs(tempElapsedSecs),
        }
        return result
      }
    }
  }

  throw new Error(
    `Failed to get TickedContext from remaining-preset-duration-secs: ${remainingDurationSecs}, ` +
      `for preset with total: ${originalPresetDurationSecs}. The ` +
      `original-preset is: ${JSON.stringify(preset)}`,
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
