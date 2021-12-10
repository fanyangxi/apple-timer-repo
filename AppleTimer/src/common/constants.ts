import { Preset } from '@/models/preset'
import { Languages, UserSettings } from '@/models/common'
import { AppStateContextProps } from '@/common/app-state-context'
import { SetStateAction } from 'react'

export const Screens = {
  Home: 'Home2',
  Debugger: 'Debugger',
  Settings: 'Settings',
  PresetDetail: 'PresetDetail',
}

export const DEFAULT_NEW_PRESET = new Preset('', 'New Workout', 5, 40, 15, 8, 1)

export const HAPTIC_FEEDBACK_OPTIONS = { enableVibrateFallback: true, ignoreAndroidSystemSettings: true }

// Note: It's for DynamicallySelectedPicker.
export type ScrollEventArgs = { index: number; item: any }

export const MAX_PRESET_DURATION_ALLOWED_SECS = 24 * 60 * 60 * 3 // 72hrs

export const DEFAULT_USER_SETTINGS: UserSettings = {
  language: Languages.English,
  enableVoiceAssist: true,
}

export const DEFAULT_APP_STATE_CONTEXT: AppStateContextProps = {
  userSettings: DEFAULT_USER_SETTINGS,
  setUserSettings: (_: SetStateAction<UserSettings>): void => {},
}
