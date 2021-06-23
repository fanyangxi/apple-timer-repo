import { TimerService } from '@/services/timer-service'
import { Preset, TickedPreset } from '@/models/preset'
import { TickingType } from '@/services/countdown-timer'

describe('timer-service', () => {
  const presetMock: Preset = new Preset('', 'name', 3, 4, 2, 2, 2)

  it('renders correctly', () => {
    const timerService = new TimerService(presetMock)
    timerService.OnTicked = (
      currentSet: number,
      currentRep: number,
      type: TickingType,
      secsLeft: number,
      tickedPreset: TickedPreset,
    ) => {
      console.log(`${tickedPreset.setCurrentPhase},${type},${secsLeft},${tickedPreset}`)
    }
    timerService.runPreset()
  })
})
