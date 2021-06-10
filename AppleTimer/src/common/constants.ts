import { Preset } from '@/models/preset'

export enum StorageKeys {
  UNREAD_MESSAGES_COUNT = 'UNREAD_MESSAGES_COUNT',
  DASHBOARD_DATA = 'DASHBOARD_DATA',
}

export const Screens = {
  Home: 'Home2',
  Debugger: 'Debugger',
  Settings: 'Settings',
  PresetDetail: 'PresetDetail',
}

export const DEFAULT_PRESET = new Preset('Tabata', 5, 30, 15, 6, 1)
