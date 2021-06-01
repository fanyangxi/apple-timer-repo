export interface Preset {
  // Phase:
  prepareSecs: number
  // Phase:
  workoutSecs: number
  // Phase:
  restSecs: number
  // A cycle includes 3 phases: prepare, workout, rest.
  cyclesCount: number
  // A set includes multiple cycles.
  setsCount: number
}

// //// Timer Section:
// @summary-section:
//   ? change-current-preset-button:
//     ? time-renaming:
//     ? total-time:
//
// @details-section (Normal state):
// current preset:
// In-timer-phase state (Prepare|Workout|Rest)
// - phase-name
// - time-left-in-phase
//
