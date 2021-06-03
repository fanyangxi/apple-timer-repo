export enum TimerPhase {
  Prepare = 'Prepare',
  Workout = 'Workout',
  Rest = 'Rest',
}

//
// //// Timer Section:
// @summary-section:
//   ? change-current-preset-button:
//     ? time-renaming:
//     ? total-time:
//
//       @details-section (Normal state):
// current preset:
// In-timer-phase state (Prepare|Workout|Rest)
// - phase-name
// - time-left-in-phase
//
// @action-section:
// start-workout-button:
//
//