// Déclaration TypeScript pour GSAP sur window
declare global {
  interface Window {
    gsap: any;
  }
}

export interface TransitionOptions {
  duration?: number;
  ease?: string;
  delay?: number;
}

export type TransitionType =
  | 'fade'           // Fade simple
  | 'slideUp'        // Slide vers le haut
  | 'slideDown'      // Slide vers le bas
  | 'slideLeft'      // Slide vers la gauche
  | 'slideRight'     // Slide vers la droite
  | 'scale'          // Zoom in/out
  | 'wipe'           // Wipe avec overlay
  | 'curtain';       // Rideau vertical

export type PageRoute = '/' | '/about' | '/contact' | '/projects' | '/projects/[slug]';

// Configuration des transitions par paire de routes
const ROUTE_TRANSITIONS: Record<string, TransitionType> = {
  // Transitions depuis la home
  'home->about': 'slideLeft',
  'home->contact': 'wipe',
  'home->projects': 'slideUp',

  // Transitions depuis about
  'about->home': 'slideRight',
  'about->contact': 'fade',
  'about->projects': 'slideUp',

  // Transitions depuis contact
  'contact->home': 'curtain',
  'contact->about': 'fade',
  'contact->projects': 'slideUp',

  // Transitions depuis projects
  'projects->home': 'slideDown',
  'projects->about': 'slideUp',
  'projects->contact': 'slideUp',
  'projects->single-project': 'scale',

  // Transitions depuis single project
  'single-project->projects': 'scale',
  'single-project->home': 'fade',

  // Fallback par défaut
  'default': 'fade'
};

export class PageTransitionManager {
  private static instance: PageTransitionManager;
  private isTransitioning = false;
  private navigationHistory: string[] = [];

  static getInstance(): PageTransitionManager {
    if (!PageTransitionManager.instance) {
      PageTransitionManager.instance = new PageTransitionManager();
    }
    return PageTransitionManager.instance;
  }

  // Obtenir le type de page depuis l'URL
  private getPageTypeFromUrl(url: string): string {
    const path = new URL(url, window.location.origin).pathname;

    if (path === '/') return 'home';
    if (path === '/about') return 'about';
    if (path === '/contact') return 'contact';
    if (path === '/projects') return 'projects';
    if (path.startsWith('/projects/')) return 'single-project';

    return 'default';
  }

  // Obtenir le type de transition à utiliser
  private getTransitionType(fromUrl: string, toUrl: string, isBack: boolean = false): TransitionType {
    const fromPage = this.getPageTypeFromUrl(fromUrl);
    const toPage = this.getPageTypeFromUrl(toUrl);
    const key = `${fromPage}->${toPage}`;

    let transition = ROUTE_TRANSITIONS[key] || ROUTE_TRANSITIONS['default'] as TransitionType;

    // Si c'est un retour en arrière et qu'on a une transition inverse définie
    if (isBack) {
      // Chercher la transition inverse
      const reverseKey = `${toPage}->${fromPage}`;
      const reverseTransition = ROUTE_TRANSITIONS[reverseKey];

      if (reverseTransition) {
        transition = reverseTransition;
      }
    }

    return transition;
  }

  // Ajouter une URL à l'historique
  trackNavigation(url: string): void {
    this.navigationHistory.push(url);
    // Garder seulement les 10 dernières URLs
    if (this.navigationHistory.length > 10) {
      this.navigationHistory.shift();
    }
  }

