import { Preset } from '@/models/preset'
import { UserSettings } from '@/models/common'
import { getDeviceLanguageCode } from '@/utils/common-util'

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
  language: getDeviceLanguageCode(),
  enableVoiceAssist: true,
}

export const MAX_PRESETS_ALLOWED = 6

export const APP_CUSTOMER_SUPPORT_EMAIL = 'apple-timer@gmail.com'
