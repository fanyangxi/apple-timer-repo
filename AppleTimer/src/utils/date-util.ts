export const FULL_TIMESTAMP = 'YYYY-MM-DDTHH:mm:ss.SSS'

export const toShortTime = (durationSecs: number): number[] => {
  const sec_num = durationSecs
  const hours = Math.floor(sec_num / 3600)
  const minutes = Math.floor(sec_num / 60) % 60
  const seconds = sec_num % 60
  return [hours, minutes, seconds]
}
