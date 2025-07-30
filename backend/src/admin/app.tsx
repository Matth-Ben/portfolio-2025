import type { StrapiApp } from '@strapi/strapi/admin';

export default {
  config: {
    locales: [
      'fr',
      'en',
    ],
    translations: {
      fr: {
        'app.components.LeftMenu.navbrand.title': 'Portfolio Admin',
      },
    },
  },
  bootstrap(app: StrapiApp) {
    // Configuration personnalisée pour résoudre les problèmes de contexte
    console.log('Strapi Admin initialisé avec succès');
  },
}; 