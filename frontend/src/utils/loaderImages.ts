import { fetchHomeData } from './strapi';
import { fetchProjects } from './strapi';
import { fetchProjectBySlug } from './strapi';
import { getImageUrl } from './media';

export interface LoaderImageData {
  imageUrl: string;
  pageType: string;
}

// Fonction pour récupérer l'image du premier projet de la page d'accueil
async function getFirstProjectImage(): Promise<string | null> {
  try {
    const homeData = await fetchHomeData();
    const featuredProjects = homeData?.projects || [];
    
    console.log('HomeData:', homeData);
    console.log('Featured projects:', featuredProjects);
    
    if (featuredProjects.length > 0) {
      const firstProject = featuredProjects[0];
      console.log('First project:', firstProject);
      
      // Utiliser la fonction getImageUrl pour gérer la structure Strapi
      if (firstProject.featuredImage) {
        const imageUrl = getImageUrl(firstProject.featuredImage);
        if (imageUrl) {
          console.log('Using featuredImage:', imageUrl);
          return imageUrl;
        }
      }
      
      // Essayer avec d'autres champs si ils existent dans le type
      if ((firstProject as any).image) {
        const imageUrl = getImageUrl((firstProject as any).image);
        if (imageUrl) {
          console.log('Using image:', imageUrl);
          return imageUrl;
        }
      }
      
      if ((firstProject as any).preview) {
        const imageUrl = getImageUrl((firstProject as any).preview);
        if (imageUrl) {
          console.log('Using preview:', imageUrl);
          return imageUrl;
        }
      }
    }
    
    console.log('Aucune image trouvée pour le premier projet');
    return null;
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'image du premier projet:', error);
    return null;
  }
}

// Fonction pour récupérer l'image du premier projet de la page projects
async function getFirstProjectsPageImage(): Promise<string | null> {
  try {
    const projects = await fetchProjects();
    
    if (projects && projects.length > 0) {
      const firstProject = projects[0];
      
      // Utiliser la fonction getImageUrl pour gérer la structure Strapi
      if (firstProject.featuredImage) {
        const imageUrl = getImageUrl(firstProject.featuredImage);
        if (imageUrl) {
          return imageUrl;
        }
      }
      
      // Essayer avec d'autres champs si ils existent dans le type
      if ((firstProject as any).image) {
        const imageUrl = getImageUrl((firstProject as any).image);
        if (imageUrl) {
          return imageUrl;
        }
      }
      
      if ((firstProject as any).preview) {
        const imageUrl = getImageUrl((firstProject as any).preview);
        if (imageUrl) {
          return imageUrl;
        }
      }
    }
    return null;
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'image du premier projet:', error);
    return null;
  }
}

// Fonction pour récupérer l'image d'un projet spécifique
async function getProjectImage(slug: string): Promise<string | null> {
  try {
    const project = await fetchProjectBySlug(slug);
    
    if (project) {
      // Utiliser la fonction getImageUrl pour gérer la structure Strapi
      if (project.featuredImage) {
        const imageUrl = getImageUrl(project.featuredImage);
        if (imageUrl) {
          return imageUrl;
        }
      }
      
      // Essayer avec d'autres champs si ils existent dans le type
      if ((project as any).image) {
        const imageUrl = getImageUrl((project as any).image);
        if (imageUrl) {
          return imageUrl;
        }
      }
      
      if ((project as any).preview) {
        const imageUrl = getImageUrl((project as any).preview);
        if (imageUrl) {
          return imageUrl;
        }
      }
    }
    return null;
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'image du projet:', error);
    return null;
  }
}

// Fonction principale pour récupérer l'image appropriée selon le type de page
export async function getLoaderImage(pageType: string, slug?: string): Promise<string | null> {
  switch (pageType) {
    case 'home':
      return await getFirstProjectImage();
      
    case 'projects':
      return await getFirstProjectsPageImage();
      
    case 'single-project':
      if (slug) {
        return await getProjectImage(slug);
      }
      return await getFirstProjectImage(); // Fallback
      
    case 'about':
    case 'contact':
      // Pour about et contact, utiliser l'image du premier projet de la page d'accueil
      return await getFirstProjectImage();
      
    default:
      return await getFirstProjectImage(); // Fallback par défaut
  }
}

// Fonction pour formater l'URL de l'image Strapi
export function formatStrapiImageUrl(url: string): string {
  if (!url) return '';
  
  // Si c'est déjà une URL complète, la retourner
  if (url.startsWith('http')) {
    return url;
  }
  
  // Sinon, ajouter le domaine Strapi
  const strapiUrl = 'http://localhost:1337';
  return `${strapiUrl}${url}`;
}

// Fonction pour obtenir les données du loader selon la page
export async function getLoaderData(pageType: string, slug?: string): Promise<LoaderImageData> {
  const imageUrl = await getLoaderImage(pageType, slug);
  
  return {
    imageUrl: imageUrl ? formatStrapiImageUrl(imageUrl) : '',
    pageType
  };
} 