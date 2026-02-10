import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import { PageLoader } from "@/components/common";
import { ROUTES } from "@/constants";

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
const FreelancerDashboard = lazy(() => import("./pages/dashboard/FreelancerDashboard"));
const FindProjects = lazy(() => import("./pages/dashboard/FindProjects"));
const MyProjects = lazy(() => import("./pages/dashboard/MyProjects"));
const Proposals = lazy(() => import("./pages/dashboard/Proposals"));
const Earnings = lazy(() => import("./pages/dashboard/Earnings"));
const Messages = lazy(() => import("./pages/dashboard/Messages"));
const Profile = lazy(() => import("./pages/dashboard/Profile"));
const Settings = lazy(() => import("./pages/dashboard/Settings"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path={ROUTES.HOME} element={<Index />} />
            <Route path={ROUTES.PROJECTS} element={<Projects />} />
            <Route path={ROUTES.FREELANCERS} element={<Freelancers />} />
            <Route path={ROUTES.ABOUT} element={<About />} />
            <Route path={ROUTES.LOGIN} element={<Login />} />
            <Route path={ROUTES.SIGNUP} element={<Signup />} />
            <Route path={ROUTES.ADMIN_LOGIN} element={<AdminLogin />} />
            <Route path={ROUTES.ADMIN.DASHBOARD} element={<AdminDashboard />} />
            <Route path={ROUTES.FREELANCER_LOGIN} element={<FreelancerLogin />} />
            <Route path={ROUTES.CLIENT_LOGIN} element={<ClientLogin />} />
            <Route path={ROUTES.CLIENT.DASHBOARD} element={<ClientDashboard />} />
            <Route path={ROUTES.DASHBOARD.ROOT} element={<FreelancerDashboard />} />
            <Route path={ROUTES.DASHBOARD.FIND_PROJECTS} element={<FindProjects />} />
            <Route path={ROUTES.DASHBOARD.MY_PROJECTS} element={<MyProjects />} />
            <Route path={ROUTES.DASHBOARD.PROPOSALS} element={<Proposals />} />
            <Route path={ROUTES.DASHBOARD.EARNINGS} element={<Earnings />} />
            <Route path={ROUTES.DASHBOARD.MESSAGES} element={<Messages />} />
            <Route path={ROUTES.DASHBOARD.PROFILE} element={<Profile />} />
            <Route path={ROUTES.DASHBOARD.SETTINGS} element={<Settings />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
