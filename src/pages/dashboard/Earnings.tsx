import { useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card } from "@/components/ui/card";
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
  Check,
  Star,
  XCircle,
  Calendar,
  CheckCircle2,
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
import type { ApiSubscriptionPlan } from "@/types";

// ── Helpers ────────────────────────────────────────────────────────────────────

// Canonical tier order: used to sort plans and build cumulative feature sets
const TIER_ORDER: Record<string, number> = {
  FREE: 0,
  PRO: 1,
  PRO_MAX: 2,
  AGENCY: 3,
};

// Detect feature strings that are tier-specific variants of badge/rank,
// so they can be collapsed into one generic row instead of appearing individually.
const isBadgeKey = (k: string) => /badge/i.test(k);
const isRankKey = (k: string) => /classement|rang|rank/i.test(k);

// `features` can be an array of strings OR an object {key: bool}.
// Returns a Set of enabled feature label strings regardless of format.
function getFeatureSet(features: unknown): Set<string> {
  if (!features) return new Set();
  if (Array.isArray(features)) {
    return new Set(
      features
        .map((f) => (typeof f === "string" ? f : String(f)))
        .filter(Boolean),
    );
  }
  if (typeof features === "object") {
    return new Set(
      Object.entries(features as Record<string, unknown>)
        .filter(([, v]) => Boolean(v))
        .map(([k]) => k),
    );
  }
  return new Set();
}

// `limits` is a free-form object in the API spec: try known key names, then fall
// back to the first numeric value found.
function getContactLimit(plan: ApiSubscriptionPlan): number | null {
  const l = plan.limits as Record<string, unknown>;
  if (!l) return null;
  for (const key of [
    "client_contacts_per_month",
    "client_contacts_per_period",
    "client_contacts",
    "contacts_per_month",
    "monthly_contacts",
    "contacts",
  ]) {
    const v = l[key];
    if (typeof v === "number") return v;
    if (typeof v === "string" && !isNaN(Number(v))) return Number(v);
  }
  for (const v of Object.values(l)) {
    if (typeof v === "number") return v;
    if (typeof v === "string" && !isNaN(Number(v))) return Number(v);
  }
  return null;
}

// ── Atoms ──────────────────────────────────────────────────────────────────────

function StarRating({ count }: { count: number }) {
  return (
    <span className="inline-flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <Star key={i} size={13} className="fill-cta text-cta" />
      ))}
    </span>
  );
}

// planIndex: position in the sorted paid-plan list (0 = cheapest, 1 = mid, 2 = top)
function TierBadge({ planIndex }: { planIndex: number }) {
  const base =
    "inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold text-white";
  if (planIndex === 0) return <span className={`${base} bg-cta`}>PRO</span>;
  if (planIndex === 1) return <span className={`${base} bg-cta`}>PRO+</span>;
  return <span className={`${base} bg-orange-700`}>PRO++</span>;
}

const PAYMENT_STATUS_CONFIG: Record<
  string,
  { label: string; className: string }
> = {
  SUCCESS: { label: "Succès", className: "bg-green-100 text-green-700" },
  PENDING: { label: "En attente", className: "bg-orange-100 text-orange-700" },
  FAILED: { label: "Échoué", className: "bg-red-100 text-red-700" },
  REFUNDED: { label: "Remboursé", className: "bg-muted text-muted-foreground" },
};

// ── Plan Card ──────────────────────────────────────────────────────────────────

