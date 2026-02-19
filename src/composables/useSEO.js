import { watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useI18nData } from './useI18nData'

export function useSEO(profileData) {
  const { locale } = useI18n()
  const { getTranslated } = useI18nData()

  const updateMetaTags = () => {
    if (!profileData.value) return

    const { personal } = profileData.value

    // Get translated values
    const title = getTranslated(personal.title)
    const bio = getTranslated(personal.bio)

    // Update title
    document.title = `${personal.name} - ${title} | Portfolio`

    // Update or create meta tags
    const updateMeta = (name, content) => {
      let element = document.querySelector(`meta[name="${name}"]`)
      if (!element) {
        element = document.createElement('meta')
        element.setAttribute('name', name)
        document.head.appendChild(element)
      }
      element.setAttribute('content', content)
    }

    const updateProperty = (property, content) => {
      let element = document.querySelector(`meta[property="${property}"]`)
      if (!element) {
        element = document.createElement('meta')
        element.setAttribute('property', property)
        document.head.appendChild(element)
      }
      element.setAttribute('content', content)
    }

    // Basic meta tags
    updateMeta('description', bio)
    updateMeta('author', personal.name)
    updateMeta('keywords', 'Victor Djiembou, Portfolio, Full Stack Developer, Data Scientist, Vue.js, Cameroon, SSI, Security')

    // Open Graph tags
    updateProperty('og:title', `${personal.name} - Portfolio`)
    updateProperty('og:description', bio)
    updateProperty('og:type', 'website')
    updateProperty('og:url', personal.contacts.website)
    updateProperty('og:image', `${window.location.origin}${personal.photo}`)
    updateProperty('og:locale', locale.value === 'fr' ? 'fr_FR' : 'en_US')

    // Twitter Card tags
    updateMeta('twitter:card', 'summary_large_image')
    updateMeta('twitter:title', `${personal.name} - Portfolio`)
    updateMeta('twitter:description', bio)
    updateMeta('twitter:image', `${window.location.origin}${personal.photo}`)
    if (personal.social) {
      const twitter = personal.social.find(s => s.platform === 'twitter')
      if (twitter) {
        const username = twitter.url.split('/').pop()
        updateMeta('twitter:creator', `@${username}`)
      }
    }

    // Canonical link
    let canonical = document.querySelector('link[rel="canonical"]')
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.setAttribute('rel', 'canonical')
      document.head.appendChild(canonical)
    }
    canonical.setAttribute('href', personal.contacts.website)

    // Language
    document.documentElement.lang = locale.value
  }

  // Watch for changes in profile data and locale
  watch([() => profileData.value, locale], updateMetaTags, { immediate: true })

  return {
    updateMetaTags
  }
}
