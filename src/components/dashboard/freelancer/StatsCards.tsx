import { motion } from "framer-motion";
import { Briefcase, FileText, Wallet as WalletIcon, TrendingUp, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useContracts } from "@/hooks/useContracts";
import { useProposals } from "@/hooks/useProposals";
import { useWallet } from "@/hooks/useWallet";

const StatsCards = () => {
  const { data: contractsData } = useContracts();
  const { data: proposalsData } = useProposals();
  const { data: wallet, isLoading: walletLoading } = useWallet();

  const contracts = contractsData?.results ?? [];
  const totalContracts = contractsData?.count ?? 0;
  const activeProjects = contracts.filter((c) => c.status === "IN_PROGRESS").length;
  const completedContracts = contracts.filter((c) => c.status === "COMPLETED").length;
  const proposalsSent = proposalsData?.count ?? 0;

  // Success rate: completed (from page) / total contracts (from API count)
  const successRate =
    totalContracts > 0 ? Math.round((completedContracts / totalContracts) * 100) : null;

  const walletBalance = wallet
    ? `${parseFloat(wallet.balance).toLocaleString("fr-FR")} ${wallet.currency}`
    : null;

  const stats = [
    {
      icon: Briefcase,
      label: "Projets Actifs",
      value: String(activeProjects),
      sub: null,
      color: "from-blue-500 to-blue-600",
    },
    {
      icon: FileText,
      label: "Propositions Envoyées",
      value: String(proposalsSent),
      sub: null,
      color: "from-purple-500 to-purple-600",
    },
    {
      icon: WalletIcon,
      label: "Solde Portefeuille",
      value: walletLoading ? null : (walletBalance ?? "—"),
      sub: walletLoading ? "Chargement…" : null,
      color: "from-green-500 to-green-600",
    },
    {
      icon: TrendingUp,
      label: "Taux de Réussite",
      value: successRate !== null ? `${successRate}%` : "—",
      sub: successRate === null ? "Aucun contrat" : null,
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
                {stat.value === null ? (
                  <Loader2 size={20} className="animate-spin text-muted-foreground mt-1" />
                ) : (
                  <p className="text-2xl font-bold mb-1">{stat.value}</p>
                )}
                {stat.sub && (
                  <p className="text-xs text-muted-foreground">{stat.sub}</p>
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
