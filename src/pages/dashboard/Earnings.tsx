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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Loader2,
  Star,
  CheckCircle2,
  XCircle,
  CreditCard,
  BarChart2,
  RefreshCw,
  Calendar,
} from "lucide-react";
import {
  useSubscriptionPlans,
  useMySubscription,
  useSubscriptionUsage,
  useSubscriptionPayments,
  useSubscribe,
  useCancelSubscription,
} from "@/hooks/useSubscriptions";
import { useToast } from "@/hooks/use-toast";
import { ApiError } from "@/services/api.service";
import type { ApiSubscriptionPlan, TierEnum } from "@/types";

// ── Tier config ────────────────────────────────────────────────────────────────

const TIER_CONFIG: Record<TierEnum, { label: string; className: string }> = {
  FREE: { label: "Gratuit", className: "bg-muted text-muted-foreground" },
  PRO: { label: "Pro", className: "bg-secondary text-white" },
  PRO_MAX: { label: "Pro Max", className: "bg-primary text-primary-foreground" },
  AGENCY: { label: "Agency", className: "bg-orange-500 text-white" },
};

const PAYMENT_STATUS_CONFIG = {
  SUCCESS: { label: "Succès", className: "bg-green-100 text-green-700" },
  PENDING: { label: "En attente", className: "bg-orange-100 text-orange-700" },
  FAILED: { label: "Échoué", className: "bg-red-100 text-red-700" },
  REFUNDED: { label: "Remboursé", className: "bg-muted text-muted-foreground" },
};

// ── Subscribe Dialog ───────────────────────────────────────────────────────────

