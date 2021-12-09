import 'react-native-gesture-handler'
import React from 'react'
import { ApplicationNavigator } from '@/navigators'
import './translations'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import Toast from 'react-native-toast-message'
import { initialWindowMetrics } from 'react-native-safe-area-context'

const App = () => (
  <>
    <SafeAreaProvider>
      <ApplicationNavigator />
    </SafeAreaProvider>
    <Toast
      ref={(ref: any) => Toast.setRef(ref)}
      topOffset={initialWindowMetrics?.insets.top ?? 30}
      visibilityTime={2000}
    />
  </>
)

export default App
