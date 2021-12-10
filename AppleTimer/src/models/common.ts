export interface DTime {
  hours: number
  minutes: number
  seconds: number
}

export interface UserSettings {
  language?: Languages
  enableVoiceAssist?: boolean
}

export enum Languages {
  English = 'en',
  ChineseSimplified = 'zh',
}
