import { useState, useCallback } from 'react'

export interface SuggestedQuestion {
  question: string
  category: string
  icon: string
  color: string
}

// Pool de questions organisées par catégorie
const questionPool: SuggestedQuestion[] = [
  // Budget & Analyse
  {
    question: "Analysez mon budget des 3 derniers mois",
    category: "Budget",
    icon: "PieChart",
    color: "from-purple-500 to-purple-600"
  },
  {
    question: "Quel est mon taux d'épargne actuel ?",
    category: "Épargne",
    icon: "Target",
    color: "from-green-500 to-emerald-600"
  },
  {
    question: "Comment optimiser mes dépenses ?",
    category: "Conseils",
    icon: "Lightbulb",
    color: "from-amber-500 to-orange-600"
  },

  // Comparaisons & Tendances
  {
    question: "Comparez mes dépenses ce mois vs le mois dernier",
    category: "Analyse",
    icon: "TrendingUp",
    color: "from-blue-500 to-indigo-600"
  },
  {
    question: "Quelle est la tendance de mes revenus sur l'année ?",
    category: "Revenus",
    icon: "BarChart3",
    color: "from-cyan-500 to-blue-600"
  },
  {
    question: "Identifiez mes plus grosses dépenses ce mois",
    category: "Dépenses",
    icon: "ShoppingCart",
    color: "from-red-500 to-rose-600"
  },

  // Recherche de transactions
  {
    question: "Trouvez toutes mes transactions Netflix",
    category: "Recherche",
    icon: "Search",
    color: "from-violet-500 to-purple-600"
  },
  {
    question: "Montrez-moi mes dépenses restaurants ce mois",
    category: "Recherche",
    icon: "Search",
    color: "from-pink-500 to-rose-600"
  },
  {
    question: "Listez mes virements de loyer",
    category: "Recherche",
    icon: "Home",
    color: "from-indigo-500 to-purple-600"
  },

  // Prévisions & Conseils
  {
    question: "Prévoyez mon budget pour le mois prochain",
    category: "Prévisions",
    icon: "Calendar",
    color: "from-teal-500 to-cyan-600"
  },
  {
    question: "Où puis-je économiser de l'argent ?",
    category: "Conseils",
    icon: "Wallet",
    color: "from-emerald-500 to-green-600"
  },
  {
    question: "Analysez mes dépenses récurrentes",
    category: "Analyse",
    icon: "BarChart3",
    color: "from-blue-500 to-indigo-600"
  },

  // Questions rapides
  {
    question: "Quel est mon solde actuel ?",
    category: "Compte",
    icon: "Wallet",
    color: "from-green-500 to-teal-600"
  },
  {
    question: "Résumez mes dernières transactions",
    category: "Activité",
    icon: "Zap",
    color: "from-yellow-500 to-amber-600"
  },
  {
    question: "Comparez mes charges fixes vs variables",
    category: "Budget",
    icon: "PieChart",
    color: "from-purple-500 to-violet-600"
  }
]

// Fonction pour sélectionner des questions aléatoires
const getRandomQuestions = (count: number = 6): SuggestedQuestion[] => {
  const shuffled = [...questionPool].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count)
}

export const useSuggestedQuestions = (count: number = 6) => {
  const [questions, setQuestions] = useState<SuggestedQuestion[]>(() =>
    getRandomQuestions(count)
  )

  const refreshQuestions = useCallback(() => {
    setQuestions(getRandomQuestions(count))
  }, [count])

  return {
    questions,
    refreshQuestions
  }
}
