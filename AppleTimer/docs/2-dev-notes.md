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



### Action sheet bottom popup:
https://www.npmjs.com/package/react-native-modalize


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

```
{/*<ActionSheet*/}
{/*  // @ts-ignore*/}
{/*  ref={actionSheetRef}*/}
{/*  // initialOffsetFromBottom={0.6}*/}
{/*  statusBarTranslucent*/}
{/*  bounceOnOpen={true}*/}
{/*  bounciness={4}*/}
{/*  gestureEnabled={true}*/}
{/*  defaultOverlayOpacity={0.7}*/}
{/*  onOpen={() => {}}*/}
{/*  onPositionChanged={() => {}}*/}
{/*  onClose={() => {}}*/}
{/*>*/}
{/*  <ScrollView style={styles.actionsheetOverlay}>*/}
{/*    <Text>YOUR CUSTOM COMPONENT INSIDE THE ACTIONSHEET</Text>*/}
{/*    <PresetList*/}
{/*      presets={cachedPresets}*/}
{/*      onSelectionChanged={preset => {*/}
{/*        navigate(Screens.PresetsManagement, { current: preset })*/}
{/*      }}*/}
{/*    />*/}
{/*  </ScrollView>*/}
{/*</ActionSheet>*/}

{/*<Actionsheet*/}
{/*  isOpen={isActionsheetOpen}*/}
{/*  onClose={() => setIsActionsheetOpen(false)}*/}
{/*  disableOverlay={false}*/}
{/*  shadow={8}*/}
{/*>*/}
{/*  <View style={styles.actionsheetOverlay}>*/}
{/*    <TouchableOpacity style={[Common.button.rounded]} onPress={() => setIsActionsheetOpen(false)}>*/}
{/*      <Text style={Fonts.textRegular}>{'Close'}</Text>*/}
{/*    </TouchableOpacity>*/}
{/*    <PresetList presets={cachedPresets} />*/}
{/*  </View>*/}
{/*  /!*<ActionsheetContent>*!/*/}
{/*  /!*  /!*<ActionsheetHeader>Header</ActionsheetHeader>*!/*!/*/}
{/*  /!*  /!*<ActionsheetItem>Option 1</ActionsheetItem>*!/*!/*/}
{/*  /!*  /!*<ActionsheetItem>Option 2</ActionsheetItem>*!/*!/*/}
{/*  /!*  /!*<ActionsheetItem>Option 3</ActionsheetItem>*!/*!/*/}
{/*  /!*</ActionsheetContent>*!/*/}
{/*  /!*<ActionsheetFooter>*!/*/}
{/*  /!*  <ActionsheetItem onPress={onClose}>Cancel</ActionsheetItem>*!/*/}
{/*  /!*</ActionsheetFooter>*!/*/}
{/*</Actionsheet>*/}
```


+
