# 💡 Questions Suggérées - Guide Rapide

## 🎯 Fonctionnalité

Lorsqu'un utilisateur arrive sur le chat Harena sans messages, au lieu de voir un écran vide, il voit maintenant **6 questions suggérées cliquables** organisées par catégories.

## 🚀 Utilisation

### Pour l'Utilisateur Final

1. **Arrivée sur le chat** → Affichage automatique de 6 questions suggérées
2. **Cliquer sur une question** → Envoi automatique + réponse de l'IA
3. **"Autres suggestions"** → Rafraîchir pour voir 6 nouvelles questions
4. **Ou taper manuellement** → Toujours possible dans le champ de texte

### Pour le Développeur

#### Ajouter une Nouvelle Question

Éditer `src/hooks/useSuggestedQuestions.ts` :

```typescript
const questionPool: SuggestedQuestion[] = [
  // ... questions existantes

  // NOUVELLE QUESTION
  {
    question: "Quelle est ma transaction la plus élevée ?",
    category: "Analyse",
    icon: "TrendingUp", // Nom de l'icône Lucide React
    color: "from-blue-500 to-cyan-600" // Gradient Tailwind
  }
]
```

#### Icônes Disponibles

Toutes les icônes de [Lucide React](https://lucide.dev/icons/) sont utilisables.

Déjà importées dans `SuggestedQuestions.tsx` :
- `TrendingUp` - Tendances
- `PieChart` - Budget/Répartition
- `Target` - Objectifs/Cibles
- `Search` - Recherche
- `Lightbulb` - Conseils
- `Calendar` - Dates/Périodes
- `Wallet` - Argent/Comptes
- `BarChart3` - Analyses
- `ShoppingCart` - Dépenses
- `Home` - Loyer/Logement
- `Zap` - Rapide/Instantané
- `Sparkles` - Suggestions

Pour ajouter une nouvelle icône :
```typescript
// 1. Importer dans SuggestedQuestions.tsx
import { NewIcon } from 'lucide-react'

// 2. Ajouter au iconMap
const iconMap = {
  // ... icônes existantes
  NewIcon
}
```

#### Modifier le Nombre de Questions Affichées

Dans `ChatPage.tsx`, ligne ~274 :

```typescript
// Affiche 6 questions (défaut)
<SuggestedQuestions onQuestionClick={handleQuestionClick} />

// Pour afficher 4 questions
const { questions } = useSuggestedQuestions(4)
```

Ou modifier directement dans `useSuggestedQuestions.ts` :

```typescript
export const useSuggestedQuestions = (count: number = 4) => {
  // Change 6 → 4 pour afficher 4 questions par défaut
}
```

#### Couleurs des Gradients

Gradients Tailwind disponibles :
```typescript
"from-purple-500 to-purple-600"   // Violet
"from-green-500 to-emerald-600"   // Vert
"from-blue-500 to-indigo-600"     // Bleu
"from-amber-500 to-orange-600"    // Orange/Jaune
"from-red-500 to-rose-600"        // Rouge
"from-cyan-500 to-blue-600"       // Cyan
"from-pink-500 to-rose-600"       // Rose
"from-teal-500 to-cyan-600"       // Turquoise
```

## 📂 Fichiers Concernés

```
harena_front/
├── src/
│   ├── components/
│   │   └── chat/
│   │       ├── SuggestedQuestions.tsx    ← Composant principal
│   │       └── TypingIndicator.tsx       ← Indicateur de frappe
│   ├── hooks/
│   │   └── useSuggestedQuestions.ts      ← Pool de questions + logique
│   └── features/
│       └── chat/
│           └── ChatPage.tsx              ← Intégration
```

## 🎨 Personnalisation

### Modifier le Message d'Accueil

Dans `SuggestedQuestions.tsx`, lignes 50-57 :

```tsx
<h2 className="text-3xl font-bold text-gray-900 mb-2">
  Bienvenue sur Harena {/* Personnalisable */}
</h2>
<p className="text-gray-600 max-w-md">
  Que voulez-vous savoir sur vos finances aujourd'hui ?
  {/* Personnalisable */}
</p>
```

### Modifier les Animations

Dans `SuggestedQuestions.tsx`, lignes 38-44 :

```typescript
const item = {
  hidden: { opacity: 0, y: 20 },      // État initial
  show: { opacity: 1, y: 0 }          // État final
}

// Délai entre chaque carte
staggerChildren: 0.1  // 100ms entre chaque
```

### Modifier l'Apparence des Cartes

Dans `SuggestedQuestions.tsx`, lignes 77-96 :

```tsx
className="bg-white                        // Fond
           hover:bg-gradient-to-br         // Fond au hover
           hover:from-purple-50
           hover:to-indigo-50
           rounded-2xl                     // Bordures arrondies
           p-6                             // Padding
           shadow-md                       // Ombre normale
           hover:shadow-xl                 // Ombre au hover
           hover:shadow-purple-500/10      // Couleur de l'ombre
           border border-gray-200          // Bordure
           hover:border-purple-300"        // Bordure au hover
```

## 🧪 Test Local

```bash
# Démarrer le serveur de développement
cd harena_front
npm run dev

# Ouvrir http://localhost:5173
# Naviguer vers /chat
# Voir les questions suggérées
```

## 🔄 Questions Contextuelles (Future)

Pour implémenter des questions basées sur les données utilisateur :

```typescript
// Dans useSuggestedQuestions.ts
export const useSuggestedQuestions = (
  count: number = 6,
  userContext?: UserContext  // NOUVEAU
) => {
  const contextualQuestions = []

  // Ajouter des questions selon le contexte
  if (userContext?.coverage_rate < 50) {
    contextualQuestions.push({
      question: "Comment améliorer mon taux de couverture ?",
      category: "Conseil",
      icon: "Target",
      color: "from-red-500 to-rose-600"
    })
  }

  if (userContext?.expenses_yoy_increase > 10) {
    contextualQuestions.push({
      question: "Pourquoi mes dépenses ont augmenté cette année ?",
      category: "Analyse",
      icon: "TrendingUp",
      color: "from-orange-500 to-red-600"
    })
  }

  // Mélanger avec les questions génériques
  const allQuestions = [...contextualQuestions, ...questionPool]
  return getRandomQuestions(count, allQuestions)
}
```

## 📊 15 Questions Actuellement Disponibles

### Budget & Épargne (3)
1. "Analysez mon budget des 3 derniers mois"
2. "Quel est mon taux d'épargne actuel ?"
3. "Comment optimiser mes dépenses ?"

### Analyse & Tendances (3)
4. "Comparez mes dépenses ce mois vs le mois dernier"
5. "Quelle est la tendance de mes revenus sur l'année ?"
6. "Identifiez mes plus grosses dépenses ce mois"

### Recherche (3)
7. "Trouvez toutes mes transactions Netflix"
8. "Montrez-moi mes dépenses restaurants ce mois"
9. "Listez mes virements de loyer"

### Prévisions & Conseils (3)
10. "Prévoyez mon budget pour le mois prochain"
11. "Où puis-je économiser de l'argent ?"
12. "Analysez mes dépenses récurrentes"

### Questions Rapides (3)
13. "Quel est mon solde actuel ?"
14. "Résumez mes dernières transactions"
15. "Comparez mes charges fixes vs variables"

---

**Version :** 1.0.0
**Dernière mise à jour :** 2025-10-21
