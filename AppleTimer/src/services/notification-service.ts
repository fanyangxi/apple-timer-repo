import Sound from 'react-native-sound'

// - * sets to go (EG.: 6 sets to go)
// - 1,2,3,4,5,6,7,8,9, - 49,
// - ** Repetition completed
export const Sounds = {
  _3_secs_countdown: '3_secs_countdown.mp3',
  _bell: 'mixkit_cartoon_door_melodic_bell_110.wav',
  _start: 'start.mp3',
  //
  // Three: 'three.mp3',
  // Two: 'two.mp3',
  // One: 'one.mp3',
  // Workout: 'workout.mp3',
  // Rest: 'rest.mp3',
  // TimerPaused: 'timer_paused.mp3',
  // TimerResumed: 'timer_resumed.mp3',
  // TimerStopped: 'timer_stopped.mp3',
  // TimerCompleted: 'timer_completed.mp3',
}

export class NotificationService {
  private readonly _soundsMap: Map<string, Sound>

  constructor() {
    this._soundsMap = new Map<string, Sound>()
    Object.entries(Sounds).forEach(([key, value]) => {
      this._soundsMap.set(value, this.loadSound(value))
    })
  }

  playSounds(sounds: string[]) {
    console.log('>>> In-sounds:', sounds)
    // 1.Stop all other sounds first
    this._soundsMap.forEach((value: Sound) => {
      value.stop()
    })

    // 2.Then play the target sound(s)
    sounds
      .reduce(
        (acc, cur) =>
          acc.then(() => {
            console.log('>>> Playing1:', cur)
            console.log('>>> Playing2:', this._soundsMap.get(cur))
            return new Promise(resolve => this._soundsMap.get(cur)?.play(success => resolve()))
          }),
        Promise.resolve(),
      )
      .then(() => {})
  }

  private loadSound(soundName: string) {
    // Load the sound file 'whoosh.mp3' from the app bundle
    // See notes below about preloading sounds within initialization code below.
    return new Sound(soundName, Sound.MAIN_BUNDLE, error => {
      if (error) {
        console.log(`failed to load the sound: ${soundName}`, error)
        return
      }
      // 'duration in seconds: ' + this._3SecsCountDownSound.getDuration()
      // 'number of channels: ' + this._3SecsCountDownSound.getNumberOfChannels()
    })
  }
}
