# Changelog - Portfolio v2

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
