// Utilitaire pour gérer les variables d'environnement
export const getStrapiUrl = (): string => {
  // En mode développement, utiliser l'URL par défaut
  if (import.meta.env.DEV) {
    return import.meta.env.STRAPI_URL || 'http://localhost:1337';
  }
  
  // En production, utiliser la variable d'environnement
  return import.meta.env.STRAPI_URL || 'https://your-strapi-domain.com';
}; 