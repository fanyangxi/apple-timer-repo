/* eslint-disable max-len */
import { Preset } from '@/models/preset'
import { TimerPhase } from '@/models/timer-phase'
import { getUpdatedPreset } from '@/utils/preset-util'

describe('getUpdatedPreset', () => {
  const presetMock: Preset = new Preset('', 'name', 3, 4, 2, 2, 2)

  it.each`
    remainingSecs | expected
    ${30}         | ${{ cyclesRemainingCount: 2, cycleRepsRemainingCount: 2, prepareRemainingSecs: 3, workoutRemainingSecs: 4, restRemainingSecs: 2, cycleCurrentPhase: TimerPhase.Prepare }}
    ${29}         | ${{ cyclesRemainingCount: 2, cycleRepsRemainingCount: 2, prepareRemainingSecs: 2, workoutRemainingSecs: 4, restRemainingSecs: 2, cycleCurrentPhase: TimerPhase.Prepare }}
    ${28}         | ${{ cyclesRemainingCount: 2, cycleRepsRemainingCount: 2, prepareRemainingSecs: 1, workoutRemainingSecs: 4, restRemainingSecs: 2, cycleCurrentPhase: TimerPhase.Prepare }}
    ${27}         | ${{ cyclesRemainingCount: 2, cycleRepsRemainingCount: 2, prepareRemainingSecs: 0, workoutRemainingSecs: 4, restRemainingSecs: 2, cycleCurrentPhase: TimerPhase.Workout }}
    ${26}         | ${{ cyclesRemainingCount: 2, cycleRepsRemainingCount: 2, prepareRemainingSecs: 0, workoutRemainingSecs: 3, restRemainingSecs: 2, cycleCurrentPhase: TimerPhase.Workout }}
    ${25}         | ${{ cyclesRemainingCount: 2, cycleRepsRemainingCount: 2, prepareRemainingSecs: 0, workoutRemainingSecs: 2, restRemainingSecs: 2, cycleCurrentPhase: TimerPhase.Workout }}
    ${24}         | ${{ cyclesRemainingCount: 2, cycleRepsRemainingCount: 2, prepareRemainingSecs: 0, workoutRemainingSecs: 1, restRemainingSecs: 2, cycleCurrentPhase: TimerPhase.Workout }}
    ${23}         | ${{ cyclesRemainingCount: 2, cycleRepsRemainingCount: 2, prepareRemainingSecs: 0, workoutRemainingSecs: 0, restRemainingSecs: 2, cycleCurrentPhase: TimerPhase.Rest }}
    ${22}         | ${{ cyclesRemainingCount: 2, cycleRepsRemainingCount: 2, prepareRemainingSecs: 0, workoutRemainingSecs: 0, restRemainingSecs: 1, cycleCurrentPhase: TimerPhase.Rest }}
    ${21}         | ${{ cyclesRemainingCount: 2, cycleRepsRemainingCount: 1, prepareRemainingSecs: 0, workoutRemainingSecs: 4, restRemainingSecs: 2, cycleCurrentPhase: TimerPhase.Workout }}
    ${20}         | ${{ cyclesRemainingCount: 2, cycleRepsRemainingCount: 1, prepareRemainingSecs: 0, workoutRemainingSecs: 3, restRemainingSecs: 2, cycleCurrentPhase: TimerPhase.Workout }}
    ${19}         | ${{ cyclesRemainingCount: 2, cycleRepsRemainingCount: 1, prepareRemainingSecs: 0, workoutRemainingSecs: 2, restRemainingSecs: 2, cycleCurrentPhase: TimerPhase.Workout }}
    ${18}         | ${{ cyclesRemainingCount: 2, cycleRepsRemainingCount: 1, prepareRemainingSecs: 0, workoutRemainingSecs: 1, restRemainingSecs: 2, cycleCurrentPhase: TimerPhase.Workout }}
    ${17}         | ${{ cyclesRemainingCount: 2, cycleRepsRemainingCount: 1, prepareRemainingSecs: 0, workoutRemainingSecs: 0, restRemainingSecs: 2, cycleCurrentPhase: TimerPhase.Rest }}
    ${16}         | ${{ cyclesRemainingCount: 2, cycleRepsRemainingCount: 1, prepareRemainingSecs: 0, workoutRemainingSecs: 0, restRemainingSecs: 1, cycleCurrentPhase: TimerPhase.Rest }}
    ${15}         | ${{ cyclesRemainingCount: 1, cycleRepsRemainingCount: 2, prepareRemainingSecs: 3, workoutRemainingSecs: 4, restRemainingSecs: 2, cycleCurrentPhase: TimerPhase.Prepare }}
    ${14}         | ${{ cyclesRemainingCount: 1, cycleRepsRemainingCount: 2, prepareRemainingSecs: 2, workoutRemainingSecs: 4, restRemainingSecs: 2, cycleCurrentPhase: TimerPhase.Prepare }}
    ${13}         | ${{ cyclesRemainingCount: 1, cycleRepsRemainingCount: 2, prepareRemainingSecs: 1, workoutRemainingSecs: 4, restRemainingSecs: 2, cycleCurrentPhase: TimerPhase.Prepare }}
    ${12}         | ${{ cyclesRemainingCount: 1, cycleRepsRemainingCount: 2, prepareRemainingSecs: 0, workoutRemainingSecs: 4, restRemainingSecs: 2, cycleCurrentPhase: TimerPhase.Workout }}
    ${11}         | ${{ cyclesRemainingCount: 1, cycleRepsRemainingCount: 2, prepareRemainingSecs: 0, workoutRemainingSecs: 3, restRemainingSecs: 2, cycleCurrentPhase: TimerPhase.Workout }}
    ${10}         | ${{ cyclesRemainingCount: 1, cycleRepsRemainingCount: 2, prepareRemainingSecs: 0, workoutRemainingSecs: 2, restRemainingSecs: 2, cycleCurrentPhase: TimerPhase.Workout }}
    ${9}          | ${{ cyclesRemainingCount: 1, cycleRepsRemainingCount: 2, prepareRemainingSecs: 0, workoutRemainingSecs: 1, restRemainingSecs: 2, cycleCurrentPhase: TimerPhase.Workout }}
    ${8}          | ${{ cyclesRemainingCount: 1, cycleRepsRemainingCount: 2, prepareRemainingSecs: 0, workoutRemainingSecs: 0, restRemainingSecs: 2, cycleCurrentPhase: TimerPhase.Rest }}
    ${7}          | ${{ cyclesRemainingCount: 1, cycleRepsRemainingCount: 2, prepareRemainingSecs: 0, workoutRemainingSecs: 0, restRemainingSecs: 1, cycleCurrentPhase: TimerPhase.Rest }}
    ${6}          | ${{ cyclesRemainingCount: 1, cycleRepsRemainingCount: 1, prepareRemainingSecs: 0, workoutRemainingSecs: 4, restRemainingSecs: 2, cycleCurrentPhase: TimerPhase.Workout }}
    ${5}          | ${{ cyclesRemainingCount: 1, cycleRepsRemainingCount: 1, prepareRemainingSecs: 0, workoutRemainingSecs: 3, restRemainingSecs: 2, cycleCurrentPhase: TimerPhase.Workout }}
    ${4}          | ${{ cyclesRemainingCount: 1, cycleRepsRemainingCount: 1, prepareRemainingSecs: 0, workoutRemainingSecs: 2, restRemainingSecs: 2, cycleCurrentPhase: TimerPhase.Workout }}
    ${3}          | ${{ cyclesRemainingCount: 1, cycleRepsRemainingCount: 1, prepareRemainingSecs: 0, workoutRemainingSecs: 1, restRemainingSecs: 2, cycleCurrentPhase: TimerPhase.Workout }}
    ${2}          | ${{ cyclesRemainingCount: 1, cycleRepsRemainingCount: 1, prepareRemainingSecs: 0, workoutRemainingSecs: 0, restRemainingSecs: 2, cycleCurrentPhase: TimerPhase.Rest }}
    ${1}          | ${{ cyclesRemainingCount: 1, cycleRepsRemainingCount: 1, prepareRemainingSecs: 0, workoutRemainingSecs: 0, restRemainingSecs: 1, cycleCurrentPhase: TimerPhase.Rest }}
    ${0}          | ${{ cyclesRemainingCount: 0, cycleRepsRemainingCount: 0, prepareRemainingSecs: 0, workoutRemainingSecs: 0, restRemainingSecs: 0, cycleCurrentPhase: undefined }}
  `('should update preset with remaining $remainingSecs, $expected', ({ remainingSecs, expected }) => {
    const result = getUpdatedPreset(presetMock, remainingSecs)
    expect(result).toEqual(expected)
  })
})
