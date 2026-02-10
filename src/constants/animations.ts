/**
 * Animation Constants
 * Reusable animation configurations for Framer Motion
 */

export const ANIMATION_DURATION = {
  FAST: 0.2,
  NORMAL: 0.3,
  SLOW: 0.5,
  VERY_SLOW: 0.8,
} as const;

export const ANIMATION_EASE = {
  SMOOTH: [0.4, 0, 0.2, 1],
  BOUNCE: [0.68, -0.55, 0.265, 1.55],
  LINEAR: [0, 0, 1, 1],
} as const;

export const FADE_IN_UP = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

export const FADE_IN = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

export const SCALE_IN = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.9 },
};

export const SLIDE_IN_LEFT = {
  initial: { opacity: 0, x: -100 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 100 },
};

export const SLIDE_IN_RIGHT = {
  initial: { opacity: 0, x: 100 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -100 },
};

export const STAGGER_CONTAINER = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export const HOVER_SCALE = {
  scale: 1.05,
  transition: { duration: ANIMATION_DURATION.FAST },
};

export const HOVER_LIFT = {
  y: -8,
  scale: 1.02,
  transition: { duration: ANIMATION_DURATION.NORMAL },
};

export const TAP_SCALE = {
  scale: 0.95,
};
