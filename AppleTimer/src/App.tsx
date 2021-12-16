import 'react-native-gesture-handler'
import React, { useEffect, useRef, useState } from 'react'
import { ApplicationNavigator } from '@/navigators'
import './translations'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import Toast from 'react-native-toast-message'
import { initialWindowMetrics } from 'react-native-safe-area-context'
import './i18n/config'
import { AppStateContext } from '@/common/app-state-context'
import { UserSettings } from '@/models/common'
import { DEFAULT_USER_SETTINGS } from '@/common/constants'
import { UserSettingsDataService } from '@/services/user-settings-data-service'
import { initiateI18n } from '@/i18n/config'
import analytics from '@react-native-firebase/analytics'
import { handleErr } from '@/utils/common-util'
import { AdViewPopup } from '@/components/AdViewPopup'
import { Modalize } from 'react-native-modalize'

const App = () => {
  const [userSettings, setUserSettings] = useState<UserSettings>(DEFAULT_USER_SETTINGS)
  const adViewPopupRef = useRef<Modalize>(null)

  useEffect(() => {
    analytics().logAppOpen().catch(handleErr)
    // app initiation-task:
    UserSettingsDataService.getUserSettings().then(data => {
      setUserSettings(data)
      initiateI18n(data.language)
    })
  }, [])

  return (
    <AppStateContext.Provider value={{ userSettings, setUserSettings, adViewPopupRef }}>
      <SafeAreaProvider>
        <ApplicationNavigator />
      </SafeAreaProvider>
      <Toast
        ref={(ref: any) => Toast.setRef(ref)}
        topOffset={initialWindowMetrics?.insets.top ?? 30}
        visibilityTime={2000}
      />
      <AdViewPopup popupRef={adViewPopupRef} />
    </AppStateContext.Provider>
  )
}

export default App
