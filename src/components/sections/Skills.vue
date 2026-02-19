<template>
  <section id="skills" class="skills section">
    <div class="container">
      <div class="section-title">
        <h2 class="gradient-text">{{ t('skills.title') }}</h2>
        <p class="section-description">{{ getTranslated(skillsData?.intro) }}</p>
      </div>

      <div class="skills-categories">
        <div
          v-for="category in skillsData?.categories"
          :key="getTranslated(category.name)"
          class="category-section"
        >
          <h3 class="category-title">{{ getTranslated(category.name) }}</h3>

          <div class="skills-grid" :class="`grid-${category.type}`">
            <div
              v-for="skill in category.skills"
              :key="getTranslated(skill.name)"
              class="skill-card"
              :style="{ '--skill-color': skill.color }"
            >
              <div class="skill-icon" v-if="skill.icon">
                <i :class="['bi', `bi-${skill.icon}`]"></i>
              </div>

              <div class="skill-info">
                <h4 class="skill-name">{{ getTranslated(skill.name) }}</h4>
                <div class="skill-bar">
                  <div
                    class="skill-progress"
                    :style="{ width: skill.level + '%' }"
                  ></div>
                  <span class="skill-level">{{ skill.level }}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { useDataLoader } from '../../composables/useDataLoader'
import { useAge } from '../../composables/useAge'
import { useI18n } from 'vue-i18n'
import { useI18nData } from '../../composables/useI18nData'

const { data: skillsData } = useDataLoader('skills.i18n')
const { yearsOfExperience } = useAge()
const { t } = useI18n()
const { getTranslated } = useI18nData()
</script>

<style lang="scss" scoped>

.skills {
  background: $bg-card;
}

.section-title {
  text-align: center;
  margin-bottom: $spacing-3xl;

  h2 {
    font-size: clamp(2rem, 5vw, 3rem);
    margin-bottom: $spacing-lg;
    position: relative;
    display: inline-block;

    &::after {
      content: '';
      position: absolute;
      bottom: -10px;
      left: 50%;
      transform: translateX(-50%);
      width: 60%;
      height: 3px;
      background: linear-gradient(90deg, transparent, $color-secondary, transparent);
    }
  }

  .section-description {
    max-width: 800px;
    margin: 0 auto;
    font-size: 1.1rem;
    line-height: 1.8;
  }
}

.skills-categories {
  display: flex;
  flex-direction: column;
  gap: $spacing-3xl;
}

.category-section {
  .category-title {
    font-size: 1.8rem;
    color: $color-secondary;
    margin-bottom: $spacing-xl;
    text-align: center;
    font-family: $font-heading;
    position: relative;
    padding-bottom: $spacing-md;

    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
      width: 100px;
      height: 2px;
      background: $color-accent;
    }
  }
}

.skills-grid {
  display: grid;
  gap: $spacing-lg;

  &.grid-technical {
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  }

  &.grid-language,
  &.grid-soft {
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  }
}

.skill-card {
  background: $bg-dark;
  border: 1px solid rgba(100, 255, 218, 0.1);
  border-radius: $radius-lg;
  padding: $spacing-xl;
  display: flex;
  gap: $spacing-md;
  align-items: center;
  transition: all $transition-normal;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 4px;
    height: 100%;
    background: var(--skill-color, $color-secondary);
    transform: scaleY(0);
    transition: transform $transition-normal;
  }

  &:hover {
    transform: translateY(-5px);
    border-color: var(--skill-color, $color-secondary);
    box-shadow: 0 10px 30px rgba(100, 255, 218, 0.2);

    &::before {
      transform: scaleY(1);
    }

    .skill-icon {
      transform: scale(1.1) rotate(5deg);
    }
  }
}

.skill-icon {
  width: 50px;
  height: 50px;
  border-radius: $radius-md;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--skill-color, $color-secondary);
  color: white;
  font-size: 1.5rem;
  flex-shrink: 0;
  transition: transform $transition-normal;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
}

.skill-info {
  flex: 1;
}

.skill-name {
  font-size: 1rem;
  color: $text-primary;
  margin-bottom: $spacing-sm;
  font-weight: 600;
}

.skill-bar {
  position: relative;
  width: 100%;
  height: 8px;
  background: rgba(100, 255, 218, 0.1);
  border-radius: $radius-full;
  overflow: hidden;
}

.skill-progress {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  background: linear-gradient(90deg, var(--skill-color, $color-secondary), var(--skill-color, $color-accent));
  border-radius: $radius-full;
  transition: width 1s ease-out;
  box-shadow: 0 0 10px var(--skill-color, $color-secondary);

  animation: slideIn 1.5s ease-out;
}

@keyframes slideIn {
  from {
    width: 0;
  }
}

.skill-level {
  position: absolute;
  right: 0;
  top: -25px;
  font-size: 0.85rem;
  color: var(--skill-color, $color-secondary);
  font-family: $font-mono;
  font-weight: 600;
}
</style>
