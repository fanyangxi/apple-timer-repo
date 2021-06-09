import { FlatList, ListView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { Fonts } from '@/theme/Variables'
import React from 'react'
import { Preset } from '@/models/preset'

export interface PresetListProps {
  presets: Preset[]
  current?: Preset
  onSelectionChanged?: (selected: Preset) => void
}

export const PresetList: React.FC<PresetListProps> = ({ presets, current, onSelectionChanged }) => {
  const renderItem = (preset: Preset) => (
    <View style={styles.card}>
      <Text style={Fonts.textRegular}>Name: {preset.Name}</Text>
      <Text style={Fonts.textRegular}>PrepareSecs: {preset.PrepareSecs}</Text>
      <Text style={Fonts.textRegular}>WorkoutSecs: {preset.WorkoutSecs}</Text>
      <Text style={Fonts.textRegular}>RestSecs: {preset.RestSecs}</Text>
    </View>
  )
  return (
    <View style={styles.rootContainer}>
      <FlatList
        data={presets}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => renderItem(item)}
        keyExtractor={item => item.Key()}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  rootContainer: {},
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
