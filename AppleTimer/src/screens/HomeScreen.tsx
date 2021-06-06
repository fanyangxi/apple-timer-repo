import React, { ReactElement, useEffect, useRef, useState } from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { useTheme } from '@/theme'
import { FontColors, Fonts, Radiuses, Spacings } from '@/theme/Variables'
import SvgComponent from '@/components/DarkAnd'
import { LinkButton, LinkButtonTheme } from '@/components/button/LinkButton'
import { Button, Divider } from 'native-base'
import { Preset, TickedPreset } from '@/models/preset'
import { TickingType } from '@/services/countdown-timer'
import { TimerService } from '@/services/timer-service'
import { NotificationService, Sounds } from '@/services/notification-service'
import { logger } from '@/utils/logger'

export const HomeScreen: React.FC<{}> = (): ReactElement => {
  const [secsLeftInCurrentPhase, setSecsLeftInCurrentPhase] = useState<number>()
  const [stateTickedPreset, setStateTickedPreset] = useState<TickedPreset>()
  const [isRunning, setIsRunning] = useState<boolean>()
  const [isPaused, setIsPaused] = useState<boolean>()
  const timerServiceRef = useRef<TimerService>()
  const notificationServiceRef = useRef<NotificationService>()

  const { Common } = useTheme()
  const preset: Preset = new Preset(5, 5, 5, 2, 2)

  useEffect(() => {
    notificationServiceRef.current = new NotificationService()

    timerServiceRef.current = new TimerService(preset)
    //
    timerServiceRef.current.OnTimerStarted = async () => {
      setIsRunning(true)
    }
    timerServiceRef.current.OnTicked = async (
      currentSet: number,
      currentCycle: number,
      type: TickingType,
      secsLeft: number,
      tickedPreset: TickedPreset,
    ) => {
      // logger.info(
      //   `[(${secsLeft} secs)|${moment(Date.now()).format(FULL_TIMESTAMP)}] S${currentSet}C${currentCycle},` +
      //     `${tickedPreset.setCurrentPhase},${type},${JSON.stringify(tickedPreset)}`,
      // )
      // await Sleep(5000)
      setSecsLeftInCurrentPhase(secsLeft)
      setStateTickedPreset(tickedPreset)
    }
    timerServiceRef.current.OnTimerCompleted = async () => {
      setIsRunning(false)
      notificationServiceRef.current?.playSounds([Sounds.TimerCompleted])
    }
    //
    timerServiceRef.current.OnPaused = async (milliSecsLeft: number) => {
      notificationServiceRef.current?.playSounds([Sounds.TimerPaused])
    }
    timerServiceRef.current.OnResumed = async (milliSecsLeft: number) => {
      notificationServiceRef.current?.playSounds([Sounds.TimerResumed])
      // notificationServiceRef.current?.playSounds([Sounds._3_secs_countdown, Sounds._start, Sounds._bell])
    }
    timerServiceRef.current.OnStopped = async (milliSecsLeft: number) => {
      notificationServiceRef.current?.playSounds([Sounds.TimerStopped])
    }
    //
    timerServiceRef.current.OnPreparePhaseIsClosing = async () => {
      notificationServiceRef.current?.playSounds([Sounds.ThreeTwoOne, Sounds.Workout])
    }
    timerServiceRef.current.OnWorkoutPhaseIsClosing = async () => {
      notificationServiceRef.current?.playSounds([Sounds.ThreeTwoOne, Sounds.Rest])
    }
    timerServiceRef.current.OnRestPhaseIsClosing = async () => {
      notificationServiceRef.current?.playSounds([Sounds.ThreeTwoOne, Sounds.Workout])
    }

    // only called once after first render
    logger.info('>>> HOME-SCREEN LOADED ======================>!')
    // eslint-disable-next-line
  }, [])

  const onStartPressed = async () => {
    timerServiceRef.current && (await timerServiceRef.current.runPreset())
  }

  const onPausedPressed = () => {
    setIsPaused(true)
    timerServiceRef.current && timerServiceRef.current.pause()
  }

  const onResumePressed = async () => {
    setIsPaused(false)
    timerServiceRef.current && (await timerServiceRef.current.resume())
  }

  const onStopPressed = () => {
    timerServiceRef.current && timerServiceRef.current.stop()
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
            <View style={styles.itemsContainer}>
              <Text style={styles.itemLabel}>setsRemainingCount:{stateTickedPreset?.setsRemainingCount}</Text>
              <Text style={styles.itemLabel}>setCyclesRemainingCount:{stateTickedPreset?.setCyclesRemainingCount}</Text>
              <Text style={styles.itemLabel}>setPrepareSecs:{stateTickedPreset?.setPrepareRemainingSecs}</Text>
              <Text style={styles.itemLabel}>cycleWorkoutSecs:{stateTickedPreset?.cycleWorkoutRemainingSecs}</Text>
              <Text style={styles.itemLabel}>cycleRestSecs:{stateTickedPreset?.cycleRestRemainingSecs}</Text>
            </View>
            <View style={styles.itemsContainer}>
              <Text style={styles.itemLabel}>Total: {secsLeftInCurrentPhase}</Text>
              <Text style={styles.itemLabel}>setCurrentPhase: {stateTickedPreset?.setCurrentPhase}</Text>
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
  itemsContainer: {
    flex: 1,
    alignItems: 'flex-start',
    color: '#FFFFFF',
    ...Fonts.textLarge,
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
