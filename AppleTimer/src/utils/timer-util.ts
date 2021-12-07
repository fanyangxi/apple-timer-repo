import BackgroundTimer from 'react-native-background-timer'
// import queueMicrotask from 'queue-microtask'

export const sleep = (ms: number): Promise<void> => {
  return new Promise<void>(resolve => {
    setTimeout(() => resolve(), ms)
  })
}

// Why don't just use `js setTimeout/setInterval`?:
// -- Because it will be paused when app goes to background.
// Why don't just use `react-native-background-timer,  BackgroundTimer.setTimeout/BackgroundTimer.setInterval`?:
// -- Because it's not accurate, with version 2.4.1, for example, simple use `BackgroundTimer.setInterval` and
// a 3rd-party stopwatch (e.g.: iPhone) to run 60 seconds at the same time, you will see BackgroundTimer ends early.
export const runAccurateBackgroundCountdownTimer = (
  countdownSecs: number,
  delayBeforeStartMs: number,
  onTicked: (remainingSecs: number, rawRemainingMs: number, diff: number) => Promise<void>,
): number => {
  // Tried: 10ms / 20ms / 50ms / 100ms / 200ms / 500ms, seems like all works fine.
  // Confirmed that, even with 50ms, running for 7minutes, and the performance is fine.
  const miniIntervalMs = 50
  let remainingMs: number = countdownSecs * 1000 + delayBeforeStartMs
  let previousRemaining = remainingMs

  let counter: number = countdownSecs
  const timerId = BackgroundTimer.setInterval(() => {
    // queueMicrotask(() => {
    const now = Date.now()
    const diff = now - previous
    previous = now

    remainingMs = remainingMs - diff
    // logger.info(`>>> remainingMs:${remainingMs}; counterMs:${counter * 1000}; diff:${diff}`)
    if (remainingMs <= -1 * 1000) {
      BackgroundTimer.clearInterval(timerId)
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
  return timerId
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

// ### V0 (the old version):
// let _delayTimerId: NodeJS.Timeout
// let _intervalTimerId: NodeJS.Timeout
//function extracted(countdownSecs: number, delay: number, onTicked: (index: number, hint: string) => Promise<void>) {
//   let counter: number = countdownSecs
//   const trigger = (hint: string) => {
//     // console.log('&&&&&&&&&&&&&&&&&& setInterval')
//     onTicked(counter, hint).catch(() => {})
//     if (counter <= 0) {
//       clearInterval(_delayTimerId)
//       clearInterval(_intervalTimerId)
//       return
//     }
//     counter--
//   }
//
//   // const _startedAt = new Date().getTime()
//   // logger.info('==== 1')
//   _delayTimerId = setTimeout(() => {
//     // const _endedAt = new Date().getTime()
//     // logger.info(`==== 2: ${_endedAt - _startedAt}`)
//     trigger('ticked-after-delay')
//     if (counter > 0) {
//       _intervalTimerId = setInterval(() => {
//         trigger('ticket-at-interval')
//       }, 1000)
//     }
//   }, delay)
// }

// ### V0.1 (the old version):
// extracted(4, 29, async (tickedIndex: number, hint: string) => {
//   logger.info(`>>> ${tickedIndex}:${hint}`)
// })
// setTimeout(() => {
//   clearInterval(_delayTimerId)
//   clearInterval(_intervalTimerId)
//   extracted(0, 30, async (tickedIndex: number, hint: string) => {
//     logger.info(`>>> ${tickedIndex}:${hint}`)
//   })
// }, 10)
