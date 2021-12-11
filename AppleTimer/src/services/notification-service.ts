import Sound from 'react-native-sound'
import { logger } from '@/utils/logger'
import { UserSettingsDataService } from '@/services/user-settings-data-service'
import { Languages, UserSettings } from '@/models/common'

// - * cycles to go (EG.: 6 cycles to go)
// - 1,2,3,4,5,6,7,8,9, - 49,
// - ** Set completed
// Notes:: Value of the enum members cannot be duplicated.
// _bell = 'mixkit_cartoon_door_melodic_bell_110.wav',
// _start = 'start.mp3',
export enum Sounds {
  ThreeTwoOne = 'three_two_one.mp3',
  Workout = 'workout.mp3',
  Rest = 'rest.mp3',
  SetsToGo = 'sets_to_go.mp3', // repetitions_to_go
  CycleCompleted = 'cycle_completed.mp3', // 'set_completed.mp3',
  //
  TimerPaused = 'timer_paused.mp3',
  TimerResumed = 'timer_resumed.mp3',
  TimerStopped = 'timer_stopped.mp3',
  TimerCompleted = 'timer_completed.mp3',
  // Num(s):
  Num01 = '1.mp3',
  Num02 = '2.mp3',
  Num03 = '3.mp3',
  Num04 = '4.mp3',
  Num05 = '5.mp3',
  Num06 = '6.mp3',
  Num07 = '7.mp3',
  Num08 = '8.mp3',
  Num09 = '9.mp3',
  Num10 = '10.mp3',
  Num11 = '11.mp3',
  Num12 = '12.mp3',
  Num13 = '13.mp3',
  Num14 = '14.mp3',
  Num15 = '15.mp3',
  Num16 = '16.mp3',
  Num17 = '17.mp3',
  Num18 = '18.mp3',
  Num19 = '19.mp3',
  Num20 = '20.mp3',
  Num21 = '21.mp3',
  Num22 = '22.mp3',
  Num23 = '23.mp3',
  Num24 = '24.mp3',
  Num25 = '25.mp3',
  Num26 = '26.mp3',
  Num27 = '27.mp3',
  Num28 = '28.mp3',
  Num29 = '29.mp3',
  Num30 = '30.mp3',
  Num31 = '31.mp3',
  Num32 = '32.mp3',
  Num33 = '33.mp3',
  Num34 = '34.mp3',
  Num35 = '35.mp3',
  Num36 = '36.mp3',
  Num37 = '37.mp3',
  Num38 = '38.mp3',
  Num39 = '39.mp3',
  Num40 = '40.mp3',
  Num41 = '41.mp3',
  Num42 = '42.mp3',
  Num43 = '43.mp3',
  Num44 = '44.mp3',
  Num45 = '45.mp3',
  Num46 = '46.mp3',
  Num47 = '47.mp3',
  Num48 = '48.mp3',
  Num49 = '49.mp3',
  Num50 = '50.mp3',
}

export class NotificationService {
  private readonly _soundsMap: Map<string, Sound>

  constructor() {
    this._soundsMap = new Map<string, Sound>()
    // Pre-load all languages (en/zh) audio files, it's not very big, usually take 40ms to load all audio files:
    const languages = Object.values(Languages) // Output: en, zh
    languages.forEach(language => {
      Object.entries(Sounds).forEach(([, value]) => {
        const fullName = `${language}/${value}`
        this._soundsMap.set(fullName, this._loadSound(fullName))
      })
    })
  }

  async playSounds(sounds: string[]) {
    // logger.info('>>> Playing sounds:', sounds)
    const settings = await this._reloadUserSettings()
    if (!settings.enableVoiceAssist) {
      return
    }

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
            const fullName = `${settings.language}/${cur}`
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            return new Promise(resolve => this._soundsMap.get(fullName)?.play(success => resolve()))
          }),
        Promise.resolve(),
      )
      .then(() => {})
  }

  stopSounds() {
    this._soundsMap.forEach((value: Sound) => {
      value.stop()
    })
  }

  private _loadSound(soundFullName: string) {
    return new Sound(soundFullName, Sound.MAIN_BUNDLE, error => {
      if (error) {
        logger.error(`failed to load the sound: ${soundFullName}`, error)
        return
      }
    })
  }

  private async _reloadUserSettings(): Promise<UserSettings> {
    return await UserSettingsDataService.getUserSettings()
  }
}
