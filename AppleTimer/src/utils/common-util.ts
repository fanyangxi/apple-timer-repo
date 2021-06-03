export const Sleep = (dely: number): Promise<void> => {
  return new Promise<void>(resolve => setTimeout(() => resolve(), dely))
}

export const PositiveOr0 = (input: number): number => {
  return input > 0 ? input : 0
}
