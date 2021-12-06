import Sound from 'react-native-sound'

// Decide to use 'Playback':
// - Enable play-sound in silence mode (using the Ring/Silent switch).

// Playback: play when in background, won't play when locked,
// MultiRoute: play when in background, play when locked,
Sound.setCategory('MultiRoute', true)
Sound.setMode('SpokenAudio')
