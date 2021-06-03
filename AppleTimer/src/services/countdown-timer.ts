import moment from 'moment'
import { FULL_TIMESTAMP } from '@/utils/date-util'

export enum TickingType {
  Started = 'Started',
  Ticked = 'Ticked',
  Finished = 'Finished',
}

// Start, Pause + Resume, Stop, Reset
export enum TimerStatus {
  IDLE = 'idle',
  PAUSED = 'paused',
  TICKING = 'ticking',
}

export class CountdownTimer {
  private readonly INTERVAL = 1000
  private readonly _initialCountdownSecs: number
  private readonly _onTicked?: (type: TickingType, secsLeft: number) => Promise<void>
  private _isPaused: boolean = false
  private _timerId?: NodeJS.Timeout
  private _delayTimerId?: NodeJS.Timeout
  private _remainingCountdownMilliSecs: number = 0
  private _runStartTime: number = 0

  public Status: TimerStatus = TimerStatus.IDLE

  constructor(countdownSecs: number, onTicked?: (type: TickingType, secsLeft: number) => Promise<void>) {
    this._initialCountdownSecs = countdownSecs
    this._onTicked = onTicked

    if ((countdownSecs * 1000) % this.INTERVAL !== 0) {
      throw new Error(
        `The countdownSecs:${countdownSecs} should be divided by INTERVAL:${this.INTERVAL} with no remainder.`,
      )
    }
  }

  async start(): Promise<void> {
    console.log(`[Started] With initial-countdown-secs:${this._initialCountdownSecs}`)
    this._remainingCountdownMilliSecs = this._initialCountdownSecs * 1000

    this.clear()
    this._isPaused = false
    this.Status = TimerStatus.TICKING
    await this.runSlices(this._initialCountdownSecs, 0)
  }

  pause() {
    if (this._isPaused || this.Status !== TimerStatus.TICKING) {
      return
    }

    // 1.Pause:
    this.clear()
    this._isPaused = true
    this.Status = TimerStatus.PAUSED
    // 2.Exclude the passed milli-secs, then get the `remaining-countdown-milli-secs`.
    const pausedTime = new Date().getTime()
    const temp = this._remainingCountdownMilliSecs
    const timeLeft = this._remainingCountdownMilliSecs - (pausedTime - this._runStartTime)
    this._remainingCountdownMilliSecs = timeLeft < 0 ? 0 : timeLeft
    // Logs:
    console.log(
      `[Paused] RemainingCountdownMilliSecs: before:${temp}|after:${this._remainingCountdownMilliSecs};` +
        `runStartTime: ${this._runStartTime}; pausedTime: ${pausedTime}; Diff: ${pausedTime - this._runStartTime}`,
    )
  }

  async resume() {
    if (!this._isPaused || this.Status !== TimerStatus.PAUSED) {
      return
    }

    console.log(`[Resumed] With remainingCountdownMilliSecs:${this._remainingCountdownMilliSecs}`)
    const countdownSecs = Math.floor(this._remainingCountdownMilliSecs / this.INTERVAL)
    const beforeStartDelayMilliSecs = this._remainingCountdownMilliSecs % this.INTERVAL
    this._isPaused = false
    this.Status = TimerStatus.TICKING
    await this.runSlices(countdownSecs, beforeStartDelayMilliSecs)
  }

  stop() {
    this.clear()
    this._isPaused = false
    this.Status = TimerStatus.IDLE
    this._remainingCountdownMilliSecs = 0
  }

  private clear() {
    this._delayTimerId && clearInterval(this._delayTimerId)
    this._delayTimerId = undefined
    this._timerId && clearInterval(this._timerId)
    this._timerId = undefined
  }

  private async runSlices(countdownSecs: number, beforeStartDelayMilliSecs?: number): Promise<void> {
    return new Promise(resolve => {
      const extracted = () => {
        let counter = countdownSecs
        this.triggerCallback(TickingType.Started, counter)

        if (counter === 0) {
          this.stop()
          this.triggerCallback(TickingType.Finished, counter)
          resolve()
          return
        }

        this._timerId = setInterval(() => {
          counter--
          if (counter === 0) {
            this.stop()
            this.triggerCallback(TickingType.Finished, counter)
            resolve()
          } else {
            this.triggerCallback(TickingType.Ticked, counter)
          }
        }, this.INTERVAL)
      }

      this._runStartTime = new Date().getTime()
      beforeStartDelayMilliSecs
        ? (this._delayTimerId = setTimeout(() => extracted.call(this), beforeStartDelayMilliSecs || 0))
        : extracted.call(this)
      //
      console.log('lalal')
    })
  }

  private triggerCallback(type: TickingType, secsLeft: number) {
    console.log(`>>> [(${secsLeft} secs)|${moment(Date.now()).format(FULL_TIMESTAMP)}] Trigger-callback-at ${type}`)
    // trigger this call asynchronously, to make sure the "onTicked" call-back can be invoked on time.
    this._onTicked && this._onTicked(type, secsLeft).catch(e => console.log('Error while executing _onTicked:', e))
  }
}
