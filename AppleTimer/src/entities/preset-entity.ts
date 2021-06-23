export interface PresetEntity {
  id: string
  name: string
  setsCount: number
  repsCount: number
  prepareSecs: number
  workoutSecs: number
  restSecs: number
  // Means it's the timer that user is currently using
  isActive: boolean
}
