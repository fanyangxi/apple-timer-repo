import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { IndexExampleContainer } from '@/Containers'
import { HomeScreen } from '@/screens/HomeScreen'

const Tab = createBottomTabNavigator()

// @refresh reset
const MainNavigator = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home2" component={HomeScreen} />
      <Tab.Screen name="Home" component={IndexExampleContainer} />
    </Tab.Navigator>
  )
}

export default MainNavigator
