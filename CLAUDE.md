# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository

GitHub User Page: `VictorNico/VictorNico.github.io` → deployed at `https://victornico.github.io/`
The old vanilla HTML/JS portfolio is archived in `old/`.

## Commands

```bash
npm run dev       # Start dev server at http://localhost:5173
npm run build     # Production build → dist/
npm run preview   # Preview production build at http://localhost:4173
```

No linter or test runner is configured. Always use `npm run preview` (not `dist/index.html` directly) to test the production build — the service worker and absolute asset paths require a proper HTTP server.

## Architecture

**Stack:** Vue 3 (Composition API) + Vite + SCSS + vue-i18n + vite-plugin-pwa

### Data-driven content

All portfolio content lives in `public/data/` as `.i18n.json` files fetched at runtime via `useDataLoader`. The non-i18n `*.json` files no longer exist — all components must use `.i18n` endpoints (e.g. `useDataLoader('profile.i18n')`).

Content text uses a multilingual format `{ "en": "...", "fr": "..." }` extracted per locale via `useI18nData.getTranslated()`.

### Composables (`src/composables/`)

| File | Purpose |
|------|---------|
| `useDataLoader.js` | Async fetch from `/data/<endpoint>.json` on `onMounted` |
| `useI18nData.js` | Extracts translated value from `{ en, fr }` objects per current locale |
| `useLocale.js` | Language switching; persists to `localStorage`, sets `document.documentElement.lang` |
| `useTheme.js` | Applies `public/data/theme.json` colors and fonts as CSS custom properties |
| `useSEO.js` | Reactively updates `<meta>` tags (Open Graph, Twitter Card) on locale or data changes |
| `useAge.js` | Computed age and years of experience from hardcoded birthdate (2000-01-28) and start year (2017) |

### i18n

`src/i18n/index.js` bootstraps vue-i18n with `legacy: false`. UI labels come from `src/i18n/locales/en.json` and `fr.json`. Content text comes from `.i18n.json` data files accessed via `useI18nData` — not the i18n message catalog. Language auto-detects from the browser and falls back to `'en'`.

### Layout

`App.vue` renders a fixed `Sidebar` + scrollable `main` with all section components stacked vertically. On desktop (`>= 1024px`) the main content has `margin-left: 280px`. Hash-based scroll uses `window.history.replaceState` + `scrollIntoView` — vue-router is listed as a dependency but not registered with the app.

### Styling

`src/assets/styles/variables.scss` defines all SCSS variables referencing CSS custom properties so `useTheme` can override them at runtime from `theme.json`. Global base styles and animations (glitch, grid background, glow) are in `theme.scss`. Dark scientific/tech palette: primary `#0A192F`, accent `#64FFDA`, highlight `#00D9FF` — JetBrains Mono for headings, Inter for body.

### PWA

Configured via `vite-plugin-pwa` in `vite.config.js` with `base: '/'`. Generates `sw.js` and `manifest.webmanifest` at build time with Workbox precaching. Safari requires manual install (Share → Add to Home Screen / Add to Dock) — no automatic prompt. Firefox desktop does not support PWA installation.