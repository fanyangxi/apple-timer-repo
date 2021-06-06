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
