<template>
  <section id="facts" class="facts section">
    <div class="container">
      <div class="section-title">
        <h2 class="gradient-text">{{ t('facts.title') }}</h2>
        <p class="section-description">
          {{ getTranslated(profile?.facts?.intro) }}
        </p>
      </div>

      <div class="facts-grid">
        <div
          v-for="fact in profile?.facts?.items"
          :key="getTranslated(fact.label)"
          class="fact-card"
        >
          <i :class="['fact-icon', fact.icon]"></i>
          <div class="fact-count">{{ fact.count }}</div>
          <p class="fact-label">{{ getTranslated(fact.label) }}</p>
          <p class="fact-description">{{ getTranslated(fact.description) }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { useDataLoader } from '../../composables/useDataLoader'
import { useI18n } from 'vue-i18n'
import { useI18nData } from '../../composables/useI18nData'

const { data: profile } = useDataLoader('profile.i18n')
const { t } = useI18n()
const { getTranslated } = useI18nData()
</script>

<style lang="scss" scoped>

.facts {
  background: $bg-dark;
}

.section-title {
  text-align: center;
  margin-bottom: $spacing-3xl;

  h2 {
    font-size: clamp(2rem, 5vw, 3rem);
    margin-bottom: $spacing-lg;
  }
}

.facts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: $spacing-xl;
}

.fact-card {
  background: $bg-card;
  border: 1px solid rgba(100, 255, 218, 0.1);
  border-radius: $radius-lg;
  padding: $spacing-2xl;
  text-align: center;
  transition: all $transition-normal;

  &:hover {
    transform: translateY(-10px);
    border-color: $color-secondary;
    box-shadow: $shadow-glow;

    .fact-icon {
      transform: scale(1.2) rotate(10deg);
    }
  }
}

.fact-icon {
  font-size: 3rem;
  color: $color-secondary;
  margin-bottom: $spacing-md;
  transition: transform $transition-normal;
}

.fact-count {
  font-size: 3rem;
  font-family: $font-heading;
  color: $color-accent;
  font-weight: 700;
  margin-bottom: $spacing-sm;
}

.fact-label {
  font-size: 1.2rem;
  color: $text-primary;
  margin-bottom: $spacing-sm;
}

.fact-description {
  color: $text-secondary;
  font-size: 0.9rem;
}
</style>
