import { DTime } from '@/models/common'

export const FULL_TIMESTAMP = 'YYYY-MM-DDTHH:mm:ss.SSS'

export const toDTime = (durationSecs: number): DTime => {
  const sec_num = durationSecs
  const hours = Math.floor(sec_num / 3600)
  const minutes = Math.floor(sec_num / 60) % 60
  const seconds = sec_num % 60
  return { hours, minutes, seconds }
}

export const format = (dTime: DTime, alwaysFull?: false): string => {
  const subContent = `${`${dTime.minutes}`.padStart(2, '0')}:${`${dTime.seconds}`.padStart(2, '0')}`
  const isHoursEmpty = dTime.hours === 0
  return isHoursEmpty && !alwaysFull ? `${subContent}` : `${`${dTime.hours}`.padStart(2, '0')}:${subContent}`
}

export const formatSecs = (seconds: number, alwaysFull?: false): string => {
  return format(toDTime(seconds), alwaysFull)
}
