import { AdManager } from 'react-native-admob-native-ads'

AdManager.setRequestConfiguration({
  tagForChildDirectedTreatment: false,
})

// // image test ad
// AdManager.registerRepository({
//   name: 'imageAd',
//   adUnitId: NATIVE_AD_ID,
//   numOfAds: 3,
//   nonPersonalizedAdsOnly: false,
//   videoOptions: {
//     mute: false,
//   },
//   expirationPeriod: 3600000, // in milliseconds (optional)
//   mediationEnabled: false,
// }).then(result => {
//   console.log('registered: ', result)
// })

// // unmute video test ad
// AdManager.registerRepository({
//   name: 'videoAd',
//   adUnitId: NATIVE_AD_VIDEO_ID,
//   numOfAds: 3,
//   nonPersonalizedAdsOnly: false,
//   videoOptions: {
//     mute: false,
//   },
//   expirationPeriod: 3600000, // in milliseconds (optional)
//   mediationEnabled: false,
// }).then(result => {
//   console.log('registered: ', result)
// })
//
// // mute video test ad
// AdManager.registerRepository({
//   name: 'muteVideoAd',
//   adUnitId: NATIVE_AD_VIDEO_ID,
//   numOfAds: 3,
//   nonPersonalizedAdsOnly: false,
//   videoOptions: {
//     mute: false,
//   },
//   expirationPeriod: 3600000, // in milliseconds (optional)
//   mediationEnabled: false,
// }).then(result => {
//   console.log('registered: ', result)
// })
