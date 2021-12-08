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

export interface TickedContext {
  // NEW: `The identifier`
  totalRemainingSeconds: number
  // NEW: The ticking-events to be triggered at this specific second.
  events: TickingEvent[]

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

export interface UnpackedPresetMap {
  [key: string]: TickedContext
}

export enum TickingEvent {
  // Ticked = 1,
  //
  CycleStarted = 'CycleStarted',
  PreparePhaseStarted = 'PreparePhaseStarted',
  PreparePhaseClosing = 'PreparePhaseClosing',
  // The time that new-set started, also means the previous set is competed.
  SetStarted = 'SetStarted',
  WorkoutPhaseStarted = 'WorkoutPhaseStarted',
  WorkoutPhaseClosing = 'WorkoutPhaseClosing',
  //
  RestPhaseStarted = 'RestPhaseStarted',
  RestPhaseClosing = 'RestPhaseClosing',
}
