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
  DEFAULT: 'bg-white rounded-xl border border-border shadow-sm',
  ELEVATED: 'bg-white rounded-xl border border-border shadow-md',
  FLAT: 'bg-white rounded-xl border border-border',
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
