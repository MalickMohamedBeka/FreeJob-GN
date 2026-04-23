import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { PageLoader } from '@/components/common';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'CLIENT' | 'PROVIDER';
  requiredProviderKind?: 'FREELANCE' | 'AGENCY';
  requireSuperuser?: boolean;
}

function getDashboard(role?: string, providerKind?: string | null) {
  if (role === 'CLIENT') return '/client/dashboard';
  if (providerKind === 'AGENCY') return '/agency/dashboard';
  return '/dashboard';
}

export default function ProtectedRoute({
  children,
  requiredRole,
  requiredProviderKind,
  requireSuperuser,
}: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, user, profileInitialized } = useAuth();

  if (isLoading) return <PageLoader />;

  if (!isAuthenticated) return <Navigate to="/admin" replace />;

  // Superuser-only routes — redirect non-superusers to their own dashboard
  if (requireSuperuser && !user?.is_superuser) {
    return <Navigate to={getDashboard(user?.role, user?.provider_kind)} replace />;
  }

  // Wrong role → send to their own dashboard
  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to={getDashboard(user?.role, user?.provider_kind)} replace />;
  }

  // Wrong provider kind (e.g. FREELANCE trying to access AGENCY routes)
  if (requiredProviderKind && user?.provider_kind !== requiredProviderKind) {
    return <Navigate to={getDashboard(user?.role, user?.provider_kind)} replace />;
  }

  // Provider profile check — redirect to onboarding if profile not yet created
  if (user?.role === 'PROVIDER') {
    if (profileInitialized === null) return <PageLoader />;
    if (profileInitialized === false) {
      const onboarding = user.provider_kind === 'AGENCY' ? '/agency/onboarding' : '/onboarding';
      return <Navigate to={onboarding} replace />;
    }
  }

  return <>{children}</>;
}
