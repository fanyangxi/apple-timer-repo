import React, { ReactElement } from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { useTheme } from '@/theme'
import { FontColors, Fonts, Radiuses, Spacings } from '@/theme/Variables'
import SvgComponent from '@/components/DarkAnd'
import { LinkButton, LinkButtonTheme } from '@/components/button/LinkButton'
import { Divider } from 'native-base'

export const HomeScreen: React.FC<{}> = (): ReactElement => {
  const { Common } = useTheme()

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
              <Text style={styles.itemLabel}>Current Phase: Workout</Text>
              <Text style={[Fonts.textSmall, FontColors.white]}>{'00:36'}</Text>
            </View>
          </View>
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
