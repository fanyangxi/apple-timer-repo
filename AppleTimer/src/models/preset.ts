import { TimerPhase } from '@/models/timer-phase'

export class Preset {
  public Id: string
  //
  public Name: string
  // The cycles count of the preset.
  public CyclesCount: number
  // The reps count of the set
  public RepsCount: number
  // Phase: prepare duration of the Set.
  public PrepareSecs: number
  // Phase: workout duration of the Rep.
  public WorkoutSecs: number
  // Phase: rest duration of the Rep.
  public RestSecs: number
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
  setsRemainingCount: number
  // In Current-Set:
  setRepsRemainingCount: number
  setCurrentPhase?: TimerPhase
  setPrepareRemainingSecs: number
  // In Current-Rep:
  repWorkoutRemainingSecs: number
  repRestRemainingSecs: number
}
