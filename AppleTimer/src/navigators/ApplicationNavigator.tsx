import React from 'react'
// import { createStackNavigator } from '@react-navigation/stack'
// import { IndexStartupContainer } from '@/Containers'
import { NavigationContainer } from '@react-navigation/native'
import { navigationRef } from '@/navigators/Root'
import { SafeAreaView, StatusBar } from 'react-native'
import { useTheme } from '@/theme'
import { HomeScreen } from '@/screens/HomeScreen'
import { DebuggerScreen } from '@/screens/DebuggerScreen'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
// import { StartupState } from '@/store/Startup'

// const Stack = createStackNavigator()
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
    <SafeAreaView style={[Layout.fill, { backgroundColor: colors.card }]}>
      <NavigationContainer theme={NavigationTheme} ref={navigationRef}>
        <StatusBar barStyle={darkMode ? 'light-content' : 'dark-content'} />
        {/*<Stack.Navigator headerMode={'none'}>*/}
        {/*  <Stack.Screen name="Startup" component={IndexStartupContainer} />*/}
        {/*  /!*{isApplicationLoaded && MainNavigator != null && (*!/*/}
        {/*  /!*  <Stack.Screen*!/*/}
        {/*  /!*    name="Main"*!/*/}
        {/*  /!*    component={MainNavigator}*!/*/}
        {/*  /!*    options={{*!/*/}
        {/*  /!*      animationEnabled: false,*!/*/}
        {/*  /!*    }}*!/*/}
        {/*  /!*  />*!/*/}
        {/*  /!*)}*!/*/}
        {/*</Stack.Navigator>*/}
        <Tab.Navigator>
          <Tab.Screen name="Home2" component={HomeScreen} />
          <Tab.Screen name="Debugger" component={DebuggerScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaView>
  )
}

export default ApplicationNavigator
