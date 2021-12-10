import { AsyncStorageUtils } from '@/utils/async-storage-utils'
import { DEFAULT_USER_SETTINGS } from '@/common/constants'
import { UserSettings } from '@/models/common'

const USER_SETTINGS_DATA_TABLE_KEY = 'THE-USER-SETTINGS-9527'

const getUserSettings = async (): Promise<UserSettings> => {
  const settings = await AsyncStorageUtils.getObject<UserSettings>(USER_SETTINGS_DATA_TABLE_KEY)
  if (!settings) {
    return DEFAULT_USER_SETTINGS
  }
  return settings
}

const saveUserSettings = async (settings: Partial<UserSettings>): Promise<void> => {
  const existing = await getUserSettings()
  const merged: UserSettings = { ...existing, ...settings }

  // saving/update:
  console.log('Update user-settings to:', merged)
  await AsyncStorageUtils.setObject(USER_SETTINGS_DATA_TABLE_KEY, merged)
}

export const UserSettingsDataService = { getUserSettings, saveUserSettings }
