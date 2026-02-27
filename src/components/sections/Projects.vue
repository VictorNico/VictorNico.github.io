<template>
  <section id="projects" class="projects section">
    <div class="container">
      <div class="section-title">
        <h2 class="gradient-text">{{ t('projects.title') }}</h2>
        <p class="section-description">{{ getTranslated(projectsData?.intro) }}</p>
      </div>

      <!-- Category filters -->
      <div class="filters">
        <button
          v-for="cat in categories"
          :key="cat.id"
          class="filter-btn"
          :class="{ active: activeFilter === cat.id }"
          @click="activeFilter = cat.id"
        >
          {{ getTranslated({ en: cat.en, fr: cat.fr }) }}
        </button>
      </div>

      <!-- Projects grid -->
      <div class="projects-grid">
        <div
          v-for="project in filteredProjects"
          :key="project.id"
          class="project-card"
          :class="{ featured: project.featured }"
          :style="{ '--project-color': project.color }"
        >
          <div class="card-header">
            <div class="project-icon">
              <i :class="['bi', project.icon]"></i>
            </div>
            <div class="card-badges">
              <span v-if="project.featured" class="badge badge-featured">
                {{ t('projects.featured') }}
              </span>
              <span class="badge badge-category">
                {{ project.category }}
              </span>
            </div>
          </div>

          <h3 class="project-title">{{ getTranslated(project.title) }}</h3>
          <p class="project-description">{{ getTranslated(project.description) }}</p>

          <!-- Highlights -->
          <ul class="highlights" v-if="getTranslatedArray(project.highlights)?.length">
            <li v-for="(h, i) in getTranslatedArray(project.highlights)" :key="i">
              <i class="bi bi-check2-circle"></i>
              {{ h }}
            </li>
          </ul>

          <!-- Competencies: Theory / Methods / Tools -->
          <div class="competencies">
            <div class="comp-row" v-if="getTranslatedArray(project.concepts?.theoretical)?.length">
              <span class="comp-label comp-label--theory">
                <i class="bi bi-lightbulb"></i>
                {{ t('projects.theory') }}
              </span>
              <span
                v-for="c in getTranslatedArray(project.concepts.theoretical)"
                :key="c"
                class="comp-tag comp-tag--theory"
              >{{ c }}</span>
            </div>
            <div class="comp-row" v-if="getTranslatedArray(project.concepts?.methods)?.length">
              <span class="comp-label comp-label--method">
                <i class="bi bi-eyedropper"></i>
                {{ t('projects.methods') }}
              </span>
              <span
                v-for="m in getTranslatedArray(project.concepts.methods)"
                :key="m"
                class="comp-tag comp-tag--method"
              >{{ m }}</span>
            </div>
            <div class="comp-row" v-if="project.stack?.length">
              <span class="comp-label comp-label--tool">
                <i class="bi bi-cpu"></i>
                {{ t('projects.tools') }}
              </span>
              <span
                v-for="tech in project.stack"
                :key="tech"
                class="comp-tag comp-tag--tool"
              >{{ tech }}</span>
            </div>
          </div>

          <!-- Links -->
          <div class="project-links">
            <a
              v-if="project.github"
              :href="project.github"
              target="_blank"
              rel="noopener noreferrer"
              class="link-btn link-github"
            >
              <i class="bx bxl-github"></i>
              {{ t('projects.code') }}
            </a>
            <a
              v-if="project.paper"
              :href="project.paper"
              target="_blank"
              rel="noopener noreferrer"
              class="link-btn link-paper"
            >
              <i class="bi bi-box-arrow-up-right"></i>
              {{ t('projects.paper') }}
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useDataLoader } from '../../composables/useDataLoader'
import { useI18n } from 'vue-i18n'
import { useI18nData } from '../../composables/useI18nData'

const { data: projectsData } = useDataLoader('projects.i18n')
const { t } = useI18n()
const { getTranslated, getTranslatedArray } = useI18nData()

const activeFilter = ref('all')

const categories = computed(() => projectsData.value?.categories ?? [])

const filteredProjects = computed(() => {
  const all = projectsData.value?.projects ?? []
  if (activeFilter.value === 'all') return all
  return all.filter(p => p.category === activeFilter.value)
})
</script>

<style lang="scss" scoped>

.projects {
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

.filters {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: $spacing-sm;
  margin-bottom: $spacing-3xl;
}

.filter-btn {
  padding: $spacing-sm $spacing-xl;
  background: transparent;
  border: 1px solid rgba(100, 255, 218, 0.3);
  border-radius: $radius-full;
  color: $text-secondary;
  font-family: $font-mono;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all $transition-fast;

  &:hover {
    border-color: $color-secondary;
    color: $color-secondary;
  }

  &.active {
    background: rgba(100, 255, 218, 0.1);
    border-color: $color-secondary;
    color: $color-secondary;
    font-weight: 600;
  }
}

.projects-grid {
  display: grid;
  gap: $spacing-xl;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));

  @media (min-width: $breakpoint-lg) {
    grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
  }
}

