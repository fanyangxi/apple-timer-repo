import { Preset } from '@/models/preset'
import { CountdownTimer } from '@/services/countdown-timer'
import { logger } from '@/utils/logger'
import { getTotalPresetDurationSecs } from '@/utils/preset-util'

describe('countdown-timer', () => {
  const _presetMock: Preset = new Preset('', 'name', 3, 4, 2, 1, 1)
  let _countdownTimer: CountdownTimer
  let loggerInfoSpy: jest.SpyInstance

  beforeEach(() => {
    _countdownTimer = new CountdownTimer(getTotalPresetDurationSecs(_presetMock))
    loggerInfoSpy = jest.spyOn(logger, 'info')
  })

  it('should trigger ticked correctly', done => {
    jest.useRealTimers()
    jest.setTimeout(18000)

    _countdownTimer.start().then(() => {})
    setTimeout(() => {
      _countdownTimer.pause()
    }, 2015)
    setTimeout(() => {
      _countdownTimer.resume().then(() => console.log('================>'))
    }, 3000)
    setTimeout(() => {
      console.log(loggerInfoSpy.mock.calls)
      const calls = loggerInfoSpy.mock.calls.filter(call => (call as string[])[0].includes('Trigger-callback-at'))
      console.log('calls:', calls)
      expect(calls.length).toEqual(10)

      expect(loggerInfoSpy).toHaveBeenNthCalledWith(1, '[Started] With initial-countdown-secs:9')
      expect(loggerInfoSpy).toHaveBeenNthCalledWith(2, expect.stringContaining('[(9 secs)] Trigger-callback-at'))
      expect(loggerInfoSpy).toHaveBeenNthCalledWith(3, expect.stringContaining('[(8 secs)] Trigger-callback-at'))
      // expect(loggerInfoSpy).toHaveBeenNthCalledWith(4, expect.stringContaining('[Paused] Remaining milliSecs'))
      expect(loggerInfoSpy).toHaveBeenNthCalledWith(4, expect.stringContaining('[(7 secs)] Trigger-callback-at'))
      // expect(loggerInfoSpy).toHaveBeenNthCalledWith(6, expect.stringContaining('[Resumed] With remaining milliSecs'))
      expect(loggerInfoSpy).toHaveBeenNthCalledWith(5, expect.stringContaining('[(6 secs)] Trigger-callback-at'))
      expect(loggerInfoSpy).toHaveBeenNthCalledWith(6, expect.stringContaining('[(5 secs)] Trigger-callback-at'))
      expect(loggerInfoSpy).toHaveBeenNthCalledWith(7, expect.stringContaining('[(4 secs)] Trigger-callback-at'))
      expect(loggerInfoSpy).toHaveBeenNthCalledWith(8, expect.stringContaining('[(3 secs)] Trigger-callback-at'))
      expect(loggerInfoSpy).toHaveBeenNthCalledWith(9, expect.stringContaining('[(2 secs)] Trigger-callback-at'))
      expect(loggerInfoSpy).toHaveBeenNthCalledWith(10, expect.stringContaining('[(1 secs)] Trigger-callback-at'))
      expect(loggerInfoSpy).toHaveBeenNthCalledWith(11, expect.stringContaining('[(0 secs)] Trigger-callback-at'))
      done()
    }, 11000)
  })
})
