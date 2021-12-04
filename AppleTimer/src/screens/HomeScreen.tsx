import React, { ReactElement, useEffect, useRef, useState } from 'react'
import { Animated, Easing, Image, StatusBar, StyleSheet, Text, View } from 'react-native'
import { Colors, FontColors, Fonts, RadiusSizes, Spacings } from '@/theme/Variables'
import { LinkButton, LinkButtonTheme } from '@/components/button/LinkButton'
import { Preset, TickedPreset } from '@/models/preset'
import { TickingType, TimerStatus } from '@/services/countdown-timer'
import { TimerService } from '@/services/timer-service'
import { NotificationService, Sounds } from '@/services/notification-service'
import { logger } from '@/utils/logger'
import ScreenContainer from '@/components/ScreenContainer'
import { NavigationBar } from '@/components/NavigationBar'
import { assets } from '@/assets'
import { useNavigation } from '@react-navigation/native'
import { Screens } from '@/common/constants'
import { DeviceScreen } from '@/common/device'
import { Neomorph } from 'react-native-neomorph-shadows'
import { PresetSelectionPopup } from '@/screens/components/PresetSelectionPopup'
import { Modalize } from 'react-native-modalize'
import { DataService } from '@/services/data-service'
import { SvgButton } from '@/components/button/SvgButton'
import SvgSettings from '@/assets/icons/Settings'
import { getRawTickedPreset, getTotalPresetDurationSecs } from '@/utils/preset-util'
import AwesomeButtonMy from '@/components/button/AwesomeButtonMy'
import { format, toDTime } from '@/utils/date-util'
import { WorkoutDetailView } from '@/screens/components/WorkoutDetailView'
import { useAnimatedTimingValueEffect } from '@/common/use-animated-timing-value-effect'

