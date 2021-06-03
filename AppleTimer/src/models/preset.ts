// export interface Preset {
//   // Phase: prepare duration of the Set.
//   prepareSecs: number
//   // Phase: workout duration of the CYCLE.
//   workoutSecs: number
//   // Phase: rest duration of the CYCLE.
//   restSecs: number
//   // A cycle includes 3 phases: prepare, workout, rest.
//   cyclesCount: number
//   // A set includes multiple cycles.
//   setsCount: number
// }

import { TimerPhase } from '@/models/timer-phase'

export class Preset {
  // Phase: prepare duration of the Set.
  public PrepareSecs: number
  // Phase: workout duration of the CYCLE.
  public WorkoutSecs: number
  // Phase: rest duration of the CYCLE.
  public RestSecs: number
  // A cycle includes 3 phases: prepare, workout, rest.
  public CyclesCount: number
  // A set includes multiple cycles.
  public SetsCount: number

  constructor(prepareSecs: number, workoutSecs: number, restSecs: number, cyclesCount: number, setsCount: number) {
    this.PrepareSecs = prepareSecs
    this.WorkoutSecs = workoutSecs
    this.RestSecs = restSecs
    this.CyclesCount = cyclesCount
    this.SetsCount = setsCount
  }

  public TotalPresetDurationSecs = () =>
    (this.PrepareSecs + (this.WorkoutSecs + this.RestSecs) * this.CyclesCount) * this.SetsCount

  public SetDurationSecs = () => this.PrepareSecs + (this.WorkoutSecs + this.RestSecs) * this.CyclesCount

  public SetCycleDurationSecs = () => this.WorkoutSecs + this.RestSecs

  public SetTotalCyclesDurationSecs = () => (this.WorkoutSecs + this.RestSecs) * this.CyclesCount
}

export interface TickedPreset {
  // In Preset:
  setsRemainingCount: number
  // In Current-Set: setCyclesRemainingCount
  setCyclesRemainingCount: number
  setCurrentPhase?: TimerPhase
  setPrepareRemainingSecs: number
  // In Current-Cycle:
  cycleWorkoutRemainingSecs: number
  cycleRestRemainingSecs: number
}

// //// Timer Section:
// @summary-section:
//   ? change-current-preset-button:
//     ? time-renaming:
//     ? total-time:
//
// @details-section (Normal state):
// current preset:
// In-timer-phase state (Prepare|Workout|Rest)
// - phase-name
// - time-left-in-phase
//
