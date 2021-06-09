import { Preset } from '@/models/preset'

const getActivePreset = () => {
  // TODO:
  return new Preset('Default', 5, 7, 5, 2, 2)
}

export const DataService = { getActivePreset }
