import { Preset, TickedContext } from '@/models/preset'
import { getTotalPresetDurationSecs, getUpdatedContext } from '@/utils/preset-util'
import { TimerPhase } from '@/models/timer-phase'
import { logger } from '@/utils/logger'
import { CountdownTimerV2, TimerStatus } from '@/services/countdown-timer-v2'

export class TimerService {
  private readonly TAG = '[TIMER-SERVICE]'
  private readonly _preset: Preset
  private _countdownTimer?: CountdownTimerV2

  public Status: TimerStatus = TimerStatus.IDLE
  public OnStatusChanged?: (oldStatus: TimerStatus, newStatus: TimerStatus) => Promise<void>
  public OnTicked?: (secsLeft: number, tickedContext: TickedContext) => Promise<void>
  //
  public OnTimerStarted?: (milliSecsLeft: number) => Promise<void> // Manually
  public OnPaused?: (milliSecsLeft: number) => Promise<void> // Manually
  public OnResumed?: (milliSecsLeft: number) => Promise<void> // Manually
  public OnTimerStopped?: (milliSecsLeft: number) => Promise<void> // Manually
  public OnTimerCompleted?: (milliSecsLeft: number) => Promise<void>
  //
  public OnCycleStarted?: (cycleIndex: number) => Promise<void>
  public OnPreparePhaseStarted?: () => Promise<void>
  public OnPreparePhaseClosing?: (cycleSetsRemainingCount: number) => Promise<void>
  // The time that new-set started, also means the previous set is competed.
  public OnSetStarted?: (setIndex: number) => Promise<void>
  public OnWorkoutPhaseStarted?: () => Promise<void>
  public OnWorkoutPhaseClosing?: () => Promise<void>
  public OnRestPhaseStarted?: () => Promise<void>
  public OnRestPhaseClosing?: (cycleSetsRemainingCount: number) => Promise<void>

  private CLOSING_SECS = 3
  private REST_PHASE_CLOSING_SECS = 3

  constructor(preset: Preset) {
    this._preset = preset
  }

  runPreset = async () => {
    this._countdownTimer = new CountdownTimerV2(getTotalPresetDurationSecs(this._preset))
    this._countdownTimer.OnTicked = async (secsLeft: number): Promise<void> => {
      const ticked = getUpdatedContext(this._preset, secsLeft)
      this.OnTicked && this.OnTicked(secsLeft, ticked).catch(this.handle)

      if (ticked.cycleCurrentPhase === TimerPhase.Prepare) {
        // Started
        if (ticked.prepareRemainingSecs === this._preset.PrepareSecs) {
          logger.info(`${this.TAG}: OnCycleStarted: ${ticked.cyclesRemainingCount} left`)
          this.OnCycleStarted && this.OnCycleStarted(ticked.cyclesRemainingCount).catch(this.handle)
          this.OnPreparePhaseStarted && this.OnPreparePhaseStarted().catch(this.handle)
        }
        // IsClosing
        const minClosingSecs = Math.min(this.CLOSING_SECS, this._preset.PrepareSecs)
        if (ticked.prepareRemainingSecs === minClosingSecs) {
          this.OnPreparePhaseClosing && this.OnPreparePhaseClosing(ticked.cycleSetsRemainingCount).catch(this.handle)
        }
      }

      if (ticked.cycleCurrentPhase === TimerPhase.Workout) {
        // Started
        if (ticked.workoutRemainingSecs === this._preset.WorkoutSecs) {
          logger.info(`${this.TAG}: OnSetStarted: ${ticked.cycleSetsRemainingCount} left`)
          this.OnSetStarted && this.OnSetStarted(ticked.cycleSetsRemainingCount).catch(this.handle)
          this.OnWorkoutPhaseStarted && this.OnWorkoutPhaseStarted().catch(this.handle)
        }
        // IsClosing
        const minClosingSecs = Math.min(this.CLOSING_SECS, this._preset.WorkoutSecs)
        if (ticked.workoutRemainingSecs === minClosingSecs) {
          this.OnWorkoutPhaseClosing && this.OnWorkoutPhaseClosing().catch(this.handle)
        }
      }

      if (ticked.cycleCurrentPhase === TimerPhase.Rest) {
        // Started
        if (ticked.restRemainingSecs === this._preset.RestSecs) {
          this.OnRestPhaseStarted && this.OnRestPhaseStarted().catch(this.handle)
        }
        // IsClosing
        const minClosingSecs = Math.min(this.REST_PHASE_CLOSING_SECS, this._preset.RestSecs)
        if (ticked.restRemainingSecs === minClosingSecs) {
          // Since we're still in current Set, so we do '-1' here.
          const cycleSetsLeft = ticked.cycleSetsRemainingCount - 1
          this.OnRestPhaseClosing && this.OnRestPhaseClosing(cycleSetsLeft).catch(this.handle)
        }
      }
    }

    this._countdownTimer.OnStarted = async (milliSecsLeft: number): Promise<void> => {
      logger.info(`${this.TAG}: OnTimerStarted: ${milliSecsLeft}ms left`)
      this.OnTimerStarted && this.OnTimerStarted(milliSecsLeft).catch(this.handle)
    }
    this._countdownTimer.OnPaused = async (milliSecsLeft: number): Promise<void> => {
      logger.info(`${this.TAG}: OnPaused: ${milliSecsLeft}ms left`)
      this.OnPaused && this.OnPaused(milliSecsLeft).catch(this.handle)
    }
    this._countdownTimer.OnResumed = async (milliSecsLeft: number): Promise<void> => {
      logger.info(`${this.TAG}: OnResumed: ${milliSecsLeft}ms left`)
      this.OnResumed && this.OnResumed(milliSecsLeft).catch(this.handle)
    }
    this._countdownTimer.OnStopped = async (milliSecsLeft: number): Promise<void> => {
      logger.info(`${this.TAG}: OnTimerStopped: ${milliSecsLeft}ms left`)
      this.OnTimerStopped && this.OnTimerStopped(milliSecsLeft).catch(this.handle)
    }
    this._countdownTimer.OnCompleted = async (milliSecsLeft: number): Promise<void> => {
      logger.info(`${this.TAG}: OnTimerCompleted: ${milliSecsLeft}ms left`)
      this.OnTimerCompleted && this.OnTimerCompleted(milliSecsLeft).catch(this.handle)
    }
    this._countdownTimer.OnStatusChanged = async (oldStatus: TimerStatus, newStatus: TimerStatus): Promise<void> => {
      logger.info(`${this.TAG}: Status changed: old:${oldStatus} -> new:${newStatus}`)
      this.OnStatusChanged && this.OnStatusChanged(oldStatus, newStatus).catch(this.handle)
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
    this._countdownTimer?.stopAndReset(true)
  }

  // noinspection JSMethodCanBeStatic
  private handleError(event: string, e: Error) {
    logger.info(`Event:${event} callback error: `, e)
  }

  // noinspection JSMethodCanBeStatic
  private handle(e: Error) {
    logger.info('Callback error: ', e)
  }
}
