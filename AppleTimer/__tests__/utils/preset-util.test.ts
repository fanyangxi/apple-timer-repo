/* eslint-disable max-len,prettier/prettier */
import { Preset, TickingEvent } from '@/models/preset'
import { TimerPhase } from '@/models/timer-phase'
import { getUnpackedPresetMap, getUpdatedContext } from '@/utils/preset-util'

describe('getUpdatedContext', () => {
  it.each`
    remainingSecs | expected
    ${30}         | ${{ totalRemainingSeconds: 30, cyclesRemainingCount: 2, cycleSetsRemainingCount: 2, restRemainingSecs: 2, workoutRemainingSecs: 4, prepareRemainingSecs: 3, cycleCurrentPhase: TimerPhase.Prepare, events: [TickingEvent.CycleStarted, TickingEvent.PreparePhaseStarted, TickingEvent.PreparePhaseClosing] }}
    ${29}         | ${{ totalRemainingSeconds: 29, cyclesRemainingCount: 2, cycleSetsRemainingCount: 2, restRemainingSecs: 2, workoutRemainingSecs: 4, prepareRemainingSecs: 2, cycleCurrentPhase: TimerPhase.Prepare, events: [] }}
    ${28}         | ${{ totalRemainingSeconds: 28, cyclesRemainingCount: 2, cycleSetsRemainingCount: 2, restRemainingSecs: 2, workoutRemainingSecs: 4, prepareRemainingSecs: 1, cycleCurrentPhase: TimerPhase.Prepare, events: [] }}
    ${27}         | ${{ totalRemainingSeconds: 27, cyclesRemainingCount: 2, cycleSetsRemainingCount: 2, restRemainingSecs: 2, workoutRemainingSecs: 4, prepareRemainingSecs: 0, cycleCurrentPhase: TimerPhase.Workout, events: [TickingEvent.SetStarted, TickingEvent.WorkoutPhaseStarted] }}
    ${26}         | ${{ totalRemainingSeconds: 26, cyclesRemainingCount: 2, cycleSetsRemainingCount: 2, restRemainingSecs: 2, workoutRemainingSecs: 3, prepareRemainingSecs: 0, cycleCurrentPhase: TimerPhase.Workout, events: [TickingEvent.WorkoutPhaseClosing] }}
    ${25}         | ${{ totalRemainingSeconds: 25, cyclesRemainingCount: 2, cycleSetsRemainingCount: 2, restRemainingSecs: 2, workoutRemainingSecs: 2, prepareRemainingSecs: 0, cycleCurrentPhase: TimerPhase.Workout, events: [] }}
    ${24}         | ${{ totalRemainingSeconds: 24, cyclesRemainingCount: 2, cycleSetsRemainingCount: 2, restRemainingSecs: 2, workoutRemainingSecs: 1, prepareRemainingSecs: 0, cycleCurrentPhase: TimerPhase.Workout, events: [] }}
    ${23}         | ${{ totalRemainingSeconds: 23, cyclesRemainingCount: 2, cycleSetsRemainingCount: 2, restRemainingSecs: 2, workoutRemainingSecs: 0, prepareRemainingSecs: 0, cycleCurrentPhase: TimerPhase.Rest, events: [TickingEvent.RestPhaseStarted, TickingEvent.RestPhaseClosing] }}
    ${22}         | ${{ totalRemainingSeconds: 22, cyclesRemainingCount: 2, cycleSetsRemainingCount: 2, restRemainingSecs: 1, workoutRemainingSecs: 0, prepareRemainingSecs: 0, cycleCurrentPhase: TimerPhase.Rest, events: [] }}
    ${21}         | ${{ totalRemainingSeconds: 21, cyclesRemainingCount: 2, cycleSetsRemainingCount: 1, restRemainingSecs: 2, workoutRemainingSecs: 4, prepareRemainingSecs: 0, cycleCurrentPhase: TimerPhase.Workout, events: [TickingEvent.SetStarted, TickingEvent.WorkoutPhaseStarted] }}
    ${20}         | ${{ totalRemainingSeconds: 20, cyclesRemainingCount: 2, cycleSetsRemainingCount: 1, restRemainingSecs: 2, workoutRemainingSecs: 3, prepareRemainingSecs: 0, cycleCurrentPhase: TimerPhase.Workout, events: [TickingEvent.WorkoutPhaseClosing] }}
    ${19}         | ${{ totalRemainingSeconds: 19, cyclesRemainingCount: 2, cycleSetsRemainingCount: 1, restRemainingSecs: 2, workoutRemainingSecs: 2, prepareRemainingSecs: 0, cycleCurrentPhase: TimerPhase.Workout, events: [] }}
    ${18}         | ${{ totalRemainingSeconds: 18, cyclesRemainingCount: 2, cycleSetsRemainingCount: 1, restRemainingSecs: 2, workoutRemainingSecs: 1, prepareRemainingSecs: 0, cycleCurrentPhase: TimerPhase.Workout, events: [] }}
    ${17}         | ${{ totalRemainingSeconds: 17, cyclesRemainingCount: 2, cycleSetsRemainingCount: 1, restRemainingSecs: 2, workoutRemainingSecs: 0, prepareRemainingSecs: 0, cycleCurrentPhase: TimerPhase.Rest, events: [TickingEvent.RestPhaseStarted, TickingEvent.RestPhaseClosing] }}
    ${16}         | ${{ totalRemainingSeconds: 16, cyclesRemainingCount: 2, cycleSetsRemainingCount: 1, restRemainingSecs: 1, workoutRemainingSecs: 0, prepareRemainingSecs: 0, cycleCurrentPhase: TimerPhase.Rest, events: [] }}
    ${15}         | ${{ totalRemainingSeconds: 15, cyclesRemainingCount: 1, cycleSetsRemainingCount: 2, restRemainingSecs: 2, workoutRemainingSecs: 4, prepareRemainingSecs: 3, cycleCurrentPhase: TimerPhase.Prepare, events: [TickingEvent.CycleStarted, TickingEvent.PreparePhaseStarted, TickingEvent.PreparePhaseClosing] }}
    ${14}         | ${{ totalRemainingSeconds: 14, cyclesRemainingCount: 1, cycleSetsRemainingCount: 2, restRemainingSecs: 2, workoutRemainingSecs: 4, prepareRemainingSecs: 2, cycleCurrentPhase: TimerPhase.Prepare, events: [] }}
    ${13}         | ${{ totalRemainingSeconds: 13, cyclesRemainingCount: 1, cycleSetsRemainingCount: 2, restRemainingSecs: 2, workoutRemainingSecs: 4, prepareRemainingSecs: 1, cycleCurrentPhase: TimerPhase.Prepare, events: [] }}
    ${12}         | ${{ totalRemainingSeconds: 12, cyclesRemainingCount: 1, cycleSetsRemainingCount: 2, restRemainingSecs: 2, workoutRemainingSecs: 4, prepareRemainingSecs: 0, cycleCurrentPhase: TimerPhase.Workout, events: [TickingEvent.SetStarted, TickingEvent.WorkoutPhaseStarted] }}
    ${11}         | ${{ totalRemainingSeconds: 11, cyclesRemainingCount: 1, cycleSetsRemainingCount: 2, restRemainingSecs: 2, workoutRemainingSecs: 3, prepareRemainingSecs: 0, cycleCurrentPhase: TimerPhase.Workout, events: [TickingEvent.WorkoutPhaseClosing] }}
    ${10}         | ${{ totalRemainingSeconds: 10, cyclesRemainingCount: 1, cycleSetsRemainingCount: 2, restRemainingSecs: 2, workoutRemainingSecs: 2, prepareRemainingSecs: 0, cycleCurrentPhase: TimerPhase.Workout, events: [] }}
    ${9}          | ${{ totalRemainingSeconds: 9, cyclesRemainingCount: 1, cycleSetsRemainingCount: 2, restRemainingSecs: 2, workoutRemainingSecs: 1, prepareRemainingSecs: 0, cycleCurrentPhase: TimerPhase.Workout, events: [] }}
    ${8}          | ${{ totalRemainingSeconds: 8, cyclesRemainingCount: 1, cycleSetsRemainingCount: 2, restRemainingSecs: 2, workoutRemainingSecs: 0, prepareRemainingSecs: 0, cycleCurrentPhase: TimerPhase.Rest, events: [TickingEvent.RestPhaseStarted, TickingEvent.RestPhaseClosing] }}
    ${7}          | ${{ totalRemainingSeconds: 7, cyclesRemainingCount: 1, cycleSetsRemainingCount: 2, restRemainingSecs: 1, workoutRemainingSecs: 0, prepareRemainingSecs: 0, cycleCurrentPhase: TimerPhase.Rest, events: [] }}
    ${6}          | ${{ totalRemainingSeconds: 6, cyclesRemainingCount: 1, cycleSetsRemainingCount: 1, restRemainingSecs: 2, workoutRemainingSecs: 4, prepareRemainingSecs: 0, cycleCurrentPhase: TimerPhase.Workout, events: [TickingEvent.SetStarted, TickingEvent.WorkoutPhaseStarted] }}
    ${5}          | ${{ totalRemainingSeconds: 5, cyclesRemainingCount: 1, cycleSetsRemainingCount: 1, restRemainingSecs: 2, workoutRemainingSecs: 3, prepareRemainingSecs: 0, cycleCurrentPhase: TimerPhase.Workout, events: [TickingEvent.WorkoutPhaseClosing] }}
    ${4}          | ${{ totalRemainingSeconds: 4, cyclesRemainingCount: 1, cycleSetsRemainingCount: 1, restRemainingSecs: 2, workoutRemainingSecs: 2, prepareRemainingSecs: 0, cycleCurrentPhase: TimerPhase.Workout, events: [] }}
    ${3}          | ${{ totalRemainingSeconds: 3, cyclesRemainingCount: 1, cycleSetsRemainingCount: 1, restRemainingSecs: 2, workoutRemainingSecs: 1, prepareRemainingSecs: 0, cycleCurrentPhase: TimerPhase.Workout, events: [] }}
    ${2}          | ${{ totalRemainingSeconds: 2, cyclesRemainingCount: 1, cycleSetsRemainingCount: 1, restRemainingSecs: 2, workoutRemainingSecs: 0, prepareRemainingSecs: 0, cycleCurrentPhase: TimerPhase.Rest, events: [TickingEvent.RestPhaseStarted, TickingEvent.RestPhaseClosing] }}
    ${1}          | ${{ totalRemainingSeconds: 1, cyclesRemainingCount: 1, cycleSetsRemainingCount: 1, restRemainingSecs: 1, workoutRemainingSecs: 0, prepareRemainingSecs: 0, cycleCurrentPhase: TimerPhase.Rest, events: [] }}
    ${0}          | ${{ totalRemainingSeconds: 0, cyclesRemainingCount: 0, cycleSetsRemainingCount: 0, restRemainingSecs: 0, workoutRemainingSecs: 0, prepareRemainingSecs: 0, cycleCurrentPhase: undefined, events: [] }}
  `('should update preset with remaining $remainingSecs, $expected', ({ remainingSecs, expected }) => {
    const presetMock1: Preset = new Preset('', 'name', 3, 4, 2, 2, 2)
    const result = getUpdatedContext(presetMock1, remainingSecs)
    expect(result).toEqual(expected)
  })

  it('should get-unpacked-preset-map, >3scs-normal-preset', () => {
    const presetMock2: Preset = new Preset('', 'name', 4, 4, 4, 2, 2)
    const expected = {
      '40s': { totalRemainingSeconds: 40, cyclesRemainingCount: 2, cycleSetsRemainingCount: 2, restRemainingSecs: 4, workoutRemainingSecs: 4, prepareRemainingSecs: 4, cycleCurrentPhase: TimerPhase.Prepare, events: [TickingEvent.CycleStarted, TickingEvent.PreparePhaseStarted] },
      '39s': { totalRemainingSeconds: 39, cyclesRemainingCount: 2, cycleSetsRemainingCount: 2, restRemainingSecs: 4, workoutRemainingSecs: 4, prepareRemainingSecs: 3, cycleCurrentPhase: TimerPhase.Prepare, events: [TickingEvent.PreparePhaseClosing] },
      '38s': { totalRemainingSeconds: 38, cyclesRemainingCount: 2, cycleSetsRemainingCount: 2, restRemainingSecs: 4, workoutRemainingSecs: 4, prepareRemainingSecs: 2, cycleCurrentPhase: TimerPhase.Prepare, events: [] },
      '37s': { totalRemainingSeconds: 37, cyclesRemainingCount: 2, cycleSetsRemainingCount: 2, restRemainingSecs: 4, workoutRemainingSecs: 4, prepareRemainingSecs: 1, cycleCurrentPhase: TimerPhase.Prepare, events: [] },

      '36s': { totalRemainingSeconds: 36, cyclesRemainingCount: 2, cycleSetsRemainingCount: 2, restRemainingSecs: 4, workoutRemainingSecs: 4, prepareRemainingSecs: 0, cycleCurrentPhase: TimerPhase.Workout, events: [TickingEvent.SetStarted, TickingEvent.WorkoutPhaseStarted] },
      '35s': { totalRemainingSeconds: 35, cyclesRemainingCount: 2, cycleSetsRemainingCount: 2, restRemainingSecs: 4, workoutRemainingSecs: 3, prepareRemainingSecs: 0, cycleCurrentPhase: TimerPhase.Workout, events: [TickingEvent.WorkoutPhaseClosing] },
      '34s': { totalRemainingSeconds: 34, cyclesRemainingCount: 2, cycleSetsRemainingCount: 2, restRemainingSecs: 4, workoutRemainingSecs: 2, prepareRemainingSecs: 0, cycleCurrentPhase: TimerPhase.Workout, events: [] },
      '33s': { totalRemainingSeconds: 33, cyclesRemainingCount: 2, cycleSetsRemainingCount: 2, restRemainingSecs: 4, workoutRemainingSecs: 1, prepareRemainingSecs: 0, cycleCurrentPhase: TimerPhase.Workout, events: [] },
      '32s': { totalRemainingSeconds: 32, cyclesRemainingCount: 2, cycleSetsRemainingCount: 2, restRemainingSecs: 4, workoutRemainingSecs: 0, prepareRemainingSecs: 0, cycleCurrentPhase: TimerPhase.Rest, events: [TickingEvent.RestPhaseStarted] },
      '31s': { totalRemainingSeconds: 31, cyclesRemainingCount: 2, cycleSetsRemainingCount: 2, restRemainingSecs: 3, workoutRemainingSecs: 0, prepareRemainingSecs: 0, cycleCurrentPhase: TimerPhase.Rest, events: [TickingEvent.RestPhaseClosing] },
      '30s': { totalRemainingSeconds: 30, cyclesRemainingCount: 2, cycleSetsRemainingCount: 2, restRemainingSecs: 2, workoutRemainingSecs: 0, prepareRemainingSecs: 0, cycleCurrentPhase: TimerPhase.Rest, events: [] },
      '29s': { totalRemainingSeconds: 29, cyclesRemainingCount: 2, cycleSetsRemainingCount: 2, restRemainingSecs: 1, workoutRemainingSecs: 0, prepareRemainingSecs: 0, cycleCurrentPhase: TimerPhase.Rest, events: [] },

      '28s': { totalRemainingSeconds: 28, cyclesRemainingCount: 2, cycleSetsRemainingCount: 1, restRemainingSecs: 4, workoutRemainingSecs: 4, prepareRemainingSecs: 0, cycleCurrentPhase: TimerPhase.Workout, events: [TickingEvent.SetStarted, TickingEvent.WorkoutPhaseStarted] },
      '27s': { totalRemainingSeconds: 27, cyclesRemainingCount: 2, cycleSetsRemainingCount: 1, restRemainingSecs: 4, workoutRemainingSecs: 3, prepareRemainingSecs: 0, cycleCurrentPhase: TimerPhase.Workout, events: [TickingEvent.WorkoutPhaseClosing] },
      '26s': { totalRemainingSeconds: 26, cyclesRemainingCount: 2, cycleSetsRemainingCount: 1, restRemainingSecs: 4, workoutRemainingSecs: 2, prepareRemainingSecs: 0, cycleCurrentPhase: TimerPhase.Workout, events: [] },
      '25s': { totalRemainingSeconds: 25, cyclesRemainingCount: 2, cycleSetsRemainingCount: 1, restRemainingSecs: 4, workoutRemainingSecs: 1, prepareRemainingSecs: 0, cycleCurrentPhase: TimerPhase.Workout, events: [] },
      '24s': { totalRemainingSeconds: 24, cyclesRemainingCount: 2, cycleSetsRemainingCount: 1, restRemainingSecs: 4, workoutRemainingSecs: 0, prepareRemainingSecs: 0, cycleCurrentPhase: TimerPhase.Rest, events: [TickingEvent.RestPhaseStarted] },
      '23s': { totalRemainingSeconds: 23, cyclesRemainingCount: 2, cycleSetsRemainingCount: 1, restRemainingSecs: 3, workoutRemainingSecs: 0, prepareRemainingSecs: 0, cycleCurrentPhase: TimerPhase.Rest, events: [TickingEvent.RestPhaseClosing] },
      '22s': { totalRemainingSeconds: 22, cyclesRemainingCount: 2, cycleSetsRemainingCount: 1, restRemainingSecs: 2, workoutRemainingSecs: 0, prepareRemainingSecs: 0, cycleCurrentPhase: TimerPhase.Rest, events: [] },
      '21s': { totalRemainingSeconds: 21, cyclesRemainingCount: 2, cycleSetsRemainingCount: 1, restRemainingSecs: 1, workoutRemainingSecs: 0, prepareRemainingSecs: 0, cycleCurrentPhase: TimerPhase.Rest, events: [] },

      '20s': { totalRemainingSeconds: 20, cyclesRemainingCount: 1, cycleSetsRemainingCount: 2, restRemainingSecs: 4, workoutRemainingSecs: 4, prepareRemainingSecs: 4, cycleCurrentPhase: TimerPhase.Prepare, events: [TickingEvent.CycleStarted, TickingEvent.PreparePhaseStarted] },
      '19s': { totalRemainingSeconds: 19, cyclesRemainingCount: 1, cycleSetsRemainingCount: 2, restRemainingSecs: 4, workoutRemainingSecs: 4, prepareRemainingSecs: 3, cycleCurrentPhase: TimerPhase.Prepare, events: [TickingEvent.PreparePhaseClosing] },
      '18s': { totalRemainingSeconds: 18, cyclesRemainingCount: 1, cycleSetsRemainingCount: 2, restRemainingSecs: 4, workoutRemainingSecs: 4, prepareRemainingSecs: 2, cycleCurrentPhase: TimerPhase.Prepare, events: [] },
      '17s': { totalRemainingSeconds: 17, cyclesRemainingCount: 1, cycleSetsRemainingCount: 2, restRemainingSecs: 4, workoutRemainingSecs: 4, prepareRemainingSecs: 1, cycleCurrentPhase: TimerPhase.Prepare, events: [] },

      '16s': { totalRemainingSeconds: 16, cyclesRemainingCount: 1, cycleSetsRemainingCount: 2, restRemainingSecs: 4, workoutRemainingSecs: 4, prepareRemainingSecs: 0, cycleCurrentPhase: TimerPhase.Workout, events: [TickingEvent.SetStarted, TickingEvent.WorkoutPhaseStarted] },
      '15s': { totalRemainingSeconds: 15, cyclesRemainingCount: 1, cycleSetsRemainingCount: 2, restRemainingSecs: 4, workoutRemainingSecs: 3, prepareRemainingSecs: 0, cycleCurrentPhase: TimerPhase.Workout, events: [TickingEvent.WorkoutPhaseClosing] },
      '14s': { totalRemainingSeconds: 14, cyclesRemainingCount: 1, cycleSetsRemainingCount: 2, restRemainingSecs: 4, workoutRemainingSecs: 2, prepareRemainingSecs: 0, cycleCurrentPhase: TimerPhase.Workout, events: [] },
      '13s': { totalRemainingSeconds: 13, cyclesRemainingCount: 1, cycleSetsRemainingCount: 2, restRemainingSecs: 4, workoutRemainingSecs: 1, prepareRemainingSecs: 0, cycleCurrentPhase: TimerPhase.Workout, events: [] },
      '12s': { totalRemainingSeconds: 12, cyclesRemainingCount: 1, cycleSetsRemainingCount: 2, restRemainingSecs: 4, workoutRemainingSecs: 0, prepareRemainingSecs: 0, cycleCurrentPhase: TimerPhase.Rest, events: [TickingEvent.RestPhaseStarted] },
      '11s': { totalRemainingSeconds: 11, cyclesRemainingCount: 1, cycleSetsRemainingCount: 2, restRemainingSecs: 3, workoutRemainingSecs: 0, prepareRemainingSecs: 0, cycleCurrentPhase: TimerPhase.Rest, events: [TickingEvent.RestPhaseClosing] },
      '10s': { totalRemainingSeconds: 10, cyclesRemainingCount: 1, cycleSetsRemainingCount: 2, restRemainingSecs: 2, workoutRemainingSecs: 0, prepareRemainingSecs: 0, cycleCurrentPhase: TimerPhase.Rest, events: [] },
      '9s' : { totalRemainingSeconds: 9,  cyclesRemainingCount: 1, cycleSetsRemainingCount: 2, restRemainingSecs: 1, workoutRemainingSecs: 0, prepareRemainingSecs: 0, cycleCurrentPhase: TimerPhase.Rest, events: [] },

      '8s' : { totalRemainingSeconds: 8,  cyclesRemainingCount: 1, cycleSetsRemainingCount: 1, restRemainingSecs: 4, workoutRemainingSecs: 4, prepareRemainingSecs: 0, cycleCurrentPhase: TimerPhase.Workout, events: [TickingEvent.SetStarted, TickingEvent.WorkoutPhaseStarted] },
      '7s' : { totalRemainingSeconds: 7,  cyclesRemainingCount: 1, cycleSetsRemainingCount: 1, restRemainingSecs: 4, workoutRemainingSecs: 3, prepareRemainingSecs: 0, cycleCurrentPhase: TimerPhase.Workout, events: [TickingEvent.WorkoutPhaseClosing] },
      '6s' : { totalRemainingSeconds: 6,  cyclesRemainingCount: 1, cycleSetsRemainingCount: 1, restRemainingSecs: 4, workoutRemainingSecs: 2, prepareRemainingSecs: 0, cycleCurrentPhase: TimerPhase.Workout, events: [] },
      '5s' : { totalRemainingSeconds: 5,  cyclesRemainingCount: 1, cycleSetsRemainingCount: 1, restRemainingSecs: 4, workoutRemainingSecs: 1, prepareRemainingSecs: 0, cycleCurrentPhase: TimerPhase.Workout, events: [] },
      '4s' : { totalRemainingSeconds: 4,  cyclesRemainingCount: 1, cycleSetsRemainingCount: 1, restRemainingSecs: 4, workoutRemainingSecs: 0, prepareRemainingSecs: 0, cycleCurrentPhase: TimerPhase.Rest, events: [TickingEvent.RestPhaseStarted] },
      '3s' : { totalRemainingSeconds: 3,  cyclesRemainingCount: 1, cycleSetsRemainingCount: 1, restRemainingSecs: 3, workoutRemainingSecs: 0, prepareRemainingSecs: 0, cycleCurrentPhase: TimerPhase.Rest, events: [TickingEvent.RestPhaseClosing] },
      '2s' : { totalRemainingSeconds: 2,  cyclesRemainingCount: 1, cycleSetsRemainingCount: 1, restRemainingSecs: 2, workoutRemainingSecs: 0, prepareRemainingSecs: 0, cycleCurrentPhase: TimerPhase.Rest, events: [] },
      '1s' : { totalRemainingSeconds: 1,  cyclesRemainingCount: 1, cycleSetsRemainingCount: 1, restRemainingSecs: 1, workoutRemainingSecs: 0, prepareRemainingSecs: 0, cycleCurrentPhase: TimerPhase.Rest, events: [] },

      '0s' : { totalRemainingSeconds: 0,  cyclesRemainingCount: 0, cycleSetsRemainingCount: 0, restRemainingSecs: 0, workoutRemainingSecs: 0, prepareRemainingSecs: 0, cycleCurrentPhase: undefined, events: [] },
    }
    const result = getUnpackedPresetMap(presetMock2)
    expect(result).toEqual(expected)
  })

  it('should get-unpacked-preset-map, =3secs-preset', () => {
    const presetMock2: Preset = new Preset('', 'name', 3, 3, 3, 2, 2)
    const expected = {
      '30s': { totalRemainingSeconds: 30, cyclesRemainingCount: 2, cycleSetsRemainingCount: 2, restRemainingSecs: 3, workoutRemainingSecs: 3, prepareRemainingSecs: 3, cycleCurrentPhase: TimerPhase.Prepare, events: [TickingEvent.CycleStarted, TickingEvent.PreparePhaseStarted, TickingEvent.PreparePhaseClosing] },
      '29s': { totalRemainingSeconds: 29, cyclesRemainingCount: 2, cycleSetsRemainingCount: 2, restRemainingSecs: 3, workoutRemainingSecs: 3, prepareRemainingSecs: 2, cycleCurrentPhase: TimerPhase.Prepare, events: [] },
      '28s': { totalRemainingSeconds: 28, cyclesRemainingCount: 2, cycleSetsRemainingCount: 2, restRemainingSecs: 3, workoutRemainingSecs: 3, prepareRemainingSecs: 1, cycleCurrentPhase: TimerPhase.Prepare, events: [] },

      '27s': { totalRemainingSeconds: 27, cyclesRemainingCount: 2, cycleSetsRemainingCount: 2, restRemainingSecs: 3, workoutRemainingSecs: 3, prepareRemainingSecs: 0, cycleCurrentPhase: TimerPhase.Workout, events: [TickingEvent.SetStarted, TickingEvent.WorkoutPhaseStarted, TickingEvent.WorkoutPhaseClosing] },
      '26s': { totalRemainingSeconds: 26, cyclesRemainingCount: 2, cycleSetsRemainingCount: 2, restRemainingSecs: 3, workoutRemainingSecs: 2, prepareRemainingSecs: 0, cycleCurrentPhase: TimerPhase.Workout, events: [] },
      '25s': { totalRemainingSeconds: 25, cyclesRemainingCount: 2, cycleSetsRemainingCount: 2, restRemainingSecs: 3, workoutRemainingSecs: 1, prepareRemainingSecs: 0, cycleCurrentPhase: TimerPhase.Workout, events: [] },
      '24s': { totalRemainingSeconds: 24, cyclesRemainingCount: 2, cycleSetsRemainingCount: 2, restRemainingSecs: 3, workoutRemainingSecs: 0, prepareRemainingSecs: 0, cycleCurrentPhase: TimerPhase.Rest, events: [TickingEvent.RestPhaseStarted, TickingEvent.RestPhaseClosing] },
      '23s': { totalRemainingSeconds: 23, cyclesRemainingCount: 2, cycleSetsRemainingCount: 2, restRemainingSecs: 2, workoutRemainingSecs: 0, prepareRemainingSecs: 0, cycleCurrentPhase: TimerPhase.Rest, events: [] },
      '22s': { totalRemainingSeconds: 22, cyclesRemainingCount: 2, cycleSetsRemainingCount: 2, restRemainingSecs: 1, workoutRemainingSecs: 0, prepareRemainingSecs: 0, cycleCurrentPhase: TimerPhase.Rest, events: [] },

      '21s': { totalRemainingSeconds: 21, cyclesRemainingCount: 2, cycleSetsRemainingCount: 1, restRemainingSecs: 3, workoutRemainingSecs: 3, prepareRemainingSecs: 0, cycleCurrentPhase: TimerPhase.Workout, events: [TickingEvent.SetStarted, TickingEvent.WorkoutPhaseStarted, TickingEvent.WorkoutPhaseClosing] },
      '20s': { totalRemainingSeconds: 20, cyclesRemainingCount: 2, cycleSetsRemainingCount: 1, restRemainingSecs: 3, workoutRemainingSecs: 2, prepareRemainingSecs: 0, cycleCurrentPhase: TimerPhase.Workout, events: [] },
      '19s': { totalRemainingSeconds: 19, cyclesRemainingCount: 2, cycleSetsRemainingCount: 1, restRemainingSecs: 3, workoutRemainingSecs: 1, prepareRemainingSecs: 0, cycleCurrentPhase: TimerPhase.Workout, events: [] },
      '18s': { totalRemainingSeconds: 18, cyclesRemainingCount: 2, cycleSetsRemainingCount: 1, restRemainingSecs: 3, workoutRemainingSecs: 0, prepareRemainingSecs: 0, cycleCurrentPhase: TimerPhase.Rest, events: [TickingEvent.RestPhaseStarted, TickingEvent.RestPhaseClosing] },
      '17s': { totalRemainingSeconds: 17, cyclesRemainingCount: 2, cycleSetsRemainingCount: 1, restRemainingSecs: 2, workoutRemainingSecs: 0, prepareRemainingSecs: 0, cycleCurrentPhase: TimerPhase.Rest, events: [] },
      '16s': { totalRemainingSeconds: 16, cyclesRemainingCount: 2, cycleSetsRemainingCount: 1, restRemainingSecs: 1, workoutRemainingSecs: 0, prepareRemainingSecs: 0, cycleCurrentPhase: TimerPhase.Rest, events: [] },

      '15s': { totalRemainingSeconds: 15, cyclesRemainingCount: 1, cycleSetsRemainingCount: 2, restRemainingSecs: 3, workoutRemainingSecs: 3, prepareRemainingSecs: 3, cycleCurrentPhase: TimerPhase.Prepare, events: [TickingEvent.CycleStarted, TickingEvent.PreparePhaseStarted, TickingEvent.PreparePhaseClosing] },
      '14s': { totalRemainingSeconds: 14, cyclesRemainingCount: 1, cycleSetsRemainingCount: 2, restRemainingSecs: 3, workoutRemainingSecs: 3, prepareRemainingSecs: 2, cycleCurrentPhase: TimerPhase.Prepare, events: [] },
      '13s': { totalRemainingSeconds: 13, cyclesRemainingCount: 1, cycleSetsRemainingCount: 2, restRemainingSecs: 3, workoutRemainingSecs: 3, prepareRemainingSecs: 1, cycleCurrentPhase: TimerPhase.Prepare, events: [] },

      '12s': { totalRemainingSeconds: 12, cyclesRemainingCount: 1, cycleSetsRemainingCount: 2, restRemainingSecs: 3, workoutRemainingSecs: 3, prepareRemainingSecs: 0, cycleCurrentPhase: TimerPhase.Workout, events: [TickingEvent.SetStarted, TickingEvent.WorkoutPhaseStarted, TickingEvent.WorkoutPhaseClosing] },
      '11s': { totalRemainingSeconds: 11, cyclesRemainingCount: 1, cycleSetsRemainingCount: 2, restRemainingSecs: 3, workoutRemainingSecs: 2, prepareRemainingSecs: 0, cycleCurrentPhase: TimerPhase.Workout, events: [] },
      '10s': { totalRemainingSeconds: 10, cyclesRemainingCount: 1, cycleSetsRemainingCount: 2, restRemainingSecs: 3, workoutRemainingSecs: 1, prepareRemainingSecs: 0, cycleCurrentPhase: TimerPhase.Workout, events: [] },
      '9s' : { totalRemainingSeconds: 9,  cyclesRemainingCount: 1, cycleSetsRemainingCount: 2, restRemainingSecs: 3, workoutRemainingSecs: 0, prepareRemainingSecs: 0, cycleCurrentPhase: TimerPhase.Rest, events: [TickingEvent.RestPhaseStarted, TickingEvent.RestPhaseClosing] },
      '8s' : { totalRemainingSeconds: 8,  cyclesRemainingCount: 1, cycleSetsRemainingCount: 2, restRemainingSecs: 2, workoutRemainingSecs: 0, prepareRemainingSecs: 0, cycleCurrentPhase: TimerPhase.Rest, events: [] },
      '7s' : { totalRemainingSeconds: 7,  cyclesRemainingCount: 1, cycleSetsRemainingCount: 2, restRemainingSecs: 1, workoutRemainingSecs: 0, prepareRemainingSecs: 0, cycleCurrentPhase: TimerPhase.Rest, events: [] },

      '6s' : { totalRemainingSeconds: 6,  cyclesRemainingCount: 1, cycleSetsRemainingCount: 1, restRemainingSecs: 3, workoutRemainingSecs: 3, prepareRemainingSecs: 0, cycleCurrentPhase: TimerPhase.Workout, events: [TickingEvent.SetStarted, TickingEvent.WorkoutPhaseStarted, TickingEvent.WorkoutPhaseClosing] },
      '5s' : { totalRemainingSeconds: 5,  cyclesRemainingCount: 1, cycleSetsRemainingCount: 1, restRemainingSecs: 3, workoutRemainingSecs: 2, prepareRemainingSecs: 0, cycleCurrentPhase: TimerPhase.Workout, events: [] },
      '4s' : { totalRemainingSeconds: 4,  cyclesRemainingCount: 1, cycleSetsRemainingCount: 1, restRemainingSecs: 3, workoutRemainingSecs: 1, prepareRemainingSecs: 0, cycleCurrentPhase: TimerPhase.Workout, events: [] },
      '3s' : { totalRemainingSeconds: 3,  cyclesRemainingCount: 1, cycleSetsRemainingCount: 1, restRemainingSecs: 3, workoutRemainingSecs: 0, prepareRemainingSecs: 0, cycleCurrentPhase: TimerPhase.Rest, events: [TickingEvent.RestPhaseStarted, TickingEvent.RestPhaseClosing] },
      '2s' : { totalRemainingSeconds: 2,  cyclesRemainingCount: 1, cycleSetsRemainingCount: 1, restRemainingSecs: 2, workoutRemainingSecs: 0, prepareRemainingSecs: 0, cycleCurrentPhase: TimerPhase.Rest, events: [] },
      '1s' : { totalRemainingSeconds: 1,  cyclesRemainingCount: 1, cycleSetsRemainingCount: 1, restRemainingSecs: 1, workoutRemainingSecs: 0, prepareRemainingSecs: 0, cycleCurrentPhase: TimerPhase.Rest, events: [] },

      '0s' : { totalRemainingSeconds: 0,  cyclesRemainingCount: 0, cycleSetsRemainingCount: 0, restRemainingSecs: 0, workoutRemainingSecs: 0, prepareRemainingSecs: 0, cycleCurrentPhase: undefined, events: [] },
    }
    const result = getUnpackedPresetMap(presetMock2)
    expect(result).toEqual(expected)
  })

  it('should get-unpacked-preset-map, <3secs-short-preset (2secs)', () => {
    const presetMock2: Preset = new Preset('', 'name', 2, 2, 2, 2, 2)
    const expected = {
      '20s': { totalRemainingSeconds: 20, cyclesRemainingCount: 2, cycleSetsRemainingCount: 2, restRemainingSecs: 2, workoutRemainingSecs: 2, prepareRemainingSecs: 2, cycleCurrentPhase: TimerPhase.Prepare, events: [TickingEvent.CycleStarted, TickingEvent.PreparePhaseStarted, TickingEvent.PreparePhaseClosing] },
      '19s': { totalRemainingSeconds: 19, cyclesRemainingCount: 2, cycleSetsRemainingCount: 2, restRemainingSecs: 2, workoutRemainingSecs: 2, prepareRemainingSecs: 1, cycleCurrentPhase: TimerPhase.Prepare, events: [] },

      '18s': { totalRemainingSeconds: 18, cyclesRemainingCount: 2, cycleSetsRemainingCount: 2, restRemainingSecs: 2, workoutRemainingSecs: 2, prepareRemainingSecs: 0, cycleCurrentPhase: TimerPhase.Workout, events: [TickingEvent.SetStarted, TickingEvent.WorkoutPhaseStarted, TickingEvent.WorkoutPhaseClosing] },
      '17s': { totalRemainingSeconds: 17, cyclesRemainingCount: 2, cycleSetsRemainingCount: 2, restRemainingSecs: 2, workoutRemainingSecs: 1, prepareRemainingSecs: 0, cycleCurrentPhase: TimerPhase.Workout, events: [] },
      '16s': { totalRemainingSeconds: 16, cyclesRemainingCount: 2, cycleSetsRemainingCount: 2, restRemainingSecs: 2, workoutRemainingSecs: 0, prepareRemainingSecs: 0, cycleCurrentPhase: TimerPhase.Rest, events: [TickingEvent.RestPhaseStarted, TickingEvent.RestPhaseClosing] },
      '15s': { totalRemainingSeconds: 15, cyclesRemainingCount: 2, cycleSetsRemainingCount: 2, restRemainingSecs: 1, workoutRemainingSecs: 0, prepareRemainingSecs: 0, cycleCurrentPhase: TimerPhase.Rest, events: [] },

      '14s': { totalRemainingSeconds: 14, cyclesRemainingCount: 2, cycleSetsRemainingCount: 1, restRemainingSecs: 2, workoutRemainingSecs: 2, prepareRemainingSecs: 0, cycleCurrentPhase: TimerPhase.Workout, events: [TickingEvent.SetStarted, TickingEvent.WorkoutPhaseStarted, TickingEvent.WorkoutPhaseClosing] },
      '13s': { totalRemainingSeconds: 13, cyclesRemainingCount: 2, cycleSetsRemainingCount: 1, restRemainingSecs: 2, workoutRemainingSecs: 1, prepareRemainingSecs: 0, cycleCurrentPhase: TimerPhase.Workout, events: [] },
      '12s': { totalRemainingSeconds: 12, cyclesRemainingCount: 2, cycleSetsRemainingCount: 1, restRemainingSecs: 2, workoutRemainingSecs: 0, prepareRemainingSecs: 0, cycleCurrentPhase: TimerPhase.Rest, events: [TickingEvent.RestPhaseStarted, TickingEvent.RestPhaseClosing] },
      '11s': { totalRemainingSeconds: 11, cyclesRemainingCount: 2, cycleSetsRemainingCount: 1, restRemainingSecs: 1, workoutRemainingSecs: 0, prepareRemainingSecs: 0, cycleCurrentPhase: TimerPhase.Rest, events: [] },

      '10s': { totalRemainingSeconds: 10, cyclesRemainingCount: 1, cycleSetsRemainingCount: 2, restRemainingSecs: 2, workoutRemainingSecs: 2, prepareRemainingSecs: 2, cycleCurrentPhase: TimerPhase.Prepare, events: [TickingEvent.CycleStarted, TickingEvent.PreparePhaseStarted, TickingEvent.PreparePhaseClosing] },
      '9s' : { totalRemainingSeconds: 9,  cyclesRemainingCount: 1, cycleSetsRemainingCount: 2, restRemainingSecs: 2, workoutRemainingSecs: 2, prepareRemainingSecs: 1, cycleCurrentPhase: TimerPhase.Prepare, events: [] },

      '8s' : { totalRemainingSeconds: 8,  cyclesRemainingCount: 1, cycleSetsRemainingCount: 2, restRemainingSecs: 2, workoutRemainingSecs: 2, prepareRemainingSecs: 0, cycleCurrentPhase: TimerPhase.Workout, events: [TickingEvent.SetStarted, TickingEvent.WorkoutPhaseStarted, TickingEvent.WorkoutPhaseClosing] },
      '7s' : { totalRemainingSeconds: 7,  cyclesRemainingCount: 1, cycleSetsRemainingCount: 2, restRemainingSecs: 2, workoutRemainingSecs: 1, prepareRemainingSecs: 0, cycleCurrentPhase: TimerPhase.Workout, events: [] },
      '6s' : { totalRemainingSeconds: 6,  cyclesRemainingCount: 1, cycleSetsRemainingCount: 2, restRemainingSecs: 2, workoutRemainingSecs: 0, prepareRemainingSecs: 0, cycleCurrentPhase: TimerPhase.Rest, events: [TickingEvent.RestPhaseStarted, TickingEvent.RestPhaseClosing] },
      '5s' : { totalRemainingSeconds: 5,  cyclesRemainingCount: 1, cycleSetsRemainingCount: 2, restRemainingSecs: 1, workoutRemainingSecs: 0, prepareRemainingSecs: 0, cycleCurrentPhase: TimerPhase.Rest, events: [] },

      '4s' : { totalRemainingSeconds: 4,  cyclesRemainingCount: 1, cycleSetsRemainingCount: 1, restRemainingSecs: 2, workoutRemainingSecs: 2, prepareRemainingSecs: 0, cycleCurrentPhase: TimerPhase.Workout, events: [TickingEvent.SetStarted, TickingEvent.WorkoutPhaseStarted, TickingEvent.WorkoutPhaseClosing] },
      '3s' : { totalRemainingSeconds: 3,  cyclesRemainingCount: 1, cycleSetsRemainingCount: 1, restRemainingSecs: 2, workoutRemainingSecs: 1, prepareRemainingSecs: 0, cycleCurrentPhase: TimerPhase.Workout, events: [] },
      '2s' : { totalRemainingSeconds: 2,  cyclesRemainingCount: 1, cycleSetsRemainingCount: 1, restRemainingSecs: 2, workoutRemainingSecs: 0, prepareRemainingSecs: 0, cycleCurrentPhase: TimerPhase.Rest, events: [TickingEvent.RestPhaseStarted, TickingEvent.RestPhaseClosing] },
      '1s' : { totalRemainingSeconds: 1,  cyclesRemainingCount: 1, cycleSetsRemainingCount: 1, restRemainingSecs: 1, workoutRemainingSecs: 0, prepareRemainingSecs: 0, cycleCurrentPhase: TimerPhase.Rest, events: [] },

      '0s' : { totalRemainingSeconds: 0,  cyclesRemainingCount: 0, cycleSetsRemainingCount: 0, restRemainingSecs: 0, workoutRemainingSecs: 0, prepareRemainingSecs: 0, cycleCurrentPhase: undefined, events: [] },
    }
    const result = getUnpackedPresetMap(presetMock2)
    expect(result).toEqual(expected)
  })
})
