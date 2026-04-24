import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { lazy, Suspense, useEffect } from "react";
import { MotionConfig } from "framer-motion";
import { PageLoader } from "@/components/common";
import { ROUTES } from "@/constants";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import PublicRoute from "@/components/auth/PublicRoute";

// Eager load only the home page for instant first paint
import Index from "./pages/Index";

// Lazy load all other pages
const Projects = lazy(() => import("./pages/Projects"));
const Freelancers = lazy(() => import("./pages/Freelancers"));
const FreelancerProfile = lazy(() => import("./pages/FreelancerProfile"));
const About = lazy(() => import("./pages/About"));
const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Signup"));
const NotFound = lazy(() => import("./pages/NotFound"));
const AdminLogin = lazy(() => import("./pages/AdminLogin"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const AdminWithdrawals = lazy(() => import("./pages/admin/AdminWithdrawals"));
const AdminComptabilite = lazy(() => import("./pages/admin/AdminComptabilite"));
const ClientDashboard = lazy(() => import("./pages/client/ClientDashboard"));
const ClientProjects = lazy(() => import("./pages/client/ClientProjects"));
const ClientProjectDetail = lazy(() => import("./pages/client/ClientProjectDetail"));
const ClientProposals = lazy(() => import("./pages/client/ClientProposals"));
const ClientContracts = lazy(() => import("./pages/client/ClientContracts"));
const ClientProfile = lazy(() => import("./pages/client/ClientProfile"));
const ClientMessages = lazy(() => import("./pages/client/ClientMessages"));
const PaymentReturn = lazy(() => import("./pages/client/PaymentReturn"));
const FreelancerDashboard = lazy(() => import("./pages/dashboard/FreelancerDashboard"));
const FindProjects = lazy(() => import("./pages/dashboard/FindProjects"));
const DashboardProjectDetail = lazy(() => import("./pages/dashboard/ProjectDetail"));
const MyProjects = lazy(() => import("./pages/dashboard/MyProjects"));
const Proposals = lazy(() => import("./pages/dashboard/Proposals"));
const Messages = lazy(() => import("./pages/dashboard/Messages"));
const Profile = lazy(() => import("./pages/dashboard/Profile"));
const Settings = lazy(() => import("./pages/dashboard/Settings"));
const Notifications = lazy(() => import("./pages/dashboard/Notifications"));
const Wallet = lazy(() => import("./pages/dashboard/Wallet"));
const Invoices = lazy(() => import("./pages/dashboard/Invoices"));
const Subscriptions = lazy(() => import("./pages/dashboard/Subscriptions"));
const AccountActivation = lazy(() => import("./pages/AccountActivation"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const Onboarding = lazy(() => import("./pages/Onboarding"));
const CommentCaMarche = lazy(() => import("./pages/CommentCaMarche"));
const Rankings = lazy(() => import("./pages/Rankings"));
const Agencies = lazy(() => import("./pages/Agencies"));
const AgencyDetail = lazy(() => import("./pages/AgencyDetail"));
const AgencyOnboarding = lazy(() => import("./pages/agency/AgencyOnboarding"));
const ClientOnboarding = lazy(() => import("./pages/client/ClientOnboarding"));
const ProviderProfile = lazy(() => import("./pages/dashboard/ProviderProfile"));
const ClientPublicProfile = lazy(() => import("./pages/ClientPublicProfile"));

/**
 * Normalises URLs with consecutive slashes (e.g. //activate → /activate).
 * The backend email template appends the path to a base URL that already
 * ends with "/", producing links like https://host//activate?uid=…&token=…
 * React Router won't match those against a single-slash route, so users
 * land on the 404 page instead of the activation screen.
 */
function NormalizeSlashes() {
  const { pathname, search } = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    if (pathname.match(/\/{2,}/)) {
      navigate(pathname.replace(/\/{2,}/g, '/') + search, { replace: true });
    }
  }, [pathname, search, navigate]);
  return null;
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <NormalizeSlashes />
          <MotionConfig reducedMotion="user">
          <Suspense fallback={<PageLoader />}>
            <Routes>
              {/* Public routes — redirect to dashboard when already logged in */}
              <Route path={ROUTES.HOME} element={<Index />} />
              <Route path={ROUTES.LOGIN} element={<PublicRoute><Login /></PublicRoute>} />
              <Route path={ROUTES.SIGNUP} element={<PublicRoute><Signup /></PublicRoute>} />

              {/* Public browsing pages — accessible to everyone regardless of auth state */}
              <Route path={ROUTES.PROJECTS} element={<Projects />} />
              <Route path={ROUTES.FREELANCERS} element={<Freelancers />} />
              <Route path={ROUTES.FREELANCER_PROFILE} element={<FreelancerProfile />} />
              <Route path={ROUTES.AGENCIES} element={<Agencies />} />
              <Route path={ROUTES.AGENCY_PROFILE} element={<AgencyDetail />} />
              <Route path={ROUTES.RANKINGS} element={<Rankings />} />
              <Route path={ROUTES.ABOUT} element={<About />} />
              <Route path={ROUTES.HOW_IT_WORKS} element={<CommentCaMarche />} />
              <Route path={ROUTES.CLIENT_PUBLIC_PROFILE} element={<ClientPublicProfile />} />
              <Route path={ROUTES.ADMIN_LOGIN} element={<AdminLogin />} />
              <Route path="/activate" element={<AccountActivation />} />
              <Route path={ROUTES.FORGOT_PASSWORD} element={<PublicRoute><ForgotPassword /></PublicRoute>} />
              <Route path={ROUTES.RESET_PASSWORD} element={<PublicRoute><ResetPassword /></PublicRoute>} />
              <Route path={ROUTES.ONBOARDING} element={<Onboarding />} />
              <Route path={ROUTES.CLIENT.ONBOARDING} element={<ClientOnboarding />} />

              {/* Admin — superusers only */}
              <Route path={ROUTES.ADMIN.DASHBOARD} element={
                <ProtectedRoute requireSuperuser><AdminDashboard /></ProtectedRoute>
              } />
              <Route path={ROUTES.ADMIN.WITHDRAWALS} element={
                <ProtectedRoute requireSuperuser><AdminWithdrawals /></ProtectedRoute>
              } />
              <Route path={ROUTES.ADMIN.COMPTABILITE} element={
                <ProtectedRoute requireSuperuser><AdminComptabilite /></ProtectedRoute>
              } />

              {/* Client dashboard (protected) */}
              <Route path={ROUTES.CLIENT.DASHBOARD} element={
                <ProtectedRoute requiredRole="CLIENT"><ClientDashboard /></ProtectedRoute>
              } />
              <Route path={ROUTES.CLIENT.PROJECTS} element={
                <ProtectedRoute requiredRole="CLIENT"><ClientProjects /></ProtectedRoute>
              } />
              <Route path={ROUTES.CLIENT.PROJECT_DETAIL} element={
                <ProtectedRoute requiredRole="CLIENT"><ClientProjectDetail /></ProtectedRoute>
              } />
              <Route path={ROUTES.CLIENT.PROPOSALS} element={
                <ProtectedRoute requiredRole="CLIENT"><ClientProposals /></ProtectedRoute>
              } />
              <Route path={ROUTES.CLIENT.CONTRACTS} element={
                <ProtectedRoute requiredRole="CLIENT"><ClientContracts /></ProtectedRoute>
              } />
              <Route path={ROUTES.CLIENT.MESSAGES} element={
                <ProtectedRoute requiredRole="CLIENT"><ClientMessages /></ProtectedRoute>
              } />
              <Route path={ROUTES.CLIENT.PROFILE} element={
                <ProtectedRoute requiredRole="CLIENT"><ClientProfile /></ProtectedRoute>
              } />
              <Route path={ROUTES.CLIENT.PAYMENT_RETURN} element={
                <ProtectedRoute requiredRole="CLIENT"><PaymentReturn /></ProtectedRoute>
              } />
              <Route path={ROUTES.CLIENT.NOTIFICATIONS} element={
                <ProtectedRoute requiredRole="CLIENT"><Notifications /></ProtectedRoute>
              } />
              <Route path={ROUTES.CLIENT.INVOICES} element={
                <ProtectedRoute requiredRole="CLIENT"><Invoices /></ProtectedRoute>
              } />

              {/* Agency onboarding (accessed before profile is created) */}
              <Route path={ROUTES.AGENCY.ONBOARDING} element={<AgencyOnboarding />} />

              {/* Provider dashboard — shared by FREELANCE and AGENCY */}
              <Route path={ROUTES.DASHBOARD.ROOT} element={
                <ProtectedRoute requiredRole="PROVIDER"><FreelancerDashboard /></ProtectedRoute>
              } />
              <Route path={ROUTES.DASHBOARD.FIND_PROJECTS} element={
                <ProtectedRoute requiredRole="PROVIDER"><FindProjects /></ProtectedRoute>
              } />
              <Route path={ROUTES.DASHBOARD.FIND_PROJECT_DETAIL} element={
                <ProtectedRoute requiredRole="PROVIDER"><DashboardProjectDetail /></ProtectedRoute>
              } />
              <Route path={ROUTES.DASHBOARD.MY_PROJECTS} element={
                <ProtectedRoute requiredRole="PROVIDER"><MyProjects /></ProtectedRoute>
              } />
              <Route path={ROUTES.DASHBOARD.PROPOSALS} element={
                <ProtectedRoute requiredRole="PROVIDER"><Proposals /></ProtectedRoute>
              } />
              <Route path={ROUTES.DASHBOARD.MESSAGES} element={
                <ProtectedRoute requiredRole="PROVIDER"><Messages /></ProtectedRoute>
              } />
              <Route path={ROUTES.DASHBOARD.PROFILE} element={
                <ProtectedRoute requiredRole="PROVIDER"><ProviderProfile /></ProtectedRoute>
              } />
              <Route path={ROUTES.DASHBOARD.SETTINGS} element={
                <ProtectedRoute requiredRole="PROVIDER"><Settings /></ProtectedRoute>
              } />
              <Route path={ROUTES.DASHBOARD.NOTIFICATIONS} element={
                <ProtectedRoute requiredRole="PROVIDER"><Notifications /></ProtectedRoute>
              } />
              <Route path={ROUTES.DASHBOARD.WALLET} element={
                <ProtectedRoute requiredRole="PROVIDER"><Wallet /></ProtectedRoute>
              } />
              <Route path={ROUTES.DASHBOARD.INVOICES} element={
                <ProtectedRoute requiredRole="PROVIDER"><Invoices /></ProtectedRoute>
              } />
              <Route path={ROUTES.DASHBOARD.SUBSCRIPTION} element={
                <ProtectedRoute requiredRole="PROVIDER"><Subscriptions /></ProtectedRoute>
              } />

              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
          </MotionConfig>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
