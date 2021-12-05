/* eslint-disable prettier/prettier */
import { hashCode } from '@/utils/common-util'

describe('common-util', () => {
  it.each`
    source                            | expected
    ${'hello world!'}                 | ${-217287203}
    ${'!@#$%^&*()_+VBNM<L:POIUYHBNM'} | ${1957404466}
  `('should get string hash-code properly, $source, $expected', ({ source, expected }) => {
    const result = hashCode(source)
    expect(result).toEqual(expected)
  })
})
