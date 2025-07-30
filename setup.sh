#!/bin/bash

set -e

echo "🛠 Création Astro..."

cd /frontend || exit 1

# Vérifie s'il existe déjà un projet Astro
if [ -f "package.json" ]; then
  echo "⚠️  Un projet Astro existe déjà dans /frontend. Installation ignorée."
else
  echo "📦 Initialisation de Astro..."

  # Créer un package.json minimal
  cat > package.json << 'EOF'
{
  "name": "astro-frontend",
  "type": "module",
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview"
  }
}
EOF

  # Installer Astro, Tailwind, Lenis, GSAP
  npm install astro tailwindcss postcss autoprefixer gsap lenis

  # Init Tailwind si pas déjà fait
  if [ ! -f "tailwind.config.js" ]; then
    npx tailwindcss init -p
  fi

  # Créer structure Astro minimale si pas encore là
  mkdir -p src/pages src/styles
  
  if [ ! -f src/pages/index.astro ]; then
    cat > src/pages/index.astro << 'EOF'
<!DOCTYPE html>
<html>
<head>
  <title>Astro</title>
</head>
<body>
  <h1>Hello Astro</h1>
</body>
</html>
EOF
  fi
  
  if [ ! -f src/styles/global.css ]; then
    cat > src/styles/global.css << 'EOF'
@tailwind base;
@tailwind components;
@tailwind utilities;
EOF
  fi

  # Créer config Astro si absente
  if [ ! -f astro.config.mjs ]; then
    cat > astro.config.mjs << 'EOF'
import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";

export default defineConfig({
  integrations: [tailwind()],
});
EOF
  fi

  # Créer config Tailwind si absente
  if [ ! -f tailwind.config.js ]; then
    cat > tailwind.config.js << 'EOF'
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,js,ts}"],
  theme: {
    extend: {},
  },
  plugins: [],
};
EOF
  fi

  echo "✅ Astro installé."
fi

# Vérifie Dockerfile pour Astro
if [ -f Dockerfile ]; then
  echo "📦 Dockerfile déjà présent dans /frontend."
else
  echo "📝 Création du Dockerfile pour Astro..."
  cat > Dockerfile << 'EOF'
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000
CMD ["npm", "run", "dev"]
EOF
  echo "✅ Dockerfile Astro généré."
fi

echo ""
echo "🛠 Initialisation Strapi..."

cd /backend || exit 1

# Vérifie si Strapi est déjà initialisé
if [ -f "package.json" ] && grep -q strapi package.json; then
  echo "⚠️  Strapi est déjà installé dans /backend. Installation ignorée."
else
  echo "📦 Installation de Strapi..."

  # Créer un nouveau projet Strapi
  echo "📁 Création du projet Strapi..."
  npx create-strapi-app@latest . --quickstart --no-run --typescript

  # Installer les dépendances si nécessaire
  if [ -f "package.json" ]; then
    echo "📦 Installation des dépendances..."
    npm install
  fi

  echo "✅ Strapi installé."
fi

# Vérifie Dockerfile pour Strapi
if [ -f Dockerfile ]; then
  echo "📦 Dockerfile déjà présent dans /backend."
else
  echo "📝 Création du Dockerfile pour Strapi..."
  cat > Dockerfile << 'EOF'
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 1337
CMD ["npm", "run", "develop"]
EOF
  echo "✅ Dockerfile Strapi généré."
fi

echo ""
echo "✅ Setup complet terminé 🎉" 