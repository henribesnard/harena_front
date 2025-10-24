# 🌍 Configuration des Environnements

Ce guide explique comment configurer le frontend Harena pour différents environnements (local vs production).

## 📁 Fichiers de Configuration

Le projet utilise plusieurs fichiers `.env` pour gérer les environnements:

| Fichier | Usage | Chargé quand |
|---------|-------|--------------|
| `.env` | Environnement par défaut (local) | Toujours, sauf si remplacé |
| `.env.local` | Développement local | `npm run dev` (priorité sur .env) |
| `.env.production` | Production AWS | `npm run build` ou mode production |
| `.env.example` | Template d'exemple | À copier pour créer vos configs |

## 🚀 Utilisation Rapide

### Développement Local

Pour développer avec les services backend en local (Docker Compose):

```bash
# Le fichier .env ou .env.local est déjà configuré pour localhost
npm run dev
```

Les services seront appelés sur:
- `http://localhost:3000` (user_service)
- `http://localhost:3001` (search_service)
- `http://localhost:3002` (metric_service)
- `http://localhost:3006` (budget_profiling_service)
- `http://localhost:3008` (conversation_service_v3)

### Build pour la Production AWS

Pour créer un build qui pointe vers les services AWS:

```bash
# Build avec les URLs de production
npm run build:prod
```

Les services seront appelés sur:
- `http://63.35.52.216/api/v1/users` (via Nginx)
- `http://63.35.52.216/api/v1/search` (via Nginx)
- `http://63.35.52.216/api/v1/metrics` (via Nginx)
- `http://63.35.52.216/api/v1/budget` (via Nginx)
- `http://63.35.52.216/api/v3` (via Nginx)

## 📝 Scripts NPM Disponibles

| Commande | Description |
|----------|-------------|
| `npm run dev` | Démarre le serveur de dev (utilise .env.local ou .env) |
| `npm run dev:local` | Force le mode développement avec localhost |
| `npm run dev:prod` | Démarre le dev mais pointe vers AWS (test) |
| `npm run build` | Build par défaut (utilise .env.production si disponible) |
| `npm run build:local` | Build avec config localhost |
| `npm run build:prod` | Build avec config AWS production |
| `npm run preview` | Prévisualise le build |
| `npm run preview:prod` | Prévisualise le build production |

## 🔧 Configuration Manuelle

### Créer un environnement personnalisé

1. Copiez `.env.example`:
   ```bash
   cp .env.example .env.custom
   ```

2. Modifiez les URLs selon vos besoins

3. Utilisez-le avec Vite:
   ```bash
   vite --mode custom
   ```

### Basculer temporairement vers la production

Si vous voulez tester le frontend local avec le backend AWS:

```bash
# Option 1: Utiliser le script dédié
npm run dev:prod

# Option 2: Modifier temporairement .env.local
# Changez toutes les URLs vers http://63.35.52.216
```

## 🏗️ Architecture

### Comment ça fonctionne ?

1. **Développement Local**:
   ```
   Frontend (localhost:5173)
      ↓ http://localhost:3000/api/v1/users
   User Service (Docker container port 3000)
   ```

2. **Production AWS**:
   ```
   Frontend (S3/CDN ou serveur web)
      ↓ http://63.35.52.216/api/v1/users
   Nginx (AWS EC2)
      ↓ proxy_pass
   User Service (Docker container localhost:3000)
   ```

### Fichier de configuration central

Le fichier `src/config/services.ts` centralise toutes les URLs:

```typescript
export const SERVICES = {
  USER: {
    baseURL: import.meta.env.VITE_USER_SERVICE_URL || 'http://localhost:3000',
    apiV1: '/api/v1',
  },
  // ...
}
```

Les helpers `buildServiceURL()` et `getServiceBaseURL()` construisent automatiquement les URLs complètes.

## 🔐 Sécurité

- ❌ **Ne commitez JAMAIS** `.env.local` ou `.env.production` avec des secrets
- ✅ Les fichiers `.env*.local` sont déjà dans `.gitignore`
- ✅ Utilisez `.env.example` comme template

## 🐛 Dépannage

### Les services ne répondent pas en local

Vérifiez que Docker Compose est lancé:
```bash
docker-compose up -d
docker ps  # Vérifiez que tous les services sont "healthy"
```

### Les appels API échouent en production

1. Vérifiez que le build utilise bien `.env.production`:
   ```bash
   npm run build:prod
   ```

2. Vérifiez que Nginx est configuré sur AWS:
   ```bash
   curl http://63.35.52.216/health
   ```

3. Vérifiez les CORS dans la console navigateur

### Comment savoir quel environnement est utilisé ?

Ouvrez la console navigateur et tapez:
```javascript
console.log(import.meta.env)
```

Vous verrez toutes les variables `VITE_*` chargées.

## 📚 Ressources

- [Documentation Vite - Variables d'environnement](https://vitejs.dev/guide/env-and-mode.html)
- [Configuration Nginx AWS](../nginx.conf)
- [Docker Compose Production](../docker-compose.prod.yml)

---

**Dernière mise à jour**: 2025-10-24
