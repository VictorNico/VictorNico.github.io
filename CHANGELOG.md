# Changelog - Portfolio v2

## Version 2.1.0 (2026-02-19)

Séance de corrections techniques axée sur la qualité : accessibilité (WCAG AA), performance (Core Web Vitals), SEO et stabilité du déploiement Cloudflare.

---

### 🔧 Build & Configuration

#### Migration Sass `@import` → `@use` (Dart Sass 3)
**Pourquoi :** `@import` est déprécié depuis Dart Sass 3 et sera supprimé. Il polluait la console de 15+ avertissements à chaque build.
**Comment :** Remplacement global par `@use ... as *` et injection automatique des variables via `vite.config.js`.

**Fichiers modifiés :**
- `vite.config.js` — ajout de `css.preprocessorOptions.scss.additionalData` (injection de `variables.scss` dans chaque `<style lang="scss">`) et `resolve.alias` (`@` → `src/`)
- `src/assets/styles/theme.scss` — `@import './variables.scss'` → `@use './variables.scss' as *`
- `src/App.vue` — `@import './assets/styles/theme.scss'` → `@use`
- 12 composants Vue — suppression des `@import '../../assets/styles/variables.scss'` devenus redondants (gérés par `additionalData`)

#### Correction déploiement Cloudflare Workers
**Pourquoi :** Le déploiement échouait avec deux erreurs Wrangler : nom de Worker `undefined` (pas de `wrangler.toml`) et `compatibility_date` manquant.
**Solution :** Création d'un `wrangler.toml` avec `name = "dtvni"` et `compatibility_date = "2026-02-19"`.

#### Correction conflit Workbox precache PWA
**Pourquoi :** Erreur `add-to-cache-list-conflicting-entries` au runtime — les icônes PWA étaient ajoutées deux fois au précache : une fois par le manifest (sans hash) et une fois par `globPatterns` (avec `?__WB_REVISION__=...`).
**Comment :** Ajout de `globIgnores` dans la config Workbox pour exclure les fichiers déjà gérés par le manifest.

**Fichier modifié :** `vite.config.js`
```js
globIgnores: [
  '**/android-chrome-*.png',
  '**/apple-touch-icon.png',
  '**/favicon*.ico',
  '**/favicon-*.png',
]
```

---

### ♿ Accessibilité (WCAG AA)

#### Ordre des titres (heading order)
**Pourquoi :** Les éléments `h4` apparaissaient directement sous `h2` (saut de niveau), ce qui brise la navigation par lecteur d'écran.
**Comment :**
- `Facts.vue` — `h4.fact-label` → `p` (ces libellés ne sont pas des titres de section)
- `Services.vue` — `h4.service-title` → `h3`
- `Contact.vue` — 3× `h4` → `h3` pour Location, Email, Call

#### iframe sans titre
**Pourquoi :** Les lecteurs d'écran ne peuvent pas décrire le contenu d'un `<iframe>` sans attribut `title`.
**Comment :** Ajout de `:title="t('contact.mapTitle')"` sur l'iframe Google Maps dans `Contact.vue` + clés de traduction `contact.mapTitle` ajoutées dans `en.json` et `fr.json`.

#### Ratio de contraste insuffisant (6 éléments)
**Pourquoi :** `$text-secondary (#8892B0)` sur `$bg-card (#112240)` donnait ~3.5:1, en dessous du minimum WCAG AA de 4.5:1.
**Comment :** Remplacement par `#A8B2CC` (~5.1:1) — même famille bleu-gris, légèrement plus clair.

**Fichiers modifiés :**
- `public/data/theme.json` — `textSecondary: "#8892B0"` → `"#A8B2CC"`
- `src/assets/styles/variables.scss` — fallback mis à jour en conséquence

**Cas séparé :** `.status-badge` dans `About.vue` — `background: $data-green (#16A085)` + texte blanc donnait ~3.2:1. Remplacé par `#0d6b57` (~5.7:1).

