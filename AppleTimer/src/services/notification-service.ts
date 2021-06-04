import Sound from 'react-native-sound'

export class NotificationService {
  private readonly _3SecsCountDownSound: Sound

  constructor() {
    // Load the sound file 'whoosh.mp3' from the app bundle
    // See notes below about preloading sounds within initialization code below.
    this._3SecsCountDownSound = new Sound('start.mp3', Sound.MAIN_BUNDLE, error => {
      if (error) {
        console.log('failed to load the sound', error)
        return
      }
      console.log(
        'duration in seconds: ' +
          this._3SecsCountDownSound.getDuration() +
          'number of channels: ' +
          this._3SecsCountDownSound.getNumberOfChannels(),
      )
    })
  }

  notify = () => {}
  playAudio = () => {
    // Play the sound with an onEnd callback
    this._3SecsCountDownSound.play(success => {
      if (success) {
        console.log('successfully finished playing')
      } else {
        console.log('playback failed due to audio decoding errors')
      }
    })
  }
}
