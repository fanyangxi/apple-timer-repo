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
