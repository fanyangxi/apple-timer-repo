import 'react-native-gesture-handler'
import React from 'react'
import { ApplicationNavigator } from '@/navigators'
import './translations'
import { NativeBaseProvider } from 'native-base'
import { SafeAreaProvider } from 'react-native-safe-area-context'

const App = () => (
  <NativeBaseProvider>
    <SafeAreaProvider>
      <ApplicationNavigator />
    </SafeAreaProvider>
  </NativeBaseProvider>
)

export default App
