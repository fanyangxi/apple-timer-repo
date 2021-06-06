import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { HomeScreen } from '@/screens/HomeScreen'
import { DebuggerScreen } from '@/screens/DebuggerScreen'

const Tab = createBottomTabNavigator()

// @refresh reset
const MainNavigator = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home2" component={HomeScreen} />
      <Tab.Screen name="Debugger" component={DebuggerScreen} />
    </Tab.Navigator>
  )
}

export default MainNavigator
