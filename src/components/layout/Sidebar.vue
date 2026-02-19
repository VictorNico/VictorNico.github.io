<template>
  <aside class="sidebar" :class="{ 'mobile-open': mobileMenuOpen }">
    <div class="profile-section">
      <img
        v-if="profile?.personal?.photo"
        :src="profile?.personal?.photo"
        :alt="profile?.personal?.name"
        class="profile-img"
        width="120"
        height="120"
        loading="eager"
        fetchpriority="high"
      />
      <h1 class="profile-name">
        <a href="#hero">{{ profile?.personal?.name }}</a>
      </h1>

      <div class="social-links">
        <a
          v-for="social in profile?.personal?.social"
          :key="social.platform"
          :href="social.url"
          :class="social.platform"
          target="_blank"
          rel="noopener noreferrer"
          :aria-label="social.platform"
        >
          <i :class="['bx', social.icon]"></i>
        </a>
      </div>

      <div class="language-switcher-wrapper">
        <LanguageSwitcher />
      </div>
    </div>

    <nav class="nav-menu">
      <ul>
        <li v-for="section in sections" :key="section.id">
          <a
            :href="`#${section.id}`"
            class="nav-link"
            :class="{ active: activeSection === section.id }"
            @click="handleNavClick(section.id)"
          >
            <i :class="['bx', section.icon]"></i>
            <span>{{ section.label }}</span>
          </a>
        </li>
      </ul>
    </nav>
  </aside>

  <button
    class="mobile-nav-toggle"
    @click="toggleMobileMenu"
    aria-label="Toggle navigation"
  >
    <i :class="['bx', mobileMenuOpen ? 'bx-x' : 'bx-menu']"></i>
  </button>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useDataLoader } from '../../composables/useDataLoader'
import { useI18n } from 'vue-i18n'
import LanguageSwitcher from '../ui/LanguageSwitcher.vue'

const { data: profile } = useDataLoader('profile.i18n')
const { t } = useI18n()

const mobileMenuOpen = ref(false)
const activeSection = ref('hero')

const sections = computed(() => [
  { id: 'hero', label: t('nav.home'), icon: 'bx-home' },
  { id: 'about', label: t('nav.about'), icon: 'bx-user' },
  { id: 'facts', label: t('nav.facts'), icon: 'bx-bar-chart-alt' },
  { id: 'skills', label: t('nav.skills'), icon: 'bx-code-alt' },
  { id: 'resume', label: t('nav.resume'), icon: 'bx-file-blank' },
  { id: 'publications', label: t('nav.publications'), icon: 'bx-book-bookmark' },
  { id: 'awards', label: t('nav.awards'), icon: 'bx-trophy' },
  { id: 'services', label: t('nav.services'), icon: 'bx-server' },
  { id: 'contact', label: t('nav.contact'), icon: 'bx-envelope' }
])

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value
}

const handleNavClick = (sectionId) => {
  activeSection.value = sectionId
  mobileMenuOpen.value = false
}

// Detect active section on scroll
const handleScroll = () => {
  const scrollPosition = window.scrollY + 100

  for (const section of sections.value) {
    const element = document.getElementById(section.id)
    if (element) {
      const offsetTop = element.offsetTop
      const offsetHeight = element.offsetHeight

      if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
        activeSection.value = section.id
        break
      }
    }
  }
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style lang="scss" scoped>

.sidebar {
  position: fixed;
  top: 0;
  left: 0;
  width: 280px;
  height: 100vh;
  background: $bg-card;
  border-right: 1px solid rgba(100, 255, 218, 0.1);
  overflow-y: auto;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  transition: transform $transition-normal;

  @media (max-width: $breakpoint-lg) {
    transform: translateX(-100%);

    &.mobile-open {
      transform: translateX(0);
    }
  }
}

.profile-section {
  padding: $spacing-2xl $spacing-lg;
  text-align: center;
  border-bottom: 1px solid rgba(100, 255, 218, 0.1);
}

.profile-img {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  border: 3px solid $color-secondary;
  margin-bottom: $spacing-md;
  object-fit: cover;
  box-shadow: $shadow-glow;
}

.profile-name {
  font-size: 1.5rem;
  font-family: $font-heading;
  margin-bottom: $spacing-md;

  a {
    color: $text-primary;
    transition: color $transition-fast;

    &:hover {
      color: $color-secondary;
    }
  }
}

.social-links {
  display: flex;
  justify-content: center;
  gap: $spacing-md;
  flex-wrap: wrap;
  margin-bottom: $spacing-lg;

  a {
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(100, 255, 218, 0.1);
    border-radius: 50%;
    color: $color-secondary;
    font-size: 1.2rem;
    transition: all $transition-normal;

    &:hover {
      background: $color-secondary;
      color: $bg-dark;
      transform: translateY(-3px);
      box-shadow: $shadow-glow;
    }
  }
}

.language-switcher-wrapper {
  display: flex;
  justify-content: center;
  padding-top: $spacing-md;
  border-top: 1px solid rgba(100, 255, 218, 0.1);
}

.nav-menu {
  flex: 1;
  padding: $spacing-lg 0;

  ul {
    list-style: none;
  }

  li {
    margin-bottom: $spacing-xs;
  }
}

.nav-link {
  display: flex;
  align-items: center;
  gap: $spacing-md;
  padding: $spacing-md $spacing-lg;
  color: $text-secondary;
  font-family: $font-mono;
  font-size: 0.95rem;
  transition: all $transition-fast;
  position: relative;

  i {
    font-size: 1.2rem;
    transition: transform $transition-fast;
  }

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    width: 3px;
    background: $color-secondary;
    transform: scaleY(0);
    transition: transform $transition-fast;
  }

  &:hover,
  &.active {
    color: $color-secondary;
    background: rgba(100, 255, 218, 0.05);

    i {
      transform: translateX(5px);
    }
  }

  &.active::before {
    transform: scaleY(1);
  }
}

.mobile-nav-toggle {
  position: fixed;
  top: $spacing-lg;
  right: $spacing-lg;
  z-index: 1001;
  width: 50px;
  height: 50px;
  background: $bg-card;
  border: 2px solid $color-secondary;
  border-radius: $radius-md;
  color: $color-secondary;
  font-size: 1.5rem;
  cursor: pointer;
  display: none;
  align-items: center;
  justify-content: center;
  transition: all $transition-fast;

  &:hover {
    background: $color-secondary;
    color: $bg-dark;
    transform: rotate(90deg);
  }

  @media (max-width: $breakpoint-lg) {
    display: flex;
  }
}
</style>
