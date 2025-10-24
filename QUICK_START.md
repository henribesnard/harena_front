# 🚀 Démarrage Rapide - Harena Frontend

## TL;DR

```bash
# Développement local
npm install
npm run dev

# Build pour production AWS
npm run build:prod
```

## 🎯 Choix de l'environnement

### Option 1: Développement Local 🏠

```bash
# Démarre avec backend sur localhost
npm run dev
```

**Utilise**: `.env.local` (URLs localhost)

**Backend requis**:
- Docker Compose lancé avec tous les services
- Ports 3000-3008 disponibles

### Option 2: Test avec Production AWS ☁️

```bash
# Démarre avec backend AWS
npm run dev:prod
```

**Utilise**: `.env.production` (URLs AWS)

**Backend requis**: Services déployés sur 63.35.52.216

## 📋 Scripts Disponibles

| Commande | Description | Environnement |
|----------|-------------|---------------|
| `npm run dev` | Dev local | localhost |
| `npm run dev:prod` | Dev avec AWS | AWS |
| `npm run build` | Build (auto) | .env.production si existe |
| `npm run build:local` | Build local | localhost |
| `npm run build:prod` | Build production | AWS |

## 🛠️ Première Installation

### 1. Cloner et installer

```bash
git clone https://github.com/henribesnard/harena_front.git
cd harena_front
npm install
```

### 2. Configuration automatique

Les fichiers `.env.local` et `.env.production` sont déjà configurés et versionnés.

Aucune configuration manuelle n'est nécessaire! 🎉

### 3. Lancer le projet

**Avec script:**
```bash
./dev.sh      # Linux/Mac
dev.bat       # Windows
```

**Ou directement:**
```bash
npm run dev
```

## 🔍 Vérification

### Comment savoir quel backend est utilisé ?

Ouvrez la console navigateur (F12) et vérifiez les requêtes réseau:

- **Local**: `http://localhost:3000/api/v1/...`
- **AWS**: `http://63.35.52.216/api/v1/...`

### Test rapide des services

**Local:**
```bash
curl http://localhost:3000/health
curl http://localhost:3002/health
```

**Production:**
```bash
curl http://63.35.52.216/health
curl http://63.35.52.216/api/v1/users/health
```

## 🆘 Problèmes Fréquents

### Les services ne répondent pas en local

```bash
# Vérifier que Docker Compose est lancé
cd ..  # Retour au dossier racine harena
docker-compose ps

# Redémarrer si nécessaire
docker-compose restart
```

### Port 5173 déjà utilisé

```bash
# Vite utilisera automatiquement le port suivant disponible
# Ou spécifier un port:
npm run dev -- --port 3100
```

### Erreurs CORS

Les backends sont configurés pour accepter les requêtes du frontend.

Si problème, vérifiez que vous appelez le bon backend (local vs AWS).

## 📚 Documentation Complète

Pour plus de détails, voir:
- [ENVIRONMENTS.md](./ENVIRONMENTS.md) - Guide complet des environnements
- [README.md](./README.md) - Documentation générale

## ✅ Checklist de Démarrage

- [ ] Node.js installé (v18+)
- [ ] Dépendances installées (`npm install`)
- [ ] Backend choisi (local ou AWS)
- [ ] Services backend opérationnels
- [ ] `npm run dev` fonctionne
- [ ] Interface accessible sur http://localhost:5173

---

**Astuce**: Ajoutez cette commande à vos alias shell pour démarrer encore plus vite:

```bash
# Dans ~/.bashrc ou ~/.zshrc
alias harena-dev="cd ~/path/to/harena_front && npm run dev"
```
