/* eslint-disable max-len */
import { Preset } from '@/models/preset'
import { TimerPhase } from '@/models/timer-phase'
import { getUpdatedPreset } from '@/utils/preset-util'

describe('getUpdatedPreset', () => {
  const presetMock: Preset = new Preset(3, 4, 2, 2, 2)

  it.each`
    remainingSecs | expected
    ${30}         | ${{ setsRemainingCount: 2, setCyclesRemainingCount: 2, setPrepareRemainingSecs: 3, cycleWorkoutRemainingSecs: 4, cycleRestRemainingSecs: 2, setCurrentPhase: TimerPhase.Prepare }}
    ${29}         | ${{ setsRemainingCount: 2, setCyclesRemainingCount: 2, setPrepareRemainingSecs: 2, cycleWorkoutRemainingSecs: 4, cycleRestRemainingSecs: 2, setCurrentPhase: TimerPhase.Prepare }}
    ${28}         | ${{ setsRemainingCount: 2, setCyclesRemainingCount: 2, setPrepareRemainingSecs: 1, cycleWorkoutRemainingSecs: 4, cycleRestRemainingSecs: 2, setCurrentPhase: TimerPhase.Prepare }}
    ${27}         | ${{ setsRemainingCount: 2, setCyclesRemainingCount: 2, setPrepareRemainingSecs: 0, cycleWorkoutRemainingSecs: 4, cycleRestRemainingSecs: 2, setCurrentPhase: TimerPhase.Workout }}
    ${26}         | ${{ setsRemainingCount: 2, setCyclesRemainingCount: 2, setPrepareRemainingSecs: 0, cycleWorkoutRemainingSecs: 3, cycleRestRemainingSecs: 2, setCurrentPhase: TimerPhase.Workout }}
    ${25}         | ${{ setsRemainingCount: 2, setCyclesRemainingCount: 2, setPrepareRemainingSecs: 0, cycleWorkoutRemainingSecs: 2, cycleRestRemainingSecs: 2, setCurrentPhase: TimerPhase.Workout }}
    ${24}         | ${{ setsRemainingCount: 2, setCyclesRemainingCount: 2, setPrepareRemainingSecs: 0, cycleWorkoutRemainingSecs: 1, cycleRestRemainingSecs: 2, setCurrentPhase: TimerPhase.Workout }}
    ${23}         | ${{ setsRemainingCount: 2, setCyclesRemainingCount: 2, setPrepareRemainingSecs: 0, cycleWorkoutRemainingSecs: 0, cycleRestRemainingSecs: 2, setCurrentPhase: TimerPhase.Rest }}
    ${22}         | ${{ setsRemainingCount: 2, setCyclesRemainingCount: 2, setPrepareRemainingSecs: 0, cycleWorkoutRemainingSecs: 0, cycleRestRemainingSecs: 1, setCurrentPhase: TimerPhase.Rest }}
    ${21}         | ${{ setsRemainingCount: 2, setCyclesRemainingCount: 1, setPrepareRemainingSecs: 0, cycleWorkoutRemainingSecs: 4, cycleRestRemainingSecs: 2, setCurrentPhase: TimerPhase.Workout }}
    ${20}         | ${{ setsRemainingCount: 2, setCyclesRemainingCount: 1, setPrepareRemainingSecs: 0, cycleWorkoutRemainingSecs: 3, cycleRestRemainingSecs: 2, setCurrentPhase: TimerPhase.Workout }}
    ${19}         | ${{ setsRemainingCount: 2, setCyclesRemainingCount: 1, setPrepareRemainingSecs: 0, cycleWorkoutRemainingSecs: 2, cycleRestRemainingSecs: 2, setCurrentPhase: TimerPhase.Workout }}
    ${18}         | ${{ setsRemainingCount: 2, setCyclesRemainingCount: 1, setPrepareRemainingSecs: 0, cycleWorkoutRemainingSecs: 1, cycleRestRemainingSecs: 2, setCurrentPhase: TimerPhase.Workout }}
    ${17}         | ${{ setsRemainingCount: 2, setCyclesRemainingCount: 1, setPrepareRemainingSecs: 0, cycleWorkoutRemainingSecs: 0, cycleRestRemainingSecs: 2, setCurrentPhase: TimerPhase.Rest }}
    ${16}         | ${{ setsRemainingCount: 2, setCyclesRemainingCount: 1, setPrepareRemainingSecs: 0, cycleWorkoutRemainingSecs: 0, cycleRestRemainingSecs: 1, setCurrentPhase: TimerPhase.Rest }}
    ${15}         | ${{ setsRemainingCount: 1, setCyclesRemainingCount: 2, setPrepareRemainingSecs: 3, cycleWorkoutRemainingSecs: 4, cycleRestRemainingSecs: 2, setCurrentPhase: TimerPhase.Prepare }}
    ${14}         | ${{ setsRemainingCount: 1, setCyclesRemainingCount: 2, setPrepareRemainingSecs: 2, cycleWorkoutRemainingSecs: 4, cycleRestRemainingSecs: 2, setCurrentPhase: TimerPhase.Prepare }}
    ${13}         | ${{ setsRemainingCount: 1, setCyclesRemainingCount: 2, setPrepareRemainingSecs: 1, cycleWorkoutRemainingSecs: 4, cycleRestRemainingSecs: 2, setCurrentPhase: TimerPhase.Prepare }}
    ${12}         | ${{ setsRemainingCount: 1, setCyclesRemainingCount: 2, setPrepareRemainingSecs: 0, cycleWorkoutRemainingSecs: 4, cycleRestRemainingSecs: 2, setCurrentPhase: TimerPhase.Workout }}
    ${11}         | ${{ setsRemainingCount: 1, setCyclesRemainingCount: 2, setPrepareRemainingSecs: 0, cycleWorkoutRemainingSecs: 3, cycleRestRemainingSecs: 2, setCurrentPhase: TimerPhase.Workout }}
    ${10}         | ${{ setsRemainingCount: 1, setCyclesRemainingCount: 2, setPrepareRemainingSecs: 0, cycleWorkoutRemainingSecs: 2, cycleRestRemainingSecs: 2, setCurrentPhase: TimerPhase.Workout }}
    ${9}          | ${{ setsRemainingCount: 1, setCyclesRemainingCount: 2, setPrepareRemainingSecs: 0, cycleWorkoutRemainingSecs: 1, cycleRestRemainingSecs: 2, setCurrentPhase: TimerPhase.Workout }}
    ${8}          | ${{ setsRemainingCount: 1, setCyclesRemainingCount: 2, setPrepareRemainingSecs: 0, cycleWorkoutRemainingSecs: 0, cycleRestRemainingSecs: 2, setCurrentPhase: TimerPhase.Rest }}
    ${7}          | ${{ setsRemainingCount: 1, setCyclesRemainingCount: 2, setPrepareRemainingSecs: 0, cycleWorkoutRemainingSecs: 0, cycleRestRemainingSecs: 1, setCurrentPhase: TimerPhase.Rest }}
    ${6}          | ${{ setsRemainingCount: 1, setCyclesRemainingCount: 1, setPrepareRemainingSecs: 0, cycleWorkoutRemainingSecs: 4, cycleRestRemainingSecs: 2, setCurrentPhase: TimerPhase.Workout }}
    ${5}          | ${{ setsRemainingCount: 1, setCyclesRemainingCount: 1, setPrepareRemainingSecs: 0, cycleWorkoutRemainingSecs: 3, cycleRestRemainingSecs: 2, setCurrentPhase: TimerPhase.Workout }}
    ${4}          | ${{ setsRemainingCount: 1, setCyclesRemainingCount: 1, setPrepareRemainingSecs: 0, cycleWorkoutRemainingSecs: 2, cycleRestRemainingSecs: 2, setCurrentPhase: TimerPhase.Workout }}
    ${3}          | ${{ setsRemainingCount: 1, setCyclesRemainingCount: 1, setPrepareRemainingSecs: 0, cycleWorkoutRemainingSecs: 1, cycleRestRemainingSecs: 2, setCurrentPhase: TimerPhase.Workout }}
    ${2}          | ${{ setsRemainingCount: 1, setCyclesRemainingCount: 1, setPrepareRemainingSecs: 0, cycleWorkoutRemainingSecs: 0, cycleRestRemainingSecs: 2, setCurrentPhase: TimerPhase.Rest }}
    ${1}          | ${{ setsRemainingCount: 1, setCyclesRemainingCount: 1, setPrepareRemainingSecs: 0, cycleWorkoutRemainingSecs: 0, cycleRestRemainingSecs: 1, setCurrentPhase: TimerPhase.Rest }}
    ${0}          | ${{ setsRemainingCount: 0, setCyclesRemainingCount: 0, setPrepareRemainingSecs: 0, cycleWorkoutRemainingSecs: 0, cycleRestRemainingSecs: 0, setCurrentPhase: undefined }}
  `('should update preset with remaining $remainingSecs, $expected', ({ remainingSecs, expected }) => {
    const result = getUpdatedPreset(presetMock, remainingSecs)
    expect(result).toEqual(expected)
  })
})
