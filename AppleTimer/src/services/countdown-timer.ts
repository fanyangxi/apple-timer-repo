export enum TickingType {
  Started = 'Started',
  Ticked = 'Ticked',
  Finished = 'Finished',
}

export class CountdownTimer {
  private readonly INTERVAL = 1000
  private readonly _initialCountdownSecs: number
  private readonly _onTicked?: (type: TickingType, secsLeft: number) => void
  private _isPaused: boolean = false
  private _timerId?: NodeJS.Timeout
  private _delayTimerId?: NodeJS.Timeout
  private _remainingCountdownSecs: number = 0
  private _beforeResumeDelay: number = 0
  private _runStartTime: number = 0

  constructor(countdownSecs: number, onTicked?: (type: TickingType, secsLeft: number) => void) {
    this._initialCountdownSecs = countdownSecs
    this._onTicked = onTicked

    if ((countdownSecs * 1000) % this.INTERVAL !== 0) {
      throw new Error(
        `The countdownSecs:${countdownSecs} should be divided by INTERVAL:${this.INTERVAL} with no remainder.`,
      )
    }
  }

  async start(): Promise<void> {
    this.clear()
    this._remainingCountdownSecs = this._initialCountdownSecs
    await this.runSlices(this._remainingCountdownSecs, 0)
  }

  pause() {
    if (!this._isPaused) {
      this.clear()
      const pausedTime = new Date().getTime()
      const timeLeft = this.getRemainingCountdownTime() - (pausedTime - this._runStartTime)
      console.log(
        `>>> pausedTime:${pausedTime} | _runStartTime:${this._runStartTime}, DIFF: ${pausedTime - this._runStartTime};
_getRemainingCountdownTime: ${this.getRemainingCountdownTime()}
_beforeResumeDelay: ${this._beforeResumeDelay};
_remainingCountdownSecs:${this._remainingCountdownSecs}`,
      )
      this._beforeResumeDelay = timeLeft % this.INTERVAL
      this._remainingCountdownSecs = Math.floor(timeLeft / this.INTERVAL)
      console.log(`>>>: 
After:_beforeResumeDelay: ${this._beforeResumeDelay};
After:_remainingCountdownSecs:${this._remainingCountdownSecs}`)
      this._isPaused = true
    }
  }

  async resume() {
    if (this._isPaused) {
      await this.runSlices(this._remainingCountdownSecs, this._beforeResumeDelay)
    }
  }

  clear() {
    this._delayTimerId && clearInterval(this._delayTimerId)
    this._timerId && clearInterval(this._timerId)
    console.log(`>>> _timerId:${this._timerId}, _delayTimerId:${this._delayTimerId}`)
  }

  stop() {
    this.clear()
  }

  isPaused() {
    return this._isPaused
  }

  private getRemainingCountdownTime() {
    return this._remainingCountdownSecs * 1000 + this._beforeResumeDelay
  }

  private async runSlices(countdownTime: number, beforeStartDelay?: number): Promise<void> {
    console.log(`>>> countdownTime:${countdownTime}, beforeStartDelay:${beforeStartDelay}`)
    return new Promise(resolve => {
      const extracted = () => {
        let counter = countdownTime
        this._onTicked && this._onTicked(TickingType.Started, counter)

        if (counter === 0) {
          resolve()
          return
        }

        this._isPaused = false
        this._runStartTime = new Date().getTime()
        this._timerId = setInterval(() => {
          counter--
          if (counter === 0) {
            this._timerId && clearInterval(this._timerId)
            this._onTicked && this._onTicked(TickingType.Finished, counter)
            resolve()
          } else {
            this._onTicked && this._onTicked(TickingType.Ticked, counter)
          }
        }, this.INTERVAL)
      }

      beforeStartDelay
        ? (this._delayTimerId = setTimeout(() => extracted.call(this), beforeStartDelay || 0))
        : extracted.call(this)
      //
      console.log('>>>>>> lalal')
    })
  }
}
