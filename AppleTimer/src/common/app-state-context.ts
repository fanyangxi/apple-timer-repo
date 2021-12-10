import React, { SetStateAction } from 'react'
import { UserSettings } from '@/models/common'
import { DEFAULT_USER_SETTINGS } from '@/common/constants'

export interface AppStateContextProps {
  userSettings: UserSettings
  setUserSettings: React.Dispatch<React.SetStateAction<UserSettings>>
}

export const AppStateContext = React.createContext<AppStateContextProps>({
  userSettings: DEFAULT_USER_SETTINGS,
  setUserSettings: (_: SetStateAction<UserSettings>): void => {},
})
