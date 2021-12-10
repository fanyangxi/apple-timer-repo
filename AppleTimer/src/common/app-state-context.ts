import React from 'react'
import { UserSettings } from '@/models/common'
import { DEFAULT_APP_STATE_CONTEXT } from '@/common/constants'

export interface AppStateContextProps {
  userSettings: UserSettings
  setUserSettings: React.Dispatch<React.SetStateAction<UserSettings>>
}

export const AppStateContext = React.createContext<AppStateContextProps>(DEFAULT_APP_STATE_CONTEXT)
