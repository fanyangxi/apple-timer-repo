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
import { PresetDetailScreen } from '@/screens/PresetDetailScreen'
import { Screens } from '@/common/constants'
// import ScreenContainer from "@/components/ScreenContainer";
// import { SafeAreaProvider } from "react-native-safe-area-context";
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
      {/** Change this `initialRouteName` if you need the debugger **/}
      <Stack.Navigator headerMode={'none'} initialRouteName={Screens.Home}>
        <Stack.Screen name={Screens.Home} component={HomeScreen} />
        <Stack.Screen name={Screens.Settings} component={SettingsScreen} />
        <Stack.Screen name={Screens.PresetDetail} component={PresetDetailScreen} />
        <Stack.Screen name={Screens.Debugger} component={DebuggerScreen} />
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
