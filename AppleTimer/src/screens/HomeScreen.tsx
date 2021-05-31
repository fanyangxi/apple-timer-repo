import React, { ReactElement } from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { useTheme } from '@/theme'
import { FontColors, Fonts, Radiuses, Spacings } from '@/theme/Variables'
import SvgComponent from '@/components/DarkAnd'
import { LinkButton, LinkButtonTheme } from '@/components/button/LinkButton'
import { Divider } from 'native-base'

export const HomeScreen: React.FC<{}> = (): ReactElement => {
  const { Common, Gutters } = useTheme()

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
          <Divider />
          <View style={styles.summaryContent}>
            <View style={styles.timeRemainingContainer}>
              <Text style={styles.itemValue}>{'07:20'}</Text>
              <Text style={styles.itemLabel}>Time-Remaining:</Text>
            </View>
            <View style={styles.totalTimeContainer}>
              <Text style={styles.itemValue}>{'07:20'}</Text>
              <Text style={styles.itemLabel}>Total-Time:</Text>
            </View>
          </View>
        </View>

        {/* @details-section: */}
        <View style={styles.detailsSection}>
          <Text style={[Fonts.textSmall, FontColors.white]}>Rest:</Text>
          <Text style={[Fonts.textSmall, FontColors.white]}>{'00:15'}</Text>
          <Text style={[Fonts.textSmall, FontColors.white]}>Prepare:</Text>
          <Text style={[Fonts.textSmall, FontColors.white]}>{'00:08'}</Text>
          <Text style={[Fonts.textSmall, FontColors.white]}>Workout:</Text>
          <Text style={[Fonts.textSmall, FontColors.white]}>{'00:40'}</Text>

          <Text style={[Fonts.textSmall, FontColors.white]}>Cycles:</Text>
          <Text style={[Fonts.textSmall, FontColors.white]}>{'8'}</Text>
          <Text style={[Fonts.textSmall, FontColors.white]}>Sets:</Text>
          <Text style={[Fonts.textSmall, FontColors.white]}>{'1'}</Text>
        </View>

        {/* @action-section: */}
        <View style={styles.actionSection}>
          <View style={[styles.start]}>
            <TouchableOpacity style={[Common.button.rounded]} onPress={() => {}}>
              <Text style={Fonts.textRegular}>{'Start'}</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.stop}>
            <TouchableOpacity style={[Common.button.rounded]} onPress={() => {}}>
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
    backgroundColor: '#202021', // '#202021',
    borderRadius: Radiuses.r4,
  },
  summaryContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  title: {
    alignItems: 'center',
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
    ...Fonts.textRegular,
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
