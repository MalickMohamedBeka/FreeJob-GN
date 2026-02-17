import { motion } from "framer-motion";
import { Briefcase, Construction, FileText } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useContracts } from "@/hooks/useContracts";
import { useProposals } from "@/hooks/useProposals";

const StatsCards = () => {
  const { data: contractsData } = useContracts();
  const { data: proposalsData } = useProposals();

  const activeProjects = (contractsData?.results ?? []).filter(
    (c) => c.status === "IN_PROGRESS"
  ).length;
  const proposalsSent = proposalsData?.count ?? 0;

  const stats = [
    {
      icon: Briefcase,
      label: "Projets Actifs",
      value: String(activeProjects),
      change: "",
      color: "from-blue-500 to-blue-600",
    },
    {
      icon: FileText,
      label: "Propositions Envoyées",
      value: String(proposalsSent),
      change: "",
      color: "from-purple-500 to-purple-600",
    },
    {
      icon: Construction,
      label: "Revenus ce Mois",
      value: "—",
      change: "Bientôt disponible",
      color: "from-green-500 to-green-600",
    },
    {
      icon: Construction,
      label: "Taux de Réussite",
      value: "—",
      change: "Bientôt disponible",
      color: "from-orange-500 to-orange-600",
    },
  ];

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color}`}>
                  <Icon className="text-white" size={24} />
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                <p className="text-2xl font-bold mb-2">{stat.value}</p>
                {stat.change && (
                  <p className="text-xs text-muted-foreground font-medium">{stat.change}</p>
                )}
              </div>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
};

export default StatsCards;
