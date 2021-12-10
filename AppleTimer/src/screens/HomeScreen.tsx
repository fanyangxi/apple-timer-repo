import React, { ReactElement, useEffect, useRef, useState } from 'react'
import { Platform, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { Colors, FontColors, Fonts, RadiusSizes, Spacings } from '@/theme/Variables'
import { Preset, TickedContext, UnpackedPresetMap } from '@/models/preset'
import { TimerStatus } from '@/services/countdown-timer-v2'
import { TimerService } from '@/services/timer-service'
import { NotificationService, Sounds } from '@/services/notification-service'
import { logger } from '@/utils/logger'
import ScreenContainer from '@/components/ScreenContainer'
import { NavigationBar } from '@/components/NavigationBar'
import { useNavigation } from '@react-navigation/native'
import { Screens } from '@/common/constants'
import { DeviceScreen } from '@/common/device'
import { Neomorph, ShadowFlex } from 'react-native-neomorph-shadows'
import { PresetSelectionPopup } from '@/screens/components/PresetSelectionPopup'
import { Modalize } from 'react-native-modalize'
import { DataService } from '@/services/data-service'
import { getRawTickedContext, getTotalPresetDurationSecs, getUnpackedPresetMap } from '@/utils/preset-util'
import AwesomeButtonMy from '@/components/button/AwesomeButtonMy'
import { format, toDTime } from '@/utils/date-util'
import { WorkoutDetailView, WorkoutDetailViewRefObject } from '@/screens/components/WorkoutDetailView'
import { SettingsButton } from '@/components/button/SettingsButton'
import { ConfirmDialog } from 'react-native-simple-dialogs'
import LinearGradient from 'react-native-linear-gradient'
import * as Progress from 'react-native-progress'
import { handleErr, toFixedNumber } from '@/utils/common-util'
import { ImageBackground1 } from '@/components/ImageBackground1'
import { UserSettings } from '@/models/common'
import { UserSettingsDataService } from '@/services/user-settings-data-service'
import { useTranslation } from 'react-i18next'

export const HomeScreen: React.FC = (): ReactElement => {
  const { t } = useTranslation()
  const [secsLeftInCurrentWorkout, setSecsLeftInCurrentWorkout] = useState<number>()
  const [activePreset, setActivePreset] = useState<Preset>()
  const [tickedContext, setTickedContext] = useState<TickedContext>()
  const [timerStatus, setTimerStatus] = useState<TimerStatus | undefined>()
  const [showConfirmDialog, setShowConfirmDialog] = useState<boolean>(false)
  const [presetTotalDurationSecs, setPresetTotalDurationSecs] = useState<number>(0)

  const userSettingsRef = useRef<Partial<UserSettings>>()
  const timerServiceRef = useRef<TimerService>()
  const notificationServiceRef = useRef<NotificationService>()
  const workoutDetailViewRef = useRef<WorkoutDetailViewRefObject>()
  const { navigate } = useNavigation()
  const modalizeRef = useRef<Modalize>(null)
  const TAG = '$$[HOME]$$'

  useEffect(() => {
    notificationServiceRef.current = new NotificationService()
    reloadUserSettings().catch(handleErr)
    DataService.getActivePreset().then(cachedPreset => {
      setActivePreset(cachedPreset)
    })
    // only called once after first render
    logger.info('>>> HOME-SCREEN LOADED ======================>!')
  }, [])

  useEffect(() => {
    if (activePreset) {
      console.log(`>>> Current active-preset is: ${JSON.stringify(activePreset)}`)
      const totalDurationSecs = getTotalPresetDurationSecs(activePreset)
      const theUnpackedPresetMap: UnpackedPresetMap = getUnpackedPresetMap(activePreset)
      setPresetTotalDurationSecs(totalDurationSecs)
      setTickedContext(getRawTickedContext(activePreset))
      setSecsLeftInCurrentWorkout(getTotalPresetDurationSecs(activePreset))
      timerServiceRef.current = initTimerServiceRef(activePreset, theUnpackedPresetMap)
    }
  }, [activePreset])

  const initTimerServiceRef = (thePreset: Preset, unpackedPresetMap: UnpackedPresetMap): TimerService => {
    const timerSvc = new TimerService(thePreset, unpackedPresetMap)
    //
    timerSvc.OnStatusChanged = async (oldStatus: TimerStatus, newStatus: TimerStatus) => {
      setTimerStatus(newStatus)
    }
    timerSvc.OnTicked = async (secsLeft: number, ticked: TickedContext) => {
      // logger.info(
      //   `[(${secsLeft} secs)|${moment(Date.now()).format(FULL_TIMESTAMP)}],` +
      //     `${ticked.cycleCurrentPhase},${JSON.stringify(ticked)}`,
      // )
      setTickedContext(ticked)
      setSecsLeftInCurrentWorkout(secsLeft)
    }
    //
    timerSvc.OnTimerStarted = async () => {}
    timerSvc.OnPaused = async () => {
      logger.info(`${TAG}: timerSvc.OnPaused`)
      workoutDetailViewRef.current?.pauseAnim()
      notificationServiceRef.current?.playSounds([Sounds.TimerPaused])
    }
    timerSvc.OnResumed = async () => {
      logger.info(`${TAG}: timerSvc.OnResumed`)
      workoutDetailViewRef.current?.startOrResumeCycleAnim()
      notificationServiceRef.current?.playSounds([Sounds.TimerResumed])
    }
    timerSvc.OnTimerStopped = async () => {
      workoutDetailViewRef.current?.resetCycleAnim()
      setTickedContext(getRawTickedContext(thePreset))
      setSecsLeftInCurrentWorkout(getTotalPresetDurationSecs(thePreset))
      notificationServiceRef.current?.playSounds([Sounds.TimerStopped])
    }
    timerSvc.OnTimerCompleted = async () => {
      workoutDetailViewRef.current?.resetCycleAnim()
      setTickedContext(getRawTickedContext(thePreset))
      setSecsLeftInCurrentWorkout(getTotalPresetDurationSecs(thePreset))
      notificationServiceRef.current?.playSounds([Sounds.TimerCompleted])
    }
    //
    timerSvc.OnCycleStarted = async () => {
      logger.info(`${TAG}: timerSvc.OnCycleStarted`)
      workoutDetailViewRef.current?.resetCycleAnim()
    }
    timerSvc.OnPreparePhaseStarted = async () => {
      logger.info(`${TAG}: timerSvc.OnPreparePhaseStarted`)
      workoutDetailViewRef.current?.startOrResumePreparePhaseAnim()
    }
    timerSvc.OnPreparePhaseClosing = async () => {
      notificationServiceRef.current?.playSounds([Sounds.ThreeTwoOne])
    }
    timerSvc.OnSetStarted = async (secsLeft: number, ticked: TickedContext) => {
      logger.info(`${TAG}: timerSvc.OnSetStarted`)
      workoutDetailViewRef.current?.resetSetAnim()
      const cycleSetsRemainingCount: number = ticked.cycleSetsRemainingCount
      notificationServiceRef.current?.playSounds([`num_${cycleSetsRemainingCount}.mp3`, Sounds.RepetitionsToGo])
    }
    timerSvc.OnWorkoutPhaseStarted = async () => {
      logger.info(`${TAG}: timerSvc.OnWorkoutPhaseStarted`)
      workoutDetailViewRef.current?.startOrResumeWorkoutPhaseAnim()
      notificationServiceRef.current?.playSounds([Sounds.Workout])
    }
    timerSvc.OnWorkoutPhaseClosing = async () => {
      notificationServiceRef.current?.playSounds([Sounds.ThreeTwoOne])
    }
    timerSvc.OnRestPhaseStarted = async () => {
      logger.info(`${TAG}: timerSvc.OnRestPhaseStarted`)
      workoutDetailViewRef.current?.startOrResumeRestPhaseAnim()
      notificationServiceRef.current?.playSounds([Sounds.Rest])
    }
    timerSvc.OnRestPhaseClosing = async () => {
      notificationServiceRef.current?.playSounds([Sounds.ThreeTwoOne])
    }
    return timerSvc
  }

  const onStartPressed = async () => {
    await timerServiceRef.current?.runPreset()
  }

  const onPausedPressed = () => {
    timerServiceRef.current?.pause()
  }

  const onResumePressed = async () => {
    await timerServiceRef.current?.resume()
  }

  const onStopPressed = async () => {
    timerServiceRef.current?.stop()
  }

  const onPresetSelectionClicked = () => {
    // @ts-ignore
    modalizeRef.current.open()
  }

  const reloadUserSettings = async () => {
    await UserSettingsDataService.getUserSettings().then(data => {
      console.log(`Loaded user-settings: ${JSON.stringify(data)}`)
      userSettingsRef.current = data
    })
  }

  const SUMMARY_HEIGHT = Platform.select({ ios: 120, android: 128, default: 120 })
  return (
    <ScreenContainer
      backgroundComponent={() => <ImageBackground1 />}
      // style={{ backgroundColor: '#434343' }}
      topInsetBackgroundColor={Colors.mineShaft}
      bottomInsetBackgroundColor={Colors.transparent}
    >
      <StatusBar barStyle={'light-content'} backgroundColor={Colors.transparent} />
      <NavigationBar
        title={t('home.screenHeader')}
        showBackButton={false}
        right={<SettingsButton onPress={() => navigate(Screens.Settings)} />}
      />

      {/* @summary-section: */}
      <View style={styles.rootContainer}>
        {/* @summary-section: */}
        <View style={styles.summarySection}>
          <Neomorph
            inner={false} // <- enable shadow inside of neomorph
            swapShadows // <- change zIndex of each shadow color
            style={{
              ...styles.neomorphContainer,
              width: DeviceScreen.width - Spacings.s_48,
              height: SUMMARY_HEIGHT,
              zIndex: 0,
            }}
          >
            <View style={styles.summaryContent}>
              <View style={styles.title}>
                <LinearGradient
                  colors={['#4E4E4E', '#4E4E4E', '#3C3C3C', '#2f2e2e', '#3C3C3C', '#4E4E4E', '#4E4E4E']}
                  useAngle={true}
                  angle={90}
                  style={{
                    ...Platform.select({ ios: {}, android: { marginTop: 2 } }),
                    height: 48,
                    paddingHorizontal: 24,
                    flexDirection: 'row',
                    justifyContent: 'center',
                  }}
                >
                  <TouchableOpacity style={styles.presetSelectionButton} onPress={() => onPresetSelectionClicked()}>
                    <Text style={[Fonts.titleRegular, FontColors.clickable]}>{`${activePreset?.Name}`}</Text>
                  </TouchableOpacity>
                </LinearGradient>
              </View>
              <View style={styles.summaryDivider}>
                <ShadowFlex
                  // inner // <- enable inner shadow
                  // useArt // <- set this prop to use non-native shadow on ios
                  style={{
                    width: 240,
                    height: 1,
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 1,
                    shadowColor: 'black',
                    shadowRadius: 16,
                    borderRadius: 40,
                  }}
                >
                  <LinearGradient
                    colors={['#4E4E4E', '#AEACAC', '#4E4E4E']}
                    useAngle={true}
                    angle={45}
                    style={{
                      width: 240,
                      height: 2,
                      // borderTopLeftRadius: 10,
                      flexDirection: 'row',
                      justifyContent: 'center',
                    }}
                  />
                </ShadowFlex>
              </View>
              <View style={styles.summaryDetail}>
                <View style={styles.timeRemainingContainer}>
                  <Text style={styles.itemValue}>{`${format(toDTime(secsLeftInCurrentWorkout ?? 0))}`}</Text>
                  <Text style={styles.itemLabel}>{t('home.timeRemaining')}</Text>
                </View>
                <View style={styles.totalTimeContainer}>
                  <Text style={styles.itemValue}>{format(toDTime(getTotalPresetDurationSecs(activePreset)))}</Text>
                  <Text style={styles.itemLabel}>{t('home.totalTime')}</Text>
                </View>
              </View>
            </View>
          </Neomorph>
        </View>

        {/* @details-section: */}
        <View style={styles.workoutDetailsSection}>
          <WorkoutDetailView
            // @ts-ignore
            ref={workoutDetailViewRef}
            activePreset={activePreset}
            tickedContext={tickedContext}
          />
        </View>

        <View style={styles.footerSummarySection}>
          <Neomorph
            inner={false}
            swapShadows
            style={{
              ...styles.neomorphContainer,
              width: DeviceScreen.width - Spacings.s_48,
              height: 80,
              zIndex: 0,
            }}
          >
            <View style={styles.footerSummaryContent}>
              <View style={styles.footerSummaryDetail}>
                <View style={styles.cyclesLeftContainer}>
                  <Text style={styles.itemValue}>{tickedContext?.cyclesRemainingCount}</Text>
                  <Text style={styles.itemLabel}>{t('home.cyclesLeft')}</Text>
                </View>
                <View style={styles.setsLeftContainer}>
                  <Text style={styles.itemValue}>{tickedContext?.cycleSetsRemainingCount}</Text>
                  <Text style={styles.itemLabel}>{t('home.setsLeft')}</Text>
                </View>
                <View style={styles.overallProgressBar}>
                  <Progress.Bar
                    style={{ alignSelf: 'center', marginBottom: Spacings.s_12 }}
                    color={'#5ea8f6'}
                    height={8}
                    progress={toFixedNumber(1 - (secsLeftInCurrentWorkout ?? 0) / presetTotalDurationSecs)}
                    indeterminate={false}
                  />
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
                {t('home.start')}
              </AwesomeButtonMy>
            </View>
          )}
          {timerStatus === TimerStatus.PAUSED && (
            <View style={styles.buttonsContainer}>
              <View style={styles.buttonLeft}>
                <AwesomeButtonMy raiseLevel={2} type="secondary" stretch={true} onPress={onResumePressed}>
                  {t('home.resume')}
                </AwesomeButtonMy>
              </View>
              <View style={styles.buttonRight}>
                <AwesomeButtonMy
                  raiseLevel={2}
                  type="pinterest"
                  stretch={true}
                  onPress={() => setShowConfirmDialog(true)}
                >
                  {t('home.stop')}
                </AwesomeButtonMy>
              </View>
            </View>
          )}
          {timerStatus === TimerStatus.TICKING && (
            <View style={styles.buttonsContainer}>
              <View style={styles.buttonLeft}>
                <AwesomeButtonMy raiseLevel={2} type="secondary" stretch={true} onPress={onPausedPressed}>
                  {t('home.pause')}
                </AwesomeButtonMy>
              </View>
              <View style={styles.buttonRight}>
                <AwesomeButtonMy
                  raiseLevel={2}
                  type="pinterest"
                  stretch={true}
                  onPress={() => setShowConfirmDialog(true)}
                >
                  {t('home.stop')}
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
              onStopPressed().catch(() => {})
              setActivePreset(selectedPreset)
              modalizeRef.current?.close()
            })
          }}
          onEditItemClicked={targetPreset => {
            navigate(Screens.PresetDetail, { current: targetPreset })
          }}
          onAddClicked={() => navigate(Screens.PresetDetail, { current: undefined })}
        />
      </Modalize>

      <ConfirmDialog
        visible={showConfirmDialog}
        title={t('confirmStopping.title')}
        titleStyle={[Fonts.titleRegular, FontColors.warn]}
        message={t('confirmStopping.description')}
        onTouchOutside={() => setShowConfirmDialog(false)}
        negativeButton={{
          title: t('confirmStopping.cancel'),
          titleStyle: { ...Fonts.textRegular },
          onPress: () => setShowConfirmDialog(false),
        }}
        positiveButton={{
          title: t('confirmStopping.stop'),
          titleStyle: { ...Fonts.titleSmall, color: Colors.primary },
          onPress: () => {
            setShowConfirmDialog(false)
            onStopPressed().catch(() => {})
          },
        }}
      />
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
  summarySection: {
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
  summaryContent: {
    flexGrow: 1,
    flexDirection: 'column',
    paddingHorizontal: Spacings.s_16,
    paddingBottom: Spacings.s_8,
    justifyContent: 'flex-start',
    // backgroundColor: '#3C3C3C', // '#202021',
    borderRadius: RadiusSizes.r8,
  },
  title: {
    alignItems: 'center',
  },
  summaryDivider: {
    flexDirection: 'column',
    alignItems: 'center',
    // backgroundColor: 'green',
  },
  summaryDetail: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  presetSelectionButton: {
    paddingHorizontal: 32,
    justifyContent: 'center',
  },
  timeRemainingContainer: {
    alignItems: 'flex-start',
  },
  totalTimeContainer: {
    alignItems: 'flex-end',
  },
  cyclesLeftContainer: {
    alignItems: 'flex-start',
  },
  setsLeftContainer: {
    alignItems: 'flex-end',
  },
  overallProgressBar: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: 'lightgreen',
  },
  itemLabel: {
    ...Fonts.textSmall,
    ...FontColors.white,
  },
  itemValue: {
    ...Fonts.textCaption30,
    ...FontColors.white,
  },
  footerSummaryDetail: {
    flexGrow: 1,
    // backgroundColor: '#998801', // '#202021',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  footerSummarySection: {
    flexDirection: 'column',
    paddingHorizontal: Spacings.s_16,
  },
  footerSummaryContent: {
    flexGrow: 1,
    flexDirection: 'column',
    paddingHorizontal: Spacings.s_16,
    paddingVertical: Spacings.s_8,
    // alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor: 'red', // '#3C3C3C', // '#202021',
    borderRadius: RadiusSizes.r8,
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
  workoutDetailsSection: {
    // marginTop: 50,
    // backgroundColor: 'lightgrey',
    flexDirection: 'column',
    alignItems: 'center',
    zIndex: 1,
  },
  // @action-section:
  actionSection: {
    flexDirection: 'row',
    paddingHorizontal: Spacings.s_16,
    paddingVertical: Spacings.s_4,
    marginTop: Spacings.s_16,
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
    flexGrow: 2,
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
  confirmationContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmationText: {
    textAlign: 'center',
  },
  confirmationLeftButton: {
    alignSelf: 'flex-start',
  },
  confirmationRightButton: {
    alignSelf: 'flex-end',
  },
})
