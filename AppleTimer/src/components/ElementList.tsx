import * as React from 'react'
import { ReactElement } from 'react'
import { StyleProp, View, ViewStyle } from 'react-native'

type NullableReactElement = ReactElement | null | undefined | ''

// This's for easily maintain the spacing between dynamically rendered ReactElements.
export const ElementList: React.FC<{
  items: NullableReactElement[]
  itemSeparatorComponent?: ReactElement
  style?: StyleProp<ViewStyle>
}> = ({ items, itemSeparatorComponent, style }): ReactElement => {
  const resultItems = items.filter(item => !!item)
  return (
    <View style={[style]}>
      {resultItems.map((item, index) => {
        return (
          <View testID={'item-container'} key={`item-container-${index}`}>
            {index !== 0 ? itemSeparatorComponent : undefined}
            {item}
          </View>
        )
      })}
    </View>
  )
}
