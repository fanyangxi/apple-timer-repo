import { TimerService } from '@/services/timer-service'
import { Preset, TickedPreset } from '@/models/preset'

describe('timer-service', () => {
  const presetMock: Preset = new Preset('', 'name', 3, 4, 2, 2, 2)

  it('renders correctly', () => {
    const timerService = new TimerService(presetMock)
    timerService.OnTicked = (secsLeft: number, tickedPreset: TickedPreset) => {
      console.log(`${tickedPreset.cycleCurrentPhase},${secsLeft},${tickedPreset}`)
    }
    timerService.runPreset()
  })
})
