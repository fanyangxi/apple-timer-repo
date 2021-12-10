import { Platform } from 'react-native'
import { logger } from '@/utils/logger'
import * as RNLocalize from 'react-native-localize'
import { Languages } from '@/models/common'

export const Sleep = (dely: number): Promise<void> => {
  return new Promise<void>(resolve => setTimeout(() => resolve(), dely))
}

export const PositiveOr0 = (input: number): number => {
  return input > 0 ? input : 0
}

export const duration = (action: () => void) => {
  const startedAt = new Date().getTime()
  action()
  const endedAt = new Date().getTime()
  console.log(`The duration on executing the action is: ${endedAt - startedAt}`)
}

export const hashCode = (input: string): number => {
  let hash = 0
  let i
  let chr
  if (input.length === 0) {
    return hash
  }
  for (i = 0; i < input.length; i++) {
    chr = input.charCodeAt(i)
    // eslint-disable-next-line no-bitwise
    hash = (hash << 5) - hash + chr
    // eslint-disable-next-line no-bitwise
    hash |= 0 // Convert to 32bit integer
  }
  return hash
}

export const toDecimal = (rawInput: number) => {
  // For ios: render 5 pixels per point
  // For android: render 2 pixels per point
  const resolution = Platform.select({ ios: 0.2, android: 0.5 }) ?? 0.2
  const intPart = Math.floor(rawInput)
  const decimalPart = rawInput - intPart
  const interpolatedDecimalPart = Math.floor(decimalPart / resolution) * resolution
  return intPart + interpolatedDecimalPart
}

// 32.9689389752 -> 32.97
export const toFixedNumber = (rawInput: number): number => {
  if (isNaN(rawInput) || rawInput === 0) {
    return 0
  }
  return Math.floor(rawInput * 100) / 100
}

export const handleErr = (e: Error) => {
  logger.error('Async callback error: ', e)
}

export const stringToEnumValue = <ET, T>(enumObj: ET, str: string): T => {
  return (enumObj as any)[Object.keys(enumObj).filter(k => (enumObj as any)[k] === str)[0]]
}

// Since the user-device locales usually don't change frequently, so we create a closure to make sure it only
// execute once, to improve efficiency. https://www.w3schools.com/js/js_function_closures.asp
export const getDeviceLanguageCode = (function () {
  let deviceLanguageEnum = Languages.English
  return function (info?: string): Languages {
    const deviceLanguageCode = RNLocalize.getLocales()[0]?.languageCode
    deviceLanguageEnum = stringToEnumValue(Languages, deviceLanguageCode) ?? Languages.English
    logger.info(`${info}: [getDefaultUserSettings] User device device-language-code: ${deviceLanguageCode}`)
    return deviceLanguageEnum
  }
})()
