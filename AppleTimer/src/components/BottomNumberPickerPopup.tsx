import { StyleSheet, Text, View } from 'react-native'
import { Colors, Fonts, Spacings } from '@/theme/Variables'
import React, { useState } from 'react'
import { Modalize } from 'react-native-modalize'
import { ScrollEventArgs } from '@/common/constants'
import { DeviceScreen } from '@/common/device'
import DynamicallySelectedPicker from '@/components/scroll-picker/DynamicallySelectedPicker'

const PickerColumnsContainerWidth = DeviceScreen.width - Spacings.s_24

export interface BottomPickerPopupProps {
  popupRef: React.RefObject<Modalize>
  value?: number
  pickerTitle?: string
  onValueChanged?: (newValue: number) => void
}

const numbersSourceItems = Array.from(Array(50).keys()).map(item => {
  const current = item + 1
  return { value: current, label: `${current}` }
})

export const BottomNumberPickerPopup: React.FC<BottomPickerPopupProps> = ({
  popupRef,
  value,
  pickerTitle,
  onValueChanged,
}) => {
  const [localValue, setLocalValue] = useState<number>(0)
  const [isScrolling, setIsScrolling] = useState<boolean>(false)

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
      modalStyle={{ backgroundColor: 'rgba( 166, 166, 166, 1 )' }}
      panGestureEnabled={false}
      withHandle={false}
      closeOnOverlayTap={!isScrolling}
      onOpen={() => {
        setLocalValue(value || 0)
      }}
      onClose={() => {
        console.log(`>>> local: ${localValue}`)
        onValueChanged && onValueChanged(localValue)
      }}
    >
      <View style={[styles.rootContainer]}>
        <View style={styles.actionButtonsBar} />
        <View style={styles.content}>
          <View style={styles.pickerColumn}>
            <Text style={styles.pickerColumnTitle}>{pickerTitle ?? 'Number'}</Text>
            <DynamicallySelectedPicker
              items={numbersSourceItems}
              initialSelectedIndex={numbersSourceItems.findIndex(item => item.value === localValue)}
              transparentItemRows={3}
              onScrollBeginDrag={() => {
                setIsScrolling(true)
              }}
              onMomentumScrollEnd={(event: ScrollEventArgs) => {
                // console.log(`onMomentumScrollEnd: ${event.index}, ${JSON.stringify(event.item)}`)
                setIsScrolling(false)
                setLocalValue(parseInt(event.item.value, 10))
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
    // height: DEFAULT_PICKER_HEIGHT,
    // borderTopLeftRadius: RadiusSizes.r12,
    // borderTopRightRadius: RadiusSizes.r12,
    // backgroundColor: '#A6A6A6', // == rgb( 166, 166, 166)
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
    height: 4,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    // paddingHorizontal: Spacings.s_8,
    // borderTopLeftRadius: RadiusSizes.r12,
    // borderTopRightRadius: RadiusSizes.r12,
    // backgroundColor: Colors.linenDark,
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
    ...Fonts.titleRegular,
    paddingTop: Spacings.s_16,
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
