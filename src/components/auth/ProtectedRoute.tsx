import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { PageLoader } from '@/components/common';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'CLIENT' | 'PROVIDER';
}

export default function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, user, profileInitialized } = useAuth();

  if (isLoading) return <PageLoader />;

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  if (requiredRole && user?.role !== requiredRole) {
    const redirect = user?.role === 'CLIENT' ? '/client/dashboard' : '/dashboard';
    return <Navigate to={redirect} replace />;
  }

  // Freelancer profile check
  if (user?.role === 'PROVIDER' && user?.provider_kind === 'FREELANCE') {
    if (profileInitialized === null) return <PageLoader />;
    if (profileInitialized === false) return <Navigate to="/onboarding" replace />;
  }

  return <>{children}</>;
}
