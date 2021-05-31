import * as React from 'react'
import { ColorValue, GestureResponderEvent, StyleSheet, Text, TouchableOpacity } from 'react-native'

export enum LinkButtonTheme {
  Normal = 'normal',
}

export interface LinkButtonProps {
  theme: LinkButtonTheme
  text: string
  onPress: (event: GestureResponderEvent) => void
  textColor?: ColorValue
  static?: boolean
  image?: Element
  borderRadius?: number
  disabled?: boolean
}

export const LinkButton: React.FC<LinkButtonProps> = (props: LinkButtonProps) => {
  const containerStyle = {
    [`${LinkButtonTheme.Normal}`]: styles.normalContainer,
  }
  const textStyle = {
    [`${LinkButtonTheme.Normal}`]: styles.normalText,
  }
  return (
    <TouchableOpacity style={containerStyle[props.theme]} onPress={props.onPress} disabled={props.disabled}>
      <Text style={[textStyle[props.theme], { color: props.textColor }]}>{props.text}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  normalContainer: {},
  normalText: {
    fontWeight: 'bold',
  },
})
