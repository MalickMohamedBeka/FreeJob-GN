/**
 * Animation Utilities
 * Helper functions for animations
 */

import { Variants } from 'framer-motion';
import { ANIMATION_DURATION } from '@/constants/animations';

/**
 * Creates a stagger animation for child elements
 */
export const createStaggerVariants = (
  staggerDelay: number = 0.1
): Variants => ({
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: staggerDelay,
    },
  },
});

/**
 * Creates a fade in animation with custom delay
 */
export const createFadeInVariant = (delay: number = 0): Variants => ({
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: ANIMATION_DURATION.NORMAL,
      delay,
    },
  },
});

/**
 * Creates a card hover animation
 */
export const createCardHoverVariant = (liftAmount: number = -12) => ({
  y: liftAmount,
  scale: 1.02,
  transition: { duration: ANIMATION_DURATION.NORMAL },
});

/**
 * Checks if user prefers reduced motion
 */
export const prefersReducedMotion = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

/**
 * Returns animation config based on user preference
 */
export const getAnimationConfig = <T>(
  animation: T,
  fallback: T | null = null
): T | null => {
  return prefersReducedMotion() ? fallback : animation;
};
