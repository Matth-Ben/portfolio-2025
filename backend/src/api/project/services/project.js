'use strict';

/**
 * project service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::project.project', ({ strapi }) => ({
  /**
   * Génère les métadonnées SEO pour un projet
   * @param {Object} project - Le projet
   * @param {string} locale - La locale
   * @returns {Object} Les métadonnées SEO
   */
  async generateSeoMetadata(project, locale = 'fr') {
    const seoData = project.seo || {};
    
    const defaultSeo = {
      title: project.title || 'Portfolio 2025',
      description: project.description || project.excerpt || 'Portfolio professionnel - Développeur web full-stack',
      keywords: 'développeur, web, full-stack, portfolio, projets',
      author: 'Martin',
      image: '/og-image.jpg',
      type: 'website',
      robots: 'index, follow',
      ogLocale: 'fr_FR',
      ogSiteName: 'Portfolio 2025',
      twitterCard: 'summary_large_image',
      twitterSite: '@yourtwitter',
      twitterCreator: '@yourtwitter'
    };

    // Fusionner avec les données SEO personnalisées
    const seo = { ...defaultSeo, ...seoData };

    // Générer l'URL canonique
    const baseUrl = strapi.config.get('server.url') || 'https://yourdomain.com';
    const canonical = seo.canonical || `${baseUrl}/projects/${project.slug || ''}`;

    // Générer l'image complète
    const fullImage = seo.image.startsWith('http') 
      ? seo.image 
      : `${baseUrl}${seo.image}`;

    return {
      // Meta tags de base
      title: seo.title === 'Portfolio 2025' ? seo.title : `${seo.title} | Portfolio 2025`,
      description: seo.description,
      keywords: seo.keywords,
      author: seo.author,
      robots: seo.robots,
      canonical,

      // Open Graph
      og: {
        type: seo.type,
        url: canonical,
        title: seo.title,
        description: seo.description,
        image: fullImage,
        locale: seo.ogLocale,
        siteName: seo.ogSiteName
      },

      // Twitter Card
      twitter: {
        card: seo.twitterCard,
        url: canonical,
        title: seo.title,
        description: seo.description,
        image: fullImage,
        site: seo.twitterSite,
        creator: seo.twitterCreator
      },

      // Structured Data
      structuredData: {
        "@context": "https://schema.org",
        "@type": "CreativeWork",
        "headline": seo.title,
        "description": seo.description,
        "image": fullImage,
        "url": canonical,
        "author": {
          "@type": "Person",
          "name": seo.author
        },
        "publisher": {
          "@type": "Organization",
          "name": seo.ogSiteName,
          "logo": {
            "@type": "ImageObject",
            "url": `${baseUrl}/logo.png`
          }
        },
        "mainEntityOfPage": {
          "@type": "WebPage",
          "@id": canonical
        },
        "dateCreated": project.startDate,
        "dateModified": project.updatedAt
      }
    };
  }
})); 