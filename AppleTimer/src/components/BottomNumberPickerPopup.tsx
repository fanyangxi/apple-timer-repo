import { Platform, StyleSheet, Text, View } from 'react-native'
import { Colors, RadiusSizes, Spacings } from '@/theme/Variables'
import React, { useState } from 'react'
import { Modalize } from 'react-native-modalize'
import ReactNativeHapticFeedback from 'react-native-haptic-feedback'
import { HAPTIC_FEEDBACK_OPTIONS, ScrollEventArgs } from '@/common/constants'
// @ts-ignore
import DynamicallySelectedPicker from 'react-native-dynamically-selected-picker'
import { DeviceScreen } from '@/common/device'

const DEFAULT_PICKER_HEIGHT = 340
const PickerColumnsContainerWidth = DeviceScreen.width - Spacings.s_24

export interface BottomPickerPopupProps {
  popupRef: React.RefObject<Modalize>
  value?: number
  height?: number
  onValueChanged?: (newValue: number) => void
}

export const BottomNumberPickerPopup: React.FC<BottomPickerPopupProps> = ({
  popupRef,
  value,
  height,
  onValueChanged,
}) => {
  const [localValue, setLocalValue] = useState<number>(0)

  const numbersSourceItems = Array.from(Array(50).keys()).map(item => ({ value: item, label: `${item}` }))
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
        setLocalValue(value || 0)
      }}
      onClose={() => {
        console.log(`>>> local: h${localValue}`)
        onValueChanged && onValueChanged(localValue)
      }}
    >
      <View style={[styles.rootContainer, { height: height || DEFAULT_PICKER_HEIGHT }]}>
        <View style={styles.actionButtonsBar}>
          <Text>Select a number:</Text>
        </View>
        <View style={styles.content}>
          <View style={styles.pickerColumn}>
            <Text style={styles.pickerColumnTitle}>Hours</Text>
            <DynamicallySelectedPicker
              items={numbersSourceItems}
              initialSelectedIndex={localValue}
              transparentItemRows={3}
              onScroll={({ index, item }: ScrollEventArgs) => {
                console.log(`OnScroll: ${index}, ${JSON.stringify(item)}`)
                setLocalValue(parseInt(item.value, 10))
                ReactNativeHapticFeedback.trigger(
                  Platform.select({ ios: 'impactLight', android: 'impactLight', default: 'impactLight' }),
                  HAPTIC_FEEDBACK_OPTIONS,
                )
              }}
              width={PickerColumnsContainerWidth}
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