#### Liens non descriptifs
**Pourquoi :** Les liens "Read More" et "DOI" dans la section Publications étaient identiques visuellement mais pointaient vers des destinations différentes. Les crawlers et lecteurs d'écran ne pouvaient pas les distinguer.
**Comment :** Ajout d'`aria-label` dynamique incluant le titre de la publication.

**Fichier modifié :** `src/components/sections/Publications.vue`
```html
<!-- Avant -->
<a href="...">DOI</a>
<!-- Après -->
<a href="..." :aria-label="`DOI – ${getTranslated(pub.title)}`">DOI</a>
```

---

### 🚀 Performance (Core Web Vitals)

#### Fonts non-bloquantes (–400ms FCP)
**Pourquoi :** `@import url(...)` Google Fonts dans `theme.scss` était compilé dans le CSS bundle → render-blocking. Idem pour Boxicons et Bootstrap Icons chargés via `<link rel="stylesheet">` bloquants.
**Comment :**
- Suppression du `@import url(...)` de `theme.scss`
- Chargement via `<link rel="preload" as="style" onload="this.onload=null;this.rel='stylesheet'">` dans `index.html` (technique non-bloquante standard)
- Fallback `<noscript>` pour les navigateurs sans JS

**Fichiers modifiés :** `index.html`, `src/assets/styles/theme.scss`

#### Preconnects réduits à 2 origines critiques
**Pourquoi :** Lighthouse détectait >4 preconnects (warning). Les preconnects vers unpkg.com et cdn.jsdelivr.net étaient inutiles puisque ces ressources sont chargées en non-bloquant.
**Comment :** Conservation uniquement de `fonts.googleapis.com` et `fonts.gstatic.com`.

#### Canvas de particules optimisé (TBT réduit)
**Pourquoi :** 100 particules avec connexions O(n²) = 4950 calculs par frame + fuite mémoire (rAF jamais annulé) + animation continue en arrière-plan.
**Comment :**
- Particules : 100 → 50 (charge CPU divisée par 4)
- Élimination du `Math.sqrt` pour le test de distance (comparaison `distSq` à la place)
- `cancelAnimationFrame` au `onUnmounted` (fuite mémoire corrigée)
- `prefers-reduced-motion` : animation désactivée si l'utilisateur le demande
- `visibilitychange` : animation pausée quand l'onglet est en arrière-plan
- Listener `resize` passé en `{ passive: true }`

**Fichier modifié :** `src/components/sections/Hero.vue`

#### Cache des données JSON — `useDataLoader` (LCP –1,300ms)
**Pourquoi :** `profile.i18n.json` était fetché 6 fois simultanément (une fois par composant qui appelait `useDataLoader('profile.i18n')`). Chaque appel créait un nouveau `ref` + `onMounted` indépendant.
**Comment :** Ajout d'un `Map` au niveau module. Le premier appel déclenche le fetch et stocke le résultat ; les appels suivants retournent le même `ref` réactif. Le fetch démarre immédiatement (plus besoin de `onMounted`).

**Fichier modifié :** `src/composables/useDataLoader.js`

#### Image de profil : dimensions explicites + priorité
**Pourquoi :** Sans `width`/`height` HTML, le navigateur ne peut pas réserver l'espace avant le chargement de l'image → Cumulative Layout Shift.
**Comment :** Ajout de `width="120" height="120"`, `loading="eager"`, `fetchpriority="high"`.

**Fichier modifié :** `src/components/layout/Sidebar.vue`

#### Hero content layout shift (CLS 0.151 → réduit)
**Pourquoi :** `div.hero-content` n'avait pas de hauteur réservée → shift visible au chargement des données async.
**Comment :** Ajout de `min-height: 200px` + `display: flex` centré sur `.hero-content`.

**Fichier modifié :** `src/components/sections/Hero.vue`

---

### 🔍 SEO

