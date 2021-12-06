import React, { useRef, useState } from 'react'
import { Animated, StyleSheet, Text, View } from 'react-native'
import { Neomorph } from 'react-native-neomorph-shadows'
import { FontColors, Fonts, Spacings } from '@/theme/Variables'
import { TickedPreset } from '@/models/preset'
import CircularSlider from '@/screens/components/CircularSlider'
import CircleVerticalSlider from '@/screens/components/CircleVerticalSlider'
import { format, toDTime } from '@/utils/date-util'
import { TimerPhase } from '@/models/timer-phase'
import { toDecimal } from '@/utils/common-util'

export interface WorkoutDetailViewProps {
  tickedPreset?: TickedPreset
  preparePhaseAnimValue?: Animated.Value
  workoutPhaseAnimValue?: Animated.Value
  restPhaseAnimValue?: Animated.Value
}

export const WorkoutDetailView: React.FC<WorkoutDetailViewProps> = ({
  tickedPreset,
  preparePhaseAnimValue,
  workoutPhaseAnimValue,
  restPhaseAnimValue,
}) => {
  const [preparePhaseRawValue, setPreparePhaseRawValue] = useState<number>(0)
  const preparePhaseRawValueRef = useRef<number>(0)
  preparePhaseAnimValue?.addListener(({ value }) => {
    const aaa = toDecimal(preparePhaseRawValueRef.current)
    const bbb = toDecimal(value)
    if (aaa !== bbb) {
      // console.log(`>>> prepare-phase-anim: preparePhaseRawValue:${aaa}, value:${bbb}`)
      preparePhaseRawValueRef.current = bbb
      setPreparePhaseRawValue(value)
    }
  })

  const [workoutPhaseRawValue, setWorkoutPhaseRawValue] = useState<number>(0)
  const workoutPhaseRawValueRef = useRef<number>(0)
  workoutPhaseAnimValue?.addListener(({ value }) => {
    const aaa = toDecimal(workoutPhaseRawValueRef.current)
    const bbb = toDecimal(value)
    if (aaa !== bbb) {
      // console.log(`>>> workout-phase-anim: workoutPhaseRawValue:${aaa}, value:${bbb}`)
      workoutPhaseRawValueRef.current = bbb
      setWorkoutPhaseRawValue(value)
    }
  })

  const [restPhaseRawValue, setRestPhaseRawValue] = useState<number>(0)
  const restPhaseRawValueRef = useRef<number>(0)
  restPhaseAnimValue?.addListener(({ value }) => {
    const aaa = toDecimal(restPhaseRawValueRef.current)
    const bbb = toDecimal(value)
    if (aaa !== bbb) {
      // console.log(`>>> rest-phase-anim: restPhaseRawValue:${aaa}, value:${bbb}`)
      restPhaseRawValueRef.current = bbb
      setRestPhaseRawValue(value)
    }
  })

  const getCurrentPhaseRemainingSecs = (ticked?: TickedPreset): number => {
    if (!ticked) {
      return 0
    }
    const theMap = {
      [`${TimerPhase.Prepare}`]: ticked.prepareRemainingSecs,
      [`${TimerPhase.Workout}`]: ticked.workoutRemainingSecs,
      [`${TimerPhase.Rest}`]: ticked.restRemainingSecs,
    }
    return theMap[`${ticked.cycleCurrentPhase}`] ?? 0
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
        <CircularSlider
          value={workoutPhaseRawValue}
          minValue={0}
          maxValue={100}
          minAngle={0}
          maxAngle={179.9}
          style={{ position: 'absolute' }}
          thumbRadius={4}
          trackRadius={90}
          trackWidth={36}
          trackColor={'#3C3C3C'}
          trackTintColor={'lightgreen'}
        />
        <CircularSlider
          value={restPhaseRawValue}
          minValue={0}
          maxValue={100}
          minAngle={180}
          maxAngle={359.9}
          style={{ position: 'absolute' }}
          thumbRadius={4}
          trackRadius={90}
          trackWidth={36}
          trackColor={'#3C3C3C'}
          trackTintColor={'red'}
        />
        <CircleVerticalSlider
          style={{ position: 'absolute' }}
          trackRadius={71}
          value={preparePhaseRawValue}
          trackStrokeWidth={0}
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
}

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
})
