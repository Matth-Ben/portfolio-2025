// Configuration des environnements
export const config = {
  // URL de Strapi selon l'environnement
  strapiUrl: (import.meta.env as any).STRAPI_URL,
  
  // Mode de développement
  isDevelopment: (import.meta.env as any).MODE === 'development',
  
  // Mode Docker (détecté par les variables d'environnement Docker)
  isDocker: (import.meta.env as any).CHOKIDAR_USEPOLLING === 'true',
  
  // URLs par défaut selon l'environnement
  get defaultStrapiUrl() {
    if (this.isDocker) {
      return 'http://strapi:1337'; // Dans Docker, utiliser le nom du service
    } else {
      return 'http://localhost:1337'; // En local, utiliser localhost
    }
  }
};

// Export de l'URL finale
export const STRAPI_URL = config.strapiUrl || config.defaultStrapiUrl; 