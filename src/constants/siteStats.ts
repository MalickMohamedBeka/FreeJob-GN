/**
 * Site-wide statistics
 * Update these values as the platform grows.
 * Used in About page, landing page fallback, and any static stat displays.
 */

export const SITE_STATS = {
  freelancers: { value: 50, suffix: "+", label: "Freelancers Actifs" },
  projects: { value: 30, suffix: "+", label: "Projets Réalisés" },
  satisfaction: { value: 95, suffix: "%", label: "Satisfaction Client" },
  newProjectsPerMonth: { value: 10, suffix: "+", label: "Nouveaux Projets/Mois" },
} as const;
