# 🎭 Transition Morphing du Carousel (Home ↔ Contact)

## Vue d'ensemble

Un effet de transition avancé où le carousel de la home page **se transforme** en un petit élément de navigation sur la page Contact, puis se **réexpanse** lors du retour.

### Flux visuel

```
HOME PAGE
┌────────────────────────────────────┐
│                                    │
│     Carousel Full Screen           │
│     + Navigation Controls          │
│                                    │
└────────────────────────────────────┘
           ↓ Click "Contact"
           ↓ (Morphing: 1.2s)
           ↓
CONTACT PAGE
┌───┐──────────────────────────────┐
│ C │                              │
│ a │   Contact Content            │
│ r │   (Social Links, Email)      │
│ o │                              │
│ u │   ← Home (Back Link)         │
│ s │                              │
│ e │                              │
│ l │                              │
└───┘──────────────────────────────┘
 ↑ Miniature (120px × full height)
```

## Implémentation

### 1. Type de transition ajouté

**Fichier:** `src/utils/transitions.ts`

```typescript
export type TransitionType =
  // ... autres types
  | 'carouselMorph'; // Morphing du carousel (Home ↔ Contact)

const ROUTE_TRANSITIONS: Record<string, TransitionType> = {
  'home->contact': 'carouselMorph',
  'contact->home': 'carouselMorph',
};
```

### 2. Méthode de transition

**Méthode:** `carouselMorphTransition(direction, options)`

#### Direction: `exit` (Home → Contact)

**Étapes:**
1. **Pause du carousel** via event `pauseCarousel`
2. **Masquer `#navigation-info`** (opacity: 0, 300ms)
3. **Réduire `.carousel-container`** avec GSAP:
   - Width: `100%` → `120px`
   - Height: `100dvh` → `calc(100dvh - 40px)`
   - Position: `relative` → `fixed`
   - Left/Top: `0, 0` → `20px, 20px`
   - Duration: 1.2s
   - Easing: `power3.inOut`

```typescript
window.gsap.to(container, {
  width: '120px',
  height: 'calc(100dvh - 40px)',
  left: '20px',
  top: '20px',
  position: 'fixed',
  duration: 1.2,
  ease: 'power3.inOut'
});
```

#### Direction: `enter` (Contact → Home)

**Étapes:**
1. **Agrandir `.carousel-container`**:
   - Width: `120px` → `100%`
   - Height: `calc(100dvh - 40px)` → `100dvh`
   - Position: `fixed` → `relative`
   - Left/Top: `20px, 20px` → `0, 0`
   - Duration: 1.2s

