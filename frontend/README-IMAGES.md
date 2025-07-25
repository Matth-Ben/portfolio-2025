# Guide des Images avec Strapi

## 📸 **Gestion des images dans Strapi**

### **1. Upload d'images**
- Accédez à **Media Library** dans l'admin Strapi
- Uploadez vos images (formats supportés : JPG, PNG, GIF, WebP)
- Strapi génère automatiquement plusieurs formats optimisés

### **2. Utilisation dans les composants**
- Dans vos composants (ex: sections.hero), utilisez le champ `backgroundImage`
- Type : **Media** avec restriction aux images
- Strapi retourne automatiquement les formats optimisés

## 🔧 **Utilitaires d'images**

### **Fonctions disponibles** (`src/utils/images.ts`)

#### `getStrapiImageUrl(image)`
```typescript
// Récupère l'URL complète d'une image
const imageUrl = getStrapiImageUrl(imageData);
```

#### `getBackgroundImageUrl(backgroundImage)`
```typescript
// Récupère l'URL depuis un champ backgroundImage
const bgUrl = getBackgroundImageUrl(section.backgroundImage);
```

#### `getBackgroundImageStyle(backgroundImage, overlayOpacity)`
```typescript
// Génère le style CSS pour une image de fond avec overlay
const style = getBackgroundImageStyle(section.backgroundImage, 0.4);
// Retourne: "background-image: linear-gradient(...), url('...')"
```

#### `getOptimizedImageUrl(image, format)`
```typescript
// Récupère une image optimisée selon le format
const optimizedUrl = getOptimizedImageUrl(image, 'medium');
// Formats disponibles: 'thumbnail', 'small', 'medium', 'large'
```

## 🎨 **Exemples d'utilisation**

### **1. Image de fond pour Hero**
```astro
---
import { getBackgroundImageStyle } from '../utils/images';

const backgroundStyle = getBackgroundImageStyle(section.backgroundImage, 0.4);
---

<section class="bg-cover bg-center" style={backgroundStyle}>
  <!-- Contenu du hero -->
</section>
```

### **2. Image optimisée**
```astro
---
import { getOptimizedImageUrl } from '../utils/images';

const imageUrl = getOptimizedImageUrl(imageData, 'medium');
---

<img src={imageUrl} alt="Description" class="w-full h-auto" />
```

### **3. Image avec fallback**
```astro
---
import { getStrapiImageUrl } from '../utils/images';

const imageUrl = getStrapiImageUrl(imageData) || '/default-image.jpg';
---

<img src={imageUrl} alt="Description" />
```

## 📱 **Formats automatiques générés par Strapi**

Strapi génère automatiquement ces formats :
- **thumbnail** : 245x156px
- **small** : 500x320px  
- **medium** : 750x480px
- **large** : 1000x640px
- **original** : Taille originale

## 🚀 **Bonnes pratiques**

### **1. Optimisation des performances**
```typescript
// Utilisez le format approprié selon le contexte
const heroImage = getOptimizedImageUrl(image, 'large');     // Hero
const cardImage = getOptimizedImageUrl(image, 'medium');    // Cartes
const thumbnail = getOptimizedImageUrl(image, 'small');     // Miniatures
```

### **2. Gestion des erreurs**
```typescript
// Toujours prévoir un fallback
const imageUrl = getStrapiImageUrl(image) || '/default.jpg';
```

### **3. Accessibilité**
```astro
<img 
  src={imageUrl} 
  alt={image?.attributes?.alternativeText || 'Description par défaut'}
  loading="lazy"
/>
```

## 🔍 **Structure des données d'image**

```typescript
interface StrapiImage {
  id: number;
  attributes: {
    name: string;
    alternativeText?: string;
    caption?: string;
    width: number;
    height: number;
    formats: {
      thumbnail: { url: string; width: number; height: number; };
      small: { url: string; width: number; height: number; };
      medium: { url: string; width: number; height: number; };
      large: { url: string; width: number; height: number; };
    };
    url: string;
    // ... autres propriétés
  };
}
```

## 🎯 **Configuration dans Strapi**

### **Champ Media dans un composant**
```json
{
  "backgroundImage": {
    "type": "media",
    "multiple": false,
    "required": false,
    "allowedTypes": ["images"]
  }
}
```

### **Options disponibles**
- `multiple: false` : Une seule image
- `multiple: true` : Plusieurs images
- `allowedTypes: ["images"]` : Images seulement
- `allowedTypes: ["images", "videos"]` : Images et vidéos 