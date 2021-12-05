import React, { ReactElement } from 'react'
import { ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { Colors, FontColors, Fonts, Spacings } from '@/theme/Variables'
import SvgComponent from '@/assets/icons/DarkAnd'
import { NavigationBar } from '@/components/NavigationBar'
import ScreenContainer from '@/components/ScreenContainer'
import { ElementList } from '@/components/ElementList'
import { Neomorph } from 'react-native-neomorph-shadows'
import { DeviceScreen } from '@/common/device'
import SvgEdit from '@/assets/icons/Edit'

interface ActionButtonProps {
  key: string
  icon: Element
  title: string
  onPress: () => void
}

export const SettingsScreen: React.FC<{}> = (): ReactElement => {
  const actionButtons: ActionButtonProps[] = [
    { key: '01', title: 'Rate us', icon: <SvgEdit color={Colors.white} width={20} />, onPress: () => {} },
    { key: '02', title: 'Share with friends', icon: <SvgEdit color={Colors.white} width={20} />, onPress: () => {} },
  ]

  const renderItem = (buttonProps: ActionButtonProps) => (
    <View style={styles.row}>
      <Neomorph
        inner={false} // <- enable shadow inside of neomorph
        swapShadows // <- change zIndex of each shadow color
        style={{
          ...styles.neomorphContainer,
          width: DeviceScreen.width - Spacings.s_48,
          height: 56,
        }}
      >
        <View style={styles.rowContent}>
          <TouchableOpacity key={buttonProps.key} style={styles.card} onPress={() => buttonProps.onPress()}>
            <View style={styles.cardIconContainer}>{buttonProps.icon}</View>
            <Text style={[Fonts.textRegular, FontColors.white]}>{buttonProps.title}</Text>
          </TouchableOpacity>
        </View>
      </Neomorph>
    </View>
  )

  return (
    <ScreenContainer
      backgroundComponent={() => <SvgComponent />}
      topInsetBackgroundColor={Colors.mineShaft}
      bottomInsetBackgroundColor={Colors.transparent}
    >
      <StatusBar barStyle={'light-content'} backgroundColor={Colors.primary} />
      <NavigationBar title={'Settings'} showBackButton={true} />
      <ScrollView style={styles.rootContainer}>
        {/*{presets && presets.map(preset => renderItem(preset))}*/}
        <ElementList
          style={styles.itemsContent}
          // itemSeparatorComponent={<View style={styles.itemsSeparator} />}
          items={actionButtons.map(item => renderItem(item))}
        />
        {/*<View style={styles.actionSection}>*/}
        {/*  <View style={[styles.start]}>*/}
        {/*    /!*<TouchableOpacity style={[Common.button.rounded]} onPress={() => onTestCountdownTimerPressed()}>*!/*/}
        {/*    /!*  <Text style={Fonts.textRegular}>{'Test-Countdown-Timer'}</Text>*!/*/}
        {/*    /!*</TouchableOpacity>*!/*/}
        {/*  </View>*/}
        {/*</View>*/}
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
    justifyContent: 'space-between',
  },
  card: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: Spacings.s_12,
    marginRight: Spacings.s_8,
    // backgroundColor: 'lightblue',
  },
  cardIconContainer: {
    marginRight: Spacings.s_8,
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
})
