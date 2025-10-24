#!/bin/bash

# ============================================
# Script de démarrage rapide - Harena Frontend
# ============================================

set -e

echo "🚀 Démarrage du frontend Harena"
echo ""

# Vérifier si node_modules existe
if [ ! -d "node_modules" ]; then
    echo "📦 Installation des dépendances..."
    npm install
    echo ""
fi

# Vérifier si .env.local existe
if [ ! -f ".env.local" ]; then
    echo "⚠️  Fichier .env.local manquant"
    echo "📝 Création depuis .env.example..."
    cp .env.example .env.local
    echo "✅ .env.local créé avec les valeurs par défaut (localhost)"
    echo ""
fi

# Afficher la configuration
echo "📋 Configuration actuelle:"
echo "   Mode: Développement local"
echo "   Backend: localhost (ports 3000-3008)"
echo ""
echo "💡 Pour pointer vers AWS production:"
echo "   npm run dev:prod"
echo ""

# Démarrer le serveur de dev
echo "🎯 Démarrage du serveur de développement..."
echo ""
npm run dev
