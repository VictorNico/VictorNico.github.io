# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start dev server at http://localhost:5173
npm run build     # Production build
npm run preview   # Preview production build
```

No linter or test runner is configured.

## Architecture

**Stack:** Vue 3 (Composition API) + Vite + SCSS + vue-i18n + vue-router

### Data-driven content

All portfolio content lives in `public/data/` as JSON files fetched at runtime via `useDataLoader`. Two file formats coexist:

- `*.json` — original single-language format
- `*.i18n.json` — multilingual format with `{ "en": "...", "fr": "..." }` values for all text fields

Sections load their corresponding data file (e.g. `skills.i18n.json`) and extract the appropriate locale using `useI18nData.getTranslated()`. When adding or editing content, prefer the `.i18n.json` files.

### Composables (`src/composables/`)

| File | Purpose |
|------|---------|
| `useDataLoader.js` | Async fetch from `/data/<endpoint>.json` on `onMounted` |
| `useI18nData.js` | Extracts translated value from `{ en, fr }` objects per current locale |
| `useLocale.js` | Language switching; persists to `localStorage`, sets `document.documentElement.lang` |
| `useTheme.js` | Applies `public/data/theme.json` colors and fonts as CSS custom properties |
| `useSEO.js` | Reactively updates `<meta>` tags (Open Graph, Twitter Card) on locale or data changes |
| `useAge.js` | Computed age and years of experience from hardcoded birthdate and start year |

### i18n

`src/i18n/index.js` bootstraps vue-i18n with `legacy: false` (Composition API mode). UI labels come from `src/i18n/locales/en.json` and `fr.json`. Content text comes from `.i18n.json` data files and is accessed via `useI18nData`, not the i18n message catalog. Language auto-detects from the browser and falls back to `'en'`.

### Layout

`App.vue` renders a fixed `Sidebar` + scrollable `main` with all section components stacked vertically. On desktop (`>= 1024px`) the main content has a `margin-left: 280px` to accommodate the sidebar.

### Styling

`src/assets/styles/variables.scss` defines all SCSS variables (colors, spacing, breakpoints, shadows). These reference CSS custom properties (e.g. `var(--color-primary, #0A192F)`) so `useTheme` can override them at runtime from `theme.json`. Global base styles and animations (glitch, grid background, glow) are in `theme.scss`.

Theme colors follow a dark scientific/tech palette — primary `#0A192F`, accent `#64FFDA`, highlight `#00D9FF` — with JetBrains Mono for headings and Inter for body text.