import _ from 'lodash'
import React, { ReactElement, useEffect, useRef, useState } from 'react'
import { Image, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { Colors, FontColors, Fonts, RadiusSizes, Spacings } from '@/theme/Variables'
import { NavigationBar } from '@/components/NavigationBar'
import { useNavigation, useRoute } from '@react-navigation/native'
import ScreenContainer from '@/components/ScreenContainer'
import { assets } from '@/assets'
import { Neomorph } from 'react-native-neomorph-shadows'
import { DeviceScreen } from '@/common/device'
import { Preset } from '@/models/preset'
import { BottomNumberPickerPopup } from '@/components/BottomNumberPickerPopup'
import { Modalize } from 'react-native-modalize'
import { BottomDurationPickerPopup } from '@/components/BottomDurationPickerPopup'
import { useTheme } from '@/theme'
import SvgBrowser from '@/assets/icons/Browser'
import { DataService } from '@/services/data-service'
import SvgFinish from '@/assets/icons/Finish'
import { getTotalPresetDurationSecs } from '@/utils/preset-util'
import Toast from 'react-native-toast-message'

export const PresetDetailScreen: React.FC<{}> = (): ReactElement => {
  const { goBack } = useNavigation()
  const route = useRoute()
  const thePreset: Preset = _.get(route.params, 'current', undefined)
  const isCreatingNewMode = thePreset === undefined
  const currentPreset = isCreatingNewMode
    ? new Preset('NEW-ID-PLACE-HOLDER', 'New Workout 4', 1, 1, 1, 1, 1)
    : thePreset

  const [newTitle, setNewTitle] = useState<string>(currentPreset.Name)
  const [isModifyingTitle, setIsModifyingTitle] = useState<boolean>(false)
  const [current, setCurrent] = useState<Preset>(currentPreset)
  const prepareSecsDurationPickerRef = useRef<Modalize>(null)
  const workoutSecsDurationPickerRef = useRef<Modalize>(null)
  const restSecsDurationPickerRef = useRef<Modalize>(null)
  const repsPickerRef = useRef<Modalize>(null)
  const setsPickerRef = useRef<Modalize>(null)

  const { Common } = useTheme()

  useEffect(() => {
    console.log('>>>> PresetDetailScreen loaded')
    // eslint-disable-next-line
  }, [])

  useEffect(() => {
    console.log(`>>> Current:: ${JSON.stringify(current)}, Total-secs:${getTotalPresetDurationSecs(current)}`)
    // eslint-disable-next-line
  }, [current])

  return (
    <ScreenContainer
      backgroundComponent={() => (
        <Image source={assets.images.darkBackground} style={{ flex: 1, width: undefined, height: undefined }} />
      )}
      topInsetBackgroundColor={Colors.mineShaft}
      bottomInsetBackgroundColor={Colors.transparent}
    >
      <StatusBar barStyle={'light-content'} backgroundColor={Colors.transparent} />
      <NavigationBar title={isCreatingNewMode ? 'Create New Preset' : 'Edit Preset Detail'} showBackButton={true} />
      <View style={styles.rootContainer}>
        <View style={styles.form}>
          <View style={styles.row}>
            <View style={styles.titleContainer}>
              {isModifyingTitle ? (
                <>
                  <TextInput
                    onChangeText={text => setNewTitle(text)}
                    // editable={!fetchOneUserLoading}
                    keyboardType={'default'}
                    maxLength={24}
                    defaultValue={current.Name}
                    style={styles.titleInput} // [Layout.fill, Common.textInput]
                  />
                  <TouchableOpacity
                    style={[styles.barItem, styles.modifyTitleButton]}
                    onPress={() => {
                      setIsModifyingTitle(false)
                      setCurrent(
                        new Preset(
                          current.Id,
                          newTitle,
                          current.PrepareSecs,
                          current.WorkoutSecs,
                          current.RestSecs,
                          current.RepsCount,
                          current.SetsCount,
                          current.IsActive,
                        ),
                      )
                    }}
                  >
                    <SvgFinish color={Colors.white} />
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  <Text style={styles.title}>{current.Name}</Text>
                  <TouchableOpacity
                    style={[styles.barItem, styles.modifyTitleButton]}
                    onPress={() => setIsModifyingTitle(true)}
                  >
                    <SvgBrowser color={Colors.white} />
                  </TouchableOpacity>
                </>
              )}
            </View>
          </View>
          <TouchableOpacity
            style={styles.barItem}
            onPress={() => {
              prepareSecsDurationPickerRef.current?.open()
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
          <TouchableOpacity
            style={styles.barItem}
            onPress={() => {
              workoutSecsDurationPickerRef.current?.open()
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
                <Text style={[Fonts.textSmall, FontColors.white]}>Workout Secs:</Text>
                <Text style={[Fonts.textSmall, FontColors.white]}>{current.WorkoutSecs}</Text>
              </View>
            </Neomorph>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.barItem}
            onPress={() => {
              restSecsDurationPickerRef.current?.open()
            }}
          >
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
            <TouchableOpacity
              style={styles.barItem}
              onPress={() => {
                setsPickerRef.current?.open()
              }}
            >
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
            <TouchableOpacity
              style={styles.barItem}
              onPress={() => {
                repsPickerRef.current?.open()
              }}
            >
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
          <TouchableOpacity
            style={[Common.button.rounded]}
            onPress={() => {
              console.log(current)
              isCreatingNewMode
                ? DataService.createPreset(current)
                    .then(() => goBack())
                    .catch(() => {
                      Toast.show({
                        type: 'error',
                        position: 'top',
                        text1: 'Hello',
                        text2: 'This is some something 👋',
                      })
                    })
                : DataService.updatePreset(current).then(() => goBack())
            }}
          >
            <Text style={Fonts.textRegular}>{'Save'}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[Common.button.rounded]} onPress={() => goBack()}>
            <Text style={Fonts.textRegular}>{'Cancel'}</Text>
          </TouchableOpacity>
        </View>
      </View>
      <BottomDurationPickerPopup
        popupRef={prepareSecsDurationPickerRef}
        duration={current.PrepareSecs}
        onValueChanged={newDuration => {
          setCurrent(
            new Preset(
              current.Id,
              current.Name,
              newDuration,
              current.WorkoutSecs,
              current.RestSecs,
              current.RepsCount,
              current.SetsCount,
              current.IsActive,
            ),
          )
        }}
      />
      <BottomDurationPickerPopup
        popupRef={workoutSecsDurationPickerRef}
        duration={current.WorkoutSecs}
        onValueChanged={newDuration => {
          setCurrent(
            new Preset(
              current.Id,
              current.Name,
              current.PrepareSecs,
              newDuration,
              current.RestSecs,
              current.RepsCount,
              current.SetsCount,
              current.IsActive,
            ),
          )
        }}
      />
      <BottomDurationPickerPopup
        popupRef={restSecsDurationPickerRef}
        duration={current.RestSecs}
        onValueChanged={newDuration => {
          setCurrent(
            new Preset(
              current.Id,
              current.Name,
              current.PrepareSecs,
              current.WorkoutSecs,
              newDuration,
              current.RepsCount,
              current.SetsCount,
              current.IsActive,
            ),
          )
        }}
      />
      <BottomNumberPickerPopup
        popupRef={repsPickerRef}
        value={current.RepsCount}
        onValueChanged={newValue => {
          setCurrent(
            new Preset(
              current.Id,
              current.Name,
              current.PrepareSecs,
              current.WorkoutSecs,
              current.RestSecs,
              newValue,
              current.SetsCount,
              current.IsActive,
            ),
          )
        }}
      />
      <BottomNumberPickerPopup
        popupRef={setsPickerRef}
        value={current.SetsCount}
        onValueChanged={newValue => {
          setCurrent(
            new Preset(
              current.Id,
              current.Name,
              current.PrepareSecs,
              current.WorkoutSecs,
              current.RestSecs,
              current.RepsCount,
              newValue,
              current.IsActive,
            ),
          )
        }}
      />
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
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    // backgroundColor: 'lightblue', // '#202021',
  },
  title: {
    ...Fonts.textCaption30,
    ...FontColors.white,
    marginRight: Spacings.s_12,
  },
  titleInput: {
    width: 120,
    borderWidth: 1,
    borderColor: Colors.text,
    backgroundColor: Colors.inputBackground,
    color: Colors.text,
    minHeight: 50,
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 10,
  },
  modifyTitleButton: {
    width: 24,
    height: 24,
    // backgroundColor: 'lightgreen', // '#202021',
  },
})