#### robots.txt valide
**Pourquoi :** `/robots.txt` renvoyait le `index.html` de la SPA (pas de fichier robots.txt). Lighthouse rapportait 29 erreurs de syntaxe.
**Comment :** Création de `public/robots.txt` (Vite copie automatiquement `public/` à la racine du `dist/`).

#### sitemap.xml
**Pourquoi :** Sans sitemap, Google doit découvrir le site par lui-même, ce qui peut prendre des semaines.
**Comment :** Ajout de `vite-plugin-sitemap` dans `vite.config.js` — génère automatiquement `sitemap.xml` à chaque build. Référencé dans `robots.txt`.

#### URL canonique
**Pourquoi :** Le site est accessible sur deux URLs (`victornico.github.io` et `victornico-github-io.pages.dev`). Sans canonical, Google peut pénaliser le contenu dupliqué ou ne pas savoir laquelle indexer.
**Stratégie retenue :** Cloudflare (`victornico-github-io.pages.dev`) est défini comme URL canonique car GitHub Pages n'est pas accessible depuis certains FAI camerounais/africains.

**Fichiers modifiés :**
- `index.html` — `<link rel="canonical" href="https://victornico-github-io.pages.dev/">`
- `src/composables/useSEO.js` — gestion dynamique du canonical via `personal.contacts.website`
- `public/data/profile.i18n.json` — `website` mis à jour vers l'URL Cloudflare
- `public/robots.txt` — sitemap pointe vers Cloudflare
- `public/sitemap.xml` — URL canonique Cloudflare

---

### 📦 Dépendances Ajoutées
```json
{
  "devDependencies": {
    "vite-plugin-sitemap": "^*"
  }
}
```

---

### ⚠️ Améliorations restantes (non réalisées — nécessitent des outils externes)

| Problème | Impact estimé | Solution |
|---|---|---|
| `profile-img.jpg` (192 KiB, 768×1024) | –167 KiB | Convertir en WebP (`cwebp`/Squoosh) + utiliser `<picture>` avec fallback jpg + servir en 120×120 ou 2× pour Retina |
| `font-display` sur Boxicons/Bootstrap Icons | –2,040ms FCP | Héberger les fonts localement avec `@font-face { font-display: optional }` |
| CSS inutilisé (Boxicons 11.7 KiB, Bootstrap Icons 10.3 KiB) | –22 KiB | Subsetter les fonts d'icônes ou migrer vers SVG inline |

---

## Version 2.0.0 (2026-02-18)

### ✨ Nouvelles Fonctionnalités

#### 🌍 Internationalisation (i18n)
- **Support multilingue** : Français (FR) et Anglais (EN)
- **Détection automatique** de la langue du navigateur
- **Stockage local** de la préférence linguistique
- **Composant LanguageSwitcher** : Changement facile de langue avec drapeaux 🇫🇷 🇬🇧
- **Traduction complète** de toutes les sections et labels

**Fichiers ajoutés :**
- `src/i18n/index.js` - Configuration i18n
- `src/i18n/locales/en.json` - Traductions anglaises
- `src/i18n/locales/fr.json` - Traductions françaises
- `src/composables/useLocale.js` - Composable pour gérer la langue
- `src/components/ui/LanguageSwitcher.vue` - Sélecteur de langue

#### 📚 Nouvelles Sections

##### Publications Scientifiques
- Section dédiée aux **publications académiques**
- Support multilingue (titres, abstracts)
- Tags par domaine de recherche
- Liens DOI et téléchargement PDF
- Design moderne avec cards interactives

**Fichiers ajoutés :**
- `public/data/publications.json` - Configuration des publications
- `src/components/sections/Publications.vue` - Composant de rendu

##### Awards & Certificats
- Section pour **distinctions et certifications**
- Séparation awards/certificates
- Affichage de l'émetteur, date, ID de credential
- Liens vers certificats en ligne
- Icônes et couleurs personnalisables par award

