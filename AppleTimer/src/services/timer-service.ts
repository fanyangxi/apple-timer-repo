import { Preset, TickedPreset } from '@/models/preset'
import { CountdownTimer, TickingType } from '@/services/countdown-timer'
import { TimerPhase } from '@/models/timer-phase'
import { Sleep } from '@/utils/common-util'

export type PresetTickedEventHandler = (
  currentSet: number,
  currentCycle: number,
  currentPhase: TimerPhase,
  type: TickingType,
  secsLeft: number,
  tickedPreset: TickedPreset,
) => void

let countdownTimer: CountdownTimer

const runPreset = async (
  preset: Preset,
  onStarted?: () => void,
  onTicked?: PresetTickedEventHandler,
  onFinished?: () => void,
) => {
  let tickedPreset = {
    prepareRemainingSecs: preset.prepareSecs,
    workoutRemainingSecs: preset.workoutSecs,
    restRemainingSecs: preset.restSecs,
    cyclesRemainingCount: preset.cyclesCount,
    setsRemainingCount: preset.setsCount,
  }

  onStarted && onStarted()

  // Phase: 1.Prepare
  countdownTimer = new CountdownTimer(preset.prepareSecs, async (type: TickingType, secsLeft: number) => {
    await Sleep(5000)
    const aaa = { ...tickedPreset, prepareRemainingSecs: secsLeft }
    onTicked && onTicked(0, 0, TimerPhase.Prepare, type, secsLeft, aaa)
    tickedPreset = aaa
  })
  await countdownTimer.start()
  // for (let setIndex = preset.setsCount; setIndex > 0; setIndex--) {
  //   for (let cycleIndex = preset.cyclesCount; cycleIndex > 0; cycleIndex--) {
  //     // Phase: 2.Workout
  //     countdownTimer = new CountdownTimer(preset.workoutSecs, (type: TickingType, secsLeft: number) => {
  //       tickedPreset = {
  //         ...tickedPreset,
  //         workoutRemainingSecs: secsLeft,
  //         cyclesRemainingCount: cycleIndex,
  //         setsRemainingCount: setIndex,
  //       }
  //       onTicked && onTicked(setIndex, cycleIndex, TimerPhase.Workout, type, secsLeft, tickedPreset)
  //     })
  //     await countdownTimer.start()
  //     // Phase: 3.Rest
  //     countdownTimer = new CountdownTimer(preset.restSecs, (type: TickingType, secsLeft: number) => {
  //       tickedPreset = {
  //         ...tickedPreset,
  //         restRemainingSecs: secsLeft,
  //         cyclesRemainingCount: cycleIndex,
  //         setsRemainingCount: setIndex,
  //       }
  //       onTicked && onTicked(setIndex, cycleIndex, TimerPhase.Rest, type, secsLeft, tickedPreset)
  //     })
  //     await countdownTimer.start()
  //   }
  // }

  onFinished && onFinished()
}

const togglePause2 = async () => {
  if (!countdownTimer) {
    return
  }

  if (countdownTimer.isPaused()) {
    await countdownTimer.resume()
  } else {
    countdownTimer.pause()
  }
}

const pause = () => {
  countdownTimer && countdownTimer.pause()
}

const resume = async () => {
  countdownTimer && (await countdownTimer.resume())
}

const isPaused = (): boolean => {
  return countdownTimer && countdownTimer.isPaused()
}

const stop = () => {
  countdownTimer && countdownTimer.stop()
}

export default {
  runPreset,
  togglePause2,
  pause,
  resume,
  isPaused,
  stop,
}
