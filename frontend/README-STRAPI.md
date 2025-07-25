# Intégration Strapi avec Astro

## Configuration

### 1. Variables d'environnement

#### Pourquoi `strapi:1337` au lieu de `localhost:1337` ?

**Dans Docker :**
- Chaque conteneur a son propre `localhost`
- `localhost` dans Astro = conteneur Astro
- `localhost` dans Strapi = conteneur Strapi
- Pour communiquer entre conteneurs, on utilise le **nom du service** (`strapi`)

**Sans Docker :**
- Tous les processus partagent le même `localhost`
- Pas de problème de communication

#### Configuration automatique

Le système détecte automatiquement l'environnement :

**Pour Docker (recommandé)**
La variable d'environnement est déjà configurée dans `docker-compose.yml` :
```yaml
STRAPI_URL=http://strapi:1337
```

**Pour le développement local (sans Docker)**
Créez un fichier `.env` dans le dossier `frontend/` avec :
```env
STRAPI_URL=http://localhost:1337
```

### 2. Structure de la Collection Type "Page" dans Strapi

Assurez-vous que votre Collection Type "Page" dans Strapi contient les champs suivants :

- `title` (Text) - Titre de la page
- `heroTitle` (Text) - Titre principal du hero
- `heroTitleHighlight` (Text) - Partie mise en évidence du titre
- `heroDescription` (Textarea) - Description du hero
- `primaryButtonText` (Text) - Texte du bouton principal
- `secondaryButtonText` (Text) - Texte du bouton secondaire
- `content` (Rich Text) - Contenu principal de la page

### 3. Création de la page "Accueil"

1. Connectez-vous à l'admin Strapi
2. Allez dans "Content Manager" > "Page"
3. Créez une nouvelle page avec le titre "Accueil"
4. Remplissez les champs selon vos besoins
5. Publiez la page

## Utilisation

Le contenu de la page "Accueil" sera automatiquement récupéré et affiché sur la page d'accueil d'Astro.

### Fonctionnalités

- **Récupération automatique** : Le contenu est récupéré côté serveur lors du build
- **Fallback** : Si Strapi n'est pas disponible, le contenu par défaut est affiché
- **Gestion d'erreurs** : Les erreurs de connexion sont gérées gracieusement

### Personnalisation

Pour ajouter de nouveaux champs :

1. Ajoutez le champ dans Strapi
2. Mettez à jour l'interface `PageData` dans `src/utils/strapi.ts`
3. Utilisez le champ dans vos templates Astro

## Debug et dépannage

### 🔍 Méthodes de debug

#### 1. **Page de debug web** (Recommandé)
Accédez à : http://localhost:3000/debug
- Tests automatiques de l'API Strapi
- Affichage des erreurs détaillées
- Interface graphique claire

#### 2. **Logs détaillés dans la console**
Les logs de debug sont maintenant activés dans `src/utils/strapi.ts`. Vérifiez la console du navigateur ou les logs Docker :
```bash
docker logs astro
```

#### 3. **Test depuis le conteneur**
```bash
# Exécuter le script de debug dans le conteneur Astro
docker exec astro bash /app/debug-strapi.sh
```

#### 4. **Test direct de l'API**
```bash
# Depuis votre machine locale
node frontend/test-strapi.js
```

### 🚨 Problèmes courants

#### Erreur ECONNREFUSED
- **Cause** : Strapi n'est pas accessible depuis Astro
- **Solution** : Vérifiez que les conteneurs sont sur le même réseau Docker

#### Erreur 404 sur l'API
- **Cause** : L'endpoint API n'existe pas
- **Solution** : Vérifiez que Strapi est bien démarré et que la Collection Type "Page" existe

#### Aucune page trouvée
- **Cause** : La page "Accueil" n'existe pas dans Strapi
- **Solution** : Créez la page dans l'admin Strapi

## Développement
```bash
# Démarrer tous les services
docker-compose up

# Ou en arrière-plan
docker-compose up -d
```

### Option 2 : Développement local
```bash
# Démarrer Strapi
cd backend
npm run develop

# Démarrer Astro (dans un autre terminal)
cd frontend
npm run dev
```

### Accès
- Strapi Admin : http://localhost:1337/admin
- Astro Frontend : http://localhost:3000 