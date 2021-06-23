import { Platform, StyleSheet, Text, View } from 'react-native'
import { Colors, RadiusSizes, Spacings } from '@/theme/Variables'
import React, { useState } from 'react'
import { Preset } from '@/models/preset'
import { Modalize } from 'react-native-modalize'
import ReactNativeHapticFeedback from 'react-native-haptic-feedback'
import { HAPTIC_FEEDBACK_OPTIONS, ScrollEventArgs } from '@/common/constants'
// @ts-ignore
import DynamicallySelectedPicker from 'react-native-dynamically-selected-picker'
import { DeviceScreen } from '@/common/device'
import { toShortTime } from '@/utils/date-util'

const DEFAULT_PICKER_HEIGHT = 340
const PickerColumnsContainerWidth = DeviceScreen.width - Spacings.s_24
const PickerColumnWidth = PickerColumnsContainerWidth / 3

export interface BottomDurationPickerPopupProps {
  popupRef: React.RefObject<Modalize>
  duration?: number
  height?: number
  onValueChanged?: (newDuration: number) => void
}

export const BottomDurationPickerPopup: React.FC<BottomDurationPickerPopupProps> = ({
  popupRef,
  duration,
  height,
  onValueChanged,
}) => {
  const [localHours, setLocalHours] = useState<number>(0)
  const [localMinutes, setLocalMinutes] = useState<number>(0)
  const [localSeconds, setLocalSeconds] = useState<number>(0)

  const hoursDataSourceItems = Array.from(Array(24).keys()).map(item => ({ value: item, label: `${item}` }))
  const minutesDataSourceItems = Array.from(Array(59).keys()).map(item => ({ value: item, label: `${item}` }))
  const secondsDataSourceItems = Array.from(Array(59).keys()).map(item => ({ value: item, label: `${item}` }))
  const topGradientColors = [
    'rgba( 166, 166, 166, 1 )',
    'rgba( 166, 166, 166, 0.9 )',
    'rgba( 166, 166, 166, 0.7 )',
    'rgba( 166, 166, 166, 0.5 )',
  ]
  const bottomGradientColors = [
    'rgba( 166, 166, 166, 0.5 )',
    'rgba( 166, 166, 166, 0.7 )',
    'rgba( 166, 166, 166, 0.9 )',
    'rgba( 166, 166, 166, 1 )',
  ]

  return (
    <Modalize
      ref={popupRef}
      adjustToContentHeight={true}
      panGestureEnabled={true}
      onOpen={() => {
        const [initialHours, initialMinutes, initialSeconds] = toShortTime(duration || 0)
        setLocalHours(initialHours)
        setLocalMinutes(initialMinutes)
        setLocalSeconds(initialSeconds)
      }}
      onClose={() => {
        console.log(`>>> local: h${localHours}, m${localMinutes}, s${localSeconds}`)
        const newDurationSecs = localHours * 60 * 60 + localMinutes * 60 + localSeconds
        onValueChanged && onValueChanged(newDurationSecs)
      }}
    >
      <View style={[styles.rootContainer, { height: height || DEFAULT_PICKER_HEIGHT }]}>
        <View style={styles.actionButtonsBar}>
          <Text>Your Presets</Text>
        </View>
        <View style={styles.content}>
          <View style={styles.pickerColumn}>
            <Text style={styles.pickerColumnTitle}>Hours</Text>
            <DynamicallySelectedPicker
              items={hoursDataSourceItems}
              initialSelectedIndex={localHours}
              transparentItemRows={3}
              onScroll={({ index, item }: ScrollEventArgs) => {
                console.log(`OnScroll hours: ${index}, ${JSON.stringify(item)}`)
                setLocalHours(parseInt(item.value, 10))
                ReactNativeHapticFeedback.trigger(
                  Platform.select({ ios: 'impactLight', android: 'impactLight', default: 'impactLight' }),
                  HAPTIC_FEEDBACK_OPTIONS,
                )
              }}
              width={PickerColumnWidth}
              height={266}
              allItemsColor={Colors.text}
              selectedItemBorderColor={Colors.nevada}
              fontSize={22}
              topGradientColors={topGradientColors}
              bottomGradientColors={bottomGradientColors}
            />
          </View>
          <View style={styles.pickerColumn}>
            <Text style={styles.pickerColumnTitle}>Minutes</Text>
            <DynamicallySelectedPicker
              items={minutesDataSourceItems}
              initialSelectedIndex={localMinutes}
              transparentItemRows={3}
              onScroll={({ index, item }: ScrollEventArgs) => {
                console.log(`OnScroll minutes: ${index}, ${JSON.stringify(item)}`)
                setLocalMinutes(parseInt(item.value, 10))
                ReactNativeHapticFeedback.trigger(
                  Platform.select({ ios: 'impactLight', android: 'impactLight', default: 'impactLight' }),
                  HAPTIC_FEEDBACK_OPTIONS,
                )
              }}
              width={PickerColumnWidth}
              height={266}
              allItemsColor={Colors.text}
              selectedItemBorderColor={Colors.nevada}
              fontSize={22}
              topGradientColors={topGradientColors}
              bottomGradientColors={bottomGradientColors}
            />
          </View>
          <View style={styles.pickerColumn}>
            <Text style={styles.pickerColumnTitle}>Seconds</Text>
            <DynamicallySelectedPicker
              items={secondsDataSourceItems}
              initialSelectedIndex={localSeconds}
              transparentItemRows={3}
              onScroll={({ index, item }: ScrollEventArgs) => {
                console.log(`OnScroll seconds: ${index}, ${JSON.stringify(item)}`)
                setLocalSeconds(parseInt(item.value, 10))
                ReactNativeHapticFeedback.trigger(
                  Platform.select({ ios: 'impactLight', android: 'impactLight', default: 'impactLight' }),
                  HAPTIC_FEEDBACK_OPTIONS,
                )
              }}
              width={PickerColumnWidth}
              height={266}
              allItemsColor={Colors.text}
              selectedItemBorderColor={Colors.nevada}
              fontSize={22}
              topGradientColors={topGradientColors}
              bottomGradientColors={bottomGradientColors}
            />
          </View>
        </View>
      </View>
    </Modalize>
  )
}

const styles = StyleSheet.create({
  rootContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    height: DEFAULT_PICKER_HEIGHT,
    borderTopLeftRadius: RadiusSizes.r12,
    borderTopRightRadius: RadiusSizes.r12,
    backgroundColor: '#A6A6A6', // == rgb( 166, 166, 166)
  },
  row: {
    // marginTop: 50,
    // backgroundColor: 'lightgrey',
    flexDirection: 'column',
    alignItems: 'center',
    paddingVertical: Spacings.s_4,
  },
  actionButtonsBar: {
    flexGrow: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacings.s_8,
    borderTopLeftRadius: RadiusSizes.r12,
    borderTopRightRadius: RadiusSizes.r12,
    backgroundColor: Colors.linenDark,
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pickerColumn: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  pickerColumnTitle: {
    paddingVertical: Spacings.s_8,
    fontWeight: 'bold',
  },
  background: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: '100%',
    height: '100%',
  },
  optionsSetScroll: {
    flexGrow: 0,
    marginHorizontal: Spacings.s_4,
    marginVertical: Spacings.s_8,
    minWidth: 90,
    backgroundColor: 'lightblue',
  },
})
