import { TimerPhase } from '@/models/timer-phase'

export class Preset {
  public Id: string
  //
  public Name: string
  // Phase: prepare duration of the Cycle.
  public PrepareSecs: number
  // Phase: workout duration of the Rep.
  public WorkoutSecs: number
  // Phase: rest duration of the Rep.
  public RestSecs: number
  // The reps count of the Cycle
  public RepsCount: number
  // The cycles count of the preset.
  public CyclesCount: number
  //
  public IsActive: boolean

  constructor(
    id: string = '',
    name: string,
    prepareSecs: number,
    workoutSecs: number,
    restSecs: number,
    repsCount: number,
    cyclesCount: number,
    isActive: boolean = false,
  ) {
    this.Id = id
    this.Name = name
    this.PrepareSecs = prepareSecs
    this.WorkoutSecs = workoutSecs
    this.RestSecs = restSecs
    this.RepsCount = repsCount
    this.CyclesCount = cyclesCount
    this.IsActive = isActive
  }
}

export interface TickedPreset {
  // In Preset:
  cyclesRemainingCount: number
  // In Current-Cycle:
  cycleRepsRemainingCount: number
  cycleCurrentPhase?: TimerPhase
  //
  setPrepareRemainingSecs: number
  // In Current-Rep:
  repWorkoutRemainingSecs: number
  repRestRemainingSecs: number
}
