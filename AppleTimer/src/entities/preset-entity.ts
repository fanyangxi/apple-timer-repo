// PRESETS TABLE, each single row will be a preset-entity.

export interface PresetEntity {
  id: string
  name: string
  //
  prepareSecs: number
  workoutSecs: number
  restSecs: number
  //
  setsCount: number
  cyclesCount: number
  // Means it's the timer that user is currently using
  isActive: boolean
}
