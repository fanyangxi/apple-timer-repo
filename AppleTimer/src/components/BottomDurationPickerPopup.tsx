import { Button, Platform, StyleSheet, Text, View } from 'react-native'
import { Colors, RadiusSizes, Spacings } from '@/theme/Variables'
import React from 'react'
import { Preset } from '@/models/preset'
import { Modalize } from 'react-native-modalize'
import ReactNativeHapticFeedback from 'react-native-haptic-feedback'
import { HAPTIC_FEEDBACK_OPTIONS, ScrollEventArgs } from '@/common/constants'
// @ts-ignore
import DynamicallySelectedPicker from 'react-native-dynamically-selected-picker'
import { DeviceScreen } from '@/common/device'

const DEFAULT_PICKER_HEIGHT = 340
const PickerColumnsContainerWidth = DeviceScreen.width - Spacings.s_24
const PickerColumnWidth = PickerColumnsContainerWidth / 3

export interface BottomPickerPopupProps {
  popupRef: React.RefObject<Modalize>
  height?: number
  current?: Preset
  onSelectionChanged?: (selected: Preset) => void
  onAddClicked?: () => void
}

export const BottomDurationPickerPopup: React.FC<BottomPickerPopupProps> = ({ popupRef, height, onAddClicked }) => {
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
    <Modalize ref={popupRef} adjustToContentHeight={true} panGestureEnabled={true}>
      <View style={[styles.rootContainer, { height: height || DEFAULT_PICKER_HEIGHT }]}>
        <View style={styles.actionButtonsBar}>
          <Text>Your Presets</Text>
          <Button title={'ADD'} onPress={() => onAddClicked && onAddClicked()} />
        </View>
        <View style={styles.content}>
          <View style={styles.pickerColumn}>
            <Text style={styles.pickerColumnTitle}>Hours</Text>
            <DynamicallySelectedPicker
              items={hoursDataSourceItems}
              initialSelectedIndex={3}
              transparentItemRows={3}
              onScroll={({ index, item }: ScrollEventArgs) => {
                console.log(`OnScroll: ${index}, ${JSON.stringify(item)}`)
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
              initialSelectedIndex={3}
              transparentItemRows={3}
              onScroll={({ index, item }: ScrollEventArgs) => {
                console.log(`OnScroll: ${index}, ${JSON.stringify(item)}`)
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
              initialSelectedIndex={3}
              transparentItemRows={3}
              onScroll={({ index, item }: ScrollEventArgs) => {
                console.log(`OnScroll: ${index}, ${JSON.stringify(item)}`)
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
