import { Button, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { FontColors, Fonts, RadiusSizes, Spacings } from '@/theme/Variables'
import React from 'react'
import { Preset } from '@/models/preset'
import { DeviceScreen } from '@/common/device'
import { assets } from '@/assets'
import { Neomorph } from 'react-native-neomorph-shadows'
import { ElementList } from '@/components/ElementList'

export interface PresetListProps {
  presets: Preset[]
  current?: Preset
  onSelectionChanged?: (selected: Preset) => void
  onAddClicked?: () => void
}

export const PresetSelectionPopup: React.FC<PresetListProps> = ({
  presets,
  current,
  onSelectionChanged,
  onAddClicked,
}) => {
  const renderItem = (preset: Preset) => (
    <View style={styles.row}>
      <Neomorph
        inner={false} // <- enable shadow inside of neomorph
        swapShadows // <- change zIndex of each shadow color
        style={{
          ...styles.neomorphContainer,
          width: DeviceScreen.width - Spacings.s_48,
          height: 90,
        }}
      >
        <TouchableOpacity
          key={preset.Name}
          style={styles.card}
          onPress={() => onSelectionChanged && onSelectionChanged(preset)}
        >
          <Text style={Fonts.textRegular}>Name: {preset.Name}</Text>
          <Text style={Fonts.textRegular}>PrepareSecs: {preset.PrepareSecs}</Text>
          <Text style={[Fonts.textRegular, FontColors.white]}>WorkoutSecs: {preset.WorkoutSecs}</Text>
          <Text style={Fonts.textRegular}>RestSecs: {preset.RestSecs}</Text>
        </TouchableOpacity>
      </Neomorph>
    </View>
  )
  return (
    <View style={styles.rootContainer}>
      <View style={styles.background}>
        <Image
          source={assets.images.darkBackground}
          style={{
            flex: 1,
            width: undefined,
            height: undefined,
            borderTopLeftRadius: RadiusSizes.r12,
            borderTopRightRadius: RadiusSizes.r12,
          }}
        />
      </View>
      <View style={styles.actionButtons}>
        <Text>Your Presets</Text>
        <Button title={'ADD'} onPress={() => onAddClicked && onAddClicked()} />
      </View>
      <ScrollView style={styles.content}>
        {/*{presets && presets.map(preset => renderItem(preset))}*/}
        <ElementList
          style={styles.itemsContainer}
          itemSeparatorComponent={<View style={styles.itemsSeparator} />}
          items={presets && presets.map(preset => renderItem(preset))}
        />
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  rootContainer: {
    height: DeviceScreen.height * 0.7,
    // backgroundColor: Colors.primary,
  },
  row: {
    // marginTop: 50,
    // backgroundColor: 'lightgrey',
    flexDirection: 'column',
    alignItems: 'center',
  },
  neomorphContainer: {
    // shadowColor: 'red',
    // shadowOffset: { width: 6, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    borderRadius: 16,
    backgroundColor: '#4E4E4E', // 434343, 4E4E4E, 3C3C3C, 3E3E3E
    flexDirection: 'column',
    justifyContent: 'center',
  },
  background: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: '100%',
    height: '100%',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingHorizontal: Spacings.s_8,
  },
  content: {
    paddingVertical: Spacings.s_8,
  },
  itemsContainer: {
    flex: 1,
    // paddingTop: defaultSpacing(SpacingType.Base),
    // paddingHorizontal: defaultSpacing(SpacingType.Medium),
    // paddingBottom: defaultSpacing(SpacingType.ExtraLarge)
  },
  itemsSeparator: {
    height: Spacings.s_12,
  },
  listContent: {
    // backgroundColor: 'yellow',
  },
  card: {
    paddingHorizontal: Spacings.s_12,
    // backgroundColor: '#434343',
  },
  separator: {
    height: 4,
    backgroundColor: 'lightblue',
  },
})

/*<FlatList*/
/*  data={presets}*/
/*  contentContainerStyle={styles.listContent}*/
/*  renderItem={({ item }) => renderItem(item)}*/
/*  keyExtractor={item => item.Name}*/
/*  ItemSeparatorComponent={() => <View style={styles.separator} />}*/
/*/>*/
/*<Text>YOUR CUSTOM COMPONENT INSIDE THE ACTIONSHEET</Text>*/
