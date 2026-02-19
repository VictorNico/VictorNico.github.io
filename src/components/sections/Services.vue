<template>
  <section id="services" class="services section">
    <div class="container">
      <div class="section-title">
        <h2 class="gradient-text">{{ t('services.title') }}</h2>
        <p class="section-description">{{ getTranslated(servicesData?.intro) }}</p>
      </div>

      <div class="services-grid">
        <div
          v-for="service in servicesData?.services"
          :key="service.id"
          class="service-card"
          :style="{ '--service-color': service.color }"
        >
          <div class="service-icon">
            <i :class="service.icon"></i>
          </div>
          <h3 class="service-title">{{ getTranslated(service.title) }}</h3>
          <p class="service-description">{{ getTranslated(service.description) }}</p>
          <div class="service-overlay">
            <span>{{ t('services.learnMore') }}</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { useDataLoader } from '../../composables/useDataLoader'
import { useI18n } from 'vue-i18n'
import { useI18nData } from '../../composables/useI18nData'

const { data: servicesData } = useDataLoader('services.i18n')
const { t } = useI18n()
const { getTranslated } = useI18nData()
</script>

<style lang="scss" scoped>

.services {
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

.services-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: $spacing-xl;
}

.service-card {
  position: relative;
  background: $bg-card;
  border: 1px solid rgba(100, 255, 218, 0.1);
  border-radius: $radius-lg;
  padding: $spacing-2xl;
  text-align: center;
  transition: all $transition-normal;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: var(--service-color, $color-secondary);
    transform: scaleX(0);
    transition: transform $transition-normal;
  }

  &:hover {
    transform: translateY(-10px);
    border-color: var(--service-color, $color-secondary);
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);

    &::before {
      transform: scaleX(1);
    }

    .service-icon {
      transform: scale(1.1) rotate(5deg);
      background: var(--service-color, $color-secondary);
      color: white;
    }

    .service-overlay {
      opacity: 1;
    }
  }
}

.service-icon {
  width: 80px;
  height: 80px;
  margin: 0 auto $spacing-lg;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(100, 255, 218, 0.1);
  border-radius: $radius-lg;
  font-size: 2.5rem;
  color: var(--service-color, $color-secondary);
  transition: all $transition-normal;
}

.service-title {
  font-size: 1.4rem;
  color: $text-primary;
  margin-bottom: $spacing-md;
  font-family: $font-heading;
}

.service-description {
  color: $text-secondary;
  line-height: 1.7;
}

.service-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: $spacing-md;
  background: linear-gradient(to top, var(--service-color, $color-secondary), transparent);
  opacity: 0;
  transition: opacity $transition-normal;

  span {
    color: white;
    font-family: $font-mono;
    font-weight: 600;
  }
}
</style>
