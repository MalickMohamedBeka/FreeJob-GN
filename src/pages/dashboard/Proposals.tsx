import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Coins, FileText, Trash2, Loader2, CheckCircle2, ExternalLink, AlertTriangle } from "lucide-react";
import { useProposals, useWithdrawProposal, useConfirmProposal } from "@/hooks/useProposals";
import { ROUTES } from "@/constants/routes";
import { useState, useEffect } from "react";

const statusColorMap: Record<string, string> = {
  PENDING: "bg-yellow-500",
  SHORTLISTED: "bg-blue-500",
  SELECTED: "bg-orange-500",
  SELECTION_EXPIRED: "bg-red-500",
  CONFIRMED: "bg-primary",
  REFUSED: "bg-muted text-foreground",
  WITHDRAWN: "bg-muted text-foreground",
  REFUSED_AUTOCLOSE: "bg-muted text-foreground",
  DECLINED_BY_PROVIDER: "bg-muted text-foreground",
};

// ── Expiry Countdown ──────────────────────────────────────────────────────────

function useCountdown(expiresAt: string | null) {
  const getRemaining = () => {
    if (!expiresAt) return null;
    const diff = new Date(expiresAt).getTime() - Date.now();
    if (diff <= 0) return null;
    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    return { h, m, diff };
  };

  const [remaining, setRemaining] = useState(getRemaining);

  useEffect(() => {
    if (!expiresAt) return;
    const id = setInterval(() => setRemaining(getRemaining()), 60000);
    return () => clearInterval(id);
  }, [expiresAt]);

  return remaining;
}

function ExpiryCountdown({ expiresAt }: { expiresAt: string }) {
  const remaining = useCountdown(expiresAt);

  if (!remaining) {
    return (
      <div className="flex items-center gap-2 mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
        <AlertTriangle size={15} />
        <span>Délai de confirmation expiré.</span>
      </div>
    );
  }

  const urgent = remaining.diff < 3 * 3600000; // moins de 3h
  return (
    <div className={`flex items-center gap-2 mb-4 p-3 rounded-lg border text-sm ${
      urgent
        ? "bg-red-50 border-red-200 text-red-700"
        : "bg-orange-50 border-orange-200 text-orange-700"
    }`}>
      <Clock size={15} />
      <span>
        Confirmez avant le{" "}
        <strong>
          {new Date(expiresAt).toLocaleDateString("fr-FR", {
            day: "2-digit", month: "long", year: "numeric",
          })}
        </strong>
        {" "}—{" "}
        {remaining.h > 0
          ? `${remaining.h}h ${remaining.m}min restantes`
          : `${remaining.m} min restantes`}
      </span>
    </div>
  );
}

const Proposals = () => {
  const { data, isLoading } = useProposals();
  const withdrawMutation = useWithdrawProposal();
  const confirmMutation = useConfirmProposal();

  const proposals = data?.results ?? [];

  const pendingCount = proposals.filter(p => p.status === "PENDING").length;
  const confirmedCount = proposals.filter(p => p.status === "CONFIRMED").length;
  const successRate = proposals.length > 0
    ? Math.round((confirmedCount / proposals.length) * 100)
    : 0;

  return (
    <DashboardLayout userType="freelancer">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold mb-2">Mes Propositions</h1>
          <p className="text-muted-foreground">Suivez l'état de toutes vos propositions</p>
        </div>

        {/* Stats */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-4">
            <p className="text-sm text-muted-foreground mb-1">Total Envoyées</p>
            <p className="text-2xl font-bold">{proposals.length}</p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-muted-foreground mb-1">En Attente</p>
            <p className="text-2xl font-bold text-yellow-500">{pendingCount}</p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-muted-foreground mb-1">Confirmées</p>
            <p className="text-2xl font-bold text-primary">{confirmedCount}</p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-muted-foreground mb-1">Taux de Réussite</p>
            <p className="text-2xl font-bold text-primary">{successRate}%</p>
          </Card>
        </div>

        {/* List */}
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
                      <Link
                        to={`/dashboard/find-projects/${proposal.project.id}`}
                        className="text-xl font-semibold mb-1 hover:text-primary transition-colors block"
                      >
                        {proposal.project.title}
                      </Link>
                      <p className="text-sm text-muted-foreground">Projet #{proposal.project.id.slice(0, 8)}</p>
                    </div>
                    <Badge className={`${statusColorMap[proposal.status] ?? "bg-muted"} text-white`}>
                      {proposal.status_display}
                    </Badge>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4 mb-4 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Coins size={16} />
                      <span className="font-medium text-foreground">
                        {Number(proposal.price).toLocaleString()} GNF
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock size={16} />
                      <span>{proposal.duration_days} jours</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <FileText size={16} />
                      <span>{new Date(proposal.created_at).toLocaleDateString('fr-FR')}</span>
                    </div>
                  </div>

                  <div className="p-4 bg-muted/50 rounded-lg mb-4">
                    <p className="text-xs text-muted-foreground mb-1">Lettre de motivation</p>
                    <p className="text-sm line-clamp-3">{proposal.message}</p>
                  </div>

                  {/* Selection expiry countdown */}
                  {proposal.status === "SELECTED" && proposal.selection_expires_at && (
                    <ExpiryCountdown expiresAt={proposal.selection_expires_at} />
                  )}

                  {/* Expired notice */}
                  {proposal.status === "SELECTION_EXPIRED" && (
                    <div className="flex items-center gap-2 mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
                      <AlertTriangle size={15} />
                      <span>Vous n'avez pas confirmé dans le délai imparti — la sélection a expiré.</span>
                    </div>
                  )}

                  <div className="flex gap-2">
                    {/* Confirm contract — visible only when SELECTED */}
                    {proposal.status === "SELECTED" && (
                      <Button
                        className="flex-1 gap-2 bg-orange-500 hover:bg-orange-600"
                        disabled={confirmMutation.isPending}
                        onClick={() => confirmMutation.mutate(proposal.id)}
                      >
                        {confirmMutation.isPending ? (
                          <Loader2 size={16} className="animate-spin" />
                        ) : (
                          <CheckCircle2 size={16} />
                        )}
                        Confirmer le contrat
                      </Button>
                    )}

                    {/* Link to contracts page — visible once CONFIRMED */}
                    {proposal.status === "CONFIRMED" && (
                      <Button variant="outline" size="sm" className="gap-2" asChild>
                        <Link to={ROUTES.DASHBOARD.MY_PROJECTS}>
                          <ExternalLink size={14} />
                          Voir le contrat
                        </Link>
                      </Button>
                    )}

                    {/* Withdraw — available while PENDING or SHORTLISTED */}
                    {(proposal.status === "PENDING" || proposal.status === "SHORTLISTED") && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-destructive gap-2"
                        disabled={withdrawMutation.isPending}
                        onClick={() => withdrawMutation.mutate(proposal.id)}
                      >
                        <Trash2 size={16} />
                        Retirer
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