**Fichiers ajoutés :**
- `public/data/awards.json` - Configuration des awards/certificats
- `src/components/sections/Awards.vue` - Composant de rendu

#### 🔍 SEO Optimisé
- **Meta tags dynamiques** basés sur les données du portfolio
- **Open Graph tags** pour partage sur réseaux sociaux
- **Twitter Cards** pour aperçus enrichis
- **Mise à jour automatique** selon la langue sélectionnée
- Support **multilingue** des balises SEO

**Fichiers ajoutés :**
- `src/composables/useSEO.js` - Composable pour gérer le SEO

### 🔧 Améliorations

#### Hero Section
- **Correction du bug typewriter** : L'animation attend maintenant le chargement des données
- **Support i18n** : Le préfixe "I'm"/"Je suis" s'adapte à la langue
- **Animation fluide** : Transition entre les rôles toutes les 3 secondes

#### Resume Section
- **Réorganisation** : Education en premier, Experience en second
- **Meilleure responsive** : Organisation optimale sur mobile
- **Traduction complète** : Titres et labels internationalisés
- **Format de date adapté** : Format local selon la langue (FR/EN)

#### Sidebar
- **Ajout du LanguageSwitcher** en bas de la sidebar
- **Navigation mise à jour** : Ajout des liens Publications et Awards
- **Labels i18n** : Navigation traduite dynamiquement

### 📦 Dépendances Ajoutées
```json
{
  "vue-i18n": "^11.0.0"
}
```

### 📁 Structure des Fichiers JSON

#### publications.json
```json
{
  "intro": { "en": "...", "fr": "..." },
  "publications": [
    {
      "id": 1,
      "title": { "en": "...", "fr": "..." },
      "authors": ["..."],
      "journal": "...",
      "year": 2023,
      "abstract": { "en": "...", "fr": "..." },
      "doi": "...",
      "pdfUrl": "...",
      "tags": ["..."]
    }
  ]
}
```

#### awards.json
```json
{
  "intro": { "en": "...", "fr": "..." },
  "awards": [...],
  "certificates": [
    {
      "id": 1,
      "title": { "en": "...", "fr": "..." },
      "issuer": "...",
      "date": "...",
      "credentialId": "...",
      "certificateUrl": "...",
      "icon": "...",
      "color": "..."
    }
  ]
}
```

### 🎨 Style & Design
- **Cohérence visuelle** : Nouveau sections intégrées au thème scientifique
- **Animations** : Hover effects, transitions fluides
- **Responsive** : Optimisation mobile/tablette/desktop
- **Accessibilité** : Labels aria, navigation clavier

### 🚀 Performance
- **Code splitting** automatique par section
- **Lazy loading** des traductions
- **Cache localStorage** pour la préférence linguistique

### 📝 Documentation
- README mis à jour avec instructions i18n
- Documentation des nouveaux composables
- Exemples de configuration JSON

---

## Comment Utiliser

### Changer la langue
```javascript
// Dans un composant
import { useLocale } from '@/composables/useLocale'

const { locale, changeLocale } = useLocale()
changeLocale('fr') // ou 'en'
```

### Ajouter une publication
Éditez `public/data/publications.json` :
```json
{
  "publications": [
    {
      "id": 2,
      "title": {
        "en": "Your Publication Title",
        "fr": "Titre de votre publication"
      },
      // ...
    }
  ]
}
```

### Ajouter un certificat
Éditez `public/data/awards.json` dans la section `certificates`.

---

## Migration depuis v1

1. **i18n** : Toutes les chaînes hardcodées sont maintenant dans les fichiers de traduction
2. **Nouvelles sections** : Publications et Awards automatiquement intégrées
3. **SEO** : Les meta tags sont gérés dynamiquement
4. **Resume** : L'ordre Education/Experience a été inversé

---

**Built with ❤️ using Vue 3 + Vite + Vue I18n**
