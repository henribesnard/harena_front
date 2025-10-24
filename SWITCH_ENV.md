# 🔄 Basculer entre Backend Local et AWS

## TL;DR - Commande Rapide

```bash
# Backend local (Docker)
./switch-env.sh local    # Linux/Mac
switch-env.bat local     # Windows

# Backend AWS (production)
./switch-env.sh aws      # Linux/Mac
switch-env.bat aws       # Windows
```

Le conteneur Docker redémarre automatiquement (hot reload) ! 🔥

## 📋 Fichiers de Configuration

| Fichier | Backend | URLs |
|---------|---------|------|
| `.env.local` | Docker local | `localhost:3000-3008` |
| `.env.aws` | AWS prod | `63.35.52.216` |
| `.env` | **Actif** | Copie de .local ou .aws |

## 🎯 Comment ça marche ?

### Le fichier `.env` est monté dans Docker

Le `docker-compose.dev.yml` monte `.env` dans le conteneur :
```yaml
volumes:
  - ./.env:/app/.env
```

Quand vous modifiez `.env`, **Vite redémarre automatiquement** !

### Les scripts copient simplement le bon fichier

```bash
cp .env.local .env   # Active le backend local
cp .env.aws .env     # Active le backend AWS
```

## ✅ Vérifier l'environnement actuel

### Option 1: Regarder le fichier

```bash
cat .env | grep VITE_USER_SERVICE_URL
```

**Local:** `http://localhost:3000`
**AWS:** `http://63.35.52.216`

### Option 2: Console navigateur

Ouvrez F12, onglet Network, et regardez les requêtes API :
- Local : `localhost:3000/api/v1/...`
- AWS : `63.35.52.216/api/v1/...`

## 🔧 Basculement Manuel (sans script)

Si vous préférez le faire manuellement :

```bash
# Backend local
cp .env.local .env

# Backend AWS
cp .env.aws .env
```

Attendez 2-3 secondes, Vite redémarre !

## 📊 Architecture

### Backend Local
```
Navigateur (localhost:5174)
    ↓ API calls
Backend Docker (localhost:3000-3008)
```

### Backend AWS
```
Navigateur (localhost:5174)
    ↓ API calls via Internet
Nginx AWS (63.35.52.216)
    ↓ reverse proxy
Backend Docker (AWS EC2)
```

## 🐛 Dépannage

### Le changement ne prend pas effet

1. Vérifiez les logs du conteneur :
   ```bash
   docker logs harena_frontend_dev --tail 20
   ```

2. Vous devriez voir :
   ```
   [vite] .env changed, restarting server...
   [vite] server restarted.
   ```

3. Si rien ne se passe, redémarrez manuellement :
   ```bash
   docker-compose -f docker-compose.dev.yml restart
   ```

### Les appels API échouent

**Backend local** : Vérifiez que les services Docker tournent
```bash
cd ..  # Dossier harena parent
docker-compose ps
```

**Backend AWS** : Vérifiez que les services sont UP
```bash
curl http://63.35.52.216/health
```

### Erreurs CORS

Les backends sont configurés pour accepter les requêtes du frontend.

Si problème, vérifiez dans `.env` que les URLs sont correctes (pas de trailing slash).

## 💡 Astuces

### Voir quel environnement sans ouvrir les fichiers

Ajoutez ceci à votre prompt shell (~/.bashrc ou ~/.zshrc) :

```bash
harena_env() {
    if [ -f ~/path/to/harena_front/.env ]; then
        grep VITE_USER_SERVICE_URL ~/path/to/harena_front/.env | \
        sed 's/.*localhost.*/LOCAL/' | \
        sed 's/.*63.35.52.216.*/AWS/'
    fi
}
```

### Alias pratiques

```bash
alias harena-local="cd ~/path/to/harena_front && ./switch-env.sh local"
alias harena-aws="cd ~/path/to/harena_front && ./switch-env.sh aws"
```

---

**Note** : Les fichiers `.env.local` et `.env.aws` sont versionnés (pas de secrets dedans, juste des URLs publiques). Le `.env` est ignoré par Git.
