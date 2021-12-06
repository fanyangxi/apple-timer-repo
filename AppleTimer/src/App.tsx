import 'react-native-gesture-handler'
import React from 'react'
import { ApplicationNavigator } from '@/navigators'
import './translations'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import Toast from 'react-native-toast-message'
import { ModalPortal } from 'react-native-modals'

const App = () => (
  <>
    <SafeAreaProvider>
      <ApplicationNavigator />
    </SafeAreaProvider>
    <Toast ref={(ref: any) => Toast.setRef(ref)} />
    <ModalPortal />
  </>
)

export default App
