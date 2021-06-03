import { Preset, TickedPreset } from '@/models/preset'
import timerService from '@/services/timer-service'
import { TimerPhase } from '@/models/timer-phase'

describe('timer-service', () => {
  const presetMock: Preset = new Preset(3, 10, 4, 3, 2)
  const tickedPresetMock: TickedPreset = {
    setsRemainingCount: presetMock.SetsCount,
    setCyclesRemainingCount: presetMock.CyclesCount,
    setCurrentPhase: undefined,
    setPrepareRemainingSecs: presetMock.PrepareSecs,
    cycleWorkoutRemainingSecs: presetMock.WorkoutSecs,
    cycleRestRemainingSecs: presetMock.RestSecs,
  }

  it('renders correctly', () => {
    // timerService.runPreset(
    //   preset,
    //   (currentPhase: TimerPhase, type: TickingType, secsLeft: number, tickedPreset: TickedPreset) => {
    //     console.log(`${currentPhase},${type},${secsLeft},${tickedPreset}`)
    //   },
    // )
  })

  describe('getUpdatedPreset', () => {
    it.each`
      remainingSecs | expected
      ${89}         | ${{ ...tickedPresetMock, setPrepareRemainingSecs: 3, setCurrentPhase: TimerPhase.Prepare }}
    `('should update preset with remaining $remainingPresetDurationSecs, $expected', ({ remainingSecs, expected }) => {
      const result = timerService.getUpdatedPreset(presetMock, remainingSecs)
      expect(result).toEqual(expected)
    })
  })
})
