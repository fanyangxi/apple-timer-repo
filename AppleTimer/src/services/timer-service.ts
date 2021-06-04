import { Preset, TickedPreset } from '@/models/preset'
import { CountdownTimer, TickingType, TimerStatus } from '@/services/countdown-timer'
import { getUpdatedPreset } from '@/utils/preset-util'

export type PresetTickedEventHandler = (
  currentSet: number,
  currentCycle: number,
  type: TickingType,
  secsLeft: number,
  tickedPreset: TickedPreset,
) => void

export class TimerService {
  private readonly _preset: Preset
  private _countdownTimer?: CountdownTimer

  public OnTicked?: PresetTickedEventHandler

  public OnTimerStarted?: () => void
  public OnPaused?: () => void // Manually
  public OnResumed?: () => void // Manually
  public OnStopped?: () => void // Manually
  public OnTimerCompleted?: () => void
  public OnPreparePhaseClosing?: () => void
  public OnWorkoutPhaseClosing?: () => void
  public OnRestPhaseClosing?: () => void

  constructor(preset: Preset) {
    this._preset = preset
  }

  runPreset = async () => {
    const countdownSecs = this._preset.TotalPresetDurationSecs()
    this._countdownTimer = new CountdownTimer(countdownSecs, async (type: TickingType, secsLeft: number) => {
      const tickedPreset = getUpdatedPreset(this._preset, secsLeft)
      this.OnTicked && this.OnTicked(0, 0, type, secsLeft, tickedPreset)

      // TODO: ....
    })

    this.OnTimerStarted && this.OnTimerStarted()
    await this._countdownTimer.start()
    this.OnTimerCompleted && this.OnTimerCompleted()
  }

  pause = () => {
    this._countdownTimer && this._countdownTimer.pause()
  }

  resume = async () => {
    this._countdownTimer && (await this._countdownTimer.resume())
  }

  status = (): TimerStatus | undefined => {
    return this._countdownTimer && this._countdownTimer.Status
  }

  stop = () => {
    this._countdownTimer && this._countdownTimer.stopAndReset()
    this._countdownTimer && this._countdownTimer.start()
  }
}
