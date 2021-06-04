import { Preset, TickedPreset } from '@/models/preset'
import { CountdownTimer, TickingType, TimerStatus } from '@/services/countdown-timer'
import { getUpdatedPreset } from '@/utils/preset-util'
import { TimerPhase } from '@/models/timer-phase'

export type PresetTickedEventHandler = (
  currentSet: number,
  currentCycle: number,
  type: TickingType,
  secsLeft: number,
  tickedPreset: TickedPreset,
) => void

export class TimerService {
  private readonly _preset: Preset
  private _countdownTimer?: CountdownTimer

  public OnTimerStarted?: () => Promise<void>
  public OnTicked?: PresetTickedEventHandler
  public OnTimerCompleted?: () => Promise<void>
  public OnPaused?: (milliSecsLeft: number) => Promise<void> // Manually
  public OnResumed?: (milliSecsLeft: number) => Promise<void> // Manually
  public OnStopped?: (milliSecsLeft: number) => Promise<void> // Manually
  public OnPreparePhaseStarted?: () => Promise<void>
  public OnPreparePhaseIsClosing?: () => Promise<void>
  public OnWorkoutPhaseStarted?: () => Promise<void>
  public OnWorkoutPhaseIsClosing?: () => Promise<void>
  public OnRestPhaseStarted?: () => Promise<void>
  public OnRestPhaseIsClosing?: () => Promise<void>

  private PREPARE_PHASE_CLOSING_SECS = 3
  private WORKOUT_PHASE_CLOSING_SECS = 3
  private REST_PHASE_CLOSING_SECS = 3

  constructor(preset: Preset) {
    this._preset = preset
  }

  runPreset = async () => {
    this._countdownTimer = new CountdownTimer(this._preset.TotalPresetDurationSecs())
    this._countdownTimer.OnTicked = async (type: TickingType, secsLeft: number): Promise<void> => {
      const tickedPreset = getUpdatedPreset(this._preset, secsLeft)
      this.OnTicked && this.OnTicked(0, 0, type, secsLeft, tickedPreset)

      if (tickedPreset.setCurrentPhase === TimerPhase.Prepare) {
        // Started
        if (tickedPreset.setPrepareRemainingSecs === this._preset.PrepareSecs) {
          this.OnPreparePhaseStarted &&
            (await this.OnPreparePhaseStarted().catch(e => this.handleError('PREPARE-PHASE-STARTED', e)))
        }
        // IsClosing
        const minClosingSecs = Math.min(this.PREPARE_PHASE_CLOSING_SECS, this._preset.PrepareSecs)
        if (tickedPreset.setPrepareRemainingSecs === minClosingSecs) {
          this.OnPreparePhaseIsClosing &&
            (await this.OnPreparePhaseIsClosing().catch(e => this.handleError('PREPARE-PHASE-IS-CLOSING ', e)))
        }
      }

      if (tickedPreset.setCurrentPhase === TimerPhase.Workout) {
        // Started
        if (tickedPreset.cycleWorkoutRemainingSecs === this._preset.WorkoutSecs) {
          this.OnWorkoutPhaseStarted &&
            (await this.OnWorkoutPhaseStarted().catch(e => this.handleError('WORKOUT-PHASE-STARTED', e)))
        }
        // IsClosing
        const minClosingSecs = Math.min(this.WORKOUT_PHASE_CLOSING_SECS, this._preset.WorkoutSecs)
        if (tickedPreset.cycleWorkoutRemainingSecs === minClosingSecs) {
          this.OnWorkoutPhaseIsClosing &&
            (await this.OnWorkoutPhaseIsClosing().catch(e => this.handleError('WORKOUT-PHASE-IS-CLOSING', e)))
        }
      }

      if (tickedPreset.setCurrentPhase === TimerPhase.Prepare) {
        // Started
        if (tickedPreset.cycleRestRemainingSecs === this._preset.RestSecs) {
          this.OnRestPhaseStarted &&
            (await this.OnRestPhaseStarted().catch(e => this.handleError('REST-PHASE-STARTED', e)))
        }
        // IsClosing
        const minClosingSecs = Math.min(this.REST_PHASE_CLOSING_SECS, this._preset.RestSecs)
        if (tickedPreset.cycleRestRemainingSecs === minClosingSecs) {
          this.OnRestPhaseIsClosing &&
            (await this.OnRestPhaseIsClosing().catch(e => this.handleError('REST-PHASE-IS-CLOSING', e)))
        }
      }
    }
    this._countdownTimer.OnPaused = async (milliSecsLeft: number): Promise<void> => {
      this.OnPaused && (await this.OnPaused(milliSecsLeft).catch(e => this.handleError('PAUSED', e)))
    }
    this._countdownTimer.OnResumed = async (milliSecsLeft: number): Promise<void> => {
      this.OnResumed && (await this.OnResumed(milliSecsLeft).catch(e => this.handleError('RESUMED', e)))
    }
    this._countdownTimer.OnStopped = async (milliSecsLeft: number): Promise<void> => {
      this.OnStopped && (await this.OnStopped(milliSecsLeft).catch(e => this.handleError('STOPPED', e)))
    }

    this.OnTimerStarted && (await this.OnTimerStarted().catch(e => this.handleError('TIMER-STARTED', e)))
    await this._countdownTimer.start()
    this.OnTimerCompleted && (await this.OnTimerCompleted().catch(e => this.handleError('TIMER-COMPLETED', e)))
  }

  pause = () => {
    this._countdownTimer && this._countdownTimer.pause()
  }

  resume = async () => {
    this._countdownTimer && (await this._countdownTimer.resume())
  }

  status = (): TimerStatus | undefined => {
    return this._countdownTimer && this._countdownTimer.Status
  }

  stop = () => {
    this._countdownTimer && this._countdownTimer.stopAndReset()
    this._countdownTimer && this._countdownTimer.start()
  }

  // noinspection JSMethodCanBeStatic
  private handleError(event: string, e: Error) {
    console.log(`Event:${event} callback error: `, e)
  }
}
