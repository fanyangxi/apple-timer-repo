# apple-timer-repo
Yet another timer (Apple Timer)

npx react-native run-ios --device "Yangxi's-12MINI"
npx react-native run-ios --device "Yangxi's-12MINI" --configuration Release
npx react-native run-android --deviceId "2294eb002f057ece" --verbose
npx react-native run-android --deviceId "2294eb002f057ece" --verbose --variant=release


### [Dev-Notes] Maintain the Sound files:
Sound files are duplicated under below 2 paths, so whenever make changes to the sound files, we need to update the files under below 2 paths.  Reference: https://github.com/zmxv/react-native-sound:
- AppleTimer/src/assets/sounds (For iOS)
- AppleTimer/android/app/src/main/res/raw (For Android)


### Home Screen:
//// Top-Bar Section:
Change App-Settings Button:
Toggle Mute Button:

//// Timer Section:
@summary-section:
? change-current-preset-button:
? time-renaming:
? total-time:

@details-section (Normal state):
current preset:
    - prepare: in Sec
    - workout: in Sec
    - rest: in Sec
    - sets-count:
    - cycles-count: int,
In-timer-phase state (Prepare|Workout|Rest)
    - phase-name
    - time-left-in-phase 
    
@action-section:
start-workout-button:
svgr --replace-attr-values "#fff=currentColor" icon.svg -d ./


### Stopwatch/Timer references:
https://stackoverflow.com/questions/21277900/how-can-i-pause-setinterval-functions
https://github.com/mathiasvr/tiny-timer/blob/master/src/tiny-timer.ts
https://npm.io/package/tiny-timer
https://github.com/fanatid/elapsed-time
https://npm.io/search/keyword:stopwatch


### react-native-sound - npm
https://www.npmjs.com/package/react-native-sound
// 'duration in seconds: ' + this._3SecsCountDownSound.getDuration()
// 'number of channels: ' + this._3SecsCountDownSound.getNumberOfChannels()


### The sounds:
https://www.pond5.com/search?kw=counting-down-female-voice&media=sfx#3
https://www.pond5.com/search?kw=female-voice-start&media=sfx#female-voice-start
https://www.pond5.com/sound-effects/item/77773335-countdown-10-seconds-woman
https://mixkit.co/free-sound-effects/countdown/
https://www.zapsplat.com/sound-effect-category/bells/


### Text to voice:
Voice Generator (Online & Free) +++++
> https://voicegenerator.io/

Free Voice Over Generator | Voicebooking
> https://www.voicebooking.com/en/free-voice-over-generator

Free Text to Speech Software (TTS) - by Wideo
> https://wideo.co/text-to-speech/


- > Three. Two. One.
- > Workout
- > Rest
- > 1,2,3,4,5,6,7,8,9, - 50,
- > repetitions to go (EG.: 6 sets to go)
- > Timer paused
- > Timer resumed
- > Timer stopped
- > Timer completed
- > Set completed

ambient
https://developer.apple.com/documentation/avfaudio/avaudiosession/category/1616560-ambient
soloAmbient
https://developer.apple.com/documentation/avfaudio/avaudiosession/category/1616488-soloambient
Playback
https://developer.apple.com/documentation/avfaudio/avaudiosession/category/1616509-playback


### react-native-neomorph-shadows
https://www.npmjs.com/package/react-native-neomorph-shadows
https://github.com/tokkozhin/react-native-neomorph-shadows
UI References:
https://www.uplabs.com/search?q=Neumorphism
https://www.pinterest.com/pin/817614507338049274/visual-search/?x=24&y=10&w=530&h=356&cropSource=6


### APP Icon:
https://www.iconfinder.com/search/?q=timer+icon
App Icon Generator
https://appicon.co/


+
