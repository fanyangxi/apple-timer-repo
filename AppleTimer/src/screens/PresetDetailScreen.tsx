import React, { ReactElement, useEffect, useRef, useState } from 'react'
import { StatusBar, StyleSheet, Text, View } from 'react-native'
import { Colors, FontColors, Fonts, Spacings } from '@/theme/Variables'
import SvgComponent from '@/assets/icons/DarkAnd'
import { NavigationBar } from '@/components/NavigationBar'
import { useRoute } from '@react-navigation/native'
import ScreenContainer from '@/components/ScreenContainer'

export const PresetDetailScreen: React.FC<{}> = (): ReactElement => {
  const route = useRoute()
  // const preset: Preset = new Preset('', 3, 4, 2, 2, 2)
  // @ts-ignore
  const presetName: string = route.params?.current

  useEffect(() => {
    // eslint-disable-next-line
  }, [])

  return (
    <ScreenContainer
      backgroundComponent={() => <SvgComponent />}
      topInsetBackgroundColor={Colors.mineShaft}
      bottomInsetBackgroundColor={Colors.transparent}
    >
      <StatusBar barStyle={'light-content'} backgroundColor={Colors.primary} />
      <NavigationBar title={'Preset Detail'} showBackButton={true} />
      <View style={styles.rootContainer}>
        <Text style={[Fonts.textSmall, FontColors.white]}>{presetName}</Text>
      </View>
    </ScreenContainer>
  )
}

const styles = StyleSheet.create({
  rootContainer: {
    flexDirection: 'column',
    flex: 1,
    // backgroundColor: 'lightgrey',
    justifyContent: 'space-around',
    paddingHorizontal: Spacings.s_8,
    paddingVertical: Spacings.s_16,
  },
  // @action-section:
  actionSection: {
    flexDirection: 'row',
    paddingHorizontal: Spacings.s_40,
    paddingVertical: Spacings.s_4,
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'lightgreen', // '#202021',
    borderRadius: 2,
  },
  start: {},
  pause: {},
  stop: {},
  background: {
    backgroundColor: 'lightgreen', // '#202021',
    position: 'absolute',
  },
})
