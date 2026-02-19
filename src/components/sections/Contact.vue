<template>
  <section id="contact" class="contact section">
    <div class="container">
      <div class="section-title">
        <h2 class="gradient-text">{{ t('contact.title') }}</h2>
        <p class="section-description">
          {{ t('contact.intro') }}
        </p>
      </div>

      <div class="contact-content">
        <div class="contact-info">
          <div class="info-card">
            <i class="bx bx-map"></i>
            <h4>{{ t('contact.location') }}</h4>
            <p>{{ profile?.personal?.location?.address }}</p>
            <p>{{ profile?.personal?.location?.city }}, {{ profile?.personal?.location?.country }}</p>
          </div>

          <div class="info-card">
            <i class="bx bx-envelope"></i>
            <h4>{{ t('contact.email') }}</h4>
            <a
              v-for="email in profile?.personal?.contacts?.emails"
              :key="email"
              :href="`mailto:${email}`"
            >
              {{ email }}
            </a>
          </div>

          <div class="info-card">
            <i class="bx bx-phone"></i>
            <h4>{{ t('contact.call') }}</h4>
            <a
              v-for="phone in profile?.personal?.contacts?.phones"
              :key="phone"
              :href="`tel:${phone.replace(/\s/g, '')}`"
            >
              {{ phone }}
            </a>
          </div>

          <div class="map-container">
            <iframe
              :src="`https://www.google.com/maps/embed/v1/place?q=place_id:ChIJr0HlhJHPixAR44u_g8K2t4A&key=AIzaSyBZKolxiadm2uMJnUrCyxKapWyy3wPyf-I`"
              width="100%"
              height="290"
              style="border:0;"
              allowfullscreen=""
              loading="lazy"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { useDataLoader } from '../../composables/useDataLoader'
import { useI18n } from 'vue-i18n'

const { data: profile } = useDataLoader('profile.i18n')
const { t } = useI18n()
</script>

<style lang="scss" scoped>
@import '../../assets/styles/variables.scss';

.contact {
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

.contact-content {
  max-width: 900px;
  margin: 0 auto;
}

.contact-info {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: $spacing-xl;
  margin-bottom: $spacing-2xl;
}

.info-card {
  background: $bg-dark;
  border: 1px solid rgba(100, 255, 218, 0.1);
  border-radius: $radius-lg;
  padding: $spacing-xl;
  text-align: center;
  transition: all $transition-normal;

  &:hover {
    transform: translateY(-5px);
    border-color: $color-secondary;
    box-shadow: $shadow-glow;

    i {
      transform: scale(1.2) rotate(10deg);
    }
  }

  i {
    font-size: 2.5rem;
    color: $color-secondary;
    margin-bottom: $spacing-md;
    transition: transform $transition-normal;
  }

  h4 {
    font-size: 1.2rem;
    color: $text-primary;
    margin-bottom: $spacing-md;
    font-family: $font-heading;
  }

  p, a {
    color: $text-secondary;
    display: block;
    margin-bottom: $spacing-xs;
    transition: color $transition-fast;
  }

  a:hover {
    color: $color-accent;
  }
}

.map-container {
  grid-column: 1 / -1;
  border-radius: $radius-lg;
  overflow: hidden;
  border: 2px solid rgba(100, 255, 218, 0.2);
  box-shadow: $shadow-lg;

  iframe {
    display: block;
    filter: grayscale(1) invert(1) contrast(0.9);
  }
}
</style>
