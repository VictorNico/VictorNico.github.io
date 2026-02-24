<template>
  <div
    class="fsc-root"
    @mouseenter="pauseAuto"
    @mouseleave="resumeAuto"
    @touchstart.passive="onTouchStart"
    @touchend.passive="onTouchEnd"
  >
    <!-- 3D stage -->
    <div class="fsc-stage" :style="{ perspective: '1100px' }">
      <div
        v-for="(skill, i) in skills"
        :key="getTranslated(skill.name)"
        class="fsc-card"
        :class="{ 'fsc-card--active': offset(i) === 0 }"
        :style="cardStyle(i)"
        @click="goTo(i)"
      >
        <!-- Front face -->
        <div class="fsc-face" :style="{ '--c': skill.color }">
          <div class="fsc-icon-wrap">
            <img
              v-if="skill.image"
              :src="skill.image"
              :alt="getTranslated(skill.name)"
              loading="lazy"
              @error="skill.image = null"
            />
            <i v-else :class="['bi', `bi-${skill.icon}`]" :style="{ color: skill.color }" />
          </div>
          <h4 class="fsc-name">{{ getTranslated(skill.name) }}</h4>
          <div class="fsc-level-row">
            <div class="fsc-bar">
              <div class="fsc-bar-fill" :style="{ width: skill.level + '%', background: skill.color }" />
            </div>
            <span class="fsc-pct" :style="{ color: skill.color }">{{ skill.level }}%</span>
          </div>
        </div>

        <!-- Mirror reflection -->
        <div class="fsc-mirror" :style="{ '--c': skill.color }" aria-hidden="true">
          <div class="fsc-icon-wrap">
            <img v-if="skill.image" :src="skill.image" loading="lazy" />
            <i v-else :class="['bi', `bi-${skill.icon}`]" :style="{ color: skill.color }" />
          </div>
          <h4 class="fsc-name">{{ getTranslated(skill.name) }}</h4>
        </div>
      </div>
    </div>

    <!-- Navigation -->
    <div class="fsc-controls">
      <button class="fsc-btn" @click="prev" :aria-label="t('skills.prevCard')">
        <i class="bi bi-chevron-left" />
      </button>

      <div class="fsc-dots">
        <button
          v-for="(_, i) in skills"
          :key="i"
          class="fsc-dot"
          :class="{ active: activeIdx === i }"
          :style="activeIdx === i ? { background: currentColor } : {}"
          @click="goTo(i)"
          :aria-label="`Card ${i + 1}`"
        />
      </div>

      <button class="fsc-btn" @click="next" :aria-label="t('skills.nextCard')">
        <i class="bi bi-chevron-right" />
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useI18nData } from '../../composables/useI18nData'

const props = defineProps({ skills: { type: Array, required: true } })
const { getTranslated } = useI18nData()
const { t } = useI18n()

const activeIdx = ref(0)
const n = computed(() => props.skills.length)
let autoTimer = null
let touchStartX = 0

const currentColor = computed(() => props.skills[activeIdx.value]?.color ?? '#64FFDA')

/**
 * Signed offset of card i relative to active index.
 * Wraps to range [-n/2, +n/2] for shortest path.
 */
function offset(i) {
  let diff = i - activeIdx.value
  const half = n.value / 2
  if (diff >  half) diff -= n.value
  if (diff < -half) diff += n.value
  return diff
}

function cardStyle(i) {
  const off = offset(i)
  const absOff = Math.abs(off)
  const vw = window.innerWidth
  const isMobileView = vw < 640

  // On mobile: only show center card — side cards cause viewport overflow
  if (isMobileView && absOff >= 1) {
    return { opacity: 0, pointerEvents: 'none', zIndex: 0 }
  }

  if (absOff > 2) {
    return { opacity: 0, pointerEvents: 'none', zIndex: 0 }
  }

  // Responsive horizontal spread: never exceed 38% of viewport
  const tx    = off * Math.min(210, vw * 0.38)
  const tz    = -absOff * 90
  const ry    = -off * 48
  const scale = absOff === 0 ? 1 : absOff === 1 ? 0.82 : 0.65
  const op    = absOff === 0 ? 1 : absOff === 1 ? 0.7 : 0.3
  const zi    = 10 - absOff * 3
  const ptr   = absOff <= 1 ? 'auto' : 'none'

  return {
    transform: `translateX(${tx}px) translateZ(${tz}px) rotateY(${ry}deg) scale(${scale})`,
    opacity: op,
    zIndex: zi,
    pointerEvents: ptr,
    cursor: absOff === 0 ? 'default' : 'pointer',
  }
}

