import { AsyncStorageUtils } from '@/utils/async-storage-utils'
import { randomNumberInRange } from '@/utils/common-util'

const ADS_COUNTER_DATA_STORE = 'ads_counter_data_store'

const DEFAULT_ADS_COUNTER: number = 0

const increaseAdsCounterAndCheck = async (callback: () => void): Promise<void> => {
  const maxAllowedLimit = randomNumberInRange(2, 5)
  const counter = (await AsyncStorageUtils.getObject<number>(ADS_COUNTER_DATA_STORE)) ?? DEFAULT_ADS_COUNTER
  const current = counter + 1

  if (current >= maxAllowedLimit) {
    // trigger
    callback()
    // reset counter
    await AsyncStorageUtils.setObject(ADS_COUNTER_DATA_STORE, DEFAULT_ADS_COUNTER)
  } else {
    await AsyncStorageUtils.setObject(ADS_COUNTER_DATA_STORE, current)
  }
}

export const AdsCounterDataService = {
  increaseAdsCounterAndCheck,
}
