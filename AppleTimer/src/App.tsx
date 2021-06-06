import 'react-native-gesture-handler'
import React from 'react'
import { ApplicationNavigator } from '@/navigators'
import './translations'
import { NativeBaseProvider } from 'native-base'

const App = () => (
  <NativeBaseProvider>
    <ApplicationNavigator />
  </NativeBaseProvider>
)

export default App
