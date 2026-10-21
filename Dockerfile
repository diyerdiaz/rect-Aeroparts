# syntax=docker/dockerfile:1

# ---------- 1. Compilar la app ----------
FROM docker.io/library/node:22-alpine AS build
WORKDIR /app

# Primero solo las dependencias, para aprovechar la caché de capas.
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund

COPY . .
# Vacío = el navegador llama a /api en el mismo dominio y Nginx lo redirige al backend.
ARG VITE_API_URL=
ENV VITE_API_URL=$VITE_API_URL
RUN npm run build

# ---------- 2. Servir con Nginx (sin root) ----------
FROM docker.io/nginxinc/nginx-unprivileged:1.27-alpine

# Backend al que se redirige /api. Sin barra al final.
ENV API_UPSTREAM=https://fastapi.inventarios.proyecto.lol

COPY nginx/security-headers.conf /etc/nginx/snippets/security-headers.conf
COPY nginx/default.conf.template /etc/nginx/templates/default.conf.template
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=3s --retries=3 \
  CMD wget -q -O /dev/null http://127.0.0.1:8080/healthz || exit 1
