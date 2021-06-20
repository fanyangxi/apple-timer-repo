import { Platform, StyleSheet, Text, Vibration, View } from 'react-native'
import { RadiusSizes, Spacings } from '@/theme/Variables'
import React, { useState } from 'react'
import { Preset } from '@/models/preset'
import { DeviceScreen } from '@/common/device'
import { Modalize } from 'react-native-modalize'
// @ts-ignore
import DynamicallySelectedPicker from 'react-native-dynamically-selected-picker'
// import ScreenContainer from '@/components/ScreenContainer'
import WheelPicker from 'react-native-wheely'
// import SegmentedPicker from 'react-native-segmented-picker'
// import Picker from '@gregfrench/react-native-wheel-picker'
// var PickerItem = Picker.Item
// import ScrollPicker from 'react-native-wheely-simple-picker'
// import { WheelPicker, TimePicker, DatePicker } from 'react-native-wheel-picker-android'
import ScrollPicker from 'react-native-wheel-scroll-picker'
import { Picker, DatePicker } from 'react-native-wheel-pick'
import ReactNativeHapticFeedback from 'react-native-haptic-feedback'

const options = {
  enableVibrateFallback: true,
  ignoreAndroidSystemSettings: true,
}

const DEFAULT_PICKER_HEIGHT = 200

interface Option {
  name: string
  value: string
}

interface OptionsSet {
  name: string
  options: Option[]
}

export interface BottomPickerPopupProps {
  popupRef: React.RefObject<Modalize>
  optionsSets: OptionsSet[]
  height?: number
  current?: Preset
  onSelectionChanged?: (selected: Preset) => void
  onAddClicked?: () => void
}

