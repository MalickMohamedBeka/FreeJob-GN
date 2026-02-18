import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import { MotionConfig } from "framer-motion";
import { PageLoader } from "@/components/common";
import { ROUTES } from "@/constants";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

// Eager load only the home page for instant first paint
import Index from "./pages/Index";

// Lazy load all other pages
const Projects = lazy(() => import("./pages/Projects"));
const Freelancers = lazy(() => import("./pages/Freelancers"));
const About = lazy(() => import("./pages/About"));
const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Signup"));
const NotFound = lazy(() => import("./pages/NotFound"));
const AdminLogin = lazy(() => import("./pages/AdminLogin"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const FreelancerLogin = lazy(() => import("./pages/FreelancerLogin"));
const ClientLogin = lazy(() => import("./pages/ClientLogin"));
const ClientDashboard = lazy(() => import("./pages/client/ClientDashboard"));
const ClientProjects = lazy(() => import("./pages/client/ClientProjects"));
const ClientProposals = lazy(() => import("./pages/client/ClientProposals"));
const ClientContracts = lazy(() => import("./pages/client/ClientContracts"));
const ClientProfile = lazy(() => import("./pages/client/ClientProfile"));
const ClientMessages = lazy(() => import("./pages/client/ClientMessages"));
const FreelancerDashboard = lazy(() => import("./pages/dashboard/FreelancerDashboard"));
const FindProjects = lazy(() => import("./pages/dashboard/FindProjects"));
const MyProjects = lazy(() => import("./pages/dashboard/MyProjects"));
const Proposals = lazy(() => import("./pages/dashboard/Proposals"));
const Earnings = lazy(() => import("./pages/dashboard/Earnings"));
const Messages = lazy(() => import("./pages/dashboard/Messages"));
const Profile = lazy(() => import("./pages/dashboard/Profile"));
const Settings = lazy(() => import("./pages/dashboard/Settings"));
const AccountActivation = lazy(() => import("./pages/AccountActivation"));
const Onboarding = lazy(() => import("./pages/Onboarding"));

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
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <MotionConfig reducedMotion="user">
          <Suspense fallback={<PageLoader />}>
            <Routes>
              {/* Public routes */}
              <Route path={ROUTES.HOME} element={<Index />} />
              <Route path={ROUTES.PROJECTS} element={<Projects />} />
              <Route path={ROUTES.FREELANCERS} element={<Freelancers />} />
              <Route path={ROUTES.ABOUT} element={<About />} />
              <Route path={ROUTES.LOGIN} element={<Login />} />
              <Route path={ROUTES.SIGNUP} element={<Signup />} />
              <Route path={ROUTES.ADMIN_LOGIN} element={<AdminLogin />} />
              <Route path={ROUTES.FREELANCER_LOGIN} element={<FreelancerLogin />} />
              <Route path={ROUTES.CLIENT_LOGIN} element={<ClientLogin />} />
              <Route path="/activate" element={<AccountActivation />} />
              <Route path={ROUTES.ONBOARDING} element={<Onboarding />} />

              {/* Admin */}
              <Route path={ROUTES.ADMIN.DASHBOARD} element={<AdminDashboard />} />

              {/* Client dashboard (protected) */}
              <Route path={ROUTES.CLIENT.DASHBOARD} element={
                <ProtectedRoute requiredRole="CLIENT"><ClientDashboard /></ProtectedRoute>
              } />
              <Route path={ROUTES.CLIENT.PROJECTS} element={
                <ProtectedRoute requiredRole="CLIENT"><ClientProjects /></ProtectedRoute>
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

              {/* Freelancer dashboard (protected) */}
              <Route path={ROUTES.DASHBOARD.ROOT} element={
                <ProtectedRoute requiredRole="PROVIDER"><FreelancerDashboard /></ProtectedRoute>
              } />
              <Route path={ROUTES.DASHBOARD.FIND_PROJECTS} element={
                <ProtectedRoute requiredRole="PROVIDER"><FindProjects /></ProtectedRoute>
              } />
              <Route path={ROUTES.DASHBOARD.MY_PROJECTS} element={
                <ProtectedRoute requiredRole="PROVIDER"><MyProjects /></ProtectedRoute>
              } />
              <Route path={ROUTES.DASHBOARD.PROPOSALS} element={
                <ProtectedRoute requiredRole="PROVIDER"><Proposals /></ProtectedRoute>
              } />
              <Route path={ROUTES.DASHBOARD.EARNINGS} element={
                <ProtectedRoute requiredRole="PROVIDER"><Earnings /></ProtectedRoute>
              } />
              <Route path={ROUTES.DASHBOARD.MESSAGES} element={
                <ProtectedRoute requiredRole="PROVIDER"><Messages /></ProtectedRoute>
              } />
              <Route path={ROUTES.DASHBOARD.PROFILE} element={
                <ProtectedRoute requiredRole="PROVIDER"><Profile /></ProtectedRoute>
              } />
              <Route path={ROUTES.DASHBOARD.SETTINGS} element={
                <ProtectedRoute requiredRole="PROVIDER"><Settings /></ProtectedRoute>
              } />

              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
          </MotionConfig>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
