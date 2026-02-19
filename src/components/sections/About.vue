<template>
  <section id="about" class="about section">
    <div class="container">
      <div class="section-title">
        <h2 class="gradient-text">{{ t('about.title') }}</h2>
        <p class="section-description">{{ getTranslated(profile?.personal?.bio) }}</p>
      </div>

      <div class="about-content">
        <div class="about-image">
          <img
            :src="profile?.personal?.photo"
            :alt="profile?.personal?.name"
            class="profile-img glow"
          />
        </div>

        <div class="about-details">
          <h3>{{ getTranslated(profile?.personal?.title) }}</h3>
          <p class="tagline">
            <i class="bx bxs-quote-alt-left quote-icon"></i>
            {{ getTranslated(profile?.personal?.tagline) }}
            <i class="bx bxs-quote-alt-right quote-icon"></i>
          </p>

          <div class="info-grid">
            <div class="info-item">
              <i class="bx bx-calendar"></i>
              <strong>{{ t('about.birthday') }}:</strong>
              <span>{{ formatDate(profile?.personal?.birthdate) }}</span>
            </div>

            <div class="info-item">
              <i class="bx bx-user"></i>
              <strong>{{ t('about.age') }}:</strong>
              <span>{{ age }}</span>
            </div>

            <div class="info-item">
              <i class="bx bx-globe"></i>
              <strong>{{ t('about.website') }}:</strong>
              <a :href="profile?.personal?.contacts?.website" target="_blank">
                {{ profile?.personal?.contacts?.website }}
              </a>
            </div>

            <div class="info-item">
              <i class="bx bx-graduation"></i>
              <strong>{{ t('about.degree') }}:</strong>
              <span>{{ t('about.master') }}</span>
            </div>

            <div class="info-item">
              <i class="bx bx-phone"></i>
              <strong>{{ t('about.phone') }}:</strong>
              <span>{{ profile?.personal?.contacts?.phones?.[0] }}</span>
            </div>

            <div class="info-item">
              <i class="bx bx-briefcase"></i>
              <strong>{{ t('about.freelance') }}:</strong>
              <span class="status-badge">{{ t('about.available') }}</span>
            </div>

            <div class="info-item">
              <i class="bx bx-envelope"></i>
              <strong>{{ t('about.email') }}:</strong>
              <a :href="`mailto:${profile?.personal?.contacts?.emails?.[0]}`">
                {{ profile?.personal?.contacts?.emails?.[0] }}
              </a>
            </div>

            <div class="info-item">
              <i class="bx bx-map"></i>
              <strong>{{ t('about.city') }}:</strong>
              <span>{{ profile?.personal?.location?.city }}, {{ profile?.personal?.location?.country }}</span>
            </div>
          </div>

          <p class="motto">
            <i class="bx bxs-quote-alt-left quote-icon-left"></i>
            {{ getTranslated(profile?.personal?.motto) }}
            <i class="bx bxs-quote-alt-right quote-icon-right"></i>
          </p>
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

const { data: profile } = useDataLoader('profile.i18n')
const { age } = useAge()
const { t } = useI18n()
const { getTranslated } = useI18nData()

const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
}
</script>

<style lang="scss" scoped>
@import '../../assets/styles/variables.scss';

.about {
  background: $bg-dark;
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

.about-content {
  display: grid;
  grid-template-columns: 1fr;
  gap: $spacing-3xl;
  align-items: center;

  @media (min-width: $breakpoint-lg) {
    grid-template-columns: 350px 1fr;
  }
}

.about-image {
  display: flex;
  justify-content: center;

  .profile-img {
    width: 100%;
    max-width: 350px;
    border-radius: $radius-lg;
    border: 3px solid $color-secondary;
    object-fit: cover;
  }
}

.about-details {
  h3 {
    font-size: clamp(1.2rem, 3vw, 1.8rem);
    margin-bottom: $spacing-md;
    color: $color-secondary;
  }

  .tagline {
    font-style: italic;
    color: $text-secondary;
    margin-bottom: $spacing-xl;
    font-size: 1.1rem;

    .quote-icon {
      color: $color-accent;
      margin: 0 $spacing-xs;
    }
  }
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: $spacing-md;
  margin-bottom: $spacing-xl;
}

.info-item {
  display: flex;
  align-items: center;
  gap: $spacing-sm;
  padding: $spacing-md;
  background: rgba(100, 255, 218, 0.05);
  border-radius: $radius-md;
  border-left: 3px solid $color-secondary;
  transition: all $transition-normal;

  &:hover {
    background: rgba(100, 255, 218, 0.1);
    transform: translateX(5px);
  }

  i {
    font-size: 1.2rem;
    color: $color-secondary;
  }

  strong {
    color: $text-primary;
    margin-right: $spacing-xs;
  }

  span, a {
    color: $text-secondary;
  }

  a {
    transition: color $transition-fast;

    &:hover {
      color: $color-accent;
    }
  }

  .status-badge {
    background: $data-green;
    color: white;
    padding: 2px 10px;
    border-radius: $radius-full;
    font-size: 0.85rem;
    font-weight: 600;
  }
}

.motto {
  font-size: 1.1rem;
  font-style: italic;
  text-align: center;
  color: $text-primary;
  padding: $spacing-xl;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1));
  border-radius: $radius-lg;
  border: 1px solid rgba(100, 255, 218, 0.2);

  .quote-icon-left,
  .quote-icon-right {
    color: $color-accent;
    font-size: 1.5rem;
    vertical-align: middle;
  }
}
</style>
