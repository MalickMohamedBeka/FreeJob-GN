import { motion } from "framer-motion";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Clock, Coins, FileText, Trash2, Loader2 } from "lucide-react";
import { useProposals, useWithdrawProposal } from "@/hooks/useProposals";

const statusColorMap: Record<string, string> = {
  PENDING: "bg-primary",
  SHORTLISTED: "bg-secondary",
  SELECTED: "bg-primary",
  CONFIRMED: "bg-primary",
  REFUSED: "bg-muted",
  WITHDRAWN: "bg-muted",
  REFUSED_AUTOCLOSE: "bg-muted",
  DECLINED_BY_PROVIDER: "bg-muted",
};

const Proposals = () => {
  const { data, isLoading } = useProposals();
  const withdrawMutation = useWithdrawProposal();

  const proposals = data?.results ?? [];

  const pendingCount = proposals.filter(p => p.status === "PENDING").length;
  const confirmedCount = proposals.filter(p => p.status === "CONFIRMED" || p.status === "SELECTED").length;
  const successRate = proposals.length > 0
    ? Math.round((confirmedCount / proposals.length) * 100)
    : 0;

  return (
    <DashboardLayout userType="freelancer">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Mes Propositions</h1>
            <p className="text-muted-foreground">Suivez l'état de toutes vos propositions</p>
          </div>
          <Button>Nouvelle proposition</Button>
        </div>

        {/* Stats */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-4">
            <p className="text-sm text-muted-foreground mb-1">Total Envoyées</p>
            <p className="text-2xl font-bold">{proposals.length}</p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-muted-foreground mb-1">En Attente</p>
            <p className="text-2xl font-bold text-primary">{pendingCount}</p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-muted-foreground mb-1">Acceptées</p>
            <p className="text-2xl font-bold text-primary">{confirmedCount}</p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-muted-foreground mb-1">Taux de Réussite</p>
            <p className="text-2xl font-bold text-primary">{successRate}%</p>
          </Card>
        </div>

        {/* Loading */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="animate-spin text-primary" size={40} />
          </div>
        ) : proposals.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <FileText className="mx-auto mb-4" size={48} />
            <p className="text-lg font-medium">Aucune proposition pour le moment</p>
          </div>
        ) : (
          /* Proposals List */
          <div className="space-y-4">
            {proposals.map((proposal, index) => (
              <motion.div
                key={proposal.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold mb-1">{proposal.project.title}</h3>
                      <p className="text-muted-foreground">{proposal.provider.username}</p>
                    </div>
                    <Badge className={`${statusColorMap[proposal.status] || "bg-muted"} text-white`}>
                      {proposal.status_display}
                    </Badge>
                  </div>

                  <div className="grid md:grid-cols-4 gap-4 mb-4 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Coins size={16} />
                      <span className="font-medium text-foreground">{Number(proposal.price).toLocaleString()} GNF</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock size={16} />
                      <span>{proposal.duration_days} jours</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Eye size={16} />
                      <span>{proposal.status_display}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <FileText size={16} />
                      <span>{new Date(proposal.created_at).toLocaleDateString('fr-FR')}</span>
                    </div>
                  </div>

                  <div className="p-4 bg-muted/50 rounded-lg mb-4">
                    <p className="text-sm text-muted-foreground mb-1">Lettre de motivation</p>
                    <p className="text-sm">{proposal.message}</p>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      Voir détails
                    </Button>
                    {(proposal.status === "PENDING" || proposal.status === "SHORTLISTED") && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-destructive"
                        disabled={withdrawMutation.isPending}
                        onClick={() => withdrawMutation.mutate(proposal.id)}
                      >
                        <Trash2 size={16} />
                      </Button>
                    )}
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Proposals;
