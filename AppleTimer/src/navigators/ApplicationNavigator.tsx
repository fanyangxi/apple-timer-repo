import React from 'react'
import { StatusBar } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { navigationRef } from '@/navigators/Root'
import { useTheme } from '@/theme'
import { HomeScreen } from '@/screens/HomeScreen'
import { DebuggerScreen } from '@/screens/DebuggerScreen'
import { SettingsScreen } from '@/screens/SettingsScreen'
// import { IndexStartupContainer } from '@/Containers'
// import { StartupState } from '@/store/Startup'

const Stack = createStackNavigator()
const Tab = createBottomTabNavigator()

// let MainNavigator: FunctionComponent | null

// @refresh reset
const ApplicationNavigator = () => {
  const { Layout, darkMode, NavigationTheme } = useTheme()
  const { colors } = NavigationTheme
  // const [isApplicationLoaded, setIsApplicationLoaded] = useState(false)
  // const applicationIsLoading = useSelector(
  //   (state: { startup: StartupState }) => state.startup.loading,
  // )

  // useEffect(() => {
  //   if (MainNavigator == null && !applicationIsLoading) {
  //     MainNavigator = require('@/navigators/MainNavigator').default
  //     setIsApplicationLoaded(true)
  //   }
  // }, [applicationIsLoading])

  // // on destroy needed to be able to reset when app close in background (Android)
  // useEffect(
  //   () => () => {
  //     setIsApplicationLoaded(false)
  //     MainNavigator = null
  //   },
  //   [],
  // )
  return (
    <NavigationContainer theme={NavigationTheme} ref={navigationRef}>
      <StatusBar barStyle={darkMode ? 'light-content' : 'dark-content'} />
      <Stack.Navigator headerMode={'none'}>
        <Stack.Screen name="Home2" component={HomeScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
        <Stack.Screen name="Debugger" component={DebuggerScreen} />
        {/*<Stack.Screen name="Startup" component={IndexStartupContainer} />*/}
        {/*{isApplicationLoaded && MainNavigator != null && (*/}
        {/*  <Stack.Screen*/}
        {/*    name="Main"*/}
        {/*    component={MainNavigator}*/}
        {/*    options={{*/}
        {/*      animationEnabled: false,*/}
        {/*    }}*/}
        {/*  />*/}
        {/*)}*/}
      </Stack.Navigator>
      {/*<Tab.Navigator>*/}
      {/*  <Tab.Screen name="Home2" component={HomeScreen} />*/}
      {/*  <Tab.Screen name="Debugger" component={DebuggerScreen} />*/}
      {/*</Tab.Navigator>*/}
    </NavigationContainer>
  )
}

export default ApplicationNavigator
