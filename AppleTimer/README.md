# apple-timer-repo
Yet another timer (Apple Timer)

### Concepts:
Preset:
- prepare: in Sec
- work: in Sec
- rest: in Sec
- cycles count: int,
- sets-divider: in Sec
- sets-count:

Secs: short for seconds.

Cycle:

Set: has multiple cycles.

Preset: has multiple sets.

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
    - cycles-count: int,
    - sets-count:
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
Free Voice Over Generator | Voicebooking
> https://www.voicebooking.com/en/free-voice-over-generator
Free Text to Speech Software (TTS) - by Wideo
> https://wideo.co/text-to-speech/
Voice Generator (Online & Free) 🗣️
> https://voicegenerator.io/

- Three
- Two
- One
- Workout
- Rest
- * sets to go (EG.: 6 sets to go)
- 1,2,3,4,5,6,7,8,9, - 49,
- Timer paused
- Timer resumed
- Timer stopped
- Timer completed
- ** Repetition completed



ambient
https://developer.apple.com/documentation/avfaudio/avaudiosession/category/1616560-ambient
soloAmbient
https://developer.apple.com/documentation/avfaudio/avaudiosession/category/1616488-soloambient
Playback
https://developer.apple.com/documentation/avfaudio/avaudiosession/category/1616509-playback

+
