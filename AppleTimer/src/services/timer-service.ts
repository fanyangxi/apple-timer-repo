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

let countdownTimer: CountdownTimer

// onTimerStarted
// onPaused // Manually
// onResumed // Manually
// onStopped // Manually
// onTimerCompleted
// onPreparePhaseClosing
// onWorkoutPhaseClosing
// onRestPhaseClosing
const runPreset = async (
  preset: Preset,
  onStarted?: () => void,
  onTicked?: PresetTickedEventHandler,
  onFinished?: () => void,
) => {
  onStarted && onStarted()

  countdownTimer = new CountdownTimer(preset.TotalPresetDurationSecs(), async (type: TickingType, secsLeft: number) => {
    const tickedPreset = getUpdatedPreset(preset, secsLeft)
    onTicked && onTicked(0, 0, type, secsLeft, tickedPreset)
  })
  await countdownTimer.start()

  onFinished && onFinished()
}

const pause = () => {
  countdownTimer && countdownTimer.pause()
}

const resume = async () => {
  countdownTimer && (await countdownTimer.resume())
}

const status = (): TimerStatus => {
  return countdownTimer && countdownTimer.Status
}

const stop = () => {
  countdownTimer && countdownTimer.stopAndReset()
  countdownTimer && countdownTimer.start()
}

export default {
  runPreset,
  pause,
  resume,
  status,
  stop,
}
