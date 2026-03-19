import { motion } from "framer-motion";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import StatsCards from "@/components/dashboard/freelancer/StatsCards";
import ActiveProjects from "@/components/dashboard/freelancer/ActiveProjects";
import RecentProposals from "@/components/dashboard/freelancer/RecentProposals";
import EarningsChart from "@/components/dashboard/freelancer/EarningsChart";
import ProfileCompletion from "@/components/dashboard/freelancer/ProfileCompletion";
import AvailableJobs from "@/components/dashboard/freelancer/AvailableJobs";
import { useAuth } from "@/contexts/AuthContext";
import { useProviderRank } from "@/hooks/useRankings";
import { Card } from "@/components/ui/card";
import { Trophy, Star, Hash } from "lucide-react";

const TIER_LABELS: Record<string, string> = {
  FREE: "Gratuit",
  PRO: "Freelance Pro",
  PRO_MAX: "Freelance Pro Max",
  AGENCY: "Agence",
};

const TIER_COLORS: Record<string, string> = {
  FREE: "bg-muted text-muted-foreground",
  PRO: "bg-primary/10 text-primary",
  PRO_MAX: "bg-cta/10 text-cta",
  AGENCY: "bg-secondary/10 text-secondary-foreground",
};

const FreelancerDashboard = () => {
  const { user } = useAuth();
  const userName = user?.username || "Freelancer";
  const { data: rank } = useProviderRank(user?.id);

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
            {rank && (
              <Card className="p-5">
                <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
                  <Trophy size={15} className="text-cta" />
                  Mon classement
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground flex items-center gap-1.5">
                      <Hash size={13} />
                      Position
                    </span>
                    <span className="font-bold text-primary">#{rank.position}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Score</span>
                    <span className="font-bold text-cta">{parseFloat(rank.score).toFixed(2)}</span>
                  </div>
                  {rank.stars > 0 && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Étoiles</span>
                      <span className="inline-flex gap-0.5">
                        {Array.from({ length: rank.stars as number }).map((_, i) => (
                          <Star key={i} size={13} className="fill-cta text-cta" />
                        ))}
                      </span>
                    </div>
                  )}
                  {rank.tier !== "FREE" && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Niveau</span>
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${TIER_COLORS[rank.tier]}`}>
                        {TIER_LABELS[rank.tier]}
                      </span>
                    </div>
                  )}
                </div>
              </Card>
            )}
            <RecentProposals />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default FreelancerDashboard;
