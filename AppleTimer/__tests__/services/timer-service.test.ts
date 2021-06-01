import { runPreset } from '@/services/timer-service'
import { Preset, TickedPreset } from '@/models/preset'
import { TimerPhase } from '@/models/timer-phase'
import { TickingType } from '@/utils/date-util'

describe('timer-service', () => {
  const preset: Preset = {
    prepareSecs: 3,
    workoutSecs: 6,
    restSecs: 2,
    cyclesCount: 2,
    setsCount: 1,
  }

  it('renders correctly', () => {
    runPreset(preset, (currentPhase: TimerPhase, type: TickingType, secsLeft: number, tickedPreset: TickedPreset) => {
      console.log(`${currentPhase},${type},${secsLeft},${tickedPreset}`)
    })
  })
})
