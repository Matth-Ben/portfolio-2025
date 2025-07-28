# Composants SEO - Portfolio 2025

Ce document explique comment utiliser le composant SEO créé pour le frontend (Astro) et le backend (Strapi).

## 🎯 Frontend - Composant SEO Astro

### Installation et utilisation

Le composant SEO est situé dans `frontend/src/components/SEO.astro` et peut être utilisé dans n'importe quelle page Astro.

#### Utilisation de base

```astro
---
import SEO from '../components/SEO.astro';
---

<SEO 
  title="Ma Page"
  description="Description de ma page"
  image="/images/ma-page.jpg"
/>
```

#### Utilisation avancée pour un article

```astro
---
import SEO from '../components/SEO.astro';

const article = {
  title: "Comment optimiser les performances web",
  description: "Guide complet pour améliorer les performances...",
  publishedAt: "2025-01-15T10:00:00Z",
  tags: ["performance", "web", "optimisation"]
};
---

<SEO 
  title={article.title}
  description={article.description}
  type="article"
  publishedTime={article.publishedAt}
  tags={article.tags}
  image="/images/performance-article.jpg"
/>
```

### Propriétés disponibles

| Propriété | Type | Défaut | Description |
|-----------|------|--------|-------------|
| `title` | string | "Portfolio 2025" | Titre de la page |
| `description` | string | "Portfolio professionnel..." | Description de la page |
| `keywords` | string | "développeur, web..." | Mots-clés |
| `author` | string | "Martin" | Auteur |
| `image` | string | "/og-image.jpg" | Image Open Graph |
| `url` | string | URL actuelle | URL de la page |
| `type` | string | "website" | Type de contenu |
| `publishedTime` | string | - | Date de publication |
| `modifiedTime` | string | - | Date de modification |
| `section` | string | - | Section (pour articles) |
| `tags` | string[] | [] | Tags (pour articles) |
| `twitterCard` | string | "summary_large_image" | Type de carte Twitter |
| `twitterSite` | string | "@yourtwitter" | Compte Twitter du site |
| `twitterCreator` | string | "@yourtwitter" | Compte Twitter de l'auteur |
| `robots` | string | "index, follow" | Instructions pour les robots |
| `canonical` | string | URL actuelle | URL canonique |
| `ogLocale` | string | "fr_FR" | Locale Open Graph |
| `ogSiteName` | string | "Portfolio 2025" | Nom du site |

## 🔧 Backend - Composant SEO Strapi

### Structure du système SEO

Le système SEO Strapi comprend :

1. **Composant SEO Metadata réutilisable** (`backend/src/components/seo/seo-metadata.js`)
   - Métadonnées de base : titre, description, mots-clés
   - Open Graph : titre, description, image, type
   - Twitter Card : type de carte, site, créateur
   - Données d'article : dates, section, tags
   - Configuration : robots, URL canonique

2. **Services SEO intégrés** dans les types de contenu existants
   - Méthodes pour générer les métadonnées SEO
   - Validation et génération automatique

### Configuration dans le Content-Type Builder

#### 1. Le composant SEO Metadata apparaît dans la liste des composants

