/* eslint-disable max-len */
import { Preset } from '@/models/preset'
import { TimerPhase } from '@/models/timer-phase'
import { getUpdatedPreset } from '@/utils/preset-util'

describe('getUpdatedPreset', () => {
  const presetMock: Preset = new Preset('', 'name', 3, 4, 2, 2, 2)

  it.each`
    remainingSecs | expected
    ${30}         | ${{ cyclesRemainingCount: 2, cycleRepsRemainingCount: 2, setPrepareRemainingSecs: 3, repWorkoutRemainingSecs: 4, repRestRemainingSecs: 2, setCurrentPhase: TimerPhase.Prepare }}
    ${29}         | ${{ cyclesRemainingCount: 2, cycleRepsRemainingCount: 2, setPrepareRemainingSecs: 2, repWorkoutRemainingSecs: 4, repRestRemainingSecs: 2, setCurrentPhase: TimerPhase.Prepare }}
    ${28}         | ${{ cyclesRemainingCount: 2, cycleRepsRemainingCount: 2, setPrepareRemainingSecs: 1, repWorkoutRemainingSecs: 4, repRestRemainingSecs: 2, setCurrentPhase: TimerPhase.Prepare }}
    ${27}         | ${{ cyclesRemainingCount: 2, cycleRepsRemainingCount: 2, setPrepareRemainingSecs: 0, repWorkoutRemainingSecs: 4, repRestRemainingSecs: 2, setCurrentPhase: TimerPhase.Workout }}
    ${26}         | ${{ cyclesRemainingCount: 2, cycleRepsRemainingCount: 2, setPrepareRemainingSecs: 0, repWorkoutRemainingSecs: 3, repRestRemainingSecs: 2, setCurrentPhase: TimerPhase.Workout }}
    ${25}         | ${{ cyclesRemainingCount: 2, cycleRepsRemainingCount: 2, setPrepareRemainingSecs: 0, repWorkoutRemainingSecs: 2, repRestRemainingSecs: 2, setCurrentPhase: TimerPhase.Workout }}
    ${24}         | ${{ cyclesRemainingCount: 2, cycleRepsRemainingCount: 2, setPrepareRemainingSecs: 0, repWorkoutRemainingSecs: 1, repRestRemainingSecs: 2, setCurrentPhase: TimerPhase.Workout }}
    ${23}         | ${{ cyclesRemainingCount: 2, cycleRepsRemainingCount: 2, setPrepareRemainingSecs: 0, repWorkoutRemainingSecs: 0, repRestRemainingSecs: 2, setCurrentPhase: TimerPhase.Rest }}
    ${22}         | ${{ cyclesRemainingCount: 2, cycleRepsRemainingCount: 2, setPrepareRemainingSecs: 0, repWorkoutRemainingSecs: 0, repRestRemainingSecs: 1, setCurrentPhase: TimerPhase.Rest }}
    ${21}         | ${{ cyclesRemainingCount: 2, cycleRepsRemainingCount: 1, setPrepareRemainingSecs: 0, repWorkoutRemainingSecs: 4, repRestRemainingSecs: 2, setCurrentPhase: TimerPhase.Workout }}
    ${20}         | ${{ cyclesRemainingCount: 2, cycleRepsRemainingCount: 1, setPrepareRemainingSecs: 0, repWorkoutRemainingSecs: 3, repRestRemainingSecs: 2, setCurrentPhase: TimerPhase.Workout }}
    ${19}         | ${{ cyclesRemainingCount: 2, cycleRepsRemainingCount: 1, setPrepareRemainingSecs: 0, repWorkoutRemainingSecs: 2, repRestRemainingSecs: 2, setCurrentPhase: TimerPhase.Workout }}
    ${18}         | ${{ cyclesRemainingCount: 2, cycleRepsRemainingCount: 1, setPrepareRemainingSecs: 0, repWorkoutRemainingSecs: 1, repRestRemainingSecs: 2, setCurrentPhase: TimerPhase.Workout }}
    ${17}         | ${{ cyclesRemainingCount: 2, cycleRepsRemainingCount: 1, setPrepareRemainingSecs: 0, repWorkoutRemainingSecs: 0, repRestRemainingSecs: 2, setCurrentPhase: TimerPhase.Rest }}
    ${16}         | ${{ cyclesRemainingCount: 2, cycleRepsRemainingCount: 1, setPrepareRemainingSecs: 0, repWorkoutRemainingSecs: 0, repRestRemainingSecs: 1, setCurrentPhase: TimerPhase.Rest }}
    ${15}         | ${{ cyclesRemainingCount: 1, cycleRepsRemainingCount: 2, setPrepareRemainingSecs: 3, repWorkoutRemainingSecs: 4, repRestRemainingSecs: 2, setCurrentPhase: TimerPhase.Prepare }}
    ${14}         | ${{ cyclesRemainingCount: 1, cycleRepsRemainingCount: 2, setPrepareRemainingSecs: 2, repWorkoutRemainingSecs: 4, repRestRemainingSecs: 2, setCurrentPhase: TimerPhase.Prepare }}
    ${13}         | ${{ cyclesRemainingCount: 1, cycleRepsRemainingCount: 2, setPrepareRemainingSecs: 1, repWorkoutRemainingSecs: 4, repRestRemainingSecs: 2, setCurrentPhase: TimerPhase.Prepare }}
    ${12}         | ${{ cyclesRemainingCount: 1, cycleRepsRemainingCount: 2, setPrepareRemainingSecs: 0, repWorkoutRemainingSecs: 4, repRestRemainingSecs: 2, setCurrentPhase: TimerPhase.Workout }}
    ${11}         | ${{ cyclesRemainingCount: 1, cycleRepsRemainingCount: 2, setPrepareRemainingSecs: 0, repWorkoutRemainingSecs: 3, repRestRemainingSecs: 2, setCurrentPhase: TimerPhase.Workout }}
    ${10}         | ${{ cyclesRemainingCount: 1, cycleRepsRemainingCount: 2, setPrepareRemainingSecs: 0, repWorkoutRemainingSecs: 2, repRestRemainingSecs: 2, setCurrentPhase: TimerPhase.Workout }}
    ${9}          | ${{ cyclesRemainingCount: 1, cycleRepsRemainingCount: 2, setPrepareRemainingSecs: 0, repWorkoutRemainingSecs: 1, repRestRemainingSecs: 2, setCurrentPhase: TimerPhase.Workout }}
    ${8}          | ${{ cyclesRemainingCount: 1, cycleRepsRemainingCount: 2, setPrepareRemainingSecs: 0, repWorkoutRemainingSecs: 0, repRestRemainingSecs: 2, setCurrentPhase: TimerPhase.Rest }}
    ${7}          | ${{ cyclesRemainingCount: 1, cycleRepsRemainingCount: 2, setPrepareRemainingSecs: 0, repWorkoutRemainingSecs: 0, repRestRemainingSecs: 1, setCurrentPhase: TimerPhase.Rest }}
    ${6}          | ${{ cyclesRemainingCount: 1, cycleRepsRemainingCount: 1, setPrepareRemainingSecs: 0, repWorkoutRemainingSecs: 4, repRestRemainingSecs: 2, setCurrentPhase: TimerPhase.Workout }}
    ${5}          | ${{ cyclesRemainingCount: 1, cycleRepsRemainingCount: 1, setPrepareRemainingSecs: 0, repWorkoutRemainingSecs: 3, repRestRemainingSecs: 2, setCurrentPhase: TimerPhase.Workout }}
    ${4}          | ${{ cyclesRemainingCount: 1, cycleRepsRemainingCount: 1, setPrepareRemainingSecs: 0, repWorkoutRemainingSecs: 2, repRestRemainingSecs: 2, setCurrentPhase: TimerPhase.Workout }}
    ${3}          | ${{ cyclesRemainingCount: 1, cycleRepsRemainingCount: 1, setPrepareRemainingSecs: 0, repWorkoutRemainingSecs: 1, repRestRemainingSecs: 2, setCurrentPhase: TimerPhase.Workout }}
    ${2}          | ${{ cyclesRemainingCount: 1, cycleRepsRemainingCount: 1, setPrepareRemainingSecs: 0, repWorkoutRemainingSecs: 0, repRestRemainingSecs: 2, setCurrentPhase: TimerPhase.Rest }}
    ${1}          | ${{ cyclesRemainingCount: 1, cycleRepsRemainingCount: 1, setPrepareRemainingSecs: 0, repWorkoutRemainingSecs: 0, repRestRemainingSecs: 1, setCurrentPhase: TimerPhase.Rest }}
    ${0}          | ${{ cyclesRemainingCount: 0, cycleRepsRemainingCount: 0, setPrepareRemainingSecs: 0, repWorkoutRemainingSecs: 0, repRestRemainingSecs: 0, setCurrentPhase: undefined }}
  `('should update preset with remaining $remainingSecs, $expected', ({ remainingSecs, expected }) => {
    const result = getUpdatedPreset(presetMock, remainingSecs)
    expect(result).toEqual(expected)
  })
})
