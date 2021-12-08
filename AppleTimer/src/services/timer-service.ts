import { Preset, TickedContext, TickingEvent, UnpackedPresetMap } from '@/models/preset'
import { getTotalPresetDurationSecs } from '@/utils/preset-util'
import { logger } from '@/utils/logger'
import { CountdownTimerV2, TimerStatus } from '@/services/countdown-timer-v2'

export type TickingEventHandler = (secsLeft: number, tickedContext: TickedContext) => Promise<void>

export class TimerService {
  private readonly TAG = '[TIMER-SERVICE]'
  private readonly _preset: Preset
  private readonly _theUnpackedPresetMap: UnpackedPresetMap
  private _countdownTimer?: CountdownTimerV2

  public Status: TimerStatus = TimerStatus.IDLE
  //
  public OnStatusChanged?: (oldStatus: TimerStatus, newStatus: TimerStatus) => Promise<void>
  public OnTimerStarted?: (milliSecsLeft: number) => Promise<void> // Manually
  public OnPaused?: (milliSecsLeft: number) => Promise<void> // Manually
  public OnResumed?: (milliSecsLeft: number) => Promise<void> // Manually
  public OnTimerStopped?: (milliSecsLeft: number) => Promise<void> // Manually
  public OnTimerCompleted?: (milliSecsLeft: number) => Promise<void>
  //
  public OnTicked?: (secsLeft: number, tickedContext: TickedContext) => Promise<void>
  //
  public OnCycleStarted?: TickingEventHandler
  public OnPreparePhaseStarted?: TickingEventHandler
  public OnPreparePhaseClosing?: TickingEventHandler
  public OnSetStarted?: TickingEventHandler
  public OnWorkoutPhaseStarted?: TickingEventHandler
  public OnWorkoutPhaseClosing?: TickingEventHandler
  public OnRestPhaseStarted?: TickingEventHandler
  public OnRestPhaseClosing?: TickingEventHandler

  constructor(preset: Preset, unpackedPresetMap: UnpackedPresetMap) {
    this._preset = preset
    this._theUnpackedPresetMap = unpackedPresetMap
  }

  runPreset = async () => {
    const theEventsMap = {
      [`${TickingEvent.CycleStarted}`]: this.OnCycleStarted,
      [`${TickingEvent.PreparePhaseStarted}`]: this.OnPreparePhaseStarted,
      [`${TickingEvent.PreparePhaseClosing}`]: this.OnPreparePhaseClosing,
      [`${TickingEvent.SetStarted}`]: this.OnSetStarted,
      [`${TickingEvent.WorkoutPhaseStarted}`]: this.OnWorkoutPhaseStarted,
      [`${TickingEvent.WorkoutPhaseClosing}`]: this.OnWorkoutPhaseClosing,
      [`${TickingEvent.RestPhaseStarted}`]: this.OnRestPhaseStarted,
      [`${TickingEvent.RestPhaseClosing}`]: this.OnRestPhaseClosing,
    }

    this._countdownTimer = new CountdownTimerV2(getTotalPresetDurationSecs(this._preset))
    this._countdownTimer.OnTicked = async (secsLeft: number): Promise<void> => {
      const ticked = this._theUnpackedPresetMap[`${secsLeft}s`]
      // console.log('>>> ticked:', ticked)
      this.OnTicked && this.OnTicked(secsLeft, ticked).catch(this.handle)
      ticked.events.forEach(event => {
        const eventHandler = theEventsMap[event]
        eventHandler && eventHandler(secsLeft, ticked).catch(this.handle)
      })
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

// switch (event) {
//   //
//   case TickingEvent.CycleStarted:
//     logger.info(`${this.TAG}: OnCycleStarted: ${ticked.cyclesRemainingCount} left`)
//     this.OnCycleStarted && this.OnCycleStarted(ticked.cyclesRemainingCount).catch(this.handle)
//     break
//   case TickingEvent.PreparePhaseStarted:
//     this.OnPreparePhaseStarted && this.OnPreparePhaseStarted().catch(this.handle)
//     break
//   //
//   case TickingEvent.PreparePhaseClosing:
//     this.OnPreparePhaseClosing && this.OnPreparePhaseClosing(ticked.cycleSetsRemainingCount).catch(this.handle)
//     break
//   //
//   case TickingEvent.SetStarted:
//     logger.info(`${this.TAG}: OnSetStarted: ${ticked.cycleSetsRemainingCount} left`)
//     this.OnSetStarted && this.OnSetStarted(ticked.cycleSetsRemainingCount).catch(this.handle)
//     break
//   case TickingEvent.WorkoutPhaseStarted:
//     this.OnWorkoutPhaseStarted && this.OnWorkoutPhaseStarted().catch(this.handle)
//     break
//   //
//   case TickingEvent.WorkoutPhaseClosing:
//     this.OnWorkoutPhaseClosing && this.OnWorkoutPhaseClosing().catch(this.handle)
//     break
//   //
//   case TickingEvent.RestPhaseStarted:
//     this.OnRestPhaseStarted && this.OnRestPhaseStarted().catch(this.handle)
//     break
//   //
//   case TickingEvent.RestPhaseClosing:
//     // Since we're still in current Set, so we do '-1' here.
//     const cycleSetsLeft = ticked.cycleSetsRemainingCount - 1
//     this.OnRestPhaseClosing && this.OnRestPhaseClosing(cycleSetsLeft).catch(this.handle)
//     break
//   default:
//     break
// }
