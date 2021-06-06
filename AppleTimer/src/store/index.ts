import AsyncStorage from '@react-native-async-storage/async-storage'
// import { combineReducers } from 'red*x'
// import {
//   persistReducer,
//   persistStore,
//   FLUSH,
//   REHYDRATE,
//   PAUSE,
//   PERSIST,
//   PURGE,
//   REGISTER,
// } from 'red*x-persist'
// import { configureStore } from '@red*xjs/toolkit'

// import startup from './Startup'
// import user from './User'
// import theme from './Theme'

// const reducers = combineReducers({
//   startup,
//   user,
//   theme,
// })

// const persistConfig = {
//   key: 'root',
//   storage: AsyncStorage,
//   whitelist: ['theme'],
// }

// const persistedReducer = persistReducer(persistConfig, reducers)

// const store = configureStore({
//   reducer: persistedReducer,
//   middleware: getDefaultMiddleware => {
//     const middlewares = getDefaultMiddleware({
//       serializableCheck: {
//         ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
//       },
//     })
//
//     if (__DEV__ && !process.env.JEST_WORKER_ID) {
//       const createDebugger = require('red*x-flipper').default
//       middlewares.push(createDebugger())
//     }
//
//     return middlewares
//   },
// })

// const persistor = persistStore(store)

// export { store, persistor }
export {}
