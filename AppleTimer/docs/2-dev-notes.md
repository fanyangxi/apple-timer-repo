### TODOs:
- N/A (**Placeholder**)
- UI refinement, fancy UI
- Add "AsyncStorage", and its util
- Add "Create Preset Dialog"
- Add "Switch Preset Dialog/Dropdown"
- Add "About/Info Screen"
- Add "Google Ads"
- Workout terms, PRs, Sets, Reps, ...
- Fix issue: when pause by closely enough to the second, it will not display on screen, e.g.: 4s, 2s,





```
export class TickedPreset {
  // In Preset:
  public SetsRemainingCount: number
  // In Current-Set: setRepsRemainingCount
  public setRepsRemainingCount: number
  public SetCurrentPhase: TimerPhase | undefined
  public SetPrepareRemainingSecs: number
  // In Current-Rep:
  public RepWorkoutRemainingSecs: number
  public RepRestRemainingSecs: number

  constructor(
    setsRemainingCount: number,
    setRepsRemainingCount: number,
    setCurrentPhase: TimerPhase | undefined,
    setPrepareRemainingSecs: number,
    repWorkoutRemainingSecs: number,
    repRestRemainingSecs: number,
  ) {
    this.SetsRemainingCount = setsRemainingCount
    this.SetRepsRemainingCount = setRepsRemainingCount
    this.SetCurrentPhase = setCurrentPhase
    this.SetPrepareRemainingSecs = setPrepareRemainingSecs
    this.RepWorkoutRemainingSecs = repWorkoutRemainingSecs
    this.RepRestRemainingSecs = repRestRemainingSecs
  }
}
```
+
