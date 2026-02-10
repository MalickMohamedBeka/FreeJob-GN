import { motion } from "framer-motion";
import { Clock, Eye } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const proposals = [
  {
    id: 1,
    project: "Application de Livraison",
    submittedAt: "Il y a 2h",
    status: "En attente",
    statusColor: "bg-yellow-500",
    views: 3,
  },
  {
    id: 2,
    project: "Site E-learning",
    submittedAt: "Il y a 5h",
    status: "Vue",
    statusColor: "bg-blue-500",
    views: 8,
  },
  {
    id: 3,
    project: "Dashboard Analytics",
    submittedAt: "Hier",
    status: "Acceptée",
    statusColor: "bg-green-500",
    views: 12,
  },
  {
    id: 4,
    project: "API REST Backend",
    submittedAt: "Il y a 2 jours",
    status: "Rejetée",
    statusColor: "bg-red-500",
    views: 5,
  },
];

const RecentProposals = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Propositions Récentes</h3>

        <div className="space-y-3">
          {proposals.map((proposal, index) => (
            <motion.div
              key={proposal.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              className="p-3 rounded-lg border border-border hover:border-primary/50 transition-colors"
            >
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-medium text-sm">{proposal.project}</h4>
                <Badge
                  variant="secondary"
                  className={`${proposal.statusColor} text-white text-xs`}
                >
                  {proposal.status}
                </Badge>
              </div>

              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Clock size={12} />
                  <span>{proposal.submittedAt}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Eye size={12} />
                  <span>{proposal.views} vues</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </Card>
    </motion.div>
  );
};

export default RecentProposals;
