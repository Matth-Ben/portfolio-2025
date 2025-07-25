# 🚀 Projet Web Full-Stack

Un projet web moderne utilisant **Strapi** comme CMS backend et **Astro** comme framework frontend, avec une architecture Docker pour le développement.

## 📋 Table des matières

- [Technologies utilisées](#-technologies-utilisées)
- [Architecture](#-architecture)
- [Prérequis](#-prérequis)
- [Installation](#-installation)
- [Développement](#-développement)
- [Déploiement](#-déploiement)
- [Structure du projet](#-structure-du-projet)
- [API Strapi](#-api-strapi)
- [Contribuer](#-contribuer)

## 🛠 Technologies utilisées

### Backend (Strapi)
- **Strapi v5.18.0** - CMS headless moderne
- **SQLite** - Base de données (développement)
- **TypeScript** - Typage statique
- **Node.js 20** - Runtime JavaScript

### Frontend (Astro)
- **Astro v5.11.0** - Framework web moderne
- **Tailwind CSS** - Framework CSS utilitaire
- **GSAP** - Animations avancées
- **Lenis** - Défilement fluide
- **TypeScript** - Typage statique

### Infrastructure
- **Docker & Docker Compose** - Conteneurisation
- **Node.js 20** - Runtime JavaScript

## 🏗 Architecture

```
project-root/
├── backend/          # API Strapi (CMS)
│   ├── src/
│   │   ├── api/      # Controllers, routes, services
│   │   ├── components/ # Composants Strapi
│   │   └── admin/    # Interface d'administration
│   └── public/       # Fichiers statiques
├── frontend/         # Application Astro
│   ├── src/
│   │   ├── pages/    # Pages Astro
│   │   ├── components/ # Composants réutilisables
│   │   └── styles/   # Styles CSS
│   └── public/       # Assets statiques
└── docker-compose.yml # Configuration Docker
```

## 📋 Prérequis

- **Node.js** 18+ (recommandé 20+)
- **Docker** et **Docker Compose**
- **Git**

## 🚀 Installation

### Option 1 : Installation rapide avec Docker (Recommandée)

```bash
# Cloner le repository
git clone <votre-repo>
cd project-root

# Lancer l'installation automatique
docker-compose up setup

# Démarrer les services
docker-compose up -d
```

### Option 2 : Installation manuelle

```bash
# Cloner le repository
git clone <votre-repo>
cd project-root

# Backend Strapi
cd backend
npm install
npm run develop

# Frontend Astro (nouveau terminal)
cd frontend
npm install
npm run dev
```

## 💻 Développement

### Commandes Docker

```bash
# Démarrer tous les services
docker-compose up -d

# Voir les logs
docker-compose logs -f

# Arrêter les services
docker-compose down

# Reconstruire les images
docker-compose build --no-cache
```

### Commandes de développement

#### Backend (Strapi)
```bash
cd backend

# Développement
npm run develop

# Build pour production
npm run build

# Démarrer en production
npm run start

# Console Strapi
npm run console
```

#### Frontend (Astro)
```bash
cd frontend

# Développement
npm run dev

# Build pour production
npm run build

# Prévisualiser le build
npm run preview
```

### URLs de développement

- **Frontend Astro** : http://localhost:3000
- **Backend Strapi** : http://localhost:1337
- **Admin Strapi** : http://localhost:1337/admin

## 🚀 Déploiement

### Variables d'environnement

Créez un fichier `.env` dans le dossier `backend/` :

```env
# Base de données
DATABASE_CLIENT=sqlite
DATABASE_FILENAME=.tmp/data.db

# Sécurité
JWT_SECRET=your-jwt-secret
ADMIN_JWT_SECRET=your-admin-jwt-secret
APP_KEYS=your-app-keys
API_TOKEN_SALT=your-api-token-salt

# URL Strapi pour le frontend
STRAPI_URL=http://localhost:1337
```

### Production

```bash
# Build du frontend
cd frontend
npm run build

# Build du backend
cd backend
npm run build
npm run start
```

## 📁 Structure du projet

### Backend (Strapi)

```
backend/
├── src/
│   ├── api/                 # API endpoints
│   │   └── page/           # Exemple d'API
│   ├── components/         # Composants Strapi
│   │   ├── sections/      # Sections de contenu
│   │   └── ui/            # Composants UI
│   ├── admin/             # Interface d'administration
│   └── extensions/        # Extensions Strapi
├── config/                # Configuration Strapi
├── public/                # Fichiers statiques
└── database/              # Migrations et seeds
```

### Frontend (Astro)

```
frontend/
├── src/
│   ├── pages/             # Pages Astro
│   ├── components/        # Composants réutilisables
│   │   └── sections/     # Sections de page
│   ├── layouts/          # Layouts Astro
│   ├── styles/           # Styles CSS
│   ├── utils/            # Utilitaires
│   └── config/           # Configuration
├── public/               # Assets statiques
└── dist/                 # Build de production
```

## 🔌 API Strapi

### Endpoints disponibles

- **Pages** : `GET /api/pages`
- **Sections** : `GET /api/sections`
- **Services** : `GET /api/services`
- **Contact** : `POST /api/contact`

### Exemple d'utilisation

```javascript
// Récupérer les pages
const response = await fetch('http://localhost:1337/api/pages');
const pages = await response.json();

// Récupérer une page avec ses relations
const page = await fetch('http://localhost:1337/api/pages/1?populate=*');
```

## 🎨 Composants disponibles

### Sections
- **Hero** - Section d'accueil
- **Services** - Liste des services
- **Contact** - Formulaire de contact
- **Titre** - Titres de section

### UI
- **Button** - Boutons stylisés
- **ContactInfo** - Informations de contact
- **Service** - Carte de service

## 🔧 Configuration

### Strapi

Les configurations Strapi se trouvent dans `backend/config/` :
- `database.ts` - Configuration de la base de données
- `server.ts` - Configuration du serveur
- `admin.ts` - Configuration de l'admin
- `api.ts` - Configuration de l'API

### Astro

Configuration dans `frontend/astro.config.mjs` :
- Intégration Tailwind CSS
- Configuration des routes
- Optimisations de build

## 🐛 Dépannage

### Problèmes courants

1. **Ports déjà utilisés**
   ```bash
   # Vérifier les ports utilisés
   netstat -tulpn | grep :3000
   netstat -tulpn | grep :1337
   ```

2. **Permissions Docker**
   ```bash
   # Donner les permissions
   sudo chown -R $USER:$USER .
   ```

3. **Cache Docker**
   ```bash
   # Nettoyer le cache
   docker system prune -a
   ```

## 🤝 Contribuer

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 📞 Support

Pour toute question ou problème :
- Ouvrir une issue sur GitHub
- Consulter la documentation Strapi : https://docs.strapi.io
- Consulter la documentation Astro : https://docs.astro.build

---

**Développé avec ❤️ en utilisant Strapi et Astro** 