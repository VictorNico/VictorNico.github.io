import { ref, onMounted } from 'vue'

/**
 * Composable pour charger les données depuis les fichiers JSON
 * @param {string} endpoint - Le nom du fichier JSON (sans extension)
 * @returns {Object} - { data, loading, error }
 */
export function useDataLoader(endpoint) {
  const data = ref(null)
  const loading = ref(true)
  const error = ref(null)

  const loadData = async () => {
    try {
      loading.value = true
      const response = await fetch(`/data/${endpoint}.json`)

      if (!response.ok) {
        throw new Error(`Failed to load ${endpoint}: ${response.statusText}`)
      }

      data.value = await response.json()
    } catch (e) {
      error.value = e.message
      console.error(`Error loading ${endpoint}:`, e)
    } finally {
      loading.value = false
    }
  }

  onMounted(() => {
    loadData()
  })

  return {
    data,
    loading,
    error,
    reload: loadData
  }
}
