<template>
  <footer class="footer">
    <div class="container">
      <div class="footer-content">
        <div class="copyright">
          &copy; Copyright <strong><span>Victor Nico Djiembou Tientcheu</span></strong>
        </div>
<!--        <div class="credits">-->
<!--          Designed by-->
<!--          <a href="https://github.com/VictorNico/" target="_blank" rel="noopener noreferrer">-->
<!--            Victor Djiembou-->
<!--          </a>-->
<!--          <span class="separator">|</span>-->
<!--          Built with <span class="tech-stack">Vue 3 + Vite</span>-->
<!--        </div>-->
      </div>
    </div>
  </footer>
</template>

<script setup>
// No additional logic needed for now
</script>

<style lang="scss" scoped>
@import '../../assets/styles/variables.scss';

.footer {
  background: $bg-card;
  border-top: 1px solid rgba(100, 255, 218, 0.1);
  padding: $spacing-xl 0;
  margin-top: $spacing-3xl;
}

.footer-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: $spacing-md;
  text-align: center;

  @media (min-width: $breakpoint-md) {
    flex-direction: row;
    justify-content: space-between;
  }
}

.copyright {
  color: $text-secondary;
  font-size: 0.9rem;

  span {
    color: $color-secondary;
    font-family: $font-mono;
  }
}

.credits {
  color: $text-secondary;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: $spacing-sm;
  flex-wrap: wrap;
  justify-content: center;

  a {
    color: $color-secondary;
    font-family: $font-mono;
    transition: all $transition-fast;

    &:hover {
      color: $color-accent;
      text-shadow: 0 0 10px rgba(100, 255, 218, 0.5);
    }
  }

  .separator {
    color: $text-secondary;
    opacity: 0.5;
  }

  .tech-stack {
    color: $color-accent;
    font-family: $font-mono;
    font-weight: 600;
  }
}
</style>
