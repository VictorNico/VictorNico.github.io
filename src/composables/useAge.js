import { computed } from 'vue'

/**
 * Composable pour calculer l'âge et les années d'expérience
 * @param {string} birthdate - Date de naissance au format YYYY-MM-DD
 * @param {string} startYear - Année de début d'expérience
 */
export function useAge(birthdate = '2000-01-28', startYear = 2017) {
  const age = computed(() => {
    const birth = new Date(birthdate)
    const today = new Date()
    let age = today.getFullYear() - birth.getFullYear()
    const monthDiff = today.getMonth() - birth.getMonth()

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--
    }

    return age
  })

  const yearsOfExperience = computed(() => {
    return new Date().getFullYear() - startYear
  })

  return {
    age,
    yearsOfExperience
  }
}
