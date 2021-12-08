import _ from 'lodash'
import React, { ReactElement, useEffect, useRef, useState } from 'react'
import { Image, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
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
import { ConfirmDialog } from 'react-native-simple-dialogs'
import { DEFAULT_NEW_PRESET } from '@/common/constants'
import AwesomeButtonMy from '@/components/button/AwesomeButtonMy'
import { formatSecs } from '@/utils/date-util'

export const PresetDetailScreen: React.FC<{}> = (): ReactElement => {
  const { goBack } = useNavigation()
  const route = useRoute()
  const thePreset: Preset = _.get(route.params, 'current', undefined)
  const isCreatingNewMode = thePreset === undefined
  const currentPreset = isCreatingNewMode ? DEFAULT_NEW_PRESET : thePreset

  const [newTitle, setNewTitle] = useState<string>(currentPreset.Name)
  const [isModifyingTitle, setIsModifyingTitle] = useState<boolean>(false)
  const [current, setCurrent] = useState<Preset>(currentPreset)
  const [showConfirmDialog, setShowConfirmDialog] = useState<boolean>(false)

  const prepareSecsDurationPickerRef = useRef<Modalize>(null)
  const workoutSecsDurationPickerRef = useRef<Modalize>(null)
  const restSecsDurationPickerRef = useRef<Modalize>(null)
  const setsPickerRef = useRef<Modalize>(null)
  const cyclesPickerRef = useRef<Modalize>(null)

  useEffect(() => {
    console.log('>>>> PresetDetailScreen loaded')
    // eslint-disable-next-line
  }, [])

  useEffect(() => {
    console.log(`>>> Current:: ${JSON.stringify(current)}, Total-secs:${getTotalPresetDurationSecs(current)}`)
    // eslint-disable-next-line
  }, [current])

  function saveChanges() {
    console.log(current)
    isCreatingNewMode
      ? DataService.createPreset(current)
          .then(() => goBack())
          .catch(e => {
            Toast.show({
              type: 'error',
              position: 'top',
              text1: 'Create preset failed:',
              text2: `Detail: ${e}`,
            })
          })
      : DataService.updatePreset(current)
          .then(() => goBack())
          .catch(e => {
            Toast.show({
              type: 'error',
              position: 'top',
              text1: 'Update preset failed:',
              text2: `Detail: ${e}`,
            })
          })
  }

  function cancel() {
    const updated = JSON.stringify(current)
    const shouldWarn = isCreatingNewMode
      ? updated !== JSON.stringify(DEFAULT_NEW_PRESET)
      : updated !== JSON.stringify(thePreset)
    if (shouldWarn) {
      setShowConfirmDialog(true)
    } else {
      goBack()
    }
  }

  return (
    <ScreenContainer
      backgroundComponent={() => (
        <Image
          source={assets.images.darkBackground}
          resizeMode={'repeat'}
          style={{ flex: 1, width: undefined, height: undefined }}
        />
      )}
      topInsetBackgroundColor={Colors.mineShaft}
      bottomInsetBackgroundColor={Colors.transparent}
    >
      <StatusBar barStyle={'light-content'} backgroundColor={Colors.transparent} />
      <NavigationBar
        title={isCreatingNewMode ? 'Create New Preset' : 'Edit Preset Detail'}
        showBackButton={true}
        backButtonAction={() => cancel()}
      />
      <ScrollView contentContainerStyle={styles.rootContainer}>
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
                          current.SetsCount,
                          current.CyclesCount,
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
                <Text style={[Fonts.textSmall, FontColors.white]}>Prepare:</Text>
                <Text style={[Fonts.textSmall, FontColors.white]}>{formatSecs(current.PrepareSecs)}</Text>
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
                <Text style={[Fonts.textSmall, FontColors.white]}>{formatSecs(current.WorkoutSecs)}</Text>
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
                <Text style={[Fonts.textSmall, FontColors.white]}>{formatSecs(current.RestSecs)}</Text>
              </View>
            </Neomorph>
          </TouchableOpacity>
          {/*//*/}
          <View style={styles.countsContainer}>
            <TouchableOpacity
              style={styles.barItem}
              onPress={() => {
                cyclesPickerRef.current?.open()
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
                  <Text style={[Fonts.textSmall, FontColors.white]}>Cycles:</Text>
                  <Text style={[Fonts.textSmall, FontColors.white]}>{current.CyclesCount}</Text>
                </View>
              </Neomorph>
            </TouchableOpacity>
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
          </View>
        </View>
        <View style={styles.actionsSection}>
          <View style={styles.buttonLeft}>
            <AwesomeButtonMy raiseLevel={1} type="secondary" stretch={true} onPress={() => cancel()}>
              {'Cancel'}
            </AwesomeButtonMy>
          </View>
          <View style={styles.buttonSeparator} />
          <View style={styles.buttonRight}>
            <AwesomeButtonMy raiseLevel={1} type="whatsapp" stretch={true} onPress={() => saveChanges()}>
              {'Save'}
            </AwesomeButtonMy>
          </View>
        </View>
      </ScrollView>

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
              current.SetsCount,
              current.CyclesCount,
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
              current.SetsCount,
              current.CyclesCount,
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
              current.SetsCount,
              current.CyclesCount,
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
              newValue,
              current.CyclesCount,
              current.IsActive,
            ),
          )
        }}
      />
      <BottomNumberPickerPopup
        popupRef={cyclesPickerRef}
        value={current.CyclesCount}
        onValueChanged={newValue => {
          setCurrent(
            new Preset(
              current.Id,
              current.Name,
              current.PrepareSecs,
              current.WorkoutSecs,
              current.RestSecs,
              current.SetsCount,
              newValue,
              current.IsActive,
            ),
          )
        }}
      />
      <ConfirmDialog
        visible={showConfirmDialog}
        title={'Confirmation'}
        titleStyle={[Fonts.titleRegular, FontColors.warn]}
        message={'Data has been changed. Do you want to discard the changes?'}
        onTouchOutside={() => setShowConfirmDialog(false)}
        negativeButton={{
          title: 'Discard!',
          onPress: () => {
            setShowConfirmDialog(false)
            goBack()
          },
        }}
        positiveButton={{
          title: 'Keep Editing',
          onPress: () => {
            setShowConfirmDialog(false)
          },
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
    shadowRadius: 2,
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
    marginVertical: Spacings.s_24,
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
  confirmationContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmationText: {
    textAlign: 'center',
  },
  confirmationLeftButton: {
    alignSelf: 'flex-start',
  },
  confirmationRightButton: {
    alignSelf: 'flex-end',
  },
  buttonLeft: {
    flexGrow: 2,
    marginRight: 10,
  },
  buttonSeparator: {
    flexGrow: 1,
  },
  buttonRight: {
    flexGrow: 2,
    marginLeft: 10,
  },
})