export const HomeScreen: React.FC<{}> = (): ReactElement => {
  const [secsLeftInCurrentWorkout, setSecsLeftInCurrentWorkout] = useState<number>()
  const [activePreset, setActivePreset] = useState<Preset>()
  const [tickedPreset, setTickedPreset] = useState<TickedPreset>()
  const [timerStatus, setTimerStatus] = useState<TimerStatus | undefined>()

  const timerServiceRef = useRef<TimerService>()
  const notificationServiceRef = useRef<NotificationService>()
  const { navigate } = useNavigation()
  const modalizeRef = useRef<Modalize>(null)

  const {
    startOrResume: startOrResume1,
    pause: pause1,
    stop: stop1,
    animValue: animValue1,
  } = useAnimatedTimingValueEffect({
    from: 0,
    to: 100,
    durationMs: (activePreset?.WorkoutSecs ?? 0) * 1000,
    onFinished: () => {
      startOrResume2()
    },
  })

  const {
    startOrResume: startOrResume2,
    pause: pause2,
    stop: stop2,
    animValue: animValue2,
  } = useAnimatedTimingValueEffect({
    from: 0,
    to: 100,
    durationMs: (activePreset?.RestSecs ?? 0) * 1000,
    onFinished: () => {},
  })

  // const [workoutPhaseAnimValue] = useState(new Animated.Value(0))
  // let workoutPhaseAnimTiming = Animated.timing(workoutPhaseAnimValue, {
  //   toValue: 100,
  //   duration: 8000,
  //   easing: Easing.linear,
  //   // Set this to 'False', to suppress the warning: `Sending "onAnimatedValueUpdate" with no listeners registered.`
  //   useNativeDriver: false,
  // })

  // workoutPhaseAnimValue?.addListener(({ value }) => {
  //   // console.log(`>>> value: ${value}`)
  // })

  useEffect(() => {
    notificationServiceRef.current = new NotificationService()
    DataService.getActivePreset().then(cachedPreset => {
      init(cachedPreset)
    })
    // only called once after first render
    logger.info('>>> HOME-SCREEN LOADED ======================>!')
    // eslint-disable-next-line
  }, [])

  const init = (preset: Preset) => {
    console.log('Active-preset:', preset)
    setActivePreset(preset)
    setTickedPreset(getRawTickedPreset(preset))
    setSecsLeftInCurrentWorkout(getTotalPresetDurationSecs(preset))
    timerServiceRef.current = initTimerServiceRef(preset)
  }

  const initTimerServiceRef = (thePreset: Preset): TimerService => {
    const timerSvc = new TimerService(thePreset)
    //
    timerSvc.OnStatusChanged = async (oldStatus: TimerStatus, newStatus: TimerStatus) => {
      setTimerStatus(newStatus)
    }
    timerSvc.OnTicked = async (
      currentSet: number,
      currentRep: number,
      type: TickingType,
      secsLeft: number,
      tickedPreset: TickedPreset,
    ) => {
      // logger.info(
      //   `[(${secsLeft} secs)|${moment(Date.now()).format(FULL_TIMESTAMP)}] S${currentSet}C${currentRep},` +
      //     `${tickedPreset.setCurrentPhase},${type},${JSON.stringify(tickedPreset)}`,
      // )
      // await Sleep(5000)
      setTickedPreset(tickedPreset)
      setSecsLeftInCurrentWorkout(secsLeft)
    }
    //
    timerSvc.OnTimerStarted = async () => {}
    timerSvc.OnPaused = async () => {
      notificationServiceRef.current?.playSounds([Sounds.TimerPaused])
    }
    timerSvc.OnResumed = async () => {
      notificationServiceRef.current?.playSounds([Sounds.TimerResumed])
      // notificationServiceRef.current?.playSounds([Sounds._3_secs_countdown, Sounds._start, Sounds._bell])
    }
    timerSvc.OnTimerStopped = async () => {
      stop1()
      stop2()
      setTickedPreset(getRawTickedPreset(thePreset))
      setSecsLeftInCurrentWorkout(getTotalPresetDurationSecs(thePreset))
      notificationServiceRef.current?.playSounds([Sounds.TimerCompleted])
      // notificationServiceRef.current?.playSounds([Sounds.TimerStopped])
    }
    //
    timerSvc.OnSetStarted = async () => {}
    timerSvc.OnPreparePhaseIsClosing = async (setRepsRemainingCount: number) => {
      notificationServiceRef.current?.playSounds([
        Sounds.ThreeTwoOne,
        `num_${setRepsRemainingCount}.mp3`,
        Sounds.RepetitionsToGo,
        Sounds.Workout,
      ])
    }
    timerSvc.OnRepetitionStarted = async (repetitionIndex: number) => {
      stop1()
      stop2()
      startOrResume1()
    }
    timerSvc.OnWorkoutPhaseIsClosing = async () => {
      notificationServiceRef.current?.playSounds([Sounds.ThreeTwoOne, Sounds.Rest])
    }
    timerSvc.OnRestPhaseIsClosing = async (setRepsRemainingCount: number) => {
      notificationServiceRef.current?.playSounds([
        Sounds.ThreeTwoOne,
        `num_${setRepsRemainingCount}.mp3`,
        Sounds.RepetitionsToGo,
        Sounds.Workout,
      ])
    }
    return timerSvc
  }

  const onStartPressed = async () => {
    startOrResume1()
    await timerServiceRef.current?.runPreset()
  }

  const onPausedPressed = () => {
    pause1()
    // workoutPhaseAnimValue.stopAnimation(value => {
    //   console.log(`>>> stopAnimation:${value}`)
    // })
    timerServiceRef.current?.pause()
  }

  const onResumePressed = async () => {
    startOrResume1()
    await timerServiceRef.current?.resume()
  }

  const onStopPressed = async () => {
    stop1()
    stop2()
    timerServiceRef.current?.stop()
    notificationServiceRef.current?.stopSounds()
  }

  return (
    <ScreenContainer
      backgroundComponent={() => (
        <Image source={assets.images.darkBackground} style={{ flex: 1, width: undefined, height: undefined }} />
      )}
      // style={{ backgroundColor: '#434343' }}
      topInsetBackgroundColor={Colors.mineShaft}
      bottomInsetBackgroundColor={Colors.transparent}
    >
      <StatusBar barStyle={'light-content'} backgroundColor={Colors.transparent} />
      <NavigationBar
        title={'Apple Timer'}
        showBackButton={false}
        right={<SvgButton icon={<SvgSettings color={Colors.white} />} onPress={() => navigate(Screens.Settings)} />}
      />

      {/* @summary-section: */}
      <View style={styles.rootContainer}>
        <View style={styles.row}>
          <Neomorph
            inner={false} // <- enable shadow inside of neomorph
            swapShadows // <- change zIndex of each shadow color
            style={{
              ...styles.neomorphContainer,
              width: DeviceScreen.width - Spacings.s_48,
              height: 116,
            }}
          >
            <View style={styles.summarySection}>
              <View style={styles.title}>
                {/*<TouchableOpacity style={[Common.button.rounded]} onPress={() => {}}>*/}
                {/*  <Text style={Fonts.textRegular}>{'Change-Preset'}</Text>*/}
                {/*</TouchableOpacity>*/}
                <LinkButton
                  theme={LinkButtonTheme.Normal}
                  text={`Change-Preset: ${activePreset?.Name}`}
                  textColor={'white'}
                  onPress={() => {
                    // setIsActionsheetOpen(true)
                    // @ts-ignore
                    // actionSheetRef.current?.show()
                    modalizeRef.current.open()
                  }}
                />
              </View>
              {/*<Divider style={styles.summaryDivider} />*/}
              <View style={styles.summaryContent}>
                <View style={styles.timeRemainingContainer}>
                  <Text style={styles.itemValue}>{`${format(toDTime(secsLeftInCurrentWorkout ?? 0))}`}</Text>
                  <Text style={styles.itemLabel}>{`Time remaining (${secsLeftInCurrentWorkout})`}</Text>
                </View>
                <View style={styles.totalTimeContainer}>
                  <Text style={styles.itemValue}>{format(toDTime(getTotalPresetDurationSecs(activePreset)))}</Text>
                  <Text style={styles.itemLabel}>Total time</Text>
                </View>
              </View>
            </View>
          </Neomorph>
        </View>

        {/* @details-section: */}
        <View style={styles.row}>
          <WorkoutDetailView
            tickedPreset={tickedPreset}
            workoutPhaseAnimValue={animValue1}
            restPhaseAnimValue={animValue2}
          />
        </View>

        <View style={styles.row}>
          <Neomorph
            inner={false}
            swapShadows
            style={{
              ...styles.neomorphContainer,
              width: DeviceScreen.width - Spacings.s_48,
              height: 88,
            }}
          >
            <View style={styles.summarySection}>
              <View style={styles.summaryContent}>
                <View style={styles.timeRemainingContainer}>
                  <Text style={styles.itemValue}>{tickedPreset?.setsRemainingCount}</Text>
                  <Text style={styles.itemLabel}>{'Sets left'}</Text>
                </View>
                <View style={styles.totalTimeContainer}>
                  <Text style={styles.itemValue}>{tickedPreset?.setRepsRemainingCount}</Text>
                  <Text style={styles.itemLabel}>{'Repetitions left'}</Text>
                </View>
              </View>
            </View>
          </Neomorph>
        </View>

        {/* @action-section: */}
        <View style={styles.actionSection}>
          {(!timerStatus || timerStatus === TimerStatus.IDLE) && (
            <View style={styles.buttonsContainer}>
              <AwesomeButtonMy raiseLevel={2} type="whatsapp" stretch={true} onPress={onStartPressed}>
                {'Start'}
              </AwesomeButtonMy>
            </View>
          )}
          {timerStatus === TimerStatus.PAUSED && (
            <View style={styles.buttonsContainer}>
              <View style={styles.buttonLeft}>
                <AwesomeButtonMy raiseLevel={2} type="secondary" stretch={true} onPress={onResumePressed}>
                  {'Resume'}
                </AwesomeButtonMy>
              </View>
              <View style={styles.buttonRight}>
                <AwesomeButtonMy raiseLevel={2} type="pinterest" stretch={true} onPress={onStopPressed}>
                  {'Stop'}
                </AwesomeButtonMy>
              </View>
            </View>
          )}
          {timerStatus === TimerStatus.TICKING && (
            <View style={styles.buttonsContainer}>
              <View style={styles.buttonLeft}>
                <AwesomeButtonMy raiseLevel={2} type="secondary" stretch={true} onPress={onPausedPressed}>
                  {'Pause'}
                </AwesomeButtonMy>
              </View>
              <View style={styles.buttonRight}>
                <AwesomeButtonMy raiseLevel={2} type="pinterest" stretch={true} onPress={onStopPressed}>
                  {'Stop'}
                </AwesomeButtonMy>
              </View>
            </View>
          )}
        </View>
      </View>

      <Modalize ref={modalizeRef} adjustToContentHeight={true}>
        <PresetSelectionPopup
          onSelectionChanged={selectedPreset => {
            DataService.setActivePreset(selectedPreset.Id).then(() => {
              init(selectedPreset)
              modalizeRef.current?.close()
            })
          }}
          onEditItemClicked={targetPreset => {
            navigate(Screens.PresetDetail, { current: targetPreset })
          }}
          onAddClicked={() => navigate(Screens.PresetDetail, { current: undefined })}
        />
      </Modalize>
    </ScreenContainer>
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
  row: {
    // marginTop: 50,
    // backgroundColor: 'lightgrey',
    flexDirection: 'column',
    alignItems: 'center',
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
  // @summary-section:
  summarySection: {
    flexGrow: 1,
    flexDirection: 'column',
    paddingHorizontal: Spacings.s_16,
    paddingVertical: Spacings.s_8,
    // alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3C3C3C', // '#202021',
    borderRadius: RadiusSizes.r8,
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
    alignItems: 'flex-start',
  },
  totalTimeContainer: {
    alignItems: 'flex-end',
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
  // @action-section:
  actionSection: {
    flexDirection: 'row',
    paddingHorizontal: Spacings.s_16,
    paddingVertical: Spacings.s_4,
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 2,
    // backgroundColor: 'lightgreen', // '#202021',
  },
  buttonsContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  buttonLeft: {
    flexGrow: 1,
    marginRight: 10,
  },
  buttonRight: {
    flexGrow: 1,
    marginLeft: 10,
  },
  stop: {},
  actionsheetContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
})
