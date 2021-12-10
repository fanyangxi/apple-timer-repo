import React, { ReactElement, useContext, useRef } from 'react'
import { ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { Colors, FontColors, Fonts, Spacings } from '@/theme/Variables'
import { NavigationBar } from '@/components/NavigationBar'
import ScreenContainer from '@/components/ScreenContainer'
import { Neomorph } from 'react-native-neomorph-shadows'
import { DeviceScreen } from '@/common/device'
import { ImageBackground1 } from '@/components/ImageBackground1'
import SwitchToggle from 'react-native-switch-toggle'
import SvgArrowRight from '@/assets/icons/ArrowRight'
import { UserSettingsDataService } from '@/services/user-settings-data-service'
import { DEFAULT_USER_SETTINGS } from '@/common/constants'
import { handleErr } from '@/utils/common-util'
import { BottomLanguagePickerPopup } from '@/components/BottomLanguagePickerPopup'
import { Modalize } from 'react-native-modalize'
import { AppStateContext } from '@/common/app-state-context'

interface ActionButtonProps {
  key?: string
  title: string
  onPress: () => void
}

export const SettingsScreen: React.FC = (): ReactElement => {
  const languagePickerRef = useRef<Modalize>(null)
  const appState = useContext(AppStateContext)

  const renderActionButton = (buttonProps: ActionButtonProps) => (
    <View style={styles.row}>
      <NeomorphContainer>
        <TouchableOpacity key={buttonProps.key} style={styles.card} onPress={() => buttonProps.onPress()}>
          <Text style={[Fonts.textRegular, FontColors.white]}>{buttonProps.title}</Text>
          <View style={styles.cardIconContainer}>{<SvgArrowRight color={Colors.white} width={20} />}</View>
        </TouchableOpacity>
      </NeomorphContainer>
    </View>
  )

  return (
    <ScreenContainer
      backgroundComponent={() => <ImageBackground1 />}
      topInsetBackgroundColor={Colors.mineShaft}
      bottomInsetBackgroundColor={Colors.transparent}
    >
      <StatusBar barStyle={'light-content'} backgroundColor={Colors.primary} />
      <NavigationBar title={'Settings'} showBackButton={true} />
      <ScrollView style={styles.rootContainer}>
        {/* ==== General ==== */}
        <View style={styles.sectionTitleContainer}>
          <Text style={[Fonts.titleRegular, FontColors.white]}>General</Text>
        </View>
        {/*Choose Language*/}
        {renderActionButton({ title: 'Choose Language', onPress: () => languagePickerRef.current?.open() })}
        {/*Voice Assist*/}
        <View style={styles.row}>
          <NeomorphContainer>
            <View style={styles.card}>
              <Text style={[Fonts.textRegular, FontColors.white]}>{'Voice Assist'}</Text>
              <SwitchToggleMy
                switchOn={appState.userSettings.enableVoiceAssist ?? true}
                onPress={() => {
                  const updated = { enableVoiceAssist: !appState.userSettings.enableVoiceAssist }
                  console.log(`Voice Assist: ${!appState.userSettings.enableVoiceAssist}`)
                  appState.setUserSettings({ ...appState.userSettings, ...updated })
                  UserSettingsDataService.saveUserSettings(updated).catch(handleErr)
                }}
              />
            </View>
          </NeomorphContainer>
        </View>
        {/* ==== Share & Feedback ==== */}
        <View style={styles.sectionTitleContainer}>
          <Text style={[Fonts.titleRegular, FontColors.white]}>Share & Feedback</Text>
        </View>
        {renderActionButton({ title: 'Rate us', onPress: () => {} })}
        {renderActionButton({ title: 'Share with friends', onPress: () => {} })}
        {renderActionButton({ title: 'Send feedback', onPress: () => {} })}
      </ScrollView>
      {/* misc(s) */}
      <BottomLanguagePickerPopup
        popupRef={languagePickerRef}
        value={appState.userSettings.language ?? DEFAULT_USER_SETTINGS.language}
        pickerTitle={'Language'}
        onValueChanged={newValue => {
          console.log(`Language: ${newValue}`)
          const updated = { language: newValue }
          appState.setUserSettings({ ...appState.userSettings, ...updated })
          UserSettingsDataService.saveUserSettings(updated).catch(handleErr)
        }}
      />
    </ScreenContainer>
  )
}

const NeomorphContainer: React.FC<{ children: ReactElement }> = ({ children }) => {
  return (
    <Neomorph
      inner={false} // <- enable shadow inside of neomorph
      swapShadows // <- change zIndex of each shadow color
      style={{
        ...styles.neomorphContainer,
        width: DeviceScreen.width - Spacings.s_48,
        height: 56,
      }}
    >
      {children}
    </Neomorph>
  )
}

const SwitchToggleMy: React.FC<{ switchOn: boolean; onPress: () => void }> = ({ switchOn, onPress }) => {
  return (
    <SwitchToggle
      switchOn={switchOn}
      onPress={onPress}
      circleColorOff={'#4E4E4E'}
      circleColorOn={'#4E4E4E'}
      backgroundColorOn={'#11f61d'}
      backgroundColorOff={'#888585'}
      containerStyle={{
        width: 56,
        height: 34,
        borderRadius: 25,
        padding: 2,
      }}
      circleStyle={{
        width: 30,
        height: 30,
        borderRadius: 15,
      }}
    />
  )
}

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    flexDirection: 'column',
    // backgroundColor: 'lightgrey',
    // justifyContent: 'space-around',
    paddingHorizontal: Spacings.s_8,
    // paddingVertical: Spacings.s_16,
  },
  background: {
    backgroundColor: 'lightgreen', // '#202021',
    position: 'absolute',
  },
  row: {
    // marginTop: 50,
    // backgroundColor: 'lightgrey',
    flexDirection: 'column',
    alignItems: 'center',
    paddingVertical: Spacings.s_4,
  },
  neomorphContainer: {
    // shadowColor: 'red',
    // shadowOffset: { width: 6, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    borderRadius: 8,
    backgroundColor: '#4E4E4E', // 434343, 4E4E4E, 3C3C3C, 3E3E3E
    flexDirection: 'column',
    justifyContent: 'center',
  },
  rowContent: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  card: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacings.s_12,
    // backgroundColor: 'lightblue',
  },
  cardIconContainer: {
    // marginRight: Spacings.s_8,
  },
  itemsContent: {
    // flex: 1,
    // backgroundColor: 'lightgreen',
    // paddingTop: defaultSpacing(SpacingType.Base),
    // paddingHorizontal: defaultSpacing(SpacingType.Medium),
    paddingBottom: Spacings.s_24,
  },
  itemsSeparator: {
    height: Spacings.s_4,
  },
  sectionTitleContainer: {
    // backgroundColor: 'lightgreen',
    marginHorizontal: Spacings.s_16,
    marginTop: 24,
    marginBottom: 8,
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
})
