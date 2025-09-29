# Harena Front - Assistant Financier Intelligent

Interface utilisateur pour Harena, un assistant financier intelligent basé sur l'IA.

## Stack Technique

- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State Management**:
  - React Query (TanStack Query) pour les données serveur
  - Zustand pour l'état UI global
- **Routing**: React Router v6
- **Forms**: React Hook Form + Zod
- **Charts**: Recharts
- **Icons**: Lucide React
- **UI Components**: Radix UI
- **Animations**: Framer Motion

## Installation

```bash
# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev

# Builder pour la production
npm run build

# Preview de la production
npm run preview
```

## Structure du Projet

```
src/
├── assets/           # Images, fonts, icons
├── components/       # Composants réutilisables
│   ├── ui/          # Composants de base
│   ├── charts/      # Graphiques
│   ├── forms/       # Formulaires
│   └── layout/      # Layout (Header, Sidebar)
├── features/        # Features par domaine
│   ├── dashboard/
│   ├── transactions/
│   ├── analytics/
│   └── chat/
├── hooks/           # Hooks custom
├── lib/             # Configurations
├── stores/          # Stores Zustand
├── types/           # Types TypeScript
└── styles/          # Styles globaux
```

## Développement

Le projet suit les spécifications définies dans `harena-ui-specs.md`.

### Design System

- **Couleurs**: Palette basée sur violet (#667eea - #764ba2)
- **Typographie**: Inter (texte) + JetBrains Mono (montants)
- **Responsive**: Mobile-first avec breakpoints Tailwind
- **Accessibilité**: Composants ARIA compliant via Radix UI

## Licence

Privé