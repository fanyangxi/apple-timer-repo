import { PresetEntity } from '@/entities/preset-entity'
import { AsyncStorageUtils } from '@/utils/async-storage-utils'
import { Preset } from '@/models/preset'
import _ from 'lodash'
import { v4 as uuidv4 } from 'uuid'

const DATA_TABLE_KEY = 'THE-TIMER-9527'

const getActivePreset = async (): Promise<Preset> => {
  const items = await _getPresetEntities()
  const results = items.filter(item => item.isActive)
  if (results.length !== 1) {
    throw new Error('No active preset is found, even the default one.')
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
    id: uuidv4(),
    name: model.Name,
    setsCount: model.SetsCount,
    repsCount: model.RepsCount,
    prepareSecs: model.PrepareSecs,
    workoutSecs: model.WorkoutSecs,
    restSecs: model.RestSecs,
    isActive: false,
  }

  // checking:
  const items = await _getPresetEntities()
  const isNameExistAlready = items.filter(item => item.name === entity.name).length > 0
  if (isNameExistAlready) {
    throw new Error(`Name:(${entity.name}) already exists`)
  }
  const existing = _.first(items.filter(item => item.id === entity.id))
  if (existing) {
    throw new Error(`Id:(${entity.id}) already exists`)
  }

  // saving/create:
  const results = [...items, entity]
  console.log('Create:', results)
  await AsyncStorageUtils.setObject(DATA_TABLE_KEY, results)
}

const updatePreset = async (model: Preset): Promise<void> => {
  // model to entity:
  const entity: PresetEntity = _toEntity(model)

  // checking:
  const items = await _getPresetEntities()
  const isNameExistAlready = items.filter(item => item.name === entity.name).length > 0
  if (isNameExistAlready) {
    throw new Error(`Name:(${entity.name}) already exists`)
  }
  const existing = _.first(items.filter(item => item.id === entity.id))
  if (!existing) {
    throw new Error(`Id:(${entity.id}) doesn't exist`)
  }

  // saving/update:
  const results = items.map(item => (item.id === entity.id ? entity : item))
  console.log('Update:', results)
  await AsyncStorageUtils.setObject(DATA_TABLE_KEY, results)
}

const _toEntity = (model: Preset): PresetEntity => {
  return {
    id: uuidv4(),
    name: model.Name,
    setsCount: model.SetsCount,
    repsCount: model.RepsCount,
    prepareSecs: model.PrepareSecs,
    workoutSecs: model.WorkoutSecs,
    restSecs: model.RestSecs,
    isActive: false,
  } as PresetEntity
}

const _toModel = (entity: PresetEntity): Preset => {
  return new Preset(
    entity.id,
    entity.name,
    entity.setsCount,
    entity.repsCount,
    entity.prepareSecs,
    entity.workoutSecs,
    entity.restSecs,
    entity.isActive,
  )
}

const _getPresetEntities = async (): Promise<PresetEntity[]> => {
  const items = await AsyncStorageUtils.getObject<PresetEntity[]>(DATA_TABLE_KEY)
  if (!items) {
    return []
  }
  return items
}

export const DataService = { getActivePreset, getPresets, createPreset, updatePreset }
