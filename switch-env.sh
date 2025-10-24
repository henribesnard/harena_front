#!/bin/bash

# ============================================
# Script de basculement d'environnement
# ============================================

if [ "$1" == "local" ]; then
    echo "🏠 Basculement vers backend LOCAL (Docker)"
    cp .env.local .env
    echo "✅ Configuration mise à jour"
    echo "📝 Le conteneur Docker va redémarrer automatiquement..."
elif [ "$1" == "aws" ]; then
    echo "☁️ Basculement vers backend AWS (63.35.52.216)"
    cp .env.aws .env
    echo "✅ Configuration mise à jour"
    echo "📝 Le conteneur Docker va redémarrer automatiquement..."
else
    echo "Usage: ./switch-env.sh [local|aws]"
    echo ""
    echo "Environnements disponibles:"
    echo "  local  - Backend Docker local (localhost)"
    echo "  aws    - Backend AWS production (63.35.52.216)"
    echo ""
    echo "Environnement actuel:"
    grep "VITE_USER_SERVICE_URL" .env || echo "  Aucun fichier .env trouvé"
fi
