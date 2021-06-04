import Sound from 'react-native-sound'

export class NotificationService {
  private readonly _3SecsCountDownSound: Sound
  private readonly _bellSound: Sound
  private readonly _startSound: Sound
  private readonly _allSounds: Sound[]

  constructor() {
    this._3SecsCountDownSound = this.loadSound('3_secs_countdown.mp3')
    this._bellSound = this.loadSound('mixkit_cartoon_door_melodic_bell_110.wav')
    this._startSound = this.loadSound('start.mp3')
    this._allSounds = [this._3SecsCountDownSound, this._bellSound, this._startSound]
  }

  play3SecsCountDown = () => {
    this.playSound(this._3SecsCountDownSound)
  }

  playBell = () => {
    this.playSound(this._bellSound)
  }

  playStart = () => {
    this.playSound(this._startSound)
  }

  private playSound(soundInstance: Sound) {
    // 1.Stop all other sounds first
    this._allSounds
      .reduce((acc, cur) => acc.then(() => cur.stop()), Promise.resolve())
      .then(() => {
        // 2.Then play the target sound
        soundInstance.play(success => success || console.log('Failed to play sound'))
      })
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
