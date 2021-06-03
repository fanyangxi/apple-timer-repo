import timerService from '@/services/timer-service'
import { Preset, TickedPreset } from '@/models/preset'
import { TickingType } from '@/services/countdown-timer'

describe('timer-service', () => {
  const presetMock: Preset = new Preset(3, 4, 2, 2, 2)

  it('renders correctly', () => {
    timerService.runPreset(
      presetMock,
      () => {},
      (currentSet: number, currentCycle: number, type: TickingType, secsLeft: number, tickedPreset: TickedPreset) => {
        console.log(`${tickedPreset.setCurrentPhase},${type},${secsLeft},${tickedPreset}`)
      },
    )
  })
})