export const BottomPickerPopup: React.FC<BottomPickerPopupProps> = ({
  popupRef,
  optionsSets,
  height,
  onSelectionChanged,
  onAddClicked,
}) => {
  // const renderOptionsSet = (optionsSet: OptionsSet) => (
  //   // <ScrollView
  //   //   style={styles.optionsSetScroll}
  //   //   contentContainerStyle={styles.optionsSetScrollContent}
  //   //   showsVerticalScrollIndicator={false}
  //   //   bounces={true}
  //   // >
  //   //   {optionsSet.options.map(option => (
  //   //     <View key={option.value} style={styles.option}>
  //   //       <Text style={Fonts.textRegular}>N:{option.name}</Text>
  //   //     </View>
  //   //   ))}
  //   // </ScrollView>
  //   // <ScrollPicker
  //   //   key={'optionsSet.name'}
  //   //   dataSource={['a', 'b', 'c', 'd']}
  //   //   selectedIndex={1}
  //   //   itemHeight={50}
  //   //   // wrapperHeight={250}
  //   //   wrapperWidth={80}
  //   //   wrapperColor={'#ffffff'}
  //   //   highlightColor={'red'}
  //   //   renderItem={(data, index, isSelected) => {
  //   //     // return (
  //   //     //   <View>
  //   //     //     <Text>{data}</Text>
  //   //     //   </View>
  //   //     // )
  //   //   }}
  //   //   onValueChange={(data, selectedIndex) => {}}
  //   // />
  // )
  const [selectedIndex, setSelectedIndex] = useState(0)
  return (
    <Modalize ref={popupRef} adjustToContentHeight={true}>
      <View style={[styles.rootContainer, { height: height || DEFAULT_PICKER_HEIGHT }]}>
        {/*<Picker*/}
        {/*  style={{ backgroundColor: 'white', width: 300, height: 215 }}*/}
        {/*  selectedValue="item4"*/}
        {/*  pickerData={['item1', 'item2', 'item3', 'item4', 'item5', 'item6', 'item7']}*/}
        {/*  onValueChange={value => {}}*/}
        {/*  itemSpace={30} // this only support in android*/}
        {/*/>*/}

        <ScrollPicker
          dataSource={['a', 'b', 'c', 'd']}
          selectedIndex={1}
          renderItem={(data, index, isSelected) => {
            //
          }}
          onValueChange={(data, selectedIndex) => {
            //
          }}
          onScrollEndDrag={() => {
            ReactNativeHapticFeedback.trigger('impactLight', options)
          }}
          wrapperHeight={180}
          wrapperWidth={150}
          wrapperBackground={'#FFFFFF'}
          itemHeight={60}
          highlightColor={'#d8d8d8'}
          highlightBorderWidth={2}
          activeItemColor={'#222121'}
          itemColor={'#B4B4B4'}
        />

        {/*<WheelPicker*/}
        {/*  // selectedItem={this.state.selectedItem}*/}
        {/*  data={['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday']}*/}
        {/*  // onItemSelected={this.onItemSelected}*/}
        {/*/>*/}

        {/*<Picker*/}
        {/*  style={{ width: 150, height: 180 }}*/}
        {/*  lineColor="#000000" //to set top and bottom line color (Without gradients)*/}
        {/*  lineGradientColorFrom="#008000" //to set top and bottom starting gradient line color*/}
        {/*  lineGradientColorTo="#FF5733" //to set top and bottom ending gradient*/}
        {/*  // selectedValue={this.state.selectedItem}*/}
        {/*  itemStyle={{ color: 'black', fontSize: 26 }}*/}
        {/*  // onValueChange={index => this.onPickerSelect(index)}*/}
        {/*>*/}
        {/*  {['Item 1', 'Item 2', 'Item 3', 'Item 4', 'Item 5'].map((value, i) => (*/}
        {/*    <PickerItem label={value} value={i} key={i} />*/}
        {/*  ))}*/}
        {/*</Picker>*/}

        {/*<WheelPicker*/}
        {/*  selectedIndex={1}*/}
        {/*  options={['Berlin', 'London', 'Amsterdam', 'a', 'b', 'c', 'd']}*/}
        {/*  scrollEventThrottle={0.1}*/}
        {/*  onChange={index => {*/}
        {/*    setSelectedIndex(index)*/}
        {/*    ReactNativeHapticFeedback.trigger('impactLight', options)*/}
        {/*  }}*/}
        {/*/>*/}

        {/*<Text style={Fonts.textRegular}>Name:preset ...1</Text>*/}
        {/*{optionsSets && optionsSets.map(optionsSet => renderOptionsSet(optionsSet))}*/}
        {/*{renderOptionsSet(optionsSets[0])}*/}
        {/*<Picker></Picker>*/}
        {/*<ScrollPicker*/}
        {/*  dataSource={['a', 'b', 'c', 'd']}*/}
        {/*  selectedIndex={1}*/}
        {/*  renderItem={(data, index, isSelected) => {*/}
        {/*    //*/}
        {/*  }}*/}
        {/*  onValueChange={(data, selectedIndex) => {*/}
        {/*    //*/}
        {/*  }}*/}
        {/*  // wrapperHeight={180}*/}
        {/*  // wrapperWidth={150}*/}
        {/*  wrapperBackground={'#FFFFFF'}*/}
        {/*  itemHeight={50}*/}
        {/*  highlightColor={'#d8d8d8'}*/}
        {/*  highlightBorderWidth={3}*/}
        {/*  activeItemColor={'#222121'}*/}
        {/*  itemColor={'#B4B4B4'}*/}
        {/*/>*/}

        <DynamicallySelectedPicker
          items={[
            { value: 1, label: 'Item 1' },
            { value: 2, label: 'Item 2' },
            { value: 3, label: 'Item 3' },
            { value: 4, label: 'Item 4' },
            { value: 5, label: 'Item 5' },
            { value: 6, label: 'Item 6' },
            { value: 7, label: 'Item 7' },
            { value: 8, label: 'Item 8' },
            { value: 9, label: 'Item 9' },
            { value: 10, label: 'Item 10' },
            { value: 11, label: 'Item 11' },
            { value: 12, label: 'Item 12' },
            { value: 13, label: 'Item 13' },
          ]}
          initialSelectedIndex={2}
          transparentItemRows={2}
          onScroll={({ index, item }) => {
            // this.updateSelectedItem(index);
            // Vibration.vibrate(10, false)
            ReactNativeHapticFeedback.trigger('impactLight', options)
          }}
          width={90}
          height={DEFAULT_PICKER_HEIGHT - 20}
          allItemsColor={'#000'}
          // selectedItemBorderColor={'red'}
          // fontSize={18}
          topGradientColors={[
            'rgba( 0, 0, 0, 1 )',
            'rgba( 0, 0, 0, 0.9 )',
            'rgba( 0, 0, 0, 0.7 )',
            'rgba( 0, 0, 0, 0.5 )',
          ]}
          bottomGradientColors={[
            'rgba( 0, 0, 0, 0.5 )',
            'rgba( 0, 0, 0, 0.7 )',
            'rgba( 0, 0, 0, 0.9 )',
            'rgba( 0, 0, 0, 1 )',
          ]}
        />

        {/*<DynamicallySelectedPicker*/}
        {/*  items={[*/}
        {/*    {*/}
        {/*      value: 1,*/}
        {/*      label: 'Item 1',*/}
        {/*    },*/}
        {/*    {*/}
        {/*      value: 2,*/}
        {/*      label: 'Item 2',*/}
        {/*    },*/}
        {/*    {*/}
        {/*      value: 3,*/}
        {/*      label: 'Item 3',*/}
        {/*    },*/}
        {/*    {*/}
        {/*      value: 4,*/}
        {/*      label: 'Item 4',*/}
        {/*    },*/}
        {/*    {*/}
        {/*      value: 5,*/}
        {/*      label: 'Item 5',*/}
        {/*    },*/}
        {/*  ]}*/}
        {/*  initialSelectedIndex={2}*/}
        {/*  transparentItemRows={2}*/}
        {/*  onScroll={({ index, item }) => {*/}
        {/*    // this.updateSelectedItem(index);*/}
        {/*  }}*/}
        {/*  width={90}*/}
        {/*  height={DEFAULT_PICKER_HEIGHT - 20}*/}
        {/*  // allItemsColor={'#000'}*/}
        {/*  // selectedItemBorderColor={'red'}*/}
        {/*  // fontSize={18}*/}
        {/*  topGradientColors={[*/}
        {/*    'rgba( 255, 255, 255, 1 )',*/}
        {/*    'rgba( 255, 255, 255, 0.9 )',*/}
        {/*    'rgba( 255, 255, 255, 0.7 )',*/}
        {/*    'rgba( 255, 255, 255, 0.5 )',*/}
        {/*  ]}*/}
        {/*  bottomGradientColors={[*/}
        {/*    'rgba( 255, 255, 255, 0.5 )',*/}
        {/*    'rgba( 255, 255, 255, 0.7 )',*/}
        {/*    'rgba( 255, 255, 255, 0.9 )',*/}
        {/*    'rgba( 255, 255, 255, 1 )',*/}
        {/*  ]}*/}
        {/*/>*/}

        {/*<DynamicallySelectedPicker*/}
        {/*  items={[*/}
        {/*    {*/}
        {/*      value: 1,*/}
        {/*      label: 'Item 1',*/}
        {/*    },*/}
        {/*    {*/}
        {/*      value: 2,*/}
        {/*      label: 'Item 2',*/}
        {/*    },*/}
        {/*    {*/}
        {/*      value: 3,*/}
        {/*      label: 'Item 3',*/}
        {/*    },*/}
        {/*    {*/}
        {/*      value: 4,*/}
        {/*      label: 'Item 4',*/}
        {/*    },*/}
        {/*    {*/}
        {/*      value: 5,*/}
        {/*      label: 'Item 5',*/}
        {/*    },*/}
        {/*  ]}*/}
        {/*  initialSelectedIndex={2}*/}
        {/*  transparentItemRows={2}*/}
        {/*  onScroll={({ index, item }) => {*/}
        {/*    // this.updateSelectedItem(index);*/}
        {/*  }}*/}
        {/*  width={90}*/}
        {/*  height={DEFAULT_PICKER_HEIGHT - 20}*/}
        {/*  // allItemsColor={'#000'}*/}
        {/*  // selectedItemBorderColor={'red'}*/}
        {/*  // fontSize={18}*/}
        {/*  topGradientColors={[*/}
        {/*    'rgba( 255, 255, 255, 1 )',*/}
        {/*    'rgba( 255, 255, 255, 0.9 )',*/}
        {/*    'rgba( 255, 255, 255, 0.7 )',*/}
        {/*    'rgba( 255, 255, 255, 0.5 )',*/}
        {/*  ]}*/}
        {/*  bottomGradientColors={[*/}
        {/*    'rgba( 255, 255, 255, 0.5 )',*/}
        {/*    'rgba( 255, 255, 255, 0.7 )',*/}
        {/*    'rgba( 255, 255, 255, 0.9 )',*/}
        {/*    'rgba( 255, 255, 255, 1 )',*/}
        {/*  ]}*/}
        {/*/>*/}
      </View>
    </Modalize>
  )
}

