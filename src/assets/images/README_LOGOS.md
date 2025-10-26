# Harena Logos

## 🎨 Design Concept: "H-Assistant"

Le logo Harena combine trois éléments clés :
- **H stylisé** : Représente la marque Harena
- **Bulle de dialogue** : Symbolise l'aspect conversationnel de l'IA
- **Graphique de tendance** : Représente l'analyse financière

### Palette de couleurs
- **Dégradé principal** : Bleu (#0ea5e9) → Violet (#a855f7)
- **Points de données** : Bleu clair → Violet foncé
- **Style** : Minimaliste, moderne, professionnel

## 📁 Fichiers disponibles

### `logo.svg` (200×200px)
Logo complet avec bulle de dialogue en arrière-plan. Idéal pour :
- Pages de chargement
- À propos / présentation
- Marketing

### `logo-icon.svg` (120×120px)
Icône seule sans bulle de dialogue. Idéal pour :
- Navbar / header
- Icône d'application
- Réseaux sociaux

### `logo-horizontal.svg` (400×120px)
Logo avec texte "Harena" à droite. Idéal pour :
- Header de site web
- Signatures email
- Documentation

### `favicon.svg` (32×32px)
Version ultra-simplifiée pour favicon. Idéal pour :
- Favicon du site
- Petites tailles (< 32px)

## 💻 Utilisation dans React

```jsx
// Import depuis assets
import Logo from '@/assets/images/logo.svg'
import LogoIcon from '@/assets/images/logo-icon.svg'
import LogoHorizontal from '@/assets/images/logo-horizontal.svg'

// Ou utilisation directe depuis public
<img src="/logo.svg" alt="Harena" />
```

## 🎯 Bonnes pratiques

- Utiliser `logo-horizontal.svg` pour les headers (meilleure lisibilité)
- Utiliser `logo-icon.svg` pour les espaces restreints
- Préserver le ratio d'aspect lors du redimensionnement
- Le logo fonctionne sur fond clair et foncé (grâce au dégradé)

## 🔄 Variantes futures possibles

- Version monochrome (blanc/noir)
- Version dark mode optimisée
- Animations SVG pour chargement
