# Dockerfile pour production
FROM node:20-alpine AS builder

WORKDIR /app

# Copier les fichiers de dépendances
COPY package.json package-lock.json* ./

# Installer les dépendances
RUN npm ci

# Copier le reste de l'application
COPY . .

# Déclarer les ARG pour les variables d'environnement Vite
ARG VITE_USER_SERVICE_URL
ARG VITE_SEARCH_SERVICE_URL
ARG VITE_METRIC_SERVICE_URL
ARG VITE_CONVERSATION_SERVICE_URL
ARG VITE_BUDGET_PROFILING_API_URL

# Exposer les ARG comme variables d'environnement pour le build Vite
ENV VITE_USER_SERVICE_URL=$VITE_USER_SERVICE_URL
ENV VITE_SEARCH_SERVICE_URL=$VITE_SEARCH_SERVICE_URL
ENV VITE_METRIC_SERVICE_URL=$VITE_METRIC_SERVICE_URL
ENV VITE_CONVERSATION_SERVICE_URL=$VITE_CONVERSATION_SERVICE_URL
ENV VITE_BUDGET_PROFILING_API_URL=$VITE_BUDGET_PROFILING_API_URL

# Build de production
RUN npm run build

# Image de production avec nginx
FROM nginx:alpine

# Copier les fichiers buildés
COPY --from=builder /app/dist /usr/share/nginx/html

# Copier la configuration nginx personnalisée
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exposer le port 80
EXPOSE 80

# Healthcheck
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
