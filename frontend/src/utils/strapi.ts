const STRAPI_API_URL = 'http://strapi:1337';
export const STRAPI_PUBLIC_URL = 'http://strapi:1337';

export interface StrapiResponse<T> {
  data: T[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

export interface Button {
  id: number;
  text: string;
  url?: string;
  variant: 'primary' | 'secondary' | 'outline';
  icon?: string;
}

export interface Service {
  id: number;
  title: string;
  description?: string;
  icon?: string;
  color: 'blue' | 'green' | 'purple' | 'red' | 'yellow' | 'indigo';
}

export interface ContactInfo {
  id: number;
  email?: string;
  phone?: string;
  address?: string;
  socialLinks?: any;
}

import type { StrapiImage } from './media';

export interface BaseSection {
  id: number;
  __component: string;
}

export interface HeroSection extends BaseSection {
  __component: 'sections.hero';
  title: string;
  subtitle?: string;
  description?: string;
  primaryButton?: Button;
  secondaryButton?: Button;
  backgroundImage?: StrapiImage;
  backgroundStyle?: string;
}

export interface ServicesSection extends BaseSection {
  __component: 'sections.services';
  title: string;
  subtitle?: string;
  services: Service[];
}

export interface ContactSection extends BaseSection {
  __component: 'sections.contact';
  title: string;
  subtitle?: string;
  contactInfo?: ContactInfo;
  showForm: boolean;
}

export interface PageData {
  id: number;
  title: string;
  sections?: (HeroSection | ServicesSection | ContactSection)[];
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

// Interfaces pour les projets
export interface ProjectData {
  id: number;
  title: string;
  slug: string;
  description?: string;
  content?: string;
  excerpt?: string;
  featuredImage?: StrapiImage;
  gallery?: StrapiImage[];
  technologies?: string[];
  githubUrl?: string;
  liveUrl?: string;
  startDate?: string;
  endDate?: string;
  status?: 'draft' | 'in-progress' | 'completed' | 'archived';
  featured?: boolean;
  seo?: any;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

export async function fetchPageByTitle(title: string): Promise<PageData | null> {
  const url = `${STRAPI_API_URL}/api/pages?filters[title][$eq]=${encodeURIComponent(title)}&populate[sections][populate]=*`;
  
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
    }
    
    const data: StrapiResponse<PageData> = await response.json();
    
    if (data.data && data.data.length > 0) {
      return data.data[0];
    }
    
    return null;
  } catch (error) {
    console.error('Erreur lors de la récupération de la page depuis Strapi:', error);
    return null;
  }
}

/**
 * Récupère les sections d'une page par son ID
 */
export async function fetchPageSections(pageId: number): Promise<any[]> {
  try {
    const url = `${STRAPI_API_URL}/api/pages?filters[id][$eq]=${pageId}&populate=*`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      return [];
    }
    
    const data = await response.json();
    const sections = data.data?.[0]?.sections || [];
    
    return sections;
  } catch (error) {
    console.error('Erreur lors de la récupération des sections:', error);
    return [];
  }
}

/**
 * Récupère tous les projets
 */
export async function fetchProjects(): Promise<ProjectData[]> {
  try {
    const url = `${STRAPI_API_URL}/api/projects?populate=*&sort=createdAt:desc`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      console.error('Erreur lors de la récupération des projets:', response.status, response.statusText);
      return [];
    }
    
    const data: StrapiResponse<ProjectData> = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Erreur lors de la récupération des projets:', error);
    return [];
  }
}

/**
 * Récupère un projet par son slug
 */
export async function fetchProjectBySlug(slug: string): Promise<ProjectData | null> {
  try {
    const url = `${STRAPI_API_URL}/api/projects?filters[slug][$eq]=${encodeURIComponent(slug)}&populate=*`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      console.error('Erreur lors de la récupération du projet:', response.status, response.statusText);
      return null;
    }
    
    const data: StrapiResponse<ProjectData> = await response.json();
    
    if (data.data && data.data.length > 0) {
      return data.data[0];
    }
    
    return null;
  } catch (error) {
    console.error('Erreur lors de la récupération du projet:', error);
    return null;
  }
}

/**
 * Récupère tous les slugs des projets pour getStaticPaths
 */
export async function fetchProjectSlugs(): Promise<string[]> {
  try {
    const url = `${STRAPI_API_URL}/api/projects?fields=slug`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      console.error('Erreur lors de la récupération des slugs:', response.status, response.statusText);
      return [];
    }
    
    const data: StrapiResponse<{ slug: string }> = await response.json();
    return data.data?.map(project => project.slug) || [];
  } catch (error) {
    console.error('Erreur lors de la récupération des slugs:', error);
    return [];
  }
}

// Interfaces pour les single types
export interface HomeData {
  id: number;
  projects?: ProjectData[];
  SEO?: any;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

export interface AboutData {
  id: number;
  Titre?: any;
  Description?: any;
  Competences?: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

export interface ContactData {
  id: number;
  Github?: string;
  Twitter?: string;
  Linkedin?: string;
  Titre?: any;
  Email?: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

/**
 * Récupère les données de la page Home (single type)
 */
export async function fetchHomeData(): Promise<HomeData | null> {
  try {
    const url = `${STRAPI_API_URL}/api/home?populate[projects][populate][featuredImage][populate]=*`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      console.error('Erreur lors de la récupération de la page Home:', response.status, response.statusText);
      return null;
    }
    
    const data = await response.json();
    return data.data || null;
  } catch (error) {
    console.error('Erreur lors de la récupération de la page Home:', error);
    return null;
  }
}

/**
 * Récupère les données de la page About (single type)
 */
export async function fetchAboutData(): Promise<AboutData | null> {
  try {
    const url = `${STRAPI_API_URL}/api/about?populate=*`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      console.error('Erreur lors de la récupération de la page About:', response.status, response.statusText);
      return null;
    }
    
    const data = await response.json();
    return data.data || null;
  } catch (error) {
    console.error('Erreur lors de la récupération de la page About:', error);
    return null;
  }
}

/**
 * Récupère les données de la page Contact (single type)
 */
export async function fetchContactData(): Promise<ContactData | null> {
  try {
    const url = `${STRAPI_API_URL}/api/contact?populate=*`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      console.error('Erreur lors de la récupération de la page Contact:', response.status, response.statusText);
      return null;
    }
    
    const data = await response.json();
    return data.data || null;
  } catch (error) {
    console.error('Erreur lors de la récupération de la page Contact:', error);
    return null;
  }
} 