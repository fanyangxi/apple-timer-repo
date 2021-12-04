import React, { useEffect, useRef, useState } from 'react'
import { Animated, Easing, StyleSheet, Text, View } from 'react-native'
import { Neomorph } from 'react-native-neomorph-shadows'
import { DeviceScreen } from '@/common/device'
import { FontColors, Fonts, RadiusSizes, Spacings } from '@/theme/Variables'
import { TickedPreset } from '@/models/preset'
import CircularSlider from '@/screens/components/CircularSlider'
import CircleVerticalSlider from '@/screens/components/CircleVerticalSlider'

export interface WorkoutDetailViewProps {
  tickedPreset?: TickedPreset
  workoutPhaseAnimValue?: Animated.Value
  restPhaseAnimValue?: Animated.Value
}

export const WorkoutDetailView: React.FC<WorkoutDetailViewProps> = ({
  tickedPreset,
  workoutPhaseAnimValue,
  restPhaseAnimValue,
}) => {
  const [workoutPhaseRawValue, setWorkoutPhaseRawValue] = useState<number>(0)
  // const phase1AnimValue = useRef(new Animated.Value(0)).current
  workoutPhaseAnimValue?.addListener(({ value }) => {
    setWorkoutPhaseRawValue(value)
  })

  const [restPhaseRawValue, setRestPhaseRawValue] = useState<number>(0)
  restPhaseAnimValue?.addListener(({ value }) => {
    setRestPhaseRawValue(value)
  })

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

  return (
    <Neomorph
      inner={false} // <- enable shadow inside of neomorph
      swapShadows // <- change zIndex of each shadow color
      style={{
        ...styles.neomorphContainer,
        width: DeviceScreen.width - Spacings.s_48,
        height: 245,
      }}
    >
      {/* current phase info */}
      {/*<Divider style={styles.contentDivider} />*/}
      {/*<View style={styles.summaryContent}>*/}
      {/*  <View style={styles.itemsContainer}>*/}
      {/*    <Text style={styles.itemLabel}>setPrepareSecs:{tickedPreset?.setPrepareRemainingSecs}</Text>*/}
      {/*    <Text style={styles.itemLabel}>repWorkoutSecs:{tickedPreset?.repWorkoutRemainingSecs}</Text>*/}
      {/*    <Text style={styles.itemLabel}>repRestSecs:{tickedPreset?.repRestRemainingSecs}</Text>*/}
      {/*  </View>*/}
      {/*  <View style={styles.itemsContainer}>*/}
      {/*    <Text style={styles.itemLabel}>setCurrentPhase: {tickedPreset?.setCurrentPhase}</Text>*/}
      {/*  </View>*/}
      {/*</View>*/}
      {/*<View style={styles.detailsSection}>*/}
      {/*  /!*<Text style={styles.itemLabel}>setCurrentPhase: {tickedPreset?.setCurrentPhase}</Text>*!/*/}
      {/*  /!*<View style={styles.phase1} />*!/*/}
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
        <CircleVerticalSlider style={{ position: 'absolute' }} trackRadius={71} value={0} trackStrokeWidth={0} />
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
    shadowOpacity: 0.2,
    shadowRadius: 4,
    borderRadius: RadiusSizes.r8,
    backgroundColor: '#4E4E4E', // 434343, 4E4E4E, 3C3C3C, 3E3E3E
    flexDirection: 'column',
    justifyContent: 'center',
  },
  summaryContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  itemLabel: {
    ...Fonts.textSmall,
    ...FontColors.white,
  },
  itemValue: {
    ...Fonts.textCaption30,
    ...FontColors.white,
  },
  // @details-section:
  detailsSection: {
    flex: 1,
    flexDirection: 'column',
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
  itemsContainer: {
    flex: 1,
    alignItems: 'flex-start',
    color: '#FFFFFF',
    ...Fonts.textLarge,
  },
})