function goTo(i) { activeIdx.value = i }
function next()  { activeIdx.value = (activeIdx.value + 1) % n.value }
function prev()  { activeIdx.value = (activeIdx.value - 1 + n.value) % n.value }

function startAuto() {
  autoTimer = setInterval(next, 3500)
}
function pauseAuto()  { clearInterval(autoTimer) }
function resumeAuto() { startAuto() }

function onTouchStart(e) { touchStartX = e.touches[0].clientX }
function onTouchEnd(e) {
  const dx = e.changedTouches[0].clientX - touchStartX
  if (Math.abs(dx) > 40) dx < 0 ? next() : prev()
}

onMounted(startAuto)
onUnmounted(() => clearInterval(autoTimer))
</script>

<style lang="scss" scoped>
.fsc-root {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: $spacing-xl;
  padding: $spacing-lg 0;
  user-select: none;
}

/* ---- 3-D stage ---- */
.fsc-stage {
  position: relative;
  width: 100%;
  height: 260px;
  display: flex;
  align-items: center;
  justify-content: center;
  transform-style: preserve-3d;
}

/* ---- Individual card ---- */
.fsc-card {
  position: absolute;
  width: 220px;
  transform-style: preserve-3d;
  transition:
    transform 0.55s cubic-bezier(0.25, 0.46, 0.45, 0.94),
    opacity   0.55s ease;
  will-change: transform, opacity;
}

/* ---- Card front face ---- */
.fsc-face {
  background: $bg-dark;
  border: 1px solid rgba(100, 255, 218, 0.1);
  border-top: 2px solid var(--c);
  border-radius: $radius-lg;
  padding: $spacing-xl $spacing-lg;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: $spacing-md;
  min-height: 180px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);

  .fsc-card--active & {
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.5), 0 0 0 1px var(--c);
  }
}

.fsc-icon-wrap {
  width: 60px;
  height: 60px;
  border-radius: $radius-md;
  background: rgba(255, 255, 255, 0.04);
  display: flex;
  align-items: center;
  justify-content: center;

  img  { width: 36px; height: 36px; object-fit: contain; }
  i    { font-size: 2rem; }
}

.fsc-name {
  font-size: 0.82rem;
  font-weight: 700;
  font-family: $font-mono;
  color: $text-primary;
  text-align: center;
  line-height: 1.4;
}

.fsc-level-row {
  display: flex;
  align-items: center;
  gap: $spacing-sm;
  width: 100%;
}

.fsc-bar {
  flex: 1;
  height: 5px;
  background: rgba(100, 255, 218, 0.08);
  border-radius: $radius-full;
  overflow: hidden;
}

.fsc-bar-fill {
  height: 100%;
  border-radius: $radius-full;
  transition: width 0.8s ease;
}

.fsc-pct {
  font-size: 0.72rem;
  font-weight: 700;
  font-family: $font-mono;
  min-width: 32px;
  text-align: right;
}

/* ---- Mirror reflection ---- */
.fsc-mirror {
  border-radius: 0 0 $radius-lg $radius-lg;
  padding: $spacing-md $spacing-lg;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: $spacing-sm;
  transform: scaleY(-1);
  opacity: 0.12;
  mask-image: linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, transparent 70%);
  -webkit-mask-image: linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, transparent 70%);
  pointer-events: none;

  .fsc-icon-wrap { width: 44px; height: 44px; }
  .fsc-name      { font-size: 0.72rem; }
  img  { width: 26px; height: 26px; }
  i    { font-size: 1.5rem; }
}

/* ---- Navigation controls ---- */
.fsc-controls {
  display: flex;
  align-items: center;
  gap: $spacing-lg;
}

.fsc-btn {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 1px solid rgba(100, 255, 218, 0.2);
  background: $bg-dark;
  color: $color-secondary;
  font-size: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: border-color $transition-fast, background $transition-fast;

  &:hover {
    border-color: $color-secondary;
    background: rgba(100, 255, 218, 0.08);
  }
}

.fsc-dots {
  display: flex;
  gap: 8px;
  align-items: center;
}

.fsc-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  border: none;
  background: rgba(100, 255, 218, 0.2);
  cursor: pointer;
  transition: background $transition-normal, transform $transition-fast;
  padding: 0;

  &.active {
    transform: scale(1.35);
  }
}
</style>
