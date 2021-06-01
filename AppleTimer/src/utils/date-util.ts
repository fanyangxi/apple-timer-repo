export enum TickingType {
  Started = 'Started',
  Ticked = 'Ticked',
  Finished = 'Finished',
}

export const startCountdown = async (
  seconds: number,
  onTicked: (type: TickingType, secsLeft: number) => void,
): Promise<void> => {
  return new Promise(resolve => {
    // copy the input, to avoid modify the param directly
    let counter = seconds
    // console.log('Started: 5')
    onTicked(TickingType.Started, counter)

    const interval = setInterval(() => {
      counter--
      if (counter === 0) {
        clearInterval(interval)
        // console.log('Tick: 0, Ding!')
        onTicked(TickingType.Finished, counter)
        // >> Finished:
        resolve()
      } else {
        // console.log(`Tick: ${counter}`)
        onTicked(TickingType.Ticked, counter)
      }
    }, 1000)
  })
}
