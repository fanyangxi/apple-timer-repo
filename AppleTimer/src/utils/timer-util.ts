import BackgroundTimer from 'react-native-background-timer'
import queueMicrotask from 'queue-microtask'
import { logger } from '@/utils/logger'

export const sleep = (ms: number): Promise<void> => {
  return new Promise<void>(resolve => {
    setTimeout(() => resolve(), ms)
  })
}

export const runAccurateBackgroundCountdownTimer = (
  countdownSecs: number,
  delayMs: number,
  onTicked: (remainingSecs: number, rawRemainingMs: number, diff: number) => Promise<void>,
): void => {
  const miniIntervalMs = 10
  let remainingMs: number = countdownSecs * 1000 + delayMs
  let previousRemaining = remainingMs

  let counter: number = countdownSecs
  BackgroundTimer.setInterval(() => {
    // queueMicrotask(() => {
    const now = Date.now()
    const diff = now - previous
    previous = now

    remainingMs = remainingMs - diff
    // logger.info(`>>> remainingMs:${remainingMs}; counterMs:${counter * 1000}; diff:${diff}`)
    if (remainingMs <= -1 * 1000) {
      BackgroundTimer.stopBackgroundTimer()
      return
    }
    if (remainingMs < counter * 1000) {
      const result = Math.round(remainingMs / 1000)
      const actualElapsedMs = previousRemaining - remainingMs
      onTicked(result, remainingMs, actualElapsedMs).catch(() => {})
      counter--
      previousRemaining = remainingMs
      // logger.info(
      //   `>>> ${format(toDTime(result))} remainingMs:${remainingMs}; diff:${diff}; ` +
      //     `remainingDiff:${previousRemaining - remainingMs};`,
      // )
    }
    // })
  }, miniIntervalMs)
  let previous = Date.now()
  logger.info('start-======= raw')
}

// ### Accurate Background Timer (V1, for reference):
// const countdownSecs: number = 420
// const delayMs: number = 239
// let remainingMs: number = countdownSecs * 1000 + delayMs
//
// let counter: number = countdownSecs
// BackgroundTimer.setInterval(() => {
//   queueMicrotask(() => {
//     //code that will be called every 3 seconds
//     const now = Date.now()
//     const diff = now - previous
//     previous = now
//
//     remainingMs = remainingMs - diff
//     // logger.info(`>>> remainingMs:${remainingMs}; counterMs:${counter * 1000}; diff:${diff}`)
//     if (remainingMs <= -1 * 1000) {
//       BackgroundTimer.stopBackgroundTimer()
//       return
//     }
//     if (remainingMs < counter * 1000) {
//       const result = Math.round(remainingMs / 1000)
//       logger.info(
//         `>>> ${format(toDTime(result))} remainingMs:${remainingMs}; diff:${diff}; ` +
//           `remainingDiff:${previousRemaining - remainingMs};`,
//       )
//       // notificationServiceRef.current?.playSounds([Sounds._bell])
//       counter--
//       previousRemaining = remainingMs
//     }
//   })
// }, 10)
// let previous = Date.now()
// let previousRemaining = remainingMs
// logger.info('start-======= raw')
