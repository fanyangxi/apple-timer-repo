import React, { ReactElement } from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import { useTheme } from '@/theme'

export const HomeScreen: React.FC<{}> = (): ReactElement => {
  const { Common, Fonts, Gutters, Layout } = useTheme()

  return (
    <React.Fragment>
      {/* @summary-section: */}
      <View style={[[Layout.colCenter, Gutters.smallHPadding]]}>
        <Text style={Fonts.textRegular}>Time-Renaming:</Text>
        <Text style={Fonts.textRegular}>{'07:20'}</Text>
        <TouchableOpacity
          style={[Common.button.rounded, Gutters.regularBMargin]}
          onPress={() => {}}
        >
          <Text style={Fonts.textRegular}>{'Change-Preset'}</Text>
        </TouchableOpacity>
        <Text style={Fonts.textRegular}>Total-Time:</Text>
        <Text style={Fonts.textRegular}>{'07:20'}</Text>
      </View>

      {/* @details-section: */}
      <View style={[[Layout.colCenter, Gutters.smallHPadding]]}>
        <Text style={Fonts.textRegular}>{'fetchOneUserError.message'}</Text>
        <Text style={Fonts.textRegular}>{'example.helloUser'}</Text>
      </View>

      {/* @action-section: */}
      <View style={[[Layout.colCenter, Gutters.smallHPadding]]}>
        <Text style={Fonts.textRegular}>{'fetchOneUserError.message'}</Text>
        <Text style={Fonts.textRegular}>{'example.helloUser'}</Text>
      </View>
    </React.Fragment>
  )
}