const styles = StyleSheet.create({
  rootContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    height: DeviceScreen.height * 0.6,
    borderTopLeftRadius: RadiusSizes.r12,
    borderTopRightRadius: RadiusSizes.r12,
    paddingTop: 12,
    backgroundColor: '#FFF',
  },
  row: {
    // marginTop: 50,
    // backgroundColor: 'lightgrey',
    flexDirection: 'column',
    alignItems: 'center',
    paddingVertical: Spacings.s_4,
  },
  background: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: '100%',
    height: '100%',
  },
  actionButtonsBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacings.s_8,
    // backgroundColor: 'yellow',
  },
  itemsContent: {
    // flex: 1,
    // backgroundColor: 'lightgreen',
    // paddingTop: defaultSpacing(SpacingType.Base),
    // paddingHorizontal: defaultSpacing(SpacingType.Medium),
    paddingBottom: Spacings.s_24,
  },
  itemsSeparator: {
    height: Spacings.s_8,
  },
  listContent: {
    // backgroundColor: 'yellow',
  },
  card: {
    paddingHorizontal: Spacings.s_12,
    // backgroundColor: '#434343',
  },
  optionsSetScroll: {
    flexGrow: 0,
    marginHorizontal: Spacings.s_4,
    marginVertical: Spacings.s_8,
    minWidth: 90,
    backgroundColor: 'lightblue',
  },
  optionsSetScrollContent: {
    alignItems: 'center',
  },
  option: {
    paddingHorizontal: Spacings.s_8,
    backgroundColor: 'lightgreen',
    marginTop: 44,
  },
})

/*<FlatList*/
/*  data={presets}*/
/*  contentContainerStyle={styles.listContent}*/
/*  renderItem={({ item }) => renderItem(item)}*/
/*  keyExtractor={item => item.Name}*/
/*  ItemSeparatorComponent={() => <View style={styles.separator} />}*/
/*/>*/
/*<Text>YOUR CUSTOM COMPONENT INSIDE THE ACTIONSHEET</Text>*/
