import { TimerPhase } from '@/models/timer-phase'

export class Preset {
  // The sets count of the preset.
  public SetsCount: number
  // The reps count of the set
  public RepsCount: number
  // Phase: prepare duration of the Set.
  public PrepareSecs: number
  // Phase: workout duration of the Rep.
  public WorkoutSecs: number
  // Phase: rest duration of the Rep.
  public RestSecs: number

  constructor(prepareSecs: number, workoutSecs: number, restSecs: number, repsCount: number, setsCount: number) {
    this.PrepareSecs = prepareSecs
    this.WorkoutSecs = workoutSecs
    this.RestSecs = restSecs
    this.RepsCount = repsCount
    this.SetsCount = setsCount
  }

  public TotalPresetDurationSecs = () =>
    (this.PrepareSecs + (this.WorkoutSecs + this.RestSecs) * this.RepsCount) * this.SetsCount
}

export interface TickedPreset {
  // In Preset:
  setsRemainingCount: number
  // In Current-Set:
  setRepsRemainingCount: number
  setCurrentPhase?: TimerPhase
  setPrepareRemainingSecs: number
  // In Current-Rep:
  repWorkoutRemainingSecs: number
  repRestRemainingSecs: number
}
