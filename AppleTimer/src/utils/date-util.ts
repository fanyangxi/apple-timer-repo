export enum TickingType {
  Started = 'Started',
  Ticked = 'Ticked',
  Finished = 'Finished',
}

export type TickEventHandler = (type: TickingType, secsLeft: number) => void

export const startCountdown = (seconds: number, onTicked: TickEventHandler): void => {
  let counter = seconds
  // console.log('Started: 5')
  onTicked(TickingType.Started, counter)

  const interval = setInterval(() => {
    counter--
    if (counter === 0) {
      clearInterval(interval)
      // console.log('Tick: 0, Ding!')
      onTicked(TickingType.Finished, counter)
      return
    }
    // console.log(`Tick: ${counter}`)
    onTicked(TickingType.Ticked, counter)
  }, 1000)
}
