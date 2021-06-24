export interface PresetEntity {
  id: string
  name: string
  prepareSecs: number
  workoutSecs: number
  restSecs: number
  repsCount: number
  setsCount: number
  // Means it's the timer that user is currently using
  isActive: boolean
}
