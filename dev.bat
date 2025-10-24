@echo off
REM ============================================
REM Script de démarrage rapide - Harena Frontend
REM ============================================

echo.
echo 🚀 Démarrage du frontend Harena
echo.

REM Vérifier si node_modules existe
if not exist "node_modules\" (
    echo 📦 Installation des dépendances...
    call npm install
    echo.
)

REM Vérifier si .env.local existe
if not exist ".env.local" (
    echo ⚠️  Fichier .env.local manquant
    echo 📝 Création depuis .env.example...
    copy .env.example .env.local
    echo ✅ .env.local créé avec les valeurs par défaut (localhost)
    echo.
)

REM Afficher la configuration
echo 📋 Configuration actuelle:
echo    Mode: Développement local
echo    Backend: localhost (ports 3000-3008)
echo.
echo 💡 Pour pointer vers AWS production:
echo    npm run dev:prod
echo.

REM Démarrer le serveur de dev
echo 🎯 Démarrage du serveur de développement...
echo.
call npm run dev
