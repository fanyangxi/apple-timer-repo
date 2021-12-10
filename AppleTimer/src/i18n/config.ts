import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import { handleErr } from '@/utils/common-util'
import { Languages } from '@/models/common'
import en from '@/i18n/en.json'
import zh from '@/i18n/zh.json'

export const resources = {
  en,
  zh,
} as const

export const initiateI18n = (language: Languages = Languages.English) => {
  i18n
    .use(initReactI18next)
    .init({
      lng: language,
      fallbackLng: Languages.English,
      // TODO: disable this for PROD
      debug: true,
      interpolation: {
        escapeValue: false, // not needed for react as it escapes by default
      },
      resources,
    })
    .catch(handleErr)
}
