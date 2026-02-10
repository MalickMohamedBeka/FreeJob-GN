/**
 * UI Constants
 * Design system values and configurations
 */

export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  '2XL': 1536,
} as const;

export const AVATAR_SIZES = {
  XS: 'w-8 h-8',
  SM: 'w-12 h-12',
  MD: 'w-16 h-16',
  LG: 'w-20 h-20',
  XL: 'w-24 h-24',
} as const;

export const CARD_VARIANTS = {
  DEFAULT: 'glass rounded-3xl shadow-elevation-3',
  ELEVATED: 'glass rounded-3xl shadow-elevation-4 hover:shadow-elevation-5',
  FLAT: 'bg-background rounded-2xl border border-border',
} as const;

export const GRADIENT_CLASSES = {
  HERO: 'bg-gradient-hero',
  TEXT: 'text-gradient-hero',
  SUBTLE: 'bg-gradient-hero-subtle',
} as const;

export const SHADOW_CLASSES = {
  SM: 'shadow-elevation-1',
  MD: 'shadow-elevation-2',
  LG: 'shadow-elevation-3',
  XL: 'shadow-elevation-4',
  '2XL': 'shadow-elevation-5',
  GLOW_ORANGE: 'shadow-glow-orange',
  GLOW_BLUE: 'shadow-glow-blue',
} as const;

export const SKILL_FILTERS = [
  'Tous',
  'React',
  'Node.js',
  'Python',
  'Design',
  'Marketing',
  'Mobile',
  'SEO',
  'Data Science',
  'Blockchain',
] as const;

export const ITEMS_PER_PAGE = {
  PROJECTS: 9,
  FREELANCERS: 9,
  TESTIMONIALS: 3,
} as const;
