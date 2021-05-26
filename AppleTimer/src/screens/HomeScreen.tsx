import React, { ReactElement } from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { useTheme } from '@/theme'
import { Radiuses, Spacings } from '@/theme/Variables'
import SvgDarkAnd from '@/components/DarkAnd'

export const HomeScreen: React.FC<{}> = (): ReactElement => {
  const { Common, Fonts, Gutters } = useTheme()

  return (
    <React.Fragment>
      <SvgDarkAnd style={styles.background} />
      <View style={styles.rootContainer}>
        {/* @summary-section: */}
        <View style={styles.summarySection}>
          <View style={styles.title}>
            <TouchableOpacity
              style={[Common.button.rounded, Gutters.regularBMargin]}
              onPress={() => {}}
            >
              <Text style={Fonts.textRegular}>{'Change-Preset'}</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.summaryContent}>
            <View style={styles.timeRemaining}>
              <Text style={Fonts.textRegular}>Time-Remaining:</Text>
              <Text style={Fonts.textRegular}>{'07:20'}</Text>
            </View>
            <View style={styles.totalTime}>
              <Text style={Fonts.textRegular}>Total-Time:</Text>
              <Text style={Fonts.textRegular}>{'07:20'}</Text>
            </View>
          </View>
        </View>

        {/* @details-section: */}
        <View style={styles.detailsSection}>
          <Text style={Fonts.textRegular}>Rest:</Text>
          <Text style={Fonts.textRegular}>{'00:15'}</Text>
          <Text style={Fonts.textRegular}>Prepare:</Text>
          <Text style={Fonts.textRegular}>{'00:08'}</Text>
          <Text style={Fonts.textRegular}>Workout:</Text>
          <Text style={Fonts.textRegular}>{'00:40'}</Text>

          <Text style={Fonts.textRegular}>Cycles:</Text>
          <Text style={Fonts.textRegular}>{'8'}</Text>
          <Text style={Fonts.textRegular}>Sets:</Text>
          <Text style={Fonts.textRegular}>{'1'}</Text>
        </View>

        {/* @action-section: */}
        <View style={styles.actionSection}>
          <View style={[styles.start]}>
            <TouchableOpacity
              style={[Common.button.rounded]}
              onPress={() => {}}
            >
              <Text style={Fonts.textRegular}>{'Start'}</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.stop}>
            <TouchableOpacity
              style={[Common.button.rounded]}
              onPress={() => {}}
            >
              <Text style={Fonts.textRegular}>{'Pause/Stop'}</Text>
            </TouchableOpacity>
          </View>
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
    paddingVertical: Spacings.s_4,
    // alignItems: 'center',
    // justifyContent: 'center',
    backgroundColor: 'lightblue', // '#202021',
    borderRadius: Radiuses.r8,
  },
  summaryContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  title: {
    alignItems: 'center',
  },
  timeRemaining: {
    alignItems: 'center',
  },
  totalTime: {
    alignItems: 'center',
  },
  // @details-section:
  detailsSection: {
    flexDirection: 'column',
    paddingHorizontal: Spacings.s_8,
    paddingVertical: Spacings.s_4,
    borderRadius: 2,
    backgroundColor: 'lightyellow', // '#202021',
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
    flex: 1,
    position: 'absolute',
  },
})
