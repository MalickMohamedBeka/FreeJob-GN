/**
 * PageLoader Component
 * Full-page loading indicator for route transitions
 */

import { LoadingSpinner } from './LoadingSpinner';

export const PageLoader = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <LoadingSpinner size="lg" text="Chargement..." />
    </div>
  );
};
