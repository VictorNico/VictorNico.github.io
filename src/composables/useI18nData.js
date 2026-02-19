import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

/**
 * Composable pour obtenir les données traduites depuis les fichiers JSON
 * @param {Object} data - Les données avec structure multilingue { en: "...", fr: "..." }
 * @returns {ComputedRef} - La valeur traduite selon la locale actuelle
 */
export function useI18nData() {
  const { locale } = useI18n()

  /**
   * Obtient la valeur traduite d'un objet multilingue
   * @param {Object|String} value - Valeur simple ou objet { en, fr }
   * @param {String} fallback - Valeur de fallback si traduction manquante
   */
  const getTranslated = (value, fallback = '') => {
    if (!value) return fallback

    // Si c'est déjà une chaîne simple, la retourner
    if (typeof value === 'string') return value

    // Si c'est un objet avec traductions
    if (typeof value === 'object' && value !== null) {
      return value[locale.value] || value.en || fallback
    }

    return fallback
  }

  /**
   * Obtient un tableau traduit
   * @param {Array|Object} array - Tableau simple ou objet { en: [], fr: [] }
   */
  const getTranslatedArray = (array) => {
    if (!array) return []

    // Si c'est déjà un tableau simple
    if (Array.isArray(array)) return array

    // Si c'est un objet avec traductions
    if (typeof array === 'object' && array !== null) {
      return array[locale.value] || array.en || []
    }

    return []
  }

  return {
    getTranslated,
    getTranslatedArray,
    locale
  }
}
