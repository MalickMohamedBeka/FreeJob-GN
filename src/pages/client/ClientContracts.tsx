import { motion } from "framer-motion";
import { useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Loader2, Clock, CheckCircle2, Coins, PackageCheck } from "lucide-react";
import { useContracts, useContractMilestones, useReleaseMilestone } from "@/hooks/useContracts";
import type { ApiContractList, ApiMilestone } from "@/types";

// ── Milestone status styling ──────────────────────────────────────────────────

const milestoneStatusConfig: Record<string, { label: string; class: string }> = {
  PENDING: { label: "En attente", class: "bg-muted text-foreground" },
  FUNDED: { label: "Financé", class: "bg-blue-500 text-white" },
  DELIVERED: { label: "Livré", class: "bg-orange-500 text-white" },
  RELEASED: { label: "Payé", class: "bg-primary text-white" },
  REFUNDED: { label: "Remboursé", class: "bg-secondary text-white" },
  CANCELLED: { label: "Annulé", class: "bg-destructive text-white" },
};

// ── Contract Detail Sheet ─────────────────────────────────────────────────────

function ContractDetailSheet({
  contract,
  open,
  onClose,
}: {
  contract: ApiContractList | null;
  open: boolean;
  onClose: () => void;
}) {
  const { data: milestonesData, isLoading } = useContractMilestones(contract?.id ?? "");
  const release = useReleaseMilestone();

  const milestones: ApiMilestone[] = milestonesData?.results ?? [];

  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader className="mb-6">
          <SheetTitle>{contract?.project.title}</SheetTitle>
          <p className="text-sm text-muted-foreground">
            Prestataire: {contract?.provider.username}
          </p>
        </SheetHeader>

        {/* Summary */}
        {contract && (
          <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg mb-6 text-sm">
            <div>
              <p className="text-muted-foreground mb-0.5">Montant Total</p>
              <p className="font-semibold">
                {parseFloat(contract.total_amount).toLocaleString("fr-FR")} GNF
              </p>
            </div>
            <div>
              <p className="text-muted-foreground mb-0.5">Plan</p>
              <p className="font-semibold">{contract.funding_plan_display}</p>
            </div>
            <div>
              <p className="text-muted-foreground mb-0.5">Début</p>
              <p className="font-medium">{new Date(contract.start_at).toLocaleDateString("fr-FR")}</p>
            </div>
            <div>
              <p className="text-muted-foreground mb-0.5">Fin</p>
              <p className="font-medium">
                {contract.end_at ? new Date(contract.end_at).toLocaleDateString("fr-FR") : "—"}
              </p>
            </div>
          </div>
        )}

        <h4 className="font-semibold mb-3">Jalons</h4>

        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="animate-spin text-muted-foreground" size={24} />
          </div>
        ) : milestones.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">
            Aucun jalon défini.
          </p>
        ) : (
          <div className="space-y-3">
            {milestones.map((m) => {
              const mConfig = milestoneStatusConfig[m.status] ?? {
                label: m.status_display,
                class: "bg-muted",
              };

              return (
                <div key={m.id} className="p-4 border border-border rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <p className="font-medium text-sm">{m.title}</p>
                      {m.description && (
                        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                          {m.description}
                        </p>
                      )}
                    </div>
                    <Badge className={`${mConfig.class} ml-2 shrink-0`}>{mConfig.label}</Badge>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Coins size={14} />
                      <span>{parseFloat(m.amount).toLocaleString("fr-FR")} GNF</span>
                    </div>
                    {m.due_date && (
                      <span className="text-xs text-muted-foreground">
                        Échéance: {new Date(m.due_date).toLocaleDateString("fr-FR")}
                      </span>
                    )}
                  </div>

                  {/* Release — client can release payment when milestone is DELIVERED */}
                  {m.status === "DELIVERED" && (
                    <Button
                      size="sm"
                      className="mt-3 w-full gap-2"
                      disabled={release.isPending}
                      onClick={() => release.mutate(m.id)}
                    >
                      {release.isPending ? (
                        <Loader2 size={14} className="animate-spin" />
                      ) : (
                        <PackageCheck size={14} />
                      )}
                      Valider et libérer le paiement
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}

// ── Contract status styling ───────────────────────────────────────────────────

const statusConfig: Record<string, { label: string; class: string }> = {
  IN_PROGRESS: { label: "En cours", class: "bg-secondary text-white" },
  COMPLETED: { label: "Terminé", class: "bg-primary text-white" },
  ON_HOLD: { label: "En attente", class: "bg-yellow-500 text-white" },
  CANCELLED: { label: "Annulé", class: "bg-destructive text-white" },
};

// ── Page ──────────────────────────────────────────────────────────────────────

const ClientContracts = () => {
  const [selectedContract, setSelectedContract] = useState<ApiContractList | null>(null);
  const { data, isLoading } = useContracts();
  const contracts = data?.results ?? [];

  return (
    <DashboardLayout userType="client">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Mes Contrats</h1>
          <p className="text-muted-foreground">Suivez vos contrats et jalons de paiement</p>
        </div>

        {/* Stats */}
        <div className="grid sm:grid-cols-3 gap-4">
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">En Cours</p>
                <p className="text-2xl font-bold">
                  {contracts.filter((c) => c.status === "IN_PROGRESS").length}
                </p>
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
                <p className="text-2xl font-bold">
                  {contracts.filter((c) => c.status === "COMPLETED").length}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-primary/10">
                <CheckCircle2 className="text-primary" size={24} />
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total</p>
                <p className="text-2xl font-bold">{contracts.length}</p>
              </div>
              <div className="p-3 rounded-lg bg-muted">
                <Coins className="text-muted-foreground" size={24} />
              </div>
            </div>
          </Card>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="animate-spin text-primary" size={40} />
          </div>
        ) : contracts.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <CheckCircle2 className="mx-auto mb-4" size={48} />
            <p className="text-lg font-medium">Aucun contrat pour le moment</p>
          </div>
        ) : (
          <div className="space-y-4">
            {contracts.map((contract, index) => {
              const sc = statusConfig[contract.status] ?? {
                label: contract.status_display,
                class: "bg-muted text-foreground",
              };

              return (
                <motion.div
                  key={contract.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold mb-1">{contract.project.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          Prestataire: {contract.provider.username}
                        </p>
                      </div>
                      <Badge className={sc.class}>{sc.label}</Badge>
                    </div>

                    <div className="grid md:grid-cols-3 gap-4 mb-4 p-4 bg-muted/50 rounded-lg text-sm">
                      <div>
                        <p className="text-muted-foreground mb-0.5">Montant Total</p>
                        <p className="font-semibold">
                          {parseFloat(contract.total_amount).toLocaleString("fr-FR")} GNF
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground mb-0.5">Plan</p>
                        <p className="font-medium">{contract.funding_plan_display}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground mb-0.5">Début</p>
                        <p className="font-medium">
                          {new Date(contract.start_at).toLocaleDateString("fr-FR")}
                        </p>
                      </div>
                    </div>

                    <Button
                      size="sm"
                      className="w-full"
                      onClick={() => setSelectedContract(contract)}
                    >
                      Voir les jalons
                    </Button>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      <ContractDetailSheet
        contract={selectedContract}
        open={selectedContract !== null}
        onClose={() => setSelectedContract(null)}
      />
    </DashboardLayout>
  );
};

export default ClientContracts;
