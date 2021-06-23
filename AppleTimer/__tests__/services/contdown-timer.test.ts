import { Preset } from '@/models/preset'
import { CountdownTimer } from '@/services/countdown-timer'
import { logger } from '@/utils/logger'

describe('countdown-timer', () => {
  const _presetMock: Preset = new Preset('', 'name', 3, 4, 2, 1, 1)
  let _countdownTimer: CountdownTimer
  let loggerInfoSpy: jest.SpyInstance

  beforeEach(() => {
    _countdownTimer = new CountdownTimer(_presetMock.TotalPresetDurationSecs())
    loggerInfoSpy = jest.spyOn(logger, 'info')
  })

  it('should trigger ticked correctly', done => {
    jest.useRealTimers()
    jest.setTimeout(18000)

    _countdownTimer.start().then(() => {})
    setTimeout(() => {
      _countdownTimer.pause()
    }, 2006)
    setTimeout(() => {
      _countdownTimer.resume().then(() => console.log('================>'))
    }, 3000)
    setTimeout(() => {
      console.log(loggerInfoSpy.mock.calls)
      const calls = loggerInfoSpy.mock.calls.filter(call => (call as string[])[0].includes('Trigger-callback-at'))
      expect(calls.length).toEqual(10)

      expect(loggerInfoSpy).toHaveBeenNthCalledWith(1, '[Started] With initial-countdown-secs:9')
      expect(loggerInfoSpy).toHaveBeenNthCalledWith(2, '[(9 secs)] Trigger-callback-at Started')
      expect(loggerInfoSpy).toHaveBeenNthCalledWith(3, '[(8 secs)] Trigger-callback-at Ticked')
      expect(loggerInfoSpy).toHaveBeenNthCalledWith(4, expect.stringContaining('[Paused] Remaining MilliSecs:before:'))
      expect(loggerInfoSpy).toHaveBeenNthCalledWith(5, expect.stringContaining('[(7 secs)] Trigger-callback-at'))
      expect(loggerInfoSpy).toHaveBeenNthCalledWith(6, expect.stringContaining('[Resumed] With remaining milliSecs:'))
      expect(loggerInfoSpy).toHaveBeenNthCalledWith(7, expect.stringContaining('[(6 secs)] Trigger-callback-at'))
      done()
    }, 11000)
  })
})
