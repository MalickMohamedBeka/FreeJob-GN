import { motion } from "framer-motion";
import { Briefcase, Coins, FileText, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/card";

const stats = [
  {
    icon: Briefcase,
    label: "Projets Actifs",
    value: "8",
    change: "+2 ce mois",
    changeType: "positive" as const,
    color: "from-blue-500 to-blue-600",
  },
  {
    icon: FileText,
    label: "Propositions Envoyées",
    value: "24",
    change: "+6 cette semaine",
    changeType: "positive" as const,
    color: "from-purple-500 to-purple-600",
  },
  {
    icon: Coins,
    label: "Revenus ce Mois",
    value: "12,450 GNF",
    change: "+18% vs mois dernier",
    changeType: "positive" as const,
    color: "from-green-500 to-green-600",
  },
  {
    icon: TrendingUp,
    label: "Taux de Réussite",
    value: "68%",
    change: "+5% ce mois",
    changeType: "positive" as const,
    color: "from-orange-500 to-orange-600",
  },
];

const StatsCards = () => {
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
                <p className="text-xs text-green-600 font-medium">{stat.change}</p>
              </div>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
};

export default StatsCards;
