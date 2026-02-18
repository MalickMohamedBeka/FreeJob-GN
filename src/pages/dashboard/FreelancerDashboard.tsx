import { motion } from "framer-motion";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import StatsCards from "@/components/dashboard/freelancer/StatsCards";
import ActiveProjects from "@/components/dashboard/freelancer/ActiveProjects";
import RecentProposals from "@/components/dashboard/freelancer/RecentProposals";
import EarningsChart from "@/components/dashboard/freelancer/EarningsChart";
import ProfileCompletion from "@/components/dashboard/freelancer/ProfileCompletion";
import AvailableJobs from "@/components/dashboard/freelancer/AvailableJobs";
import { useAuth } from "@/contexts/AuthContext";

const FreelancerDashboard = () => {
  const { user } = useAuth();
  const userName = user?.username || "Freelancer";

  return (
    <DashboardLayout userType="freelancer">
      <div className="space-y-6">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-primary rounded-2xl p-8 text-white"
        >
          <h1 className="text-3xl font-bold mb-2">Bienvenue, {userName} ! 👋</h1>
          <p className="text-white/90">Voici un aperçu de votre activité aujourd'hui</p>
        </motion.div>

        {/* Profile Completion */}
        <ProfileCompletion />

        {/* Stats Cards */}
        <StatsCards />

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - 2/3 */}
          <div className="lg:col-span-2 space-y-6">
            <ActiveProjects />
            <EarningsChart />
            <AvailableJobs />
          </div>

          {/* Right Column - 1/3 */}
          <div className="space-y-6">
            <RecentProposals />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default FreelancerDashboard;
