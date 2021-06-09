import 'react-native-gesture-handler'
import React from 'react'
import { ApplicationNavigator } from '@/navigators'
import './translations'
import { SafeAreaProvider } from 'react-native-safe-area-context'

const App = () => (
  <SafeAreaProvider>
    <ApplicationNavigator />
  </SafeAreaProvider>
)

export default App
