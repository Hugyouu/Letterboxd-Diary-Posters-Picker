# frontend/Dockerfile
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./

ENV NODE_OPTIONS="--max-old-space-size=512"
RUN npm ci --silent --legacy-peer-deps

COPY . .
ARG REACT_APP_API_URL=""
ENV REACT_APP_API_URL=${REACT_APP_API_URL}

# nginx pour servir les fichiers statiques
FROM nginx:stable-alpine AS runner

# Copy build output
COPY --from=builder /app/build /usr/share/nginx/html

# Optionnel : config nginx simple (si tu veux un fallback pour SPA)
# Crée un fichier nginx.conf local et COPY-le ici si tu veux une config spécifique.
# Exemple basique pour SPA (fallback to index.html)
# COPY nginx-spa.conf /etc/nginx/conf.d/nginx-spa.conf

# Expose port 80 (Caddy fera reverse proxy)
EXPOSE 80

# Utilisateur par défaut (nginx image gère user)
CMD ["nginx", "-g", "daemon off;"]