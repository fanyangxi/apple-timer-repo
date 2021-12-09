import React from 'react'
import { View, Text, StyleProp, ViewStyle, ColorValue } from 'react-native'

export interface PickerListItemProps {
  label?: string
  style?: StyleProp<ViewStyle>
  itemColor?: ColorValue
  allItemsColor?: string
  fontSize?: number
  fontFamily?: string // = 'Arial',
}

// @ts-ignore
export default function PickerListItem(input: PickerListItemProps) {
  const { label, style, itemColor, allItemsColor, fontSize, fontFamily = 'Arial' } = input
  return (
    <View style={style}>
      <Text
        style={{
          fontSize: fontSize,
          color: itemColor ? itemColor : allItemsColor,
          fontFamily: fontFamily,
        }}
      >
        {label}
      </Text>
    </View>
  )
}
