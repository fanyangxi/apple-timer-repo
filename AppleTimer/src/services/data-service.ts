import { PresetEntity } from '@/entities/preset-entity'
import { AsyncStorageUtils } from '@/utils/async-storage-utils'
import { Preset } from '@/models/preset'
import _ from 'lodash'
import uuid from 'react-native-uuid'
import { MAX_PRESET_DURATION_ALLOWED_SECS, MAX_PRESETS_ALLOWED } from '@/common/constants'
import { formatSecs } from '@/utils/date-util'
import i18next from 'i18next'

const DATA_TABLE_KEY = 'THE-TIMER-9527'

const getActivePreset = async (): Promise<Preset> => {
  const items = await _getPresetEntities()

  // init default-preset if it doesn't exist
  if (items.length === 0) {
    const defaultPreset = new Preset(`${uuid.v4()}`, 'Tabata', 5, 30, 15, 6, 1, true)
    await createPreset(defaultPreset)
    return defaultPreset
  }

  const results = items.filter(item => item.isActive)
  if (results.length !== 1) {
    throw new Error(`${i18next.t('errors.multipleActivePresetsFound')}: ${results.length}`)
  }

  return _toModel(results[0])
}

const getPresets = async (): Promise<Preset[]> => {
  const items = await _getPresetEntities()
  return items.map(item => _toModel(item))
}

const createPreset = async (model: Preset): Promise<void> => {
  // model to entity:
  const entity: PresetEntity = {
    id: `${uuid.v4()}`,
    name: model.Name,
    cyclesCount: model.CyclesCount,
    setsCount: model.SetsCount,
    prepareSecs: model.PrepareSecs,
    workoutSecs: model.WorkoutSecs,
    restSecs: model.RestSecs,
    isActive: model.IsActive,
  }
  _validateInputData(entity)

  // checking:
  const items = await _getPresetEntities()
  if (items.length >= MAX_PRESETS_ALLOWED) {
    throw new Error(`${i18next.t('presetsSelection.maxAllowedPresetExceeded')}. (${entity.id})`)
  }
  const isNameExistAlready = items.filter(item => item.name === entity.name).length > 0
  if (isNameExistAlready) {
    throw new Error(`${i18next.t('errors.nameDuplicated')}. (${entity.name})`)
  }
  const existing = _.first(items.filter(item => item.id === entity.id))
  if (existing) {
    throw new Error(`${i18next.t('errors.idDuplicated')}. (${entity.id})`)
  }

  // saving/create:
  const results = [...items, entity]
  console.log('Create:', results)
  _validateEntities(results)
  await AsyncStorageUtils.setObject(DATA_TABLE_KEY, results)
}

const updatePreset = async (model: Preset): Promise<void> => {
  // model to entity:
  const entity: PresetEntity = _toEntity(model)
  _validateInputData(entity)

  // checking:
  const items = await _getPresetEntities()
  const isNameExistAlready = items.filter(item => item.id !== model.Id && item.name === entity.name).length > 0
  if (isNameExistAlready) {
    throw new Error(`${i18next.t('errors.nameDuplicated')}. (${entity.name})`)
  }
  const existing = _.first(items.filter(item => item.id === entity.id))
  if (!existing) {
    throw new Error(`${i18next.t('errors.idDuplicated')}. (${entity.id})`)
  }

  // saving/update:
  const results = items.map(item => (item.id === entity.id ? entity : item))
  console.log('Update:', results)
  _validateEntities(results)
  await AsyncStorageUtils.setObject(DATA_TABLE_KEY, results)
}

const deletePreset = async (presetId: string): Promise<void> => {
  const entity = await _getPresetEntityById(presetId)
  if (!entity) {
    throw new Error(`${i18next.t('errors.presetCannotFound')}. Id:${presetId}`)
  }

  if (entity.isActive) {
    throw new Error(`${i18next.t('errors.deleteActivePresetNotAllowed')}. Id:${presetId}`)
  }

  // Only keep target item as `Active`:
  const items = await _getPresetEntities()
  const results = items.filter(item => item.id !== presetId)
  _validateEntities(results)
  await AsyncStorageUtils.setObject(DATA_TABLE_KEY, results)
}

const setActivePreset = async (presetId: string): Promise<void> => {
  const entity = await _getPresetEntityById(presetId)
  if (!entity) {
    throw new Error(`Target preset cannot be found. Id:${presetId}`)
  }

  // Only keep target item as `Active`:
  const items = await _getPresetEntities()
  const results = items.map(item => {
    if (item.id === entity.id) {
      entity.isActive = true
      return entity
    } else {
      item.isActive = false
      return item
    }
  })
  console.log('Update:', results)
  await AsyncStorageUtils.setObject(DATA_TABLE_KEY, results)
}

const _toEntity = (model: Preset): PresetEntity => {
  return {
    id: model.Id,
    name: model.Name,
    prepareSecs: model.PrepareSecs,
    workoutSecs: model.WorkoutSecs,
    restSecs: model.RestSecs,
    setsCount: model.SetsCount,
    cyclesCount: model.CyclesCount,
    isActive: model.IsActive,
  } as PresetEntity
}

const _toModel = (entity: PresetEntity): Preset => {
  return new Preset(
    entity.id,
    entity.name,
    entity.prepareSecs,
    entity.workoutSecs,
    entity.restSecs,
    entity.setsCount,
    entity.cyclesCount,
    entity.isActive,
  )
}

const _validateInputData = (entity: PresetEntity): void => {
  const duration = (entity.prepareSecs + (entity.workoutSecs + entity.restSecs) * entity.setsCount) * entity.cyclesCount
  if (duration > MAX_PRESET_DURATION_ALLOWED_SECS) {
    throw new Error(`${i18next.t('errors.maximumAllowedPresetDurationExceeded')}: ${formatSecs(duration)}`)
  }
  if (_.isEmpty(entity.name)) {
    throw new Error(`${i18next.t('errors.presetNameCannotBeEmpty')}`)
  }
  if (
    entity.prepareSecs === 0 ||
    entity.workoutSecs === 0 ||
    entity.restSecs === 0 ||
    entity.setsCount === 0 ||
    entity.cyclesCount === 0
  ) {
    throw new Error(`${i18next.t('errors.presetFieldsCannotBeEmpty')}`)
  }
}

const _validateEntities = (entities: PresetEntity[]): void => {
  if (_.uniqBy(entities, 'id').length !== entities.length) {
    throw new Error(`Duplicate id found in entities: ${JSON.stringify(entities)}`)
  }
  if (_.uniqBy(entities, 'name').length !== entities.length) {
    throw new Error(`Duplicate name found in entities: ${JSON.stringify(entities)}`)
  }
}

const _getPresetEntities = async (): Promise<PresetEntity[]> => {
  const items = await AsyncStorageUtils.getObject<PresetEntity[]>(DATA_TABLE_KEY)
  if (!items) {
    return []
  }
  return items.filter(item => _isValid(item))
}

const _getPresetEntityById = async (id: string): Promise<PresetEntity | undefined> => {
  const items = await AsyncStorageUtils.getObject<PresetEntity[]>(DATA_TABLE_KEY)
  if (!items || items.length === 0) {
    return undefined
  }
  return items.filter(item => item.id === id)[0]
}

const _isValid = (item: any): boolean => {
  return ['id', 'name', 'prepareSecs', 'workoutSecs', 'restSecs', 'setsCount', 'cyclesCount', 'isActive'].every(prop =>
    item.hasOwnProperty(prop),
  )
}

export const DataService = { getActivePreset, getPresets, createPreset, updatePreset, deletePreset, setActivePreset }
