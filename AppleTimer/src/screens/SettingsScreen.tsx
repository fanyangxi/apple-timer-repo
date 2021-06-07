import React, { ReactElement, useEffect, useRef, useState } from 'react'
import { StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { useTheme } from '@/theme'
import { Colors, Fonts, Spacings } from '@/theme/Variables'
import SvgComponent from '@/components/DarkAnd'
import { Preset, TickedPreset } from '@/models/preset'
import { TickingType } from '@/services/countdown-timer'
import { TimerService } from '@/services/timer-service'
import { NotificationService } from '@/services/notification-service'
import { NavigationBar } from '@/components/NavigationBar'
import ScreenContainer from '@/components/ScreenContainer'

export const SettingsScreen: React.FC<{}> = (): ReactElement => {
  const [isRunning, setIsRunning] = useState<boolean>()
  const timerServiceRef = useRef<TimerService>()
  const notificationServiceRef = useRef<NotificationService>()

  const { Common } = useTheme()
  const preset: Preset = new Preset(3, 4, 2, 2, 2)

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
    }
    timerServiceRef.current.OnTimerCompleted = async () => {
      setIsRunning(false)
    }
    // eslint-disable-next-line
  }, [])

  const onTestCountdownTimerPressed = () => {
    // Start it first:
    timerServiceRef.current && timerServiceRef.current.runPreset().then(() => {})
    // Repeating pause & resume at 18ms interval for many times.
    let flag = false
    setInterval(() => {
      flag
        ? timerServiceRef.current && timerServiceRef.current.pause()
        : timerServiceRef.current && timerServiceRef.current.resume().then(() => {})
      flag = !flag
    }, 18)
  }

  return (
    <ScreenContainer
      backgroundComponent={() => <SvgComponent />}
      topInsetBackgroundColor={Colors.mineShaft}
      bottomInsetBackgroundColor={Colors.transparent}
    >
      <StatusBar barStyle={'light-content'} backgroundColor={Colors.primary} />
      <NavigationBar title={'Settings'} showBackButton={true} />
      <View style={styles.rootContainer}>
        {/* @action-section: */}
        <View style={styles.actionSection}>
          <View style={[styles.start]}>
            <TouchableOpacity style={[Common.button.rounded]} onPress={() => onTestCountdownTimerPressed()}>
              <Text style={Fonts.textRegular}>{'Test-Countdown-Timer'}</Text>
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
