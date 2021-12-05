import { TimerPhase } from '@/models/timer-phase'

export class Preset {
  public Id: string
  //
  public Name: string
  // Phase: prepare duration of the Cycle.
  public PrepareSecs: number
  // Phase: workout duration of the Set.
  public WorkoutSecs: number
  // Phase: rest duration of the Set.
  public RestSecs: number
  // The sets count of the Cycle
  public SetsCount: number
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
    setsCount: number,
    cyclesCount: number,
    isActive: boolean = false,
  ) {
    this.Id = id
    this.Name = name
    this.PrepareSecs = prepareSecs
    this.WorkoutSecs = workoutSecs
    this.RestSecs = restSecs
    this.SetsCount = setsCount
    this.CyclesCount = cyclesCount
    this.IsActive = isActive
  }
}

export interface TickedPreset {
  // In Preset:
  cyclesRemainingCount: number
  // In Current-Cycle:
  cycleSetsRemainingCount: number
  cycleCurrentPhase?: TimerPhase
  //
  prepareRemainingSecs: number
  workoutRemainingSecs: number
  restRemainingSecs: number
}
