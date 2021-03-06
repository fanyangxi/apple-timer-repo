import _ from 'lodash'
import React, { ReactElement, useEffect, useRef, useState } from 'react'
import { Keyboard, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { Colors, FontColors, Fonts, RadiusSizes, Spacings } from '@/theme/Variables'
import { NavigationBar } from '@/components/NavigationBar'
import { useNavigation, useRoute } from '@react-navigation/native'
import ScreenContainer from '@/components/ScreenContainer'
import { Neomorph } from 'react-native-neomorph-shadows'
import { DeviceScreen } from '@/common/device'
import { Preset } from '@/models/preset'
import { BottomNumberPickerPopup } from '@/components/BottomNumberPickerPopup'
import { Modalize } from 'react-native-modalize'
import { BottomDurationPickerPopup } from '@/components/BottomDurationPickerPopup'
import { DataService } from '@/services/data-service'
import SvgFinish from '@/assets/icons/Finish'
import { getTotalPresetDurationSecs } from '@/utils/preset-util'
import Toast from 'react-native-toast-message'
import { ConfirmDialog } from 'react-native-simple-dialogs'
import { DEFAULT_NEW_PRESET } from '@/common/constants'
import AwesomeButtonMy from '@/components/button/AwesomeButtonMy'
import { formatSecs } from '@/utils/date-util'
import { ImageBackground1 } from '@/components/ImageBackground1'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { useTranslation } from 'react-i18next'
import analytics from '@react-native-firebase/analytics'
import { handleErr } from '@/utils/common-util'

export const PresetDetailScreen: React.FC = (): ReactElement => {
  const { t } = useTranslation()
  const { goBack } = useNavigation()
  const route = useRoute()

  const paramPreset: Preset = _.get(route.params, 'current', undefined)
  const isCreatingNewMode = paramPreset === undefined
  const [current, setCurrent] = useState<Preset>(isCreatingNewMode ? DEFAULT_NEW_PRESET : paramPreset)

  const [newTitle, setNewTitle] = useState<string>(current.Name)
  const [isModifyingTitle, setIsModifyingTitle] = useState<boolean>(false)
  const [showConfirmDialog, setShowConfirmDialog] = useState<boolean>(false)

  const prepareSecsDurationPickerRef = useRef<Modalize>(null)
  const workoutSecsDurationPickerRef = useRef<Modalize>(null)
  const restSecsDurationPickerRef = useRef<Modalize>(null)
  const setsPickerRef = useRef<Modalize>(null)
  const cyclesPickerRef = useRef<Modalize>(null)

  useEffect(() => {
    analytics()
      .logScreenView({ screen_name: `${isCreatingNewMode ? 'create' : 'edit'}-preset-detail-screen` })
      .catch(handleErr)
    console.log('Preset-detail-screen loaded')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    console.log(`>>> Target preset: ${JSON.stringify(current)}, Total-secs:${getTotalPresetDurationSecs(current)}`)
  }, [current])

  const saveChanges = () => {
    console.log(current)
    isCreatingNewMode
      ? DataService.createPreset(current)
          .then(() => goBack())
          .catch(e => {
            Toast.show({
              type: 'error',
              position: 'top',
              text1: 'Create preset failed:',
              text2: `${e}`,
            })
          })
      : DataService.updatePreset(current)
          .then(() => goBack())
          .catch(e => {
            Toast.show({
              type: 'error',
              position: 'top',
              text1: 'Update preset failed:',
              text2: `${e}`,
            })
          })
  }

  const cancel = () => {
    const updated = JSON.stringify(current)
    const shouldWarn = isCreatingNewMode
      ? updated !== JSON.stringify(DEFAULT_NEW_PRESET)
      : updated !== JSON.stringify(paramPreset)
    if (shouldWarn) {
      setShowConfirmDialog(true)
    } else {
      goBack()
    }
  }

  const changeTitle = () => {
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
  }

  const changePrepareSecs = (newDuration: number) => {
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
  }

  const changeWorkoutSecs = (newDuration: number) => {
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
  }

  const changeRestSecs = (newDuration: number) => {
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
  }

  const changeSetsCount = (newValue: number) => {
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
  }

  const changeCyclesCount = (newValue: number) => {
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
  }

  return (
    <ScreenContainer
      backgroundComponent={() => <ImageBackground1 />}
      topInsetBackgroundColor={Colors.mineShaft}
      bottomInsetBackgroundColor={Colors.transparent}
    >
      <StatusBar barStyle={'light-content'} backgroundColor={Colors.transparent} />
      <NavigationBar
        title={isCreatingNewMode ? t('presetDetail.creatingTitle') : t('presetDetail.editingTitle')}
        showBackButton={true}
        backButtonAction={() => cancel()}
      />
      <KeyboardAwareScrollView contentContainerStyle={styles.rootContainer}>
        <View style={styles.form}>
          <View style={styles.row}>
            <View style={styles.titleContainer}>
              <TextInput
                autoCorrect={false}
                style={[
                  styles.titleInput,
                  isModifyingTitle ? {} : { backgroundColor: Colors.linenDark, color: 'white' },
                ]}
                onChangeText={text => setNewTitle(text)}
                onBlur={() => {
                  setIsModifyingTitle(false)
                  Keyboard.dismiss()
                  changeTitle()
                }}
                onFocus={() => setIsModifyingTitle(true)}
                editable={true}
                keyboardType={'default'}
                maxLength={20}
                defaultValue={current.Name}
              />
              {isModifyingTitle && (
                <TouchableOpacity
                  style={[styles.modifyTitleButton]}
                  onPress={() => {
                    setIsModifyingTitle(false)
                    Keyboard.dismiss()
                    changeTitle()
                  }}
                >
                  <SvgFinish color={Colors.white} />
                </TouchableOpacity>
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
                <Text style={[Fonts.textRegular, FontColors.white]}>{t('presetDetail.prepare')}:</Text>
                <Text style={[Fonts.textRegular, FontColors.white]}>{formatSecs(current.PrepareSecs)}</Text>
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
                <Text style={[Fonts.textRegular, FontColors.white]}>{t('presetDetail.workout')}:</Text>
                <Text style={[Fonts.textRegular, FontColors.white]}>{formatSecs(current.WorkoutSecs)}</Text>
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
                <Text style={[Fonts.textRegular, FontColors.white]}>{t('presetDetail.rest')}:</Text>
                <Text style={[Fonts.textRegular, FontColors.white]}>{formatSecs(current.RestSecs)}</Text>
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
                  <Text style={[Fonts.textRegular, FontColors.white]}>{t('presetDetail.cycles')}:</Text>
                  <Text style={[Fonts.textRegular, FontColors.white]}>{current.CyclesCount}</Text>
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
                  <Text style={[Fonts.textRegular, FontColors.white]}>{t('presetDetail.sets')}:</Text>
                  <Text style={[Fonts.textRegular, FontColors.white]}>{current.SetsCount}</Text>
                </View>
              </Neomorph>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.actionsSection}>
          <View style={styles.buttonLeft}>
            <AwesomeButtonMy raiseLevel={1} type="secondary" stretch={true} onPress={() => cancel()}>
              {t('presetDetail.cancel')}
            </AwesomeButtonMy>
          </View>
          <View style={styles.buttonSeparator} />
          <View style={styles.buttonRight}>
            <AwesomeButtonMy raiseLevel={1} type="whatsapp" stretch={true} onPress={() => saveChanges()}>
              {t('presetDetail.save')}
            </AwesomeButtonMy>
          </View>
        </View>
      </KeyboardAwareScrollView>

      <BottomDurationPickerPopup
        popupRef={prepareSecsDurationPickerRef}
        duration={current.PrepareSecs}
        onValueChanged={newDuration => changePrepareSecs(newDuration)}
      />
      <BottomDurationPickerPopup
        popupRef={workoutSecsDurationPickerRef}
        duration={current.WorkoutSecs}
        onValueChanged={newDuration => changeWorkoutSecs(newDuration)}
      />
      <BottomDurationPickerPopup
        popupRef={restSecsDurationPickerRef}
        duration={current.RestSecs}
        onValueChanged={newDuration => changeRestSecs(newDuration)}
      />
      <BottomNumberPickerPopup
        popupRef={setsPickerRef}
        value={current.SetsCount}
        pickerTitle={t('presetDetail.sets')}
        onValueChanged={newValue => changeSetsCount(newValue)}
      />
      <BottomNumberPickerPopup
        popupRef={cyclesPickerRef}
        value={current.CyclesCount}
        pickerTitle={t('presetDetail.cycles')}
        onValueChanged={newValue => changeCyclesCount(newValue)}
      />
      <ConfirmDialog
        visible={showConfirmDialog}
        title={t('confirmDiscarding.title')}
        titleStyle={[Fonts.titleRegular, FontColors.warn]}
        message={t('confirmDiscarding.description')}
        onTouchOutside={() => setShowConfirmDialog(false)}
        negativeButton={{
          title: t('confirmDiscarding.cancel'),
          titleStyle: { ...Fonts.textRegular },
          onPress: () => {
            setShowConfirmDialog(false)
          },
        }}
        positiveButton={{
          title: t('confirmDiscarding.discard'),
          titleStyle: { ...Fonts.titleSmall, color: Colors.primary },
          onPress: () => {
            setShowConfirmDialog(false)
            goBack()
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
    marginTop: Spacings.s_24,
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
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor: 'lightblue', // '#202021',
  },
  titleInput: {
    flex: 1,
    paddingVertical: Spacings.s_16,
    textAlign: 'center',
    ...Fonts.textCaption24,
    ...FontColors.black,
    borderRadius: 4,
    backgroundColor: Colors.inputBackground,
  },
  modifyTitleButton: {
    width: 24,
    height: 24,
    marginLeft: Spacings.s_12,
    // backgroundColor: 'lightgreen', // '#202021',
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
