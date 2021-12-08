import { TimerService } from '@/services/timer-service'
import { Preset, TickedContext } from '@/models/preset'

describe('timer-service', () => {
  it('demo', () => {
    expect(1 + 1).toEqual(2)
  })

  // const presetMock: Preset = new Preset('', 'name', 3, 4, 2, 2, 2)
  //
  // it('renders correctly', () => {
  //   const timerService = new TimerService(presetMock)
  //   timerService.OnTicked = (secsLeft: number, tickedContext: TickedContext) => {
  //     console.log(`${tickedContext.cycleCurrentPhase},${secsLeft},${tickedContext}`)
  //   }
  //   timerService.runPreset()
  // })
})
