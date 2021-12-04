import { Preset, TickedPreset } from '@/models/preset'
import { CountdownTimer, TickingType, TimerStatus } from '@/services/countdown-timer'
import { getTotalPresetDurationSecs, getUpdatedPreset } from '@/utils/preset-util'
import { TimerPhase } from '@/models/timer-phase'
import { logger } from '@/utils/logger'

export type PresetTickedEventHandler = (
  currentSet: number,
  currentRep: number,
  type: TickingType,
  secsLeft: number,
  tickedPreset: TickedPreset,
) => void

export class TimerService {
  private readonly _preset: Preset
  private _countdownTimer?: CountdownTimer

  public Status: TimerStatus = TimerStatus.IDLE
  public OnStatusChanged?: (oldStatus: TimerStatus, newStatus: TimerStatus) => Promise<void>
  public OnTicked?: PresetTickedEventHandler
  //
  public OnTimerStarted?: (milliSecsLeft: number) => Promise<void> // Manually
  public OnPaused?: (milliSecsLeft: number) => Promise<void> // Manually
  public OnResumed?: (milliSecsLeft: number) => Promise<void> // Manually
  public OnTimerStopped?: (milliSecsLeft: number) => Promise<void> // Manually
  //
  public OnPreparePhaseStarted?: () => Promise<void>
  public OnPreparePhaseIsClosing?: (setRepsRemainingCount: number) => Promise<void>
  public OnWorkoutPhaseStarted?: () => Promise<void>
  public OnWorkoutPhaseIsClosing?: () => Promise<void>
  public OnRestPhaseStarted?: () => Promise<void>
  public OnRestPhaseIsClosing?: (setRepsRemainingCount: number) => Promise<void>
  public OnSetCompleted?: () => Promise<void>

  private PREPARE_PHASE_CLOSING_SECS = 3
  private WORKOUT_PHASE_CLOSING_SECS = 3
  private REST_PHASE_CLOSING_SECS = 3

  constructor(preset: Preset) {
    this._preset = preset
  }

  runPreset = async () => {
    this._countdownTimer = new CountdownTimer(getTotalPresetDurationSecs(this._preset))
    this._countdownTimer.OnTicked = async (type: TickingType, secsLeft: number): Promise<void> => {
      const tickedPreset = getUpdatedPreset(this._preset, secsLeft)
      this.OnTicked && this.OnTicked(0, 0, type, secsLeft, tickedPreset)
      // Current rep is closing (Prepare & Workout are 0), & it's the last one in current set:
      const isSetCompleted = [
        tickedPreset.setRepsRemainingCount === 1,
        tickedPreset.setPrepareRemainingSecs === 0,
        tickedPreset.repWorkoutRemainingSecs === 0,
      ].every(item => item)

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
            (await this.OnPreparePhaseIsClosing(tickedPreset.setRepsRemainingCount).catch(e =>
              this.handleError('PREPARE-PHASE-IS-CLOSING ', e),
            ))
        }
      }

      if (tickedPreset.setCurrentPhase === TimerPhase.Workout) {
        // Started
        if (tickedPreset.repWorkoutRemainingSecs === this._preset.WorkoutSecs) {
          this.OnWorkoutPhaseStarted &&
            (await this.OnWorkoutPhaseStarted().catch(e => this.handleError('WORKOUT-PHASE-STARTED', e)))
        }
        // IsClosing
        const minClosingSecs = Math.min(this.WORKOUT_PHASE_CLOSING_SECS, this._preset.WorkoutSecs)
        if (tickedPreset.repWorkoutRemainingSecs === minClosingSecs) {
          this.OnWorkoutPhaseIsClosing &&
            (await this.OnWorkoutPhaseIsClosing().catch(e => this.handleError('WORKOUT-PHASE-IS-CLOSING', e)))
        }
      }

      if (tickedPreset.setCurrentPhase === TimerPhase.Rest) {
        // Started
        if (tickedPreset.repRestRemainingSecs === this._preset.RestSecs) {
          this.OnRestPhaseStarted &&
            (await this.OnRestPhaseStarted().catch(e => this.handleError('REST-PHASE-STARTED', e)))
        }
        // IsClosing
        const minClosingSecs = Math.min(this.REST_PHASE_CLOSING_SECS, this._preset.RestSecs)
        if (tickedPreset.repRestRemainingSecs === minClosingSecs) {
          // Since we're still in current Rep, so we do '-1' here.
          const setRepsLeft = tickedPreset.setRepsRemainingCount - 1
          isSetCompleted
            ? this.OnSetCompleted && (await this.OnSetCompleted().catch(e => this.handleError('SET-COMPLETED', e)))
            : this.OnRestPhaseIsClosing &&
              (await this.OnRestPhaseIsClosing(setRepsLeft).catch(e => this.handleError('REST-PHASE-IS-CLOSING', e)))
        }
      }
    }
    this._countdownTimer.OnStarted = async (milliSecsLeft: number): Promise<void> => {
      logger.info(`OnStarted: ${milliSecsLeft}ms left`)
      this.OnTimerStarted && (await this.OnTimerStarted(milliSecsLeft).catch(e => this.handleError('TIMER-STARTED', e)))
    }
    this._countdownTimer.OnPaused = async (milliSecsLeft: number): Promise<void> => {
      logger.info(`OnPaused: ${milliSecsLeft}ms left`)
      this.OnPaused && (await this.OnPaused(milliSecsLeft).catch(e => this.handleError('PAUSED', e)))
    }
    this._countdownTimer.OnResumed = async (milliSecsLeft: number): Promise<void> => {
      logger.info(`OnResumed: ${milliSecsLeft}ms left`)
      this.OnResumed && (await this.OnResumed(milliSecsLeft).catch(e => this.handleError('RESUMED', e)))
    }
    this._countdownTimer.OnStopped = async (milliSecsLeft: number): Promise<void> => {
      logger.info(`OnStopped: ${milliSecsLeft}ms left`)
      this.OnTimerStopped && (await this.OnTimerStopped(milliSecsLeft).catch(e => this.handleError('TIMER-STOPPED', e)))
    }
    this._countdownTimer.OnStatusChanged = async (oldStatus: TimerStatus, newStatus: TimerStatus): Promise<void> => {
      logger.info(`TimerService: Status changed: old:${oldStatus} -> new:${newStatus}`)
      this.OnStatusChanged &&
        (await this.OnStatusChanged(oldStatus, newStatus).catch(e => this.handleError('Status-changes', e)))
      this.Status = newStatus
    }

    await this._countdownTimer.start()
  }

  pause = () => {
    this._countdownTimer?.pause()
  }

  resume = async () => {
    await this._countdownTimer?.resume()
  }

  stop = () => {
    this._countdownTimer?.stopAndReset()
  }

  // noinspection JSMethodCanBeStatic
  private handleError(event: string, e: Error) {
    logger.info(`Event:${event} callback error: `, e)
  }
}
