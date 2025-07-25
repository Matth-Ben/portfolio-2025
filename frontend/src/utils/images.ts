import type { StrapiImage } from './strapi';

const STRAPI_URL = (import.meta.env as any).STRAPI_URL || 'http://strapi:1337';

/**
 * Récupère l'URL complète d'une image Strapi
 */
export function getStrapiImageUrl(image: StrapiImage | null | undefined): string | null {
  if (!image) return null;
  
  // Si l'URL est déjà complète (commence par http), la retourner telle quelle
  if (image.attributes.url.startsWith('http')) {
    return image.attributes.url;
  }
  
  // Sinon, construire l'URL complète
  return `${STRAPI_URL}${image.attributes.url}`;
}

/**
 * Récupère l'URL d'une image depuis un objet backgroundImage Strapi
 */
export function getBackgroundImageUrl(backgroundImage: any): string | null {
  if (!backgroundImage?.data) return null;
  return getStrapiImageUrl(backgroundImage.data);
}

/**
 * Génère le style CSS pour une image de fond avec overlay
 */
export function getBackgroundImageStyle(
  backgroundImage: any, 
  overlayOpacity: number = 0.4
): string {
  const imageUrl = getBackgroundImageUrl(backgroundImage);
  
  if (imageUrl) {
    return `background-image: linear-gradient(rgba(0, 0, 0, ${overlayOpacity}), rgba(0, 0, 0, ${overlayOpacity})), url('${imageUrl}')`;
  }
  
  // Fallback vers un gradient par défaut
  return 'background: linear-gradient(135deg, #2563eb 0%, #7c3aed 50%, #4f46e5 100%)';
}

/**
 * Récupère l'URL optimisée d'une image avec format spécifique
 */
export function getOptimizedImageUrl(
  image: StrapiImage | null | undefined,
  format: 'thumbnail' | 'small' | 'medium' | 'large' = 'medium'
): string | null {
  if (!image) return null;
  
  // Essayer d'utiliser un format optimisé
  if (image.attributes.formats?.[format]?.url) {
    const formatUrl = image.attributes.formats[format].url;
    if (formatUrl.startsWith('http')) {
      return formatUrl;
    }
    return `${STRAPI_URL}${formatUrl}`;
  }
  
  // Fallback vers l'image originale
  return getStrapiImageUrl(image);
} 