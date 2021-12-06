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

export const hashCode = (input: string): number => {
  let hash = 0
  let i
  let chr
  if (input.length === 0) {
    return hash
  }
  for (i = 0; i < input.length; i++) {
    chr = input.charCodeAt(i)
    // eslint-disable-next-line no-bitwise
    hash = (hash << 5) - hash + chr
    // eslint-disable-next-line no-bitwise
    hash |= 0 // Convert to 32bit integer
  }
  return hash
}

export const toDecimal = (input: number) => {
  return Math.round(input * 100) / 100
}
