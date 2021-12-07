import React, { useImperativeHandle, useRef } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Neomorph } from 'react-native-neomorph-shadows'
import { FontColors, Fonts, Spacings } from '@/theme/Variables'
import { Preset, TickedPreset } from '@/models/preset'
import CircleVerticalSlider from '@/screens/components/CircleVerticalSlider'
import { format, toDTime } from '@/utils/date-util'
import CircularSliderV2, { CircularSliderRefObject } from '@/screens/components/CircularSliderV2'
import { getCurrentPhaseRemainingSecs } from '@/utils/preset-util'
import { TimerPhase } from '@/models/timer-phase'

export type WorkoutDetailViewRefObject = {
  startOrResumePreparePhaseAnim: () => void
  startOrResumeWorkoutPhaseAnim: () => void
  startOrResumeRestPhaseAnim: () => void
  startOrResumeCycleAnim: () => void
  pauseAnim: () => void
  resetCycleAnim: () => void
  resetSetAnim: () => void
}

export interface WorkoutDetailViewProps {
  activePreset?: Preset
  tickedPreset?: TickedPreset
}

export const WorkoutDetailView: React.FC<WorkoutDetailViewProps> = React.forwardRef((props, ref) => {
  const { activePreset, tickedPreset } = props
  const prepareSliderRef = useRef<CircularSliderRefObject>()
  const workoutSliderRef = useRef<CircularSliderRefObject>()
  const restSliderRef = useRef<CircularSliderRefObject>()

  useImperativeHandle(ref, () => ({
    startOrResumePreparePhaseAnim() {
      _startOrResumePreparePhaseAnim()
    },
    startOrResumeWorkoutPhaseAnim() {
      _startOrResumeWorkoutPhaseAnim()
    },
    startOrResumeRestPhaseAnim() {
      _startOrResumeRestPhaseAnim()
    },
    startOrResumeCycleAnim() {
      _startOrResumeCycleAnim()
    },
    pauseAnim() {
      _pauseAnim()
    },
    resetCycleAnim() {
      _resetCycleAnim()
    },
    resetSetAnim() {
      _resetSetAnim()
    },
  }))

  const _startOrResumePreparePhaseAnim = () => {
    prepareSliderRef.current?.startOrResumeAnim()
  }

  const _startOrResumeWorkoutPhaseAnim = () => {
    workoutSliderRef.current?.startOrResumeAnim()
  }

  const _startOrResumeRestPhaseAnim = () => {
    restSliderRef.current?.startOrResumeAnim()
  }

  const _startOrResumeCycleAnim = () => {
    console.log(`>>> startOrResumeCycleAnim: ${tickedPreset?.cycleCurrentPhase}`)
    const theMap = {
      [`${TimerPhase.Prepare}`]: _startOrResumePreparePhaseAnim,
      [`${TimerPhase.Workout}`]: _startOrResumeWorkoutPhaseAnim,
      [`${TimerPhase.Rest}`]: _startOrResumeRestPhaseAnim,
    }
    const resultFunc = theMap[`${tickedPreset?.cycleCurrentPhase}`] ?? _startOrResumePreparePhaseAnim
    return resultFunc()
  }

  const _pauseAnim = () => {
    console.log(`>>> pauseAnim: ${tickedPreset?.cycleCurrentPhase}`)
    const theMap = {
      [`${TimerPhase.Prepare}`]: prepareSliderRef.current?.pauseAnim,
      [`${TimerPhase.Workout}`]: workoutSliderRef.current?.pauseAnim,
      [`${TimerPhase.Rest}`]: restSliderRef.current?.pauseAnim,
    }
    const resultFunc = theMap[`${tickedPreset?.cycleCurrentPhase}`] ?? prepareSliderRef.current?.pauseAnim
    return resultFunc && resultFunc()
  }

  const _resetCycleAnim = () => {
    console.log(`>>> resetCycleAnim: ${tickedPreset?.cycleCurrentPhase}`)
    prepareSliderRef.current?.stopAndResetAnim()
    workoutSliderRef.current?.stopAndResetAnim()
    restSliderRef.current?.stopAndResetAnim()
  }

  const _resetSetAnim = () => {
    console.log(`>>> resetSetAnim: ${tickedPreset?.cycleCurrentPhase}`)
    workoutSliderRef.current?.stopAndResetAnim()
    restSliderRef.current?.stopAndResetAnim()
  }

  return (
    <Neomorph
      inner={false} // <- enable shadow inside of neomorph
      swapShadows // <- change zIndex of each shadow color
      style={{
        ...styles.neomorphContainer,
        width: 217,
        height: 217,
      }}
    >
      <View style={styles.detailsSection}>
        <CircularSliderV2
          // @ts-ignore
          ref={workoutSliderRef}
          value={0}
          minValue={0}
          maxValue={100}
          minAngle={0}
          maxAngle={179.9}
          style={styles.absolute}
          thumbRadius={4}
          trackRadius={90}
          trackWidth={36}
          trackColor={'#3C3C3C'}
          trackTintColor={'lightgreen'}
          animationDurationMs={(activePreset?.WorkoutSecs ?? 0) * 1000}
        />
        <CircularSliderV2
          // @ts-ignore
          ref={restSliderRef}
          value={0}
          minValue={0}
          maxValue={100}
          minAngle={180}
          maxAngle={359.9}
          style={styles.absolute}
          thumbRadius={4}
          trackRadius={90}
          trackWidth={36}
          trackColor={'#3C3C3C'}
          trackTintColor={'red'}
          animationDurationMs={(activePreset?.RestSecs ?? 0) * 1000}
        />
        <CircleVerticalSlider
          // @ts-ignore
          ref={prepareSliderRef}
          value={0}
          style={styles.absolute}
          trackRadius={71}
          trackStrokeWidth={0}
          animationDurationMs={(activePreset?.PrepareSecs ?? 0) * 1000}
        />
        <View style={styles.hintContainer}>
          <View style={styles.itemsContainer}>
            <Text style={styles.time}>{format(toDTime(getCurrentPhaseRemainingSecs(tickedPreset)))}</Text>
            <Text style={styles.hint}>{tickedPreset?.cycleCurrentPhase}</Text>
          </View>
        </View>
      </View>
    </Neomorph>
  )
})

