import React, { ReactElement, useEffect, useRef, useState } from 'react'
import { Image, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { useTheme } from '@/theme'
import { Colors, FontColors, Fonts, RadiusSizes, Spacings } from '@/theme/Variables'
import { LinkButton, LinkButtonTheme } from '@/components/button/LinkButton'
import { Preset, TickedPreset } from '@/models/preset'
import { TickingType } from '@/services/countdown-timer'
import { TimerService } from '@/services/timer-service'
import { NotificationService, Sounds } from '@/services/notification-service'
import { logger } from '@/utils/logger'
import ScreenContainer from '@/components/ScreenContainer'
import { NavigationBar } from '@/components/NavigationBar'
import { assets } from '@/assets'
import { ImageButton } from '@/components/button/ImageButton'
import { useNavigation } from '@react-navigation/native'
import { Screens } from '@/common/constants'
import { DeviceScreen } from '@/common/device'
import { Neomorph } from 'react-native-neomorph-shadows'
import { PresetList } from '@/screens/components/PresetsList'
import { Modalize } from 'react-native-modalize'

export const HomeScreen: React.FC<{}> = (): ReactElement => {
  const [secsLeftInCurrentPhase, setSecsLeftInCurrentPhase] = useState<number>()
  const [stateTickedPreset, setStateTickedPreset] = useState<TickedPreset>()
  const [isRunning, setIsRunning] = useState<boolean>()
  const [isPaused, setIsPaused] = useState<boolean>()

  const timerServiceRef = useRef<TimerService>()
  const notificationServiceRef = useRef<NotificationService>()
  const { navigate } = useNavigation()
  const modalizeRef = useRef<Modalize>(null)

  const { Common } = useTheme()
  const preset: Preset = new Preset('', 5, 7, 5, 2, 2)
  const cachedPresets = [
    new Preset('My Preset A', 5, 7, 5, 2, 2),
    new Preset('Exercise', 5, 7, 5, 2, 2),
    new Preset('Calm', 5, 7, 5, 2, 2),
    new Preset('lana', 5, 7, 5, 2, 2),
    new Preset('cnduei', 5, 7, 5, 2, 2),
    new Preset('asdf', 5, 7, 5, 2, 2),
    new Preset('y34hefgs', 5, 7, 5, 2, 2),
  ]

  useEffect(() => {
    notificationServiceRef.current = new NotificationService()

    timerServiceRef.current = new TimerService(preset)
    //
    timerServiceRef.current.OnTimerStarted = async () => {
      setIsRunning(true)
    }
    timerServiceRef.current.OnTicked = async (
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
    timerServiceRef.current.OnPreparePhaseIsClosing = async (setRepsRemainingCount: number) => {
      notificationServiceRef.current?.playSounds([
        Sounds.ThreeTwoOne,
        `num_${setRepsRemainingCount}.mp3`,
        Sounds.RepetitionsToGo,
        Sounds.Workout,
      ])
    }
    timerServiceRef.current.OnWorkoutPhaseIsClosing = async () => {
      notificationServiceRef.current?.playSounds([Sounds.ThreeTwoOne, Sounds.Rest])
    }
    timerServiceRef.current.OnRestPhaseIsClosing = async (setRepsRemainingCount: number) => {
      notificationServiceRef.current?.playSounds([
        Sounds.ThreeTwoOne,
        `num_${setRepsRemainingCount}.mp3`,
        Sounds.RepetitionsToGo,
        Sounds.Workout,
      ])
    }
    timerServiceRef.current.OnSetCompleted = async () => {
      notificationServiceRef.current?.playSounds([Sounds.ThreeTwoOne, Sounds.SetCompleted])
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

  const onStopPressed = async () => {
    timerServiceRef.current && timerServiceRef.current.stop()
    timerServiceRef.current && (await timerServiceRef.current.runPreset())
  }

  return (
    <ScreenContainer
      // backgroundComponent={() => <SvgComponent />}
      backgroundComponent={() => (
        <Image
          source={assets.images.darkBackground}
          style={{
            flex: 1,
            width: undefined,
            height: undefined,
            backgroundColor: 'red',
          }}
        />
      )}
      // style={{ backgroundColor: '#434343' }}
      topInsetBackgroundColor={Colors.mineShaft}
      bottomInsetBackgroundColor={Colors.transparent}
    >
      <StatusBar barStyle={'light-content'} backgroundColor={Colors.transparent} />
      <NavigationBar
        title={'Apple Timer'}
        showBackButton={false}
        right={<ImageButton icon={assets.images.settings} onPress={() => navigate(Screens.Settings)} />}
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
              height: 145,
            }}
          >
            <View style={styles.summarySection}>
              <View style={styles.title}>
                {/*<TouchableOpacity style={[Common.button.rounded]} onPress={() => {}}>*/}
                {/*  <Text style={Fonts.textRegular}>{'Change-Preset'}</Text>*/}
                {/*</TouchableOpacity>*/}
                <LinkButton
                  theme={LinkButtonTheme.Normal}
                  text={'Change-Preset'}
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
                  <Text style={styles.itemValue}>{'07:20'}</Text>
                  <Text style={styles.itemLabel}>Time remaining</Text>
                </View>
                <View style={styles.totalTimeContainer}>
                  <Text style={styles.itemValue}>{'07:20'}</Text>
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
                  <Text style={styles.itemLabel}>setsRemainingCount:{stateTickedPreset?.setsRemainingCount}</Text>
                  <Text style={styles.itemLabel}>setRepsRemainingCount:{stateTickedPreset?.setRepsRemainingCount}</Text>
                  <Text style={styles.itemLabel}>setPrepareSecs:{stateTickedPreset?.setPrepareRemainingSecs}</Text>
                  <Text style={styles.itemLabel}>repWorkoutSecs:{stateTickedPreset?.repWorkoutRemainingSecs}</Text>
                  <Text style={styles.itemLabel}>repRestSecs:{stateTickedPreset?.repRestRemainingSecs}</Text>
                </View>
                <View style={styles.itemsContainer}>
                  <Text style={styles.itemLabel}>Total: {secsLeftInCurrentPhase}</Text>
                  <Text style={styles.itemLabel}>setCurrentPhase: {stateTickedPreset?.setCurrentPhase}</Text>
                </View>
              </View>
            </View>
          </Neomorph>
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
            <LinkButton theme={LinkButtonTheme.Normal} text={'PRIMARY'} onPress={onStartPressed} />
          )}
        </View>
      </View>

      <Modalize ref={modalizeRef} adjustToContentHeight={true}>
        <PresetList
          presets={cachedPresets}
          onSelectionChanged={preset => {
            navigate(Screens.PresetDetail, { current: preset.Name })
          }}
        />
      </Modalize>

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
    borderRadius: 16,
    backgroundColor: '#4E4E4E', // 434343, 4E4E4E, 3C3C3C, 3E3E3E
    flexDirection: 'column',
    justifyContent: 'center',
  },
  // @summary-section:
  summarySection: {
    flexDirection: 'column',
    paddingHorizontal: Spacings.s_16,
    paddingVertical: Spacings.s_16,
    // alignItems: 'center',
    // justifyContent: 'center',
    // backgroundColor: '#202021', // '#202021',
    borderRadius: RadiusSizes.r4,
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
    paddingHorizontal: Spacings.s_40,
    paddingVertical: Spacings.s_4,
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 2,
    // backgroundColor: 'lightgreen', // '#202021',
  },
  start: {},
  pause: {},
  stop: {},
  actionsheetContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
})
