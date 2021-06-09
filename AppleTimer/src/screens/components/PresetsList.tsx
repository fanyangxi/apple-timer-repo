import { FlatList, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { Fonts } from '@/theme/Variables'
import React from 'react'
import { Preset } from '@/models/preset'
import { DeviceScreen } from '@/common/device'

export interface PresetListProps {
  presets: Preset[]
  current?: Preset
  onSelectionChanged?: (selected: Preset) => void
}

export const PresetList: React.FC<PresetListProps> = ({ presets, current, onSelectionChanged }) => {
  const renderItem = (preset: Preset) => (
    <TouchableOpacity
      key={preset.Name}
      style={styles.card}
      onPress={() => onSelectionChanged && onSelectionChanged(preset)}
    >
      <Text style={Fonts.textRegular}>Name: {preset.Name}</Text>
      <Text style={Fonts.textRegular}>PrepareSecs: {preset.PrepareSecs}</Text>
      <Text style={Fonts.textRegular}>WorkoutSecs: {preset.WorkoutSecs}</Text>
      <Text style={Fonts.textRegular}>RestSecs: {preset.RestSecs}</Text>
    </TouchableOpacity>
  )
  return (
    <View style={styles.rootContainer}>
      <View style={styles.content_header} key="0" />
      <ScrollView style={styles.content}>
        {/*<FlatList*/}
        {/*  data={presets}*/}
        {/*  contentContainerStyle={styles.listContent}*/}
        {/*  renderItem={({ item }) => renderItem(item)}*/}
        {/*  keyExtractor={item => item.Name}*/}
        {/*  ItemSeparatorComponent={() => <View style={styles.separator} />}*/}
        {/*/>*/}
        {/*<Text>YOUR CUSTOM COMPONENT INSIDE THE ACTIONSHEET</Text>*/}
        {presets && presets.map(preset => renderItem(preset))}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  rootContainer: {},
  content: {
    maxHeight: DeviceScreen.height * 0.4,
  },
  content_header: {
    padding: 15,
    paddingBottom: 0,

    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  listContent: {
    // backgroundColor: 'yellow',
  },
  card: {
    margin: 12,
    backgroundColor: '#434343',
  },
  separator: {
    height: 4,
    backgroundColor: 'lightblue',
  },
})
