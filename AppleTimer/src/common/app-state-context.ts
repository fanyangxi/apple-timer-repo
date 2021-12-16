import React, { SetStateAction } from 'react'
import { UserSettings } from '@/models/common'
import { DEFAULT_USER_SETTINGS } from '@/common/constants'
import { IHandles } from 'react-native-modalize/lib/options'

export interface AppStateContextProps {
  userSettings: UserSettings
  setUserSettings: React.Dispatch<React.SetStateAction<UserSettings>>
  adViewPopupRef?: React.RefObject<IHandles>
}

export const AppStateContext = React.createContext<AppStateContextProps>({
  userSettings: DEFAULT_USER_SETTINGS,
  setUserSettings: (_: SetStateAction<UserSettings>): void => {},
})