  // Vérifier si c'est un retour en arrière
  isBackNavigation(toUrl: string): boolean {
    return this.navigationHistory.includes(toUrl);
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

  // Animation de sortie personnalisée selon le type de transition
  private exitWithTransition(transitionType: TransitionType, options: TransitionOptions = {}): Promise<void> {
    const { duration = 0.6, ease = 'power2.inOut' } = options;

    return new Promise((resolve) => {
      const mainContent = document.querySelector('main');
      if (!mainContent) {
        resolve();
        return;
      }

      switch (transitionType) {
        case 'fade':
          window.gsap.to(mainContent, {
            opacity: 0,
            duration,
            ease,
            onComplete: resolve
          });
          break;

        case 'slideUp':
          window.gsap.to(mainContent, {
            opacity: 0,
            y: -100,
            duration,
            ease,
            onComplete: resolve
          });
          break;

        case 'slideDown':
          window.gsap.to(mainContent, {
            opacity: 0,
            y: 100,
            duration,
            ease,
            onComplete: resolve
          });
          break;

        case 'slideLeft':
          window.gsap.to(mainContent, {
            opacity: 0,
            x: -100,
            duration,
            ease,
            onComplete: resolve
          });
          break;

        case 'slideRight':
          window.gsap.to(mainContent, {
            opacity: 0,
            x: 100,
            duration,
            ease,
            onComplete: resolve
          });
          break;

        case 'scale':
          window.gsap.to(mainContent, {
            opacity: 0,
            scale: 0.9,
            duration,
            ease,
            onComplete: resolve
          });
          break;

        case 'wipe':
        case 'curtain':
          // Ces transitions utilisent l'overlay
          this.overlayTransition('in', { duration, ease }).then(resolve);
          break;

        default:
          window.gsap.to(mainContent, {
            opacity: 0,
            y: -30,
            duration,
            ease,
            onComplete: resolve
          });
      }
    });
  }

  // Animation d'entrée personnalisée selon le type de transition
  private enterWithTransition(transitionType: TransitionType, options: TransitionOptions = {}): Promise<void> {
    const { duration = 0.8, ease = 'power2.out', delay = 0 } = options;

    return new Promise((resolve) => {
      const mainContent = document.querySelector('main');
      if (!mainContent) {
        resolve();
        return;
      }

      switch (transitionType) {
        case 'fade':
          window.gsap.fromTo(mainContent,
            { opacity: 0 },
            {
              opacity: 1,
              duration,
              ease,
              delay,
              clearProps: 'transform',
              onComplete: resolve
            }
          );
          break;

        case 'slideUp':
          window.gsap.fromTo(mainContent,
            { opacity: 0, y: 100, x: 0, scale: 1 },
            {
              opacity: 1,
              y: 0,
              duration,
              ease,
              delay,
              clearProps: 'transform',
              onComplete: resolve
            }
          );
          break;

        case 'slideDown':
          window.gsap.fromTo(mainContent,
            { opacity: 0, y: -100, x: 0, scale: 1 },
            {
              opacity: 1,
              y: 0,
              duration,
              ease,
              delay,
              clearProps: 'transform',
              onComplete: resolve
            }
          );
          break;

        case 'slideLeft':
          window.gsap.fromTo(mainContent,
            { opacity: 0, x: 100, y: 0, scale: 1 },
            {
              opacity: 1,
              x: 0,
              duration,
              ease,
              delay,
              clearProps: 'transform',
              onComplete: resolve
            }
          );
          break;

        case 'slideRight':
          window.gsap.fromTo(mainContent,
            { opacity: 0, x: -100, y: 0, scale: 1 },
            {
              opacity: 1,
              x: 0,
              duration,
              ease,
              delay,
              clearProps: 'transform',
              onComplete: resolve
            }
          );
          break;

        case 'scale':
          window.gsap.fromTo(mainContent,
            { opacity: 0, scale: 1.1, x: 0, y: 0 },
            {
              opacity: 1,
              scale: 1,
              duration,
              ease,
              delay,
              clearProps: 'transform',
              onComplete: resolve
            }
          );
          break;

        case 'wipe':
        case 'curtain':
          // S'assurer que le contenu est masqué pendant l'overlay
          window.gsap.set(mainContent, { opacity: 0, x: 0, y: 0, scale: 1 });

          // L'overlay se retire puis le contenu apparaît
          this.overlayTransition('out', { duration: duration * 0.5, ease })
            .then(() => {
              window.gsap.to(mainContent, {
                opacity: 1,
                duration: duration * 0.5,
                ease,
                clearProps: 'transform',
                onComplete: resolve
              });
            });
          break;

        default:
          window.gsap.fromTo(mainContent,
            { opacity: 0, y: 50, x: 0, scale: 1 },
            {
              opacity: 1,
              y: 0,
              duration,
              ease,
              delay,
              clearProps: 'transform',
              onComplete: resolve
            }
          );
      }
    });
  }

  // Animation de sortie avec fade down (méthode legacy)
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

  // Transition complète entre pages avec détection automatique du type
  async transitionTo(url: string, options: TransitionOptions = {}): Promise<void> {
    if (this.isTransitioning) return;

    this.isTransitioning = true;

    try {
      // Tracker la navigation
      this.trackNavigation(window.location.href);

      const transitionType = this.getTransitionType(window.location.href, url, false);
      await this.exitWithTransition(transitionType, options);
      window.location.href = url;
    } catch (error) {
      console.error('Erreur lors de la transition:', error);
      this.isTransitioning = false;
    }
  }

  // Transition spéciale pour navigation via popstate (retour/avant navigateur)
  async exitWithNavigate(url: string, options: { skipHistoryPush?: boolean } = {}): Promise<void> {
    if (this.isTransitioning) return;

    this.isTransitioning = true;

    try {
      // Détecter si c'est un retour en arrière
      const isBack = this.isBackNavigation(url);

      const transitionType = this.getTransitionType(window.location.href, url, isBack);
      await this.exitWithTransition(transitionType, { duration: 0.6, ease: 'power2.inOut' });

      // Pour popstate, on ne fait que recharger (l'URL a déjà changé)
      window.location.reload();
    } catch (error) {
      console.error('Erreur lors de la transition:', error);
      this.isTransitioning = false;
    }
  }

  // Animation d'overlay (pour les transitions wipe et curtain)
  overlayTransition(direction: 'in' | 'out', options: TransitionOptions = {}): Promise<void> {
    const { duration = 0.6, ease = 'power2.inOut' } = options;

    return new Promise((resolve) => {
      const overlay = document.getElementById('transition-overlay');
      if (!overlay) {
        resolve();
        return;
      }

      if (direction === 'in') {
        // L'overlay arrive depuis le bas
        window.gsap.fromTo(overlay,
          { y: '100%' },
          { y: '0%', duration, ease, onComplete: resolve }
        );
      } else {
        // L'overlay part vers le haut
        window.gsap.to(overlay, {
          y: '-100%',
          duration,
          ease,
          onComplete: resolve
        });
      }
    });
  }

  // Initialiser les animations d'entrée au chargement de la page
  initPageEnter(): void {
    // Récupérer le type de transition depuis le sessionStorage (défini lors de la navigation précédente)
    const transitionType = (sessionStorage.getItem('pendingTransition') as TransitionType) || 'fade';
    sessionStorage.removeItem('pendingTransition');

    // Réduire le délai pour éviter le flash - l'animation démarre immédiatement
    this.enterWithTransition(transitionType, { duration: 0.8, ease: 'power2.out', delay: 0 });
  }

  // Stocker le type de transition avant la navigation
  prepareTransition(toUrl: string): void {
    const transitionType = this.getTransitionType(window.location.href, toUrl);
    sessionStorage.setItem('pendingTransition', transitionType);
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