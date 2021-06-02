export enum TickingType {
  Started = 'Started',
  Ticked = 'Ticked',
  Finished = 'Finished',
}

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
    this._remainingCountdownMilliSecs = countdownSecs * 1000
    this._onTicked = onTicked

    if ((countdownSecs * 1000) % this.INTERVAL !== 0) {
      throw new Error(
        `The countdownSecs:${countdownSecs} should be divided by INTERVAL:${this.INTERVAL} with no remainder.`,
      )
    }
  }

  async start(): Promise<void> {
    this.Status = TimerStatus.TICKING
    this.clear()
    await this.runSlices(this._initialCountdownSecs, 0)
  }

  pause() {
    if (!this._isPaused) {
      this.Status = TimerStatus.PAUSED
      this.clear()
      const pausedTime = new Date().getTime()
      // Exclude the passed milli-secs, then get the remaining milli-secs.
      const temp = this._remainingCountdownMilliSecs
      const timeLeft = this._remainingCountdownMilliSecs - (pausedTime - this._runStartTime)
      this._remainingCountdownMilliSecs = timeLeft < 0 ? 0 : timeLeft
      this._isPaused = true
      console.log(
        `[Paused] RemainingCountdownMilliSecs: before:${temp}|after:${this._remainingCountdownMilliSecs};` +
          `runStartTime: ${this._runStartTime}; pausedTime: ${pausedTime}; Diff: ${pausedTime - this._runStartTime}` +
          '',
      )
    }
  }

  async resume() {
    if (this._isPaused) {
      this.Status = TimerStatus.TICKING
      const countdownSecs = Math.floor(this._remainingCountdownMilliSecs / this.INTERVAL)
      const beforeStartDelayMilliSecs = this._remainingCountdownMilliSecs % this.INTERVAL
      console.log(`[Resumed] countdownSecs:${countdownSecs}, beforeStartDelay:${beforeStartDelayMilliSecs}`)
      this._isPaused = false
      await this.runSlices(countdownSecs, beforeStartDelayMilliSecs)
    }
  }

  clear() {
    this._delayTimerId && clearInterval(this._delayTimerId)
    this._delayTimerId = undefined
    this._timerId && clearInterval(this._timerId)
    this._timerId = undefined
  }

  stop() {
    this.Status = TimerStatus.IDLE
    this.clear()
    this._remainingCountdownMilliSecs = 0
  }

  isPaused() {
    return this._isPaused
  }

  private async runSlices(countdownSecs: number, beforeStartDelayMilliSecs?: number): Promise<void> {
    return new Promise(resolve => {
      const extracted = () => {
        let counter = countdownSecs
        this.triggerCallback(TickingType.Started, counter) // trigger this call asynchronously

        if (counter === 0) {
          this.stop()
          this.triggerCallback(TickingType.Finished, counter) // trigger this call asynchronously
          resolve()
          return
        }

        this._timerId = setInterval(() => {
          counter--
          if (counter === 0) {
            this.stop()
            this.triggerCallback(TickingType.Finished, counter) // trigger this call asynchronously
            resolve()
          } else {
            this.triggerCallback(TickingType.Ticked, counter) // trigger this call asynchronously
          }
        }, this.INTERVAL)
      }

      this._runStartTime = new Date().getTime()
      beforeStartDelayMilliSecs
        ? (this._delayTimerId = setTimeout(() => extracted.call(this), beforeStartDelayMilliSecs || 0))
        : extracted.call(this)
      //
      console.log('>>>>>> lalal')
    })
  }

  private triggerCallback(type: TickingType, secsLeft: number) {
    const aaa = secsLeft
    this._onTicked && this._onTicked(type, aaa)
  }
}
