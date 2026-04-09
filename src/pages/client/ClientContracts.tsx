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
  Flag,
  ThumbsUp,
  AlertTriangle,
  RotateCcw,
  Package,
  CheckCheck,
} from "lucide-react";
import { useContracts, useContractSummary, useInitiatePayment, useRequestCompletion, useConfirmCompletion, useRequestRevision, useDeliverables, useAcceptDeliverable, useRequestDeliverableRevision } from "@/hooks/useContracts";
import { useToast } from "@/hooks/use-toast";
import { DisputeModal } from "@/components/contracts/DisputeModal";
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
          if (res.data.transactionId) {
            sessionStorage.setItem(
              PENDING_PAYMENT_KEY,
              JSON.stringify({ transactionId: res.data.transactionId, contractId: contract.id })
            );
          }
          const redirectUrl = res.data.redirectUrl;
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

// ── Contract Card ─────────────────────────────────────────────────────────────

function ContractCard({
  contract,
  index,
  onPay,
}: {
  contract: ApiContractList;
  index: number;
  onPay: (contract: ApiContractList) => void;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [deliverableOpen, setDeliverableOpen] = useState(false);
  const [disputeOpen, setDisputeOpen] = useState(false);
  const [revisionOpen, setRevisionOpen] = useState(false);
  const [revisionNote, setRevisionNote] = useState("");
  const [delivRevisionId, setDelivRevisionId] = useState<string | null>(null);
  const [delivRevisionNote, setDelivRevisionNote] = useState("");
  const { toast } = useToast();

  const { data: deliverables, isLoading: delivLoading } = useDeliverables(contract.id, deliverableOpen);
  const acceptDeliverable = useAcceptDeliverable();
  const requestDelivRevision = useRequestDeliverableRevision();

  const handleAcceptDeliverable = (deliverableId: string) => {
    acceptDeliverable.mutate(
      { deliverableId, contractId: contract.id },
      {
        onSuccess: () => toast({ title: "Livrable accepté !" }),
        onError: (err) => toast({ title: "Erreur", description: err instanceof Error ? err.message : "Une erreur est survenue.", variant: "destructive" }),
      }
    );
  };

  const handleDelivRevision = () => {
    if (!delivRevisionId) return;
    requestDelivRevision.mutate(
      { deliverableId: delivRevisionId, contractId: contract.id, revision_note: delivRevisionNote },
      {
        onSuccess: () => {
          toast({ title: "Révision demandée", description: "Le prestataire a été notifié." });
          setDelivRevisionId(null);
          setDelivRevisionNote("");
        },
        onError: (err) => toast({ title: "Erreur", description: err instanceof Error ? err.message : "Une erreur est survenue.", variant: "destructive" }),
      }
    );
  };

  const requestRevision = useRequestRevision();
  const revisionsExhausted = contract.revisions_used >= contract.revisions_included;

  const handleRequestRevision = () => {
    requestRevision.mutate(
      { contractId: contract.id, note: revisionNote.trim() },
      {
        onSuccess: () => {
          toast({ title: "Révision demandée", description: "Le prestataire a été notifié." });
          setRevisionNote("");
          setRevisionOpen(false);
        },
        onError: (err) => {
          toast({
            title: "Erreur",
            description: err instanceof Error ? err.message : "Une erreur est survenue.",
            variant: "destructive",
          });
        },
      }
    );
  };

  // completion_requested_by is the user ID who signaled, or null if nobody has
  const requestedByClient = contract.completion_requested_by === contract.client.id;
  const requestedByProvider =
    contract.completion_requested_by !== null &&
    contract.completion_requested_by !== contract.client.id;

  const requestCompletion = useRequestCompletion();
  const confirmCompletion = useConfirmCompletion();

  const sc = statusConfig[contract.status] ?? { label: contract.status_display, class: "bg-muted text-foreground" };

  const handleRequestCompletion = () => {
    requestCompletion.mutate(contract.id, {
      onSuccess: () => toast({ title: "Fin de mission signalée", description: "Le prestataire recevra une notification pour confirmer." }),
      onError: (err) => toast({ title: "Erreur", description: err instanceof Error ? err.message : "Une erreur est survenue.", variant: "destructive" }),
    });
  };

  const handleConfirmCompletion = () => {
    confirmCompletion.mutate(contract.id, {
      onSuccess: () => toast({ title: "Contrat terminé !", description: "Le contrat a été clôturé avec succès." }),
      onError: (err) => toast({ title: "Erreur", description: err instanceof Error ? err.message : "Une erreur est survenue.", variant: "destructive" }),
    });
  };

  return (
    <motion.div
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

        <div className="grid md:grid-cols-4 gap-4 p-4 bg-muted/50 rounded-lg text-sm mb-4">
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
          <div>
            <p className="text-muted-foreground mb-0.5">Révisions</p>
            <p className={`font-semibold ${revisionsExhausted ? "text-destructive" : "text-foreground"}`}>
              {contract.revisions_used} / {contract.revisions_included}
            </p>
          </div>
        </div>

        {isExpanded && (
          <div className="border-t border-border pt-3 mb-4">
            <ContractSummarySection contractId={contract.id} />
          </div>
        )}

        {deliverableOpen && (
          <div className="border-t border-border pt-3 mb-4">
            <p className="text-sm font-semibold mb-3 flex items-center gap-2">
              <Package size={14} /> Livrables
            </p>
            {delivLoading ? (
              <div className="flex items-center gap-2 text-sm text-muted-foreground py-2">
                <Loader2 size={14} className="animate-spin" /> Chargement…
              </div>
            ) : !deliverables?.length ? (
              <p className="text-sm text-muted-foreground py-2">Aucun livrable soumis pour l'instant.</p>
            ) : (
              <div className="space-y-3">
                {deliverables.map((d) => (
                  <div key={d.id} className="p-3 rounded-lg border border-border bg-muted/30 text-sm">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <p className="font-medium">{d.description || "Sans description"}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {new Date(d.created_at).toLocaleDateString("fr-FR")}
                          {d.revision_count > 0 && ` — ${d.revision_count} révision(s)`}
                        </p>
                      </div>
                      <span className={`shrink-0 px-2 py-0.5 rounded-full text-xs font-medium ${
                        d.status === "ACCEPTED" ? "bg-primary/10 text-primary" :
                        d.status === "REVISION_REQUESTED" ? "bg-orange-100 text-orange-700" :
                        "bg-secondary/10 text-secondary"
                      }`}>
                        {d.status_display}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <a href={d.file} target="_blank" rel="noopener noreferrer"
                        className="text-xs text-primary hover:underline">
                        Télécharger le fichier
                      </a>
                      {d.status === "SUBMITTED" && (
                        <>
                          <Button size="sm" variant="outline"
                            className="h-7 text-xs gap-1 border-primary text-primary hover:bg-primary hover:text-white"
                            onClick={() => handleAcceptDeliverable(d.id)}
                            disabled={acceptDeliverable.isPending}
                          >
                            <CheckCheck size={12} /> Accepter
                          </Button>
                          <Button size="sm" variant="outline"
                            className="h-7 text-xs gap-1"
                            onClick={() => { setDelivRevisionId(d.id); setDelivRevisionNote(""); }}
                          >
                            <RotateCcw size={12} /> Révision
                          </Button>
                        </>
                      )}
                    </div>
                    {d.revision_note && (
                      <p className="text-xs text-muted-foreground mt-2 italic">Note : {d.revision_note}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="flex flex-wrap items-center gap-2">
          {contract.status === "PENDING_PAYMENT" && (
            <Button
              size="sm"
              className="gap-2 bg-orange-500 hover:bg-orange-600"
              onClick={() => onPay(contract)}
            >
              <CreditCard size={14} />
              Payer
            </Button>
          )}

          {contract.status === "IN_PROGRESS" && !requestedByClient && !requestedByProvider && (
            <Button
              size="sm"
              variant="outline"
              className="gap-2 border-primary text-primary hover:bg-primary hover:text-white"
              onClick={handleRequestCompletion}
              disabled={requestCompletion.isPending}
            >
              {requestCompletion.isPending ? <Loader2 size={14} className="animate-spin" /> : <Flag size={14} />}
              Signaler la fin
            </Button>
          )}

          {contract.status === "IN_PROGRESS" && requestedByClient && !requestedByProvider && (
            <span className="text-sm text-muted-foreground flex items-center gap-1.5">
              <Clock size={14} />
              En attente de confirmation du prestataire
            </span>
          )}

          {contract.status === "IN_PROGRESS" && requestedByProvider && !requestedByClient && (
            <Button
              size="sm"
              className="gap-2"
              onClick={handleConfirmCompletion}
              disabled={confirmCompletion.isPending}
            >
              {confirmCompletion.isPending ? <Loader2 size={14} className="animate-spin" /> : <ThumbsUp size={14} />}
              Confirmer la fin
            </Button>
          )}

          {contract.status === "IN_PROGRESS" && (
            <Button
              size="sm"
              variant="outline"
              className="gap-2"
              onClick={() => setRevisionOpen(true)}
              disabled={revisionsExhausted}
              title={revisionsExhausted ? "Quota de révisions épuisé" : undefined}
            >
              <RotateCcw size={14} />
              {revisionsExhausted ? "Révisions épuisées" : "Demander une révision"}
            </Button>
          )}

          {(contract.status === "IN_PROGRESS" || contract.status === "ON_HOLD") && (
            <Button
              size="sm"
              variant="outline"
              className="gap-2 border-destructive/50 text-destructive hover:bg-destructive hover:text-white"
              onClick={() => setDisputeOpen(true)}
            >
              <AlertTriangle size={14} />
              {contract.status === "ON_HOLD" ? "Litige en cours" : "Ouvrir un litige"}
            </Button>
          )}

          <Button
            size="sm"
            variant="ghost"
            className="gap-1.5 text-muted-foreground"
            onClick={() => setDeliverableOpen((v) => !v)}
          >
            <Package size={14} />
            {deliverableOpen ? "Masquer livrables" : "Voir livrables"}
          </Button>

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

      {/* Deliverable Revision Dialog */}
      <Dialog open={!!delivRevisionId} onOpenChange={(v) => !v && setDelivRevisionId(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <RotateCcw size={16} /> Demander une révision du livrable
            </DialogTitle>
          </DialogHeader>
          <div className="py-2">
            <label className="block text-sm font-semibold mb-2">Note de révision</label>
            <textarea
              value={delivRevisionNote}
              onChange={(e) => setDelivRevisionNote(e.target.value)}
              placeholder="Décrivez les modifications à apporter…"
              rows={3}
              className="w-full px-3 py-2 rounded-lg border border-border bg-white text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors resize-none text-sm"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDelivRevisionId(null)} disabled={requestDelivRevision.isPending}>
              Annuler
            </Button>
            <Button onClick={handleDelivRevision} disabled={requestDelivRevision.isPending} className="gap-2">
              {requestDelivRevision.isPending ? <Loader2 size={14} className="animate-spin" /> : <RotateCcw size={14} />}
              Confirmer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Revision Dialog */}
      <Dialog open={revisionOpen} onOpenChange={(v) => !v && setRevisionOpen(false)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <RotateCcw size={16} />
              Demander une révision
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="p-3 bg-muted/50 rounded-lg text-sm text-muted-foreground">
              Révisions utilisées : <span className="font-semibold text-foreground">{contract.revisions_used} / {contract.revisions_included}</span>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Note pour le prestataire</label>
              <textarea
                value={revisionNote}
                onChange={(e) => setRevisionNote(e.target.value)}
                placeholder="Décrivez ce qui doit être modifié…"
                rows={3}
                className="w-full px-3 py-2 rounded-lg border border-border bg-white text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors resize-none text-sm"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRevisionOpen(false)} disabled={requestRevision.isPending}>
              Annuler
            </Button>
            <Button onClick={handleRequestRevision} disabled={requestRevision.isPending} className="gap-2">
              {requestRevision.isPending ? <Loader2 size={14} className="animate-spin" /> : <RotateCcw size={14} />}
              Confirmer la révision
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <DisputeModal
        contractId={contract.id}
        contractTitle={contract.project.title}
        open={disputeOpen}
        onClose={() => setDisputeOpen(false)}
      />
    </motion.div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

const ClientContracts = () => {
  const { data, isLoading } = useContracts();
  const contracts = data?.results ?? [];
  const [payingContract, setPayingContract] = useState<ApiContractList | null>(null);

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
            {contracts.map((contract, index) => (
              <ContractCard
                key={contract.id}
                contract={contract}
                index={index}
                onPay={setPayingContract}
              />
            ))}
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
