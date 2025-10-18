# 🐳 Docker Setup - Harena Frontend

Guide pour lancer le frontend Harena en mode développement avec Docker et hot reload.

---

## 📋 Table des Matières

1. [Prérequis](#prérequis)
2. [Démarrage Rapide](#démarrage-rapide)
3. [Configuration](#configuration)
4. [Utilisation](#utilisation)
5. [Troubleshooting](#troubleshooting)

---

## 🔧 Prérequis

- Docker Desktop installé et lancé
- Réseau Docker `harena-network` créé (pour communiquer avec le backend)

### Créer le réseau Docker (si pas déjà fait)

```bash
docker network create harena-network
```

---

## 🚀 Démarrage Rapide

### Option 1 : Mode Développement (Hot Reload) - Recommandé

```bash
# Depuis le dossier harena_front/
docker-compose -f docker-compose.dev.yml up -d
```

Le frontend sera accessible sur : **http://localhost:5173**

### Option 2 : Build et lancement manuel

```bash
# Build l'image de développement
docker build -f Dockerfile.dev -t harena-frontend-dev .

# Lancer le container
docker run -d \
  --name harena_frontend_dev \
  --network harena-network \
  -p 5173:5173 \
  -v "$(pwd)/src:/app/src" \
  -v "$(pwd)/.env:/app/.env" \
  -e CHOKIDAR_USEPOLLING=true \
  harena-frontend-dev
```

---

## ⚙️ Configuration

### Variables d'environnement (.env)

Le fichier `.env` est automatiquement monté dans le container. Assurez-vous qu'il contient :

```env
# Services Backend (ports Docker)
VITE_USER_SERVICE_URL=http://localhost:3000
VITE_SEARCH_SERVICE_URL=http://localhost:3001
VITE_METRIC_SERVICE_URL=http://localhost:3002
VITE_CONVERSATION_SERVICE_URL=http://localhost:3003
VITE_SYNC_SERVICE_URL=http://localhost:3004
VITE_ENRICHMENT_SERVICE_URL=http://localhost:3005
```

### Hot Reload

Le hot reload est activé par défaut grâce à :
- **Volume mounting** : Les fichiers sources (`src/`) sont montés en temps réel
- **Polling** : `CHOKIDAR_USEPOLLING=true` pour compatibilité Windows/Mac
- **Vite HMR** : Hot Module Replacement natif de Vite

### Ports

- **5173** : Frontend (Vite dev server)
- Changez le port dans `docker-compose.dev.yml` si nécessaire

---

## 📝 Utilisation

### Commandes de base

```bash
# Démarrer
docker-compose -f docker-compose.dev.yml up -d

# Voir les logs
docker-compose -f docker-compose.dev.yml logs -f frontend

# Stopper
docker-compose -f docker-compose.dev.yml down

# Rebuild (après modification Dockerfile)
docker-compose -f docker-compose.dev.yml up -d --build
```

### Accéder au container

```bash
# Ouvrir un shell dans le container
docker exec -it harena_frontend_dev sh

# Installer une nouvelle dépendance
docker exec -it harena_frontend_dev npm install <package-name>

# Voir les logs Vite en direct
docker logs -f harena_frontend_dev
```

### Vérifier le hot reload

1. Ouvrir le frontend : http://localhost:5173
2. Modifier un fichier dans `src/` (ex: `src/App.tsx`)
3. Sauvegarder
4. ✅ La page devrait se recharger automatiquement

---

## 🏗️ Build de Production

Pour créer une image de production optimisée :

```bash
# Build l'image de production
docker build -t harena-frontend:latest .

# Lancer en production
docker run -d \
  --name harena_frontend_prod \
  --network harena-network \
  -p 80:80 \
  harena-frontend:latest
```

Le frontend sera accessible sur : **http://localhost**

---

## 🔍 Troubleshooting

### Hot reload ne fonctionne pas

**Problème** : Les modifications ne sont pas détectées.

**Solutions** :

1. Vérifier que `CHOKIDAR_USEPOLLING=true` est configuré :
   ```bash
   docker exec harena_frontend_dev env | grep CHOKIDAR
   ```

2. Vérifier que les volumes sont bien montés :
   ```bash
   docker inspect harena_frontend_dev | grep -A 10 Mounts
   ```

3. Redémarrer le container :
   ```bash
   docker-compose -f docker-compose.dev.yml restart
   ```

### Port 5173 déjà utilisé

**Problème** : `Error: bind: address already in use`

**Solution** : Changer le port dans `docker-compose.dev.yml` :

```yaml
ports:
  - "5174:5173"  # Utiliser 5174 au lieu de 5173
```

### Erreur de connexion aux services backend

**Problème** : `Failed to fetch` ou `ERR_CONNECTION_REFUSED`

**Solutions** :

1. Vérifier que les services backend sont lancés :
   ```bash
   docker ps | grep harena
   ```

2. Vérifier le réseau Docker :
   ```bash
   docker network inspect harena-network
   ```

3. Vérifier les URLs dans `.env` :
   ```bash
   cat .env | grep VITE_
   ```

### node_modules non trouvés

**Problème** : `Error: Cannot find module 'react'`

**Solution** : Rebuild l'image pour réinstaller les dépendances :

```bash
docker-compose -f docker-compose.dev.yml down
docker-compose -f docker-compose.dev.yml up -d --build
```

### Performances lentes

**Problème** : Le hot reload est très lent.

**Solutions** :

1. Désactiver le polling si sur Linux :
   ```yaml
   environment:
     - CHOKIDAR_USEPOLLING=false
   ```

2. Augmenter les ressources Docker :
   - Docker Desktop → Settings → Resources
   - Augmenter CPU (4+) et RAM (4GB+)

3. Exclure des dossiers du watching dans `vite.config.ts` :
   ```ts
   server: {
     watch: {
       ignored: ['**/node_modules/**', '**/dist/**']
     }
   }
   ```

---

## 📊 Comparaison Dev vs Prod

| Aspect | Dev (Dockerfile.dev) | Prod (Dockerfile) |
|--------|---------------------|-------------------|
| **Image de base** | node:20-alpine | nginx:alpine |
| **Taille** | ~500MB | ~25MB |
| **Hot reload** | ✅ Oui | ❌ Non |
| **Build** | Non nécessaire | ✅ Optimisé |
| **Performance** | Moyenne | ✅ Maximale |
| **Port** | 5173 | 80 |
| **Usage** | Développement | Production |

---

## 🛠️ Fichiers Docker

### Fichiers créés

```
harena_front/
├── Dockerfile                 # Production (nginx)
├── Dockerfile.dev             # Développement (hot reload)
├── docker-compose.dev.yml     # Orchestration dev
├── .dockerignore              # Fichiers à exclure
└── vite.config.ts             # Configuration Vite (modifié)
```

### Volumes montés (dev)

- `./src` → Code source (hot reload)
- `./public` → Assets statiques
- `./.env` → Configuration
- Config files (vite.config.ts, tsconfig.json, etc.)

### Volumes exclus

- `node_modules` → Utilise ceux du container
- `dist` → Généré par le build

---

## 🔗 Intégration avec le Backend

Le frontend Docker communique avec les services backend via le réseau `harena-network`.

### Architecture complète

```
┌─────────────────────────────────────────────────────────────┐
│                    harena-network (Docker)                  │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Frontend (5173)          Backend Services                 │
│  ├─ Vite Dev Server       ├─ User Service (3000)          │
│  └─ Hot Reload            ├─ Search Service (3001)         │
│                           ├─ Metric Service (3002)         │
│                           ├─ Conversation Service (3003)   │
│                           ├─ Sync Service (3004)           │
│                           └─ Enrichment Service (3005)     │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Lancer tout le stack

```bash
# Depuis le dossier racine harena/
docker-compose up -d  # Backend services

# Depuis harena_front/
docker-compose -f docker-compose.dev.yml up -d  # Frontend
```

---

## 📚 Ressources

- [Vite Documentation](https://vitejs.dev/)
- [Docker Documentation](https://docs.docker.com/)
- [React Hot Reload](https://vitejs.dev/guide/features.html#hot-module-replacement)

---

## 🆘 Support

Si vous rencontrez des problèmes :

1. Vérifier les logs :
   ```bash
   docker-compose -f docker-compose.dev.yml logs -f
   ```

2. Vérifier l'état du container :
   ```bash
   docker ps -a | grep frontend
   ```

3. Tester sans Docker :
   ```bash
   npm install
   npm run dev
   ```

---

**Créé le** : 2025-10-18
**Version** : 1.0
**Compatible avec** : Frontend v2.2.0, Backend v4.0.2