function PlanCard({
  plan,
  isCurrent,
  onSubscribe,
}: {
  plan: ApiSubscriptionPlan;
  isCurrent: boolean;
  onSubscribe: (plan: ApiSubscriptionPlan) => void;
}) {
  const contactLimit = getContactLimit(plan);
  const price = parseFloat(plan.price);
  const isAnnual = plan.is_annual;
  const periodLabel = isAnnual ? "par an (360 jours)" : "par mois (30 jours)";
  // Dynamic features — works whether the API returns an array or an object
  const extraFeatures = [...getFeatureSet(plan.features)];

  return (
    <div className="flex flex-col">
      {/* Banner slot — same height for every card so all card bodies align */}
      <div className="h-9 flex items-center justify-center mb-2">
        {plan.is_featured && (
          <span className="bg-primary text-white text-[11px] font-semibold px-5 py-1.5 rounded-full whitespace-nowrap">
            Abonnement le plus apprécié des freelances
          </span>
        )}
      </div>

      {/* Card body */}
      <div className="flex flex-col bg-white rounded-xl border border-border overflow-hidden shadow-sm hover:shadow-md transition-shadow flex-1">
        {/* Top accent bar */}
        <div className="h-1.5 w-full bg-primary" />

        <div className="p-5 flex flex-col gap-4 flex-1">
          {/* Plan name */}
          <h3 className="text-base font-bold text-center">{plan.name}</h3>

          {/* Price */}
          <div className="text-center">
            <div className="flex items-baseline justify-center gap-0.5">
              <span className="text-4xl font-extrabold text-cta leading-none">
                {price.toLocaleString("fr-FR")}
              </span>
              <span className="text-base font-bold text-cta ml-1">
                {plan.currency}
              </span>
              <sup className="text-[10px] text-muted-foreground font-normal ml-0.5">
                HT
              </sup>
            </div>
            <p className="text-sm text-muted-foreground mt-1">{periodLabel}</p>
          </div>

          {/* Contact limit box */}
          {contactLimit !== null && (
            <div className="border border-border rounded-xl p-3 text-center">
              <p className="text-sm text-muted-foreground">Contactez jusqu'à</p>
              <p className="text-cta font-bold text-base mt-0.5">
                {contactLimit.toLocaleString("fr-FR")} clients&nbsp;
                {isAnnual ? "/ an" : "/ mois"}
              </p>
            </div>
          )}

          {/* Feature list — purely from plan.features (API data only) */}
          {extraFeatures.length > 0 && (
            <ul className="space-y-2.5 flex-1 text-sm">
              {extraFeatures.map((label) => (
                <li key={label} className="flex items-center gap-2">
                  <Check size={14} className="text-primary flex-shrink-0" />
                  <span className="capitalize">{label.replace(/_/g, " ")}</span>
                </li>
              ))}
            </ul>
          )}

          {/* Annual disclaimer */}
          {isAnnual && (
            <p className="text-xs text-muted-foreground text-center leading-snug italic">
              Les abonnements annuels sont limités aux prestataires avec au
              moins 3 mois d'ancienneté.
            </p>
          )}

          {/* CTA */}
          {isCurrent ? (
            <div className="w-full py-3 rounded-full bg-muted text-center text-sm text-muted-foreground font-medium">
              Plan actuel
            </div>
          ) : (
            <Button
              variant="cta"
              className="w-full rounded-full"
              onClick={() => onSubscribe(plan)}
            >
              S'abonner
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Comparison Table — smart, fully dynamic ────────────────────────────────────

type CellType = "contact_limit" | "badge" | "stars" | "check" | "dash";

interface CompRow {
  label: string;
  freeCell: "check" | "dash";
  cells: CellType[];
}

/**
 * Smart comparison builder — three guarantees:
 *
 * 1. Generic contact row: one row labelled "Nombre de crédits" with the
 *    per-plan count in each cell (no plan-specific quantity in the row label).
 *
 * 2. Cumulative inheritance: plans are expected to arrive sorted by tier
 *    (PRO → PRO_MAX → AGENCY). Each plan's effective feature set is the union
 *    of its own features PLUS all lower-tier plans' features, so a superior
 *    tier can never be missing a feature that an inferior tier has.
 *
 * 3. Quantity labels stripped: feature strings that contain digits (e.g.
 *    "80_credits_per_month") are plan-specific quantities, not generic
 *    capabilities. They are filtered out — the contact row handles counts.
 *
 * Rows are then sorted by prevalence: features all plans share appear first;
 * features exclusive to the highest tier appear last (progressive table).
 */
function buildRows(plans: ApiSubscriptionPlan[]): CompRow[] {
  // 1. Build cumulative feature sets — plan[i] inherits all plans[0..i-1] features
  const cumulativeSets = plans.map((_, i) => {
    const merged = new Set<string>();
    for (let j = 0; j <= i; j++) {
      getFeatureSet(plans[j].features).forEach((k) => merged.add(k));
    }
    return merged;
  });

  // 2. Detect whether any plan's features contain badge/rank variants
  const allKeys = new Set<string>();
  cumulativeSets.forEach((s) => s.forEach((k) => allKeys.add(k)));
  const hasBadgeFeature = [...allKeys].some(isBadgeKey);
  const hasRankFeature = [...allKeys].some(isRankKey);

  // 3. Master feature list — strip:
  //    • quantity labels  (contain digits, e.g. "80_credits_per_month")
  //    • badge variants   (collapsed into one generic "Badge abonné" row)
  //    • rank variants    (collapsed into one generic "Classement Rang" row)
  const master = [
    ...(cumulativeSets[cumulativeSets.length - 1] ?? new Set<string>()),
  ]
    .filter((k) => !/\d/.test(k) && !isBadgeKey(k) && !isRankKey(k))
    .sort((a, b) => {
      const aCount = cumulativeSets.filter((s) => s.has(a)).length;
      const bCount = cumulativeSets.filter((s) => s.has(b)).length;
      return bCount - aCount;
    });

  return [
    // Generic contact/credit row — per-plan count from limits
    {
      label: "Nombre de crédits",
      freeCell: "dash" as const,
      cells: plans.map(() => "contact_limit" as CellType),
    },
    // Generic badge row — tier pill rendered per plan (if badge keys exist in API)
    ...(hasBadgeFeature
      ? [
          {
            label: "Badge abonné",
            freeCell: "dash" as const,
            cells: plans.map(() => "badge" as CellType),
          },
        ]
      : []),
    // Generic rank row — star count rendered per tier (if rank keys exist in API)
    ...(hasRankFeature
      ? [
          {
            label: "Classement Rang",
            freeCell: "dash" as const,
            cells: plans.map(() => "stars" as CellType),
          },
        ]
      : []),
    // Remaining generic feature rows
    ...master.map((key) => ({
      label: key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
      freeCell: "dash" as const,
      cells: cumulativeSets.map((set) =>
        set.has(key) ? "check" : "dash",
      ) as CellType[],
    })),
  ];
}

function TableCell({
  type,
  plan,
  planIndex,
}: {
  type: CellType;
  plan: ApiSubscriptionPlan;
  planIndex: number;
}) {
  if (type === "check")
    return <Check size={16} className="text-primary mx-auto" />;
  if (type === "dash") return <span className="text-muted-foreground">—</span>;
  if (type === "contact_limit") {
    const limit = getContactLimit(plan);
    if (limit === null) return <span className="text-muted-foreground">—</span>;
    return (
      <span className="text-cta text-xs font-medium">
        jusqu'à {limit.toLocaleString("fr-FR")} clients{" "}
        {plan.is_annual ? "par an" : "par mois"}
      </span>
    );
  }
  if (type === "badge") {
    // planIndex 0 → PRO, 1 → PRO+, 2 → PRO++
    return (
      <div className="flex justify-center">
        <TierBadge planIndex={planIndex} />
      </div>
    );
  }
  if (type === "stars") {
    // Stars increase by 1 per tier step: 1st plan = 1★, 2nd = 2★, 3rd = 3★
    const count = planIndex + 1;
    return (
      <div className="flex justify-center">
        <StarRating count={count} />
      </div>
    );
  }
  return <span className="text-muted-foreground">—</span>;
}

function ComparisonTable({
  plans,
  onSubscribe,
  currentPlanId,
}: {
  plans: ApiSubscriptionPlan[];
  onSubscribe: (plan: ApiSubscriptionPlan) => void;
  currentPlanId?: number;
}) {
  const isAnnual = plans[0]?.is_annual ?? false;
  const rows = buildRows(plans);

  return (
    <div className="overflow-x-auto rounded-xl border border-border bg-white">
      <table className="w-full text-sm min-w-[620px]">
        <thead>
          <tr className="border-b border-border">
            <th className="py-6 px-6 text-left font-normal w-48 min-w-[160px]" />
            {/* Free column */}
            <th className="py-6 px-4 text-center min-w-[130px]">
              <span className="text-muted-foreground/60 font-bold text-sm uppercase tracking-wider">
                Compte Gratuit
              </span>
            </th>
            {/* One column per paid plan */}
            {plans.map((plan) => (
              <th key={plan.id} className="py-6 px-4 text-center min-w-[155px]">
                <p className="font-bold text-sm uppercase tracking-wider text-foreground mb-1">
                  {plan.name}
                </p>
                <div className="flex items-baseline justify-center gap-0.5">
                  <span className="text-2xl font-extrabold text-cta leading-none">
                    {parseFloat(plan.price).toLocaleString("fr-FR")}
                  </span>
                  <span className="text-sm font-bold text-cta ml-0.5">
                    {plan.currency}
                  </span>
                  <sup className="text-[9px] text-muted-foreground font-normal ml-0.5">
                    HT
                  </sup>
                </div>
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mt-1">
                  {isAnnual ? "PAR AN (360 JOURS)" : "PAR MOIS (30 JOURS)"}
                </p>
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {rows.map((row, i) => (
            <tr
              key={i}
              className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors"
            >
              <td className="py-3.5 px-6 text-sm text-foreground/80 font-medium">
                {row.label}
              </td>
              {/* Free column */}
              <td className="py-3.5 px-4 text-center">
                {row.freeCell === "check" ? (
                  <Check size={16} className="text-primary mx-auto" />
                ) : (
                  <span className="text-muted-foreground">—</span>
                )}
              </td>
              {/* Per-plan cells — positional */}
              {plans.map((plan, idx) => (
                <td key={plan.id} className="py-3.5 px-4 text-center">
                  <TableCell
                    type={row.cells[idx] ?? "dash"}
                    plan={plan}
                    planIndex={idx}
                  />
                </td>
              ))}
            </tr>
          ))}

          {/* Subscribe row */}
          <tr className="bg-muted/5">
            <td className="py-5 px-6" />
            <td className="py-5 px-4 text-center text-xs text-muted-foreground">
              —
            </td>
            {plans.map((plan) => (
              <td key={plan.id} className="py-5 px-4 text-center">
                {plan.id === currentPlanId ? (
                  <span className="text-xs text-muted-foreground font-medium">
                    Plan actuel
                  </span>
                ) : (
                  <div className="flex flex-col items-center gap-1.5">
                    <Button
                      variant="cta"
                      size="sm"
                      className="rounded-full px-8"
                      onClick={() => onSubscribe(plan)}
                    >
                      S'abonner
                    </Button>
                    <span className="text-[10px] text-muted-foreground">
                      Sans engagement
                    </span>
                  </div>
                )}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}

// ── Historique Section ─────────────────────────────────────────────────────────

function HistoriqueSection({
  usageList,
  usageLoading,
  payments,
  paymentsLoading,
}: {
  usageList: {
    id: number;
    client_contacts_used: number;
    period_start: string;
    period_end: string;
  }[];
  usageLoading: boolean;
  payments: {
    id: number;
    amount: string;
    currency: string;
    status: string;
    status_display: string;
    paid_at: string;
  }[];
  paymentsLoading: boolean;
}) {
  const [tab, setTab] = useState<"usage" | "payments">("payments");

  return (
    <Card className="p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold">Historique</h2>
        <div className="flex items-center bg-muted rounded-full p-1 text-xs">
          {(["payments", "usage"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-3 py-1.5 rounded-full font-medium transition-colors ${
                tab === t
                  ? "bg-white shadow-sm text-foreground"
                  : "text-muted-foreground"
              }`}
            >
              {t === "payments" ? "Paiements" : "Utilisation"}
            </button>
          ))}
        </div>
      </div>

      {tab === "payments" ? (
        paymentsLoading ? (
          <div className="flex items-center gap-2 text-muted-foreground text-sm py-4">
            <Loader2 size={15} className="animate-spin" /> Chargement…
          </div>
        ) : payments.length === 0 ? (
          <p className="text-sm text-muted-foreground py-1">
            Aucun paiement enregistré.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-muted-foreground text-xs">
                  <th className="text-left py-2 pr-4 font-medium">Date</th>
                  <th className="text-left py-2 pr-4 font-medium">Montant</th>
                  <th className="text-left py-2 pr-4 font-medium">Devise</th>
                  <th className="text-left py-2 font-medium">Statut</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((p) => {
                  const cfg = PAYMENT_STATUS_CONFIG[p.status] ?? {
                    label: p.status_display,
                    className: "bg-muted text-muted-foreground",
                  };
                  return (
                    <tr
                      key={p.id}
                      className="border-b last:border-0 hover:bg-muted/30 transition-colors"
                    >
                      <td className="py-2.5 pr-4">
                        {new Date(p.paid_at).toLocaleDateString("fr-FR")}
                      </td>
                      <td className="py-2.5 pr-4 font-medium">
                        {parseFloat(p.amount).toLocaleString("fr-FR")}
                      </td>
                      <td className="py-2.5 pr-4 text-muted-foreground">
                        {p.currency}
                      </td>
                      <td className="py-2.5">
                        <span
                          className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${cfg.className}`}
                        >
                          {cfg.label}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )
      ) : usageLoading ? (
        <div className="flex items-center gap-2 text-muted-foreground text-sm py-4">
          <Loader2 size={15} className="animate-spin" /> Chargement…
        </div>
      ) : usageList.length === 0 ? (
        <p className="text-sm text-muted-foreground py-1">
          Aucune donnée d'utilisation disponible.
        </p>
      ) : (
        <div className="grid sm:grid-cols-2 gap-3">
          {usageList.map((usage) => (
            <div key={usage.id} className="p-4 rounded-xl border bg-muted/20">
              <p className="text-2xl font-bold text-primary">
                {usage.client_contacts_used}
              </p>
              <p className="text-xs text-muted-foreground">
                Contacts clients utilisés
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {new Date(usage.period_start).toLocaleDateString("fr-FR")} —{" "}
                {new Date(usage.period_end).toLocaleDateString("fr-FR")}
              </p>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}

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
        description: "Saisissez votre numéro Mobile Money.",
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
        onSuccess: (response) => {
          alert(JSON.stringify(response))
          if (response?.redirect_url) {
            window.location.href = response.redirect_url;
            toast({ title: "Abonnement initié." });
            handleClose();
          }
        },
        onError: (err) => {
          toast({
            title: "Erreur",
            description:
              err instanceof ApiError
                ? err.message
                : "Une erreur est survenue.",
            variant: "destructive",
          });
        },
      },
    );
  };

  if (!plan) return null;

  return (
    <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>S'abonner — {plan.name}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="p-4 bg-primary/5 rounded-xl border border-primary/15 text-center">
            <p className="text-2xl font-extrabold text-cta">
              {parseFloat(plan.price).toLocaleString("fr-FR")} {plan.currency}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {plan.is_annual ? "par an (360 jours)" : "par mois (30 jours)"}
            </p>
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">
              Numéro de téléphone (Mobile Money)
            </label>
            <Input
              placeholder="ex: 620000000"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              disabled={subscribe.isPending}
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={subscribe.isPending}
          >
            Annuler
          </Button>
          <Button
            variant="cta"
            onClick={handleSubmit}
            disabled={subscribe.isPending}
          >
            {subscribe.isPending && (
              <Loader2 size={15} className="animate-spin mr-1.5" />
            )}
            Confirmer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────────

const Earnings = () => {
  const {
    data: subscription,
    isLoading: subLoading,
    error: subError,
  } = useMySubscription();
  const { data: plansData, isLoading: plansLoading } = useSubscriptionPlans();
  const { data: usageData, isLoading: usageLoading } = useSubscriptionUsage();
  const { data: paymentsData, isLoading: paymentsLoading } =
    useSubscriptionPayments();
  const cancelSub = useCancelSubscription();
  const { toast } = useToast();

  const [billingMode, setBillingMode] = useState<"monthly" | "annual">(
    "monthly",
  );
  const [viewMode, setViewMode] = useState<"cards" | "comparison">("cards");
  const [selectedPlan, setSelectedPlan] = useState<ApiSubscriptionPlan | null>(
    null,
  );
  const [showCancel, setShowCancel] = useState(false);

  const allPlans = plansData?.results ?? [];
  const byTier = (a: ApiSubscriptionPlan, b: ApiSubscriptionPlan) =>
    (TIER_ORDER[a.tier] ?? 99) - (TIER_ORDER[b.tier] ?? 99);
  const monthlyPlans = allPlans
    .filter((p) => !p.is_annual && p.tier !== "FREE")
    .sort(byTier);
  const annualPlans = allPlans
    .filter((p) => p.is_annual && p.tier !== "FREE")
    .sort(byTier);
  const hasAnnual = annualPlans.length > 0;
  const displayPlans =
    billingMode === "annual" && hasAnnual ? annualPlans : monthlyPlans;

  const hasNoSubscription =
    !subLoading &&
    (!subscription || (subError as { status?: number })?.status === 404);
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
          description:
            err instanceof ApiError ? err.message : "Une erreur est survenue.",
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
          <h1 className="text-xl font-bold mb-0.5">Mon Abonnement</h1>
          <p className="text-muted-foreground text-sm">
            Choisissez la formule adaptée à votre activité
          </p>
        </div>

        {/* ── Current subscription card ── */}
        <Card className="p-4">
          <h2 className="text-sm font-semibold mb-3 flex items-center gap-2">
            <CheckCircle2 size={16} className="text-primary" />
            Mon abonnement actuel
          </h2>
          {subLoading ? (
            <div className="flex items-center gap-2 text-muted-foreground text-sm py-2">
              <Loader2 size={15} className="animate-spin" /> Chargement…
            </div>
          ) : hasNoSubscription || !subscription ? (
            <p className="text-sm text-muted-foreground py-1">
              Aucun abonnement actif. Choisissez une formule ci-dessous.
            </p>
          ) : (
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 size={18} className="text-primary" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-sm">
                      {subscription.plan.name}
                    </span>
                    <TierBadge
                      planIndex={Math.max(
                        0,
                        (TIER_ORDER[subscription.plan.tier] ?? 1) - 1,
                      )}
                    />
                    {subscription.is_active ? (
                      <span className="text-xs text-green-700 bg-green-100 px-2 py-0.5 rounded-full font-medium">
                        Actif
                      </span>
                    ) : (
                      <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                        Inactif
                      </span>
                    )}
                    {subscription.is_active && !subscription.auto_renew && (
                      <span className="text-xs text-orange-700 bg-orange-100 px-2 py-0.5 rounded-full font-medium">
                        Résiliation programmée
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-3 flex-wrap">
                    {subscription.end_date && (
                      <span className="flex items-center gap-1">
                        <Calendar size={10} />
                        {subscription.auto_renew ? "Expire le" : "Accès jusqu'au"}{" "}
                        {new Date(subscription.end_date).toLocaleDateString("fr-FR")}
                      </span>
                    )}
                  </p>
                </div>
              </div>
              {subscription.is_active && subscription.auto_renew && (
                <Button
                  variant="outline"
                  size="sm"
                  className="text-destructive border-destructive/40 hover:bg-destructive/5 text-xs"
                  onClick={() => setShowCancel(true)}
                >
                  <XCircle size={13} className="mr-1.5" />
                  Annuler l'abonnement
                </Button>
              )}
            </div>
          )}
        </Card>

        {/* ── Plans section ── */}
        <div className="space-y-4">
          {/* Toggles */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-base font-bold">Choisir votre formule</h2>
            <div className="flex items-center gap-2">
              {hasAnnual && (
                <div className="flex items-center bg-muted rounded-full p-1 text-xs">
                  {(["monthly", "annual"] as const).map((mode) => (
                    <button
                      key={mode}
                      onClick={() => setBillingMode(mode)}
                      className={`px-3 py-1.5 rounded-full font-medium transition-colors ${
                        billingMode === mode
                          ? "bg-white shadow-sm text-foreground"
                          : "text-muted-foreground"
                      }`}
                    >
                      {mode === "monthly" ? "Mensuel" : "Annuel"}
                    </button>
                  ))}
                </div>
              )}
              <div className="flex items-center bg-muted rounded-full p-1 text-xs">
                {(["cards", "comparison"] as const).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setViewMode(mode)}
                    className={`px-3 py-1.5 rounded-full font-medium transition-colors ${
                      viewMode === mode
                        ? "bg-white shadow-sm text-foreground"
                        : "text-muted-foreground"
                    }`}
                  >
                    {mode === "cards" ? "Formules" : "Comparatif"}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Plans content */}
          {plansLoading ? (
            <div className="flex justify-center py-14">
              <Loader2 className="animate-spin text-primary" size={32} />
            </div>
          ) : displayPlans.length === 0 ? (
            <p className="text-center text-muted-foreground py-12 text-sm">
              Aucun plan disponible.
            </p>
          ) : viewMode === "cards" ? (
            <div className="grid md:grid-cols-3 gap-5">
              {displayPlans.map((plan) => (
                <PlanCard
                  key={plan.id}
                  plan={plan}
                  isCurrent={subscription?.plan?.id === plan.id}
                  onSubscribe={setSelectedPlan}
                />
              ))}
            </div>
          ) : (
            <ComparisonTable
              plans={displayPlans}
              onSubscribe={setSelectedPlan}
              currentPlanId={subscription?.plan?.id}
            />
          )}
        </div>

        {/* ── Historique ── */}
        <HistoriqueSection
          usageList={usageList}
          usageLoading={usageLoading}
          payments={payments}
          paymentsLoading={paymentsLoading}
        />
      </div>

      {/* ── Dialogs ── */}
      <SubscribeDialog
        plan={selectedPlan}
        open={selectedPlan !== null}
        onClose={() => setSelectedPlan(null)}
      />

      <AlertDialog open={showCancel} onOpenChange={setShowCancel}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Annuler l'abonnement ?</AlertDialogTitle>
            <AlertDialogDescription>
              Vous conserverez l'accès jusqu'à la fin de la période en cours.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={cancelSub.isPending}>
              Retour
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={handleCancelConfirm}
              disabled={cancelSub.isPending}
            >
              {cancelSub.isPending && (
                <Loader2 size={13} className="animate-spin mr-1.5" />
              )}
              Confirmer l'annulation
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
};

export default Earnings;
