import React from 'react'
import {
  StyleSheet,
  View,
  ScrollView,
  Platform,
  NativeSyntheticEvent,
  NativeScrollEvent,
  ColorValue,
} from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import PickerListItem from './PickerListItem'

type DynamicallySelectedPickerProps = {
  items?: {
    value?: string | number
    label?: string
    itemColor?: ColorValue
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
  topGradientColors?: (string | number)[]
  bottomGradientColors?: (string | number)[]
}

type DynamicallySelectedPickerState = {
  itemIndex: number
  itemHeight: number
  lastScrollPos: number
}

export default class DynamicallySelectedPicker extends React.Component<
  DynamicallySelectedPickerProps,
  DynamicallySelectedPickerState
> {
  private readonly scrollViewRef: React.RefObject<ScrollView>

  // Set default props
  static defaultProps = {
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

  constructor(props: DynamicallySelectedPickerProps) {
    super(props)
    this.scrollViewRef = React.createRef<ScrollView>()

    const localInitialSelectedIndex =
      this.props.initialSelectedIndex || DynamicallySelectedPicker.defaultProps.initialSelectedIndex
    const localHeight = this.props.height || DynamicallySelectedPicker.defaultProps.height
    const localTransparentItemRows =
      this.props.transparentItemRows || DynamicallySelectedPicker.defaultProps.transparentItemRows
    let itemHeight = localHeight / (localTransparentItemRows * 2 + 1)
    if (Platform.OS === 'ios') {
      itemHeight = Math.ceil(itemHeight)
    }
    this.state = {
      itemHeight: itemHeight,
      itemIndex: localInitialSelectedIndex,
      lastScrollPos: 0,
    }
  }

  static getDerivedStateFromProps(
    nextProps: DynamicallySelectedPickerProps,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    prevState: DynamicallySelectedPickerState,
  ) {
    return {
      itemIndex: nextProps.initialSelectedIndex,
    }
  }

  scrollToInitialPosition = () => {
    const localInitialSelectedIndex =
      this.props.initialSelectedIndex || DynamicallySelectedPicker.defaultProps.initialSelectedIndex
    this.scrollViewRef.current?.scrollTo({
      y: this.state.itemHeight * localInitialSelectedIndex,
    })
  }

  scrollToPosition = (index: number) => {
    this.scrollViewRef.current?.scrollTo({
      y: this.state.itemHeight * index,
    })
  }

  fakeItems(n = 3) {
    const itemsArr = []
    for (let i = 0; i < n; i++) {
      itemsArr[i] = {
        value: -1,
        label: '',
        itemColor: 'transparent',
      }
    }
    return itemsArr
  }

  allItemsLength() {
    const localTransparentItemRows =
      this.props.transparentItemRows || DynamicallySelectedPicker.defaultProps.transparentItemRows
    return this.extendedItems().length - localTransparentItemRows * 2
  }

  onScroll(event: NativeSyntheticEvent<NativeScrollEvent>) {
    const { items, onScroll } = this.props
    const localItems = items || DynamicallySelectedPicker.defaultProps.items
    const tempIndex = this.getItemTemporaryIndex(event)
    if (this.state.itemIndex !== tempIndex && tempIndex >= 0 && tempIndex < this.allItemsLength()) {
      this.setItemIndex(tempIndex)
      onScroll && onScroll({ index: tempIndex, item: localItems[tempIndex] })
    }
  }

  // onMomentumScrollBegin(event: NativeSyntheticEvent<NativeScrollEvent>) {
  //   const { items, onMomentumScrollBegin } = this.props
  //   const localItems = items || DynamicallySelectedPicker.defaultProps.items
  //   const tempIndex = this.getItemTemporaryIndex(event)
  //   if (tempIndex >= 0 && tempIndex < this.allItemsLength()) {
  //     this.setItemIndex(tempIndex)
  //     onMomentumScrollBegin && onMomentumScrollBegin({ index: tempIndex, item: localItems[tempIndex] })
  //   }
  // }
  //
  // onMomentumScrollEnd(event: NativeSyntheticEvent<NativeScrollEvent>) {
  //   const { items, onMomentumScrollEnd } = this.props
  //   const localItems = items || DynamicallySelectedPicker.defaultProps.items
  //   const tempIndex = this.getItemTemporaryIndex(event)
  //   if (tempIndex >= 0 && tempIndex < this.allItemsLength()) {
  //     this.setItemIndex(tempIndex)
  //     onMomentumScrollEnd && onMomentumScrollEnd({ index: tempIndex, item: localItems[tempIndex] })
  //   }
  // }
  //
  // onScrollBeginDrag(event: NativeSyntheticEvent<NativeScrollEvent>) {
  //   const { items, onScrollBeginDrag } = this.props
  //   const localItems = items || DynamicallySelectedPicker.defaultProps.items
  //   const tempIndex = this.getItemTemporaryIndex(event)
  //   if (tempIndex >= 0 && tempIndex < this.allItemsLength()) {
  //     this.setItemIndex(tempIndex)
  //     onScrollBeginDrag && onScrollBeginDrag({ index: tempIndex, item: localItems[tempIndex] })
  //   }
  // }

  onScrollEndDrag(event: NativeSyntheticEvent<NativeScrollEvent>) {
    const { items, onScrollEndDrag } = this.props
    const localItems = items || DynamicallySelectedPicker.defaultProps.items
    const tempIndex = this.getItemTemporaryIndex(event)
    if (tempIndex >= 0 && tempIndex < this.allItemsLength()) {
      this.setItemIndex(tempIndex)
      onScrollEndDrag && onScrollEndDrag({ index: tempIndex, item: localItems[tempIndex] })
    }
  }

  getItemTemporaryIndex(event: NativeSyntheticEvent<NativeScrollEvent>) {
    return Math.round(event.nativeEvent.contentOffset.y / this.state.itemHeight)
  }

  setItemIndex(index: number) {
    this.setState({
      itemIndex: index,
    })
  }

  extendedItems() {
    const { items, transparentItemRows } = this.props
    const localItems = items || DynamicallySelectedPicker.defaultProps.items
    return [...this.fakeItems(transparentItemRows), ...localItems, ...this.fakeItems(transparentItemRows)]
  }

  render() {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
    const localTransparentItemRows = transparentItemRows || DynamicallySelectedPicker.defaultProps.transparentItemRows
    return (
      <View style={{ height: height, width: width }}>
        <ScrollView
          ref={this.scrollViewRef}
          // decelerationRate={'normal'}
          scrollEventThrottle={16}
          onLayout={this.scrollToInitialPosition}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          // onMomentumScrollBegin={event => {
          //   this.onMomentumScrollBegin(event)
          // }}
          // onMomentumScrollEnd={event => {
          //   this.onMomentumScrollEnd(event)
          // }}
          // onScrollBeginDrag={event => {
          //   this.onScrollBeginDrag(event)
          // }}
          // onScrollEndDrag={event => {
          //   this.onScrollEndDrag(event)
          // }}
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
          // initialScrollIndex={itemIndex}
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
            colors={topGradientColors || []}
            style={[
              styles.pickerGradient,
              {
                height: localTransparentItemRows * itemHeight,
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
            colors={bottomGradientColors || []}
            style={[styles.pickerGradient, { height: localTransparentItemRows * itemHeight }]}
          />
        </View>
      </View>
    )
  }
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
