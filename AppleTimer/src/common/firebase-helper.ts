export {}

// Crash Log: https://rnfirebase.io/crashlytics/usage#usage
// import firebase, { ReactNativeFirebase } from '@react-native-firebase/app'
// import crashlytics from '@react-native-firebase/crashlytics';
// crashlytics().log('User signed in.');
// Execution of this line will NOT push an entry to firebase-crashlytics directly, until app crashes.
// crashlytics().log('REGULAR: x2.3, User signed in.')

// Crash Attributes: https://rnfirebase.io/crashlytics/usage#crash-attributes
// There are various methods to set attributes for the crash report, in order to provide analytics for crashes and
// help you review them. You can use set methods to set predefined attributes, but you can also set your own
// custom attributes.
// crashlytics().setUserId(user.uid),
// crashlytics().setAttribute('credits', String(user.credits)),
// crashlytics().setAttributes({
//   role: 'admin',
//   followers: '13',
//   email: user.email,
//   username: user.username,
// }),

// Error Reports: https://rnfirebase.io/crashlytics/usage#error-reports
// Even if you catch unexpected errors, in order for your app to recover and behave smoothly you can still report
// them through Crashlytics using the recordError method. This will also provide you with the associated stack trace.
// Execution of this line will push an entry to firebase-crashlytics directly, no matter the app crashes or not
// crashlytics().recordError(error);

//========================
// // Your secondary Firebase project credentials for Android...
// const androidCredentials = {
//   clientId: '',
//   appId: '',
//   apiKey: '',
//   databaseURL: '',
//   storageBucket: '',
//   messagingSenderId: '',
//   projectId: '',
// }
//
// // Your secondary Firebase project credentials for iOS...
// const iosCredentials = {
//   clientId: '',
//   appId: '',
//   apiKey: '',
//   databaseURL: '',
//   storageBucket: '',
//   messagingSenderId: '',
//   projectId: '',
// }
//
// export const initiateFirebase = () => {
//   // Select the relevant credentials
//   const credentials: FirebaseAppOptions | undefined = Platform.select({
//     android: androidCredentials,
//     ios: iosCredentials,
//   })
//
//   const config = {
//     name: 'SECONDARY_APP',
//   }
//
//   if (credentials === undefined) {
//     logger.error(`Failed to load FirebaseApp credentials for mobile platform: ${Platform.OS}/${Platform.Version}`)
//     return
//   }
//   firebase.initializeApp(credentials, config).catch(handleErr)
// }
