import { createInstance } from 'i18next'
import { initReactI18next } from 'react-i18next'

// Translation files
import enCommon from '@/locales/en/common.json'
import ptCommon from '@/locales/pt/common.json'
import enHome from '@/locales/en/home.json'
import ptHome from '@/locales/pt/home.json'
import enPlayground from '@/locales/en/playground.json'
import ptPlayground from '@/locales/pt/playground.json'

const resources = {
  en: {
    common: enCommon,
    home: enHome,
    playground: enPlayground,
  },
  pt: {
    common: ptCommon,
    home: ptHome,
    playground: ptPlayground,
  },
}

export function createI18nInstance(lng: string = 'en') {
  const i18nInstance = createInstance()
  
  i18nInstance
    .use(initReactI18next)
    .init({
      lng,
      fallbackLng: 'en',
      debug: process.env.NODE_ENV === 'development',
      
      interpolation: {
        escapeValue: false,
      },
      
      resources,
      
      defaultNS: 'common',
      ns: ['common', 'home', 'playground'],
      
      react: {
        useSuspense: false,
      },
    })
  
  return i18nInstance
}

export const supportedLocales = ['en', 'pt'] as const
export type SupportedLocale = typeof supportedLocales[number]

export function isValidLocale(locale: string): locale is SupportedLocale {
  return supportedLocales.includes(locale as SupportedLocale)
}