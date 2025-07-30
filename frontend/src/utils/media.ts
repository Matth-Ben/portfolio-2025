import { STRAPI_PUBLIC_URL } from './strapi';

// URL pour les images (accessible depuis le navigateur)
const STRAPI_IMAGE_URL = 'http://localhost:1337';
// URL pour les requêtes API (réseau Docker interne)
const STRAPI_URL = STRAPI_PUBLIC_URL;

// Cache pour les images déjà récupérées
const imageCache = new Map<number, StrapiImage>();

export interface StrapiImage {
  id: number;
  attributes: {
    name: string;
    alternativeText?: string;
    caption?: string;
    width: number;
    height: number;
    formats?: {
      thumbnail?: { url: string; width: number; height: number; };
      small?: { url: string; width: number; height: number; };
      medium?: { url: string; width: number; height: number; };
      large?: { url: string; width: number; height: number; };
    };
    hash: string;
    ext: string;
    mime: string;
    size: number;
    url: string;
    previewUrl?: string;
    provider: string;
    provider_metadata?: any;
    createdAt: string;
    updatedAt: string;
  };
}

export interface StrapiMediaResponse {
  data: StrapiImage;
  meta: any;
}

/**
 * Récupère une image par son ID depuis Strapi
 */
export async function getImageById(imageId: number): Promise<StrapiImage | null> {
  if (imageCache.has(imageId)) {
    return imageCache.get(imageId)!;
  }

  try {
    const response = await fetch(`${STRAPI_URL}/api/upload/files/${imageId}`);
    
    if (!response.ok) {
      return null;
    }

    const imageData = await response.json();
    imageCache.set(imageId, imageData);
    
    return imageData;
  } catch (error) {
    console.error(`Erreur lors de la récupération de l'image ${imageId}:`, error);
    return null;
  }
}

/**
 * Récupère plusieurs images par leurs IDs
 */
export async function getImagesByIds(imageIds: number[]): Promise<StrapiImage[]> {
  const images: StrapiImage[] = [];
  
  for (const imageId of imageIds) {
    const image = await getImageById(imageId);
    if (image) {
      images.push(image);
    }
  }
  
  return images;
}

/**
 * Récupère l'URL complète d'une image
 */
export function getImageUrl(image: StrapiImage | null | undefined): string | null {
  if (!image) return null;
  
  // Gérer les deux formats possibles de Strapi
  let imageUrl: string;
  
  if (image.attributes) {
    // Format avec attributes (Strapi v4 standard)
    imageUrl = image.attributes.url;
  } else {
    // Format direct (comme reçu dans les Dynamic Zones)
    imageUrl = (image as any).url;
  }
  
  if (!imageUrl) return null;
  
  // Si l'URL est déjà complète (commence par http), la retourner telle quelle
  if (imageUrl.startsWith('http')) {
    return imageUrl;
  }
  
  // Sinon, construire l'URL complète avec l'URL publique pour les images
  return `${STRAPI_IMAGE_URL}${imageUrl}`;
}

/**
 * Récupère l'URL d'une image depuis un objet backgroundImage Strapi
 */
export function getBackgroundImageUrl(backgroundImage: any): string | null {
  if (!backgroundImage?.data) return null;
  return getImageUrl(backgroundImage.data);
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
 * Récupère une image optimisée selon le format
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
    return `${STRAPI_IMAGE_URL}${formatUrl}`;
  }
  
  // Fallback vers l'image originale
  return getImageUrl(image);
}

/**
 * Récupère l'URL d'une image par ID avec format optimisé
 */
export async function getOptimizedImageUrlById(
  imageId: number,
  format: 'thumbnail' | 'small' | 'medium' | 'large' = 'medium'
): Promise<string | null> {
  const image = await getImageById(imageId);
  return getOptimizedImageUrl(image, format);
}

/**
 * Récupère le style de fond pour une image par ID
 */
export async function getBackgroundImageStyleById(
  imageId: number,
  overlayOpacity: number = 0.4
): Promise<string> {
  const image = await getImageById(imageId);
  
  if (image) {
    const imageUrl = getImageUrl(image);
    return `background-image: linear-gradient(rgba(0, 0, 0, ${overlayOpacity}), rgba(0, 0, 0, ${overlayOpacity})), url('${imageUrl}')`;
  }
  
  // Fallback vers un gradient par défaut
  return 'background: linear-gradient(135deg, #2563eb 0%, #7c3aed 50%, #4f46e5 100%)';
}

/**
 * Nettoie le cache des images
 */
export function clearImageCache(): void {
  imageCache.clear();
}

/**
 * Récupère les statistiques du cache
 */
export function getImageCacheStats(): { size: number; keys: number[] } {
  return {
    size: imageCache.size,
    keys: Array.from(imageCache.keys())
  };
} 