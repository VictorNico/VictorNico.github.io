<template>
  <Teleport to="body">
    <Transition name="cv-modal">
      <div v-if="isOpen" class="cv-modal-backdrop" @click.self="close" role="dialog" aria-modal="true" :aria-label="t('cv.title')">
        <div class="cv-modal-container">
          <div class="cv-modal-header">
            <button class="cv-modal-btn cv-modal-close" @click="close" :aria-label="t('cv.close')">
              <i class="bx bx-x"></i>
              <span>{{ t('cv.close') }}</span>
            </button>
            <h2 class="cv-modal-title">{{ selectedCV?.title ? getTranslated(selectedCV.title) : t('cv.title') }}</h2>
            <a
              v-if="selectedCV?.path"
              :href="selectedCV.path"
              download
              class="cv-modal-btn cv-modal-download"
              :aria-label="t('cv.download')"
            >
              <i class="bx bx-download"></i>
              <span>{{ t('cv.download') }}</span>
            </a>
          </div>

          <div class="cv-modal-body">
            <div v-if="isMobile" class="cv-mobile-fallback">
              <i class="bx bx-file-blank cv-file-icon"></i>
              <p>{{ t('cv.notSupported') }}</p>
              <a v-if="selectedCV?.path" :href="selectedCV.path" target="_blank" rel="noopener noreferrer" class="cv-open-link">
                <i class="bx bx-link-external"></i>
                {{ t('cv.openNewTab') }}
              </a>
            </div>
            <template v-else>
              <iframe
                v-if="selectedCV?.path"
                :src="`${selectedCV.path}#toolbar=1`"
                type="application/pdf"
                class="cv-iframe"
                :title="selectedCV?.title ? getTranslated(selectedCV.title) : t('cv.title')"
                @error="onIframeError"
              ></iframe>
              <div v-if="iframeError" class="cv-mobile-fallback">
                <i class="bx bx-file-blank cv-file-icon"></i>
                <p>{{ t('cv.notSupported') }}</p>
                <a v-if="selectedCV?.path" :href="selectedCV.path" target="_blank" rel="noopener noreferrer" class="cv-open-link">
                  <i class="bx bx-link-external"></i>
                  {{ t('cv.openNewTab') }}
                </a>
              </div>
            </template>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, computed, watch, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useCVModal } from '../../composables/useCVModal'
import { useI18nData } from '../../composables/useI18nData'

const { isOpen, selectedCV, close } = useCVModal()
const { t } = useI18n()
const { getTranslated } = useI18nData()

const iframeError = ref(false)
const isMobile = computed(() => window.innerWidth < 768)

const onIframeError = () => {
  iframeError.value = true
}

const handleKeydown = (e) => {
  if (e.key === 'Escape' && isOpen.value) {
    close()
  }
}

watch(isOpen, (val) => {
  if (val) {
    iframeError.value = false
    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', handleKeydown)
  } else {
    document.body.style.overflow = ''
    document.removeEventListener('keydown', handleKeydown)
  }
})

onUnmounted(() => {
  document.body.style.overflow = ''
  document.removeEventListener('keydown', handleKeydown)
})
</script>

<style lang="scss" scoped>
.cv-modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 2000;
  background: rgba(0, 0, 0, 0.75);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: $spacing-lg;
}

.cv-modal-container {
  width: 90vw;
  height: 90vh;
  max-width: 1100px;
  background: $bg-card;
  border: 1px solid $color-secondary;
  border-radius: $radius-lg;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 0 60px rgba(100, 255, 218, 0.15);
}

.cv-modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: $spacing-md $spacing-lg;
  border-bottom: 1px solid rgba(100, 255, 218, 0.1);
  flex-shrink: 0;
  gap: $spacing-md;
}

.cv-modal-title {
  font-family: $font-heading;
  font-size: 1.1rem;
  color: $color-secondary;
  margin: 0;
  flex: 1;
  text-align: center;
}

.cv-modal-btn {
  display: inline-flex;
  align-items: center;
  gap: $spacing-xs;
  padding: $spacing-sm $spacing-md;
  border-radius: $radius-md;
  font-family: $font-mono;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all $transition-fast;
  text-decoration: none;
  white-space: nowrap;

  i {
    font-size: 1.1rem;
  }

  &.cv-modal-close {
    background: transparent;
    border: 1px solid rgba(100, 255, 218, 0.3);
    color: $text-secondary;

    &:hover {
      border-color: $color-secondary;
      color: $color-secondary;
    }
  }

  &.cv-modal-download {
    background: $color-secondary;
    border: 1px solid $color-secondary;
    color: $bg-dark;

    &:hover {
      background: $color-accent;
      border-color: $color-accent;
      box-shadow: 0 0 20px rgba(0, 217, 255, 0.3);
    }
  }
}

.cv-modal-body {
  flex: 1;
  overflow: hidden;
  position: relative;
}

.cv-iframe {
  width: 100%;
  height: 100%;
  border: none;
  display: block;
}

.cv-mobile-fallback {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  gap: $spacing-lg;
  padding: $spacing-2xl;
  text-align: center;
  color: $text-secondary;

  .cv-file-icon {
    font-size: 4rem;
    color: $color-secondary;
    opacity: 0.6;
  }

  p {
    font-size: 1rem;
    max-width: 320px;
  }
}

.cv-open-link {
  display: inline-flex;
  align-items: center;
  gap: $spacing-sm;
  padding: $spacing-sm $spacing-lg;
  background: $color-secondary;
  color: $bg-dark;
  border-radius: $radius-md;
  font-family: $font-mono;
  font-size: 0.9rem;
  font-weight: 600;
  text-decoration: none;
  transition: all $transition-fast;

  &:hover {
    background: $color-accent;
    box-shadow: 0 0 20px rgba(0, 217, 255, 0.3);
  }
}

// Transitions
.cv-modal-enter-active {
  transition: opacity 0.25s ease;

  .cv-modal-container {
    transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.25s ease;
  }
}

.cv-modal-leave-active {
  transition: opacity 0.2s ease;

  .cv-modal-container {
    transition: transform 0.2s ease, opacity 0.2s ease;
  }
}

.cv-modal-enter-from {
  opacity: 0;

  .cv-modal-container {
    transform: translateY(30px);
    opacity: 0;
  }
}

.cv-modal-leave-to {
  opacity: 0;

  .cv-modal-container {
    transform: translateY(20px);
    opacity: 0;
  }
}

@media (max-width: 767px) {
  .cv-modal-backdrop {
    padding: 0;
    align-items: flex-end;
  }

  .cv-modal-container {
    width: 100vw;
    height: 95vh;
    border-radius: $radius-lg $radius-lg 0 0;
  }

  .cv-modal-btn span {
    display: none;
  }

  .cv-modal-btn {
    padding: $spacing-sm;

    i {
      font-size: 1.3rem;
    }
  }
}
</style>
