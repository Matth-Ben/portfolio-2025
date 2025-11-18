// Utilitaire pour gérer l'état global du carousel de la home page

const CAROUSEL_SLIDE_KEY = 'homeCarouselSlide';

/**
 * Sauvegarder la slide active du carousel
 */
export function saveCarouselSlide(slideIndex: number): void {
  sessionStorage.setItem(CAROUSEL_SLIDE_KEY, slideIndex.toString());
}

/**
 * Récupérer la slide sauvegardée (retourne null si aucune n'est sauvegardée)
 */
export function getSavedCarouselSlide(): number | null {
  const saved = sessionStorage.getItem(CAROUSEL_SLIDE_KEY);
  return saved !== null ? parseInt(saved, 10) : null;
}

/**
 * Effacer la slide sauvegardée
 */
export function clearCarouselSlide(): void {
  sessionStorage.removeItem(CAROUSEL_SLIDE_KEY);
}

/**
 * Vérifier si une slide est sauvegardée
 */
export function hasCarouselSlide(): boolean {
  return sessionStorage.getItem(CAROUSEL_SLIDE_KEY) !== null;
}

/**
 * Obtenir l'état complet du carousel
 */
export function getCarouselState() {
  return {
    currentSlide: getSavedCarouselSlide(),
    hasSavedState: hasCarouselSlide()
  };
}
