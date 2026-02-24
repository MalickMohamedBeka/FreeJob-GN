import { motion } from "framer-motion";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Clock, CheckCircle2, Coins } from "lucide-react";
import { useContracts } from "@/hooks/useContracts";
import type { ApiContractList } from "@/types";

// ── Contract status styling ───────────────────────────────────────────────────

const statusConfig: Record<string, { label: string; class: string }> = {
  IN_PROGRESS: { label: "En cours", class: "bg-secondary text-white" },
  COMPLETED: { label: "Terminé", class: "bg-primary text-white" },
  ON_HOLD: { label: "En attente", class: "bg-yellow-500 text-white" },
  CANCELLED: { label: "Annulé", class: "bg-destructive text-white" },
};

// ── Page ──────────────────────────────────────────────────────────────────────

const ClientContracts = () => {
  const { data, isLoading } = useContracts();
  const contracts = data?.results ?? [];

  return (
    <DashboardLayout userType="client">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Mes Contrats</h1>
          <p className="text-muted-foreground">Suivez vos contrats de prestation</p>
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
            {contracts.map((contract: ApiContractList, index: number) => {
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

                    <div className="grid md:grid-cols-3 gap-4 p-4 bg-muted/50 rounded-lg text-sm">
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
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ClientContracts;
