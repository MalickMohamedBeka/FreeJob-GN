import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { PageLoader } from '@/components/common';

/**
 * Wraps public/auth pages (home, login, signup).
 * Authenticated users are redirected straight to their dashboard
 * so they can never navigate back to those pages while logged in.
 */
export default function PublicRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) return <PageLoader />;

  if (isAuthenticated) {
    const destination =
      user?.role === 'CLIENT' ? '/client/dashboard' : '/dashboard';
    return <Navigate to={destination} replace />;
  }

  return <>{children}</>;
}
