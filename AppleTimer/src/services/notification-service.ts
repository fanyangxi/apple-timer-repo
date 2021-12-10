import Sound from 'react-native-sound'
import { logger } from '@/utils/logger'
import { UserSettingsDataService } from '@/services/user-settings-data-service'
import { UserSettings } from '@/models/common'

// - * cycles to go (EG.: 6 cycles to go)
// - 1,2,3,4,5,6,7,8,9, - 49,
// - ** Set completed
// Notes:: Value of the enum members cannot be duplicated.
export enum Sounds {
  _bell = 'mixkit_cartoon_door_melodic_bell_110.wav',
  _start = 'start.mp3',
  // 9 misc:
  ThreeTwoOne = 'three_two_one_v2.mp3',
  Workout = 'workout.mp3',
  Rest = 'rest.mp3',
  TimerPaused = 'timer_paused.mp3',
  TimerResumed = 'timer_resumed.mp3',
  TimerStopped = 'timer_stopped.mp3',
  TimerCompleted = 'timer_completed.mp3',
  RepetitionsToGo = 'repetitions_to_go.mp3',
  SetCompleted = 'set_completed.mp3',
  // Num(s): 1-50
  Num1 = 'num_1.mp3',
  Num2 = 'num_2.mp3',
  Num3 = 'num_3.mp3',
  Num4 = 'num_4.mp3',
  Num5 = 'num_5.mp3',
  Num6 = 'num_6.mp3',
  Num7 = 'num_7.mp3',
  Num8 = 'num_8.mp3',
  Num9 = 'num_9.mp3',
  Num10 = 'num_10.mp3',
  Num11 = 'num_11.mp3',
  Num12 = 'num_12.mp3',
  Num13 = 'num_13.mp3',
  Num14 = 'num_14.mp3',
  Num15 = 'num_15.mp3',
  Num16 = 'num_16.mp3',
  Num17 = 'num_17.mp3',
  Num18 = 'num_18.mp3',
  Num19 = 'num_19.mp3',
  Num20 = 'num_20.mp3',
  Num21 = 'num_21.mp3',
  Num22 = 'num_22.mp3',
  Num23 = 'num_23.mp3',
  Num24 = 'num_24.mp3',
  Num25 = 'num_25.mp3',
  Num26 = 'num_26.mp3',
  Num27 = 'num_27.mp3',
  Num28 = 'num_28.mp3',
  Num29 = 'num_29.mp3',
  Num30 = 'num_30.mp3',
  Num31 = 'num_31.mp3',
  Num32 = 'num_32.mp3',
  Num33 = 'num_33.mp3',
  Num34 = 'num_34.mp3',
  Num35 = 'num_35.mp3',
  Num36 = 'num_36.mp3',
  Num37 = 'num_37.mp3',
  Num38 = 'num_38.mp3',
  Num39 = 'num_39.mp3',
  Num40 = 'num_40.mp3',
  Num41 = 'num_41.mp3',
  Num42 = 'num_42.mp3',
  Num43 = 'num_43.mp3',
  Num44 = 'num_44.mp3',
  Num45 = 'num_45.mp3',
  Num46 = 'num_46.mp3',
  Num47 = 'num_47.mp3',
  Num48 = 'num_48.mp3',
  Num49 = 'num_49.mp3',
  Num50 = 'num_50.mp3',
}

export class NotificationService {
  private readonly _soundsMap: Map<string, Sound>

  constructor() {
    this._soundsMap = new Map<string, Sound>()
    Object.entries(Sounds).forEach(([, value]) => {
      this._soundsMap.set(value, this._loadSound(value))
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
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            return new Promise(resolve => this._soundsMap.get(cur)?.play(success => resolve()))
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

  private _loadSound(soundName: string) {
    return new Sound(soundName, Sound.MAIN_BUNDLE, error => {
      if (error) {
        logger.error(`failed to load the sound: ${soundName}`, error)
        return
      }
    })
  }

  private async _reloadUserSettings(): Promise<UserSettings> {
    return await UserSettingsDataService.getUserSettings()
  }
}
