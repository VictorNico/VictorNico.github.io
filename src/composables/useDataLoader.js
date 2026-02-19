import { ref } from 'vue'

const dataCache = new Map()

/**
 * Composable pour charger les données depuis les fichiers JSON.
 * Les résultats sont mis en cache au niveau module : le même endpoint
 * ne déclenche qu'un seul fetch quelle que soit le nombre de composants
 * qui l'utilisent.
 *
 * @param {string} endpoint - Nom du fichier JSON (sans extension)
 * @returns {{ data: Ref, loading: Ref, error: Ref, reload: Function }}
 */
export function useDataLoader(endpoint) {
  if (dataCache.has(endpoint)) {
    return dataCache.get(endpoint)
  }

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

  const result = { data, loading, error, reload: loadData }
  dataCache.set(endpoint, result)

  // Fetch immediately — pas besoin d'attendre onMounted
  loadData()

  return result
}