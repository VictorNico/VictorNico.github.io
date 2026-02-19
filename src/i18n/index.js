import { createI18n } from 'vue-i18n'
import en from './locales/en.json'
import fr from './locales/fr.json'

// Détecter la langue du navigateur
const getBrowserLocale = () => {
  const browserLocale = navigator.language || navigator.userLanguage
  return browserLocale.startsWith('fr') ? 'fr' : 'en'
}

// Récupérer la langue stockée ou utiliser la langue du navigateur
const getSavedLocale = () => {
  return localStorage.getItem('locale') || getBrowserLocale()
}

const i18n = createI18n({
  legacy: false, // Utiliser Composition API
  locale: getSavedLocale(),
  fallbackLocale: 'en',
  messages: {
    en,
    fr
  }
})

export default i18n
