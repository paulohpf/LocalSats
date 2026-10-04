import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import { resources } from './resources'

const browserLanguage = navigator.language === 'pt-BR' ? 'pt-BR' : 'en'

void i18n.use(initReactI18next).init({
  resources,
  lng: browserLanguage,
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
})

export default i18n
