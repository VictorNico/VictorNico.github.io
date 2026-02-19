# 🚀 Portfolio Victor Djiembou - Vue 3 + Vite

Portfolio professionnel moderne avec design scientifique/technique, construit avec Vue 3 et Vite.

## ✨ Caractéristiques

- **🎨 Design Scientifique/Technique** : Charte graphique unique avec effets glitch, particules, grille background
- **📊 Configuration JSON** : Tout le contenu est externalisé dans des fichiers JSON facilement modifiables
- **⚡ Performance** : Build ultra-rapide avec Vite, code splitting automatique
- **📱 Responsive** : S'adapte à tous les écrans (mobile, tablette, desktop)
- **🎭 Animations** : Effets visuels modernes (glitch, particules, transitions fluides)
- **🎯 Composants Réutilisables** : Architecture modulaire Vue 3 Composition API
- **🎨 SCSS Variables** : Thème facilement personnalisable via variables

## 🛠️ Technologies

- **Vue 3** - Framework JavaScript progressif
- **Vite** - Build tool ultra-rapide
- **SCSS/SASS** - Préprocesseur CSS
- **Boxicons & Bootstrap Icons** - Bibliothèques d'icônes
- **Canvas API** - Animation de particules

## 📁 Structure du Projet

```
portfolio-v2/
├── public/
│   ├── data/                    # 📄 Fichiers de configuration JSON
│   │   ├── profile.json         # Informations personnelles
│   │   ├── skills.json          # Compétences techniques
│   │   ├── experience.json      # Expériences professionnelles
│   │   ├── education.json       # Formation académique
│   │   ├── services.json        # Services offerts
│   │   └── theme.json           # Configuration du thème
│   └── assets/
│       └── img/                 # Images du portfolio
├── src/
│   ├── components/
│   │   ├── layout/              # Composants de mise en page
│   │   │   ├── Sidebar.vue
│   │   │   └── Footer.vue
│   │   └── sections/            # Sections du portfolio
│   │       ├── Hero.vue
│   │       ├── About.vue
│   │       ├── Facts.vue
│   │       ├── Skills.vue
│   │       ├── Resume.vue
│   │       ├── Services.vue
│   │       └── Contact.vue
│   ├── composables/             # Logique réutilisable
│   │   ├── useDataLoader.js
│   │   ├── useTheme.js
│   │   └── useAge.js
│   ├── assets/
│   │   └── styles/              # Styles SCSS
│   │       ├── variables.scss
│   │       └── theme.scss
│   ├── App.vue
│   └── main.js
├── index.html
├── package.json
└── vite.config.js
```

## 🚀 Installation & Démarrage

### Prérequis
- Node.js (v16 ou supérieur)
- npm ou yarn

### Installation
```bash
# Cloner le projet
cd portfolio-v2

# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev
```

Le site sera accessible sur **http://localhost:5173/**

### Build Production
```bash
# Générer la version optimisée pour production
npm run build

# Prévisualiser la version de production
npm run preview
```

## 🎨 Personnalisation

### 1. Modifier les Informations Personnelles

Éditez le fichier `public/data/profile.json` :
```json
{
  "personal": {
    "name": "Votre Nom",
    "title": "Votre Titre",
    "bio": "Votre biographie..."
  }
}
```

### 2. Ajouter/Modifier les Compétences

Éditez `public/data/skills.json` :
```json
{
  "categories": [
    {
      "name": "Catégorie",
      "skills": [
        {
          "name": "Nom de la compétence",
          "level": 95,
          "icon": "code-slash",
          "color": "#42b883"
        }
      ]
    }
  ]
}
```

### 3. Personnaliser le Thème

Modifiez `public/data/theme.json` ou directement les variables SCSS dans `src/assets/styles/variables.scss` :

```scss
$color-primary: #0A192F;
$color-secondary: #64FFDA;
$color-accent: #00D9FF;
```

## 🎯 Fonctionnalités Principales

### ✅ Système de Configuration Dynamique
- Tout le contenu peut être modifié via les fichiers JSON dans `public/data/`
- Aucun code à toucher pour mettre à jour le contenu

### ✅ Thème Scientifique/Technique
- Police monospace (JetBrains Mono) pour les titres
- Effets glitch sur le hero
- Animation de particules en background
- Grille scientifique subtile
- Palette de couleurs tech (cyan néon, bleu marine)

### ✅ Composants Interactifs
- Sidebar responsive avec navigation smooth scroll
- Cards avec effets hover
- Progress bars animées pour les compétences
- Back-to-top button

### ✅ Performances Optimales
- Lazy loading des images
- Code splitting automatique par Vite
- Build optimisé (<100KB gzipped)

## 📝 Scripts Disponibles

```bash
npm run dev      # Démarrer le serveur de développement
npm run build    # Build pour production
npm run preview  # Prévisualiser le build de production
```

## 🎨 Palette de Couleurs

| Couleur | Hex Code | Usage |
|---------|----------|-------|
| Primary | `#0A192F` | Background principal |
| Secondary | `#64FFDA` | Accents, liens |
| Accent | `#00D9FF` | Highlights |
| Text Primary | `#CCD6F6` | Texte principal |
| Text Secondary | `#8892B0` | Texte secondaire |

## 📄 License

© 2026 Victor Djiembou - Tous droits réservés

## 🤝 Contact

- **Email** : Viclegranddab@gmail.com
- **GitHub** : [VictorNico](https://github.com/VictorNico/)
- **LinkedIn** : [Victor Djiembou](https://linkedin.com/in/victor-djiembou-a73b8820a)

---

**Built with ❤️ using Vue 3 + Vite**
