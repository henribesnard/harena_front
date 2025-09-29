# 📱 SPÉCIFICATIONS COMPLÈTES DE L'INTERFACE - HARENA

## Document de Spécifications Techniques et Fonctionnelles
**Version:** 1.0  
**Date:** Septembre 2025  
**Projet:** Harena - Assistant Financier Intelligent

---

## TABLE DES MATIÈRES

1. [Vue d'ensemble](#1-vue-densemble)
2. [Stack technique](#2-stack-technique)
3. [Architecture de l'interface](#3-architecture-de-linterface)
4. [Design System](#4-design-system)
5. [Navigation et Structure](#5-navigation-et-structure)
6. [Spécifications des Pages](#6-spécifications-des-pages)
7. [Composants Réutilisables](#7-composants-réutilisables)
8. [Responsive Design](#8-responsive-design)
9. [Accessibilité](#9-accessibilité)
10. [Performance](#10-performance)
11. [États et Interactions](#11-états-et-interactions)

---

## 1. VUE D'ENSEMBLE

### 1.1 Objectifs de l'Interface

L'interface Harena doit offrir :
- **Clarté visuelle** : Information financière présentée de manière immédiatement compréhensible
- **Efficacité** : Accès rapide aux fonctionnalités les plus utilisées (< 3 clics)
- **Intelligence** : Mise en avant des insights et recommandations IA
- **Confiance** : Design professionnel et sécurisant pour données financières sensibles
- **Plaisir d'usage** : Expérience engageante avec micro-interactions et feedback visuel

### 1.2 Utilisateurs Cibles

**Profil Principal**
- Âge : 25-45 ans
- Usage : Personnel et/ou professionnel
- Niveau technique : Moyen à avancé
- Objectif : Meilleure maîtrise de leurs finances, épargne, planification

**Contextes d'Utilisation**
- Bureau (70%) : Grand écran, souris, sessions longues
- Mobile (25%) : Consultation rapide, ajout transactions
- Tablette (5%) : Mix des deux usages

---

## 2. STACK TECHNIQUE

### 2.1 Framework et Outils Recommandés

#### Frontend Framework
**Option A (Recommandée) : React 18+ avec TypeScript**
- **Justification** : Écosystème mature, performance, TypeScript pour robustesse
- **Version** : React 18.2+, TypeScript 5.0+
- **Build Tool** : Vite 4+ (rapide, moderne)

**Option B : Vue.js 3+ avec TypeScript**
- **Justification** : Courbe d'apprentissage plus douce, performance équivalente
- **Version** : Vue 3.3+, TypeScript 5.0+

#### Styling
- **Tailwind CSS 3.3+** : Utility-first, customizable, petit bundle
- **PostCSS** : Pour custom CSS si nécessaire
- **Alternative** : CSS Modules si préférence component-scoped

#### State Management
- **React Query (TanStack Query) v4+** : Gestion du cache serveur, synchronisation automatique
- **Zustand v4+** : État global UI léger (modals, sidebar, theme)
- **Alternative** : Redux Toolkit si familiarité équipe

#### Routage
- **React Router v6** : Navigation, lazy loading routes
- **OU** : TanStack Router (plus moderne, TypeScript-first)

#### Graphiques
- **Recharts 2.x** : Composants React natifs, personnalisable, TypeScript
- **Alternative** : Chart.js 4.x + react-chartjs-2 (plus d'options)

#### Formulaires
- **React Hook Form v7+** : Performance, validation facile
- **Zod v3+** : Schéma validation TypeScript-first
- **Intégration** : @hookform/resolvers pour connecter les deux

#### UI Components Library
- **shadcn/ui** : Composants basés sur Radix UI + Tailwind, copiables, customisables
  - Dialogs/Modals
  - Dropdowns
  - Tooltips
  - Popovers
  - Date Pickers
- **Lucide React** : Icônes modernes, consistantes, tree-shakeable
- **date-fns** : Manipulation dates, léger, modular

#### Data Visualization
- **Recharts** : Pour graphiques standards
- **D3.js** (si nécessaire) : Visualisations custom complexes
- **react-chartjs-2** : Alternative performante

#### Animations
- **Framer Motion** : Animations déclaratives, spring physics
- **CSS Transitions** : Pour animations simples et performantes

#### Utilities
- **clsx** / **classnames** : Conditional CSS classes
- **react-hot-toast** : Notifications toast élégantes
- **@tanstack/react-virtual** : Virtualisation listes longues

### 2.2 Structure des Dossiers

```
src/
├── assets/              # Images, fonts, icons
│   ├── images/
│   ├── icons/
│   └── fonts/
│
├── components/          # Composants réutilisables
│   ├── ui/             # Composants base (shadcn/ui)
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   └── ...
│   ├── charts/         # Composants graphiques
│   │   ├── LineChart.tsx
│   │   ├── PieChart.tsx
│   │   └── BarChart.tsx
│   ├── forms/          # Composants formulaires
│   │   ├── TransactionForm.tsx
│   │   └── BudgetForm.tsx
│   └── layout/         # Composants layout
│       ├── Header.tsx
│       ├── Sidebar.tsx
│       └── Footer.tsx
│
├── features/           # Features par domaine
│   ├── dashboard/
│   │   ├── components/
│   │   ├── hooks/
│   │   └── DashboardPage.tsx
│   ├── transactions/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── types.ts
│   │   └── TransactionsPage.tsx
│   ├── analytics/
│   ├── chat/
│   └── auth/
│
├── hooks/              # Hooks custom globaux
│   ├── useAuth.ts
│   ├── useAPI.ts
│   └── useMediaQuery.ts
│
├── lib/                # Configurations et utils
│   ├── api.ts          # API client (axios/fetch)
│   ├── queryClient.ts  # React Query config
│   └── utils.ts        # Fonctions utilitaires
│
├── stores/             # Stores Zustand
│   ├── authStore.ts
│   ├── uiStore.ts
│   └── preferencesStore.ts
│
├── types/              # Types TypeScript globaux
│   ├── api.ts
│   ├── models.ts
│   └── index.ts
│
├── styles/             # Styles globaux
│   ├── globals.css
│   └── tailwind.css
│
├── App.tsx
├── main.tsx
└── router.tsx
```

---

## 3. ARCHITECTURE DE L'INTERFACE

### 3.1 Layout Global

#### Structure de Base
```
┌─────────────────────────────────────────────┐
│              HEADER (Fixed)                 │ 80px
├─────────────────────────────────────────────┤
│                                             │
│  ┌─────────┬──────────────────────────┐   │
│  │         │                          │   │
│  │ SIDEBAR │      MAIN CONTENT        │   │
│  │         │                          │   │
│  │ 240px   │      (Responsive)        │   │
│  │         │                          │   │
│  │ (Fixed) │      (Scrollable)        │   │
│  │         │                          │   │
│  └─────────┴──────────────────────────┘   │
│                                             │
└─────────────────────────────────────────────┘
```

#### Composants de Layout

**1. Header (Hauteur fixe: 80px)**
- **Position** : Sticky top, z-index: 50
- **Background** : Gradient violet (#667eea → #764ba2)
- **Contenu** :
  - **Gauche** : Logo + Nom "Harena" (clic → Dashboard)
  - **Centre** : Barre de recherche globale (largeur: 400px desktop, cachée mobile)
  - **Droite** : 
    - Icône notifications avec badge (nombre non lus)
    - Avatar utilisateur + dropdown menu
- **Shadow** : Shadow-lg pour séparation visuelle

**2. Sidebar (Largeur: 240px)**
- **Position** : Fixed left (desktop), drawer (mobile/tablet)
- **Background** : Blanc (#ffffff) avec border-right subtile
- **Navigation Principale** :
  - Dashboard (icône: 📊)
  - Transactions (icône: 💳)
  - Analytics (icône: 📈)
  - Budget (icône: 🎯)
  - Comptes (icône: 🏦)
  - Paramètres (icône: ⚙️)
- **État actif** : Background violet clair, border-left violet foncé
- **Hover** : Background gris très clair
- **Bottom** : Chat IA (icône: 💬) toujours visible

**3. Main Content**
- **Padding** : 32px (desktop), 16px (mobile)
- **Max-width** : 1400px (centré avec margin auto)
- **Background** : Gris très clair (#f7fafc)
- **Scroll** : Smooth scroll, scroll-to-top button si > 500px

#### Responsive Breakpoints

**Desktop (≥ 1024px)**
- Sidebar visible en permanence
- Header complet avec recherche
- Layout 2-3 colonnes selon page

**Tablet (640px - 1023px)**
- Sidebar en drawer (toggle avec bouton hamburger)
- Header avec recherche condensée
- Layout 1-2 colonnes

**Mobile (< 640px)**
- Sidebar en drawer fullscreen
- Header simplifié sans recherche
- Layout 1 colonne
- Bottom navigation bar (5 icônes principales)

---

## 4. DESIGN SYSTEM

### 4.1 Palette de Couleurs

#### Couleurs Primaires
```
Primary Violet:
  - 50:  #f5f3ff
  - 100: #ede9fe
  - 200: #ddd6fe
  - 300: #c4b5fd
  - 400: #a78bfa
  - 500: #667eea (PRINCIPAL)
  - 600: #764ba2 (FONCÉ)
  - 700: #5b21b6
  - 800: #4c1d95
  - 900: #2e1065

Gradient Principal:
  linear-gradient(135deg, #667eea 0%, #764ba2 100%)
```

#### Couleurs Sémantiques
```
Success (Vert):
  - Light:  #48bb78
  - Main:   #38a169
  - Dark:   #2f855a
  - Usage:  Revenus, succès, positif

Danger (Rouge):
  - Light:  #fc8181
  - Main:   #f56565
  - Dark:   #c53030
  - Usage:  Dépenses, erreurs, alertes critiques

Warning (Orange):
  - Light:  #f6ad55
  - Main:   #f39c12
  - Dark:   #c05621
  - Usage:  Avertissements, budget proche

Info (Bleu):
  - Light:  #63b3ed
  - Main:   #3182ce
  - Dark:   #2c5282
  - Usage:  Information, astuces
```

#### Couleurs Neutres (Texte & Backgrounds)
```
Texte:
  - Principal:   #2d3748 (gray-800)
  - Secondaire:  #4a5568 (gray-700)
  - Disabled:    #a0aec0 (gray-400)
  - Placeholder: #cbd5e0 (gray-300)

Backgrounds:
  - App:         #f7fafc (gray-50)
  - Card:        #ffffff (white)
  - Hover:       #edf2f7 (gray-100)
  - Border:      #e2e8f0 (gray-200)
  - Divider:     #cbd5e0 (gray-300)
```

#### Catégories de Transactions (Couleurs Spécifiques)
```
Salary:         #48bb78 (vert)
Food:           #f6ad55 (orange)
Transport:      #4299e1 (bleu)
Housing:        #ed8936 (orange foncé)
Entertainment:  #9f7aea (violet)
Healthcare:     #ed64a6 (rose)
Shopping:       #4299e1 (bleu ciel)
Utilities:      #667eea (violet principal)
Savings:        #38a169 (vert foncé)
Other:          #718096 (gris)
```

### 4.2 Typographie

#### Famille de Polices
```
Primary Font:
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 
               'Segoe UI', Roboto, 'Helvetica Neue', Arial, 
               sans-serif;

Monospace (Montants):
  font-family: 'JetBrains Mono', 'Fira Code', 
               'Courier New', monospace;
  font-feature-settings: 'tnum' 1; // Tabular numbers
```

#### Échelle Typographique
```
Display (Titres pages):
  - Size:   48px (3rem)
  - Weight: 700 (Bold)
  - Line:   1.2
  - Usage:  Titres principaux, landing

H1 (Titres sections):
  - Size:   32px (2rem)
  - Weight: 700 (Bold)
  - Line:   1.25
  - Usage:  Titres de pages

H2 (Sous-titres):
  - Size:   24px (1.5rem)
  - Weight: 600 (Semibold)
  - Line:   1.33
  - Usage:  Sections dans pages

H3 (Titres cards):
  - Size:   20px (1.25rem)
  - Weight: 600 (Semibold)
  - Line:   1.4
  - Usage:  Titres de cards, modals

Body Large:
  - Size:   18px (1.125rem)
  - Weight: 400 (Regular)
  - Line:   1.5
  - Usage:  Texte important

Body (Standard):
  - Size:   16px (1rem)
  - Weight: 400 (Regular)
  - Line:   1.5
  - Usage:  Texte principal, paragraphes

Body Small:
  - Size:   14px (0.875rem)
  - Weight: 400 (Regular)
  - Line:   1.43
  - Usage:  Labels, descriptions

Caption:
  - Size:   12px (0.75rem)
  - Weight: 400 (Regular)
  - Line:   1.33
  - Usage:  Timestamps, helper text

Montants (Spécial):
  - Size:   Variable (24-48px selon contexte)
  - Weight: 700 (Bold)
  - Font:   Monospace avec tabular-nums
  - Usage:  Valeurs financières
```

### 4.3 Espacements

#### Système d'Espacement (basé sur 4px)
```
Échelle Tailwind:
  0:   0px
  1:   4px    (0.25rem)
  2:   8px    (0.5rem)
  3:   12px   (0.75rem)
  4:   16px   (1rem)     ← Standard gap
  5:   20px   (1.25rem)
  6:   24px   (1.5rem)   ← Card padding
  8:   32px   (2rem)     ← Section spacing
  10:  40px   (2.5rem)
  12:  48px   (3rem)
  16:  64px   (4rem)     ← Large section spacing
  20:  80px   (5rem)
  24:  96px   (6rem)
```

#### Règles d'Usage
- **Entre éléments inline** : 8px (space-x-2)
- **Entre éléments en colonne** : 16px (space-y-4)
- **Padding cards** : 24px (p-6)
- **Padding page** : 32px desktop (p-8), 16px mobile (p-4)
- **Gap grids** : 20px (gap-5)
- **Margin sections** : 32-48px (my-8 à my-12)

### 4.4 Élévation et Ombres

```css
Shadow System:

shadow-sm:
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  Usage: Hover subtil, inputs

shadow:
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1),
              0 1px 2px 0 rgba(0, 0, 0, 0.06);
  Usage: Cards standards

shadow-md:
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
              0 2px 4px -1px rgba(0, 0, 0, 0.06);
  Usage: Cards hover, dropdowns

shadow-lg:
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
              0 4px 6px -2px rgba(0, 0, 0, 0.05);
  Usage: Modals, header

shadow-xl:
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
              0 10px 10px -5px rgba(0, 0, 0, 0.04);
  Usage: Large modals, important elements

shadow-2xl:
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  Usage: Popovers, tooltips flottants
```

### 4.5 Bordures et Radius

```css
Border Radius:
  rounded-sm:   2px   (très subtil)
  rounded:      4px   (standard inputs)
  rounded-md:   6px   (boutons)
  rounded-lg:   8px   (cards petites)
  rounded-xl:   12px  (cards standards)
  rounded-2xl:  16px  (cards importantes)
  rounded-3xl:  24px  (éléments hero)
  rounded-full: 9999px (avatars, pills)

Border Width:
  border:    1px (standard)
  border-2:  2px (focus, actif)
  border-4:  4px (emphase forte)

Border Colors:
  Normale:  gray-200 (#e2e8f0)
  Hover:    gray-300 (#cbd5e0)
  Focus:    violet-500 (#667eea)
  Error:    red-500 (#f56565)
  Success:  green-500 (#48bb78)
```

### 4.6 Iconographie

**Bibliothèque** : Lucide React
**Taille par Défaut** : 20px (1.25rem)
**Stroke Width** : 2px

```typescript
Tailles Standards:
  - xs:  12px (0.75rem)  // Indicateurs
  - sm:  16px (1rem)     // Inline text
  - md:  20px (1.25rem)  // Standard
  - lg:  24px (1.5rem)   // Boutons importants
  - xl:  32px (2rem)     // Headers, features
  - 2xl: 48px (3rem)     // Empty states, hero
```

**Utilisation Sémantique**
- Navigation : icons à gauche du texte
- Boutons d'action : icons selon contexte (save, delete, edit)
- Status : icons colorées (check, warning, info, error)
- Empty states : large icons (2xl) avec couleur grise

---

## 5. NAVIGATION ET STRUCTURE

### 5.1 Menu Principal (Sidebar)

#### Structure Hiérarchique
```
Navigation Principale:
├─ 📊 Dashboard           [/dashboard]
├─ 💳 Transactions        [/transactions]
├─ 📈 Analytics           [/analytics]
├─ 🎯 Budget & Objectifs  [/budget]
├─ 🏦 Comptes             [/accounts]
└─ ⚙️ Paramètres          [/settings]

Toujours Visible (Bottom):
└─ 💬 Assistant IA        [/chat ou expandable]
```

#### Spécifications par Item

**Chaque Item de Navigation**
- **Hauteur** : 48px
- **Padding** : 12px 16px
- **Gap icon-text** : 12px
- **Border-radius** : 8px (rounded-lg)
- **Transition** : all 200ms ease-in-out

**États**
```css
Default:
  background: transparent
  color: gray-700
  icon: gray-500

Hover:
  background: gray-100
  color: gray-900
  icon: gray-700
  transform: translateX(4px)

Active:
  background: violet-50
  color: violet-700
  icon: violet-600
  border-left: 4px solid violet-600
  font-weight: 600

Focus (Keyboard):
  outline: 2px solid violet-500
  outline-offset: 2px
```

### 5.2 Menu Utilisateur (Dropdown Header)

**Déclencheur** : Avatar + Nom (si espace) + ChevronDown icon

**Contenu Dropdown**
```
┌──────────────────────────────┐
│ Jean Dupont                  │  (Nom + email en petit)
│ jean.dupont@example.com      │
├──────────────────────────────┤
│ 👤 Mon Profil                │
│ ⚙️ Paramètres                │
│ 🔔 Notifications             │
│ ❓ Aide                       │
├──────────────────────────────┤
│ 🚪 Se déconnecter            │
└──────────────────────────────┘
```

**Spécifications**
- **Width** : 240px
- **Position** : Absolute, aligné droite sous avatar
- **Padding items** : 12px 16px
- **Shadow** : shadow-lg
- **Border-radius** : 12px
- **Animation** : Fade + slide down (150ms)

### 5.3 Breadcrumbs (Optionnel selon page)

**Usage** : Pages avec sous-navigation (ex: Transactions > Détails)

**Structure**
```
Dashboard / Transactions / Transaction #1234
```

**Spécifications**
- **Position** : Sous le header, au-dessus du titre page
- **Séparateur** : ChevronRight icon (16px)
- **Couleur** : 
  - Items : gray-500
  - Item actif : gray-900, font-weight: 600
- **Hover** : underline, color: violet-600
- **Font-size** : 14px

### 5.4 Navigation Mobile (Bottom Bar)

**Visible uniquement** : < 640px (mobile)

**Structure (5 items)**
```
┌──────┬──────┬──────┬──────┬──────┐
│  📊  │  💳  │  ➕  │  📈  │  👤  │
│ Home │Trans │ Add  │Stats │ Menu │
└──────┴──────┴──────┴──────┴──────┘
```

**Spécifications**
- **Height** : 64px
- **Position** : Fixed bottom, z-index: 40
- **Background** : white avec shadow-top
- **Items** :
  - Largeur égale (20% chacun)
  - Icon size: 24px
  - Label en dessous: 12px
  - Active: color violet, font-weight: 600
- **Bouton central "+"** : 
  - Plus grand (56px diameter)
  - Position: absolute, top: -28px (déborde vers haut)
  - Background: gradient violet
  - Shadow: shadow-xl
  - Action: Ouvre modal ajout rapide transaction

---

## 6. SPÉCIFICATIONS DES PAGES

### 6.1 PAGE DASHBOARD (`/dashboard`)

#### Layout Général
```
┌─────────────────────────────────────────────────┐
│  Page Title: "Tableau de Bord"          [32px] │
│  Subtitle: "Bonjour Jean, voici votre vue..."  │
├─────────────────────────────────────────────────┤
│                                                 │
│  ┌──────── Balance Cards (Grid 3 cols) ──────┐│
│  │ [Solde Total] [Revenus] [Dépenses]        ││
│  └────────────────────────────────────────────┘│
│                                                 │
│  ┌─────── Main Content (70%) ─────┬─ Sidebar ─┐
│  │                                 │  (30%)    │
│  │ [Graphique Évolution]          │           │
│  │ Height: 350px                  │ [Alertes] │
│  │                                 │           │
│  ├─────────────────────────────────┤           │
│  │                                 │[Prévision]│
│  │ [Transactions Récentes]        │           │
│  │ - Liste 10 dernières           │           │
│  │ - Pagination                   │ [Chat IA] │
│  │                                 │           │
│  └─────────────────────────────────┴───────────┘
│                                                 │
└─────────────────────────────────────────────────┘
```

#### Composant : Balance Cards

**Structure (3 cards côte à côte)**

**Card 1 : Solde Total**
- **Background** : Gradient violet principal
- **Couleur texte** : Blanc
- **Contenu** :
  - Label "Solde Total" (14px, opacity 90%)
  - Montant en grand (32px, bold, monospace)
  - Variation "+2 340 € ce mois" avec flèche ↑
  - Mini sparkline (optionnel, 7 derniers jours)
- **Dimensions** : Height: 140px, padding: 24px
- **Shadow** : shadow-lg avec teinte violette
- **Animation hover** : translateY(-4px), shadow-xl

**Card 2 : Revenus**
- **Background** : Dégradé vert léger (#f0fff4 → #c6f6d5)
- **Couleur texte** : Vert foncé (#2f855a)
- **Contenu** :
  - Label "Revenus du Mois"
  - Montant principal
  - Variation "↑ +5.2% vs mois dernier"
  - Icône 💰 ou TrendingUp (top-right, grande, opacity 20%)
- **Dimensions** : Identique Card 1

**Card 3 : Dépenses**
- **Background** : Dégradé rouge/orange léger (#fff5f5 → #fed7d7)
- **Couleur texte** : Rouge foncé (#c53030)
- **Contenu** :
  - Label "Dépenses du Mois"
  - Montant principal
  - Variation "↓ -12% vs mois dernier" (vert si baisse)
  - Icône 💸 ou TrendingDown
- **Dimensions** : Identique Card 1

**Responsive** :
- Desktop (≥1024px) : 3 colonnes
- Tablet (640-1023px) : 2 colonnes (solde seul en haut)
- Mobile (<640px) : 1 colonne empilée

#### Composant : Graphique Évolution Financière

**Type** : Line Chart (double courbe)

**Dimensions**
- **Container height** : 350px (desktop), 250px (mobile)
- **Width** : 100% du container (responsive)
- **Padding** : 16px
- **Background** : Blanc (card)
- **Border-radius** : 16px (rounded-2xl)

**Données Affichées**
- **Période** : 9 derniers mois (axes X)
- **Courbe 1** : Revenus mensuels
  - Couleur : #48bb78 (vert)
  - Stroke-width : 3px
  - Fill : gradient transparent (#48bb78 20% → transparent)
- **Courbe 2** : Dépenses mensuelles
  - Couleur : #f56565 (rouge)
  - Stroke-width : 3px
  - Fill : gradient transparent (#f56565 20% → transparent)

**Interactions**
- **Hover** : Tooltip affichant valeur exacte + date
- **Légende** : Interactive (clic pour toggle courbe)
- **Zoom** : Pinch/scroll pour zoom (optionnel)
- **Export** : Bouton dans header "Télécharger PNG"

**Header du Graphique**
```
┌────────────────────────────────────────────┐
│ 📊 Évolution Financière  [⬇️ PNG] [⚙️]    │
│ Période: Sep 2024 - Sep 2025              │
├────────────────────────────────────────────┤
│          [Graphique]                       │
│                                            │
└────────────────────────────────────────────┘
```

**Configuration (Bouton ⚙️)**
- Changer période (6 mois, 12 mois, année)
- Type de graphique (ligne, aires, barres)
- Afficher/masquer courbes
- Annotations (salaire, loyer)

#### Composant : Transactions Récentes

**Structure** : Tableau/Liste

**Header**
```
┌────────────────────────────────────────────┐
│ 💳 Transactions Récentes                   │
│ [Filtres ▼] [Recherche 🔍] [Voir tout →]  │
├────────────────────────────────────────────┤
```

**Liste des Transactions (10 items max)**

Chaque ligne contient :
```
┌──────────────────────────────────────────────┐
│ [Icône] [Nom]           [Catégorie] [Montant]│
│  🛒    Carrefour          Food      -87,50 € │
│        28 Sept 2025                           │
└──────────────────────────────────────────────┘
```

**Détails par Élément**
- **Icône** : 
  - Circle 40px diameter
  - Background : couleur catégorie (opacity 20%)
  - Icône catégorie centrée (20px)
- **Nom** : 
  - Font-size: 16px, font-weight: 600
  - Couleur : gray-900
- **Date** : 
  - Font-size: 14px
  - Couleur : gray-500
  - Format : "il y a 2 jours" ou "28 Sept 2025"
- **Catégorie** :
  - Badge pill avec couleur catégorie
  - Font-size: 12px, padding: 4px 12px
- **Montant** :
  - Font-size: 16px, font-weight: 700, monospace
  - Couleur : rouge si négatif, vert si positif
  - Aligné droite

**États**
- **Hover** : Background gray-50, cursor pointer
- **Click** : Ouvre modal détails transaction

**Footer**
- Pagination : "Affichage 1-10 sur 247"
- Bouton "Voir toutes les transactions →"

#### Sidebar Droite (30% largeur)

**Section 1 : Alertes**

```
┌──────────────────────────────────┐
│ 🔔 Alertes (3)                   │
├──────────────────────────────────┤
│ ┌────────────────────────────┐  │
│ │ ⚠️ Budget Dépassé          │  │
│ │ Vos dépenses alimentaires  │  │
│ │ dépassent le budget de 15% │  │
│ │ [×]                    2h   │  │
│ └────────────────────────────┘  │
│                                  │
│ ┌────────────────────────────┐  │
│ │ 💡 Opportunité d'Épargne   │  │
│ │ Vous pouvez épargner 450€  │  │
│ │ ce mois selon vos habitudes│  │
│ │ [×]                   1j    │  │
│ └────────────────────────────┘  │
│                                  │
│ [Voir toutes les alertes →]     │
└──────────────────────────────────┘
```

**Spécifications Alertes**
- **Max height** : 300px avec scroll
- **Gap entre alertes** : 12px
- **Chaque alerte** :
  - Padding : 16px
  - Border-radius : 12px
  - Border-left : 4px (couleur selon niveau)
  - Background : couleur très claire selon niveau
  - Icône : 20px en haut à gauche
  - Bouton close : top-right
  - Timestamp : bottom-right, 12px, gray-500

**Section 2 : Prévisions IA**

```
┌──────────────────────────────────┐
│ 🔮 Prévisions IA                 │
├──────────────────────────────────┤
│ ┌────────────────────────────┐  │
│ │ Solde prévu fin du mois    │  │
│ │ 46 780 €                   │  │
│ │ ████████░░ 89% confiance   │  │
│ │ Basé sur 6 mois            │  │
│ └────────────────────────────┘  │
│                                  │
│ ┌────────────────────────────┐  │
│ │ Dépenses prévues Octobre   │  │
│ │ 4 320 €                    │  │
│ │ ████████░░ 85%             │  │
│ └────────────────────────────┘  │
│                                  │
│ ┌────────────────────────────┐  │
│ │ Capacité d'épargne         │  │
│ │ 580 €/mois                 │  │
│ │ Recommandation optimale    │  │
│ └────────────────────────────┘  │
└──────────────────────────────────┘
```

**Spécifications Prévisions**
- **Gap entre cards** : 16px
- **Chaque card** :
  - Background : gradient gris très léger
  - Padding : 20px
  - Border-radius : 12px
  - Label : 14px, gray-600
  - Valeur : 24px, bold, gray-900
  - Barre confiance : height 6px, rounded-full
  - Sous-texte : 12px, gray-500

**Section 3 : Chat IA Widget**

```
┌──────────────────────────────────┐
│ 💬 Assistant IA                  │
│ [−] (collapse/expand)            │
├──────────────────────────────────┤
│ [Zone Messages]                  │
│ Height: 300px                    │
│ Scrollable                       │
│                                  │
│ 🤖 Bonjour! Comment puis-je...  │
│                                  │
│            Quelle est ma plus    │
│            grosse dépense? 👤    │
│                                  │
│ 🤖 Votre plus grosse dépense...  │
│                                  │
├──────────────────────────────────┤
│ [Input message]        [Envoyer] │
└──────────────────────────────────┘
```

**Spécifications Chat**
- **Expandable** : Clic sur header pour collapse/expand
- **Height** : 400px (expanded), 48px (collapsed)
- **Messages** :
  - User : bulle droite, violet, blanc text
  - IA : bulle gauche, gray-100, gray-900 text
  - Border-radius : 12px avec un côté droit/gauche à 4px
  - Max-width : 80%
  - Padding : 12px 16px
  - Gap : 12px entre messages
- **Input** :
  - Height : 48px
  - Border-top : 1px gray-200
  - Placeholder : "Posez votre question..."
  - Bouton envoyer : icon avion, violet
- **Loading** : "L'assistant réfléchit..." avec dots animés

---

### 6.2 PAGE TRANSACTIONS (`/transactions`)

#### Layout Global
```
┌─────────────────────────────────────────────────┐
│  💳 Transactions                    [+ Ajouter] │
├─────────────────────────────────────────────────┤
│  [Stats rapides: 247 trans | 15,340€ | -8,920€]│
├─────────────────────────────────────────────────┤
│  [Barre de Filtres] ▼ (collapsible)            │
│  Période | Type | Catégorie | Montant | 🔍     │
├─────────────────────────────────────────────────┤
│                                                 │
│  [Tableau des Transactions]                    │
│  ☐ | Date | Description | Catégorie | Type |  │
│     Montant | Actions                          │
│                                                 │
│  [Pagination: 1 2 3 ... 25]                    │
│                                                 │
└─────────────────────────────────────────────────┘
```

#### Barre de Filtres (Collapsible)

**État Collapsed (Par défaut sur mobile)**
```
[🔍 Filtres (3 actifs)] [▼]    [Réinitialiser]
```

**État Expanded**
```
┌──────────────────────────────────────────────┐
│ Filtres Avancés                    [×] Fermer│
├──────────────────────────────────────────────┤
│ Période:                                     │
│ [Date début] → [Date fin]    [Ce mois ▼]   │
│                                              │
│ Type de Transaction:                         │
│ ☐ Tous  ☑ Revenus  ☑ Dépenses  ☐ Virements │
│                                              │
│ Catégories (multi-select):                  │
│ ☑ Food  ☐ Transport  ☑ Shopping  ☐ ...     │
│                                              │
│ Montant:                                     │
│ [——○————○——]  0 € → 1000 €                  │
│                                              │
│ Recherche par texte:                         │
│ [🔍 Description, commerçant...___________]   │
│                                              │
│ [Réinitialiser]           [Appliquer Filtres]│
└──────────────────────────────────────────────┘
```

**Spécifications**
- **Animation** : Slide down/up (250ms ease)
- **Background** : gray-50
- **Padding** : 24px
- **Border-radius** : 12px
- **Gap entre lignes** : 20px
- **Badges filtres actifs** : Affichés sous la barre quand collapsed
  - Ex: "Période: Sep 2025" [×] "Type: Revenus" [×]
  - Clic sur [×] pour retirer filtre

#### Tableau des Transactions

**Header du Tableau**
```
┌──┬─────────┬──────────────┬──────────┬──────┬─────────┬────────┐
│☐ │ Date ▼▲│ Description  │ Catégorie│ Type │ Montant │ Actions│
└──┴─────────┴──────────────┴──────────┴──────┴─────────┴────────┘
```

**Spécifications Header**
- **Background** : gray-100
- **Font-weight** : 600
- **Font-size** : 14px
- **Padding** : 12px 16px
- **Border-bottom** : 2px solid gray-200
- **Tri** : Icônes ▼▲ sur colonnes triables
- **Checkbox** : Sélection toutes

**Ligne de Transaction (Exemple)**
```
┌──┬─────────┬──────────────┬──────────┬──────┬─────────┬────────┐
│☐ │28/09/25 │🛒 Carrefour  │ [Food]   │  💸  │ -87,50€│ [⋮]    │
│  │10:45    │              │          │      │         │        │
└──┴─────────┴──────────────┴──────────┴──────┴─────────┴────────┘
```

**Détails par Colonne**

1. **Checkbox** (40px)
   - Pour sélection multiple
   - Actions groupées : supprimer, exporter

2. **Date** (120px)
   - Format : DD/MM/YY
   - Heure en dessous (14px, gray-500)
   - Tri par défaut : descendant (plus récent)

3. **Description** (flex-grow, min 200px)
   - Icône catégorie à gauche (32px circle)
   - Nom en bold (16px)
   - Si trop long : ellipsis avec tooltip

4. **Catégorie** (120px)
   - Badge pill avec couleur
   - Centré verticalement

5. **Type** (80px)
   - Icône simple :
     - ↗️ Revenu (vert)
     - ↙️ Dépense (rouge)
     - ⇄ Virement (bleu)

6. **Montant** (120px)
   - Aligné droite
   - Monospace, bold
   - Couleur selon type
   - Format : espace milliers

7. **Actions** (80px)
   - Bouton menu "⋮" (3 dots vertical)
   - Dropdown :
     - ✏️ Modifier
     - 📋 Dupliquer
     - 🗑️ Supprimer
     - 📄 Voir reçu (si existe)

**États des Lignes**
- **Default** : Background white
- **Hover** : Background gray-50
- **Selected** : Background violet-50, border-left violet
- **Alternance** : Option pour alterner gray-50/white

#### Actions Groupées (si sélection multiple)

**Barre flottante en bas**
```
┌────────────────────────────────────────────┐
│ 3 transactions sélectionnées               │
│ [Exporter CSV] [Supprimer] [Annuler]      │
└────────────────────────────────────────────┘
```

#### Pagination

**Positionnement** : Bottom de la page

**Structure**
```
Affichage 1-20 sur 247 transactions

[10 ▼] par page    [◀ Précédent]  [1] 2 3 ... 13  [Suivant ▶]
```

**Spécifications**
- **Options par page** : 10, 20, 50, 100
- **Page actuelle** : Background violet, blanc text
- **Autres pages** : Hover background gray-100
- **Ellipsis** : "..." si trop de pages
- **Disabled** : Si première/dernière page

#### Modal Ajout/Modification Transaction

**Trigger** : Bouton "+ Ajouter" (top-right) ou Edit dans tableau

**Structure du Modal**
```
┌────────────────────────────────────────────┐
│  ➕ Nouvelle Transaction        [× Fermer] │
├────────────────────────────────────────────┤
│                                            │
│  Montant *                                 │
│  [_____________] €                         │
│                                            │
│  Description *                             │
│  [_______________________________]         │
│                                            │
│  Type de Transaction *                     │
│  ⚪ Revenu   ⚪ Dépense   ⚪ Virement       │
│                                            │
│  Catégorie *                               │
│  [Sélectionner ▼__________________]        │
│                                            │
│  Date *                                    │
│  [📅 29/09/2025_________________]          │
│                                            │
│  Compte                                    │
│  [Compte Courant ▼_______________]         │
│                                            │
│  Notes (optionnel)                         │
│  [________________________________]        │
│  [________________________________]        │
│                                            │
│  Pièce jointe                              │
│  [📎 Ajouter un reçu/facture]              │
│                                            │
├────────────────────────────────────────────┤
│                    [Annuler]  [Enregistrer]│
└────────────────────────────────────────────┘
```

**Spécifications**
- **Width** : 600px (desktop), 90% (mobile fullscreen)
- **Max-height** : 90vh avec scroll interne
- **Background** : white
- **Overlay** : rgba(0,0,0,0.5)
- **Animation** : Fade + scale (0.95 → 1)

**Validations en Temps Réel**
- **Montant** : 
  - Required
  - Format : max 2 décimales
  - Message erreur : "Le montant doit être positif"
- **Description** :
  - Required
  - Min 3 caractères
  - Max 255 caractères
- **Type & Catégorie** : Required
- **Date** : Format valide, pas dans futur (configurable)

**Interactions**
- **Catégorie** : Affichage icônes + couleurs dans select
- **Date** : Date picker avec calendrier
- **Upload fichier** : 
  - Drag & drop zone
  - Max 5MB
  - Formats : JPG, PNG, PDF
  - Preview si image

**Actions**
- **Annuler** : Ferme sans sauver (confirmation si modifié)
- **Enregistrer** : 
  - Validation complète
  - Loading state pendant sauvegarde
  - Toast success "Transaction ajoutée ✓"
  - Fermeture automatique
  - Refresh de la liste

---

### 6.3 PAGE ANALYTICS (`/analytics`)

#### Layout Global
```
┌─────────────────────────────────────────────────┐
│  📈 Analytics                                   │
│  [Sélecteur Période: Ce mois ▼] [Export PDF ⬇]│
├─────────────────────────────────────────────────┤
│                                                 │
│  [KPI Cards: 4 colonnes]                       │
│  Revenus | Dépenses | Épargne | Taux          │
│                                                 │
├─────────────────────────────────────────────────┤
│                                                 │
│  ┌────────────────────┬──────────────────────┐ │
│  │ Répartition        │  Top 5 Catégories    │ │
│  │ des Dépenses       │  [Tableau]           │ │
│  │ [Pie Chart]        │                      │ │
│  └────────────────────┴──────────────────────┘ │
│                                                 │
│  [Évolution Temporelle par Catégorie]          │
│  [Stacked Area Chart]                          │
│                                                 │
│  [Patterns Détectés & Recommandations]         │
│                                                 │
└─────────────────────────────────────────────────┘
```

#### KPI Cards (4 colonnes)

**Structure Identique pour Chaque Card**
```
┌─────────────────────────┐
│ Label                   │
│ Valeur Principale       │
│ ▲ +12.5% vs période     │
│ ████████░░ Progress     │
└─────────────────────────┘
```

**Card 1 : Revenus Totaux**
- Montant en grand (28px)
- Variation vs mois précédent
- Progress bar vers objectif (si défini)
- Couleur : vert

**Card 2 : Dépenses Totales**
- Montant
- Variation
- Progress vs budget total
- Couleur : rouge/orange

**Card 3 : Épargne Nette**
- Revenus - Dépenses
- Variation
- Progress vers objectif épargne
- Couleur : bleu

**Card 4 : Taux d'Épargne**
- Pourcentage (épargne/revenus)
- Comparison objectif (20% recommandé)
- Jauge circulaire (donut)
- Couleurs : gradient selon %

#### Section Répartition (Grid 2 colonnes)

**Colonne Gauche : Pie/Donut Chart**
- **Title** : "Répartition des Dépenses"
- **Type** : Donut chart (plus moderne que pie)
- **Dimensions** : 300x300px
- **Couleurs** : Selon catégories prédéfinies
- **Légende** : 
  - Droite ou en bas selon espace
  - Interactive (clic pour highlight segment)
  - Format : "Catégorie - Montant (X%)"
- **Interactions** :
  - Hover : Highlight segment + tooltip
  - Click segment : Filter transactions cette catégorie

**Colonne Droite : Top 5 Catégories**
- **Format** : Tableau avec barres horizontales

```
┌────────────────────────────────────┐
│ Top 5 Catégories de Dépenses      │
├────────────────────────────────────┤
│ 🏠 Housing        1,200€  ████████ │
│ 🍔 Food             780€  █████    │
│ 🚗 Transport        450€  ███      │
│ 🎬 Entertainment    320€  ██       │
│ 🛍️ Shopping         280€  ██       │
└────────────────────────────────────┘
```

**Spécifications**
- Icône catégorie à gauche (24px)
- Nom catégorie (16px, medium)
- Montant (16px, bold, monospace)
- Barre de progression :
  - Largeur proportionnelle au max
  - Height : 24px
  - Couleur catégorie avec opacity
  - Rounded
- Click : Drill-down vers transactions

#### Évolution Temporelle par Catégorie

**Type** : Stacked Area Chart

**Dimensions**
- Height : 400px
- Width : 100% container

**Données**
- Axe X : Mois (6-12 derniers)
- Axe Y : Montant cumulé
- Aires empilées par catégorie
- Couleurs : Palette catégories

**Légende Interactive**
- Sous le graphique
- Chips cliquables
- Toggle visibilité catégories
- "Tout afficher" / "Masquer tout"

**Interactions**
- Hover : Tooltip détaillé par catégorie
- Click légende : Toggle catégorie
- Zoom : Pinch ou boutons +/-

#### Section Patterns & Recommandations

**Structure : Cards en liste verticale**

```
┌──────────────────────────────────────────┐
│ 🔍 Patterns Détectés                     │
├──────────────────────────────────────────┤
│ ┌────────────────────────────────────┐  │
│ │ 🔄 Dépenses Récurrentes Identifiées│  │
│ │ • Loyer: 1,200€ tous les 30 jours  │  │
│ │ • Netflix: 15.99€ tous les mois    │  │
│ │ • Salle de sport: 49€ mensuel      │  │
│ └────────────────────────────────────┘  │
│                                          │
│ ┌────────────────────────────────────┐  │
│ │ 📊 Tendances                       │  │
│ │ • Vos dépenses Food ↗️ +20% ce mois│  │
│ │ • Transport ↘️ -15% (bon travail!) │  │
│ └────────────────────────────────────┘  │
│                                          │
│ ┌────────────────────────────────────┐  │
│ │ 💡 Recommandations                 │  │
│ │ • Vos dépenses samedi sont 2x plus│  │
│ │   élevées que les autres jours     │  │
│ │ • Opportunité d'économie: 150€/mois│  │
│ │   en réduisant sorties restaurants │  │
│ └────────────────────────────────────┘  │
└──────────────────────────────────────────┘
```

#### Export & Rapports

**Bouton "Export PDF"** (top-right)

**Modal Export Options**
```
┌────────────────────────────────────┐
│ 📄 Générer un Rapport              │
├────────────────────────────────────┤
│ Template:                          │
│ ⚪ Rapport Mensuel                 │
│ ⚪ Rapport Annuel                  │
│ ⚪ Rapport Personnalisé            │
│                                    │
│ Période:                           │
│ [01/09/2025] → [30/09/2025]       │
│                                    │
│ Inclure:                           │
│ ☑ Graphiques                       │
│ ☑ Tableaux de détails              │
│ ☑ Recommandations                  │
│ ☐ Toutes les transactions         │
│                                    │
│ [Annuler]        [Générer PDF ⬇️]  │
└────────────────────────────────────┘
```

---

### 6.4 PAGE BUDGET & OBJECTIFS (`/budget`)

#### Layout Global
```
┌─────────────────────────────────────────────────┐
│  🎯 Budget & Objectifs                          │
│  [Onglet: Budgets] [Onglet: Objectifs]         │
├─────────────────────────────────────────────────┤
│  ONGLET BUDGETS                                 │
│                                                 │
│  [Vue Globale: Jauge Budget Total]             │
│                                                 │
│  [Liste Budgets par Catégorie]                 │
│  + Ajouter un budget                           │
│                                                 │
└─────────────────────────────────────────────────┘
```

#### Onglet 1 : Budgets

**Vue Globale (En-tête)**
```
┌────────────────────────────────────────────────┐
│ Budget Global du Mois                          │
│                                                │
│ Utilisé: 2,850€ / 3,500€ Budget Total          │
│                                                │
│ ████████████░░░░░░  81.4%                      │
│                                                │
│ Restant: 650€  |  Jours restants: 8           │
│ Dépenses quotidiennes suggérées: 81.25€/jour  │
└────────────────────────────────────────────────┘
```

**Spécifications**
- **Background** : Gradient léger selon état
  - < 70% : vert
  - 70-90% : orange
  - > 90% : rouge
- **Barre de progression** :
  - Height : 32px
  - Rounded-full
  - Couleur dynamique
  - Animation au chargement

**Liste des Budgets par Catégorie**

**Card Budget (Répétée pour chaque catégorie)**
```
┌────────────────────────────────────────────────┐
│ 🍔 Food                              [⋮] [✏️]  │
├────────────────────────────────────────────────┤
│ Budget: 500€/mois                              │
│                                                │
│ Dépensé: 420€  |  Restant: 80€                │
│                                                │
│ ████████████████░░  84%                        │
│                                                │
│ ⚠️ Attention: Vous approchez de votre budget  │
│                                                │
│ [Mini graphique 30 derniers jours]             │
│ Moyenne/jour: 14€                              │
└────────────────────────────────────────────────┘
```

**États de la Barre**
- < 70% : Vert, message "Vous gérez bien!"
- 70-90% : Orange, message "Attention au budget"
- 90-100% : Rouge, message "Limite proche"
- > 100% : Rouge foncé, message "Budget dépassé!"

**Actions**
- **⋮ Menu** :
  - Modifier budget
  - Voir détails/transactions
  - Historique des 6 derniers mois
  - Supprimer budget
- **✏️ Édition inline** : Click pour modifier montant

**Formulaire Ajout Budget (Modal ou Inline)**
```
┌────────────────────────────────────┐
│ + Ajouter un Budget                │
├────────────────────────────────────┤
│ Catégorie:                         │
│ [Sélectionner ▼____________]       │
│                                    │
│ Montant mensuel:                   │
│ [____________] €                   │
│                                    │
│ Renouvellement:                    │
│ ⚪ Mensuel  ⚪ Annuel               │
│                                    │
│ Rollover surplus:                  │
│ ☑ Reporter le surplus au mois      │
│   suivant                          │
│                                    │
│ [Annuler]          [Créer Budget]  │
└────────────────────────────────────┘
```

#### Onglet 2 : Objectifs d'Épargne

**Liste des Objectifs**

**Card Objectif (Exemple)**
```
┌────────────────────────────────────────────────┐
│ 🏖️ Vacances Été 2026              [⋮] [✏️]    │
├────────────────────────────────────────────────┤
│ Objectif: 3,000€  |  Date: 30 Juin 2026       │
│                                                │
│ Progression: 1,250€ / 3,000€                   │
│                                                │
│ ████████░░░░░░░░░░░░░░  41.7%                  │
│                                                │
│ Restant: 1,750€  |  Mois restants: 9          │
│ Contribution mensuelle nécessaire: 194.44€    │
│                                                │
│ ✅ Contribution automatique: 200€/mois         │
│                                                │
│ [Contribuer 💰]              [Voir Historique] │
└────────────────────────────────────────────────┘
```

**Spécifications**
- **Image/Icône** : Grande, top-left
- **Progress bar** :
  - Height : 24px
  - Gradient de couleur selon %
  - Animation smooth lors updates
- **Badges** :
  - "En avance" : vert si > projection
  - "À risque" : orange si < projection
  - "Atteint!" : confettis animation

**Bouton "Contribuer"**
- Ouvre modal quick-add
- Input montant pré-rempli avec suggestion
- Option : "Contribuer maintenant" ou "Planifier contribution automatique"

**Modal Ajout Objectif**
```
┌────────────────────────────────────┐
│ 🎯 Nouvel Objectif d'Épargne       │
├────────────────────────────────────┤
│ Nom de l'objectif:                 │
│ [______________________________]   │
│                                    │
│ Description:                       │
│ [______________________________]   │
│                                    │
│ Montant cible:                     │
│ [____________] €                   │
│                                    │
│ Date cible:                        │
│ [📅 30/06/2026______________]      │
│                                    │
│ Contribution mensuelle souhaitée:  │
│ [____________] €                   │
│ (Calculé auto: 200€ recommandés)   │
│                                    │
│ Catégorie / Icône:                 │
│ [Voyage ▼] [🏖️ ▼]                 │
│                                    │
│ Priorité:                          │
│ ⚪ Basse  ⚪ Moyenne  ⚪ Haute      │
│                                    │
│ [Annuler]            [Créer]       │
└────────────────────────────────────┘
```

**Vue "Tous les Objectifs" (Alternative : Kanban)**
```
┌──────────┬──────────┬──────────┬──────────┐
│ À Démarrer│ En Cours │ Presque  │ Atteints │
│          │          │ Atteints │          │
├──────────┼──────────┼──────────┼──────────┤
│ [Card]   │ [Card]   │ [Card]   │ [Card]   │
│ [Card]   │ [Card]   │          │ [Card]   │
│          │ [Card]   │          │          │
└──────────┴──────────┴──────────┴──────────┘
```

---

### 6.5 PAGE COMPTES (`/accounts`)

#### Layout Global
```
┌─────────────────────────────────────────────────┐
│  🏦 Mes Comptes                   [+ Ajouter]   │
├─────────────────────────────────────────────────┤
│                                                 │
│  [Vue d'ensemble: Solde Total Tous Comptes]    │
│  12,450 €                                       │
│                                                 │
│  [Liste des Comptes - Cards]                   │
│                                                 │
└─────────────────────────────────────────────────┘
```

#### Vue d'Ensemble (Header)
```
┌────────────────────────────────────────────────┐
│ Patrimoine Total: 12,450 €                     │
│ ████████ 65% Comptes Courants                  │
│ ████ 35% Épargne                               │
└────────────────────────────────────────────────┘
```

#### Card Compte (Répétée)
```
┌────────────────────────────────────────────────┐
│ 💳 Compte Courant Principal        [⋮]         │
├────────────────────────────────────────────────┤
│                                                │
│ Solde Actuel:  5,280.50 €                     │
│ Disponible:    5,100.00 €                     │
│                                                │
│ [Mini graphique évolution 30j]                 │
│                                                │
│ BNP Paribas  •••• 4567                         │
│ Dernière synchro: Il y a 2h                    │
│                                                │
│ [Voir Transactions] [Détails →]                │
└────────────────────────────────────────────────┘
```

**Spécifications**
- **Types de comptes** : 
  - Courant : icône 💳, couleur bleu
  - Épargne : icône 🐖, couleur vert
  - Entreprise : icône 💼, couleur violet
- **Solde** :
  - Principal : 32px, bold, monospace
  - Disponible : 16px, gray-600
- **Mini graphique** : Sparkline 7 derniers jours
- **Numéro compte** : Masqué (4 derniers chiffres)
- **Synchro** : 
  - Badge vert si < 1h
  - Orange si > 1h < 24h
  - Rouge si > 24h

**Menu Actions (⋮)**
- Modifier informations
- Synchroniser maintenant
- Définir compte par défaut
- Archiver compte
- Supprimer compte

#### Page Détail Compte

**Navigation** : Click sur "Détails →" ou nom compte

**Layout Détail**
```
┌─────────────────────────────────────────────────┐
│  ← Retour   Compte Courant Principal            │
├─────────────────────────────────────────────────┤
│  [Onglets: Transactions | Stats | Paramètres]  │
├─────────────────────────────────────────────────┤
│                                                 │
│  [Contenu selon onglet]                        │
│                                                 │
└─────────────────────────────────────────────────┘
```

**Onglet Transactions**
- Transactions filtrées pour ce compte uniquement
- Même UI que page Transactions globale
- Solde courant affiché en haut

**Onglet Statistiques**
- Graphiques spécifiques au compte
- Répartition dépenses
- Évolution solde
- Comparaison autres comptes

**Onglet Paramètres**
```
┌────────────────────────────────────┐
│ Informations du Compte             │
├────────────────────────────────────┤
│ Nom:                               │
│ [Compte Courant Principal____]     │
│                                    │
│ Type:                              │
│ [Compte Courant ▼__________]       │
│                                    │
│ Devise:                            │
│ [EUR ▼___________________]         │
│                                    │
│ Institution:                       │
│ [BNP Paribas_____________]         │
│                                    │
│ Numéro:                            │
│ [FR76 **** **** **** 4567]         │
│                                    │
│ ☑ Compte par défaut                │
│ ☑ Inclure dans solde total         │
│                                    │
│ Alertes:                           │
│ ☑ Solde faible (< 500€)            │
│ ☐ Dépenses inhabituelles           │
│                                    │
│ [Enregistrer]                      │
└────────────────────────────────────┘
```

---

### 6.6 PAGE PARAMÈTRES (`/settings`)

#### Layout avec Onglets Latéraux

```
┌─────────────────────────────────────────────────┐
│  ⚙️ Paramètres                                  │
├────────────┬────────────────────────────────────┤
│            │                                    │
│ Onglets    │  Contenu de l'onglet actif        │
│ (Sidebar)  │                                    │
│            │                                    │
│ • Profil   │  [Formulaires et options]         │
│ • Sécurité │                                    │
│ • Notif.   │                                    │
│ • Préf.    │                                    │
│ • Intégr.  │                                    │
│ • Données  │                                    │
│            │                                    │
└────────────┴────────────────────────────────────┘
```

#### Sidebar Onglets (200px)
```
⚪ Profil
⚪ Sécurité
⚪ Notifications
⚪ Préférences
⚪ Intégrations
⚪ Données & Vie Privée
```

**Spécifications**
- État actif : Background violet-50, border-left violet
- Icône + texte pour chaque
- Responsive : tabs horizontales sur mobile

#### Onglet 1 : Profil

```
┌────────────────────────────────────┐
│ Photo de Profil                    │
│ [Avatar 120px]  [Modifier]         │
│                                    │
│ Informations Personnelles          │
├────────────────────────────────────┤
│ Nom complet:                       │
│ [Jean Dupont______________]        │
│                                    │
│ Email:                             │
│ [jean.dupont@example.com___]       │
│ ✅ Email vérifié                   │
│                                    │
│ Téléphone:                         │
│ [+33 6 12 34 56 78________]        │
│                                    │
│ Date de naissance:                 │
│ [15/03/1990______________]         │
│                                    │
│ Adresse:                           │
│ [_________________________]        │
│ [Code postal] [Ville]              │
│                                    │
│ Devise préférée:                   │
│ [EUR ▼]                            │
│                                    │
│ Langue:                            │
│ [Français ▼]                       │
│                                    │
│ Fuseau horaire:                    │
│ [Europe/Paris ▼___________]        │
│                                    │
│ [Annuler]      [Enregistrer]       │
└────────────────────────────────────┘
```

#### Onglet 2 : Sécurité

```
┌────────────────────────────────────┐
│ Mot de Passe                       │
├────────────────────────────────────┤
│ Mot de passe actuel:               │
│ [••••••••••••••]                   │
│                                    │
│ Nouveau mot de passe:              │
│ [________________]                 │
│ Force: ████░░░░ Moyen              │
│                                    │
│ Confirmer:                         │
│ [________________]                 │
│                                    │
│ [Modifier le mot de passe]         │
│                                    │
│ Authentification à Deux Facteurs   │
├────────────────────────────────────┤
│ ☐ Activer 2FA                      │
│ Ajoutez une couche de sécurité...  │
│ [Configurer →]                     │
│                                    │
│ Sessions Actives                   │
├────────────────────────────────────┤
│ 🖥️ Chrome sur Windows              │
│ Paris, France • Il y a 5 min       │
│ [Révoquer]                         │
│                                    │
│ 📱 Safari sur iPhone               │
│ Lyon, France • Il y a 2 jours      │
│ [Révoquer]                         │
│                                    │
│ [Déconnecter toutes les sessions]  │
└────────────────────────────────────┘
```

#### Onglet 3 : Notifications

```
┌────────────────────────────────────┐
│ Préférences de Notifications       │
├────────────────────────────────────┤
│ Alertes Financières                │
│ ☑ Budget dépassé (Email + App)     │
│ ☑ Dépenses inhabituelles (App)     │
│ ☑ Solde faible (Email + App)       │
│ ☐ Objectif atteint (Email + App)   │
│                                    │
│ Rapports Automatiques              │
│ ☑ Résumé hebdomadaire (Email)      │
│   Envoi: Lundi 9h00 [▼]            │
│ ☑ Rapport mensuel (Email)          │
│   Envoi: 1er du mois [▼]           │
│ ☐ Rapport annuel (Email)           │
│                                    │
│ Transactions                       │
│ ☑ Nouvelle transaction (App)       │
│ ☐ Grande transaction (>100€)       │
│ ☑ Revenu reçu (Email + App)        │
│                                    │
│ Assistant IA                       │
│ ☑ Insights hebdomadaires           │
│ ☑ Recommandations personnalisées   │
│                                    │
│ [Enregistrer les préférences]      │
└────────────────────────────────────┘
```

#### Onglet 4 : Préférences

```
┌────────────────────────────────────┐
│ Apparence                          │
├────────────────────────────────────┤
│ Thème:                             │
│ ⚪ Clair  ⚪ Sombre  ⚪ Auto        │
│                                    │
│ Couleur d'accent:                  │
│ [🟣] [🔵] [🟢] [🔴] [Personnalisé]│
│                                    │
│ Formats                            │
├────────────────────────────────────┤
│ Format de date:                    │
│ ⚪ DD/MM/YYYY  ⚪ MM/DD/YYYY        │
│ ⚪ YYYY-MM-DD                       │
│                                    │
│ Format de nombre:                  │
│ ⚪ 1 234,56  ⚪ 1,234.56            │
│                                    │
│ Premier jour de la semaine:        │
│ [Lundi ▼]                          │
│                                    │
│ Catégories Personnalisées          │
├────────────────────────────────────┤
│ [Liste catégories custom]          │
│ [+ Ajouter une catégorie]          │
│                                    │
│ Période de référence               │
│ ⚪ Mois calendaire (1er-31)        │
│ ⚪ Personnalisé (ex: 15-14)        │
│                                    │
│ [Enregistrer]                      │
└────────────────────────────────────┘
```

#### Onglet 5 : Intégrations

```
┌────────────────────────────────────┐
│ Connexions Bancaires               │
├────────────────────────────────────┤
│ ┌────────────────────────────────┐│
│ │ 🏦 BNP Paribas                 ││
│ │ Connecté • 2 comptes           ││
│ │ Dernière synchro: Il y a 1h    ││
│ │ [Reconnecter] [Déconnecter]    ││
│ └────────────────────────────────┘│
│                                    │
│ [+ Ajouter une banque]             │
│                                    │
│ Export Automatique                 │
├────────────────────────────────────┤
│ ☐ Google Sheets                    │
│   Synchronisation quotidienne      │
│   [Configurer →]                   │
│                                    │
│ ☐ Excel / OneDrive                 │
│   Export hebdomadaire              │
│   [Configurer →]                   │
│                                    │
│ API Personnelle (Développeurs)     │
├────────────────────────────────────┤
│ Clé API: •••••••••••••••••         │
│ [Afficher] [Régénérer]             │
│                                    │
│ [Documentation API →]              │
│                                    │
│ Webhooks                           │
│ [+ Ajouter un webhook]             │
└────────────────────────────────────┘
```

#### Onglet 6 : Données & Vie Privée

```
┌────────────────────────────────────┐
│ Export de Données (RGPD)           │
├────────────────────────────────────┤
│ Téléchargez toutes vos données     │
│ au format JSON ou CSV              │
│                                    │
│ [Demander un export]               │
│ (Reçu par email sous 24h)          │
│                                    │
│ Suppression du Compte              │
├────────────────────────────────────┤
│ ⚠️ Action irréversible             │
│                                    │
│ La suppression de votre compte     │
│ entraînera:                        │
│ • Suppression de toutes vos données│
│ • Annulation des abonnements       │
│ • Perte définitive de l'historique │
│                                    │
│ [Supprimer mon compte]             │
│                                    │
│ Consentements                      │
├────────────────────────────────────┤
│ ☑ Traitement des données           │
│   financières (requis)             │
│ ☑ Analyse IA pour insights         │
│ ☐ Partage données anonymisées      │
│   (amélioration service)           │
│ ☐ Marketing et newsletters         │
│                                    │
│ [Politique de confidentialité →]   │
│ [Conditions d'utilisation →]       │
└────────────────────────────────────┘
```

---

## 7. COMPOSANTS RÉUTILISABLES

### 7.1 Boutons

**Variantes** :
- Primary : Gradient violet, texte blanc
- Secondary : Border violet, texte violet, bg transparent
- Danger : Rouge, texte blanc
- Ghost : Transparent, hover bg gray-100
- Link : Texte violet, underline hover

**Tailles** :
- sm : padding 8px 16px, text 14px
- md : padding 12px 24px, text 16px (default)
- lg : padding 16px 32px, text 18px

**États** :
- Default : Styles de base
- Hover : Brightness +10%, translateY(-1px)
- Active : Brightness -5%, translateY(0)
- Disabled : Opacity 50%, cursor not-allowed
- Loading : Spinner à gauche du texte, disabled

### 7.2 Inputs

**Types** :
- Text input
- Number input (avec steppers +/-)
- Date picker
- Select dropdown
- Multi-select
- Textarea
- File upload

**Structure Standard** :
```html
[Label *]
[Input field]
[Helper text / Error message]
```

**Spécifications** :
- Height : 48px (inputs standard)
- Padding : 12px 16px
- Border : 1px gray-300, rounded-lg
- Focus : Border violet-500, shadow-sm violet
- Error : Border red-500, text red-600
- Disabled : Background gray-100, cursor not-allowed

### 7.3 Cards

**Structure** :
```html
<Card>
  <CardHeader>Title + Actions</CardHeader>
  <CardContent>Main content</CardContent>
  <CardFooter>Actions / Links</CardFooter>
</Card>
```

**Variantes** :
- Default : Background white, shadow, rounded-xl
- Hover : Shadow-lg, translateY(-2px)
- Clickable : cursor pointer, toute la card cliquable
- Selected : Border violet-500 2px

### 7.4 Modals / Dialogs

**Structure** :
```html
<Overlay /> (backdrop)
<Dialog>
  <DialogHeader>
    Title + Close button
  </DialogHeader>
  <DialogContent>
    Scrollable content
  </DialogContent>
  <DialogFooter>
    Action buttons
  </DialogFooter>
</Dialog>
```

**Tailles** :
- sm : 400px width
- md : 600px width (default)
- lg : 800px width
- xl : 1000px width
- full : 90vw width, 90vh height

**Animations** :
- Enter : Fade overlay + Scale dialog (0.95→1)
- Exit : Inverse
- Duration : 200ms ease-out

### 7.5 Toasts / Notifications

**Position** : Top-right par défaut

**Types** :
- Success : Vert, check icon
- Error : Rouge, X icon
- Warning : Orange, alert icon
- Info : Bleu, info icon

**Structure** :
```
┌────────────────────────────┐
│ ✅ Message title           │
│ Description optionnelle    │
│                      [×]   │
└────────────────────────────┘
```

**Comportement** :
- Auto-dismiss après 5s (configurable)
- Hover : Pause auto-dismiss
- Click close : Dismiss immédiat
- Stack : Max 3 visibles, FIFO

### 7.6 Badges

**Variantes** :
- Default : Gray
- Primary : Violet
- Success : Vert
- Danger : Rouge
- Warning : Orange
- Info : Bleu

**Tailles** :
- sm : padding 2px 8px, text 12px
- md : padding 4px 12px, text 14px

**Formes** :
- Pill : rounded-full
- Square : rounded-md

### 7.7 Tooltips

**Déclencheur** : Hover ou Focus (500ms delay)

**Position** : Top, bottom, left, right (auto si pas d'espace)

**Style** :
- Background : gray-900, opacity 90%
- Text : white, 14px
- Padding : 8px 12px
- Arrow : 6px
- Max-width : 200px

### 7.8 Skeletons (Loading States)

**Utilisation** : Pendant chargement données

**Style** :
- Background : gray-200
- Animation : Shimmer de gauche à droite
- Border-radius : Même que composant final
- Height : Même que composant final

**Exemples** :
- Card : Rectangle avec header + lines
- Table row : Rectangles alignés
- Avatar : Circle
- Text : Lines de largeur variable

---

## 8. RESPONSIVE DESIGN

### 8.1 Breakpoints et Comportements

**Desktop Large (≥ 1440px)**
- Max-width content : 1400px
- Sidebars visibles
- Grid 3-4 colonnes
- Tous graphiques large

**Desktop (1024px - 1439px)**
- Max-width : 1200px
- Sidebars visibles
- Grid 2-3 colonnes
- Graphiques adaptés

**Tablet (768px - 1023px)**
- Sidebar en drawer
- Grid 1-2 colonnes
- Graphiques réduits
- Tables scroll horizontal

**Mobile Large (640px - 767px)**
- Sidebar drawer fullscreen
- Grid 1 colonne
- Graphiques adaptés mobile
- Tables → Cards

**Mobile (< 640px)**
- Full single column
- Bottom navigation
- Modals → Fullscreen
- Tableaux → Cards empilées
- Padding réduit (16px)

### 8.2 Touch Targets

**Taille Minimum** : 44x44px (accessibilité)

**Zones Tactiles** :
- Boutons : 48px hauteur minimum
- Checkboxes : 24px mais padding 12px
- Links dans texte : padding vertical 8px
- Icons cliquables : 40px minimum

### 8.3 Gestes Mobiles

**Supportés** :
- Swipe left/right : Navigation entre pages
- Pull to refresh : Recharger dashboard
- Long press : Contextual menu
- Pinch zoom : Sur graphiques (optionnel)
- Swipe up : Bottom sheet (modals)

### 8.4 Optimisations Mobile

**Performance** :
- Lazy load images
- Infinite scroll au lieu pagination
- Virtualization listes > 50 items
- Defer non-critical JS

**UX** :
- Inputs avec keyboard approprié (number, email, tel)
- Autocomplete activé
- Erreurs inline sous champs
- Boutons CTA sticky en bas
- Pas de hover states (use active)

---

## 9. ACCESSIBILITÉ (A11Y)

### 9.1 Standards et Conformité

**Niveau Cible** : WCAG 2.1 Level AA

**Domaines Clés** :
- Perceptibilité
- Utilisabilité
- Compréhensibilité
- Robustesse

### 9.2 Contrastes

**Ratios Minimum** :
- Texte normal : 4.5:1
- Texte large (18px+) : 3:1
- Éléments UI : 3:1
- Graphiques : 3:1

**Vérification** : Utiliser outils type Contrast Checker

### 9.3 Navigation Clavier

**Tab Order** : Logique et séquentiel

**Raccourcis Clavier** :
- `/` : Focus recherche
- `Esc` : Fermer modal/drawer
- `Enter` : Activer élément focus
- `Space` : Toggle checkboxes
- `Arrow keys` : Navigation menus/tabs

**Focus Visible** :
- Outline : 2px violet-500
- Offset : 2px
- Border-radius : Inherited

### 9.4 ARIA et Sémantique

**Landmarks** :
```html
<header role="banner">
<nav role="navigation">
<main role="main">
<aside role="complementary">
<footer role="contentinfo">
```

**Attributs ARIA Essentiels** :
- aria-label : Description éléments
- aria-labelledby : Référence à label
- aria-describedby : Description détaillée
- aria-expanded : État collapse/expand
- aria-current : Page/étape actuelle
- aria-live : Annonces dynamiques

**Exemples** :
```html
<button aria-label="Fermer le modal">×</button>
<div role="alert" aria-live="polite">Saved!</div>
<nav aria-label="Navigation principale">
```

### 9.5 Lecteurs d'Écran

**Textes Alternatifs** :
- Toutes images : alt descriptif
- Icons décoratifs : aria-hidden="true"
- Icons fonctionnels : aria-label

**Annonces** :
- Success : role="status" aria-live="polite"
- Errors : role="alert" aria-live="assertive"
- Loading : aria-busy="true"

**Tables** :
- `<th scope="col|row">`
- `<caption>` pour titre
- Headers associés aux data

---

## 10. PERFORMANCE

### 10.1 Métriques Cibles

**Core Web Vitals** :
- LCP (Largest Contentful Paint) : < 2.5s
- FID (First Input Delay) : < 100ms
- CLS (Cumulative Layout Shift) : < 0.1

**Autres** :
- TTI (Time to Interactive) : < 3.5s
- TBT (Total Blocking Time) : < 200ms

### 10.2 Optimisations Images

**Formats** :
- WebP avec fallback JPG/PNG
- SVG pour icônes et illustrations
- Lazy loading : loading="lazy"

**Responsive Images** :
```html
<img 
  srcset="image-320w.webp 320w,
          image-640w.webp 640w,
          image-1024w.webp 1024w"
  sizes="(max-width: 640px) 100vw,
         (max-width: 1024px) 50vw,
         33vw"
  src="image-640w.jpg"
  alt="Description"
/>
```

### 10.3 Code Splitting

**Par Route** :
```javascript
const Dashboard = lazy(() => import('./Dashboard'));
const Transactions = lazy(() => import('./Transactions'));
```

**Par Composant** :
- Heavy charts : lazy load
- Modals : lazy load
- Third-party libs : dynamic import

### 10.4 Caching

**API Responses** :
- React Query avec staleTime approprié
- Dashboard : 30s
- Transactions : 60s
- Static : 24h

**Assets** :
- Service Worker pour cache aggressive
- Versioning des assets (hash dans nom)

### 10.5 Bundle Size

**Targets** :
- Initial JS : < 200KB (gzipped)
- CSS : < 50KB (gzipped)
- Total First Load : < 300KB

**Techniques** :
- Tree shaking
- Remove unused CSS (PurgeCSS)
- Compression gzip/brotli
- CDN pour assets statiques

---

## 11. ÉTATS ET INTERACTIONS

### 11.1 États Globaux

**Loading States** :
- Skeleton screens (préféré)
- Spinners (si nécessaire)
- Progress bars (upload, long tasks)
- Infinite scroll loaders

**Empty States** :
```
┌────────────────────────────┐
│         [Large Icon]       │
│                            │
│ Aucune transaction encore  │
│ Commencez par en ajouter   │
│                            │
│    [+ Ajouter] [Importer]  │
└────────────────────────────┘
```

**Error States** :
```
┌────────────────────────────┐
│         [Error Icon]       │
│                            │
│ Une erreur est survenue    │
│ Message d'erreur détaillé  │
│                            │
│    [Réessayer] [Support]   │
└────────────────────────────┘
```

**Success States** :
- Toast notifications
- Inline success messages (vert)
- Animations checkmark
- Confettis (pour objectifs atteints)

**Offline State** :
```
┌────────────────────────────┐
│ 📡 Hors ligne              │
│ Certaines fonctions ne     │
│ sont pas disponibles       │
│ [Mode Lecture Seule]       │
└────────────────────────────┘
```

### 11.2 États de Formulaires

**Validation en Temps Réel**

**Champ Valide** :
- Border : green-500
- Icône : ✓ (droite du champ)
- Pas de message

**Champ Invalide** :
- Border : red-500
- Icône : ⚠️ (droite du champ)
- Message erreur (rouge, 14px) sous le champ
- Animation : shake subtil au blur

**Champ en Cours de Validation** :
- Border : blue-500
- Icône : spinner
- Message : "Vérification..."

**États des Boutons de Soumission** :
```
[Enregistrer]           // Default
[Enregistrement...]     // Loading (disabled, spinner)
[✓ Enregistré]         // Success (2s puis reset)
[Erreur - Réessayer]   // Error
```

### 11.3 Feedback Utilisateur

**Toasts (Notifications Temporaires)**

**Position** : Top-right, stack vertical

**Durées** :
- Success : 3s
- Info : 4s
- Warning : 5s
- Error : 7s (ou manuel)

**Structure Toast** :
```
┌─────────────────────────────┐
│ [Icon] Titre           [×]  │
│ Message optionnel          │
│ [Action] (optionnel)       │
└─────────────────────────────┘
```

**Animations** :
- Enter : Slide from right + fade (200ms)
- Exit : Slide to right + fade (150ms)
- Hover : Pause auto-dismiss

**Confirmations (Dialogs Destructives)**

**Usage** : Actions irréversibles (supprimer, annuler)

```
┌────────────────────────────────┐
│ ⚠️ Confirmer la suppression    │
├────────────────────────────────┤
│ Êtes-vous sûr de vouloir       │
│ supprimer cette transaction?   │
│                                │
│ Cette action est irréversible. │
│                                │
│ [Annuler]        [Supprimer]   │
└────────────────────────────────┘
```

**Spécifications** :
- Bouton dangereux : Rouge, focus par défaut sur "Annuler"
- Esc key : Annule
- Click overlay : Annule
- Confirmation explicite requise

**Progress Indicators**

**Linear Progress (Top de page)** :
- Height : 3px
- Position : Fixed top
- Couleur : Violet animé
- Usage : Changement de page, API calls

**Circular Progress** :
- Taille : 40px (standard)
- Usage : Loading states boutons, cards
- Couleur : Violet ou contexte

**Skeleton Screens** :
- Préféré pour chargements > 200ms
- Forme = layout final
- Animation shimmer subtile

### 11.4 Micro-interactions

**Boutons**
- Hover : Scale(1.02), brightness(1.1), transition 150ms
- Active : Scale(0.98)
- Success : Pulse animation + checkmark
- Ripple effect au click (optionnel)

**Cards**
- Hover : translateY(-4px), shadow upgrade, transition 200ms
- Click : translateY(0), légère flash

**Inputs**
- Focus : Border animation (width 1px→2px)
- Valid : Checkmark slide in from right
- Invalid : Shake animation (3 oscillations, 400ms)

**Notifications Badge**
- Nouveau : Pulse animation (scale 1→1.2→1)
- Nombre augmente : Count-up animation
- Disparition : Scale down + fade

**Chart Animations**
- Data load : Animate from 0 to value (800ms ease-out)
- Hover : Highlight + tooltip fade in (100ms)
- Legend click : Smooth opacity toggle (300ms)

**Navigation**
- Active link : Border-left slide in (200ms)
- Page transition : Crossfade (250ms)

### 11.5 États de Chargement Spécifiques

**Dashboard Loading**
```
[Skeleton Balance Cards - 3 rectangles animés]

[Skeleton Chart - grand rectangle avec lignes]

[Skeleton Transaction List - 5 lignes]

[Sidebar - 3 blocks]
```

**Transaction List Loading**
```
[Skeleton Filters Bar]

[Skeleton Table]
- Header fixe (visible)
- 10 skeleton rows
- Shimmer animation

[Skeleton Pagination]
```

**Chat Loading**
```
[Messages existants visibles]

[Typing indicator]
● ● ● (animation bounce)
L'assistant réfléchit...
```

**Chart Loading States**
- Skeleton avec forme approximative
- Ou spinner centré
- Durée max avant timeout : 10s

### 11.6 Optimistic UI Updates

**Principe** : Mise à jour UI immédiate avant confirmation serveur

**Exemple Ajout Transaction** :
1. User clique "Enregistrer"
2. Transaction apparaît immédiatement en liste (opacity 60%, badge "Enregistrement...")
3. Si succès : opacity 100%, animation flash verte
4. Si erreur : Rollback + toast erreur

**Exemple Suppression** :
1. User clique "Supprimer"
2. Item fade out + slide
3. Snackbar "Transaction supprimée" avec [Annuler]
4. Si annulation sous 5s : Restore avec animation
5. Sinon : Suppression confirmée serveur

**Like/Star/Favoris** :
- Toggle instantané couleur
- Si erreur API : Revert avec shake

### 11.7 Drag and Drop (Optionnel)

**Usage** : 
- Réorganiser objectifs
- Upload fichiers
- Personnaliser dashboard

**États** :
- Draggable : cursor grab, hover scale(1.05)
- Dragging : cursor grabbing, opacity 50%, shadow-2xl
- Drop zone : Border dashed blue, background blue-50
- Drop zone active : Border solid, background blue-100
- Invalid drop : cursor no-drop, border red

**Feedback** :
- Ghost element suit cursor
- Drop zones highlight automatiquement
- Snap to grid (optionnel)

---

## 12. ANIMATIONS ET TRANSITIONS

### 12.1 Principes d'Animation

**Durées Standards**
```
Très rapide: 100ms   // Feedback immédiat (hover)
Rapide:      150ms   // Micro-interactions
Standard:    200ms   // La plupart des transitions
Moyen:       300ms   // Modals, drawers
Lent:        500ms   // Page transitions, complex
Très lent:   800ms   // Data animations (charts)
```

**Easing Functions**
```
ease-out:     Défaut (décélération)
ease-in:      Accélération (fermetures)
ease-in-out:  Smooth (mouvements longs)
spring:       Naturel (iOS-like)
```

### 12.2 Catalogue d'Animations

**Fade**
```css
Fade In:  opacity 0 → 1
Fade Out: opacity 1 → 0
Duration: 200ms
Easing:   ease-out
```

**Slide**
```css
Slide In Right:  translateX(100%) → 0
Slide In Left:   translateX(-100%) → 0
Slide In Up:     translateY(100%) → 0
Slide In Down:   translateY(-100%) → 0
Duration: 250ms
Easing:   ease-out
```

**Scale**
```css
Scale In:  scale(0.95) → 1
Scale Out: scale(1) → 0.95
Duration:  200ms
Easing:    ease-out
Souvent combiné avec fade
```

**Bounce**
```css
Keyframes:
0%:   transform: scale(1)
50%:  transform: scale(1.15)
100%: transform: scale(1)
Duration: 400ms
Usage:    Success feedback, nouveau badge
```

**Shake**
```css
Keyframes:
0%, 100%: translateX(0)
25%:      translateX(-10px)
75%:      translateX(10px)
Duration: 400ms
Usage:    Validation errors
```

**Pulse**
```css
Keyframes:
0%, 100%: opacity(1) scale(1)
50%:      opacity(0.7) scale(1.05)
Duration: 2000ms
Infinite: Yes
Usage:    Notifications badge, attention
```

**Shimmer (Loading)**
```css
Gradient animation:
From left to right
Gradient: transparent → white 50% → transparent
Duration: 1500ms
Infinite: Yes
Usage:    Skeleton screens
```

### 12.3 Animations de Page

**Route Transitions**
```
Exit page:  Fade out + scale(0.98)    200ms
Enter page: Fade in + scale(0.98→1)   250ms
Stagger:    50ms entre exit et enter
```

**Modal Open**
```
Overlay:    Fade in                    150ms
Dialog:     Scale(0.95→1) + Fade in   200ms
Stagger:    Modal after overlay
```

**Modal Close**
```
Dialog:     Scale(1→0.95) + Fade out  150ms
Overlay:    Fade out                   150ms
Stagger:    Overlay after dialog
```

**Drawer Open**
```
Overlay:    Fade in                    200ms
Drawer:     Slide in from side         300ms
```

**Bottom Sheet (Mobile)**
```
Overlay:    Fade in                    200ms
Sheet:      Slide up from bottom       300ms
            With bounce at end
```

### 12.4 Animations de Données

**Chart Data Load**
```
Lines:      Draw animation (stroke-dashoffset)
Bars:       Scale from 0 to value (Y axis)
Pies:       Rotate slice into position
Duration:   800ms
Easing:     ease-out
Stagger:    50ms entre éléments
```

**Number Count-Up**
```javascript
From: 0 (ou valeur précédente)
To:   Valeur finale
Duration: 1000ms
Easing: ease-out (décélération)
Format: Formatage progressif (virgules, etc.)
Usage: KPI cards, totaux
```

**List Items Stagger**
```
Chaque item: Fade in + translateY(-10px → 0)
Duration:    200ms per item
Delay:       50ms entre items
Max stagger: 8-10 items (puis instantané)
```

### 12.5 Performance des Animations

**Propriétés GPU-Accelerated** (performantes)
- transform (translate, scale, rotate)
- opacity
- filter (avec précaution)

**Propriétés à Éviter** (reflow/repaint)
- width, height
- margin, padding
- top, left, right, bottom
- font-size

**Best Practices**
- Utiliser `transform` au lieu de `position`
- Utiliser `will-change` avec parcimonie
- Limiter animations simultanées (max 3-4)
- Désactiver animations si `prefers-reduced-motion`

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 13. INTERNATIONALISATION (i18n)

### 13.1 Langues Supportées (Phase 1)

**Langues Initiales**
- Français (fr) : Default
- Anglais (en)

**Langues Futures**
- Espagnol (es)
- Allemand (de)
- Italien (it)

### 13.2 Implémentation

**Bibliothèque** : react-i18next ou react-intl

**Structure des Fichiers**
```
locales/
├── fr/
│   ├── common.json
│   ├── dashboard.json
│   ├── transactions.json
│   ├── auth.json
│   └── errors.json
├── en/
│   ├── common.json
│   └── ...
```

**Format des Clés**
```json
{
  "dashboard.welcome": "Bonjour {{name}}",
  "dashboard.balance": "Solde Total",
  "transactions.add": "Ajouter une transaction",
  "errors.required": "Ce champ est requis",
  "validation.amount.min": "Le montant doit être supérieur à {{min}}"
}
```

### 13.3 Éléments à Traduire

**Textes UI**
- Labels, boutons, liens
- Messages d'erreur
- Tooltips, placeholders
- Notifications, alertes

**Formats Localisés**
- Dates : DD/MM/YYYY vs MM/DD/YYYY
- Nombres : 1 234,56 vs 1,234.56
- Devises : 100€ vs €100 vs EUR 100
- Heures : 24h vs 12h AM/PM

**Contenu Dynamique**
- Pluralisation : "1 transaction" vs "5 transactions"
- Genres grammaticaux (si applicable)
- Contextes : "Il y a 2 heures" vs "2 hours ago"

### 13.4 Considérations Layout

**Expansion de Texte**
- Allemand : +30% vs anglais
- Français : +15-20% vs anglais
- Prévoir flexibilité dans composants

**RTL Support** (Futur)
- Arabe, hébreu
- Mirror horizontal layout
- Icons et directions inversés

**Sélecteur de Langue**
```
┌──────────────────┐
│ 🌐 Français   ▼  │
├──────────────────┤
│ ✓ Français       │
│   English        │
│   Español        │
│   Deutsch        │
└──────────────────┘
```

---

## 14. THÈMES ET PERSONNALISATION

### 14.1 Thèmes Disponibles

**Thème Clair (Default)**
- Background : gray-50
- Cards : white
- Text : gray-900

**Thème Sombre**
- Background : gray-900
- Cards : gray-800
- Text : gray-100
- Ajustements contrastes

**Auto (Système)**
- Détection `prefers-color-scheme`
- Switch automatique
- Persistance préférence user

### 14.2 Variables CSS pour Theming

```css
:root {
  /* Colors */
  --color-primary: #667eea;
  --color-primary-dark: #764ba2;
  --color-background: #f7fafc;
  --color-surface: #ffffff;
  --color-text: #2d3748;
  --color-text-secondary: #4a5568;
  
  /* Spacing */
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --spacing-xl: 32px;
  
  /* Border radius */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 16px;
  
  /* Shadows */
  --shadow-sm: 0 1px 2px rgba(0,0,0,0.05);
  --shadow-md: 0 4px 6px rgba(0,0,0,0.1);
  --shadow-lg: 0 10px 15px rgba(0,0,0,0.1);
}

[data-theme="dark"] {
  --color-background: #1a202c;
  --color-surface: #2d3748;
  --color-text: #f7fafc;
  --color-text-secondary: #cbd5e0;
  /* ... autres ajustements */
}
```

### 14.3 Personnalisation Couleur d'Accent

**Options Prédéfinies**
- Violet (default) : #667eea
- Bleu : #3182ce
- Vert : #38a169
- Rouge : #e53e3e
- Orange : #dd6b20

**Sélecteur UI**
```
Couleur d'accent:
[🟣] [🔵] [🟢] [🔴] [🟠] [🎨 Custom]
```

**Impact**
- Couleur primaire boutons
- Liens et highlights
- Progress bars
- Active states navigation

---

## 15. ERREURS ET CAS LIMITES

### 15.1 Gestion des Erreurs Réseau

**Connexion Perdue**
```
┌────────────────────────────────┐
│ 📡 Pas de connexion Internet   │
│                                │
│ Vérifiez votre connexion et   │
│ réessayez.                     │
│                                │
│ [Mode Hors Ligne]  [Réessayer]│
└────────────────────────────────┘
```

**Timeout**
```
⏱️ La requête a pris trop de temps
Le serveur ne répond pas. Veuillez réessayer.
[Réessayer]
```

**Erreur Serveur (500)**
```
⚠️ Erreur du serveur
Une erreur technique est survenue.
Notre équipe en est informée.
[Retour] [Contacter le support]
```

### 15.2 Erreurs de Validation

**Affichage des Erreurs**
- Inline sous champs concernés
- Couleur rouge (#f56565)
- Icône warning
- Message clair et actionnable

**Exemples de Messages**
```
❌ "Ce champ est requis"
❌ "Le montant doit être supérieur à 0"
❌ "Format d'email invalide"
❌ "Le mot de passe doit contenir au moins 8 caractères"
❌ "Les mots de passe ne correspondent pas"
```

**Récapitulatif Erreurs (Multi-champs)**
```
┌────────────────────────────────┐
│ ⚠️ 3 erreurs à corriger:       │
│ • Montant requis               │
│ • Description trop courte      │
│ • Date invalide                │
│ [Aller à la première erreur]   │
└────────────────────────────────┘
```

### 15.3 États Limites

**Aucune Donnée**
- Empty states bien conçus
- Illustrations engageantes
- Call-to-action clair
- Exemples ou tutoriels

**Trop de Données**
- Pagination obligatoire
- Virtualization pour listes > 100 items
- Filtres avancés accessibles
- Export si nécessaire

**Données Corrompues**
```
⚠️ Impossible d'afficher ces données
Format de données invalide
[Signaler le problème]
```

**Permissions Insuffisantes**
```
🔒 Accès Restreint
Vous n'avez pas les permissions pour
effectuer cette action.
[Retour] [Demander l'accès]
```

---

## 16. PROGRESSIVE WEB APP (PWA)

### 16.1 Fonctionnalités PWA

**Installabilité**
- Icônes app (192x192, 512x512)
- Manifest.json configuré
- Service Worker enregistré
- Prompt d'installation personnalisé

**Mode Offline**
- Cache pages principales
- Cache transactions récentes (7 jours)
- Queue des actions offline
- Sync à la reconnexion

**Notifications Push** (Optionnel)
- Alertes importantes
- Rappels paiements
- Objectifs atteints

### 16.2 Manifest.json

```json
{
  "name": "Harena - Assistant Financier",
  "short_name": "Harena",
  "description": "Gérez vos finances intelligemment",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#667eea",
  "theme_color": "#667eea",
  "orientation": "portrait-primary",
  "icons": [
    {
      "src": "/icons/icon-192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/icons/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

### 16.3 Service Worker Strategy

**Cache First**
- Assets statiques (JS, CSS, fonts)
- Images, icônes

**Network First**
- API calls
- Données dynamiques

**Stale While Revalidate**
- Dashboard summary
- Charts data

---

## 17. ANALYTICS ET TRACKING

### 17.1 Événements à Tracker

**User Actions**
- Inscription, connexion
- Ajout transaction
- Modification budget
- Création objectif
- Utilisation chat IA
- Export données

**Performance**
- Temps de chargement pages
- Erreurs JavaScript
- Erreurs API
- Temps réponse API

**Engagement**
- Pages vues
- Durée sessions
- Fonctionnalités utilisées
- Taux d'abandon

### 17.2 Respect de la Vie Privée

**Anonymisation**
- Pas de données financières dans analytics
- Anonymisation user IDs
- Agrégation des métriques

**Consentement**
- Banner cookies conforme RGPD
- Options granulaires
- Opt-out facile

**Tools Recommandés**
- Plausible Analytics (privacy-first)
- OU Google Analytics 4 (avec consentement)
- Sentry (error tracking)
- LogRocket (session replay, opt-in)

---

## 18. TESTING ET QUALITÉ

### 18.1 Types de Tests

**Tests Unitaires**
- Composants isolés
- Fonctions utilitaires
- Validation logique
- Coverage : > 80%

**Tests d'Intégration**
- Flux utilisateur complets
- API calls mockés
- State management

**Tests E2E**
- Scénarios critiques :
  - Inscription → Ajout transaction → Dashboard
  - Création budget → Alerte dépassement
  - Chat IA → Recommandations

**Tests Visuels**
- Regression visuelle (Chromatic, Percy)
- Storybook pour composants
- Screenshot testing

### 18.2 Outils

**Test Runner** : Vitest ou Jest
**UI Testing** : React Testing Library
**E2E** : Playwright ou Cypress
**Visual** : Storybook + Chromatic

### 18.3 Checklist Qualité

**Avant Release**
- [ ] Tous tests passent
- [ ] Pas d'erreurs console
- [ ] Performance (Lighthouse > 90)
- [ ] Accessibilité (axe DevTools)
- [ ] Responsive (tous breakpoints)
- [ ] Browsers (Chrome, Firefox, Safari, Edge)
- [ ] Dark mode fonctionnel
- [ ] i18n complet
- [ ] Documentation à jour

---

## 19. DOCUMENTATION DÉVELOPPEUR

### 19.1 Composants Documentés (Storybook)

**Structure Story**
```typescript
export default {
  title: 'Components/Button',
  component: Button,
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'danger']
    }
  }
}

export const Primary = {
  args: {
    children: 'Click me',
    variant: 'primary'
  }
}
```

**Documentation Inclure**
- Props et types
- Exemples d'usage
- Variantes
- États (hover, focus, disabled)
- Best practices
- A11y notes

### 19.2 Style Guide

**Naming Conventions**
- Components : PascalCase
- Files : PascalCase.tsx
- Utils : camelCase
- Constants : UPPER_SNAKE_CASE
- CSS classes : kebab-case ou Tailwind

**Code Organization**
```typescript
// 1. Imports externes
import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query'

// 2. Imports internes
import { Button } from '@/components/ui'
import { useAuth } from '@/hooks'

// 3. Types
interface Props {
  title: string
}

// 4. Component
export function MyComponent({ title }: Props) {
  // Hooks
  // Event handlers
  // Render
}
```

---

## 20. ROADMAP ET ÉVOLUTIONS FUTURES

### 20.1 Phase 2 - Fonctionnalités Avancées

**Collaboratif**
- Comptes partagés (famille, couple)
- Permissions granulaires
- Commentaires sur transactions

**Mobile Native**
- React Native app
- Scan reçus OCR
- Notifications push
- Touch/Face ID

**IA Avancée**
- Catégorisation auto ML
- Détection fraudes
- Conseils personnalisés avancés
- Voice commands

### 20.2 Phase 3 - Écosystème

**Intégrations**
- API publique complète
- Zapier, IFTTT
- Stripe, PayPal
- Accounting software (QuickBooks)

**Marketplace**
- Templates budgets
- Rapports customs
- Widgets dashboard
- Thèmes communautaires

**Social**
- Partage objectifs (opt-in)
- Challenges communauté
- Tips & tricks
- Success stories

---

## ANNEXES

### A. Glossaire

**Terms UI/UX**
- **Card** : Conteneur avec shadow et border-radius
- **Drawer** : Menu latéral qui slide
- **Toast** : Notification temporaire
- **Modal** : Dialog overlay qui bloque interaction
- **Skeleton** : Placeholder de chargement
- **Badge** : Petit label coloré
- **Chip** : Badge cliquable (tag)

**Terms Métier**
- **Transaction** : Mouvement financier
- **Catégorie** : Classification transaction
- **Budget** : Limite dépenses par catégorie
- **Objectif** : Target d'épargne
- **Prévision** : Estimation future par IA

### B. Ressources

**Design**
- Figma Community : Inspiration UI
- Dribbble : Fintech designs
- Mobbin : Mobile app patterns

**Icônes**
- Lucide React : https://lucide.dev
- Heroicons : https://heroicons.com

**Fonts**
- Inter : https://rsms.me/inter
- Google Fonts

**Colors**
- Coolors : Palette generator
- Contrast Checker : WebAIM

**Inspiration**
- Mint, YNAB, Revolut, N26
- Apple Wallet, Google Pay

### C. Contact et Support

**Équipe Design** : design@harena.app
**Équipe Dev** : dev@harena.app
**Documentation** : docs.harena.app
**Figma** : [Lien fichier]
**GitHub** : [Lien repo]

---

## CONCLUSION

Ce document constitue la spécification complète de l'interface utilisateur de Harena. Il doit être considéré comme un guide vivant, évoluant avec les retours utilisateurs et les itérations produit.

**Principes Directeurs à Retenir**
1. **Clarté avant complexité** : L'information financière doit être immédiatement compréhensible
2. **Performance** : Chaque milliseconde compte pour l'expérience utilisateur
3. **Accessibilité** : Tout le monde doit pouvoir utiliser Harena
4. **Cohérence** : Patterns répétés pour courbe d'apprentissage faible
5. **Feedback** : L'utilisateur doit toujours savoir ce qui se passe

**Prochaines Étapes**
1. Validation stakeholders
2. Création maquettes Figma détaillées
3. Prototype interactif
4. Tests utilisateurs
5. Itérations
6. Développement

---

**Document Version** : 1.0  
**Dernière Mise à Jour** : 29 Septembre 2025  
**Auteur** : Équipe Produit Harena  
**Statut** : ✅ Approuvé pour Développement