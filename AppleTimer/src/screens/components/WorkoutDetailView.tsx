import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Neomorph } from 'react-native-neomorph-shadows'
import { DeviceScreen } from '@/common/device'
import { FontColors, Fonts, RadiusSizes, Spacings } from '@/theme/Variables'
import { TickedPreset } from '@/models/preset'

export interface WorkoutDetailViewProps {
  tickedPreset?: TickedPreset
}

export const WorkoutDetailView: React.FC<WorkoutDetailViewProps> = ({ tickedPreset }) => {
  return (
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
  )
}

const styles = StyleSheet.create({
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
  summaryContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
})