Après avoir redémarré Strapi, vous devriez voir :
- **Composants** → **SEO Metadata** (avec l'icône de recherche)

#### 2. Utilisation du composant dans vos types de contenu

Pour ajouter le SEO à vos pages, articles ou projets :

1. Allez dans **Content-Type Builder**
2. Sélectionnez votre type de contenu (ex: Page)
3. Cliquez sur **Add another field**
4. Choisissez **Component**
5. Sélectionnez **SEO Metadata**
6. Configurez les options :
   - **Type** : Single component
   - **Required** : Non (optionnel selon vos besoins)
   - **Min/Max** : 1/1 (pour un seul composant SEO)

#### 3. Champs disponibles dans le composant SEO

Le composant SEO Metadata inclut :

**Informations de base :**
- `title` (string, max 60 caractères)
- `description` (text, max 160 caractères)
- `keywords` (text)
- `author` (string)

**Open Graph :**
- `ogTitle` (string, max 60 caractères)
- `ogDescription` (text, max 160 caractères)
- `ogImage` (media, images uniquement)
- `ogType` (enum: website, article, profile, book)

**Twitter Card :**
- `twitterCard` (enum: summary, summary_large_image, app, player)
- `twitterSite` (string)
- `twitterCreator` (string)

**Article specific :**
- `publishedTime` (datetime)
- `modifiedTime` (datetime)
- `section` (string)
- `tags` (json)

**Configuration :**
- `robots` (string, défaut: "index, follow")
- `canonical` (string)

### Utilisation dans le code

#### Récupération des données avec SEO

```javascript
// Dans un service ou contrôleur
const pages = await strapi.entityService.findMany('api::page.page', {
  filters: { slug: 'ma-page' },
  populate: {
    seo: {
      populate: '*'
    }
  }
});

const page = pages[0];
const seoData = page.seo || {};
```

#### Génération des métadonnées SEO

```javascript
// Dans le service Page
const pageService = strapi.service('api::page.page');
const seoMetadata = await pageService.generateSeoMetadata(page);
```

### Exemple de réponse avec SEO

```json
{
  "id": 1,
  "attributes": {
    "title": "Ma Page",
    "slug": "ma-page",
    "content": "Contenu de la page...",
    "seo": {
      "title": "Titre SEO personnalisé",
      "description": "Description SEO personnalisée",
      "keywords": "mot-clé1, mot-clé2",
      "author": "Martin",
      "ogTitle": "Titre Open Graph",
      "ogDescription": "Description Open Graph",
      "ogImage": {
        "id": 1,
        "url": "/uploads/image.jpg"
      },
      "ogType": "website",
      "twitterCard": "summary_large_image",
      "twitterSite": "@yourtwitter",
      "twitterCreator": "@yourtwitter",
      "robots": "index, follow",
      "canonical": "https://yourdomain.com/ma-page"
    }
  }
}
```

## 🔗 Intégration Frontend-Backend

### Récupération des métadonnées depuis Strapi

```astro
---
import SEO from '../components/SEO.astro';

// Récupérer la page avec ses métadonnées SEO
const response = await fetch(`${import.meta.env.STRAPI_URL}/api/pages?filters[slug][$eq]=ma-page&populate[seo][populate]=*`);
const { data: pages } = await response.json();
const page = pages[0];

// Extraire les données SEO
const seoData = page.attributes.seo || {};
---

<SEO 
  title={seoData.title || page.attributes.title}
  description={seoData.description || page.attributes.description}
  keywords={seoData.keywords}
  author={seoData.author}
  image={seoData.ogImage?.url || seoData.image}
  canonical={seoData.canonical}
  robots={seoData.robots}
/>
```

### Utilisation avec les layouts Astro

```astro
---
// layouts/BaseLayout.astro
import SEO from '../components/SEO.astro';

export interface Props {
  seo?: {
    title?: string;
    description?: string;
    image?: string;
    type?: string;
    publishedTime?: string;
    tags?: string[];
  };
}

const { seo = {} } = Astro.props;
---

<html lang="fr">
  <head>
    <SEO {...seo} />
    <!-- Autres balises head -->
  </head>
  <body>
    <slot />
  </body>
</html>
```

## 🚀 Bonnes pratiques

### 1. Optimisation des images
- Utilisez des images de 1200x630px pour Open Graph
- Compressez les images (WebP recommandé)
- Ajoutez des attributs alt descriptifs

### 2. Mots-clés
- Limitez à 5-10 mots-clés pertinents
- Évitez le keyword stuffing
- Utilisez des mots-clés long-tail

### 3. Descriptions
- Gardez entre 150-160 caractères
- Incluez un appel à l'action
- Soyez descriptif et engageant

### 4. Titres
- Limitez à 50-60 caractères
- Incluez le mot-clé principal
- Soyez unique pour chaque page

### 5. Données structurées
- Utilisez le JSON-LD fourni
- Testez avec Google Rich Results Test
- Ajoutez des données spécifiques selon le type de contenu

## 🔍 Tests et validation

### Outils recommandés
- **Google Rich Results Test** : Test des données structurées
- **Facebook Sharing Debugger** : Test Open Graph
- **Twitter Card Validator** : Test Twitter Cards
- **Google PageSpeed Insights** : Performance SEO
- **Screaming Frog** : Audit SEO complet

### Validation automatique
Le composant SEO inclut des validations automatiques :
- Longueur des titres et descriptions
- Format des URLs canoniques
- Présence des métadonnées obligatoires

## 📝 Configuration

### Variables d'environnement

```env
# Frontend (.env)
STRAPI_URL=http://localhost:1337

# Backend (.env)
SERVER_URL=https://yourdomain.com
```

### Personnalisation des valeurs par défaut

Modifiez les valeurs par défaut dans :
- `frontend/src/components/SEO.astro` (lignes 20-35)
- `backend/src/api/page/services/page.js` (lignes 15-30)

## 🔧 Dépannage

### Le composant SEO n'apparaît pas dans le Content-Type Builder

1. **Redémarrez Strapi** :
   ```bash
   cd backend
   npm run develop
   ```

2. **Vérifiez la structure des fichiers** :
   - Le composant doit être dans `backend/src/components/seo/seo-metadata.js`
   - Le `kind` doit être `'component'` et non `'collectionType'`

3. **Vérifiez les permissions** :
   - Assurez-vous d'avoir les droits d'administrateur
   - Vérifiez que l'utilisateur peut accéder au Content-Type Builder

### Erreur de conflit de noms

Si vous obtenez une erreur "singular name should be unique" :
1. Vérifiez qu'il n'y a pas de conflit entre les noms de composants
2. Assurez-vous que chaque entité a un nom unique
3. Redémarrez Strapi après avoir corrigé les noms

### Le composant n'apparaît pas dans les types de contenu

1. Vérifiez que vous avez bien ajouté le composant dans le Content-Type Builder
2. Assurez-vous que le composant est configuré comme "Single component"
3. Vérifiez que vous avez sauvegardé les modifications

## 🆘 Support

Pour toute question ou problème :
1. Vérifiez la documentation Strapi
2. Consultez les logs d'erreur
3. Testez avec les outils de validation mentionnés
4. Vérifiez la configuration des variables d'environnement
5. Redémarrez Strapi après les modifications 