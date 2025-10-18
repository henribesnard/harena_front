# 🚀 Harena Frontend - Quick Start

Guide de démarrage rapide pour lancer le frontend en 2 minutes.

---

## ⚡ Lancement Ultra-Rapide

### Option 1 : Docker avec Hot Reload (Recommandé)

```bash
# 1. Créer le réseau Docker (une seule fois)
docker network create harena-network

# 2. Lancer le frontend
cd harena_front
docker-compose -f docker-compose.dev.yml up -d

# 3. Ouvrir le navigateur
# http://localhost:5173
```

✅ **Avantages** :
- Hot reload automatique
- Environnement isolé
- Aucune installation Node.js nécessaire

### Option 2 : Développement Local (Sans Docker)

```bash
# 1. Installer les dépendances
npm install

# 2. Lancer le serveur de dev
npm run dev

# 3. Ouvrir le navigateur
# http://localhost:5173
```

✅ **Avantages** :
- Plus rapide au démarrage
- Familier pour développeurs React/Vite

---

## 📝 Configuration

### Variables d'environnement (.env)

Le fichier `.env` est déjà configuré pour l'architecture microservices :

```env
VITE_USER_SERVICE_URL=http://localhost:3000
VITE_SEARCH_SERVICE_URL=http://localhost:3001
VITE_METRIC_SERVICE_URL=http://localhost:3002
VITE_CONVERSATION_SERVICE_URL=http://localhost:3003
VITE_SYNC_SERVICE_URL=http://localhost:3004
VITE_ENRICHMENT_SERVICE_URL=http://localhost:3005
```

---

## 🔧 Commandes Utiles

### Docker

```bash
# Voir les logs en temps réel
docker logs -f harena_frontend_dev

# Redémarrer
docker-compose -f docker-compose.dev.yml restart

# Stopper
docker-compose -f docker-compose.dev.yml down

# Rebuild après modification Dockerfile
docker-compose -f docker-compose.dev.yml up -d --build
```

### NPM

```bash
# Build production
npm run build

# Prévisualiser le build
npm run preview

# Linter
npm run lint
```

---

## ✅ Vérification

### 1. Frontend accessible

```bash
curl http://localhost:5173
```

Devrait retourner du HTML avec Vite.

### 2. Hot reload fonctionne

1. Modifier `src/App.tsx`
2. Sauvegarder
3. La page se recharge automatiquement

### 3. Connexion au backend

Ouvrir http://localhost:5173 dans le navigateur.

Si les services backend sont lancés, le frontend devrait fonctionner normalement.

---

## 🆘 Problèmes Courants

### Port 5173 déjà utilisé

```bash
# Trouver le processus
lsof -i :5173  # Mac/Linux
netstat -ano | findstr :5173  # Windows

# Changer le port dans docker-compose.dev.yml
ports:
  - "5174:5173"
```

### Hot reload ne marche pas

```bash
# Vérifier que le container tourne
docker ps | grep frontend

# Vérifier les logs
docker logs harena_frontend_dev
```

### Erreur 404 sur les services backend

Vérifier que les services backend sont lancés :

```bash
docker ps | grep harena
```

---

## 📚 Documentation Complète

- **DOCKER_README.md** - Guide Docker complet
- **README.md** - Documentation projet
- **.env.example** - Exemple de configuration

---

## 🎯 Prochaines Étapes

1. ✅ Frontend lancé
2. Lancer les services backend (`cd .. && docker-compose up -d`)
3. Ouvrir http://localhost:5173
4. Se connecter avec un compte test
5. Tester les fonctionnalités

---

**Version** : v2.3.0
**Créé le** : 2025-10-18
