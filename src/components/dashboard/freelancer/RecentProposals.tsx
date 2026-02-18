import { motion } from "framer-motion";
import { Clock, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useProposals } from "@/hooks/useProposals";
import type { ProposalStatusEnum } from "@/types";

const statusConfig: Record<ProposalStatusEnum, { label: string; color: string }> = {
  PENDING: { label: "En attente", color: "bg-yellow-500" },
  SHORTLISTED: { label: "Présélectionnée", color: "bg-blue-500" },
  SELECTED: { label: "Sélectionnée", color: "bg-green-500" },
  CONFIRMED: { label: "Confirmée", color: "bg-green-600" },
  DECLINED_BY_PROVIDER: { label: "Déclinée", color: "bg-gray-500" },
  REFUSED: { label: "Refusée", color: "bg-red-500" },
  REFUSED_AUTOCLOSE: { label: "Refusée", color: "bg-red-500" },
  WITHDRAWN: { label: "Retirée", color: "bg-gray-400" },
};

const RecentProposals = () => {
  const { data, isLoading } = useProposals();

  const proposals = (data?.results ?? []).slice(0, 4);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Propositions Récentes</h3>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="animate-spin text-muted-foreground" size={24} />
          </div>
        ) : proposals.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">
            Aucune proposition envoyée.
          </p>
        ) : (
          <div className="space-y-3">
            {proposals.map((proposal, index) => {
              const config = statusConfig[proposal.status] ?? {
                label: proposal.status_display,
                color: "bg-gray-500",
              };
              return (
                <motion.div
                  key={proposal.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="p-3 rounded-lg border border-border hover:border-primary/50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-sm">{proposal.project.title}</h4>
                    <Badge
                      variant="secondary"
                      className={`${config.color} text-white text-xs`}
                    >
                      {config.label}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock size={12} />
                      <span>
                        {new Date(proposal.created_at).toLocaleDateString("fr-FR")}
                      </span>
                    </div>
                    <span className="font-medium text-foreground">
                      {parseFloat(proposal.price).toLocaleString("fr-FR")} GNF
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </Card>
    </motion.div>
  );
};

export default RecentProposals;
