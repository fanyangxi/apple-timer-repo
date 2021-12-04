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
  private readonly TAG = '[TIMER-SERVICE]'
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
  public OnSetStarted?: (setIndex: number) => Promise<void>
  public OnPreparePhaseStarted?: () => Promise<void>
  public OnPreparePhaseIsClosing?: (setRepsRemainingCount: number) => Promise<void>
  // The time that new-repetition started, also means the previous repetition competed.
  public OnRepetitionStarted?: (repetitionIndex: number) => Promise<void>
  public OnWorkoutPhaseStarted?: () => Promise<void>
  public OnWorkoutPhaseIsClosing?: () => Promise<void>
  public OnRestPhaseStarted?: () => Promise<void>
  public OnRestPhaseIsClosing?: (setRepsRemainingCount: number) => Promise<void>

  private CLOSING_SECS = 3
  private REST_PHASE_CLOSING_SECS = 3

  constructor(preset: Preset) {
    this._preset = preset
  }

  runPreset = async () => {
    this._countdownTimer = new CountdownTimer(getTotalPresetDurationSecs(this._preset))
    this._countdownTimer.OnTicked = async (type: TickingType, secsLeft: number): Promise<void> => {
      const ticked = getUpdatedPreset(this._preset, secsLeft)
      this.OnTicked && this.OnTicked(0, 0, type, secsLeft, ticked)
      // // Current rep is closing (Prepare & Workout are 0), & it's the last one in current set:
      // const isSetCompleted = [
      //   ticked.setRepsRemainingCount === 1,
      //   ticked.setPrepareRemainingSecs === 0,
      //   ticked.repWorkoutRemainingSecs === 0,
      // ].every(item => item)

      if (ticked.setCurrentPhase === TimerPhase.Prepare) {
        // Started
        if (ticked.setPrepareRemainingSecs === this._preset.PrepareSecs) {
          logger.info(`${this.TAG}: OnSetStarted: ${ticked.setsRemainingCount} left`)
          this.OnSetStarted && this.OnSetStarted(ticked.setsRemainingCount).catch(this.handle)
          this.OnPreparePhaseStarted && this.OnPreparePhaseStarted().catch(this.handle)
        }
        // IsClosing
        const minClosingSecs = Math.min(this.CLOSING_SECS, this._preset.PrepareSecs)
        if (ticked.setPrepareRemainingSecs === minClosingSecs) {
          this.OnPreparePhaseIsClosing && this.OnPreparePhaseIsClosing(ticked.setRepsRemainingCount).catch(this.handle)
        }
      }

      if (ticked.setCurrentPhase === TimerPhase.Workout) {
        // Started
        if (ticked.repWorkoutRemainingSecs === this._preset.WorkoutSecs) {
          logger.info(`${this.TAG}: OnRepetitionStarted: ${ticked.setRepsRemainingCount} left`)
          this.OnRepetitionStarted && this.OnRepetitionStarted(ticked.setRepsRemainingCount).catch(this.handle)
          this.OnWorkoutPhaseStarted && this.OnWorkoutPhaseStarted().catch(this.handle)
        }
        // IsClosing
        const minClosingSecs = Math.min(this.CLOSING_SECS, this._preset.WorkoutSecs)
        if (ticked.repWorkoutRemainingSecs === minClosingSecs) {
          this.OnWorkoutPhaseIsClosing && this.OnWorkoutPhaseIsClosing().catch(this.handle)
        }
      }

      if (ticked.setCurrentPhase === TimerPhase.Rest) {
        // Started
        if (ticked.repRestRemainingSecs === this._preset.RestSecs) {
          this.OnRestPhaseStarted && this.OnRestPhaseStarted().catch(this.handle)
        }
        // IsClosing
        const minClosingSecs = Math.min(this.REST_PHASE_CLOSING_SECS, this._preset.RestSecs)
        if (ticked.repRestRemainingSecs === minClosingSecs) {
          // Since we're still in current Rep, so we do '-1' here.
          const setRepsLeft = ticked.setRepsRemainingCount - 1
          this.OnRestPhaseIsClosing && this.OnRestPhaseIsClosing(setRepsLeft).catch(this.handle)
        }
      }
    }

    this._countdownTimer.OnStarted = async (milliSecsLeft: number): Promise<void> => {
      logger.info(`${this.TAG}: OnStarted: ${milliSecsLeft}ms left`)
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
      logger.info(`${this.TAG}: OnStopped: ${milliSecsLeft}ms left`)
      this.OnTimerStopped && this.OnTimerStopped(milliSecsLeft).catch(this.handle)
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
    this._countdownTimer?.stopAndReset()
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
