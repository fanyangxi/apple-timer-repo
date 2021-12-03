import { format, toDTime } from '@/utils/date-util'

describe('date-util', () => {
  it('should update preset with remaining $remainingSecs, $expected', () => {
    const dTime = toDTime(2333)
    const result = format(dTime)
    expect(result).toEqual('38:53')
  })
})
