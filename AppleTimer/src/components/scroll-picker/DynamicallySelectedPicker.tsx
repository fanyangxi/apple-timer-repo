import React from 'react'
import { StyleSheet, View, ScrollView, Platform } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import PickerListItem from './PickerListItem'

type DynamicallySelectedPickerProps = {
  items?: {
    value?: string | number
    label?: string
    itemColor?: string
  }[]
  onScroll?: (...args: any[]) => any
  onMomentumScrollBegin?: (...args: any[]) => any
  onMomentumScrollEnd?: (...args: any[]) => any
  onScrollBeginDrag?: (...args: any[]) => any
  onScrollEndDrag?: (...args: any[]) => any
  initialSelectedIndex?: number
  transparentItemRows?: number
  height?: number
  width?: number
  allItemsColor?: string
  selectedItemBorderColor?: string
  fontSize?: number
  fontFamily?: string
  topGradientColors?: any[]
  bottomGradientColors?: any[]
}

type DynamicallySelectedPickerState = {
  itemIndex: any
  itemHeight: number
  lastScrollPos: number
}

export default class DynamicallySelectedPicker extends React.Component<
  DynamicallySelectedPickerProps,
  DynamicallySelectedPickerState
> {
  constructor(props: DynamicallySelectedPickerProps) {
    super(props)
    let itemHeight = this.props.height / (this.props.transparentItemRows * 2 + 1)
    if (Platform.OS === 'ios') {
      itemHeight = Math.ceil(itemHeight)
    }
    this.state = {
      itemHeight: itemHeight,
      itemIndex: this.props.initialSelectedIndex,
      lastScrollPos: 0,
    }
  }
  static getDerivedStateFromProps(nextProps, prevState) {
    return {
      itemIndex: nextProps.initialSelectedIndex,
    }
  }
  scrollToInitialPosition = () => {
    this.scrollViewRef.scrollTo({
      y: this.state.itemHeight * this.props.initialSelectedIndex,
    })
  }
  scrollToPosition = index => {
    this.scrollViewRef.scrollTo({
      y: this.state.itemHeight * index,
    })
  }
  fakeItems(n = 3) {
    const itemsArr = []
    for (let i = 0; i < n; i++) {
      itemsArr[i] = {
        value: -1,
        label: '',
      }
    }
    return itemsArr
  }
  allItemsLength() {
    return this.extendedItems().length - this.props.transparentItemRows * 2
  }
  onScroll(event) {
    const { items, onScroll } = this.props
    const tempIndex = this.getItemTemporaryIndex(event)
    if (this.state.itemIndex !== tempIndex && tempIndex >= 0 && tempIndex < this.allItemsLength()) {
      this.setItemIndex(tempIndex)
      onScroll({ index: tempIndex, item: items[tempIndex] })
    }
  }
  onMomentumScrollBegin(event) {
    const { items, onMomentumScrollBegin } = this.props
    const tempIndex = this.getItemTemporaryIndex(event)
    if (tempIndex >= 0 && tempIndex < this.allItemsLength()) {
      this.setItemIndex(tempIndex)
      onMomentumScrollBegin({ index: tempIndex, item: items[tempIndex] })
    }
  }
  onMomentumScrollEnd(event) {
    const { items, onMomentumScrollEnd } = this.props
    const tempIndex = this.getItemTemporaryIndex(event)
    if (tempIndex >= 0 && tempIndex < this.allItemsLength()) {
      this.setItemIndex(tempIndex)
      onMomentumScrollEnd({ index: tempIndex, item: items[tempIndex] })
    }
  }
  onScrollBeginDrag(event) {
    const { items, onScrollBeginDrag } = this.props
    const tempIndex = this.getItemTemporaryIndex(event)
    if (tempIndex >= 0 && tempIndex < this.allItemsLength()) {
      this.setItemIndex(tempIndex)
      onScrollBeginDrag({ index: tempIndex, item: items[tempIndex] })
    }
  }
  onScrollEndDrag(event) {
    const { items, onScrollEndDrag } = this.props
    const tempIndex = this.getItemTemporaryIndex(event)
    if (tempIndex >= 0 && tempIndex < this.allItemsLength()) {
      this.setItemIndex(tempIndex)
      onScrollEndDrag({ index: tempIndex, item: items[tempIndex] })
    }
  }
  getItemTemporaryIndex(event) {
    return Math.round(event.nativeEvent.contentOffset.y / this.state.itemHeight)
  }
  setItemIndex(index) {
    this.setState({
      itemIndex: index,
    })
  }
  extendedItems() {
    const { transparentItemRows } = this.props
    return [...this.fakeItems(transparentItemRows), ...this.props.items, ...this.fakeItems(transparentItemRows)]
  }
  render() {
    const { itemIndex, itemHeight } = this.state
    const {
      width,
      height,
      topGradientColors,
      bottomGradientColors,
      transparentItemRows,
      allItemsColor,
      fontSize,
      fontFamily,
      selectedItemBorderColor,
    } = this.props
    return (
      <View style={{ height: height, width: width }}>
        <ScrollView
          ref={ref => {
            this.scrollViewRef = ref
          }}
          // decelerationRate={'normal'}
          scrollEventThrottle={16}
          onLayout={this.scrollToInitialPosition}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          onMomentumScrollBegin={event => {
            // this.onMomentumScrollBegin(event)
          }}
          onMomentumScrollEnd={event => {
            // this.onMomentumScrollEnd(event)
          }}
          onScrollBeginDrag={event => {
            // this.onScrollBeginDrag(event)
          }}
          onScrollEndDrag={event => {
            // this.onScrollEndDrag(event)
          }}
          onScroll={event => {
            // const currentScrollPos = event.nativeEvent.contentOffset.y
            // const sensitivity = 50
            //
            // if (Math.abs(currentScrollPos - this.state.lastScrollPos) > sensitivity) {
            //   this.onScroll(event)
            //   this.setState({ lastScrollPos: event.nativeEvent.contentOffset.y })
            // }
            console.log(`>>> ScrollView onScroll: x= ${event.nativeEvent.contentOffset.y}`)
            this.onScroll(event)
          }}
          initialScrollIndex={itemIndex}
          snapToInterval={itemHeight}
        >
          {this.extendedItems().map((item, index) => {
            return (
              <PickerListItem
                key={index}
                label={item.label}
                itemColor={item.itemColor}
                allItemsColor={allItemsColor}
                fontSize={fontSize ? fontSize : itemHeight / 2}
                fontFamily={fontFamily}
                style={[
                  styles.listItem,
                  {
                    height: itemHeight,
                  },
                ]}
              />
            )
          })}
        </ScrollView>
        <View
          style={[
            styles.gradientWrapper,
            {
              top: 0,
              borderBottomWidth: 1,
              borderBottomColor: selectedItemBorderColor,
            },
          ]}
          pointerEvents="none"
        >
          <LinearGradient
            colors={topGradientColors}
            style={[
              styles.pickerGradient,
              {
                height: transparentItemRows * itemHeight,
              },
            ]}
          />
        </View>
        <View
          style={[
            styles.gradientWrapper,
            {
              bottom: 0,
              borderTopWidth: 1,
              borderTopColor: selectedItemBorderColor,
            },
          ]}
          pointerEvents="none"
        >
          <LinearGradient
            colors={bottomGradientColors}
            style={[styles.pickerGradient, { height: transparentItemRows * itemHeight }]}
          />
        </View>
      </View>
    )
  }
}

DynamicallySelectedPicker.defaultProps = {
  items: [{ value: 0, label: 'No items', itemColor: 'red' }],
  onScroll: () => {},
  onScrollBeginDrag: () => {},
  onScrollEndDrag: () => {},
  onMomentumScrollBegin: () => {},
  onMomentumScrollEnd: () => {},
  width: 300,
  height: 300,
  initialSelectedIndex: 0,
  transparentItemRows: 3,
  allItemsColor: '#000',
  fontFamily: 'Arial',
  selectedItemBorderColor: '#cecece',
  topGradientColors: [
    'rgba( 255, 255, 255, 1 )',
    'rgba( 255, 255, 255, 0.9 )',
    'rgba( 255, 255, 255, 0.7 )',
    'rgba( 255, 255, 255, 0.5 )',
  ],
  bottomGradientColors: [
    'rgba( 255, 255, 255, 0.5 )',
    'rgba( 255, 255, 255, 0.7 )',
    'rgba( 255, 255, 255, 0.9 )',
    'rgba( 255, 255, 255, 1 )',
  ],
}
const styles = StyleSheet.create({
  listItem: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  gradientWrapper: {
    position: 'absolute',
    width: '100%',
  },
  pickerGradient: {
    width: '100%',
  },
})
