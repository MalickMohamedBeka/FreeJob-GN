import { motion } from "framer-motion";
import { useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Clock,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ChevronDown,
  ChevronUp,
  Flag,
  ThumbsUp,
} from "lucide-react";
import { useContracts, useContractSummary, useRequestCompletion, useConfirmCompletion } from "@/hooks/useContracts";
import { useToast } from "@/hooks/use-toast";
import type { ApiContractList } from "@/types";

// ── Contract status styling ───────────────────────────────────────────────────

const statusConfig: Record<string, { label: string; badgeClass: string }> = {
  PENDING_PAYMENT: { label: "En attente de paiement", badgeClass: "bg-orange-500 text-white" },
  IN_PROGRESS: { label: "En cours", badgeClass: "bg-secondary text-white" },
  COMPLETED: { label: "Terminé", badgeClass: "bg-primary text-white" },
  ON_HOLD: { label: "En pause", badgeClass: "bg-yellow-500 text-white" },
  CANCELLED: { label: "Annulé", badgeClass: "bg-red-500 text-white" },
};

// ── Contract Summary (lazy-fetched on expand) ─────────────────────────────────

function ContractSummarySection({ contractId }: { contractId: string }) {
  const { data, isLoading } = useContractSummary(contractId);

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 py-3 text-sm text-muted-foreground">
        <Loader2 size={14} className="animate-spin" />
        Chargement du résumé…
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="grid grid-cols-2 gap-3 pt-3 text-sm">
      <div>
        <p className="text-muted-foreground mb-0.5">Montant payé</p>
        <p className="font-semibold text-primary">
          {parseFloat(data.amount_paid).toLocaleString("fr-FR")} GNF
        </p>
      </div>
      <div>
        <p className="text-muted-foreground mb-0.5">Reste à payer</p>
        <p className="font-semibold">
          {parseFloat(data.amount_remaining).toLocaleString("fr-FR")} GNF
        </p>
      </div>
      <div className="col-span-2">
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
            data.is_paid
              ? "bg-primary/10 text-primary"
              : "bg-orange-100 text-orange-700"
          }`}
        >
          {data.is_paid ? <CheckCircle2 size={12} /> : <Clock size={12} />}
          {data.is_paid ? "Paiement complet" : "Paiement en attente"}
        </span>
      </div>
    </div>
  );
}

// ── Contract Card ─────────────────────────────────────────────────────────────

function ContractCard({
  contract,
  index,
  userRole,
}: {
  contract: ApiContractList;
  index: number;
  userRole: "freelancer" | "client";
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { toast } = useToast();
  const requestCompletion = useRequestCompletion();
  const confirmCompletion = useConfirmCompletion();

  const config = statusConfig[contract.status] ?? {
    label: contract.status_display,
    badgeClass: "bg-muted text-foreground",
  };

  const handleRequestCompletion = () => {
    requestCompletion.mutate(contract.id, {
      onSuccess: () => {
        toast({ title: "Fin de mission signalée", description: "Le client recevra une notification pour confirmer." });
      },
      onError: (err) => {
        toast({
          title: "Erreur",
          description: err instanceof Error ? err.message : "Une erreur est survenue.",
          variant: "destructive",
        });
      },
    });
  };

  const handleConfirmCompletion = () => {
    confirmCompletion.mutate(contract.id, {
      onSuccess: () => {
        toast({ title: "Contrat terminé !", description: "Le contrat a été clôturé avec succès." });
      },
      onError: (err) => {
        toast({
          title: "Erreur",
          description: err instanceof Error ? err.message : "Une erreur est survenue.",
          variant: "destructive",
        });
      },
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-xl font-semibold mb-1">{contract.project.title}</h3>
            <p className="text-muted-foreground">Client: {contract.client.username}</p>
          </div>
          <Badge className={config.badgeClass}>{config.label}</Badge>
        </div>

        <div className="grid md:grid-cols-3 gap-4 p-4 bg-muted/50 rounded-lg mb-4">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Montant Total</p>
            <p className="font-semibold">
              {parseFloat(contract.total_amount).toLocaleString("fr-FR")} GNF
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Date de début</p>
            <p className="font-medium">
              {new Date(contract.start_at).toLocaleDateString("fr-FR")}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Plan de financement</p>
            <p className="font-medium">{contract.funding_plan_display}</p>
          </div>
        </div>

        {isExpanded && (
          <div className="border-t border-border pt-3 mb-4">
            <ContractSummarySection contractId={contract.id} />
          </div>
        )}

        <div className="flex flex-wrap items-center gap-2">
          {contract.status === "IN_PROGRESS" && userRole === "freelancer" && (
            <Button
              size="sm"
              variant="outline"
              className="gap-2 border-primary text-primary hover:bg-primary hover:text-white"
              onClick={handleRequestCompletion}
              disabled={requestCompletion.isPending}
            >
              {requestCompletion.isPending ? <Loader2 size={14} className="animate-spin" /> : <Flag size={14} />}
              Signaler la fin de mission
            </Button>
          )}
          {contract.status === "IN_PROGRESS" && userRole === "client" && (
            <Button
              size="sm"
              className="gap-2"
              onClick={handleConfirmCompletion}
              disabled={confirmCompletion.isPending}
            >
              {confirmCompletion.isPending ? <Loader2 size={14} className="animate-spin" /> : <ThumbsUp size={14} />}
              Confirmer la complétion
            </Button>
          )}

          <Button
            size="sm"
            variant="ghost"
            className="gap-1.5 text-muted-foreground ml-auto"
            onClick={() => setIsExpanded((v) => !v)}
          >
            {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            {isExpanded ? "Masquer le résumé" : "Voir le résumé financier"}
          </Button>
        </div>
      </Card>
    </motion.div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

const MyProjects = () => {
  const [activeTab, setActiveTab] = useState("active");

  const { data, isLoading } = useContracts();
  const contracts = data?.results ?? [];

  const activeContracts = contracts.filter((c) => c.status === "IN_PROGRESS");
  const completedContracts = contracts.filter((c) => c.status === "COMPLETED");
  const pendingContracts = contracts.filter((c) => c.status === "ON_HOLD" || c.status === "PENDING_PAYMENT");

  return (
    <DashboardLayout userType="freelancer">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Mes Projets</h1>
          <p className="text-muted-foreground">Gérez tous vos contrats en un seul endroit</p>
        </div>

        {/* Stats Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Projets Actifs</p>
                <p className="text-2xl font-bold">{activeContracts.length}</p>
              </div>
              <div className="p-3 rounded-lg bg-secondary/10">
                <Clock className="text-secondary" size={24} />
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Terminés</p>
                <p className="text-2xl font-bold">{completedContracts.length}</p>
              </div>
              <div className="p-3 rounded-lg bg-primary/10">
                <CheckCircle2 className="text-primary" size={24} />
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">En attente</p>
                <p className="text-2xl font-bold">{pendingContracts.length}</p>
              </div>
              <div className="p-3 rounded-lg bg-yellow-500/10">
                <AlertCircle className="text-yellow-500" size={24} />
              </div>
            </div>
          </Card>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="animate-spin text-muted-foreground" size={32} />
          </div>
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="active">Actifs ({activeContracts.length})</TabsTrigger>
              <TabsTrigger value="completed">Terminés ({completedContracts.length})</TabsTrigger>
              <TabsTrigger value="pending">En attente ({pendingContracts.length})</TabsTrigger>
            </TabsList>

            {(["active", "completed", "pending"] as const).map((tab) => {
              const list =
                tab === "active" ? activeContracts
                : tab === "completed" ? completedContracts
                : pendingContracts;

              return (
                <TabsContent key={tab} value={tab} className="space-y-4 mt-6">
                  {list.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-8">
                      Aucun contrat dans cette catégorie.
                    </p>
                  ) : (
                    list.map((contract, i) => (
                      <ContractCard
                        key={contract.id}
                        contract={contract}
                        index={i}
                        userRole="freelancer"
                      />
                    ))
                  )}
                </TabsContent>
              );
            })}
          </Tabs>
        )}
      </div>
    </DashboardLayout>
  );
};

export default MyProjects;
