import React, { ReactElement, useState } from 'react'
import { ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { Colors, FontColors, Fonts, Spacings } from '@/theme/Variables'
import { NavigationBar } from '@/components/NavigationBar'
import ScreenContainer from '@/components/ScreenContainer'
import { ElementList } from '@/components/ElementList'
import { Neomorph } from 'react-native-neomorph-shadows'
import { DeviceScreen } from '@/common/device'
import { ImageBackground1 } from '@/components/ImageBackground1'
import SwitchToggle from 'react-native-switch-toggle'
import SvgArrowRight from '@/assets/icons/ArrowRight'

interface ActionButtonProps {
  key: string
  icon: Element
  title: string
  onPress: () => void
}

export const SettingsScreen: React.FC<{}> = (): ReactElement => {
  const [voiceAssistToggle, setVoiceAssistToggle] = useState<boolean>(true)

  const group1: ActionButtonProps[] = [
    { key: '03', title: 'Choose Language', icon: <SvgArrowRight color={Colors.white} width={20} />, onPress: () => {} },
    { key: '01', title: 'Voice Assist', icon: <SvgArrowRight color={Colors.white} width={20} />, onPress: () => {} },
  ]

  const group3: ActionButtonProps[] = [
    { key: '01', title: 'Rate us', icon: <SvgArrowRight color={Colors.white} width={20} />, onPress: () => {} },
    {
      key: '02',
      title: 'Share with friends',
      icon: <SvgArrowRight color={Colors.white} width={20} />,
      onPress: () => {},
    },
    { key: '03', title: 'Send feedback', icon: <SvgArrowRight color={Colors.white} width={20} />, onPress: () => {} },
  ]

  const renderItem = (buttonProps: ActionButtonProps) => (
    <View style={styles.row}>
      <NeomorphContainer>
        <TouchableOpacity key={buttonProps.key} style={styles.card} onPress={() => buttonProps.onPress()}>
          <Text style={[Fonts.textRegular, FontColors.white]}>{buttonProps.title}</Text>
          <View style={styles.cardIconContainer}>{buttonProps.icon}</View>
        </TouchableOpacity>
      </NeomorphContainer>
    </View>
  )

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

  const SwitchToggleMy: React.FC<{
    switchOn: boolean
    onPress: () => void
  }> = ({ switchOn, onPress }) => {
    return (
      <SwitchToggle
        switchOn={switchOn}
        onPress={onPress}
        circleColorOff={'#4E4E4E'}
        circleColorOn={'#4E4E4E'}
        backgroundColorOn={'#11f61d'}
        backgroundColorOff={'#888585'}
        duration={5000}
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

  return (
    <ScreenContainer
      backgroundComponent={() => <ImageBackground1 />}
      topInsetBackgroundColor={Colors.mineShaft}
      bottomInsetBackgroundColor={Colors.transparent}
    >
      <StatusBar barStyle={'light-content'} backgroundColor={Colors.primary} />
      <NavigationBar title={'Settings'} showBackButton={true} />
      <ScrollView style={styles.rootContainer}>
        <View style={styles.sectionTitleContainer}>
          <Text style={[Fonts.titleRegular, FontColors.white]}>CONFIGURATIONS</Text>
        </View>
        <View style={styles.row}>
          <NeomorphContainer>
            <View style={styles.card}>
              <Text style={[Fonts.textRegular, FontColors.white]}>{'Voice Assist'}</Text>
              <SwitchToggleMy switchOn={voiceAssistToggle} onPress={() => setVoiceAssistToggle(!voiceAssistToggle)} />
            </View>
          </NeomorphContainer>
        </View>
        <ElementList
          style={styles.itemsContent}
          // itemSeparatorComponent={<View style={styles.itemsSeparator} />}
          items={group1.map(item => renderItem(item))}
        />
        <View style={styles.sectionTitleContainer}>
          <Text style={[Fonts.titleRegular, FontColors.white]}>Share & Feedback</Text>
        </View>
        <ElementList
          style={styles.itemsContent}
          // itemSeparatorComponent={<View style={styles.itemsSeparator} />}
          items={group3.map(item => renderItem(item))}
        />
      </ScrollView>
    </ScreenContainer>
  )
}

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    flexDirection: 'column',
    // backgroundColor: 'lightgrey',
    // justifyContent: 'space-around',
    paddingHorizontal: Spacings.s_8,
    paddingVertical: Spacings.s_16,
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
