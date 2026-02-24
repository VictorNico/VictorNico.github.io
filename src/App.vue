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
      <Projects />
      <Services />
      <Contact />
    </main>

    <Footer />

    <CVModal />

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
import CVModal from './components/ui/CVModal.vue'
import Hero from './components/sections/Hero.vue'
import About from './components/sections/About.vue'
import Skills from './components/sections/Skills.vue'

// Import all section components
import Facts from './components/sections/Facts.vue'
import Resume from './components/sections/Resume.vue'
import Publications from './components/sections/Publications.vue'
import Awards from './components/sections/Awards.vue'
import Projects from './components/sections/Projects.vue'
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
// const scrollToSection = (sectionId) => {
//   nextTick(() => {
//     const element = document.getElementById(sectionId)
//     if (element) {
//       element.scrollIntoView({
//         behavior: 'smooth',
//         block: 'start'
//       })
//     }
//   })
// }

const scrollToSection = (sectionId) => {
  nextTick(() => {
    const element = document.getElementById(sectionId)
    if (!element) return

    const start = window.scrollY
    const target = element.getBoundingClientRect().top + window.scrollY
    const distance = Math.abs(target - start)

    // Durée dynamique selon la distance
    const minDuration = 1500
    const maxDuration = 3000
    const duration = Math.min(maxDuration, Math.max(minDuration, distance * 0.5))

    let startTime = null

    const cubicBezier = (p1x, p1y, p2x, p2y) => {
      return (t) => {
        const cx = 3 * p1x, bx = 3 * (p2x - p1x) - cx, ax = 1 - cx - bx
        const cy = 3 * p1y, by = 3 * (p2y - p1y) - cy, ay = 1 - cy - by

        const solveCurveX = (x) => {
          let t2 = x
          for (let i = 0; i < 8; i++) {
            const x2 = ax * t2 ** 3 + bx * t2 ** 2 + cx * t2 - x
            const dx = 3 * ax * t2 ** 2 + 2 * bx * t2 + cx
            if (Math.abs(dx) < 1e-6) break
            t2 -= x2 / dx
          }
          return t2
        }

        const t2 = solveCurveX(t)
        return ay * t2 ** 3 + by * t2 ** 2 + cy * t2
      }
    }

    const ease = cubicBezier(0.42, 0, 0.58, 1)

    const animation = (currentTime) => {
      if (!startTime) startTime = currentTime
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)

      window.scrollTo(0, start + (target - start) * ease(progress))

      if (progress < 1) requestAnimationFrame(animation)
    }

    requestAnimationFrame(animation)
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
