<template>
  <div class="language-switcher">
    <button
      v-for="lang in availableLocales"
      :key="lang.code"
      class="lang-btn"
      :class="{ active: locale === lang.code }"
      @click="changeLocale(lang.code)"
      :title="lang.name"
    >
      <span class="flag">{{ lang.flag }}</span>
      <span class="code">{{ lang.code.toUpperCase() }}</span>
    </button>
  </div>
</template>

<script setup>
import { useLocale } from '../../composables/useLocale'

const { locale, changeLocale, availableLocales } = useLocale()
</script>

<style lang="scss" scoped>

.language-switcher {
  display: flex;
  gap: $spacing-sm;
  align-items: center;
}

.lang-btn {
  display: flex;
  align-items: center;
  gap: $spacing-xs;
  padding: $spacing-sm $spacing-md;
  background: rgba(100, 255, 218, 0.1);
  border: 1px solid rgba(100, 255, 218, 0.2);
  border-radius: $radius-md;
  color: $text-secondary;
  cursor: pointer;
  transition: all $transition-fast;
  font-family: $font-mono;
  font-size: 0.85rem;

  &:hover {
    background: rgba(100, 255, 218, 0.2);
    border-color: $color-secondary;
    color: $color-secondary;
    transform: translateY(-2px);
  }

  &.active {
    background: $color-secondary;
    border-color: $color-secondary;
    color: $bg-dark;
    font-weight: 600;
    box-shadow: $shadow-glow;
  }

  .flag {
    font-size: 1.2rem;
  }

  .code {
    font-weight: 600;
  }
}
</style>
