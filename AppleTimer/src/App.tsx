import 'react-native-gesture-handler'
import React, { useEffect, useState } from 'react'
import { ApplicationNavigator } from '@/navigators'
import './translations'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import Toast from 'react-native-toast-message'
import { initialWindowMetrics } from 'react-native-safe-area-context'
import './i18n/config'
// import { useTranslation } from 'react-i18next'
import { AppStateContext } from '@/common/app-state-context'
import { UserSettings } from '@/models/common'
import { DEFAULT_USER_SETTINGS } from '@/common/constants'
import { UserSettingsDataService } from '@/services/user-settings-data-service'

const App = () => {
  const [userSettings, setUserSettings] = useState<UserSettings>(DEFAULT_USER_SETTINGS)

  useEffect(() => {
    UserSettingsDataService.getUserSettings().then(data => setUserSettings(data))
  }, [])

  return (
    <AppStateContext.Provider value={{ userSettings, setUserSettings }}>
      <SafeAreaProvider>
        <ApplicationNavigator />
      </SafeAreaProvider>
      <Toast
        ref={(ref: any) => Toast.setRef(ref)}
        topOffset={initialWindowMetrics?.insets.top ?? 30}
        visibilityTime={2000}
      />
    </AppStateContext.Provider>
  )
}

export default App
