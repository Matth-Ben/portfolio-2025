# Guide des Composants Strapi

## 📋 **Structure des composants créés**

### **Composants de sections** (`src/components/sections/`)

#### 1. **Hero** (`sections.hero`)
- **Description** : Section hero avec titre, description et boutons
- **Champs** :
  - `title` (string, requis) - Titre principal
  - `subtitle` (string) - Sous-titre
  - `description` (text) - Description
  - `primaryButton` (component: ui.button) - Bouton principal
  - `secondaryButton` (component: ui.button) - Bouton secondaire
  - `backgroundImage` (media) - Image de fond

#### 2. **Services** (`sections.services`)
- **Description** : Section de services avec liste de services
- **Champs** :
  - `title` (string, requis) - Titre de la section
  - `subtitle` (string) - Sous-titre
  - `services` (component: ui.service, répétable 1-6) - Liste des services

#### 3. **Contact** (`sections.contact`)
- **Description** : Section de contact avec formulaire et informations
- **Champs** :
  - `title` (string, requis) - Titre de la section
  - `subtitle` (string) - Sous-titre
  - `contactInfo` (component: ui.contact-info) - Informations de contact
  - `showForm` (boolean, défaut: true) - Afficher le formulaire

### **Composants UI** (`src/components/ui/`)

#### 1. **Button** (`ui.button`)
- **Description** : Bouton réutilisable avec texte et lien
- **Champs** :
  - `text` (string, requis) - Texte du bouton
  - `url` (string) - URL de destination
  - `variant` (enum: primary/secondary/outline) - Style du bouton
  - `icon` (string) - Icône (nom de classe CSS)

#### 2. **Service** (`ui.service`)
- **Description** : Service individuel avec icône, titre et description
- **Champs** :
  - `title` (string, requis) - Titre du service
  - `description` (text) - Description du service
  - `icon` (string) - Icône du service
  - `color` (enum: blue/green/purple/red/yellow/indigo) - Couleur du service

#### 3. **ContactInfo** (`ui.contact-info`)
- **Description** : Informations de contact
- **Champs** :
  - `email` (email) - Adresse email
  - `phone` (string) - Numéro de téléphone
  - `address` (text) - Adresse
  - `socialLinks` (json) - Liens sociaux

## 🎯 **Utilisation dans les pages**

### **Dynamic Zone "sections"**
Votre Collection Type "Page" a maintenant un champ `sections` qui est une **Dynamic Zone**. Cela signifie que vous pouvez :

1. **Ajouter plusieurs sections** dans n'importe quel ordre
2. **Choisir le type de section** (Hero, Services, Contact)
3. **Personnaliser chaque section** avec ses propres champs

### **Exemple d'utilisation**

Dans l'admin Strapi, pour une page "Accueil" :

1. **Section Hero** :
   - Titre : "Bienvenue sur MonSite"
   - Description : "Nous créons des expériences digitales exceptionnelles"
   - Bouton principal : "Découvrir nos services" → "#services"
   - Bouton secondaire : "En savoir plus" → "/about"

2. **Section Services** :
   - Titre : "Nos Services"
   - Services : [
     - { titre: "Développement Web", description: "Sites web modernes...", couleur: "blue" },
     - { titre: "Applications Mobiles", description: "Apps natives...", couleur: "green" }
   ]

3. **Section Contact** :
   - Titre : "Contactez-nous"
   - Informations : { email: "contact@monsite.com", téléphone: "+33 1 23 45 67 89" }

## 🔧 **Développement frontend**

### **Récupération des données**
```typescript
const pageData = await fetchPageByTitle('Accueil');

// Accès aux sections
pageData.sections?.forEach(section => {
  switch(section.__component) {
    case 'sections.hero':
      // Rendu de la section Hero
      break;
    case 'sections.services':
      // Rendu de la section Services
      break;
    case 'sections.contact':
      // Rendu de la section Contact
      break;
  }
});
```

### **Rendu conditionnel**
```astro
{pageData.sections?.map(section => {
  switch(section.__component) {
    case 'sections.hero':
      return <HeroSection data={section} />;
    case 'sections.services':
      return <ServicesSection data={section} />;
    case 'sections.contact':
      return <ContactSection data={section} />;
    default:
      return null;
  }
})}
```

## 🚀 **Avantages de cette approche**

1. **Flexibilité** : Créez des pages avec des sections dans n'importe quel ordre
2. **Réutilisabilité** : Les composants UI peuvent être utilisés partout
3. **Maintenabilité** : Structure claire et organisée
4. **Évolutivité** : Facile d'ajouter de nouveaux composants

## 📝 **Ajout de nouveaux composants**

Pour ajouter un nouveau composant :

1. **Créer le fichier JSON** dans `src/components/`
2. **Ajouter le composant** à la Dynamic Zone dans le schéma
3. **Mettre à jour l'interface TypeScript** dans le frontend
4. **Redémarrer Strapi** pour appliquer les changements 