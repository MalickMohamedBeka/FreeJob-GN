import { motion } from "framer-motion";
import { useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Loader2,
  Clock,
  CheckCircle2,
  Coins,
  ChevronDown,
  ChevronUp,
  CreditCard,
} from "lucide-react";
import { useContracts, useContractSummary, useInitiatePayment } from "@/hooks/useContracts";
import { useToast } from "@/hooks/use-toast";
import type { ApiContractList } from "@/types";

// ── Status config ─────────────────────────────────────────────────────────────

const statusConfig: Record<string, { label: string; class: string }> = {
  PENDING_PAYMENT: { label: "En attente de paiement", class: "bg-orange-500 text-white" },
  IN_PROGRESS: { label: "En cours", class: "bg-secondary text-white" },
  COMPLETED: { label: "Terminé", class: "bg-primary text-white" },
  ON_HOLD: { label: "En pause", class: "bg-yellow-500 text-white" },
  CANCELLED: { label: "Annulé", class: "bg-destructive text-white" },
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

// ── Payment Dialog ────────────────────────────────────────────────────────────

const PENDING_PAYMENT_KEY = "pending_payment";

function PaymentDialog({
  contract,
  open,
  onClose,
}: {
  contract: ApiContractList;
  open: boolean;
  onClose: () => void;
}) {
  const [phone, setPhone] = useState("");
  const { toast } = useToast();
  const initiate = useInitiatePayment();

  const handlePay = () => {
    if (!phone.trim()) {
      toast({
        title: "Numéro requis",
        description: "Saisissez votre numéro de téléphone.",
        variant: "destructive",
      });
      return;
    }
    const origin = import.meta.env.VITE_APP_URL || window.location.origin;
    initiate.mutate(
      {
        amount: contract.total_amount,
        country_code: "GN",
        payer_number: phone.trim(),
        allowed_payment_methods: ["OM", "MOMO", "SOUTRA_MONEY", "PAYCARD", "CARD"],
        return_url: `${origin}/client/payment/return`,
        cancel_url: `${origin}/client/payment/return?status=cancelled`,
        description: `Paiement pour le contrat — ${contract.project.title}`,
        contract_id: contract.id,
      },
      {
        onSuccess: (res) => {
          alert(JSON.stringify(res))
          if (res.data.transactionId) {
            sessionStorage.setItem(
              PENDING_PAYMENT_KEY,
              JSON.stringify({ transactionId: res.data.transactionId, contractId: contract.id })
            );
          }
          const redirectUrl = res.data.redirectUrl;
          alert(JSON.stringify(redirectUrl))
          if (!redirectUrl) {
            toast({
              title: "Erreur de paiement",
              description: "URL de redirection manquante.",
              variant: "destructive",
            });
            return;
          }
          window.location.assign(redirectUrl);
        },
        onError: (err) => {
          toast({
            title: "Erreur de paiement",
            description: err instanceof Error ? err.message : "Une erreur est survenue.",
            variant: "destructive",
          });
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Payer le contrat</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="p-3 bg-muted/50 rounded-lg text-sm">
            <p className="text-muted-foreground mb-0.5">Montant à payer</p>
            <p className="text-2xl font-bold">
              {parseFloat(contract.total_amount).toLocaleString("fr-FR")} GNF
            </p>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium">Numéro de téléphone (Mobile Money)</label>
            <Input
              placeholder="ex: 620000000"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={initiate.isPending}>
            Annuler
          </Button>
          <Button onClick={handlePay} disabled={initiate.isPending} className="gap-2">
            {initiate.isPending ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <CreditCard size={14} />
            )}
            Payer via Djomy
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

const ClientContracts = () => {
  const { data, isLoading } = useContracts();
  const contracts = data?.results ?? [];

  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [payingContract, setPayingContract] = useState<ApiContractList | null>(null);

  const toggle = (id: string) => setExpandedId((prev) => (prev === id ? null : id));

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
              const isExpanded = expandedId === contract.id;

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

                    <div className="grid md:grid-cols-3 gap-4 p-4 bg-muted/50 rounded-lg text-sm mb-4">
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

                    {isExpanded && (
                      <div className="border-t border-border pt-3 mb-4">
                        <ContractSummarySection contractId={contract.id} />
                      </div>
                    )}

                    <div className="flex flex-wrap items-center gap-2">
                      {contract.status === "PENDING_PAYMENT" && (
                        <Button
                          size="sm"
                          className="gap-2 bg-orange-500 hover:bg-orange-600"
                          onClick={() => setPayingContract(contract)}
                        >
                          <CreditCard size={14} />
                          Payer
                        </Button>
                      )}

                      <Button
                        size="sm"
                        variant="ghost"
                        className="gap-1.5 text-muted-foreground ml-auto"
                        onClick={() => toggle(contract.id)}
                      >
                        {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                        {isExpanded ? "Masquer le résumé" : "Voir le résumé financier"}
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {payingContract && (
        <PaymentDialog
          contract={payingContract}
          open={!!payingContract}
          onClose={() => setPayingContract(null)}
        />
      )}
    </DashboardLayout>
  );
};

export default ClientContracts;
