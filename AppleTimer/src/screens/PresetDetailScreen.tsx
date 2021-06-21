import React, { ReactElement, useEffect, useRef, useState } from 'react'
import { Button, Image, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { Colors, FontColors, Fonts, RadiusSizes, Spacings } from '@/theme/Variables'
import { NavigationBar } from '@/components/NavigationBar'
import { useRoute } from '@react-navigation/native'
import ScreenContainer from '@/components/ScreenContainer'
import { assets } from '@/assets'
import { Neomorph } from 'react-native-neomorph-shadows'
import { DeviceScreen } from '@/common/device'
import { Preset } from '@/models/preset'
import { DEFAULT_PRESET } from '@/common/constants'
import { BottomNumberPickerPopup } from '@/components/BottomNumberPickerPopup'
import { Modalize } from 'react-native-modalize'
import { BottomDurationPickerPopup } from '@/components/BottomDurationPickerPopup'

export const PresetDetailScreen: React.FC<{}> = (): ReactElement => {
  const route = useRoute()
  const [current, setCurrent] = useState<Preset>(DEFAULT_PRESET)
  // @ts-ignore
  const presetName: string = route.params?.current
  const durationPickerRef = useRef<Modalize>(null)
  const numberPickerRef = useRef<Modalize>(null)

  useEffect(() => {
    // eslint-disable-next-line
  }, [])

  return (
    <ScreenContainer
      backgroundComponent={() => (
        <Image
          source={assets.images.darkBackground}
          style={{
            flex: 1,
            width: undefined,
            height: undefined,
          }}
        />
      )}
      topInsetBackgroundColor={Colors.mineShaft}
      bottomInsetBackgroundColor={Colors.transparent}
    >
      <StatusBar barStyle={'light-content'} backgroundColor={Colors.primary} />
      <NavigationBar title={'Preset Detail'} showBackButton={true} />
      <BottomDurationPickerPopup popupRef={durationPickerRef} />
      <BottomNumberPickerPopup popupRef={numberPickerRef} />
      <View style={styles.rootContainer}>
        <View style={styles.form}>
          <View style={styles.row}>
            <Text style={[Fonts.textSmall, FontColors.white]}>{current.Name}</Text>
          </View>
          <TouchableOpacity
            style={styles.barItem}
            onPress={() => {
              durationPickerRef.current?.open()
            }}
          >
            <Neomorph
              inner={false} // <- enable shadow inside of neomorph
              swapShadows // <- change zIndex of each shadow color
              style={{
                ...styles.neomorphContainer,
                width: DeviceScreen.width - Spacings.s_48,
                height: 60,
              }}
            >
              <View style={styles.barItemContent}>
                <Text style={[Fonts.textSmall, FontColors.white]}>Prepare Secs:</Text>
                <Text style={[Fonts.textSmall, FontColors.white]}>{current.PrepareSecs}</Text>
              </View>
            </Neomorph>
          </TouchableOpacity>
          <TouchableOpacity style={styles.barItem} onPress={() => {}}>
            <Neomorph
              inner={false} // <- enable shadow inside of neomorph
              swapShadows // <- change zIndex of each shadow color
              style={{
                ...styles.neomorphContainer,
                width: DeviceScreen.width - Spacings.s_48,
                height: 60,
              }}
            >
              <View style={styles.barItemContent}>
                <Text style={[Fonts.textSmall, FontColors.white]}>Workout Secs:</Text>
                <Text style={[Fonts.textSmall, FontColors.white]}>{current.WorkoutSecs}</Text>
              </View>
            </Neomorph>
          </TouchableOpacity>
          <TouchableOpacity style={styles.barItem} onPress={() => {}}>
            <Neomorph
              inner={false}
              swapShadows
              style={{
                ...styles.neomorphContainer,
                width: DeviceScreen.width - Spacings.s_48,
                height: 60,
              }}
            >
              <View style={styles.barItemContent}>
                <Text style={[Fonts.textSmall, FontColors.white]}>Rest Secs:</Text>
                <Text style={[Fonts.textSmall, FontColors.white]}>{current.RestSecs}</Text>
              </View>
            </Neomorph>
          </TouchableOpacity>
          {/*//*/}
          <View style={styles.countsContainer}>
            <TouchableOpacity style={styles.barItem} onPress={() => {}}>
              <Neomorph
                inner={false}
                swapShadows
                style={{
                  ...styles.neomorphContainer,
                  width: (DeviceScreen.width - Spacings.s_48 - Spacings.s_24) / 2,
                  height: 60,
                }}
              >
                <View style={styles.barItemContent}>
                  <Text style={[Fonts.textSmall, FontColors.white]}>Sets:</Text>
                  <Text style={[Fonts.textSmall, FontColors.white]}>{current.SetsCount}</Text>
                </View>
              </Neomorph>
            </TouchableOpacity>
            <TouchableOpacity style={styles.barItem} onPress={() => {}}>
              <Neomorph
                inner={false}
                swapShadows
                style={{
                  ...styles.neomorphContainer,
                  width: (DeviceScreen.width - Spacings.s_48 - Spacings.s_24) / 2,
                  height: 60,
                }}
              >
                <View style={styles.barItemContent}>
                  <Text style={[Fonts.textSmall, FontColors.white]}>Reps:</Text>
                  <Text style={[Fonts.textSmall, FontColors.white]}>{current.RepsCount}</Text>
                </View>
              </Neomorph>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.actionsSection}>
          <Button title={'Save'} onPress={() => {}} />
          <Button title={'Cancel'} onPress={() => {}} />
        </View>
      </View>
    </ScreenContainer>
  )
}

const styles = StyleSheet.create({
  rootContainer: {
    flexGrow: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'stretch',
    paddingHorizontal: Spacings.s_24,
    paddingVertical: Spacings.s_16,
    // backgroundColor: 'lightgrey',
  },
  row: {
    // marginTop: 50,
    // backgroundColor: 'lightgrey',
    flexDirection: 'column',
    alignItems: 'center',
  },
  form: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    // paddingHorizontal: Spacings.s_24,
    // paddingVertical: Spacings.s_16,
  },
  neomorphContainer: {
    // shadowColor: 'red',
    // shadowOffset: { width: 6, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    borderRadius: RadiusSizes.r8,
    backgroundColor: '#4E4E4E', // 434343, 4E4E4E, 3C3C3C, 3E3E3E
    flexDirection: 'column',
    justifyContent: 'center',
  },
  barItem: {
    // backgroundColor: 'lightgreen', // '#202021',
    marginVertical: Spacings.s_16,
  },
  barItemContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: Spacings.s_16,
  },
  countsContainer: {
    flexGrow: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    // backgroundColor: 'lightgreen', // '#202021',
  },
  // @action-section:
  actionsSection: {
    flexDirection: 'row',
    paddingVertical: Spacings.s_4,
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 2,
    marginBottom: Spacings.s_40,
    // backgroundColor: 'lightgreen', // '#202021',
  },
  saveButton: {
    width: 90,
  },
  cancelButton: {
    width: 90,
  },
  background: {
    backgroundColor: 'lightgreen', // '#202021',
    position: 'absolute',
  },
})
