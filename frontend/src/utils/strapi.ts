const STRAPI_API_URL = 'http://strapi:1337';
export const STRAPI_PUBLIC_URL = 'http://localhost:1337';

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