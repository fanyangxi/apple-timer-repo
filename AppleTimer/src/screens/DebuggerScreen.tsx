import React, { ReactElement, useEffect, useRef } from 'react'
import { StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { useTheme } from '@/theme'
import { Colors, Fonts, Spacings } from '@/theme/Variables'
import SvgComponent from '@/assets/icons/DarkAnd'
import { Preset, TickedPreset } from '@/models/preset'
import { TimerService } from '@/services/timer-service'
import { NotificationService } from '@/services/notification-service'
import { NavigationBar } from '@/components/NavigationBar'
import ScreenContainer from '@/components/ScreenContainer'
import { getTotalPresetDurationSecs } from '@/utils/preset-util'
import { logger } from '@/utils/logger'

export const DebuggerScreen: React.FC<{}> = (): ReactElement => {
  const isStartedRef = useRef<boolean>(false)
  const isPausedRef = useRef<boolean>(false)
  const timerServiceRef = useRef<TimerService>()
  const notificationServiceRef = useRef<NotificationService>()

  const { Common } = useTheme()
  const preset: Preset = new Preset('', '', 1, 2, 1, 1, 1)
  let _timerId: NodeJS.Timeout
  let _executionCount: number = 0

  useEffect(() => {
    notificationServiceRef.current = new NotificationService()

    console.log(`>>> active-preset: ${JSON.stringify(preset)}, total:${getTotalPresetDurationSecs(preset) * 1000}-ms`)
    timerServiceRef.current = new TimerService(preset)
    //
    timerServiceRef.current.OnTimerStarted = async () => {
      console.log(`OnTimerStarted, execution-count: ${_executionCount}`)
    }
    timerServiceRef.current.OnTicked = async (secsLeft: number, tickedPreset: TickedPreset) => {
      // logger.info(
      //   `[(${secsLeft} secs)|${moment(Date.now()).format(FULL_TIMESTAMP)}] S${currentSet}C${currentRep},` +
      //     `${tickedPreset.cycleCurrentPhase},${type},${JSON.stringify(tickedPreset)}`,
      // )
      // await Sleep(5000)
    }
    timerServiceRef.current.OnTimerCompleted = async () => {
      clearInterval(_timerId)
      console.log(`OnTimerCompleted, execution-count XXX: ${_executionCount}`)
    }
    // eslint-disable-next-line
  }, [])

  const startAutoTesting = () => {
    logger.info('start-auto-testing')
    _executionCount = 0
    // Start it first:
    logger.info(`start-auto-testing: started-at: ${Date.now()}`)
    timerServiceRef.current && timerServiceRef.current.runPreset().then(() => {})
    // Repeating pause & resume at 18ms interval for many times.
    let flag = false
    _timerId = setInterval(() => {
      // console.log(`setInterval, execution-count: ${_executionCount}`)
      if (flag) {
        timerServiceRef.current && timerServiceRef.current.pause()
        _executionCount += 1
      } else {
        timerServiceRef.current && timerServiceRef.current.resume().then(() => {})
      }
      flag = !flag
    }, 200) // Minimum acceptable Resume->Pause interval is 20ms.
    logger.info(`start-auto-testing: interval-run-at: ${Date.now()}`)
  }

  const startManualTesting = () => {
    // logger.info('start-manual-testing')
    // Start it first:
    if (!isStartedRef.current) {
      isStartedRef.current = true
      timerServiceRef.current && timerServiceRef.current.runPreset().then(() => {})
    } else {
      // Repeating pause & resume at 18ms interval for many times.
      if (!isPausedRef.current) {
        isPausedRef.current = true
        _executionCount += 1
        timerServiceRef.current && timerServiceRef.current.pause()
      } else {
        isPausedRef.current = false
        timerServiceRef.current && timerServiceRef.current.resume().then(() => {})
      }
    }

    // runAccurateBackgroundCountdownTimer(
    //   420,
    //   239,
    //   async (remainingSecs: number, rawRemainingMs: number, diff: number) => {
    //     logger.info(`>>> ${format(toDTime(remainingSecs))}; remainingMs:${rawRemainingMs}; diff:${diff}`)
    //     await sleep(3500)
    //     notificationServiceRef.current?.playSounds([Sounds._bell])
    //   },
    // )
  }

  const resetManualTesting = () => {
    // logger.info('reset-')
    // BackgroundTimer.stopBackgroundTimer()

    isStartedRef.current = false
    isPausedRef.current = false
    _executionCount = 0
  }

  return (
    <ScreenContainer
      backgroundComponent={() => <SvgComponent />}
      topInsetBackgroundColor={Colors.mineShaft}
      bottomInsetBackgroundColor={Colors.transparent}
    >
      <StatusBar barStyle={'light-content'} backgroundColor={Colors.primary} />
      <NavigationBar title={'Debugger'} showBackButton={true} />
      <View style={styles.rootContainer}>
        {/* @action-section: */}
        <View style={styles.actionSection}>
          <Text style={Fonts.textRegular}>
            {'Auto-Test: For 6s, try to pause/resume every 20ms, for around 300 times'}
          </Text>
          <View style={[styles.buttons]}>
            <TouchableOpacity style={[Common.button.rounded]} onPress={() => startAutoTesting()}>
              <Text style={Fonts.textRegular}>{'Start auto-test'}</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.actionSection}>
          <Text style={Fonts.textRegular}>{'Manual-Test: Click to start, then pause/resume'}</Text>
          <View style={[styles.buttons]}>
            <TouchableOpacity style={[Common.button.rounded]} onPress={() => startManualTesting()}>
              <Text style={Fonts.textRegular}>{'--- Go ---'}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[Common.button.rounded]} onPress={() => resetManualTesting()}>
              <Text style={Fonts.textRegular}>{'Reset'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
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
  // @action-section:
  actionSection: {
    flexDirection: 'column',
    paddingHorizontal: Spacings.s_40,
    paddingVertical: Spacings.s_24,
    alignItems: 'stretch',
    justifyContent: 'space-between',
    backgroundColor: 'lightgreen', // '#202021',
    borderRadius: 2,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  left: {},
  right: {},
  background: {
    backgroundColor: 'lightgreen', // '#202021',
    position: 'absolute',
  },
})
