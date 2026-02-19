<template>
  <section id="awards" class="awards section">
    <div class="container">
      <div class="section-title">
        <h2 class="gradient-text">{{ t('awards.title') }}</h2>
        <p class="section-description">{{ getTranslated(awardsData?.intro) }}</p>
      </div>

      <div class="awards-grid">
        <!-- Awards -->
        <div v-if="awardsData?.awards?.length" class="awards-section">
          <h3 class="subsection-title">
            <i class="bx bx-trophy"></i>
            {{ locale === 'fr' ? 'Prix & Distinctions' : 'Awards & Honors' }}
          </h3>

          <div class="items-list">
            <div
              v-for="award in awardsData.awards"
              :key="award.id"
              class="award-card"
              :style="{ '--award-color': award.color }"
            >
              <div class="award-icon">
                <i :class="award.icon"></i>
              </div>

              <div class="award-content">
                <h4 class="award-title">{{ getTranslated(award.title) }}</h4>
                <p class="award-issuer">
                  <i class="bx bx-building"></i>
                  {{ award.issuer }}
                </p>
                <p class="award-date">
                  <i class="bx bx-calendar"></i>
                  {{ formatDate(award.date) }}
                </p>
                <p class="award-description">{{ getTranslated(award.description) }}</p>

                <div v-if="award.achievement" class="award-achievement">
                  <i class="bx bx-star"></i>
                  <span>{{ getTranslated(award.achievement) }}</span>
                </div>

                <a
                  v-if="award.certificateUrl"
                  :href="award.certificateUrl"
                  target="_blank"
                  class="btn-certificate"
                >
                  <i class="bx bx-link-external"></i>
                  {{ t('awards.viewCertificate') }}
                </a>
              </div>
            </div>
          </div>
        </div>

        <!-- Certificates -->
        <div v-if="awardsData?.certificates?.length" class="certificates-section">
          <h3 class="subsection-title">
            <i class="bx bx-award"></i>
            {{ locale === 'fr' ? 'Certificats' : 'Certificates' }}
          </h3>

          <div class="items-list">
            <div
              v-for="cert in awardsData.certificates"
              :key="cert.id"
              class="award-card"
              :style="{ '--award-color': cert.color }"
            >
              <div class="award-icon">
                <i :class="cert.icon"></i>
              </div>

              <div class="award-content">
                <h4 class="award-title">{{ getTranslated(cert.title) }}</h4>
                <p class="award-issuer">
                  <i class="bx bx-building"></i>
                  {{ cert.issuer }}
                </p>
                <p class="award-date">
                  <i class="bx bx-calendar"></i>
                  {{ formatDate(cert.date) }}
                </p>
                <p v-if="cert.gpa" class="cert-gpa">
                  <i class="bx bx-trending-up"></i>
                  GPA: {{ cert.gpa }}
                </p>
                <p v-if="cert.credentialId" class="credential-id">
                  <i class="bx bx-id-card"></i>
                  ID: {{ cert.credentialId }}
                </p>
                <p v-if="cert.description" class="cert-description">{{ getTranslated(cert.description) }}</p>

                <a
                  v-if="cert.certificateUrl"
                  :href="cert.certificateUrl"
                  target="_blank"
                  class="btn-certificate"
                >
                  <i class="bx bx-link-external"></i>
                  {{ t('awards.viewCertificate') }}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="!awardsData?.awards?.length && !awardsData?.certificates?.length" class="no-data">
        <i class="bx bx-award"></i>
        <p>{{ locale === 'fr' ? 'Aucune distinction pour le moment.' : 'No awards or certificates yet.' }}</p>
      </div>
    </div>
  </section>
</template>

<script setup>
import { useDataLoader } from '../../composables/useDataLoader'
import { useI18n } from 'vue-i18n'
import { useI18nData } from '../../composables/useI18nData'

const { data: awardsData } = useDataLoader('awards.i18n')
const { t, locale } = useI18n()
const { getTranslated } = useI18nData()

const formatDate = (dateString) => {
  if (!dateString) return ''
  // Handle year-only format
  if (dateString.length === 4) return dateString
  const date = new Date(dateString)
  return date.toLocaleDateString(locale.value === 'fr' ? 'fr-FR' : 'en-US', {
    month: 'long',
    year: 'numeric'
  })
}
</script>

<style lang="scss" scoped>
@import '../../assets/styles/variables.scss';

.awards {
  background: $bg-card;
}

.section-title {
  text-align: center;
  margin-bottom: $spacing-3xl;

  h2 {
    font-size: clamp(2rem, 5vw, 3rem);
    margin-bottom: $spacing-lg;
  }
}

.awards-grid {
  display: grid;
  gap: $spacing-3xl;
}

.subsection-title {
  display: flex;
  align-items: center;
  gap: $spacing-md;
  font-size: 1.8rem;
  color: $color-secondary;
  margin-bottom: $spacing-xl;
  font-family: $font-heading;

  i {
    font-size: 2rem;
  }
}

.items-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: $spacing-xl;
}

.award-card {
  background: $bg-dark;
  border: 1px solid rgba(100, 255, 218, 0.1);
  border-radius: $radius-lg;
  padding: $spacing-xl;
  display: flex;
  gap: $spacing-lg;
  transition: all $transition-normal;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    width: 100px;
    height: 100px;
    background: var(--award-color, $color-secondary);
    opacity: 0.05;
    border-radius: 50%;
    transform: translate(40%, -40%);
  }

  &:hover {
    transform: translateY(-5px);
    border-color: var(--award-color, $color-secondary);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);

    .award-icon {
      transform: scale(1.1) rotate(5deg);
      background: var(--award-color, $color-secondary);
      color: white;
    }
  }
}

.award-icon {
  width: 60px;
  height: 60px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(100, 255, 218, 0.1);
  border-radius: $radius-lg;
  font-size: 2rem;
  color: var(--award-color, $color-secondary);
  transition: all $transition-normal;
}

.award-content {
  flex: 1;
}

.award-title {
  font-size: 1.2rem;
  color: $text-primary;
  margin-bottom: $spacing-sm;
  font-family: $font-heading;
  line-height: 1.3;
}

.award-issuer,
.award-date,
.credential-id {
  display: flex;
  align-items: center;
  gap: $spacing-sm;
  color: $text-secondary;
  font-size: 0.9rem;
  margin-bottom: $spacing-xs;

  i {
    color: var(--award-color, $color-secondary);
  }
}

.award-description {
  color: $text-secondary;
  line-height: 1.6;
  margin: $spacing-md 0;
  font-size: 0.95rem;
}

.btn-certificate {
  display: inline-flex;
  align-items: center;
  gap: $spacing-sm;
  padding: $spacing-sm $spacing-lg;
  background: rgba(100, 255, 218, 0.1);
  border: 1px solid var(--award-color, $color-secondary);
  border-radius: $radius-md;
  color: var(--award-color, $color-secondary);
  font-family: $font-mono;
  font-size: 0.85rem;
  font-weight: 600;
  transition: all $transition-fast;
  margin-top: $spacing-sm;

  i {
    font-size: 1rem;
  }

  &:hover {
    background: var(--award-color, $color-secondary);
    color: white;
    transform: translateX(5px);
  }
}

.no-data {
  text-align: center;
  padding: $spacing-3xl;
  color: $text-secondary;

  i {
    font-size: 4rem;
    color: rgba(100, 255, 218, 0.3);
    margin-bottom: $spacing-lg;
  }

  p {
    font-size: 1.1rem;
  }
}
</style>
