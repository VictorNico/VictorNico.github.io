import { ref, computed, onMounted } from 'vue'
import { useDataLoader } from './useDataLoader'

/**
 * Composable pour gérer le thème de l'application
 */
export function useTheme() {
  const { data: themeConfig, loading, error } = useDataLoader('theme')

  const currentTheme = computed(() => {
    return themeConfig.value?.theme || null
  })

  const colors = computed(() => {
    return currentTheme.value?.colors || {}
  })

  const fonts = computed(() => {
    return currentTheme.value?.fonts || {}
  })

  const effects = computed(() => {
    return currentTheme.value?.effects || {}
  })

  // Appliquer les variables CSS personnalisées
  const applyTheme = () => {
    if (!currentTheme.value) return

    const root = document.documentElement

    // Appliquer les couleurs
    Object.entries(colors.value).forEach(([key, value]) => {
      const cssVarName = `--color-${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`
      root.style.setProperty(cssVarName, value)
    })

    // Appliquer les fonts
    Object.entries(fonts.value).forEach(([key, value]) => {
      const cssVarName = `--font-${key}`
      root.style.setProperty(cssVarName, value)
    })
  }

  onMounted(() => {
    // Attendre que le thème soit chargé
    const unwatch = computed(() => {
      if (currentTheme.value) {
        applyTheme()
      }
    })
  })

  return {
    theme: currentTheme,
    colors,
    fonts,
    effects,
    loading,
    error,
    applyTheme
  }
}
