export enum TickingType {
  Started = 'Started',
  Ticked = 'Ticked',
  Finished = 'Finished',
}

let isPaused: boolean = false
let currentIntervalInstance: NodeJS.Timeout

const startCountdown = async (
  seconds: number,
  onTicked?: (type: TickingType, secsLeft: number) => void,
): Promise<void> => {
  return new Promise(resolve => {
    // copy the input, to avoid modify the param directly
    let counter = seconds
    // console.log('Started: 5')
    onTicked && onTicked(TickingType.Started, counter)

    currentIntervalInstance = setInterval(() => {
      console.log(`isPaused: ${isPaused}`)
      if (!isPaused) {
        counter--
        if (counter === 0) {
          clearInterval(currentIntervalInstance)
          // console.log('Tick: 0, Ding!')
          onTicked && onTicked(TickingType.Finished, counter)
          // >> Finished:
          resolve()
        } else {
          // console.log(`Tick: ${counter}`)
          onTicked && onTicked(TickingType.Ticked, counter)
        }
      }
    }, 1000)
  })
}

const togglePause = () => {
  console.log(`before: ${isPaused}`)
  isPaused = !isPaused
  console.log(`after: ${isPaused}`)
}

const stop = () => {
  if (currentIntervalInstance) {
    clearInterval(currentIntervalInstance)
  }
}

export const CountdownTimer = {
  startCountdown,
  togglePause,
  stop,
}
