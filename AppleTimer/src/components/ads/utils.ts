import { Platform } from 'react-native'
import { GOOGLE_ADMOB_AD_UNIT_ID_ANDROID, GOOGLE_ADMOB_AD_UNIT_ID_IOS } from '@/common/constants'

export function Logger(tag: string = 'AD', type: string, value: any) {
  console.log(`[${tag}][${type}]:`, value)
}

export function listItemsGenerator(num: number) {
  let list: string[] = []
  for (let i = 0; i < num; i++) {
    // eslint-disable-next-line prettier/prettier
    list = [
      ...list,
      ...['Apple ' + i, 'Banana ' + i, 'Orange ' + i, 'Pineapple ' + i, 'Pancakes ' + i, 'ad ' + i],
    ]
  }

  return list
}

export const adUnitIDs = {
  // NATIVE_AD_ID
  image: Platform.OS === 'ios' ? GOOGLE_ADMOB_AD_UNIT_ID_IOS : GOOGLE_ADMOB_AD_UNIT_ID_ANDROID,
  // NATIVE_AD_VIDEO_ID
  video: Platform.OS === 'ios' ? 'ca-app-pub-3940256099942544/2521693316' : 'ca-app-pub-3940256099942544/1044960115',
}

export const Events = {
  onViewableItemsChanged: 'onViewableItemsChanged',
}

export const routes = [
  { index: 0, type: 'banner' },
  { index: 1, type: 'image' },
  { index: 2, type: 'video' },
  { index: 3, type: 'list' },
]
