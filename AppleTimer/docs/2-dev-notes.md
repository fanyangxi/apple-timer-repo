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

### Timer(s):
https://www.npmjs.com/package/timer-node
https://github.com/perymimon/Timer/blob/master/src/timer.js


### Action sheet bottom popup:
https://www.npmjs.com/package/react-native-modalize
https://github.com/jeremybarbet/react-native-modalize

These 2 also looks ok:
https://www.npmjs.com/package/react-native-scroll-bottom-sheet
https://www.npmjs.com/package/@gorhom/bottom-sheet


### scroll/wheel picker:
https://www.npmjs.com/package/react-native-dynamically-selected-picker ++++
https://www.npmjs.com/package/react-native-wheel-scroll-picker +++
    > Issue: scroll too fast
https://www.npmjs.com/package/react-native-picker-scrollview
https://www.npmjs.com/package/react-native-segmented-picker ++
https://www.npmjs.com/package/react-native-picker
https://github.com/keiya01/react-simple-wheel-picker (?)

https://www.npmjs.com/package/react-native-wheel-scrollview-picker
    > Issue: the sample doesn't seem to work
https://www.npmjs.com/package/react-native-wheely ++++
    > Looks good
    > Issue: on trigger event when scroll over items,
    > Issue: triggered onChange event multiple times after selection changed
https://www.npmjs.com/package/react-native-segmented-picker
    > Issue: Contains a popup by default
    > Issue: top grey-out and bottom grey-out is not working on android
https://www.npmjs.com/package/@gregfrench/react-native-wheel-picker
    > Issue: it's not very smooth while scrolling
    > Issue: RNCPicker not found, on iOS
https://www.npmjs.com/package/react-native-wheely-simple-picker
    > Issue: scroll speed to fast
https://www.npmjs.com/package/react-native-wheel-picker-android
    > Issue: the ui on android and iOS are very/too different
https://www.npmjs.com/package/react-native-wheel-pick
    > Issue: the ui on android and iOS are very/too different
https://github.com/rdhox/react-native-smooth-picker/blob/master/src/SmoothPicker.tsx (react-native-smooth-picker)


### Enable haptic Feedback on react-native:
react-native-haptic-feedback
https://www.npmjs.com/package/react-native-haptic-feedback
https://stackoverflow.com/questions/43760502/enable-haptic-feedback-on-react-native-touchable-view


### Toast:
https://www.npmjs.com/package/react-native-toast-message


### react-native-keep-awake
https://www.npmjs.com/package/react-native-keep-awake


### react-native-reanimated
https://docs.swmansion.com/react-native-reanimated/docs/tutorials/LayoutAnimations/layoutAnimations


### react-native arc/circular-slider:
https://www.npmjs.com/package/rn-arc-slider
rn-arc-slider/index.tsx at next · arpitBhalla/rn-arc-slider (++++)
\- https://github.com/arpitBhalla/rn-arc-slider/blob/next/src/index.tsx
\- https://github.com/bartgryszko/react-native-circular-slider
The Shapes of React Native (+++)
\- https://codedaily.io/tutorials/The-Shapes-of-React-Native
Paths — SVG 2
\- https://www.w3.org/TR/SVG/paths.html
react-native-svg/react-native-svg: SVG library for React Native, React Native Web, and plain React web projects.
\- https://github.com/react-native-svg/react-native-svg
\- https://www.npmjs.com/package/react-native-svg#path
React native svg arc path - Stack Overflow
\- https://stackoverflow.com/questions/53714250/react-native-svg-arc-path


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


```
<View style={[styles.start]}>
{/*<TouchableOpacity style={[Common.button.rounded]} onPress={() => onResumePressed()}>*/}
{/*  <Text style={Fonts.textRegular}>{'Resume'}</Text>*/}
{/*</TouchableOpacity>*/}
{/*<LinkButton theme={LinkButtonTheme.Normal} text={'PRIMARY'} onPress={onStartPressed} />*/}
{/*<Button onPress={() => onStartPressed()} title={'Start'} />*/}
{/*<AwesomeButton onPress={() => {}}>Text</AwesomeButton>*/}
{/*<AwesomeButtonRick raiseLevel={2} type="secondary" stretch={true}>{'Pause'}</AwesomeButtonRick>*/}
{/*<AwesomeButtonRick raiseLevel={2} type="secondary" stretch={true}>Resume</AwesomeButtonRick>*/}
{/*<AwesomeButtonBlue raiseLevel={2} type="primary">Blue Primary Button</AwesomeButtonBlue>*/}
{/*<AwesomeButtonBlue raiseLevel={2} type="secondary">Blue Secondary Button</AwesomeButtonBlue>*/}
</View>
```

