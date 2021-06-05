import moment from 'moment'
import { FULL_TIMESTAMP } from '@/utils/date-util'
import { logger } from '@/utils/logger'

export enum TickingType {
  Started = 'Started',
  Resumed = 'Resumed',
  Ticked = 'Ticked',
  Finished = 'Finished',
}

// Actions: Start, Pause + Resume, StopAndReset
// Statuses: IDLE, PAUSED, TICKING
export enum TimerStatus {
  IDLE = 'idle',
  PAUSED = 'paused',
  TICKING = 'ticking',
}

export class CountdownTimer {
  private readonly INTERVAL = 1000
  private readonly _initialCountdownSecs: number
  private _remainingCountdownMilliSecs: number = 0
  private _timerId?: NodeJS.Timeout
  private _delayTimerId?: NodeJS.Timeout
  private _runStartedAt: number = 0

  public Status: TimerStatus = TimerStatus.IDLE
  public OnTicked?: (type: TickingType, secsLeft: number) => Promise<void>
  public OnPaused?: (milliSecsLeft: number) => Promise<void> // Manually
  public OnResumed?: (milliSecsLeft: number) => Promise<void> // Manually
  public OnStopped?: (milliSecsLeft: number) => Promise<void> // Manually

  constructor(countdownSecs: number, onTicked?: (type: TickingType, secsLeft: number) => Promise<void>) {
    this._initialCountdownSecs = countdownSecs
    this.OnTicked = onTicked

    if ((countdownSecs * 1000) % this.INTERVAL !== 0) {
      throw new Error(
        `The countdownSecs:${countdownSecs} should be divided by INTERVAL:${this.INTERVAL} with no remainder.`,
      )
    }
  }

  async start(): Promise<void> {
    logger.info(`[Started] With initial-countdown-secs:${this._initialCountdownSecs}`)
    this._remainingCountdownMilliSecs = this._initialCountdownSecs * 1000

    this.clear()
    this.Status = TimerStatus.TICKING
    await this.runSlices(TickingType.Started, this._initialCountdownSecs, 0)
    logger.info('lalal start')
  }

  pause() {
    if (this.Status !== TimerStatus.TICKING) {
      return
    }

    // 1.Pause:
    this.clear()
    this.Status = TimerStatus.PAUSED
    // 2.Exclude the passed milli-secs, then get the `remaining-countdown-milli-secs`.
    const pausedAt = new Date().getTime()
    const before = this._remainingCountdownMilliSecs
    const timeLeft = this._remainingCountdownMilliSecs - (pausedAt - this._runStartedAt)
    this._remainingCountdownMilliSecs = timeLeft < 0 ? 0 : timeLeft
    // Trigger Event:
    this.OnPaused && this.OnPaused(this._remainingCountdownMilliSecs).catch(e => this.handleEventError('PAUSE', e))
    // Logs:
    logger.info(
      `[Paused] RemainingCountdownMilliSecs: before:${before}|after:${this._remainingCountdownMilliSecs}; ` +
        `runStartedAt:${this._runStartedAt}/pausedAt:${pausedAt}; Diff:${pausedAt - this._runStartedAt}`,
    )
  }

  async resume() {
    if (this.Status !== TimerStatus.PAUSED) {
      return
    }

    logger.info(`[Resumed] With remainingCountdownMilliSecs:${this._remainingCountdownMilliSecs}`)
    const countdownSecs = Math.floor(this._remainingCountdownMilliSecs / this.INTERVAL)
    const beforeStartDelayMilliSecs = this._remainingCountdownMilliSecs % this.INTERVAL
    this.Status = TimerStatus.TICKING
    this.OnResumed && this.OnResumed(this._remainingCountdownMilliSecs).catch(e => this.handleEventError('RESUME', e))
    await this.runSlices(TickingType.Resumed, countdownSecs, beforeStartDelayMilliSecs)
    logger.info('lalal resume')
  }

  stopAndReset() {
    this.clear()
    this.Status = TimerStatus.IDLE
    this.OnStopped &&
      this.OnStopped(this._remainingCountdownMilliSecs).catch(e => this.handleEventError('STOP-AND-RESET', e))
    this._remainingCountdownMilliSecs = 0
  }

  private clear() {
    this._delayTimerId && clearInterval(this._delayTimerId)
    this._delayTimerId = undefined
    this._timerId && clearInterval(this._timerId)
    this._timerId = undefined
  }

  private async runSlices(type: TickingType, countdownSecs: number, beforeStartDelayMilliSecs?: number): Promise<void> {
    return new Promise(resolve => {
      const extracted = () => {
        let counter = countdownSecs
        this.triggerCallback(type, counter)

        if (counter === 0) {
          this.stopAndReset()
          this.triggerCallback(TickingType.Finished, counter)
          resolve()
          return
        }

        this._timerId = setInterval(() => {
          counter--
          if (counter === 0) {
            this.stopAndReset()
            this.triggerCallback(TickingType.Finished, counter)
            resolve()
          } else {
            this.triggerCallback(TickingType.Ticked, counter)
          }
        }, this.INTERVAL)
      }

      this._runStartedAt = new Date().getTime()
      beforeStartDelayMilliSecs
        ? (this._delayTimerId = setTimeout(() => extracted.call(this), beforeStartDelayMilliSecs || 0))
        : extracted.call(this)
    })
  }

  private triggerCallback(type: TickingType, secsLeft: number) {
    logger.info(`[(${secsLeft} secs)|${moment(Date.now()).format(FULL_TIMESTAMP)}] Trigger-callback-at ${type}`)
    // trigger this call asynchronously, to make sure the "onTicked" call-back can be invoked on time.
    this.OnTicked && this.OnTicked(type, secsLeft).catch(e => this.handleEventError('TICK', e))
  }

  // noinspection JSMethodCanBeStatic
  private handleEventError(event: string, e: Error) {
    logger.error(`Event:${event} callback error: `, e)
  }
}
