import React, { ReactElement, useEffect, useRef, useState } from 'react'
import { Image, StatusBar, StyleSheet, Text, View } from 'react-native'
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

export const HomeScreen: React.FC<{}> = (): ReactElement => {
  const [secsLeftInCurrentWorkout, setSecsLeftInCurrentWorkout] = useState<number>()
  const [activePreset, setActivePreset] = useState<Preset>()
  const [tickedPreset, setTickedPreset] = useState<TickedPreset>()
  const [timerStatus, setTimerStatus] = useState<TimerStatus | undefined>()

  const timerServiceRef = useRef<TimerService>()
  const notificationServiceRef = useRef<NotificationService>()
  const { navigate } = useNavigation()
  const modalizeRef = useRef<Modalize>(null)

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
    timerSvc.OnTimerStarted = async () => {}
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
      setSecsLeftInCurrentWorkout(secsLeft)
      setTickedPreset(tickedPreset)
    }
    timerSvc.OnTimerCompleted = async () => {
      notificationServiceRef.current?.playSounds([Sounds.TimerCompleted])
    }
    //
    timerSvc.OnPaused = async () => {
      notificationServiceRef.current?.playSounds([Sounds.TimerPaused])
    }
    timerSvc.OnResumed = async () => {
      notificationServiceRef.current?.playSounds([Sounds.TimerResumed])
      // notificationServiceRef.current?.playSounds([Sounds._3_secs_countdown, Sounds._start, Sounds._bell])
    }
    timerSvc.OnStopped = async () => {
      notificationServiceRef.current?.playSounds([Sounds.TimerStopped])
    }
    //
    timerSvc.OnPreparePhaseIsClosing = async (setRepsRemainingCount: number) => {
      notificationServiceRef.current?.playSounds([
        Sounds.ThreeTwoOne,
        `num_${setRepsRemainingCount}.mp3`,
        Sounds.RepetitionsToGo,
        Sounds.Workout,
      ])
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
    timerSvc.OnSetCompleted = async () => {
      notificationServiceRef.current?.playSounds([Sounds.ThreeTwoOne, Sounds.SetCompleted])
    }
    timerSvc.OnStatusChanged = async (oldStatus: TimerStatus, newStatus: TimerStatus) => {
      setTimerStatus(newStatus)
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
          <Neomorph
            inner={false} // <- enable shadow inside of neomorph
            swapShadows // <- change zIndex of each shadow color
            style={{
              ...styles.neomorphContainer,
              width: DeviceScreen.width - Spacings.s_48,
              height: 245,
            }}
          >
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

              {/* current phase info */}
              {/*<Divider style={styles.contentDivider} />*/}
              <View style={styles.summaryContent}>
                <View style={styles.itemsContainer}>
                  <Text style={styles.itemLabel}>setPrepareSecs:{tickedPreset?.setPrepareRemainingSecs}</Text>
                  <Text style={styles.itemLabel}>repWorkoutSecs:{tickedPreset?.repWorkoutRemainingSecs}</Text>
                  <Text style={styles.itemLabel}>repRestSecs:{tickedPreset?.repRestRemainingSecs}</Text>
                </View>
                <View style={styles.itemsContainer}>
                  <Text style={styles.itemLabel}>setCurrentPhase: {tickedPreset?.setCurrentPhase}</Text>
                </View>
              </View>
            </View>
          </Neomorph>
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
