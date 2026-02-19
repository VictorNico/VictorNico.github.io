<template>
  <section id="publications" class="publications section">
    <div class="container">
      <div class="section-title">
        <h2 class="gradient-text">{{ t('publications.title') }}</h2>
        <p class="section-description">{{ getTranslated(publicationsData?.intro) }}</p>
      </div>

      <div class="publications-list" v-if="publicationsData?.publications?.length">
        <div
          v-for="pub in publicationsData.publications"
          :key="pub.id"
          class="publication-card"
          :class="`status-${pub.status}`"
        >
          <div class="pub-status-badge" v-if="pub.status === 'under-review'">
            <i class="bx bx-time"></i>
            <span>{{ locale === 'fr' ? 'En révision' : 'Under Review' }}</span>
          </div>

          <div class="pub-header">
            <h3 class="pub-title">{{ getTranslated(pub.title) }}</h3>
            <span class="pub-year">{{ pub.year }}</span>
          </div>

          <div class="pub-authors">
            <i class="bx bx-user"></i>
            <span>{{ pub.authors.join(', ') }}</span>
          </div>

          <div class="pub-journal">
            <i class="bx bx-book-open"></i>
            <span>{{ t('publications.published') }} <strong>{{ pub.journal }}</strong>{{ pub.volume ? ` ${pub.volume}` : '' }}{{ pub.pages ? `, pp. ${pub.pages}` : '' }}</span>
          </div>

          <p class="pub-abstract">{{ getTranslated(pub.abstract) }}</p>

          <div v-if="pub.note" class="pub-note">
            <i class="bx bx-info-circle"></i>
            <span>{{ getTranslated(pub.note) }}</span>
          </div>

          <div v-if="pub.achievement" class="pub-achievement">
            <i class="bx bx-trophy"></i>
            <span>{{ getTranslated(pub.achievement) }}</span>
          </div>

          <div v-if="pub.keyContributions" class="pub-contributions">
            <h4>{{ locale === 'fr' ? 'Contributions clés :' : 'Key Contributions:' }}</h4>
            <ul>
              <li v-for="(contrib, idx) in getTranslated(pub.keyContributions)" :key="idx">
                {{ typeof contrib === 'string' ? contrib : contrib }}
              </li>
            </ul>
          </div>

          <div class="pub-tags">
            <span v-for="tag in pub.tags" :key="tag" class="tag">
              {{ tag }}
            </span>
          </div>

          <div class="pub-actions">
            <a v-if="pub.doi" :href="`https://doi.org/${pub.doi}`" target="_blank" class="btn-action" :aria-label="`DOI – ${getTranslated(pub.title)}`">
              <i class="bx bx-link-external"></i>
              DOI
            </a>
            <a v-if="pub.url" :href="pub.url" target="_blank" class="btn-action" :aria-label="`${t('publications.readMore')} – ${getTranslated(pub.title)}`">
              <i class="bx bx-link-external"></i>
              {{ t('publications.readMore') }}
            </a>
            <a v-if="pub.pdfUrl" :href="pub.pdfUrl" target="_blank" class="btn-action">
              <i class="bx bx-download"></i>
              {{ t('publications.download') }}
            </a>
          </div>
        </div>
      </div>

      <div v-else class="no-data">
        <i class="bx bx-book-bookmark"></i>
        <p>{{ locale === 'fr' ? 'Aucune publication pour le moment.' : 'No publications yet.' }}</p>
      </div>
    </div>
  </section>
</template>

<script setup>
import { useDataLoader } from '../../composables/useDataLoader'
import { useI18n } from 'vue-i18n'
import { useI18nData } from '../../composables/useI18nData'

const { data: publicationsData } = useDataLoader('publications.i18n')
const { t, locale } = useI18n()
const { getTranslated } = useI18nData()
</script>

<style lang="scss" scoped>

.publications {
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

.publications-list {
  display: flex;
  flex-direction: column;
  gap: $spacing-xl;
}

.publication-card {
  background: $bg-card;
  border: 1px solid rgba(100, 255, 218, 0.1);
  border-radius: $radius-lg;
  padding: $spacing-2xl;
  transition: all $transition-normal;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 4px;
    height: 100%;
    background: linear-gradient(to bottom, $color-secondary, $color-accent);
    border-radius: $radius-lg 0 0 $radius-lg;
    transform: scaleY(0);
    transition: transform $transition-normal;
  }

  &.status-under-review {
    border-color: rgba(251, 191, 36, 0.3);
  }

  &:hover {
    transform: translateX(10px);
    border-color: $color-secondary;
    box-shadow: $shadow-glow;

    &::before {
      transform: scaleY(1);
    }
  }
}

