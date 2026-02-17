import { motion } from "framer-motion";
import { useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { useContracts } from "@/hooks/useContracts";

const statusConfig: Record<string, { label: string; badgeClass: string }> = {
  IN_PROGRESS: { label: "En cours", badgeClass: "bg-secondary text-white" },
  COMPLETED: { label: "Terminé", badgeClass: "bg-primary text-white" },
  ON_HOLD: { label: "En attente", badgeClass: "bg-secondary text-white" },
  CANCELLED: { label: "Annulé", badgeClass: "bg-red-500 text-white" },
};

const MyProjects = () => {
  const [activeTab, setActiveTab] = useState("active");
  const { data, isLoading } = useContracts();

  const contracts = data?.results ?? [];
  const activeContracts = contracts.filter((c) => c.status === "IN_PROGRESS");
  const completedContracts = contracts.filter((c) => c.status === "COMPLETED");
  const pendingContracts = contracts.filter((c) => c.status === "ON_HOLD");

  return (
    <DashboardLayout userType="freelancer">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Mes Projets</h1>
          <p className="text-muted-foreground">Gérez tous vos projets en un seul endroit</p>
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
              <div className="p-3 rounded-lg bg-secondary/10">
                <AlertCircle className="text-secondary" size={24} />
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

            <TabsContent value="active" className="space-y-4 mt-6">
              {activeContracts.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">
                  Aucun projet actif.
                </p>
              ) : (
                activeContracts.map((contract, index) => (
                  <ContractCard key={contract.id} contract={contract} index={index} />
                ))
              )}
            </TabsContent>

            <TabsContent value="completed" className="space-y-4 mt-6">
              {completedContracts.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">
                  Aucun projet terminé.
                </p>
              ) : (
                completedContracts.map((contract, index) => (
                  <ContractCard key={contract.id} contract={contract} index={index} />
                ))
              )}
            </TabsContent>

            <TabsContent value="pending" className="space-y-4 mt-6">
              {pendingContracts.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">
                  Aucun projet en attente.
                </p>
              ) : (
                pendingContracts.map((contract, index) => (
                  <ContractCard key={contract.id} contract={contract} index={index} />
                ))
              )}
            </TabsContent>
          </Tabs>
        )}
      </div>
    </DashboardLayout>
  );
};

function ContractCard({
  contract,
  index,
}: {
  contract: import("@/types").ApiContractList;
  index: number;
}) {
  const config = statusConfig[contract.status] ?? {
    label: contract.status_display,
    badgeClass: "bg-muted text-foreground",
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
            <p className="text-muted-foreground">{contract.client.username}</p>
          </div>
          <Badge className={config.badgeClass}>{config.label}</Badge>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mb-4 p-4 bg-muted/50 rounded-lg">
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

        <div className="flex gap-2">
          <Button size="sm" className="flex-1">
            Voir détails
          </Button>
        </div>
      </Card>
    </motion.div>
  );
}

export default MyProjects;
