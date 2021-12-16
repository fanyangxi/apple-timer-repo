/**
 * @format
 */

import { AppRegistry } from 'react-native'
import App from './src/App'
import { name as appName } from './app.json'

// initiate the application globals
import './src/configs/app-globals'
// initiate the ads settings
import './src/components/ads/initiateAds'

AppRegistry.registerComponent(appName, () => App)
