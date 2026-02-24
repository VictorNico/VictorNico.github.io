<template>
  <div
    class="lang-carousel"
    @mouseenter="paused = true"
    @mouseleave="paused = false"
    aria-label="Programming languages carousel"
  >
    <div
      class="lang-track"
      :style="{ animationPlayState: paused ? 'paused' : 'running' }"
    >
      <div
        v-for="(skill, i) in infiniteSkills"
        :key="`lang-${skill.name.en}-${i}`"
        class="lang-card"
        :style="{ '--c': skill.color }"
      >
        <div class="logo-wrap">
          <svg class="ring-svg" viewBox="0 0 76 76" aria-hidden="true">
            <circle class="ring-bg" cx="38" cy="38" r="30" />
            <circle
              class="ring-fill"
              cx="38" cy="38" r="30"
              :stroke="skill.color"
              :stroke-dasharray="`${(skill.level / 100) * 188.5} 188.5`"
            />
          </svg>
          <div class="logo-center">
            <img
              v-if="skill.image"
              :src="skill.image"
              :alt="getTranslated(skill.name)"
              loading="lazy"
              @error="skill.image = null"
            />
            <i v-else :class="['bi', `bi-${skill.icon}`]" :style="{ color: skill.color }" />
          </div>
        </div>
        <span class="lang-name">{{ getTranslated(skill.name) }}</span>
        <span class="lang-pct" :style="{ color: skill.color }">{{ skill.level }}%</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useI18nData } from '../../composables/useI18nData'

const props = defineProps({
  skills: { type: Array, required: true },
})

const { getTranslated } = useI18nData()
const paused = ref(false)

// Duplicate array for seamless infinite scroll
const infiniteSkills = computed(() => [...props.skills, ...props.skills])
</script>

<style lang="scss" scoped>
.lang-carousel {
  overflow: hidden;
  position: relative;
  padding: $spacing-md 0;
  cursor: default;

  // Fade edges
  &::before,
  &::after {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    width: 80px;
    z-index: 2;
    pointer-events: none;
  }
  &::before { left: 0;  background: linear-gradient(to right, $bg-card, transparent); }
  &::after  { right: 0; background: linear-gradient(to left,  $bg-card, transparent); }
}

.lang-track {
  display: flex;
  gap: $spacing-lg;
  width: max-content;
  animation: lang-scroll 30s linear infinite;
}

@keyframes lang-scroll {
  from { transform: translateX(0); }
  to   { transform: translateX(-50%); }
}

.lang-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  width: 120px;
  flex-shrink: 0;
  background: $bg-dark;
  border: 1px solid rgba(100, 255, 218, 0.08);
  border-radius: $radius-xl;
  padding: $spacing-lg $spacing-md;
  transition:
    border-color $transition-normal,
    transform $transition-normal,
    box-shadow $transition-normal;

  &:hover {
    border-color: var(--c);
    transform: translateY(-6px);
    box-shadow: 0 10px 28px rgba(0, 0, 0, 0.45), 0 0 0 1px var(--c);
  }
}

.logo-wrap {
  position: relative;
  width: 76px;
  height: 76px;
}

.ring-svg {
  position: absolute;
  inset: 0;
  transform: rotate(-90deg);

  .ring-bg {
    fill: none;
    stroke: rgba(255, 255, 255, 0.06);
    stroke-width: 3.5;
  }

  .ring-fill {
    fill: none;
    stroke-width: 3.5;
    stroke-linecap: round;
    transition: stroke-dasharray 1.2s ease;
  }
}

.logo-center {
  position: absolute;
  inset: 10px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.03);
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: 30px;
    height: 30px;
    object-fit: contain;
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.4));
  }

  i {
    font-size: 1.5rem;
  }
}

.lang-name {
  font-size: 0.7rem;
  font-weight: 600;
  font-family: $font-mono;
  color: $text-primary;
  text-align: center;
  line-height: 1.3;
}

.lang-pct {
  font-size: 0.78rem;
  font-weight: 700;
  font-family: $font-mono;
}
</style>
