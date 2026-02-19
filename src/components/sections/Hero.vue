<template>
  <section id="hero" class="hero">
    <canvas ref="particleCanvas" class="particle-bg"></canvas>

    <div class="hero-content">
      <div class="hero-text">
        <h1 class="hero-name glitch" :data-text="profile?.personal?.name">
          {{ profile?.personal?.name }}
        </h1>

        <div class="hero-title">
          <span class="prefix">{{ t('hero.prefix') }}</span>
          <span class="typed-text">{{ currentRole }}</span>
          <span class="cursor">|</span>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useDataLoader } from '../../composables/useDataLoader'
import { useI18n } from 'vue-i18n'
import { useI18nData } from '../../composables/useI18nData'

const { data: profile } = useDataLoader('profile.i18n')
const { t } = useI18n()
const { getTranslatedArray } = useI18nData()
const particleCanvas = ref(null)
const currentRoleIndex = ref(0)

const currentRole = computed(() => {
  const roles = getTranslatedArray(profile.value?.hero?.roles)
  return roles[currentRoleIndex.value] || ''
})

// Typewriter effect
let typewriterInterval
onMounted(() => {
  // Wait for data to load before starting typewriter
  const startTypewriter = () => {
    const roles = getTranslatedArray(profile.value?.hero?.roles)
    if (!roles.length) {
      setTimeout(startTypewriter, 100)
      return
    }

    typewriterInterval = setInterval(() => {
      currentRoleIndex.value = (currentRoleIndex.value + 1) % roles.length
    }, 3000)
  }

  startTypewriter()

  // Initialize particles
  initParticles()
})

onUnmounted(() => {
  if (typewriterInterval) {
    clearInterval(typewriterInterval)
  }
})

// Particle animation
const initParticles = () => {
  if (!particleCanvas.value) return

  const canvas = particleCanvas.value
  const ctx = canvas.getContext('2d')

  canvas.width = window.innerWidth
  canvas.height = window.innerHeight

  const particles = []
  const particleCount = 100

  class Particle {
    constructor() {
      this.x = Math.random() * canvas.width
      this.y = Math.random() * canvas.height
      this.vx = (Math.random() - 0.5) * 0.5
      this.vy = (Math.random() - 0.5) * 0.5
      this.radius = Math.random() * 2 + 1
    }

    update() {
      this.x += this.vx
      this.y += this.vy

      if (this.x < 0 || this.x > canvas.width) this.vx *= -1
      if (this.y < 0 || this.y > canvas.height) this.vy *= -1
    }

    draw() {
      ctx.beginPath()
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
      ctx.fillStyle = 'rgba(100, 255, 218, 0.5)'
      ctx.fill()
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle())
  }

  const animate = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    particles.forEach((particle) => {
      particle.update()
      particle.draw()
    })

    // Draw connections
    particles.forEach((p1, i) => {
      particles.slice(i + 1).forEach((p2) => {
        const dx = p1.x - p2.x
        const dy = p1.y - p2.y
        const distance = Math.sqrt(dx * dx + dy * dy)

        if (distance < 100) {
          ctx.beginPath()
          ctx.strokeStyle = `rgba(100, 255, 218, ${0.2 * (1 - distance / 100)})`
          ctx.lineWidth = 0.5
          ctx.moveTo(p1.x, p1.y)
          ctx.lineTo(p2.x, p2.y)
          ctx.stroke()
        }
      })
    })

    requestAnimationFrame(animate)
  }

  animate()

  // Handle resize
  window.addEventListener('resize', () => {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
  })
}
</script>

<style lang="scss" scoped>

.hero {
  position: relative;
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, $bg-dark 0%, $bg-card 100%);
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image:
      linear-gradient($color-secondary 1px, transparent 1px),
      linear-gradient(90deg, $color-secondary 1px, transparent 1px);
    background-size: 40px 40px;
    opacity: 0.03;
    z-index: 1;
  }
}

.particle-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 2;
}

.hero-content {
  position: relative;
  z-index: 3;
  text-align: center;
  padding: 0 $spacing-lg;
}

.hero-name {
  font-size: clamp(2.5rem, 8vw, 5rem);
  margin-bottom: $spacing-lg;
  color: $text-primary;
  font-weight: 700;
  letter-spacing: -0.02em;
}

.glitch {
  position: relative;
  display: inline-block;

  &::before,
  &::after {
    content: attr(data-text);
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0.8;
  }

  &::before {
    animation: glitch 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) infinite;
    color: $color-accent;
    z-index: -1;
    clip-path: inset(0);
  }

  &::after {
    animation: glitch 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) reverse infinite;
    color: $data-purple;
    z-index: -2;
    clip-path: inset(0);
  }

  &:hover {
    &::before,
    &::after {
      animation-duration: 0.15s;
    }
  }
}

@keyframes glitch {
  0% {
    clip-path: inset(40% 0 61% 0);
    transform: translate(-2px, 2px);
  }
  20% {
    clip-path: inset(92% 0 1% 0);
    transform: translate(2px, -2px);
  }
  40% {
    clip-path: inset(43% 0 1% 0);
    transform: translate(-2px, 2px);
  }
  60% {
    clip-path: inset(25% 0 58% 0);
    transform: translate(2px, -2px);
  }
  80% {
    clip-path: inset(54% 0 7% 0);
    transform: translate(-2px, 2px);
  }
  100% {
    clip-path: inset(58% 0 43% 0);
    transform: translate(2px, -2px);
  }
}

.hero-title {
  font-size: clamp(1.2rem, 4vw, 2rem);
  color: $text-secondary;
  font-family: $font-mono;

  .prefix {
    color: $text-primary;
  }

  .typed-text {
    color: $color-secondary;
    font-weight: 600;
  }

  .cursor {
    color: $color-accent;
    animation: blink 1s infinite;
  }
}

@keyframes blink {
  0%, 50% {
    opacity: 1;
  }
  51%, 100% {
    opacity: 0;
  }
}
</style>
