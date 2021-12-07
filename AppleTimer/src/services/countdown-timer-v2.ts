import { logger } from '@/utils/logger'
import { PositiveOr0 } from '@/utils/common-util'
import BackgroundTimer from 'react-native-background-timer'
import { runAccurateBackgroundCountdownTimer } from '@/utils/timer-util'

// Actions: Start, Pause + Resume, StopAndReset
// Statuses: IDLE, PAUSED, TICKING
export enum TimerStatus {
  IDLE = 'IDLE',
  PAUSED = 'PAUSED',
  TICKING = 'TICKING',
}

export class CountdownTimerV2 {
  private readonly INTERVAL = 1000
  private readonly _initialCountdownSecs: number
  private _remainingCountdownMilliSecs: number = 0
  private _remainingMsLastUpdatedAt: number = 0
  private _timerId?: number
  private _secsCounter: number = 0

  public Status: TimerStatus = TimerStatus.IDLE
  public OnStatusChanged?: (oldStatus: TimerStatus, newStatus: TimerStatus) => Promise<void>
  public OnTicked?: (secsLeft: number) => Promise<void>
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
    await this.runSlices(this._initialCountdownSecs, 0)
  }

  pause() {
    if (this.Status !== TimerStatus.TICKING) {
      return
    }

    const pausedAt = new Date().getTime()
    this.clear()
    this.changeStatusTo(TimerStatus.PAUSED)
    this.OnPaused && this.OnPaused(this._remainingCountdownMilliSecs).catch(e => this.handleErr('PAUSE', e))
    // Why add the `compensation-ms`?: add this compensation to make sure, we can resume closely from where we
    // paused. Otherwise, if the user clicks the pause/resume many times, some of the ms will be lost.
    // Why number `13`?: it's a empiric-value, get it via the `auto-test`. With this value, the auto-test can click
    // pause/resume button around 150 times for a 3secs duration preset. It's a good enough result already.
    const compensationMs = 13
    const timeElapsedMs = PositiveOr0(pausedAt - compensationMs - this._remainingMsLastUpdatedAt)
    // console.log(`>>> countdown-timer-v2:pause: [${this._secsCounter}]: ${timeElapsedMs},`)
    this.reduceRemainingMs(this._secsCounter - 1, timeElapsedMs, 'PAUSE', async () => {})
  }

  async resume(): Promise<void> {
    if (this.Status !== TimerStatus.PAUSED) {
      return
    }

    console.log(`[Resumed] With remaining milliSecs:${this._remainingCountdownMilliSecs}`)
    const countdownSecs = Math.floor(this._remainingCountdownMilliSecs / this.INTERVAL)
    const beforeStartDelayMilliSecs = this._remainingCountdownMilliSecs % this.INTERVAL
    this.changeStatusTo(TimerStatus.TICKING)
    this.OnResumed && this.OnResumed(this._remainingCountdownMilliSecs).catch(e => this.handleErr('RESUME', e))
    await this.runSlices(countdownSecs, beforeStartDelayMilliSecs)
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
    this._timerId && BackgroundTimer.clearInterval(this._timerId)
    this._timerId = undefined
  }

  private changeStatusTo(newStatus: TimerStatus) {
    const oldStatus = this.Status
    this.Status = newStatus
    this.OnStatusChanged && this.OnStatusChanged(oldStatus, newStatus).catch(() => {})
  }

  private async runSlices(countdownSecs: number, delayMilliSecs?: number): Promise<void> {
    this._secsCounter = countdownSecs
    return new Promise(resolve => {
      this._timerId = runAccurateBackgroundCountdownTimer(
        countdownSecs,
        delayMilliSecs || 0,
        async (remainingSecs: number, rawRemainingMs: number, diff: number) => {
          this._secsCounter = remainingSecs
          this.reduceRemainingMs(remainingSecs, diff, 'run-slices', async () => {
            resolve()
          })
        },
      )
      // For New-Start or Resume, we should consider it as `new remainingMs accepted`, so need to update this field.
      // We named it as `this._runStartedAt` previously.
      this._remainingMsLastUpdatedAt = Date.now()
    })
  }

  private reduceRemainingMs = (
    secsCounter: number,
    elapsedMs: number,
    hint: string,
    onTimerCompletedCallback: () => Promise<void>,
  ) => {
    const oldRemaining = this._remainingCountdownMilliSecs
    this._remainingCountdownMilliSecs -= elapsedMs
    this._remainingMsLastUpdatedAt = Date.now()
    // logger.info(
    //   `[reduce-remainingMs][${hint}]: elapsedMs:${elapsedMs}, secsCounter:${secsCounter}, ` +
    //     `old-remaining-ms:${oldRemaining}, ` +
    //     `updated-remaining-ms:${this._remainingCountdownMilliSecs}`,
    // )
    // When oldSecs != newSecs, then trigger the Ticked event
    const oldSecs = Math.floor(oldRemaining / this.INTERVAL)
    const updatedSecs = Math.floor(this._remainingCountdownMilliSecs / this.INTERVAL)
    if (updatedSecs !== oldSecs) {
      this.triggerCallback(oldSecs, this._remainingCountdownMilliSecs, 'hint')
    }
    // If we use the `auto-test, in the `Debugger` screen` with 20ms, then can trigger this scenario.
    // Need to ensure the ms between 1s-0s can be properly elapsed also.
    if (oldSecs <= 0 && this._remainingCountdownMilliSecs <= 0) {
      this.stopAndReset()
      onTimerCompletedCallback().catch(() => {})
    }
  }

  private triggerCallback(secsLeft: number, rawRemainingMs?: number, hint?: string) {
    // trigger this call asynchronously, to make sure the "onTicked" call-back can be invoked on time.
    this.OnTicked && this.OnTicked(secsLeft).catch(e => this.handleErr('TICK', e))
    // logger.info(`[(${secsLeft} secs)] Ticked, rawRemainingMs:${rawRemainingMs}, [${hint}]`)
  }

  // noinspection JSMethodCanBeStatic
  private handleErr(event: string, e: Error) {
    logger.error(`Event:${event} callback error: `, e)
  }
}