.project-card {
  background: $bg-card;
  border: 1px solid rgba(100, 255, 218, 0.1);
  border-radius: $radius-lg;
  padding: $spacing-xl;
  display: flex;
  flex-direction: column;
  gap: $spacing-md;
  transition: all $transition-normal;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: var(--project-color, $color-secondary);
    transform: scaleX(0);
    transform-origin: left;
    transition: transform $transition-normal;
  }

  &:hover {
    transform: translateY(-6px);
    border-color: var(--project-color, $color-secondary);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.3);

    &::before {
      transform: scaleX(1);
    }
  }

  &.featured {
    border-color: rgba(100, 255, 218, 0.25);
  }
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.project-icon {
  width: 48px;
  height: 48px;
  border-radius: $radius-md;
  background: var(--project-color, $color-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  color: $bg-dark;
  font-size: 1.4rem;
  flex-shrink: 0;
}

.card-badges {
  display: flex;
  gap: $spacing-xs;
  flex-wrap: wrap;
  justify-content: flex-end;
}

.badge {
  padding: 2px 10px;
  border-radius: $radius-full;
  font-size: 0.75rem;
  font-family: $font-mono;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;

  &-featured {
    background: rgba(100, 255, 218, 0.15);
    color: $color-secondary;
    border: 1px solid rgba(100, 255, 218, 0.4);
  }

  &-category {
    background: rgba(255, 255, 255, 0.05);
    color: $text-secondary;
    border: 1px solid rgba(255, 255, 255, 0.1);
  }
}

.project-title {
  font-size: 1.15rem;
  font-family: $font-heading;
  color: $text-primary;
  line-height: 1.4;
}

.project-description {
  font-size: 0.95rem;
  color: $text-secondary;
  line-height: 1.7;
  flex: 1;
}

.highlights {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: $spacing-xs;

  li {
    display: flex;
    align-items: flex-start;
    gap: $spacing-sm;
    font-size: 0.9rem;
    color: $text-secondary;

    i {
      color: var(--project-color, $color-secondary);
      font-size: 1rem;
      flex-shrink: 0;
      margin-top: 2px;
    }
  }
}

.competencies {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding-top: $spacing-sm;
  border-top: 1px solid rgba(100, 255, 218, 0.08);
}

.comp-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 5px;
}

.comp-label {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  font-family: $font-mono;
  font-size: 0.65rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  white-space: nowrap;
  flex-shrink: 0;
  padding: 2px 6px 2px 0;

  &--theory { color: #A78BFA; }
  &--method  { color: #FCD34D; }
  &--tool    { color: $color-secondary; }
}

.comp-tag {
  padding: 2px 8px;
  border-radius: $radius-full;
  font-size: 0.72rem;
  font-family: $font-mono;
  line-height: 1.6;

  &--theory {
    background: rgba(139, 92, 246, 0.1);
    border: 1px solid rgba(139, 92, 246, 0.25);
    color: #C4B5FD;
  }

  &--method {
    background: rgba(245, 158, 11, 0.1);
    border: 1px solid rgba(245, 158, 11, 0.25);
    color: #FDE68A;
  }

  &--tool {
    background: rgba(100, 255, 218, 0.06);
    border: 1px solid rgba(100, 255, 218, 0.2);
    color: $text-secondary;
  }
}

.project-links {
  display: flex;
  gap: $spacing-sm;
  margin-top: auto;
  padding-top: $spacing-sm;
  border-top: 1px solid rgba(100, 255, 218, 0.1);
}

.link-btn {
  display: flex;
  align-items: center;
  gap: $spacing-xs;
  padding: $spacing-sm $spacing-md;
  border-radius: $radius-md;
  font-size: 0.85rem;
  font-family: $font-mono;
  font-weight: 600;
  text-decoration: none;
  transition: all $transition-fast;

  i {
    font-size: 1rem;
  }

  &.link-github {
    background: rgba(100, 255, 218, 0.08);
    color: $color-secondary;
    border: 1px solid rgba(100, 255, 218, 0.3);

    &:hover {
      background: $color-secondary;
      color: $bg-dark;
    }
  }

  &.link-paper {
    background: rgba(0, 217, 255, 0.08);
    color: $color-accent;
    border: 1px solid rgba(0, 217, 255, 0.3);

    &:hover {
      background: $color-accent;
      color: $bg-dark;
    }
  }
}
</style>