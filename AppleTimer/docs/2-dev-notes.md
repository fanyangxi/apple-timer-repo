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
  // In Current-Set: setCyclesRemainingCount
  public SetCyclesRemainingCount: number
  public SetCurrentPhase: TimerPhase | undefined
  public SetPrepareRemainingSecs: number
  // In Current-Cycle:
  public CycleWorkoutRemainingSecs: number
  public CycleRestRemainingSecs: number

  constructor(
    setsRemainingCount: number,
    setCyclesRemainingCount: number,
    setCurrentPhase: TimerPhase | undefined,
    setPrepareRemainingSecs: number,
    cycleWorkoutRemainingSecs: number,
    cycleRestRemainingSecs: number,
  ) {
    this.SetsRemainingCount = setsRemainingCount
    this.SetCyclesRemainingCount = setCyclesRemainingCount
    this.SetCurrentPhase = setCurrentPhase
    this.SetPrepareRemainingSecs = setPrepareRemainingSecs
    this.CycleWorkoutRemainingSecs = cycleWorkoutRemainingSecs
    this.CycleRestRemainingSecs = cycleRestRemainingSecs
  }
}
```
+
