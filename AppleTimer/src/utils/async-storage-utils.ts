import AsyncStorage from '@react-native-async-storage/async-storage'

const setObject = async (key: string, value: unknown, callback?: (error?: Error) => void): Promise<void> => {
  if (typeof value === 'string' || typeof value === 'number') {
    return await AsyncStorage.setItem(key, `${value}`, callback)
  }
  return await AsyncStorage.setItem(key, JSON.stringify(value), callback)
}

const getObject = async <T>(key: string, callback?: (error?: Error, result?: string) => void): Promise<T | null> => {
  const data = await AsyncStorage.getItem(key, callback)
  if (data) {
    return JSON.parse(data)
  }
  return null
}

const removeObject = async (key: string): Promise<void> => {
  await AsyncStorage.removeItem(key)
}

export const AsyncStorageUtils = {
  setObject,
  getObject,
  removeObject,
}
