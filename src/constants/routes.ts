/**
 * Application Routes Constants
 * Centralized route definitions for type-safe navigation
 */

export const ROUTES = {
  // Public routes
  HOME: '/',
  PROJECTS: '/projects',
  FREELANCERS: '/freelancers',
  ABOUT: '/about',
  
  // Auth routes
  LOGIN: '/login',
  SIGNUP: '/signup',
  FREELANCER_LOGIN: '/freelancer/login',
  CLIENT_LOGIN: '/client/login',
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
  },
  
  // Admin routes
  ADMIN: {
    ROOT: '/admin',
    DASHBOARD: '/admin/dashboard',
  },
  
  // Client routes
  CLIENT: {
    ROOT: '/client',
    DASHBOARD: '/client/dashboard',
  },
} as const;

export type RouteKey = typeof ROUTES[keyof typeof ROUTES];
