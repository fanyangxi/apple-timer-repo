import React, { ReactElement, useState } from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { useTheme } from '@/theme'
import { FontColors, Fonts, Radiuses, Spacings } from '@/theme/Variables'
import SvgComponent from '@/components/DarkAnd'
import { LinkButton, LinkButtonTheme } from '@/components/button/LinkButton'
import { Button, Divider } from 'native-base'
import timerService from '@/services/timer-service'
import { Preset, TickedPreset } from '@/models/preset'
import { TimerPhase } from '@/models/timer-phase'
import { TickingType } from '@/services/countdown-timer'

export const HomeScreen: React.FC<{}> = (): ReactElement => {
  const [currentTimerPhase, setCurrentTimerPhase] = useState<TimerPhase>()
  const [secsLeftInCurrentPhase, setSecsLeftInCurrentPhase] = useState<number>()
  const [prepareRemainingSecs, setPrepareRemainingSecs] = useState<number>()
  const [workoutRemainingSecs, setWorkoutRemainingSecs] = useState<number>()
  const [restRemainingSecs, setRestRemainingSecs] = useState<number>()
  const [cyclesRemainingCount, setCyclesRemainingCount] = useState<number>()
  const [setsRemainingCount, setSetsRemainingCount] = useState<number>()
  const [isRunning, setIsRunning] = useState<boolean>()
  const [isPaused, setIsPaused] = useState<boolean>()

  const { Common } = useTheme()
  const preset: Preset = {
    prepareSecs: 7,
    workoutSecs: 6,
    restSecs: 2,
    cyclesCount: 3,
    setsCount: 2,
  }

  // useEffect(() => {}, [])
  const onStartPressed = async () => {
    await timerService.runPreset(
      preset,
      () => {
        setIsRunning(true)
      },
      (
        currentSet: number,
        currentCycle: number,
        currentPhase: TimerPhase,
        type: TickingType,
        secsLeft: number,
        tickedPreset: TickedPreset,
      ) => {
        setCurrentTimerPhase(currentPhase)
        setSecsLeftInCurrentPhase(secsLeft)
        setPrepareRemainingSecs(tickedPreset.prepareRemainingSecs)
        setWorkoutRemainingSecs(tickedPreset.workoutRemainingSecs)
        setRestRemainingSecs(tickedPreset.restRemainingSecs)
        setCyclesRemainingCount(tickedPreset.cyclesRemainingCount)
        setSetsRemainingCount(tickedPreset.setsRemainingCount)
        console.log(
          `[Set:${currentSet}/Cycle:${currentCycle}]: ${currentPhase},${type},${secsLeft},${JSON.stringify(
            tickedPreset,
          )}`,
        )
      },
      () => {
        setIsRunning(false)
      },
    )
  }

  const onPausedPressed = () => {
    setIsPaused(true)
    timerService.pause()
  }

  const onResumePressed = async () => {
    setIsPaused(false)
    await timerService.resume()
  }

  const onStopPressed = () => {
    timerService.stop()
  }

  return (
    <React.Fragment>
      <SvgComponent style={styles.background} />
      <View style={styles.rootContainer}>
        {/* @summary-section: */}
        <View style={styles.summarySection}>
          <View style={styles.title}>
            {/*<TouchableOpacity style={[Common.button.rounded]} onPress={() => {}}>*/}
            {/*  <Text style={Fonts.textRegular}>{'Change-Preset'}</Text>*/}
            {/*</TouchableOpacity>*/}
            <LinkButton theme={LinkButtonTheme.Normal} text={'Change-Preset'} textColor={'white'} onPress={() => {}} />
          </View>
          <Divider style={styles.summaryDivider} />
          <View style={styles.summaryContent}>
            <View style={styles.timeRemainingContainer}>
              <Text style={styles.itemValue}>{'07:20'}</Text>
              <Text style={styles.itemLabel}>Time remaining</Text>
            </View>
            <View style={styles.totalTimeContainer}>
              <Text style={styles.itemValue}>{'07:20'}</Text>
              <Text style={styles.itemLabel}>Total time</Text>
            </View>
          </View>
        </View>

        {/* @details-section: */}
        <View style={styles.detailsSection}>
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
          <Divider style={styles.contentDivider} />
          <View style={styles.summaryContent}>
            <View style={styles.totalTimeContainer}>
              <Text style={styles.itemLabel}>Cycles:</Text>
              <Text style={[Fonts.textSmall, FontColors.white]}>{'8'}</Text>
            </View>
            <View style={styles.totalTimeContainer}>
              <Text style={styles.itemLabel}>Sets:</Text>
              <Text style={[Fonts.textSmall, FontColors.white]}>{'1'}</Text>
            </View>
          </View>
          {/* current phase info */}
          <Divider style={styles.contentDivider} />
          <View style={styles.summaryContent}>
            <View style={styles.totalTimeContainer}>
              <Text style={styles.itemLabel}>Current Phase: {currentTimerPhase}</Text>
              <Text style={[Fonts.textSmall, FontColors.white]}>{secsLeftInCurrentPhase}</Text>
            </View>
          </View>
        </View>

        {/* @action-section: */}
        <View style={styles.actionSection}>
          {isRunning ? (
            <React.Fragment>
              {isPaused ? (
                <View style={[styles.start]}>
                  <TouchableOpacity style={[Common.button.rounded]} onPress={() => onResumePressed()}>
                    <Text style={Fonts.textRegular}>{'Resume'}</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={[styles.start]}>
                  <TouchableOpacity style={[Common.button.rounded]} onPress={() => onPausedPressed()}>
                    <Text style={Fonts.textRegular}>{'Pause'}</Text>
                  </TouchableOpacity>
                </View>
              )}
              <View style={styles.stop}>
                <TouchableOpacity style={[Common.button.rounded]} onPress={() => onStopPressed()}>
                  <Text style={Fonts.textRegular}>{'Stop'}</Text>
                </TouchableOpacity>
              </View>
            </React.Fragment>
          ) : (
            <Button onPress={() => onStartPressed()}>PRIMARY</Button>
          )}
        </View>
      </View>
    </React.Fragment>
  )
}