```
  <View style={styles.summaryContent}>
    <View style={styles.totalTimeContainer}>
      <Text style={styles.itemLabel}>Rest:</Text>
      <Text style={[Fonts.textSmall, FontColors.white]}>{'00:15'}</Text>
    </View>
    <View style={styles.totalTimeContainer}>
      <Text style={styles.itemLabel}>Prepare:</Text>
      <Text style={[Fonts.textSmall, FontColors.white]}>{'00:08'}</Text>
    </View>
    <View style={styles.totalTimeContainer}>
      <Text style={styles.itemLabel}>Workout:</Text>
      <Text style={[Fonts.textSmall, FontColors.white]}>{'00:40'}</Text>
    </View>
  </View>
  {/*<Divider style={styles.contentDivider} />*/}
  <View style={styles.summaryContent}>
    <View style={styles.totalTimeContainer}>
      <Text style={styles.itemLabel}>Reps:</Text>
      <Text style={[Fonts.textSmall, FontColors.white]}>{'8'}</Text>
    </View>
    <View style={styles.totalTimeContainer}>
      <Text style={styles.itemLabel}>Sets:</Text>
      <Text style={[Fonts.textSmall, FontColors.white]}>{'1'}</Text>
    </View>
  </View>
```

```
// // phase1RawValue
// // phase1AnimValue
// // phase1AnimTiming
// const phase1AnimTiming = Animated.timing(phase1AnimValue, {
//   toValue: 100,
//   duration: 8000,
//   easing: Easing.linear,
//   // Set this to 'False', to suppress the warning: `Sending "onAnimatedValueUpdate" with no listeners registered.`
//   useNativeDriver: false,
// })
//
// useEffect(() => {
//   phase1AnimTiming.start()
// }, [phase1AnimValue])
```

```
{/* current phase info */}
{/*<Divider style={styles.contentDivider} />*/}
{/*<View style={styles.summaryContent}>*/}
{/*  <View style={styles.itemsContainer}>*/}
{/*    <Text style={styles.itemLabel}>setPrepareSecs:{tickedPreset?.prepareRemainingSecs}</Text>*/}
{/*    <Text style={styles.itemLabel}>repWorkoutSecs:{tickedPreset?.repWorkoutRemainingSecs}</Text>*/}
{/*    <Text style={styles.itemLabel}>repRestSecs:{tickedPreset?.repRestRemainingSecs}</Text>*/}
{/*  </View>*/}
{/*  <View style={styles.itemsContainer}>*/}
{/*    <Text style={styles.itemLabel}>cycleCurrentPhase: {tickedPreset?.cycleCurrentPhase}</Text>*/}
{/*  </View>*/}
{/*</View>*/}
{/*<View style={styles.detailsSection}>*/}
{/*  /!*<Svg height="100" width="100">*!/*/}
{/*  /!*  <Circle cx="50" cy="50" r={23} stroke="blue" strokeWidth="2.5" fill="red" />*!/*/}
{/*  /!*</Svg>*!/*/}
{/*  /!*<Svg width="100" height="100" viewBox="0 0 100 100" style={{ backgroundColor: '#3E3E3E' }}>*!/*/}
{/*  /!*  <Defs>*!/*/}
{/*  /!*    <ClipPath id="my-clip">*!/*/}
{/*  /!*      <Path d="M 50 8 A 1 1 0 0 1 50 92" />*!/*/}
{/*  /!*    </ClipPath>*!/*/}
{/*  /!*  </Defs>*!/*/}
{/*  /!*  <Path clipPath="url(#my-clip)" d="M 50 8 A 1 1 0 0 1 50 92" fill="none" stroke="skyblue" strokeWidth="55" />*!/*/}
{/*  /!*  <Path d="M 50 8 A 1 1 0 0 1 50 92" fill="none" stroke="red" strokeWidth="15" />*!/*/}
{/*  /!*</Svg>*!/*/}
{/*</View>*/}
```

+
