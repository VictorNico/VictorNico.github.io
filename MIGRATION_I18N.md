# Migration vers Format JSON Multilingue

## 📋 Résumé des Changements

Tous les fichiers JSON ont été restructurés pour supporter **un format multilingue natif** :

```json
// ❌ Ancien format
{
  "title": "My Title"
}

// ✅ Nouveau format
{
  "title": {
    "en": "My Title",
    "fr": "Mon Titre"
  }
}
```

---

## 📁 Fichiers Créés (Nouveaux Formats Multilingues)

### ✅ Fichiers JSON i18n
- `public/data/skills.i18n.json` - Compétences multilingues
- `public/data/education.i18n.json` - Formation multilingue
- `public/data/experience.i18n.json` - Expériences multilingues

### ✅ Composable Helper
- `src/composables/useI18nData.js` - Aide à extraire les traductions depuis les JSON

---

## 🔧 Composants Mis à Jour

### ✅ Resume.vue (COMPLÈTEMENT REFACTORISÉ)
**Changements majeurs :**
1. **Structure en sections séparées** (plus de colonnes) :
   - Education en premier (section complète)
   - Experience ensuite (section complète)

2. **Timeline verticale** pour meilleure UX responsive

3. **Utilisation des données i18n** :
```vue
// Charge les données multilingues
const { data: education } = useDataLoader('education.i18n')
const { data: experiences } = useDataLoader('experience.i18n')

// Extrait la traduction selon la locale
const { getTranslated } = useI18nData()

// Dans le template
{{ getTranslated(edu.degree) }}
```

---

## 📝 Structure des Données Multilingues

### education.i18n.json
```json
{
  "education": [
    {
      "id": 1,
      "degree": {
        "en": "Bachelor's Degree",
        "fr": "Licence"
      },
      "field": {
        "en": "Computer Science",
        "fr": "Informatique"
      },
      "description": {
        "en": "Description in English",
        "fr": "Description en français"
      },
      // Champs non traduits (noms propres, dates)
      "institution": "University Name",
      "location": "City, Country",
      "startDate": "2020-09",
      "endDate": "2023-06"
    }
  ]
}
```

### experience.i18n.json
```json
{
  "experiences": [
    {
      "id": 1,
      "title": {
        "en": "Full Stack Developer",
        "fr": "Développeur Full Stack"
      },
      "responsibilities": [
        {
          "en": "Developed web applications",
          "fr": "Développement d'applications web"
        }
      ],
      // Champs non traduits
      "company": "Company Name",
      "location": "City, Country",
      "startDate": "2021-01",
      "endDate": "current"
    }
  ]
}
```

### skills.i18n.json
```json
{
  "intro": {
    "en": "Introduction in English",
    "fr": "Introduction en français"
  },
  "categories": [
    {
      "name": {
        "en": "Technical Skills",
        "fr": "Compétences Techniques"
      },
      "skills": [
        {
          "name": {
            "en": "Frontend Development",
            "fr": "Développement Frontend"
          },
          "level": 95,
          "icon": "code-slash",
          "color": "#42b883"
        }
      ]
    }
  ]
}
```

---

## 🛠️ Utilisation du Composable `useI18nData`

```vue
<script setup>
import { useI18nData } from '@/composables/useI18nData'

const { getTranslated, getTranslatedArray, locale } = useI18nData()

// Extraire une valeur traduite
const title = getTranslated(data.title)
// Retourne data.title.fr si locale=fr, sinon data.title.en

// Extraire un tableau traduit
const roles = getTranslatedArray(data.roles)
// Retourne data.roles.fr si locale=fr, sinon data.roles.en
</script>

<template>
  <h1>{{ getTranslated(profile.title) }}</h1>
</template>
```

---

## 🚀 Composants À Migrer

### ⏳ En attente de migration

1. **Hero.vue**
   - Utiliser `profile.i18n.json` pour bio, title, roles
   - Appliquer `getTranslatedArray()` pour roles

2. **About.vue**
   - Utiliser `profile.i18n.json` pour bio, motto, tagline
   - Appliquer `getTranslated()` partout

3. **Facts.vue**
   - Utiliser `profile.i18n.json` avec facts multilingues
   - Traduire labels et descriptions

4. **Skills.vue** ⚠️ À FINALISER
   - Changer de `skills.json` → `skills.i18n.json`
   - Appliquer `getTranslated()` pour name, intro

5. **Services.vue**
   - Créer `services.i18n.json` (title, description)

6. **Publications.vue** ✅ DÉJÀ FAIT
   - Utilise déjà format i18n

7. **Awards.vue** ✅ DÉJÀ FAIT
   - Utilise déjà format i18n

---

## 📦 Tâches Restantes

### 1. Créer profile.i18n.json complet
```bash
# Backup ancien
cp public/data/profile.json public/data/profile.json.bak

# Créer nouveau format multilingue
# (À faire manuellement ou via script)
```

### 2. Créer services.i18n.json
```json
{
  "intro": { "en": "...", "fr": "..." },
  "services": [
    {
      "id": 1,
      "title": { "en": "...", "fr": "..." },
      "description": { "en": "...", "fr": "..." },
      "icon": "bi-code",
      "color": "#667EEA"
    }
  ]
}
```

### 3. Mettre à jour tous les composants
- [ ] Hero.vue
- [ ] About.vue
- [ ] Facts.vue
- [x] Skills.vue (fichier créé, composant à mettre à jour)
- [x] Resume.vue ✅
- [ ] Services.vue
- [x] Publications.vue ✅
- [x] Awards.vue ✅

---

## 🎯 Avantages du Nouveau Format

✅ **Traductions natives** : Pas besoin de fichiers i18n séparés pour le contenu
✅ **Un seul source de vérité** : Données + traductions au même endroit
✅ **Facilité de maintenance** : Ajouter/modifier du contenu traduit en un seul fichier
✅ **Performance** : Pas de lookup i18n supplémentaire, juste extraction selon locale
✅ **Flexibilité** : Possibilité de fallback automatique (fr → en)
✅ **Type-safe** : Structure cohérente pour TypeScript (si migration future)

---

## 🔄 Script de Migration (À Créer)

```javascript
// scripts/migrate-to-i18n.js
// Script pour migrer automatiquement les anciens JSON vers le nouveau format
// TODO: Implémenter si nécessaire
```

---

**Migration en cours... 🚧**
**Dernière mise à jour : 2026-02-18**
