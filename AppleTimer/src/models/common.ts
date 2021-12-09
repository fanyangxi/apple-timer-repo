export interface DTime {
  hours: number
  minutes: number
  seconds: number
}

export interface UserSettings {
  language?: 'english' | 'chinese'
  enableVoiceAssist?: boolean
}
