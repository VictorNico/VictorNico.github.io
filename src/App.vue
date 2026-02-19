<template>
  <div id="app">
    <div class="grid-background"></div>

    <Sidebar />

    <main class="main-content">
      <Hero />
      <About />
      <Facts />
      <Skills />
      <Resume />
      <Publications />
      <Awards />
      <Services />
      <Contact />
    </main>

    <Footer />

    <a href="#hero" class="back-to-top" :class="{ 'show': showBackToTop }">
      <i class="bx bx-up-arrow-alt"></i>
    </a>
  </div>
</template>

<script setup>
import {ref, onMounted, onUnmounted, nextTick} from 'vue'
import { useTheme } from './composables/useTheme'
import { useDataLoader } from './composables/useDataLoader'
import { useSEO } from './composables/useSEO'

import Sidebar from './components/layout/Sidebar.vue'
import Footer from './components/layout/Footer.vue'
import Hero from './components/sections/Hero.vue'
import About from './components/sections/About.vue'
import Skills from './components/sections/Skills.vue'

// Import all section components
import Facts from './components/sections/Facts.vue'
import Resume from './components/sections/Resume.vue'
import Publications from './components/sections/Publications.vue'
import Awards from './components/sections/Awards.vue'
import Services from './components/sections/Services.vue'
import Contact from './components/sections/Contact.vue'

// Apply theme
const { applyTheme } = useTheme()
applyTheme()

// Setup SEO
const { data: profileData } = useDataLoader('profile.i18n')
useSEO(profileData)

// Back to top button
const showBackToTop = ref(false)

const handleScroll = () => {
  showBackToTop.value = window.scrollY > 300
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

// ============================================================================
// HASH URL HANDLING
// ============================================================================
const scrollToSection = (sectionId) => {
  nextTick(() => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      })
    }
  })
}

const handleHashUrl = (url) => {
  try {
    const urlObj = new URL(url, window.location.origin)
    const hash = urlObj.hash

    if (hash && hash.startsWith('#')) {
      const sectionName = hash.substring(1)
      const pathWithoutHash = urlObj.pathname
      window.history.replaceState(null, '', pathWithoutHash)
      setTimeout(() => scrollToSection(sectionName), 100)
      return true
    }
  } catch (error) {
    console.warn('Erreur handleHashUrl:', error)
  }

  return false
}

nextTick(async ()=>{

  // Click interception pour les liens hash
  window.addEventListener('click', (event) => {
    const link = event?.target?.closest('a[href*="#"]');
    if (link) {
      const href = link.getAttribute('href')
      if (href && href.includes('#')) {
        event.preventDefault()
        handleHashUrl(link?.href)
      }
    }
  })
})

onMounted(()=>{
  nextTick()
  // 1. Hash URLs
  const currentUrl = window.location.href
  handleHashUrl(currentUrl)
})
</script>

<style lang="scss">
@use './assets/styles/theme.scss';

#app {
  position: relative;
  min-height: 100vh;
}

.main-content {
  margin-left: 0;
  transition: margin-left $transition-normal;

  @media (min-width: $breakpoint-lg) {
    margin-left: 280px;
  }
}

.back-to-top {
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 50px;
  height: 50px;
  background: $color-secondary;
  color: $bg-dark;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  cursor: pointer;
  opacity: 0;
  visibility: hidden;
  transform: translateY(20px);
  transition: all $transition-normal;
  z-index: 999;
  box-shadow: $shadow-glow;

  &:hover {
    background: $color-accent;
    transform: translateY(-5px);
    box-shadow: 0 0 40px rgba(100, 255, 218, 0.6);
  }

  &.show {
    opacity: 1;
    visibility: visible;
    transform: translateY(0);
  }
}
</style>
