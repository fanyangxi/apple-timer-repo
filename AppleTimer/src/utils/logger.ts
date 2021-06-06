import moment from 'moment'
import { FULL_TIMESTAMP } from '@/utils/date-util'

const debug = (message?: any, ...optionalParams: any[]): void => {
  console.log(`[${moment(Date.now()).format(FULL_TIMESTAMP)}][DEBUG] ${message}`, ...optionalParams)
}

const info = (message?: any, ...optionalParams: any[]): void => {
  console.log(`[${moment(Date.now()).format(FULL_TIMESTAMP)}][INFO] ${message}`, ...optionalParams)
}

const warn = (message?: any, ...optionalParams: any[]): void => {
  console.log(`[${moment(Date.now()).format(FULL_TIMESTAMP)}][WARN] ${message}`, ...optionalParams)
}

const error = (message?: any, ...optionalParams: any[]): void => {
  console.log(`[${moment(Date.now()).format(FULL_TIMESTAMP)}][ERROR] ${message}`, ...optionalParams)
}

export const logger = {
  debug,
  info,
  warn,
  error,
}
