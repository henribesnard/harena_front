@echo off
REM ============================================
REM Script de basculement d'environnement
REM ============================================

if "%1"=="local" (
    echo 🏠 Basculement vers backend LOCAL (Docker^)
    copy /Y .env.local .env
    echo ✅ Configuration mise à jour
    echo 📝 Le conteneur Docker va redémarrer automatiquement...
) else if "%1"=="aws" (
    echo ☁️ Basculement vers backend AWS (63.35.52.216^)
    copy /Y .env.aws .env
    echo ✅ Configuration mise à jour
    echo 📝 Le conteneur Docker va redémarrer automatiquement...
) else (
    echo Usage: switch-env.bat [local^|aws]
    echo.
    echo Environnements disponibles:
    echo   local  - Backend Docker local (localhost^)
    echo   aws    - Backend AWS production (63.35.52.216^)
    echo.
    echo Environnement actuel:
    findstr "VITE_USER_SERVICE_URL" .env 2>nul || echo   Aucun fichier .env trouvé
)
