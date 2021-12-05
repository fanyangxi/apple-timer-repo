import { logger } from '@/utils/logger'
import { PositiveOr0 } from '@/utils/common-util'
import queueMicrotask from 'queue-microtask'

export enum TickingType {
  Started = 'Started',
  Resumed = 'Resumed',
  Ticked = 'Ticked',
  Finished = 'Finished',
}

// Actions: Start, Pause + Resume, StopAndReset
// Statuses: IDLE, PAUSED, TICKING
export enum TimerStatus {
  IDLE = 'IDLE',
  PAUSED = 'PAUSED',
  TICKING = 'TICKING',
}

export class CountdownTimer {
  private readonly INTERVAL = 1000
  private readonly _initialCountdownSecs: number
  private _remainingCountdownMilliSecs: number = 0
  private _timerId?: NodeJS.Timeout
  private _delayTimerId?: NodeJS.Timeout
  private _runStartedAt: number = 0

  public Status: TimerStatus = TimerStatus.IDLE
  public OnStatusChanged?: (oldStatus: TimerStatus, newStatus: TimerStatus) => Promise<void>
  public OnTicked?: (type: TickingType, secsLeft: number) => Promise<void>
  public OnStarted?: (milliSecsLeft: number) => Promise<void> // Manually
  public OnPaused?: (milliSecsLeft: number) => Promise<void> // Manually
  public OnResumed?: (milliSecsLeft: number) => Promise<void> // Manually
  public OnStopped?: (milliSecsLeft: number) => Promise<void> // Manually
  public OnCompleted?: (milliSecsLeft: number) => Promise<void>

  constructor(countdownSecs: number) {
    this._initialCountdownSecs = countdownSecs

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
    this.changeStatusTo(TimerStatus.TICKING)
    this.OnStarted && this.OnStarted(this._remainingCountdownMilliSecs).catch(e => this.handleErr('STARTED', e))
    await this.runSlices(TickingType.Started, this._initialCountdownSecs, 0)
  }

  pause() {
    if (this.Status !== TimerStatus.TICKING) {
      return
    }

    // 1.Get the paused time, right before the clear.
    const pausedAt = new Date().getTime()
    this.clear()
    //
    this.changeStatusTo(TimerStatus.PAUSED)
    // 2.Exclude the passed milli-secs, then get the `remaining-countdown-milli-secs`.
    const before = this._remainingCountdownMilliSecs
    // Why add the `compensation-ms`?: add this compensation to make sure, we can resume closely from where we
    // paused. Otherwise, if the user clicks the pause/resume many times, some of the ms will be lost.
    // Why number `13`?: it's a empiric-value, get it via the `auto-test`. With this value, the auto-test can click
    // pause/resume button around 150 times for a 3secs duration preset. It's a good enough result already.
    const compensationMs = 13
    const timeElapsedMs = PositiveOr0(pausedAt - compensationMs - this._runStartedAt)
    const remainingMsLeft = PositiveOr0(before - timeElapsedMs)
    this._remainingCountdownMilliSecs = before < remainingMsLeft ? before : remainingMsLeft
    // Trigger Event:
    this.OnPaused && this.OnPaused(this._remainingCountdownMilliSecs).catch(e => this.handleErr('PAUSE', e))
    // // **This log-entry should not appear on PROD app**:
    // console.log(
    //   '[Paused] Remaining milliSecs: ' +
    //     `before:${before}|after:${this._remainingCountdownMilliSecs}|` +
    //     `elapsed:${before - this._remainingCountdownMilliSecs}; ` +
    //     `runStartedAt:${this._runStartedAt}/pausedAt:${pausedAt}`,
    // )
  }

  async resume(): Promise<void> {
    if (this.Status !== TimerStatus.PAUSED) {
      return
    }

    // // **This log-entry should not appear on PROD app**:
    // console.log(`[Resumed] With remaining milliSecs:${this._remainingCountdownMilliSecs}`)
    const countdownSecs = Math.floor(this._remainingCountdownMilliSecs / this.INTERVAL)
    const beforeStartDelayMilliSecs = this._remainingCountdownMilliSecs % this.INTERVAL
    this.changeStatusTo(TimerStatus.TICKING)
    this.OnResumed && this.OnResumed(this._remainingCountdownMilliSecs).catch(e => this.handleErr('RESUME', e))
    await this.runSlices(TickingType.Resumed, countdownSecs, beforeStartDelayMilliSecs)
  }

  stopAndReset(force: boolean = false) {
    this.clear()
    this.changeStatusTo(TimerStatus.IDLE)
    if (force) {
      this.OnStopped && this.OnStopped(this._remainingCountdownMilliSecs).catch(e => this.handleErr('STOPPED', e))
    } else {
      this.OnCompleted && this.OnCompleted(this._remainingCountdownMilliSecs).catch(e => this.handleErr('COMPLETED', e))
    }
    this._remainingCountdownMilliSecs = 0
  }

  private clear() {
    this._delayTimerId && clearInterval(this._delayTimerId)
    this._delayTimerId = undefined
    this._timerId && clearInterval(this._timerId)
    this._timerId = undefined
  }

  private changeStatusTo(newStatus: TimerStatus) {
    const oldStatus = this.Status
    this.Status = newStatus
    this.OnStatusChanged && this.OnStatusChanged(oldStatus, newStatus).catch(() => {})
  }

  private async runSlices(type: TickingType, countdownSecs: number, beforeStartDelayMilliSecs?: number): Promise<void> {
    return new Promise(resolve => {
      const extracted = () => {
        let counter = countdownSecs
        this.triggerCallback(type, counter, beforeStartDelayMilliSecs)

        if (counter === 0) {
          this.triggerCallback(TickingType.Finished, counter)
          this.stopAndReset()
          resolve()
          return
        }

        this._timerId = setInterval(() => {
          counter--
          if (counter === 0) {
            this.triggerCallback(TickingType.Finished, counter)
            this.stopAndReset()
            resolve()
          } else {
            this.triggerCallback(TickingType.Ticked, counter)
          }
        }, this.INTERVAL)
      }

      this._delayTimerId = setTimeout(() => extracted.call(this), beforeStartDelayMilliSecs || 0)
      this._runStartedAt = new Date().getTime()
    })
  }

  private triggerCallback(type: TickingType, secsLeft: number, beforeStartDelayMilliSecs?: number) {
    // trigger this call asynchronously, to make sure the "onTicked" call-back can be invoked on time.
    this.OnTicked && this.OnTicked(type, secsLeft).catch(e => this.handleErr('TICK', e))
    logger.info(`[(${secsLeft} secs)] Trigger-callback-at (${type}), delay:${beforeStartDelayMilliSecs}`)
  }

  // noinspection JSMethodCanBeStatic
  private handleErr(event: string, e: Error) {
    logger.error(`Event:${event} callback error: `, e)
  }
}