function SubscribeDialog({
  plan,
  open,
  onClose,
}: {
  plan: ApiSubscriptionPlan | null;
  open: boolean;
  onClose: () => void;
}) {
  const [phone, setPhone] = useState("");
  const { toast } = useToast();
  const subscribe = useSubscribe();

  const handleClose = () => {
    setPhone("");
    onClose();
  };

  const handleSubmit = () => {
    if (!plan) return;
    if (!phone.trim()) {
      toast({
        title: "Numéro requis",
        description: "Saisissez votre numéro de téléphone Mobile Money.",
        variant: "destructive",
      });
      return;
    }
    const origin = import.meta.env.VITE_APP_URL || window.location.origin;
    subscribe.mutate(
      {
        plan_id: plan.id,
        payer_number: phone.trim(),
        country_code: "GN",
        return_url: `${origin}/dashboard/earnings`,
      },
      {
        onSuccess: () => {
          toast({ title: "Abonnement activé avec succès !" });
          handleClose();
        },
        onError: (err) => {
          toast({
            title: "Erreur",
            description: err instanceof ApiError ? err.message : "Une erreur est survenue.",
            variant: "destructive",
          });
        },
      }
    );
  };

  if (!plan) return null;

  const tierCfg = TIER_CONFIG[plan.tier] ?? TIER_CONFIG.FREE;

  return (
    <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Choisir le plan {plan.name}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center justify-between mb-1">
              <span className="font-semibold">{plan.name}</span>
              <Badge className={tierCfg.className}>{tierCfg.label}</Badge>
            </div>
            <p className="text-2xl font-bold">
              {parseFloat(plan.price).toLocaleString("fr-FR")} {plan.currency}
              <span className="text-sm font-normal text-muted-foreground">
                {" "}/ {plan.duration_months} mois
              </span>
            </p>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium">Numéro de téléphone (Mobile Money)</label>
            <Input
              placeholder="ex: 620000000"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              disabled={subscribe.isPending}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={subscribe.isPending}>
            Annuler
          </Button>
          <Button onClick={handleSubmit} disabled={subscribe.isPending}>
            {subscribe.isPending && <Loader2 size={16} className="animate-spin mr-2" />}
            Confirmer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ── Plans Grid Dialog ──────────────────────────────────────────────────────────

function PlansGridDialog({
  open,
  onClose,
  currentPlanId,
  onSelectPlan,
}: {
  open: boolean;
  onClose: () => void;
  currentPlanId: number | undefined;
  onSelectPlan: (plan: ApiSubscriptionPlan) => void;
}) {
  const { data: plansData, isLoading } = useSubscriptionPlans();
  const plans = plansData?.results ?? [];

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Choisir un plan</DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="animate-spin text-primary" size={32} />
          </div>
        ) : plans.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">Aucun plan disponible.</p>
        ) : (
          <div className="grid sm:grid-cols-2 gap-4 mt-2">
            {plans.map((plan) => {
              const tierCfg = TIER_CONFIG[plan.tier] ?? TIER_CONFIG.FREE;
              const isCurrent = plan.id === currentPlanId;
              const features = Object.keys(plan.features);

              return (
                <div
                  key={plan.id}
                  className={`relative rounded-xl border p-5 flex flex-col gap-3 transition-colors ${
                    plan.is_featured ? "border-primary bg-primary/5" : "bg-muted/20"
                  }`}
                >
                  {plan.is_featured && (
                    <div className="absolute -top-2.5 left-4">
                      <span className="flex items-center gap-1 text-xs font-medium bg-primary text-primary-foreground px-2 py-0.5 rounded-full">
                        <Star size={10} /> Recommandé
                      </span>
                    </div>
                  )}

                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-semibold">{plan.name}</h3>
                      {plan.description && (
                        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                          {plan.description}
                        </p>
                      )}
                    </div>
                    <Badge className={`flex-shrink-0 ${tierCfg.className}`}>{tierCfg.label}</Badge>
                  </div>

                  <p className="text-xl font-bold">
                    {parseFloat(plan.price).toLocaleString("fr-FR")} {plan.currency}
                    <span className="text-sm font-normal text-muted-foreground">
                      {" "}/ {plan.duration_months} mois
                    </span>
                  </p>

                  {features.length > 0 && (
                    <ul className="space-y-1 text-xs text-muted-foreground">
                      {features.slice(0, 4).map((f) => (
                        <li key={f} className="flex items-center gap-1.5">
                          <CheckCircle2 size={12} className="text-primary flex-shrink-0" />
                          {f}
                        </li>
                      ))}
                    </ul>
                  )}

                  {isCurrent ? (
                    <Badge variant="outline" className="w-fit mt-auto">Plan actuel</Badge>
                  ) : (
                    <Button
                      size="sm"
                      className="mt-auto"
                      onClick={() => onSelectPlan(plan)}
                    >
                      Choisir ce plan
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────────

const Earnings = () => {
  const { data: subscription, isLoading: subLoading, error: subError } = useMySubscription();
  const { data: usageData, isLoading: usageLoading } = useSubscriptionUsage();
  const { data: paymentsData, isLoading: paymentsLoading } = useSubscriptionPayments();
  const cancelSub = useCancelSubscription();
  const { toast } = useToast();

  const [showPlans, setShowPlans] = useState(false);
  const [showCancel, setShowCancel] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<ApiSubscriptionPlan | null>(null);

  const hasNoSubscription = !subLoading && (!subscription || (subError as { status?: number })?.status === 404);
  const usageList = usageData?.results ?? [];
  const payments = paymentsData?.results ?? [];

  const handleCancelConfirm = () => {
    cancelSub.mutate(undefined, {
      onSuccess: () => {
        toast({ title: "Abonnement annulé." });
        setShowCancel(false);
      },
      onError: (err) => {
        toast({
          title: "Erreur",
          description: err instanceof ApiError ? err.message : "Une erreur est survenue.",
          variant: "destructive",
        });
        setShowCancel(false);
      },
    });
  };

  return (
    <DashboardLayout userType="freelancer">
      <div className="space-y-6">

        {/* ── Page header ── */}
        <div>
          <h1 className="text-2xl font-bold mb-1">Mon Abonnement</h1>
          <p className="text-muted-foreground text-sm">Gérez votre plan et consultez vos paiements</p>
        </div>

        {/* ── Section A: Current Plan ── */}
        <Card className="p-6">
          <h2 className="text-base font-semibold mb-4 flex items-center gap-2">
            <CreditCard size={18} className="text-primary" />
            Plan actuel
          </h2>

          {subLoading ? (
            <div className="flex items-center gap-2 text-muted-foreground text-sm py-4">
              <Loader2 size={18} className="animate-spin" />
              Chargement…
            </div>
          ) : hasNoSubscription ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">Vous n'avez pas d'abonnement actif.</p>
              <Button onClick={() => setShowPlans(true)}>Voir les plans disponibles</Button>
            </div>
          ) : subscription ? (
            <div className="space-y-4">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg font-bold">{subscription.plan.name}</span>
                    {(() => {
                      const cfg = TIER_CONFIG[subscription.plan.tier] ?? TIER_CONFIG.FREE;
                      return <Badge className={cfg.className}>{cfg.label}</Badge>;
                    })()}
                    {subscription.is_active ? (
                      <Badge className="bg-green-100 text-green-700">Actif</Badge>
                    ) : (
                      <Badge variant="outline">Inactif</Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{subscription.status_display}</p>
                </div>

                <div className="flex gap-2 flex-shrink-0">
                  <Button variant="outline" size="sm" onClick={() => setShowPlans(true)}>
                    <RefreshCw size={14} className="mr-1.5" />
                    Changer de plan
                  </Button>
                  {subscription.is_active && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-destructive border-destructive/40 hover:bg-destructive/10"
                      onClick={() => setShowCancel(true)}
                    >
                      <XCircle size={14} className="mr-1.5" />
                      Annuler
                    </Button>
                  )}
                </div>
              </div>

              <div className="grid sm:grid-cols-3 gap-4 text-sm">
                {subscription.start_date && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar size={14} className="flex-shrink-0" />
                    <div>
                      <p className="text-xs">Début</p>
                      <p className="font-medium text-foreground">
                        {new Date(subscription.start_date).toLocaleDateString("fr-FR")}
                      </p>
                    </div>
                  </div>
                )}
                {subscription.end_date && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar size={14} className="flex-shrink-0" />
                    <div>
                      <p className="text-xs">Expiration</p>
                      <p className="font-medium text-foreground">
                        {new Date(subscription.end_date).toLocaleDateString("fr-FR")}
                      </p>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-2 text-muted-foreground">
                  <RefreshCw size={14} className="flex-shrink-0" />
                  <div>
                    <p className="text-xs">Renouvellement auto</p>
                    <p className="font-medium text-foreground">
                      {subscription.auto_renew ? "Activé" : "Désactivé"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </Card>

        {/* ── Section C: Usage Stats ── */}
        {usageList.length > 0 && (
          <Card className="p-6">
            <h2 className="text-base font-semibold mb-4 flex items-center gap-2">
              <BarChart2 size={18} className="text-primary" />
              Utilisation
            </h2>

            {usageLoading ? (
              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <Loader2 size={16} className="animate-spin" />
                Chargement…
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-4">
                {usageList.map((usage) => (
                  <div key={usage.id} className="p-4 rounded-lg border bg-muted/20">
                    <p className="text-2xl font-bold text-primary">{usage.client_contacts_used}</p>
                    <p className="text-sm text-muted-foreground">Contacts clients utilisés</p>
                    <p className="text-xs text-muted-foreground mt-2">
                      Période : {new Date(usage.period_start).toLocaleDateString("fr-FR")} —{" "}
                      {new Date(usage.period_end).toLocaleDateString("fr-FR")}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </Card>
        )}

        {/* ── Section D: Payment History ── */}
        <Card className="p-6">
          <h2 className="text-base font-semibold mb-4 flex items-center gap-2">
            <CheckCircle2 size={18} className="text-primary" />
            Historique des paiements
          </h2>

          {paymentsLoading ? (
            <div className="flex items-center gap-2 text-muted-foreground text-sm py-4">
              <Loader2 size={16} className="animate-spin" />
              Chargement…
            </div>
          ) : payments.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              Aucun paiement enregistré.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-muted-foreground">
                    <th className="text-left py-2 pr-4 font-medium">Date</th>
                    <th className="text-left py-2 pr-4 font-medium">Montant</th>
                    <th className="text-left py-2 pr-4 font-medium">Devise</th>
                    <th className="text-left py-2 font-medium">Statut</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((payment) => {
                    const statusCfg = PAYMENT_STATUS_CONFIG[payment.status] ?? {
                      label: payment.status_display,
                      className: "bg-muted text-muted-foreground",
                    };
                    return (
                      <tr key={payment.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                        <td className="py-3 pr-4">
                          {new Date(payment.paid_at).toLocaleDateString("fr-FR")}
                        </td>
                        <td className="py-3 pr-4 font-medium">
                          {parseFloat(payment.amount).toLocaleString("fr-FR")}
                        </td>
                        <td className="py-3 pr-4 text-muted-foreground">{payment.currency}</td>
                        <td className="py-3">
                          <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${statusCfg.className}`}>
                            {statusCfg.label}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>

      {/* ── Plans Grid Dialog ── */}
      <PlansGridDialog
        open={showPlans}
        onClose={() => setShowPlans(false)}
        currentPlanId={subscription?.plan?.id}
        onSelectPlan={(plan) => {
          setShowPlans(false);
          setSelectedPlan(plan);
        }}
      />

      {/* ── Subscribe Dialog ── */}
      <SubscribeDialog
        plan={selectedPlan}
        open={selectedPlan !== null}
        onClose={() => setSelectedPlan(null)}
      />

      {/* ── Cancel Confirm ── */}
      <AlertDialog open={showCancel} onOpenChange={setShowCancel}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Annuler l'abonnement ?</AlertDialogTitle>
            <AlertDialogDescription>
              Votre abonnement sera annulé. Vous conservez l'accès jusqu'à la fin de la période en cours.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={cancelSub.isPending}>Retour</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={handleCancelConfirm}
              disabled={cancelSub.isPending}
            >
              {cancelSub.isPending && <Loader2 size={14} className="animate-spin mr-2" />}
              Confirmer l'annulation
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
};

export default Earnings;
