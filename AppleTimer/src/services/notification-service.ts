import Sound from 'react-native-sound'
import { logger } from '@/utils/logger'

// - * sets to go (EG.: 6 sets to go)
// - 1,2,3,4,5,6,7,8,9, - 49,
// - ** Repetition completed
// Notes:: Value of the enum members cannot be duplicated.
export enum Sounds {
  _3_secs_countdown = '3_secs_countdown.mp3',
  _bell = 'mixkit_cartoon_door_melodic_bell_110.wav',
  _start = 'start.mp3',
  //
  // Three = 'three.mp3',
  // Two = 'two.mp3',
  // One = 'one.mp3',
  // Workout = 'workout.mp3',
  // Rest = 'rest.mp3',
  // TimerPaused = 'timer_paused.mp3',
  // TimerResumed = 'timer_resumed.mp3',
  // TimerStopped = 'timer_stopped.mp3',
  // TimerCompleted = 'timer_completed.mp3',
}

export class NotificationService {
  private readonly _soundsMap: Map<string, Sound>

  constructor() {
    this._soundsMap = new Map<string, Sound>()
    Object.entries(Sounds).forEach(([, value]) => {
      this._soundsMap.set(value, this.loadSound(value))
    })
  }

  playSounds(sounds: string[]) {
    // logger.info('>>> Playing sounds:', sounds)
    // 1.Stop all other sounds first
    this._soundsMap.forEach((value: Sound) => {
      value.stop()
    })

    // 2.Then play the target sound(s)
    sounds
      .reduce(
        (acc, cur) =>
          acc.then(() => {
            // logger.debug(`>>> Playing: ${cur}`, this._soundsMap.get(cur))
            return new Promise(resolve => this._soundsMap.get(cur)?.play(success => resolve()))
          }),
        Promise.resolve(),
      )
      .then(() => {})
  }

  private loadSound(soundName: string) {
    return new Sound(soundName, Sound.MAIN_BUNDLE, error => {
      if (error) {
        logger.error(`failed to load the sound: ${soundName}`, error)
        return
      }
    })
  }
}
