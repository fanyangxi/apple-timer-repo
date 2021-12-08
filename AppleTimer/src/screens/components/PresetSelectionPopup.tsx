import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { Colors, FontColors, Fonts, RadiusSizes, Spacings } from '@/theme/Variables'
import React, { useEffect, useState } from 'react'
import { Preset } from '@/models/preset'
import { DeviceScreen } from '@/common/device'
import { assets } from '@/assets'
import { Neomorph } from 'react-native-neomorph-shadows'
import { ElementList } from '@/components/ElementList'
import { DataService } from '@/services/data-service'
import { useFocusEffect } from '@react-navigation/native'
import Toast from 'react-native-toast-message'
import { ConfirmDialog } from 'react-native-simple-dialogs'
import { ListButton } from '@/components/button/ListButton'
import { AddButton } from '@/components/button/AddButton'
import { FinishButton } from '@/components/button/FinishButton'
import { EditButton } from '@/components/button/EditButton'
import { DeleteButton } from '@/components/button/DeleteButton'

export interface PresetSelectionPopupProps {
  current?: Preset
  onSelectionChanged?: (selected: Preset) => void
  onEditItemClicked?: (selected: Preset) => void
  onDeleteItemClicked?: (selected: Preset) => void
  onAddClicked?: () => void
}

export const PresetSelectionPopup: React.FC<PresetSelectionPopupProps> = ({
  current,
  onSelectionChanged,
  onEditItemClicked,
  onDeleteItemClicked,
  onAddClicked,
}) => {
  const [cachedPresets, setCachedPresets] = useState<Preset[]>([])
  const [deletingPreset, setDeletingPreset] = useState<Preset | undefined>()
  const [isManagingList, setIsManagingList] = useState<boolean>(false)
  const [showConfirmDialog, setShowConfirmDialog] = useState<boolean>(false)

  useEffect(() => {
    console.log('>>>> Preset selection-popup loaded')
    // eslint-disable-next-line
  }, [])

  useFocusEffect(
    React.useCallback(() => {
      reloadItems()
      console.log('>>>> Preset selection-popup Focused')
    }, []),
  )

  const reloadItems = () => {
    DataService.getPresets().then(items => {
      console.log('Cached-preset:', items)
      setCachedPresets(items)
    })
  }

  function deletePreset(preset: Preset) {
    DataService.deletePreset(preset.Id)
      .then(() => {
        console.log(`Delete preset:${preset.Name} completed`)
        reloadItems()
      })
      .catch(e => {
        Toast.show({
          type: 'error',
          position: 'top',
          text1: 'Delete preset failed:',
          text2: `${e}`,
        })
      })
  }

  const renderItem = (preset: Preset) => (
    <View style={styles.row}>
      <Neomorph
        inner={false} // <- enable shadow inside of neomorph
        swapShadows // <- change zIndex of each shadow color
        style={{
          ...styles.neomorphContainer,
          width: DeviceScreen.width - Spacings.s_48,
          height: 80,
          ...(isManagingList ? { shadowRadius: 1, backgroundColor: '#5f5e5e' } : {}),
        }}
      >
        <View style={styles.rowContent}>
          <TouchableOpacity
            key={preset.Name}
            style={styles.card}
            disabled={isManagingList}
            onPress={() => onSelectionChanged && onSelectionChanged(preset)}
          >
            <Text style={[Fonts.titleSmall, preset.IsActive ? FontColors.clickable : FontColors.white]}>
              {preset.Name}
            </Text>
            <Text style={[Fonts.textSmall, FontColors.grey]}>
              Prepare:{preset.PrepareSecs} / Workout:{preset.WorkoutSecs} / Rest:{preset.RestSecs}
            </Text>
            <Text style={[Fonts.textSmall, FontColors.grey]}>
              Cycles:{preset.CyclesCount} / Sets:{preset.SetsCount}
            </Text>
          </TouchableOpacity>
          <View style={styles.actionButton}>
            {!isManagingList && (
              <EditButton
                key={`${preset.Name}-edit-container`}
                onPress={() => onEditItemClicked && onEditItemClicked(preset)}
              />
            )}
            {isManagingList && (
              <DeleteButton
                key={`${preset.Name}-delete-container`}
                color={Colors.error}
                disabled={preset.IsActive}
                onPress={() => {
                  setDeletingPreset(preset)
                  setShowConfirmDialog(true)
                }}
              />
            )}
          </View>
        </View>
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
      <View style={styles.actionButtonsBar}>
        <View style={styles.leftButtonContainer}>
          <AddButton onPress={() => onAddClicked && onAddClicked()} />
        </View>
        <Text style={[Fonts.titleRegular, FontColors.white]}>My Presets</Text>
        <View style={styles.rightButtonContainer}>
          {!isManagingList ? (
            <ListButton onPress={() => setIsManagingList(true)} />
          ) : (
            <FinishButton onPress={() => setIsManagingList(false)} color={Colors.success} />
          )}
        </View>
      </View>
      <ScrollView style={styles.itemsScroll}>
        {/*{presets && presets.map(preset => renderItem(preset))}*/}
        <ElementList
          style={styles.itemsContent}
          itemSeparatorComponent={<View style={styles.itemsSeparator} />}
          items={cachedPresets && cachedPresets.map(preset => renderItem(preset))}
        />
      </ScrollView>
      <ConfirmDialog
        visible={showConfirmDialog}
        title={'Confirm Deletion'}
        titleStyle={[Fonts.titleRegular, FontColors.warn]}
        message={`Are you sure to delete preset (${deletingPreset?.Name})?`}
        onTouchOutside={() => setShowConfirmDialog(false)}
        negativeButton={{
          title: 'Cancel',
          onPress: () => setShowConfirmDialog(false),
        }}
        positiveButton={{
          title: 'Yes, delete it',
          titleStyle: { color: Colors.primary },
          onPress: () => {
            setShowConfirmDialog(false)
            if (deletingPreset) {
              deletePreset(deletingPreset)
              onDeleteItemClicked && onDeleteItemClicked(deletingPreset)
            }
          },
        }}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  rootContainer: {
    height: DeviceScreen.height * 0.6,
    borderTopLeftRadius: RadiusSizes.r12,
    borderTopRightRadius: RadiusSizes.r12,
    backgroundColor: '#4E4E4E',
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
  background: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: '100%',
    height: '100%',
  },
  actionButtonsBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopLeftRadius: RadiusSizes.r12,
    borderTopRightRadius: RadiusSizes.r12,
    paddingHorizontal: Spacings.s_16,
    paddingTop: Spacings.s_12,
    paddingBottom: Spacings.s_8,
    backgroundColor: '#434343',
  },
  itemsScroll: {
    marginVertical: Spacings.s_8,
  },
  itemsContent: {
    // flex: 1,
    // backgroundColor: 'lightgreen',
    // paddingTop: defaultSpacing(SpacingType.Base),
    // paddingHorizontal: defaultSpacing(SpacingType.Medium),
    paddingBottom: Spacings.s_24,
  },
  itemsSeparator: {
    height: Spacings.s_8,
  },
  listContent: {
    // backgroundColor: 'yellow',
  },
  rowContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  card: {
    flex: 1,
    paddingHorizontal: Spacings.s_12,
    // backgroundColor: '#434343',
  },
  actionButton: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacings.s_4,
    // backgroundColor: 'grey',
  },
  separator: {
    height: 4,
    backgroundColor: 'lightblue',
  },
  leftButtonContainer: {
    width: 40,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    // backgroundColor: 'lightblue',
  },
  rightButtonContainer: {
    width: 40,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    // backgroundColor: 'lightblue',
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
