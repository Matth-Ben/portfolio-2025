export interface TransitionOptions {
  duration?: number;
  ease?: string;
  delay?: number;
}

export class PageTransitionManager {
  private static instance: PageTransitionManager;
  private isTransitioning = false;

  static getInstance(): PageTransitionManager {
    if (!PageTransitionManager.instance) {
      PageTransitionManager.instance = new PageTransitionManager();
    }
    return PageTransitionManager.instance;
  }

  // Animation d'entrée avec fade up
  enter(options: TransitionOptions = {}): Promise<void> {
    const { duration = 0.8, ease = 'power2.out', delay = 0.3 } = options;
    
    return new Promise((resolve) => {
      const mainContent = document.querySelector('main');
      if (!mainContent) {
        resolve();
        return;
      }

      window.gsap.set(mainContent, { 
        opacity: 0, 
        y: 50 
      });
      
      window.gsap.to(mainContent, {
        opacity: 1,
        y: 0,
        duration,
        ease,
        delay,
        onComplete: resolve
      });
    });
  }

  // Animation de sortie avec fade down
  exit(options: TransitionOptions = {}): Promise<void> {
    const { duration = 0.6, ease = 'power2.inOut' } = options;
    
    return new Promise((resolve) => {
      const mainContent = document.querySelector('main');
      if (!mainContent) {
        resolve();
        return;
      }

      window.gsap.to(mainContent, {
        opacity: 0,
        y: -30,
        duration,
        ease,
        onComplete: resolve
      });
    });
  }

  // Transition complète entre pages
  async transitionTo(url: string, options: TransitionOptions = {}): Promise<void> {
    if (this.isTransitioning) return;
    
    this.isTransitioning = true;
    
    try {
      await this.exit(options);
      window.location.href = url;
    } catch (error) {
      console.error('Erreur lors de la transition:', error);
      this.isTransitioning = false;
    }
  }

  // Animation d'overlay (pour les transitions plus complexes)
  overlayTransition(direction: 'in' | 'out', options: TransitionOptions = {}): Promise<void> {
    const { duration = 0.6, ease = 'power2.inOut' } = options;
    
    return new Promise((resolve) => {
      const overlay = document.getElementById('transition-overlay');
      if (!overlay) {
        resolve();
        return;
      }

      const yValue = direction === 'in' ? '0%' : '-100%';
      const startY = direction === 'in' ? '100%' : '-100%';

      window.gsap.set(overlay, { y: startY });
      window.gsap.to(overlay, {
        y: yValue,
        duration,
        ease,
        onComplete: resolve
      });
    });
  }

  // Réinitialiser l'état de transition
  reset(): void {
    this.isTransitioning = false;
  }
}

// Fonctions utilitaires pour les transitions courantes
export const transitions = {
  // Transition simple fade up
  fadeUp: (element: Element, options: TransitionOptions = {}) => {
    const { duration = 0.8, ease = 'power2.out', delay = 0 } = options;
    
    window.gsap.set(element, { opacity: 0, y: 30 });
    window.gsap.to(element, {
      opacity: 1,
      y: 0,
      duration,
      ease,
      delay
    });
  },

  // Transition stagger pour les listes
  staggerFadeUp: (elements: Element[], options: TransitionOptions = {}) => {
    const { duration = 0.6, ease = 'power2.out', delay = 0.1 } = options;
    
    window.gsap.set(elements, { opacity: 0, y: 30 });
    window.gsap.to(elements, {
      opacity: 1,
      y: 0,
      duration,
      ease,
      stagger: delay
    });
  },

  // Transition de sortie
  fadeOut: (element: Element, options: TransitionOptions = {}) => {
    const { duration = 0.4, ease = 'power2.in' } = options;
    
    window.gsap.to(element, {
      opacity: 0,
      y: -20,
      duration,
      ease
    });
  }
};



export default PageTransitionManager.getInstance(); 