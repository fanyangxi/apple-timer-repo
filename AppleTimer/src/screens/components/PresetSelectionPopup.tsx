import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { Colors, FontColors, Fonts, RadiusSizes, Spacings } from '@/theme/Variables'
import React, { useEffect, useState } from 'react'
import { Preset } from '@/models/preset'
import { DeviceScreen } from '@/common/device'
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
import { formatSecs } from '@/utils/date-util'
import { ImageBackground1 } from '@/components/ImageBackground1'
import { useTranslation } from 'react-i18next'

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
  const { t } = useTranslation()
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
          text1: t('presetsSelection.deletePresetFailed'),
          text2: `${e}`,
        })
      })
  }

  const renderItem = (it: Preset) => (
    <View style={styles.row}>
      <Neomorph
        inner={false} // <- enable shadow inside of neomorph
        swapShadows // <- change zIndex of each shadow color
        style={{
          ...styles.neomorphContainer,
          width: DeviceScreen.width - Spacings.s_48,
          height: 88,
          ...(isManagingList ? { backgroundColor: '#5f5e5e' } : {}),
        }}
      >
        <View style={styles.rowContent}>
          <TouchableOpacity
            key={it.Name}
            style={styles.card}
            disabled={isManagingList}
            onPress={() => onSelectionChanged && onSelectionChanged(it)}
          >
            <Text style={[Fonts.titleRegular, it.IsActive ? FontColors.clickable : FontColors.white]}>{it.Name}</Text>
            <View style={styles.itemDescription}>
              <Text style={[Fonts.textSmall, FontColors.grey]}>
                {t('workoutDetail.prepare')} {formatSecs(it.PrepareSecs)}, {t('workoutDetail.workout')}
                {formatSecs(it.WorkoutSecs)}, {t('workoutDetail.rest')}:{formatSecs(it.RestSecs)}
              </Text>
              <Text style={[Fonts.textSmall, FontColors.grey]}>
                {t('workoutDetail.cycles')}:{formatSecs(it.CyclesCount)} / {t('workoutDetail.sets')}:
                {formatSecs(it.SetsCount)}
              </Text>
            </View>
          </TouchableOpacity>
          <View style={styles.actionButton}>
            {!isManagingList && (
              <EditButton
                key={`${it.Name}-edit-container`}
                onPress={() => onEditItemClicked && onEditItemClicked(it)}
              />
            )}
            {isManagingList && (
              <DeleteButton
                key={`${it.Name}-delete-container`}
                color={Colors.error}
                disabled={it.IsActive}
                onPress={() => {
                  setDeletingPreset(it)
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
        <ImageBackground1 style={{ borderTopLeftRadius: RadiusSizes.r12, borderTopRightRadius: RadiusSizes.r12 }} />
      </View>
      <View style={styles.actionButtonsBar}>
        <View style={styles.leftButtonContainer}>
          {!isManagingList && <AddButton onPress={() => onAddClicked && onAddClicked()} />}
        </View>
        <Text style={[Fonts.titleRegular, FontColors.white]}>{t('presetsSelection.title')}</Text>
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
        title={t('confirmDeletion.title')}
        titleStyle={[Fonts.titleRegular, FontColors.warn]}
        message={`${t('confirmDeletion.description')} (${deletingPreset?.Name})?`}
        onTouchOutside={() => setShowConfirmDialog(false)}
        negativeButton={{
          title: t('confirmDeletion.cancel'),
          titleStyle: { ...Fonts.textLarge },
          onPress: () => setShowConfirmDialog(false),
        }}
        positiveButton={{
          title: t('confirmDeletion.delete'),
          titleStyle: { ...Fonts.titleRegular, color: Colors.primary },
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
    flexGrow: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: Spacings.s_8,
  },
  card: {
    flex: 1,
    paddingHorizontal: Spacings.s_12,
    // backgroundColor: '#434343',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  itemDescription: {
    // backgroundColor: '#434343',
    marginTop: Spacings.s_4,
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
