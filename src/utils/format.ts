/**
 * Formatting Utilities
 * Helper functions for data formatting
 */

/**
 * Formats a number with locale-specific formatting
 */
export const formatNumber = (
  value: number,
  locale: string = 'fr-GN'
): string => {
  return new Intl.NumberFormat(locale).format(value);
};

/**
 * Formats currency with symbol
 */
export const formatCurrency = (
  amount: number,
  currency: string = 'GNF',
  locale: string = 'fr-GN'
): string => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
  }).format(amount);
};

/**
 * Formats a date relative to now (e.g., "Il y a 2 heures")
 */
export const formatRelativeTime = (date: Date | string): string => {
  const now = new Date();
  const past = new Date(date);
  const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);

  if (diffInSeconds < 60) return 'À l\'instant';
  if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `Il y a ${minutes} minute${minutes > 1 ? 's' : ''}`;
  }
  if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `Il y a ${hours} heure${hours > 1 ? 's' : ''}`;
  }
  const days = Math.floor(diffInSeconds / 86400);
  return `Il y a ${days} jour${days > 1 ? 's' : ''}`;
};

/**
 * Truncates text to a specified length
 */
export const truncateText = (
  text: string,
  maxLength: number,
  suffix: string = '...'
): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - suffix.length) + suffix;
};

/**
 * Generates initials from a name
 */
export const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

/**
 * Formats a rating to one decimal place
 */
export const formatRating = (rating: number): string => {
  return rating.toFixed(1);
};
