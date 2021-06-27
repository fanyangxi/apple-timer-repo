import uuid from 'react-native-uuid'
import { AsyncStorageUtils } from '@/utils/async-storage-utils'
import { AppSettings } from '@/models/app-settings'

const APP_SETTINGS_DATA_STORE = 'app_settings_data_store'

const DEFAULT_APP_SETTINGS: AppSettings = {
  id: `${uuid.v4()}`,
  name: 'app-settings',
  language: '',
}

const getAppSettings = async (): Promise<AppSettings> => {
  const settings = await _getAppSettings()

  // init default-preset if it doesn't exist
  if (!settings) {
    _validateAppSettings(DEFAULT_APP_SETTINGS)
    await AsyncStorageUtils.setObject(APP_SETTINGS_DATA_STORE, DEFAULT_APP_SETTINGS)
    return DEFAULT_APP_SETTINGS
  }

  return settings
}

const updateAppSettings = async (model: AppSettings): Promise<void> => {
  // checking:
  const settings = await _getAppSettings()
  if (!settings) {
    throw new Error('App-settings entry was not correctly initiated')
  }
  if (settings.id !== model.id || settings.name !== model.name) {
    throw new Error(
      `The updated model has invalid field-value:(id:${model.id}/name:${model.name}), expected to ` +
        `be:(id:${settings.id}/name:${settings.name})`,
    )
  }
  // saving/update:
  _validateAppSettings(model)
  await AsyncStorageUtils.setObject(APP_SETTINGS_DATA_STORE, model)
}

const _getAppSettings = async (): Promise<AppSettings | null> => {
  return await AsyncStorageUtils.getObject<AppSettings>(APP_SETTINGS_DATA_STORE)
}

const _validateAppSettings = (data: AppSettings): void => {
  // to be implemented
}

export const AppSettingsDataService = {
  getAppSettings,
  updateAppSettings,
}