const styles = StyleSheet.create({
  phase1: {
    width: 0,
    height: 0,
    borderTopWidth: 60,
    borderTopColor: 'red',
    borderLeftWidth: 60,
    borderLeftColor: 'red',
    borderRightColor: 'transparent',
    borderRightWidth: 60,
    borderBottomColor: 'red',
    borderBottomWidth: 60,
    borderTopLeftRadius: 60,
    borderTopRightRadius: 60,
    borderBottomRightRadius: 60,
    borderBottomLeftRadius: 60,
    transform: [{ rotate: '33deg' }],
  },
  phase2: {
    width: 0,
    height: 0,
    borderTopWidth: 60,
    borderTopColor: 'red',
    borderLeftColor: 'red',
    borderLeftWidth: 60,
    borderRightColor: 'transparent',
    borderRightWidth: 60,
    borderBottomColor: 'red',
    borderBottomWidth: 60,
    borderTopLeftRadius: 60,
    borderTopRightRadius: 60,
    borderBottomRightRadius: 60,
    borderBottomLeftRadius: 60,
  },
  pacman: {
    width: 0,
    height: 0,
    borderTopWidth: 60,
    borderTopColor: 'red',
    borderLeftColor: 'red',
    borderLeftWidth: 60,
    borderRightColor: 'transparent',
    borderRightWidth: 60,
    borderBottomColor: 'red',
    borderBottomWidth: 60,
    borderTopLeftRadius: 60,
    borderTopRightRadius: 60,
    borderBottomRightRadius: 60,
    borderBottomLeftRadius: 60,
  },
  neomorphContainer: {
    // shadowColor: 'red',
    // shadowOffset: { width: 6, height: 6 },
    shadowOpacity: 0.6,
    shadowRadius: 4,
    borderRadius: 108,
    backgroundColor: '#4E4E4E', // 434343, 4E4E4E, 3C3C3C, 3E3E3E
    flexDirection: 'column',
    justifyContent: 'center',
  },
  summaryContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  hint: {
    ...Fonts.textSmall,
    ...FontColors.white,
  },
  time: {
    ...Fonts.textCaption30,
    ...FontColors.white,
  },
  // @details-section:
  detailsSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacings.s_16,
    paddingVertical: Spacings.s_16,
    borderRadius: 2,
    // backgroundColor: '#202021', // '#202021',
  },
  contentDivider: {
    marginVertical: Spacings.s_16,
  },
  hintContainer: {
    // backgroundColor: '#343434', // '#202021',
  },
  itemsContainer: {
    // flex: 1,
    alignItems: 'center',
    color: '#FFFFFF',
    ...Fonts.textLarge,
  },
  absolute: {
    position: 'absolute',
  },
})
// const [preparePhaseRawValue, setPreparePhaseRawValue] = useState<number>(0)
// const preparePhaseRawValueRef = useRef<number>(0)
// preparePhaseAnimValue?.addListener(({ value }) => {
//   const aaa = toDecimal(preparePhaseRawValueRef.current)
//   const bbb = toDecimal(value)
//   if (aaa !== bbb) {
//     // console.log(`>>> prepare-phase-anim: preparePhaseRawValue:${aaa}, value:${bbb}`)
//     preparePhaseRawValueRef.current = bbb
//     setPreparePhaseRawValue(value)
//   }
// })
//
// const [workoutPhaseRawValue, setWorkoutPhaseRawValue] = useState<number>(0)
// const workoutPhaseRawValueRef = useRef<number>(0)
// workoutPhaseAnimValue?.addListener(({ value }) => {
//   const aaa = toDecimal(workoutPhaseRawValueRef.current)
//   const bbb = toDecimal(value)
//   if (aaa !== bbb) {
//     // console.log(`>>> workout-phase-anim: workoutPhaseRawValue:${aaa}, value:${bbb}`)
//     workoutPhaseRawValueRef.current = bbb
//     setWorkoutPhaseRawValue(value)
//   }
// })
//
// const [restPhaseRawValue, setRestPhaseRawValue] = useState<number>(0)
// const restPhaseRawValueRef = useRef<number>(0)
// restPhaseAnimValue?.addListener(({ value }) => {
//   const aaa = toDecimal(restPhaseRawValueRef.current)
//   const bbb = toDecimal(value)
//   if (aaa !== bbb) {
//     // console.log(`>>> rest-phase-anim: restPhaseRawValue:${aaa}, value:${bbb}`)
//     restPhaseRawValueRef.current = bbb
//     setRestPhaseRawValue(value)
//   }
// })
