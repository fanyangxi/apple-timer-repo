import { Preset } from '@/models/preset'
import { UserSettings } from '@/models/common'
import { getDeviceLanguageCode } from '@/utils/common-util'
import { Platform } from 'react-native'

export const Screens = {
  Home: 'Home2',
  Debugger: 'Debugger',
  Settings: 'Settings',
  PresetDetail: 'PresetDetail',
}

export const APP_NAME = 'Onion Timer'

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

// Sample AdMob App ID for testing: ca-app-pub-3940256099942544~3347511713
// TEST adUnitID ca-app-pub-3940256099942544/2247696110
export const GOOGLE_ADMOB_APP_ID_ANDROID = 'ca-app-pub-1056852286164047~7822725133'
export const GOOGLE_ADMOB_AD_UNIT_ID_ANDROID = 'ca-app-pub-1056852286164047/4875576717'
export const GOOGLE_ADMOB_APP_ID_IOS = 'ca-app-pub-1056852286164047~9778611119'
export const GOOGLE_ADMOB_AD_UNIT_ID_IOS = 'ca-app-pub-1056852286164047/9828520491'

/** Distributing: **/
export const DISTRIBUTED_APP_LINK = Platform.select({
  ios: 'https://play.google.com/store/apps/details?id=nic.goi.aarogyasetu&hl=en',
  android: 'https://play.google.com/store/apps/details?id=nic.goi.aarogyasetu&hl=en',
  default: 'unknown',
})

// Apple AppStore:
export const AppleAppStoreDistribution = {
  AppID: '1600670975',
  // Bundle Identifiers
}

// Google PlayStore,
export const GooglePlayStoreDistribution = {
  PackageName: 'com.mywebsite.myapp',
}

// Amazon Appstore: https://en.wikipedia.org/wiki/Amazon_Appstore
export const AmazonAppstoreDistribution = {
  PackageName: 'com.mywebsite.myapp',
}

// SamsungGalaxyStore,
export const SamsungGalaxyStoreDistribution = {
  AppID: '2193813192',
}

// 华为应用市场/AppGallery
export const HuaweiAppStoreDistribution = {
  AppID: '2193813192',
}
