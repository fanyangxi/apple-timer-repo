import { TimerService } from '@/services/timer-service'
import { Preset, TickedPreset } from '@/models/preset'

describe('timer-service', () => {
  it('demo', () => {
    expect(1 + 1).toEqual(2)
  })

  // const presetMock: Preset = new Preset('', 'name', 3, 4, 2, 2, 2)
  //
  // it('renders correctly', () => {
  //   const timerService = new TimerService(presetMock)
  //   timerService.OnTicked = (secsLeft: number, tickedPreset: TickedPreset) => {
  //     console.log(`${tickedPreset.cycleCurrentPhase},${secsLeft},${tickedPreset}`)
  //   }
  //   timerService.runPreset()
  // })
})
