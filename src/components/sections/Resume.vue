<template>
  <section id="resume" class="resume section">
    <div class="container">
      <div class="section-title">
        <h2 class="gradient-text">{{ t('resume.title') }}</h2>
        <p class="section-description">
          {{ t('resume.intro', { age }) }}
        </p>
      </div>

      <!-- EDUCATION SECTION (FIRST) -->
      <div class="resume-section education-section">
        <h3 class="section-heading">
          <i class="bx bx-graduation"></i>
          {{ t('resume.education') }}
        </h3>

        <div class="timeline">
          <div
            v-for="edu in education?.education"
            :key="edu.id"
            class="timeline-item"
            data-aos="fade-up"
          >
            <div class="timeline-marker"></div>
            <div class="timeline-content">
              <h4 class="item-title">{{ getTranslated(edu.degree) }}</h4>
              <h5 class="item-subtitle">{{ getTranslated(edu.field) }}</h5>
              <p class="item-meta">
                <i class="bx bx-building"></i>
                {{ edu.institution }}, {{ edu.location }}
              </p>
              <p class="item-period">
                <i class="bx bx-calendar"></i>
                {{ formatDate(edu.startDate) }} - {{ formatDate(edu.endDate) }}
              </p>
              <p v-if="edu.gpa" class="item-gpa">
                <i class="bx bx-trending-up"></i>
                GPA: <strong>{{ edu.gpa }}</strong>
              </p>
              <p class="item-description">{{ getTranslated(edu.description) }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- EXPERIENCE SECTION (SECOND) -->
      <div class="resume-section experience-section">
        <h3 class="section-heading">
          <i class="bx bx-briefcase"></i>
          {{ t('resume.experience') }}
        </h3>

        <div class="timeline">
          <div
            v-for="exp in experiences?.experiences"
            :key="exp.id"
            class="timeline-item"
            data-aos="fade-up"
          >
            <div class="timeline-marker"></div>
            <div class="timeline-content">
              <h4 class="item-title">{{ getTranslated(exp.title) }}</h4>
              <p class="item-meta">
                <i class="bx bx-buildings"></i>
                {{ exp.company }}, {{ exp.location }}
              </p>
              <p class="item-period">
                <i class="bx bx-calendar"></i>
                {{ formatDate(exp.startDate) }} - {{ formatDate(exp.endDate) }}
              </p>
              <p v-if="exp.project" class="item-project">
                <i class="bx bx-file-blank"></i>
                <strong>{{ locale === 'fr' ? 'Projet:' : 'Project:' }}</strong> {{ getTranslated(exp.project) }}
              </p>
              <p v-if="exp.achievement" class="item-achievement">
                <i class="bx bx-trophy"></i>
                {{ getTranslated(exp.achievement) }}
              </p>
              <ul class="item-responsibilities">
                <li v-for="(resp, index) in exp.responsibilities" :key="index">
                  {{ getTranslated(resp) }}
                </li>
              </ul>
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

const { data: education } = useDataLoader('education.i18n')
const { data: experiences } = useDataLoader('experience.i18n')
const { age } = useAge()
const { t, locale } = useI18n()
const { getTranslated } = useI18nData()

const formatDate = (dateString) => {
  if (!dateString) return ''
  if (dateString === 'current') return t('resume.current')

  const date = new Date(dateString)
  return date.toLocaleDateString(locale.value === 'fr' ? 'fr-FR' : 'en-US', { month: 'short', year: 'numeric' })
}
</script>

<style lang="scss" scoped>
@import '../../assets/styles/variables.scss';

.resume {
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

.resume-section {
  margin-bottom: $spacing-3xl;

  &:last-child {
    margin-bottom: 0;
  }
}

.section-heading {
  display: flex;
  align-items: center;
  gap: $spacing-md;
  font-size: 2rem;
  color: $color-secondary;
  margin-bottom: $spacing-2xl;
  font-family: $font-heading;
  padding-bottom: $spacing-md;
  border-bottom: 2px solid rgba(100, 255, 218, 0.2);

  i {
    font-size: 2.2rem;
    animation: pulse 2s infinite;
  }
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}

.timeline {
  position: relative;
  padding-left: $spacing-3xl;

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 3px;
    background: linear-gradient(to bottom, $color-secondary, $color-accent);
    border-radius: $radius-full;
  }

  @media (max-width: $breakpoint-md) {
    padding-left: $spacing-xl;
  }
}

.timeline-item {
  position: relative;
  margin-bottom: $spacing-2xl;
  padding-bottom: $spacing-2xl;

  &:last-child {
    margin-bottom: 0;
    padding-bottom: 0;

    .timeline-content::after {
      display: none;
    }
  }
}

.timeline-marker {
  position: absolute;
  left: -$spacing-3xl;
  top: 5px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: $bg-card;
  border: 4px solid $color-secondary;
  z-index: 2;
  transition: all $transition-normal;

  @media (max-width: $breakpoint-md) {
    left: -$spacing-xl;
  }

  .timeline-item:hover & {
    transform: scale(1.3);
    box-shadow: 0 0 20px rgba(100, 255, 218, 0.6);
  }
}

.timeline-content {
  background: $bg-dark;
  border: 1px solid rgba(100, 255, 218, 0.1);
  border-radius: $radius-lg;
  padding: $spacing-xl;
  transition: all $transition-normal;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    left: -10px;
    top: 15px;
    width: 0;
    height: 0;
    border-style: solid;
    border-width: 10px 10px 10px 0;
    border-color: transparent rgba(100, 255, 218, 0.1) transparent transparent;
  }

  .timeline-item:hover & {
    transform: translateX(10px);
    border-color: $color-secondary;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  }
}

.item-title {
  font-size: 1.4rem;
  color: $text-primary;
  margin-bottom: $spacing-sm;
  font-family: $font-heading;
  line-height: 1.3;
}

.item-subtitle {
  font-size: 1.1rem;
  color: $color-accent;
  margin-bottom: $spacing-md;
  font-style: italic;
  font-weight: 500;
}

.item-meta {
  display: flex;
  align-items: center;
  gap: $spacing-sm;
  color: $text-secondary;
  margin-bottom: $spacing-sm;
  font-weight: 600;

  i {
    color: $color-secondary;
    font-size: 1.1rem;
  }
}

.item-period {
  display: flex;
  align-items: center;
  gap: $spacing-sm;
  color: $text-secondary;
  font-family: $font-mono;
  font-size: 0.9rem;
  margin-bottom: $spacing-md;
  padding: $spacing-xs $spacing-md;
  background: rgba(100, 255, 218, 0.05);
  border-radius: $radius-md;
  width: fit-content;

  i {
    color: $color-accent;
  }
}

.item-description {
  color: $text-secondary;
  line-height: 1.7;
  font-size: 0.95rem;
}

.item-responsibilities {
  list-style: none;
  padding-left: 0;
  margin-top: $spacing-md;

  li {
    position: relative;
    padding-left: $spacing-lg;
    margin-bottom: $spacing-sm;
    color: $text-secondary;
    line-height: 1.6;

    &::before {
      content: '▹';
      position: absolute;
      left: 0;
      color: $color-secondary;
      font-size: 1.3rem;
      font-weight: bold;
    }

    &:hover {
      color: $text-primary;
      transform: translateX(5px);
      transition: all $transition-fast;
    }
  }
}

// Responsive
@media (max-width: $breakpoint-md) {
  .section-heading {
    font-size: 1.6rem;

    i {
      font-size: 1.8rem;
    }
  }

  .timeline-content {
    padding: $spacing-lg;
  }

  .item-title {
    font-size: 1.2rem;
  }
}
</style>