2. **Réafficher `#navigation-info`** (après 70% de l'animation):
   - Opacity: 0 → 1
   - Duration: 400ms

3. **Resume du carousel** via event `resumeCarousel`

### 3. Page Contact

**Fichier:** `src/pages/contact.astro`

#### Structure HTML

```html
<!-- Carousel miniature avec lien retour -->
<div id="contact-carousel-mini" class="fixed left-[20px] top-[20px] ...">
  <ProjectCarousel projects={projects} />

  <a href="/" id="back-to-home-link">
    ← Home
  </a>
</div>

<!-- Contenu de la page -->
<div id="contact-content">
  <!-- Social links, email, etc. -->
</div>
```

#### Logique d'affichage

```javascript
// Vérifier si on vient de Home avec morphing
const isMorphTransition = sessionStorage.getItem('carouselMorphActive') === 'true';

if (isMorphTransition) {
  // Afficher le carousel miniature avec fade in
  setTimeout(() => {
    gsap.to(carouselMini, { opacity: 1, duration: 0.4 });
  }, 600); // Attendre la fin du morphing
}
```

### 4. Carousel - Pause/Resume

**Fichier:** `src/components/ProjectCarousel.astro`

#### Event Listeners

```javascript
// Pause: stopper la progress bar
window.addEventListener('pauseCarousel', () => {
    pauseProgressBar();
});

// Resume: redémarrer la progress bar
window.addEventListener('resumeCarousel', () => {
    setTimeout(() => {
        startProgressBar();
    }, 500);
});
```

## Timeline complète

### Home → Contact

```
T = 0ms    : Click sur "Contact"
             ├─ Event pauseCarousel dispatché
             ├─ sessionStorage.setItem('carouselMorphActive', 'true')
             └─ Timeline GSAP démarre

T = 0-300ms: Fade out #navigation-info

T = 200ms  : Début réduction carousel
             ├─ Width: 100% → 120px
             ├─ Height: 100dvh → calc(100dvh - 40px)
             └─ Position: relative → fixed (20px, 20px)

T = 1400ms : Fin morphing, navigation vers /contact

T = 1400ms : Page Contact charge
             └─ Carousel miniature masqué (opacity: 0)

T = 2000ms : Fade in carousel miniature (600ms delay)
             └─ Fade in contact content (900ms delay)
```

### Contact → Home

```
T = 0ms    : Click sur "← Home"

T = 0-300ms: Fade out contact content

T = 400ms  : Navigation vers /
             └─ sessionStorage: carouselMorphActive = true

T = 400ms  : Page Home charge
             ├─ Carousel en position mini (fixed, 120px)
             └─ Timeline GSAP démarre

T = 400ms  : Début expansion carousel
             ├─ Width: 120px → 100%
             ├─ Height: calc(100dvh - 40px) → 100dvh
             └─ Position: fixed → relative

T = 1240ms : 70% expansion atteinte
             └─ Fade in #navigation-info

T = 1600ms : Fin expansion
             ├─ Event resumeCarousel dispatché
             └─ Carousel reprend l'auto-play
```

## SessionStorage utilisé

| Clé | Valeur | Utilisation |
|-----|--------|-------------|
| `carouselMorphActive` | `'true'` | Indique qu'une transition morph est active |
| `pendingTransition` | `'carouselMorph'` | Type de transition à appliquer |
| `homeCarouselSlide` | `'0'`, `'1'`, ... | Position du carousel sauvegardée |

## CSS Requis

### Classes ajoutées dynamiquement

```css
/* Classe ajoutée pendant le morphing */
.project-carousel.morphed {
  /* Peut être utilisée pour des styles spécifiques */
}
```

### Styles de base

```css
#contact-carousel-mini {
  position: fixed;
  left: 20px;
  top: 20px;
  width: 120px;
  height: calc(100dvh - 40px);
  z-index: 50;
  opacity: 0;
  pointer-events: none;
}
```

## Paramètres configurables

### Duration

```typescript
// Dans carouselMorphTransition()
const { duration = 1.2, ease = 'power3.inOut' } = options;

// Peut être modifié lors de l'appel
this.carouselMorphTransition('exit', { duration: 1.5 });
```

### Dimensions du carousel miniature

```typescript
// Dans transitions.ts
tl.to(container, {
  width: '120px',           // Modifiable
  height: 'calc(100dvh - 40px)', // Modifiable
  left: '20px',             // Position X
  top: '20px',              // Position Y
});
```

### Timing de l'apparition

```javascript
// Dans contact.astro
setTimeout(() => {
  gsap.to(carouselMini, { opacity: 1 });
}, 600); // Délai modifiable
```

## Personnalisation

### 1. Changer la position du carousel miniature

```typescript
// Dans transitions.ts - Direction exit
tl.to(container, {
  left: '40px',  // Au lieu de 20px
  top: '40px',
  // ou bien à droite:
  // right: '20px',
  // left: 'auto',
});
```

### 2. Changer la taille

```typescript
tl.to(container, {
  width: '150px',  // Plus large
  height: 'calc(100dvh - 60px)', // Plus de marge
});
```

### 3. Ajouter une rotation

```typescript
tl.to(container, {
  width: '120px',
  height: 'calc(100dvh - 40px)',
  left: '20px',
  top: '20px',
  rotation: 5, // Légère rotation
  duration,
  ease
});
```

### 4. Changer l'easing

```typescript
// Easing plus doux
ease: 'power2.inOut'

// Easing élastique
ease: 'elastic.out(1, 0.5)'

// Easing avec rebond
ease: 'back.inOut(1.7)'
```

## Debug

### Voir l'état du morphing

```javascript
// Dans la console
console.log('Morph active:', sessionStorage.getItem('carouselMorphActive'));
console.log('Transition type:', sessionStorage.getItem('pendingTransition'));
```

### Forcer le morphing

```javascript
// Forcer l'état morphé
sessionStorage.setItem('carouselMorphActive', 'true');
sessionStorage.setItem('pendingTransition', 'carouselMorph');
location.reload();
```

### Désactiver le morphing

```javascript
// Dans ROUTE_TRANSITIONS
'home->contact': 'fade', // Au lieu de 'carouselMorph'
'contact->home': 'fade',
```

## Performance

### Propriétés animées

✅ **GPU Accelerated:**
- `width`, `height` (via will-change)
- `left`, `top` (via transform sous le capot)
- `opacity`

⚠️ **Layout recalc:**
- `position: fixed ↔ relative` cause un reflow minimal

### Optimisation

```typescript
// Ajouter will-change avant l'animation
onStart: () => {
  container.style.willChange = 'width, height, left, top';
},
onComplete: () => {
  container.style.willChange = 'auto';
}
```

## Troubleshooting

### Le carousel ne se réduit pas

**Cause:** Éléments `.project-carousel` ou `.carousel-container` introuvables

**Solution:**
```javascript
console.log('Carousel:', document.querySelector('.project-carousel'));
console.log('Container:', document.querySelector('.carousel-container'));
```

### Le carousel ne reprend pas l'auto-play

**Cause:** Event `resumeCarousel` pas écouté

**Solution:** Vérifier que les event listeners sont bien ajoutés dans `ProjectCarousel.astro`

### Le contenu Contact apparaît trop tôt

**Cause:** Délai trop court

**Solution:**
```javascript
// Augmenter le délai
setTimeout(() => {
  gsap.to(carouselMini, { opacity: 1 });
}, 800); // Au lieu de 600
```

### Double carousel sur Contact

**Cause:** Carousel miniature et carousel normal tous deux visibles

**Solution:** Le carousel normal doit être masqué (`opacity: 0, pointer-events: none`) par défaut

## Cas d'usage alternatifs

### 1. Morphing vers la sidebar

```typescript
tl.to(container, {
  width: '300px',
  height: '100dvh',
  left: '0',
  top: '0',
});
```

### 2. Morphing en cercle (vignette)

```typescript
tl.to(container, {
  width: '100px',
  height: '100px',
  borderRadius: '50%',
  left: '20px',
  top: '20px',
});
```

### 3. Morphing multiple (plusieurs pages)

```typescript
const ROUTE_TRANSITIONS: Record<string, TransitionType> = {
  'home->contact': 'carouselMorph',
  'home->about': 'carouselMorph',    // Aussi pour About
  'contact->home': 'carouselMorph',
  'about->home': 'carouselMorph',
};
```

## Checklist d'implémentation

- [x] Type `carouselMorph` ajouté
- [x] Routes configurées (home↔contact)
- [x] Méthode `carouselMorphTransition()` créée
- [x] Events pause/resume dans ProjectCarousel
- [x] Carousel miniature sur page Contact
- [x] Lien retour "← Home"
- [x] SessionStorage `carouselMorphActive`
- [x] Fade in/out du contenu Contact
- [x] Timeline GSAP complète

---

**Le carousel se transforme maintenant de façon fluide entre Home et Contact ! 🎭✨**
