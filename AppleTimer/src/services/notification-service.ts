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

  public OnTimerStarted?: () => void
  public OnTimerCompleted?: () => void
  public OnTicked?: PresetTickedEventHandler
  public OnPaused?: () => void // Manually
  public OnResumed?: () => void // Manually
  public OnStopped?: () => void // Manually
  public OnPreparePhaseClosing?: () => void
  public OnWorkoutPhaseClosing?: () => void
  public OnRestPhaseClosing?: () => void

  constructor(preset: Preset) {
    this._preset = preset
  }

  runPreset = async () => {
    this._countdownTimer = new CountdownTimer(this._preset.TotalPresetDurationSecs())
    this._countdownTimer.OnTimerStarted = (secsLeft: number): Promise<void> => {
      return undefined
    }
    this._countdownTimer.OnTicked = async (secsLeft: number): Promise<void> => {
      const tickedPreset = getUpdatedPreset(this._preset, secsLeft)
      this.OnTicked && this.OnTicked(0, 0, secsLeft, tickedPreset)
    }
    this._countdownTimer.OnTimerCompleted = (secsLeft: number): Promise<void> => {
      return undefined
    }
    this._countdownTimer.OnPaused = (milliSecsLeft: number): Promise<void> => {
      return undefined
    }
    this._countdownTimer.OnResumed = (milliSecsLeft: number): Promise<void> => {
      return undefined
    }
    this._countdownTimer.OnStopped = (milliSecsLeft: number): Promise<void> => {
      return undefined
    }

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
