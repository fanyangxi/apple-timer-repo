import { StyleSheet, Text, View } from 'react-native'
import { Colors, Fonts, Spacings } from '@/theme/Variables'
import React, { useState } from 'react'
import { Modalize } from 'react-native-modalize'
import { ScrollEventArgs } from '@/common/constants'
import { DeviceScreen } from '@/common/device'
import { toDTime } from '@/utils/date-util'
import DynamicallySelectedPicker from '@/components/scroll-picker/DynamicallySelectedPicker'
import { useTranslation } from 'react-i18next'

const PickerColumnsContainerWidth = DeviceScreen.width - Spacings.s_24
const PickerColumnWidth = PickerColumnsContainerWidth / 3

export interface BottomDurationPickerPopupProps {
  popupRef: React.RefObject<Modalize>
  duration?: number
  onValueChanged?: (newDuration: number) => void
}

const rawPickerItems = Array.from(Array(60).keys()).map(item => ({ value: item, label: `${item}` }))

export const BottomDurationPickerPopup: React.FC<BottomDurationPickerPopupProps> = ({
  popupRef,
  duration,
  onValueChanged,
}) => {
  const { t } = useTranslation()
  const [localHours, setLocalHours] = useState<number>(0)
  const [isScrollingHours, setIsScrollingHours] = useState<boolean>(false)
  const [localMinutes, setLocalMinutes] = useState<number>(0)
  const [isScrollingMinutes, setIsScrollingMinutes] = useState<boolean>(false)
  const [localSeconds, setLocalSeconds] = useState<number>(0)
  const [isScrollingSeconds, setIsScrollingSeconds] = useState<boolean>(false)

  const hoursDataSourceItems = rawPickerItems.slice(0, 24)
  const minutesDataSourceItems = rawPickerItems
  const secondsDataSourceItems = rawPickerItems
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
      closeOnOverlayTap={!isScrollingHours && !isScrollingMinutes && !isScrollingSeconds}
      onOpen={() => {
        const { hours, minutes, seconds } = toDTime(duration || 0)
        setLocalHours(hours)
        setLocalMinutes(minutes)
        setLocalSeconds(seconds)
      }}
      onClose={() => {
        console.log(`>>> local: ${localHours}h, ${localMinutes}m, ${localSeconds}s`)
        const newDurationSecs = localHours * 60 * 60 + localMinutes * 60 + localSeconds
        onValueChanged && onValueChanged(newDurationSecs)
      }}
    >
      <View style={[styles.rootContainer]}>
        <View style={styles.actionButtonsBar} />
        <View style={styles.content}>
          <View style={styles.pickerColumn}>
            <Text style={styles.pickerColumnTitle}>{t('durationPicker.hours')}</Text>
            <DynamicallySelectedPicker
              items={hoursDataSourceItems}
              initialSelectedIndex={localHours}
              transparentItemRows={3}
              onScrollBeginDrag={() => {
                setIsScrollingHours(true)
              }}
              onMomentumScrollEnd={(eventArgs: ScrollEventArgs) => {
                setIsScrollingHours(false)
                setLocalHours(parseInt(eventArgs.item.value, 10))
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
            <Text style={styles.pickerColumnTitle}>{t('durationPicker.minutes')}</Text>
            <DynamicallySelectedPicker
              items={minutesDataSourceItems}
              initialSelectedIndex={localMinutes}
              transparentItemRows={3}
              onScrollBeginDrag={() => {
                setIsScrollingMinutes(true)
              }}
              onMomentumScrollEnd={(eventArgs: ScrollEventArgs) => {
                setIsScrollingMinutes(false)
                setLocalMinutes(parseInt(eventArgs.item.value, 10))
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
            <Text style={styles.pickerColumnTitle}>{t('durationPicker.seconds')}</Text>
            <DynamicallySelectedPicker
              items={secondsDataSourceItems}
              initialSelectedIndex={localSeconds}
              transparentItemRows={3}
              onScrollBeginDrag={() => {
                setIsScrollingSeconds(true)
              }}
              onMomentumScrollEnd={(eventArgs: ScrollEventArgs) => {
                setIsScrollingSeconds(false)
                setLocalSeconds(parseInt(eventArgs.item.value, 10))
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
    // backgroundColor: '#A6A6A6', // == rgb( 166, 166, 166)
    // height: DEFAULT_PICKER_HEIGHT,
    // borderTopLeftRadius: RadiusSizes.r12,
    // borderTopRightRadius: RadiusSizes.r12,
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
    // paddingHorizontal: Spacings.s_24,
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
