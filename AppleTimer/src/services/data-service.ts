import { Preset } from '@/models/preset'
import { DEFAULT_PRESET } from '@/common/constants'

const getActivePreset = () => {
  // TODO:
  return new Preset('Default', 5, 7, 5, 2, 2) || DEFAULT_PRESET
}

export const DataService = { getActivePreset }
