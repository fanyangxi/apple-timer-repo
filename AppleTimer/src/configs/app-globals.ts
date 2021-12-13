import Sound from 'react-native-sound'
import firebase from '@react-native-firebase/app'

// Display firebase context for debugging:
console.log('Firebase-context', firebase.apps)

// Decide to use 'Playback':
// - Enable play-sound in silence mode (using the Ring/Silent switch).

// Playback: play when in background, won't play when locked,
// MultiRoute: play when in background, play when locked,
Sound.setCategory('MultiRoute', true)
Sound.setMode('SpokenAudio')
