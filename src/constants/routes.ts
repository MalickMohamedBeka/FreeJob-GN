/**
 * Application Routes Constants
 * Centralized route definitions for type-safe navigation
 */

export const ROUTES = {
  // Public routes
  HOME: '/',
  PROJECTS: '/projects',
  FREELANCERS: '/freelancers',
  FREELANCER_PROFILE: '/freelancers/:id',
  ABOUT: '/about',
  HOW_IT_WORKS: '/comment-ca-marche',
  
  // Auth routes
  LOGIN: '/login',
  SIGNUP: '/signup',
  ADMIN_LOGIN: '/admin',
  ONBOARDING: '/onboarding',
  
  // Dashboard routes
  DASHBOARD: {
    ROOT: '/dashboard',
    FIND_PROJECTS: '/dashboard/find-projects',
    MY_PROJECTS: '/dashboard/projects',
    PROPOSALS: '/dashboard/proposals',
    EARNINGS: '/dashboard/earnings',
    MESSAGES: '/dashboard/messages',
    PROFILE: '/dashboard/profile',
    SETTINGS: '/dashboard/settings',
    NOTIFICATIONS: '/dashboard/notifications',
    WALLET: '/dashboard/wallet',
  },
  
  // Admin routes
  ADMIN: {
    ROOT: '/admin',
    DASHBOARD: '/admin/dashboard',
    WITHDRAWALS: '/admin/withdrawals',
  },
  
  // Client routes
  CLIENT: {
    ROOT: '/client',
    DASHBOARD: '/client/dashboard',
    PROJECTS: '/client/projects',
    PROPOSALS: '/client/proposals',
    CONTRACTS: '/client/contracts',
    MESSAGES: '/client/messages',
    PROFILE: '/client/profile',
    PAYMENT_RETURN: '/client/payment/return',
    NOTIFICATIONS: '/client/notifications',
  },
} as const;

export type RouteKey = typeof ROUTES[keyof typeof ROUTES];
