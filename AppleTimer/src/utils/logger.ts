const debug = (message?: any, ...optionalParams: any[]): void => {
  console.log(`[DEBUG] ${message}`, ...optionalParams)
}

const info = (message?: any, ...optionalParams: any[]): void => {
  console.log(`[INFO] ${message}`, ...optionalParams)
}

const warn = (message?: any, ...optionalParams: any[]): void => {
  console.log(`[WARN] ${message}`, ...optionalParams)
}

const error = (message?: any, ...optionalParams: any[]): void => {
  console.log(`[ERROR] ${message}`, ...optionalParams)
}

export const logger = {
  debug,
  info,
  warn,
  error,
}