.pub-status-badge {
  display: inline-flex;
  align-items: center;
  gap: $spacing-xs;
  background: rgba(251, 191, 36, 0.1);
  border: 1px solid rgba(251, 191, 36, 0.3);
  color: #fbbf24;
  padding: $spacing-xs $spacing-md;
  border-radius: $radius-full;
  font-size: 0.85rem;
  font-family: $font-mono;
  margin-bottom: $spacing-md;

  i {
    font-size: 1rem;
  }
}

.pub-note,
.pub-achievement {
  display: flex;
  align-items: start;
  gap: $spacing-sm;
  padding: $spacing-md;
  border-radius: $radius-md;
  margin: $spacing-md 0;
  font-size: 0.9rem;
  line-height: 1.6;

  i {
    font-size: 1.2rem;
    margin-top: 2px;
  }
}

.pub-note {
  background: rgba(59, 130, 246, 0.1);
  border-left: 3px solid #3b82f6;
  color: $text-secondary;

  i {
    color: #3b82f6;
  }
}

.pub-achievement {
  background: rgba(251, 191, 36, 0.1);
  border-left: 3px solid #fbbf24;
  color: $text-secondary;

  i {
    color: #fbbf24;
  }
}

.pub-contributions {
  margin: $spacing-lg 0;
  padding: $spacing-lg;
  background: rgba(100, 255, 218, 0.05);
  border-radius: $radius-md;
  border: 1px solid rgba(100, 255, 218, 0.1);

  h4 {
    color: $color-secondary;
    font-size: 1rem;
    margin-bottom: $spacing-md;
    font-family: $font-heading;
  }

  ul {
    list-style: none;
    padding: 0;
    margin: 0;

    li {
      color: $text-secondary;
      padding-left: $spacing-lg;
      margin-bottom: $spacing-sm;
      position: relative;
      line-height: 1.6;

      &::before {
        content: '▸';
        position: absolute;
        left: 0;
        color: $color-secondary;
        font-weight: bold;
      }

      &:last-child {
        margin-bottom: 0;
      }
    }
  }
}

.pub-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: $spacing-md;
  margin-bottom: $spacing-md;
  flex-wrap: wrap;
}

.pub-title {
  flex: 1;
  font-size: 1.4rem;
  color: $text-primary;
  font-family: $font-heading;
  line-height: 1.4;
}

.pub-year {
  background: $color-accent;
  color: $bg-dark;
  padding: $spacing-xs $spacing-md;
  border-radius: $radius-full;
  font-family: $font-mono;
  font-weight: 700;
  font-size: 0.9rem;
}

.pub-authors,
.pub-journal {
  display: flex;
  align-items: center;
  gap: $spacing-sm;
  color: $text-secondary;
  margin-bottom: $spacing-sm;
  font-size: 0.95rem;

  i {
    color: $color-secondary;
    font-size: 1.1rem;
  }

  strong {
    color: $text-primary;
  }
}

.pub-abstract {
  color: $text-secondary;
  line-height: 1.7;
  margin: $spacing-lg 0;
  font-style: italic;
}

.pub-tags {
  display: flex;
  flex-wrap: wrap;
  gap: $spacing-sm;
  margin-bottom: $spacing-lg;
}

.tag {
  background: rgba(100, 255, 218, 0.1);
  color: $color-secondary;
  padding: $spacing-xs $spacing-md;
  border-radius: $radius-full;
  font-size: 0.85rem;
  font-family: $font-mono;
  border: 1px solid rgba(100, 255, 218, 0.2);
  transition: all $transition-fast;

  &:hover {
    background: rgba(100, 255, 218, 0.2);
    border-color: $color-secondary;
  }
}

.pub-actions {
  display: flex;
  gap: $spacing-md;
  flex-wrap: wrap;
}

.btn-action {
  display: flex;
  align-items: center;
  gap: $spacing-sm;
  padding: $spacing-sm $spacing-lg;
  background: rgba(100, 255, 218, 0.1);
  border: 1px solid $color-secondary;
  border-radius: $radius-md;
  color: $color-secondary;
  font-family: $font-mono;
  font-size: 0.9rem;
  font-weight: 600;
  transition: all $transition-fast;

  i {
    font-size: 1.1rem;
  }

  &:hover {
    background: $color-secondary;
    color: $bg-dark;
    transform: translateY(-2px);
    box-shadow: $shadow-glow;
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