const styles = StyleSheet.create({
  rootContainer: {
    flexDirection: 'column',
    flex: 1,
    // backgroundColor: 'lightgrey',
    justifyContent: 'space-around',
    paddingHorizontal: Spacings.s_8,
    paddingVertical: Spacings.s_16,
  },
  // @summary-section:
  summarySection: {
    flexDirection: 'column',
    paddingHorizontal: Spacings.s_8,
    paddingVertical: Spacings.s_8,
    // alignItems: 'center',
    // justifyContent: 'center',
    backgroundColor: '#202021', // '#202021',
    borderRadius: Radiuses.r4,
  },
  summaryContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  title: {
    alignItems: 'center',
    paddingBottom: Spacings.s_4,
  },
  summaryDivider: {
    marginTop: Spacings.s_4,
    marginBottom: Spacings.s_12,
  },
  timeRemainingContainer: {
    alignItems: 'center',
  },
  totalTimeContainer: {
    alignItems: 'center',
    color: '#FFFFFF',
    ...Fonts.textLarge,
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
    flexDirection: 'column',
    paddingHorizontal: Spacings.s_8,
    paddingVertical: Spacings.s_4,
    borderRadius: 2,
    backgroundColor: '#202021', // '#202021',
  },
  contentDivider: {
    marginVertical: Spacings.s_16,
  },
  // @action-section:
  actionSection: {
    flexDirection: 'row',
    paddingHorizontal: Spacings.s_40,
    paddingVertical: Spacings.s_4,
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'lightgreen', // '#202021',
    borderRadius: 2,
  },
  start: {},
  pause: {},
  stop: {},
  background: {
    backgroundColor: 'lightgreen', // '#202021',
    position: 'absolute',
  },
})
