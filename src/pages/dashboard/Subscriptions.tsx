import { useState } from "react";
import { motion } from "framer-motion";
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
  CheckCircle2,
  Crown,
  Zap,
  Star,
  Building2,
  CreditCard,
  XCircle,
  AlertCircle,
} from "lucide-react";
import {
  useSubscriptionPlans,
  useMySubscription,
  useSubscriptionUsage,
  useSubscribe,
  useCancelSubscription,
} from "@/hooks/useSubscriptions";
import { useToast } from "@/hooks/use-toast";
import type { ApiSubscriptionPlan } from "@/types";

// ── Tier icons & colors ───────────────────────────────────────────────────────

const tierConfig: Record<string, { icon: React.ElementType; color: string; bg: string }> = {
  FREE:    { icon: Star,      color: "text-muted-foreground", bg: "bg-muted/50" },
  PRO:     { icon: Zap,       color: "text-blue-600",         bg: "bg-blue-50" },
  PRO_MAX: { icon: Crown,     color: "text-primary",          bg: "bg-primary/10" },
  AGENCY:  { icon: Building2, color: "text-purple-600",       bg: "bg-purple-50" },
};

// ── Subscribe Dialog ──────────────────────────────────────────────────────────

function SubscribeDialog({
  plan,
  open,
  onClose,
}: {
  plan: ApiSubscriptionPlan;
  open: boolean;
  onClose: () => void;
}) {
  const [phone, setPhone] = useState("");
  const { toast } = useToast();
  const subscribe = useSubscribe();

  const handleSubscribe = () => {
    if (!phone.trim()) {
      toast({ title: "Numéro requis", description: "Saisissez votre numéro Mobile Money.", variant: "destructive" });
      return;
    }
    const origin = import.meta.env.VITE_APP_URL || window.location.origin;
    subscribe.mutate(
      {
        plan_id: plan.id,
        payer_number: phone.trim(),
        country_code: "GN",
        return_url: `${origin}/dashboard/subscription`,
        cancel_url: `${origin}/dashboard/subscription`,
        allowed_payment_methods: ["OM", "MOMO", "SOUTRA_MONEY", "PAYCARD", "CARD"],
        description: `Abonnement ${plan.name}`,
      },
      {
        onSuccess: (res) => {
          const redirectUrl = res.data?.redirect_url;
          if (redirectUrl) {
            window.location.assign(redirectUrl);
          } else {
            toast({ title: "Abonnement initié", description: "Vérifiez votre téléphone pour confirmer le paiement." });
            onClose();
          }
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

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>S'abonner au plan {plan.name}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="p-3 bg-muted/50 rounded-lg text-sm">
            <p className="text-muted-foreground mb-0.5">Montant</p>
            <p className="text-2xl font-bold">
              {parseFloat(plan.price).toLocaleString("fr-FR")} {plan.currency}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {plan.is_annual ? "Annuel" : `${plan.duration_months} mois`}
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
          <Button variant="outline" onClick={onClose} disabled={subscribe.isPending}>
            Annuler
          </Button>
          <Button onClick={handleSubscribe} disabled={subscribe.isPending} className="gap-2">
            {subscribe.isPending ? <Loader2 size={14} className="animate-spin" /> : <CreditCard size={14} />}
            Payer via Djomy
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ── Plan Card ─────────────────────────────────────────────────────────────────

function PlanCard({
  plan,
  isCurrentPlan,
  onSubscribe,
  index,
}: {
  plan: ApiSubscriptionPlan;
  isCurrentPlan: boolean;
  onSubscribe: (plan: ApiSubscriptionPlan) => void;
  index: number;
}) {
  const tc = tierConfig[plan.tier] ?? tierConfig.FREE;
  const Icon = tc.icon;

  const features = Object.entries(plan.features).filter(([, v]) => Boolean(v));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
    >
      <Card className={`p-6 relative flex flex-col h-full ${plan.is_featured ? "ring-2 ring-primary" : ""}`}>
        {plan.is_featured && (
          <div className="absolute -top-3 left-1/2 -translate-x-1/2">
            <span className="bg-primary text-white text-xs font-semibold px-3 py-1 rounded-full">
              Recommandé
            </span>
          </div>
        )}

        <div className="flex items-center gap-3 mb-4">
          <div className={`p-2.5 rounded-xl ${tc.bg}`}>
            <Icon size={22} className={tc.color} />
          </div>
          <div>
            <h3 className="font-bold text-lg leading-tight">{plan.name}</h3>
            <p className="text-xs text-muted-foreground">{plan.is_annual ? "Annuel" : `${plan.duration_months} mois`}</p>
          </div>
          {isCurrentPlan && (
            <Badge className="ml-auto bg-primary text-white">Actif</Badge>
          )}
        </div>

        <div className="mb-4">
          <span className="text-3xl font-extrabold">
            {parseFloat(plan.price).toLocaleString("fr-FR")}
          </span>
          <span className="text-sm text-muted-foreground ml-1">{plan.currency}</span>
        </div>

        {plan.description && (
          <p className="text-sm text-muted-foreground mb-4">{plan.description}</p>
        )}

        {features.length > 0 && (
          <ul className="space-y-1.5 mb-6 flex-1">
            {features.map(([key]) => (
              <li key={key} className="flex items-center gap-2 text-sm">
                <CheckCircle2 size={14} className="text-primary flex-shrink-0" />
                <span className="capitalize">{key.replace(/_/g, " ")}</span>
              </li>
            ))}
          </ul>
        )}

        <Button
          className="w-full mt-auto"
          variant={isCurrentPlan ? "outline" : "default"}
          disabled={isCurrentPlan || plan.tier === "FREE"}
          onClick={() => !isCurrentPlan && plan.tier !== "FREE" && onSubscribe(plan)}
        >
          {isCurrentPlan ? "Plan actuel" : plan.tier === "FREE" ? "Gratuit" : "Choisir ce plan"}
        </Button>
      </Card>
    </motion.div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

const Subscriptions = () => {
  const { toast } = useToast();
  const [selectedPlan, setSelectedPlan] = useState<ApiSubscriptionPlan | null>(null);

  const { data: plansData, isLoading: plansLoading } = useSubscriptionPlans();
  const { data: subscription, isLoading: subLoading } = useMySubscription();
  const { data: usageData } = useSubscriptionUsage();
  const cancelSubscription = useCancelSubscription();

  const plans = plansData?.results ?? [];
  const usage = usageData?.results?.[0];
  const currentPlanId = subscription?.plan?.id;

  const handleCancel = () => {
    if (!confirm("Êtes-vous sûr de vouloir annuler votre abonnement ?")) return;
    cancelSubscription.mutate(undefined, {
      onSuccess: () => toast({ title: "Abonnement annulé", description: "Votre abonnement a été annulé." }),
      onError: (err) => toast({ title: "Erreur", description: err instanceof Error ? err.message : "Une erreur est survenue.", variant: "destructive" }),
    });
  };

  return (
    <DashboardLayout userType="freelancer">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Abonnement</h1>
          <p className="text-muted-foreground">Gérez votre abonnement et accédez aux fonctionnalités premium</p>
        </div>

        {/* Current subscription status */}
        {!subLoading && subscription && subscription.is_active && (
          <Card className="p-6">
            <div className="flex items-start justify-between flex-wrap gap-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Abonnement actuel</p>
                <h2 className="text-2xl font-bold mb-1">{subscription.plan.name}</h2>
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge className="bg-primary text-white">{subscription.status_display}</Badge>
                  {subscription.current_period_end && (
                    <span className="text-sm text-muted-foreground">
                      Expire le {new Date(subscription.current_period_end).toLocaleDateString("fr-FR")}
                    </span>
                  )}
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="gap-2 text-destructive border-destructive hover:bg-destructive hover:text-white"
                onClick={handleCancel}
                disabled={cancelSubscription.isPending}
              >
                {cancelSubscription.isPending ? <Loader2 size={14} className="animate-spin" /> : <XCircle size={14} />}
                Annuler l'abonnement
              </Button>
            </div>

            {/* Credits usage */}
            {usage && (
              <div className="grid sm:grid-cols-3 gap-4 mt-4 pt-4 border-t border-border">
                <div>
                  <p className="text-xs text-muted-foreground mb-0.5">Crédits utilisés</p>
                  <p className="text-xl font-bold">{usage.credits_used}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-0.5">Crédits restants</p>
                  <p className="text-xl font-bold text-primary">{usage.credits_remaining}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-0.5">Limite mensuelle</p>
                  <p className="text-xl font-bold">{usage.credits_limit}</p>
                </div>
              </div>
            )}

            {/* Credit snapshot */}
            {subscription.credit_snapshot && (
              <div className="mt-3 p-3 bg-muted/50 rounded-lg text-sm flex items-center gap-2">
                <AlertCircle size={14} className="text-muted-foreground flex-shrink-0" />
                <span className="text-muted-foreground">
                  Ce mois : <strong>{subscription.credit_snapshot.monthly_used}</strong> / {subscription.credit_snapshot.monthly_limit} propositions utilisées
                </span>
              </div>
            )}
          </Card>
        )}

        {/* No active subscription notice */}
        {!subLoading && (!subscription || !subscription.is_active) && (
          <Card className="p-6 border-orange-200 bg-orange-50">
            <div className="flex items-center gap-3">
              <AlertCircle size={20} className="text-orange-500 flex-shrink-0" />
              <div>
                <p className="font-semibold text-orange-800">Aucun abonnement actif</p>
                <p className="text-sm text-orange-700 mt-0.5">
                  Un abonnement actif est requis pour soumettre des propositions.
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* Plans */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Choisir un plan</h2>
          {plansLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="animate-spin text-primary" size={40} />
            </div>
          ) : plans.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">Aucun plan disponible pour le moment.</p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {plans.map((plan, i) => (
                <PlanCard
                  key={plan.id}
                  plan={plan}
                  isCurrentPlan={plan.id === currentPlanId && (subscription?.is_active ?? false)}
                  onSubscribe={setSelectedPlan}
                  index={i}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {selectedPlan && (
        <SubscribeDialog
          plan={selectedPlan}
          open={!!selectedPlan}
          onClose={() => setSelectedPlan(null)}
        />
      )}
    </DashboardLayout>
  );
};

export default Subscriptions;
