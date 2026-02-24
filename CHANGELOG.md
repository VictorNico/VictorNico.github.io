# Changelog - Portfolio v2

## Version 2.3.0 (2026-02-24)

Refonte complète de la section **Skills** : remplacement du grid de cards générique par 5 visualisations interactives dédiées à chaque catégorie de compétences.

---

### ✨ Nouvelles Fonctionnalités

#### Carrousel horizontal — Programming Languages
Défilement CSS infini automatique avec pause au survol. Chaque carte affiche un anneau SVG de progression circulaire, le logo Devicon officiel du langage (avec fallback Bootstrap Icon en cas d'échec de chargement), le nom et le pourcentage de maîtrise.

**Fichier ajouté :** `src/components/skills/LanguagesCarousel.vue`

#### Graphe physique interactif — ML/DL Frameworks & Research
6 nœuds SVG en mouvement brownien aléatoire. Chaque nœud est repoussé par la position du curseur (rayon d'influence 140px) — le visiteur peut donc « jouer » avec le graphe. Des lignes pointillées apparaissent dynamiquement entre les nœuds proches (opacité proportionnelle à la distance). Un tooltip au survol affiche le nom complet du framework et son niveau. La boucle `requestAnimationFrame` est automatiquement suspendue quand la section quitte le viewport (IntersectionObserver) pour économiser le CPU.

**Fichier ajouté :** `src/components/skills/MLFrameworkGraph.vue`

#### Diagramme radial annoté — Specialized Research Skills
Diagramme SVG en étoile avec un hub central « RESEARCH HUB » et 6 nœuds disposés en cercle. Chaque nœud porte un arc de progression et une abréviation 2 lettres. Au survol, une boîte d'annotation flottante apparaît avec le nom complet, une barre de niveau et le pourcentage. La position de l'annotation s'adapte automatiquement pour ne pas sortir des bords du SVG.

**Fichier ajouté :** `src/components/skills/ResearchDiagram.vue`

#### Carrousel 3D coverflow — Full-Stack Development
Perspective CSS 1100px avec `rotateY` et `translateZ`. 3 cartes visibles simultanément : la carte centrale est pleine taille, les cartes latérales (±1) sont inclinées à 48°, mises en retrait et semi-transparentes. Les cartes au-delà de ±1 sont masquées derrière. Un **effet miroir** est rendu via `scaleY(-1)` + gradient mask en dessous de chaque carte. Navigation : boutons précédent/suivant, indicateurs dots, swipe tactile, auto-avance toutes les 3,5 s avec pause au survol.

**Fichier ajouté :** `src/components/skills/FullStackCarousel.vue`

#### Graphique polaire en rose de Nightingale — Data Science & Tools
6 secteurs SVG de 60° chacun dont le rayon est proportionnel au niveau de maîtrise (polar area chart). Grille de référence aux 25 / 50 / 75 / 100 %. Animation de tracé progressif (1,4 s) déclenchée par IntersectionObserver au moment où la section entre dans le viewport. Au survol d'un secteur : agrandissement `scale(1.06)` + tooltip centré avec nom et niveau.

**Fichier ajouté :** `src/components/skills/DataSciencePolarChart.vue`

---

### 🔧 Modifications

#### `src/components/sections/Skills.vue`
Refactorisé pour router vers le bon sous-composant selon `category.type` :

| `type`         | Composant rendu            |
|----------------|----------------------------|
| `programming`  | `LanguagesCarousel`        |
| `ml-research`  | `MLFrameworkGraph`         |
| `specialized`  | `ResearchDiagram`          |
| `fullstack`    | `FullStackCarousel`        |
| `data-science` | `DataSciencePolarChart`    |
| `language` / `soft` | Grid de cards original |

#### `public/data/skills.i18n.json`
Ajout d'un champ `image` (URL Devicon CDN, optionnel) sur les compétences suivantes : Python, JavaScript, C++, Java, R, SQL/Cypher, PyTorch, TensorFlow, scikit-learn, Vue.js, Node.js, Django, MongoDB, Neo4j, Docker. Les couleurs Pandas et Matplotlib ont été légèrement éclaircies (`#150458` → `#6b7ec2`, `#11557c` → `#4a9aba`) pour une meilleure visibilité sur le fond sombre du polar chart.

#### `src/i18n/locales/en.json` / `fr.json`
Nouvelles clés dans le namespace `skills` :
- `mlGraphAria`, `mlHint` (graphe ML)
- `researchDiagramAria` (diagramme recherche)
- `prevCard`, `nextCard` (carrousel fullstack)
- `polarChartAria` (polar chart)

---

## Version 2.2.0 (2026-02-23)

Refonte du positionnement et du contenu : identité académique clarifiée, nouvelles fonctionnalités (section Projects, boutons CTA, CV download), corrections de bugs et mise à jour des données sociales/métriques.

---

### ✨ Nouvelles Fonctionnalités

#### Section Projects
Nouvelle section complète permettant de présenter les projets de recherche et d'ingénierie avec filtre par catégorie.

**Fichiers ajoutés :**
- `public/data/projects.i18n.json` — 5 projets documentés (MNIFS Graph ML, Plant Disease CNN, Takenco MIS, Document Certification Platform, Law Firm BPM ERP)
- `src/components/sections/Projects.vue` — composant avec filtre par catégorie (All / Research / FullStack / AI / ML), cards avec stack technique, highlights clés, liens GitHub et Paper

**Intégration :**
- `src/App.vue` — `<Projects />` ajouté entre `<Awards />` et `<Services />`
- `src/components/layout/Sidebar.vue` — entrée nav "Projects" (`bx-layer`) ajoutée
- `src/i18n/locales/en.json` / `fr.json` — clés `nav.projects`, `projects.title/featured/code/paper` ajoutées

#### Boutons CTA dans le Hero
Deux boutons d'action principale ajoutés sous le titre rotatif dans `Hero.vue` :
- **Download CV** (primaire) — déclenche le téléchargement de `/assets/cv.pdf` (à déposer dans `public/assets/`)
- **View Projects** (secondaire) — scroll vers la section `#projects`

**Clés i18n ajoutées :** `hero.downloadCV`, `hero.viewProjects`

#### Bouton Download CV dans la Sidebar
Bouton Download CV persistent dans la Sidebar (`src/components/layout/Sidebar.vue`), visible en permanence sous le sélecteur de langue. Activé conditionnellement via `profile.personal.cvUrl`.

---

### 🔧 Corrections de Bugs

#### Glitch animation — `Hero.vue`
**Problème :** L'animation glitch tournait en continu (`infinite`) dès le chargement, créant une distraction visuelle permanente.
**Fix :** Suppression de l'animation continue sur `::before`/`::after`. L'animation ne se déclenche plus qu'au hover avec `animation-duration: 0.15s`.

#### `formatDate` ignorait la locale active — `About.vue`
**Problème :** `toLocaleDateString('en-US', ...)` forçait le format anglais même quand l'utilisateur était en français.
**Fix :** `locale.value === 'fr' ? 'fr-FR' : 'en-US'` — la date s'affiche maintenant selon la langue sélectionnée.

#### Dates contradictoires — `experience.i18n.json`
**Problème :** L'expérience CONIA Hackathon (id=13) avait des dates incohérentes entre les deux tableaux : `2025-07-04 → 2025-07-09` dans `experiences` vs `2024-10 → 2025-01` dans `_experiences`.
**Fix :** Uniformisation sur `startDate: "2024-10"`, `endDate: "2025-01"` (dates réelles de la compétition).

---

### 📝 Contenu mis à jour

#### `profile.i18n.json`

**Liens sociaux :** Facebook et Skype supprimés (non pertinents pour profil académique/senior dev). Ajout de :
- Google Scholar (`https://scholar.google.com/citations?hl=fr&user=xz70eREAAAAJ`)
- ResearchGate (`https://www.researchgate.net/profile/Djiembou-Victor-Nico`)
- Kaggle (`https://www.kaggle.com/victornicofac`)

Ordre revu : GitHub, LinkedIn, Scholar, ResearchGate, Kaggle, GitLab, Twitter.

**Rôles rotatifs (Hero) :** Réduits de 13 à 5 rôles clés pour éviter la dilution du message :
```
Graph ML Researcher & PhD Applicant
CONIA Hackathon 2025 - 1st Place Winner
Graduate Research Assistant @ UY1
Senior FullStack Developer
Explainable AI Specialist
```

**Facts :** Métriques orientées freelancer remplacées par métriques orientées recherche :
| Avant | Après |
|---|---|
| 7 Happy Clients | 3 Research Contributions (1 publié · 1 en révision · 1 en préparation) |
| 15 Projects | 11 Benchmark Datasets validés |
| 1453 Hours of Support | 6 Years of Dev Experience |
| 13 Hard Workers | 5+ Students Mentored |

**Contacts :** Emails réduits de 4 à 2, téléphones de 2 à 1.

**Ajout :** champ `personal.cvUrl` → `"/assets/cv.pdf"` (activer en déposant le PDF dans `public/assets/`).

#### `services.i18n.json`
Descriptions génériques et obsolètes remplacées par descriptions concrètes et à jour :
- "Project Management — 1 year" → "Scrum PM — 4+ ans chez Takenco"
- "Development trainer" → "Senior FullStack Development — 6+ ans en production"
- Nouveau : "Graph ML & Data Science Consulting" (MNIFS, PageRank, SHAP)
- Nouveau : "AI Research for African Agriculture" (CONIA winner, déploiement mobile)
- "Article and report writing" → "Information System Security" (CIA, network architecture, mirroring)
- Ajout : "Teaching & Research Mentoring" (5+ étudiants encadrés, GNN workshops)

---

### ⚠️ Action requise

| Action | Fichier cible |
|---|---|
| Déposer le CV PDF | `public/assets/cv.pdf` |
| Vérifier les liens GitHub des projets | `public/data/projects.i18n.json` — champ `github` de chaque projet |
| Ajouter lien Paper CNN (IEEE Access) | `public/data/projects.i18n.json` — projet id=2, champ `paper` |

---

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
