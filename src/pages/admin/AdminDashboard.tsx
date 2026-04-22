import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Users,
  Briefcase,
  CreditCard,
  AlertTriangle,
  Crown,
  FileText,
  ArrowUpRight,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Shield,
  Ban,
  UserX,
  UserCheck,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  LayoutDashboard,
  ClipboardList,
  Wallet,
  CheckCircle2,
  XCircle,
  Clock,
  Activity,
  ArrowRight,
  Home,
  ChevronDown,
  Sparkles,
  Scale,
  FileCheck2,
  Trophy,
} from "lucide-react";
import { ROUTES } from "@/constants/routes";
import {
  useAdminStats,
  useAuditLogs,
  useSuspendUser,
  useUnsuspendUser,
  useBanUser,
  useUnbanUser,
  useResolveDispute,
  useAdminKycPending,
  useAdminKycReview,
  useAdminDisputeList,
  useAdminCompleteContract,
  useAdminCancelContract,
  useAdminRankingRecalculate,
  useAdminRankingSnapshot,
  useAdminRankingAdjust,
  type AuditLogFilters,
} from "@/hooks/useAdmin";
import { useAdminPendingWithdrawals } from "@/hooks/useWallet";
import { useToast } from "@/hooks/use-toast";
import { ApiError } from "@/services/api.service";

// ── Helpers ────────────────────────────────────────────────────────────────────

function fmt(n: number) {
  return n.toLocaleString("fr-FR");
}

// ── KPI Card ───────────────────────────────────────────────────────────────────

interface KpiCardProps {
  label: string;
  value: string | number;
  sub?: string;
  icon: React.ElementType;
  gradient: string;
  iconBg: string;
  trend?: "up" | "down" | "neutral";
  index: number;
}

function KpiCard({
  label,
  value,
  sub,
  icon: Icon,
  gradient,
  iconBg,
  trend,
  index,
}: KpiCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, ease: "easeOut" }}
    >
      <div
        className={`relative overflow-hidden rounded-2xl p-5 ${gradient} shadow-sm border border-white/20`}
      >
        {/* Decorative circle */}
        <div className="absolute -top-4 -right-4 w-24 h-24 rounded-full bg-white/10 pointer-events-none" />
        <div className="absolute -bottom-6 -right-2 w-16 h-16 rounded-full bg-white/5 pointer-events-none" />

        <div className="relative flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold uppercase tracking-widest text-white/70 mb-2">
              {label}
            </p>
            <p className="text-3xl font-extrabold text-white leading-none">{value}</p>
            {sub && (
              <p className="text-xs text-white/60 mt-2 flex items-center gap-1">
                {trend === "up" && <TrendingUp size={11} className="text-emerald-300" />}
                {trend === "down" && <TrendingDown size={11} className="text-red-300" />}
                {sub}
              </p>
            )}
          </div>
          <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${iconBg}`}>
            <Icon size={20} className="text-white" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ── Stat Row (detail card) ─────────────────────────────────────────────────────

function StatRow({
  label,
  value,
  highlight,
}: {
  label: string;
  value: React.ReactNode;
  highlight?: "success" | "danger" | "warning" | "muted";
}) {
  const vc: Record<string, string> = {
    success: "text-emerald-600 font-bold",
    danger: "text-red-500 font-bold",
    warning: "text-amber-500 font-bold",
    muted: "text-muted-foreground",
  };
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-border/50 last:border-0">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className={`text-sm font-semibold ${highlight ? vc[highlight] : ""}`}>{value}</span>
    </div>
  );
}

// ── Section Card ───────────────────────────────────────────────────────────────

function SectionCard({
  title,
  icon: Icon,
  children,
  action,
}: {
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <Card className="overflow-hidden">
      <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-border/50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <Icon size={15} className="text-primary" />
          </div>
          <h3 className="font-semibold text-sm">{title}</h3>
        </div>
        {action}
      </div>
      <div className="p-5">{children}</div>
    </Card>
  );
}

// ── User Action Dialog ─────────────────────────────────────────────────────────

type ActionType = "suspend" | "unsuspend" | "ban" | "unban";

function UserActionDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const [userId, setUserId] = useState("");
  const [action, setAction] = useState<ActionType>("suspend");
  const [reason, setReason] = useState("");
  const [until, setUntil] = useState("");
  const [error, setError] = useState("");

  const suspend = useSuspendUser();
  const unsuspend = useUnsuspendUser();
  const ban = useBanUser();
  const unban = useUnbanUser();
  const { toast } = useToast();

  const isPending =
    suspend.isPending || unsuspend.isPending || ban.isPending || unban.isPending;

  const reset = () => {
    setUserId("");
    setReason("");
    setUntil("");
    setError("");
  };

  const handleClose = () => {
    reset();
    onOpenChange(false);
  };

  const handleSubmit = async () => {
    setError("");
    const id = parseInt(userId, 10);
    if (!userId || isNaN(id)) {
      setError("ID utilisateur invalide.");
      return;
    }
    if ((action === "suspend" || action === "ban") && !reason.trim()) {
      setError("La raison est obligatoire.");
      return;
    }
    if (action === "suspend" && !until) {
      setError("La date de fin de suspension est obligatoire.");
      return;
    }

    try {
      if (action === "suspend") {
        await suspend.mutateAsync({ userId: id, reason: reason.trim(), until });
        toast({ title: "Utilisateur suspendu." });
      } else if (action === "unsuspend") {
        await unsuspend.mutateAsync(id);
        toast({ title: "Suspension levée." });
      } else if (action === "ban") {
        await ban.mutateAsync({ userId: id, reason: reason.trim() });
        toast({ title: "Utilisateur banni." });
      } else {
        await unban.mutateAsync(id);
        toast({ title: "Bannissement levé." });
      }
      handleClose();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Une erreur est survenue.");
    }
  };

  const needsReason = action === "suspend" || action === "ban";
  const needsUntil = action === "suspend";

  const actionConfig: Record<ActionType, { label: string; color: string; icon: React.ElementType }> = {
    suspend: { label: "Suspendre", color: "bg-amber-50 text-amber-700 border-amber-200", icon: Clock },
    unsuspend: { label: "Lever la suspension", color: "bg-emerald-50 text-emerald-700 border-emerald-200", icon: UserCheck },
    ban: { label: "Bannir", color: "bg-red-50 text-red-700 border-red-200", icon: Ban },
    unban: { label: "Débannir", color: "bg-blue-50 text-blue-700 border-blue-200", icon: UserCheck },
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Shield size={15} className="text-primary" />
            </div>
            Modération utilisateur
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-1">
          <div className="space-y-1.5">
            <Label htmlFor="ua-userid" className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              ID utilisateur *
            </Label>
            <Input
              id="ua-userid"
              type="number"
              placeholder="Ex: 42"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              className="h-10"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Action *
            </Label>
            <Select value={action} onValueChange={(v) => setAction(v as ActionType)}>
              <SelectTrigger className="h-10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(Object.entries(actionConfig) as [ActionType, typeof actionConfig[ActionType]][]).map(([key, cfg]) => {
                  const Ic = cfg.icon;
                  return (
                    <SelectItem key={key} value={key}>
                      <div className="flex items-center gap-2">
                        <Ic size={13} />
                        {cfg.label}
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          {/* Preview badge */}
          <div className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border font-medium ${actionConfig[action].color}`}>
            {action === "suspend" && <Clock size={11} />}
            {action === "ban" && <Ban size={11} />}
            {(action === "unsuspend" || action === "unban") && <CheckCircle2 size={11} />}
            Action sélectionnée : {actionConfig[action].label}
          </div>

          {needsReason && (
            <div className="space-y-1.5">
              <Label htmlFor="ua-reason" className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Raison *
              </Label>
              <Textarea
                id="ua-reason"
                rows={3}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Motif de la sanction…"
                className="resize-none"
              />
            </div>
          )}

          {needsUntil && (
            <div className="space-y-1.5">
              <Label htmlFor="ua-until" className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Fin de suspension *
              </Label>
              <Input
                id="ua-until"
                type="datetime-local"
                value={until}
                onChange={(e) => setUntil(e.target.value)}
                className="h-10"
              />
            </div>
          )}

          {error && (
            <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/5 border border-destructive/20 rounded-lg px-3 py-2">
              <XCircle size={14} />
              {error}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={isPending}>
            Annuler
          </Button>
          <Button onClick={handleSubmit} disabled={isPending} className="gap-2">
            {isPending ? <Loader2 size={14} className="animate-spin" /> : <Shield size={14} />}
            Confirmer l'action
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ── Audit Log action config ────────────────────────────────────────────────────

const ACTION_META: Record<
  string,
  { label: string; color: string; icon: React.ElementType }
> = {
  USER_SUSPENDED: { label: "Suspension", color: "bg-amber-100 text-amber-700", icon: Clock },
  USER_UNSUSPENDED: { label: "Levée suspension", color: "bg-emerald-100 text-emerald-700", icon: UserCheck },
  USER_BANNED: { label: "Bannissement", color: "bg-red-100 text-red-700", icon: Ban },
  USER_UNBANNED: { label: "Débannissement", color: "bg-blue-100 text-blue-700", icon: UserCheck },
  KYC_APPROVED: { label: "KYC approuvé", color: "bg-emerald-100 text-emerald-700", icon: CheckCircle2 },
  KYC_REJECTED: { label: "KYC rejeté", color: "bg-red-100 text-red-700", icon: XCircle },
  PAYMENT_RELEASED: { label: "Paiement libéré", color: "bg-primary/10 text-primary", icon: CreditCard },
  DISPUTE_RESOLVED: { label: "Litige résolu", color: "bg-emerald-100 text-emerald-700", icon: CheckCircle2 },
  WITHDRAWAL_APPROVED: { label: "Retrait approuvé", color: "bg-emerald-100 text-emerald-700", icon: Wallet },
  WITHDRAWAL_REJECTED: { label: "Retrait rejeté", color: "bg-red-100 text-red-700", icon: XCircle },
};

const DEFAULT_ACTION_META = {
  label: "Action",
  color: "bg-muted text-muted-foreground",
  icon: Activity,
};

// ── Audit Logs Tab ─────────────────────────────────────────────────────────────

function AuditLogsTab() {
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<AuditLogFilters>({});
  const [actionFilter, setActionFilter] = useState("__all__");
  const { data, isLoading, isFetching } = useAuditLogs({ ...filters, page });

  const logs = data?.results ?? [];
  const totalPages = data ? Math.ceil(data.count / 20) : 0;

  const handleActionFilter = (v: string) => {
    setActionFilter(v);
    setFilters((f) => ({ ...f, action: v === "__all__" ? undefined : v }));
    setPage(1);
  };

  return (
    <div className="space-y-4">
      {/* Filter bar */}
      <div className="flex items-center gap-3 flex-wrap">
        <Select value={actionFilter} onValueChange={handleActionFilter}>
          <SelectTrigger className="w-[220px] h-9 text-sm bg-background">
            <SelectValue placeholder="Toutes les actions" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__all__">Toutes les actions</SelectItem>
            {Object.entries(ACTION_META).map(([k, v]) => (
              <SelectItem key={k} value={k}>{v.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {isFetching && <Loader2 size={15} className="animate-spin text-muted-foreground" />}
        <span className="text-xs text-muted-foreground ml-auto">
          {data ? `${data.count} entrée${data.count !== 1 ? "s" : ""}` : ""}
        </span>
      </div>

      {/* Timeline */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="animate-spin text-primary" size={28} />
        </div>
      ) : logs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-14 text-muted-foreground">
          <ClipboardList size={32} className="mb-3 opacity-40" />
          <p className="text-sm">Aucun log d'audit pour ce filtre.</p>
        </div>
      ) : (
        <div className="relative pl-5">
          {/* vertical line */}
          <div className="absolute left-0 top-2 bottom-2 w-px bg-border" />

          <div className="space-y-0">
            {logs.map((log, i) => {
              const meta = ACTION_META[log.action] ?? DEFAULT_ACTION_META;
              const LogIcon = meta.icon;
              return (
                <motion.div
                  key={log.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="relative flex items-start gap-3 py-3 group"
                >
                  {/* dot */}
                  <div className={`absolute -left-[18px] top-4 w-3 h-3 rounded-full border-2 border-background ring-2 ring-border group-hover:ring-primary/40 transition-all flex items-center justify-center ${meta.color.replace("text-", "bg-").split(" ")[0]}`} />

                  <div className="flex-1 min-w-0 bg-background rounded-xl border border-border/60 px-4 py-3 hover:border-primary/30 hover:shadow-sm transition-all">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <div className="flex items-center gap-2">
                        <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full ${meta.color}`}>
                          <LogIcon size={10} />
                          {meta.label}
                        </span>
                        {log.resource_type && (
                          <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4">
                            {log.resource_type}
                          </Badge>
                        )}
                      </div>
                      <span className="text-[11px] text-muted-foreground flex-shrink-0">
                        {new Date(log.created_at).toLocaleDateString("fr-FR", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Par{" "}
                      <span className="font-medium text-foreground">
                        {log.username ?? `user#${log.user}`}
                      </span>
                      {log.resource_id && (
                        <span> · Ressource <span className="font-medium text-foreground">#{log.resource_id}</span></span>
                      )}
                      {log.ip_address && (
                        <span className="ml-2 bg-muted px-1.5 py-0.5 rounded text-[10px]">{log.ip_address}</span>
                      )}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-2 border-t border-border">
          <p className="text-xs text-muted-foreground">
            Page {page} / {totalPages}
          </p>
          <div className="flex gap-1">
            <Button
              variant="outline"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => setPage((p) => p - 1)}
              disabled={page === 1 || isFetching}
            >
              <ChevronLeft size={14} />
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => setPage((p) => p + 1)}
              disabled={page >= totalPages || isFetching}
            >
              <ChevronRight size={14} />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Quick Action Card ──────────────────────────────────────────────────────────

function QuickActionCard({
  title,
  description,
  icon: Icon,
  badge,
  badgeColor,
  onClick,
  href,
  index,
}: {
  title: string;
  description: string;
  icon: React.ElementType;
  badge?: string | number;
  badgeColor?: string;
  onClick?: () => void;
  href?: string;
  index: number;
}) {
  const inner = (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.35 + index * 0.07 }}
    >
      <Card
        className="p-5 hover:shadow-md hover:border-primary/30 transition-all cursor-pointer group h-full"
        onClick={onClick}
      >
        <div className="flex items-start justify-between">
          <div className="w-10 h-10 rounded-xl bg-primary/8 flex items-center justify-center group-hover:bg-primary/15 transition-colors">
            <Icon size={18} className="text-primary" />
          </div>
          {badge !== undefined && (
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${badgeColor ?? "bg-muted text-muted-foreground"}`}>
              {badge}
            </span>
          )}
        </div>
        <div className="mt-3">
          <p className="font-semibold text-sm">{title}</p>
          <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
        </div>
        <div className="mt-3 flex items-center gap-1 text-xs text-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity">
          Accéder <ArrowRight size={12} />
        </div>
      </Card>
    </motion.div>
  );

  if (href) return <Link to={href}>{inner}</Link>;
  return inner;
}

// ── Admin KYC Tab ─────────────────────────────────────────────────────────────

function AdminKycTab() {
  const [reviewOpen, setReviewOpen] = useState(false);
  const [profileId, setProfileId] = useState("");
  const [decision, setDecision] = useState<"approve" | "reject">("approve");
  const [rejectionReason, setRejectionReason] = useState("");
  const [error, setError] = useState("");

  const { data, isLoading, isError } = useAdminKycPending();
  const { mutate: review, isPending } = useAdminKycReview();
  const { toast } = useToast();

  const openReview = (id?: string) => {
    setProfileId(id ?? "");
    setDecision("approve");
    setRejectionReason("");
    setError("");
    setReviewOpen(true);
  };

  const handleReview = () => {
    const id = parseInt(profileId, 10);
    if (!profileId || isNaN(id)) { setError("ID de profil invalide."); return; }
    if (decision === "reject" && !rejectionReason.trim()) { setError("Le motif de rejet est obligatoire."); return; }
    setError("");
    review(
      { profileId: id, decision, rejection_reason: rejectionReason.trim() || undefined },
      {
        onSuccess: () => {
          toast({ title: decision === "approve" ? "KYC approuvé." : "KYC rejeté." });
          setReviewOpen(false);
        },
        onError: (err) => setError(err instanceof ApiError ? err.message : "Une erreur est survenue."),
      }
    );
  };

  return (
    <div className="space-y-4">
      {isError && (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-50 border border-amber-200 text-sm">
          <AlertTriangle size={15} className="text-amber-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-semibold text-amber-800">Endpoint liste KYC non disponible</p>
            <p className="text-amber-700 mt-0.5 text-xs">
              <code className="bg-amber-100 px-1 rounded">GET /users/admin/kyc/pending/</code> n'est pas encore implémenté côté backend.
              Vous pouvez néanmoins réviser un profil en saisissant son ID manuellement.
            </p>
          </div>
        </div>
      )}

      {isLoading && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground py-4">
          <Loader2 size={14} className="animate-spin" /> Chargement…
        </div>
      )}

      {!isLoading && !isError && (
        (data?.results ?? []).length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
            <CheckCircle2 size={28} className="mb-2 opacity-40" />
            <p className="text-sm">Aucun profil en attente de validation KYC.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {data!.results.map((profile) => (
              <div key={profile.id} className="flex items-center justify-between p-4 rounded-xl border border-border bg-background hover:border-primary/30 transition-all">
                <div>
                  <p className="text-sm font-semibold">{profile.username}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Profile ID : {profile.id} · User ID : {profile.user}
                    {profile.submitted_at && ` · Soumis le ${new Date(profile.submitted_at).toLocaleDateString("fr-FR")}`}
                  </p>
                </div>
                <Button size="sm" variant="outline" className="gap-1.5" onClick={() => openReview(String(profile.id))}>
                  <UserCheck size={13} /> Réviser
                </Button>
              </div>
            ))}
          </div>
        )
      )}

      <div className="flex justify-end pt-2 border-t border-border">
        <Button size="sm" className="gap-1.5" onClick={() => openReview()}>
          <UserCheck size={13} /> Réviser un profil par ID
        </Button>
      </div>

      <Dialog open={reviewOpen} onOpenChange={(v) => !v && setReviewOpen(false)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <UserCheck size={15} className="text-primary" />
              </div>
              Révision KYC
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-1">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">ID profil *</Label>
              <Input type="number" placeholder="Ex: 12" value={profileId} onChange={(e) => setProfileId(e.target.value)} className="h-10" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Décision *</Label>
              <Select value={decision} onValueChange={(v) => setDecision(v as "approve" | "reject")}>
                <SelectTrigger className="h-10"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="approve">
                    <div className="flex items-center gap-2"><CheckCircle2 size={13} className="text-emerald-600" /> Approuver</div>
                  </SelectItem>
                  <SelectItem value="reject">
                    <div className="flex items-center gap-2"><XCircle size={13} className="text-red-500" /> Rejeter</div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            {decision === "reject" && (
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Motif de rejet *</Label>
                <Textarea rows={3} value={rejectionReason} onChange={(e) => setRejectionReason(e.target.value)} placeholder="Expliquez pourquoi le KYC est rejeté…" className="resize-none" />
              </div>
            )}
            {error && (
              <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/5 border border-destructive/20 rounded-lg px-3 py-2">
                <XCircle size={14} /> {error}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setReviewOpen(false)} disabled={isPending}>Annuler</Button>
            <Button
              onClick={handleReview}
              disabled={isPending}
              className={`gap-2 ${decision === "reject" ? "bg-red-600 hover:bg-red-700" : ""}`}
            >
              {isPending ? <Loader2 size={14} className="animate-spin" /> : decision === "approve" ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
              {decision === "approve" ? "Approuver" : "Rejeter"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ── Admin Disputes Tab ─────────────────────────────────────────────────────────

function AdminDisputesTab() {
  const [page, setPage] = useState(1);
  const [resolveOpen, setResolveOpen] = useState(false);
  const [contractId, setContractId] = useState("");
  const [resolution, setResolution] = useState<"client" | "provider" | "close">("close");
  const [resolutionNote, setResolutionNote] = useState("");
  const [error, setError] = useState("");

  const { data, isLoading, isError, isFetching } = useAdminDisputeList(page);
  const { mutate: resolve, isPending } = useResolveDispute();
  const { toast } = useToast();
  const totalPages = data ? Math.ceil(data.count / 20) : 0;

  const openResolve = (id?: string) => {
    setContractId(id ?? "");
    setResolution("close");
    setResolutionNote("");
    setError("");
    setResolveOpen(true);
  };

  const handleResolve = () => {
    if (!contractId.trim()) { setError("ID de contrat requis."); return; }
    setError("");
    resolve(
      { contractId: contractId.trim(), resolution, resolution_note: resolutionNote.trim() },
      {
        onSuccess: () => {
          toast({ title: "Litige résolu." });
          setResolveOpen(false);
        },
        onError: (err) => setError(err instanceof ApiError ? err.message : "Une erreur est survenue."),
      }
    );
  };

  return (
    <div className="space-y-4">
      {isError && (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-50 border border-amber-200 text-sm">
          <AlertTriangle size={15} className="text-amber-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-semibold text-amber-800">Endpoint liste litiges non disponible</p>
            <p className="text-amber-700 mt-0.5 text-xs">
              <code className="bg-amber-100 px-1 rounded">GET /contracts/admin/disputes/</code> n'est pas encore implémenté côté backend.
              Vous pouvez résoudre un litige en saisissant l'ID de contrat manuellement.
            </p>
          </div>
        </div>
      )}

      {isLoading && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground py-4">
          <Loader2 size={14} className="animate-spin" /> Chargement…
        </div>
      )}

      {!isLoading && !isError && (
        <>
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">{data?.count ?? 0} litige(s)</span>
            {isFetching && <Loader2 size={13} className="animate-spin text-muted-foreground" />}
          </div>
          {(data?.results ?? []).length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
              <CheckCircle2 size={28} className="mb-2 opacity-40" />
              <p className="text-sm">Aucun litige en attente.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {data!.results.map((d) => (
                <div key={d.id} className="flex items-center justify-between p-4 rounded-xl border border-border bg-background hover:border-primary/30 transition-all">
                  <div className="min-w-0 flex-1 mr-4">
                    <p className="text-sm font-semibold truncate">{d.contract_title ?? `Contrat #${d.contract}`}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Par {d.raised_by_username} · {new Date(d.created_at).toLocaleDateString("fr-FR")}
                      <span className="ml-2 px-1.5 py-0.5 rounded bg-amber-100 text-amber-700 text-[10px] font-medium">{d.status_display}</span>
                    </p>
                    {d.reason && <p className="text-xs text-muted-foreground mt-1 italic truncate">{d.reason}</p>}
                  </div>
                  <Button size="sm" variant="outline" className="gap-1.5 flex-shrink-0" onClick={() => openResolve(d.contract)}>
                    <Scale size={13} /> Résoudre
                  </Button>
                </div>
              ))}
            </div>
          )}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-2 border-t border-border">
              <p className="text-xs text-muted-foreground">Page {page} / {totalPages}</p>
              <div className="flex gap-1">
                <Button variant="outline" size="sm" className="h-8 w-8 p-0" onClick={() => setPage((p) => p - 1)} disabled={page === 1 || isFetching}>
                  <ChevronLeft size={14} />
                </Button>
                <Button variant="outline" size="sm" className="h-8 w-8 p-0" onClick={() => setPage((p) => p + 1)} disabled={page >= totalPages || isFetching}>
                  <ChevronRight size={14} />
                </Button>
              </div>
            </div>
          )}
        </>
      )}

      <div className="flex justify-end pt-2 border-t border-border">
        <Button size="sm" className="gap-1.5" onClick={() => openResolve()}>
          <Scale size={13} /> Résoudre un litige par ID
        </Button>
      </div>

      <Dialog open={resolveOpen} onOpenChange={(v) => !v && setResolveOpen(false)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Scale size={15} className="text-primary" />
              </div>
              Résoudre un litige
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-1">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">ID contrat *</Label>
              <Input placeholder="UUID du contrat" value={contractId} onChange={(e) => setContractId(e.target.value)} className="h-10 font-mono text-sm" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Résolution *</Label>
              <Select value={resolution} onValueChange={(v) => setResolution(v as "client" | "provider" | "close")}>
                <SelectTrigger className="h-10"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="client">En faveur du client</SelectItem>
                  <SelectItem value="provider">En faveur du prestataire</SelectItem>
                  <SelectItem value="close">Clore sans décision</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Note de résolution</Label>
              <Textarea rows={3} value={resolutionNote} onChange={(e) => setResolutionNote(e.target.value)} placeholder="Explication de la décision…" className="resize-none" />
            </div>
            {error && (
              <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/5 border border-destructive/20 rounded-lg px-3 py-2">
                <XCircle size={14} /> {error}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setResolveOpen(false)} disabled={isPending}>Annuler</Button>
            <Button onClick={handleResolve} disabled={isPending} className="gap-2">
              {isPending ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle2 size={14} />}
              Confirmer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ── Admin Contracts Tab ────────────────────────────────────────────────────────

function AdminContractsTab() {
  const [contractId, setContractId] = useState("");
  const [action, setAction] = useState<"complete" | "cancel">("complete");
  const [error, setError] = useState("");

  const complete = useAdminCompleteContract();
  const cancel = useAdminCancelContract();
  const { toast } = useToast();

  const isPending = complete.isPending || cancel.isPending;

  const handleSubmit = () => {
    if (!contractId.trim()) { setError("ID de contrat requis."); return; }
    setError("");
    const mutation = action === "complete" ? complete : cancel;
    mutation.mutate(contractId.trim(), {
      onSuccess: () => {
        toast({ title: action === "complete" ? "Contrat clôturé." : "Contrat annulé." });
        setContractId("");
      },
      onError: (err) => setError(err instanceof ApiError ? err.message : "Une erreur est survenue."),
    });
  };

  return (
    <div className="max-w-md space-y-5">
      <div className="p-4 rounded-xl bg-muted/50 border border-border text-sm text-muted-foreground">
        Ces actions sont irréversibles. À utiliser uniquement en cas de nécessité opérationnelle (litige non résolu, contrat bloqué…).
      </div>

      <div className="space-y-1.5">
        <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">ID contrat *</Label>
        <Input placeholder="UUID du contrat" value={contractId} onChange={(e) => { setContractId(e.target.value); setError(""); }} className="h-10 font-mono text-sm" />
      </div>

      <div className="space-y-1.5">
        <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Action *</Label>
        <Select value={action} onValueChange={(v) => setAction(v as "complete" | "cancel")}>
          <SelectTrigger className="h-10"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="complete">
              <div className="flex items-center gap-2"><CheckCircle2 size={13} className="text-emerald-600" /> Clôturer le contrat</div>
            </SelectItem>
            <SelectItem value="cancel">
              <div className="flex items-center gap-2"><XCircle size={13} className="text-red-500" /> Annuler le contrat</div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/5 border border-destructive/20 rounded-lg px-3 py-2">
          <XCircle size={14} /> {error}
        </div>
      )}

      <Button
        onClick={handleSubmit}
        disabled={isPending || !contractId.trim()}
        className={`gap-2 ${action === "cancel" ? "bg-red-600 hover:bg-red-700" : ""}`}
      >
        {isPending ? <Loader2 size={14} className="animate-spin" /> : action === "complete" ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
        {action === "complete" ? "Clôturer le contrat" : "Annuler le contrat"}
      </Button>
    </div>
  );
}

// ── Admin Ranking Tab ─────────────────────────────────────────────────────────

function AdminRankingTab() {
  const [providerId, setProviderId] = useState("");
  const [adjustment, setAdjustment] = useState("");
  const [adjustReason, setAdjustReason] = useState("");
  const [error, setError] = useState("");

  const recalculate = useAdminRankingRecalculate();
  const snapshot = useAdminRankingSnapshot();
  const adjust = useAdminRankingAdjust();
  const { toast } = useToast();

  const handleRecalculate = () => {
    recalculate.mutate(undefined, {
      onSuccess: () => toast({ title: "Recalcul lancé.", description: "Les classements sont en cours de mise à jour." }),
      onError: (err) => toast({ title: "Erreur", description: err instanceof Error ? err.message : "Une erreur est survenue.", variant: "destructive" }),
    });
  };

  const handleSnapshot = () => {
    snapshot.mutate(undefined, {
      onSuccess: () => toast({ title: "Snapshot calculé avec succès." }),
      onError: (err) => toast({ title: "Erreur", description: err instanceof Error ? err.message : "Une erreur est survenue.", variant: "destructive" }),
    });
  };

  const handleAdjust = () => {
    const id = parseInt(providerId, 10);
    const val = parseFloat(adjustment);
    if (!providerId || isNaN(id)) { setError("ID provider invalide."); return; }
    if (adjustment === "" || isNaN(val)) { setError("Valeur d'ajustement invalide."); return; }
    if (!adjustReason.trim()) { setError("La raison est obligatoire."); return; }
    setError("");
    adjust.mutate(
      { providerId: id, score_adjustment: val, reason: adjustReason.trim() },
      {
        onSuccess: () => {
          toast({ title: "Score ajusté.", description: `Provider #${id} mis à jour.` });
          setProviderId("");
          setAdjustment("");
          setAdjustReason("");
        },
        onError: (err) => setError(err instanceof ApiError ? err.message : "Une erreur est survenue."),
      }
    );
  };

  return (
    <div className="space-y-6">
      {/* Global actions */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3">Actions globales</p>
        <div className="grid sm:grid-cols-2 gap-3">
          <div className="p-4 rounded-xl border border-border bg-background space-y-3">
            <div>
              <p className="text-sm font-semibold">Recalculer tous les classements</p>
              <p className="text-xs text-muted-foreground mt-0.5">Recalcule les scores de tous les providers à partir des données actuelles.</p>
            </div>
            <Button size="sm" className="gap-2 w-full" onClick={handleRecalculate} disabled={recalculate.isPending}>
              {recalculate.isPending ? <Loader2 size={13} className="animate-spin" /> : <RefreshCw size={13} />}
              Lancer le recalcul
            </Button>
          </div>
          <div className="p-4 rounded-xl border border-border bg-background space-y-3">
            <div>
              <p className="text-sm font-semibold">Calculer un snapshot</p>
              <p className="text-xs text-muted-foreground mt-0.5">Prend une photo de la situation actuelle pour l'historique des tendances.</p>
            </div>
            <Button size="sm" variant="outline" className="gap-2 w-full" onClick={handleSnapshot} disabled={snapshot.isPending}>
              {snapshot.isPending ? <Loader2 size={13} className="animate-spin" /> : <Trophy size={13} />}
              Calculer le snapshot
            </Button>
          </div>
        </div>
      </div>

      {/* Manual score adjustment */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3">Ajustement manuel d'un score</p>
        <div className="max-w-md space-y-4 p-4 rounded-xl border border-border bg-background">
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">User ID du provider *</Label>
            <Input type="number" placeholder="Ex: 42" value={providerId} onChange={(e) => { setProviderId(e.target.value); setError(""); }} className="h-10" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Ajustement de score *</Label>
            <Input type="number" step="0.1" placeholder="Ex: 5 ou -3.5" value={adjustment} onChange={(e) => { setAdjustment(e.target.value); setError(""); }} className="h-10" />
            <p className="text-xs text-muted-foreground">Valeur positive = bonus · Valeur négative = malus</p>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Raison *</Label>
            <Textarea rows={2} value={adjustReason} onChange={(e) => setAdjustReason(e.target.value)} placeholder="Motif de l'ajustement…" className="resize-none" />
          </div>
          {error && (
            <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/5 border border-destructive/20 rounded-lg px-3 py-2">
              <XCircle size={14} /> {error}
            </div>
          )}
          <Button onClick={handleAdjust} disabled={adjust.isPending} className="gap-2 w-full">
            {adjust.isPending ? <Loader2 size={14} className="animate-spin" /> : <Trophy size={14} />}
            Appliquer l'ajustement
          </Button>
        </div>
      </div>
    </div>
  );
}

// ── Main Dashboard ─────────────────────────────────────────────────────────────

const AdminDashboard = () => {
  const [tab, setTab] = useState<"overview" | "audit" | "kyc" | "litiges" | "contrats" | "classement">("overview");
  const [userActionOpen, setUserActionOpen] = useState(false);

  const { data: stats, isLoading: statsLoading, refetch: refetchStats } = useAdminStats();
  const { data: pendingData } = useAdminPendingWithdrawals();
  const pendingCount = pendingData?.count ?? 0;
  const { toast } = useToast();

  const tabs = [
    { key: "overview" as const, label: "Vue d'ensemble", icon: LayoutDashboard },
    { key: "audit" as const, label: "Logs d'audit", icon: ClipboardList },
    { key: "kyc" as const, label: "KYC", icon: UserCheck },
    { key: "litiges" as const, label: "Litiges", icon: Scale },
    { key: "contrats" as const, label: "Contrats", icon: FileCheck2 },
    { key: "classement" as const, label: "Classement", icon: Trophy },
  ];

  return (
    <div className="min-h-screen bg-muted/30">
      {/* ── Top Header ── */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary via-primary/90 to-primary/70">
        {/* decorative shapes */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-12 -right-12 w-72 h-72 rounded-full bg-white/5" />
          <div className="absolute top-4 right-32 w-32 h-32 rounded-full bg-white/5" />
          <div className="absolute bottom-0 left-1/3 w-48 h-48 rounded-full bg-white/3" />
        </div>

        <div className="relative container mx-auto px-6 lg:px-8 py-7">
          {/* Breadcrumb */}
          <div className="flex items-center gap-1.5 text-white/50 text-xs mb-4">
            <Home size={11} />
            <span>/</span>
            <span className="text-white/70">Admin</span>
            <span>/</span>
            <span className="text-white font-medium">Dashboard</span>
          </div>

          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Sparkles size={16} className="text-white/60" />
                <span className="text-white/60 text-xs font-medium uppercase tracking-widest">
                  Administration
                </span>
              </div>
              <h1 className="text-2xl lg:text-3xl font-extrabold text-white leading-tight">
                Dashboard Administrateur
              </h1>
              <p className="text-white/55 text-sm mt-1">
                {stats
                  ? `Données actualisées à ${new Date(stats.generated_at).toLocaleTimeString("fr-FR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}`
                  : "Chargement des statistiques…"}
              </p>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <Button
                variant="secondary"
                size="sm"
                className="gap-1.5 bg-white/15 hover:bg-white/25 text-white border-0 backdrop-blur-sm"
                onClick={() => {
                  refetchStats();
                  toast({ title: "Statistiques actualisées." });
                }}
              >
                <RefreshCw size={13} />
                Actualiser
              </Button>
              <Link to="/">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-white/25 text-white hover:bg-white/15 gap-1.5"
                >
                  <Home size={13} />
                  Accueil
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ── Page Body ── */}
      <div className="container mx-auto px-4 lg:px-8 py-8 space-y-8">

        {/* ── KPI Grid ── */}
        {statsLoading ? (
          <div className="flex justify-center py-16">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="animate-spin text-primary" size={32} />
              <p className="text-sm text-muted-foreground">Chargement des statistiques…</p>
            </div>
          </div>
        ) : stats ? (
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
            <KpiCard
              index={0}
              label="Utilisateurs"
              value={fmt(stats.users.total)}
              sub={`+${stats.users.new_today} aujourd'hui`}
              icon={Users}
              gradient="bg-gradient-to-br from-blue-600 to-blue-500"
              iconBg="bg-white/20"
              trend="up"
            />
            <KpiCard
              index={1}
              label="Projets publiés"
              value={fmt(stats.projects.total_published)}
              sub={`+${stats.projects.new_this_week} cette semaine`}
              icon={Briefcase}
              gradient="bg-gradient-to-br from-violet-600 to-violet-500"
              iconBg="bg-white/20"
              trend="up"
            />
            <KpiCard
              index={2}
              label="Contrats actifs"
              value={fmt(stats.projects.contracts_active)}
              sub={`${stats.projects.contracts_completed_this_month} complétés ce mois`}
              icon={FileText}
              gradient="bg-gradient-to-br from-emerald-600 to-emerald-500"
              iconBg="bg-white/20"
              trend="neutral"
            />
            <KpiCard
              index={3}
              label="Volume mensuel"
              value={`${(stats.payments.volume_this_month / 1_000_000).toFixed(1)}M`}
              sub={`${stats.payments.success_count_this_month} paiements réussis`}
              icon={CreditCard}
              gradient="bg-gradient-to-br from-primary to-primary/80"
              iconBg="bg-white/20"
              trend="up"
            />
            <KpiCard
              index={4}
              label="Litiges ouverts"
              value={stats.disputes.open + stats.disputes.under_review}
              sub={`${stats.disputes.open} ouverts · ${stats.disputes.under_review} en revue`}
              icon={AlertTriangle}
              gradient={
                stats.disputes.open > 0
                  ? "bg-gradient-to-br from-red-600 to-red-500"
                  : "bg-gradient-to-br from-slate-500 to-slate-400"
              }
              iconBg="bg-white/20"
              trend={stats.disputes.open > 0 ? "down" : "neutral"}
            />
            <KpiCard
              index={5}
              label="Abonnements"
              value={fmt(stats.subscriptions.active_total)}
              sub={`${Object.keys(stats.subscriptions.by_tier).length} tier(s) actifs`}
              icon={Crown}
              gradient="bg-gradient-to-br from-amber-500 to-orange-500"
              iconBg="bg-white/20"
              trend="up"
            />
          </div>
        ) : null}

        {/* ── Quick Actions ── */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <h2 className="font-bold text-base">Actions rapides</h2>
            <div className="flex-1 h-px bg-border" />
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <QuickActionCard
              index={0}
              title="Retraits en attente"
              description="Traiter les demandes de retrait des freelancers"
              icon={Wallet}
              badge={pendingCount > 0 ? pendingCount : undefined}
              badgeColor={pendingCount > 0 ? "bg-red-100 text-red-700" : undefined}
              href={ROUTES.ADMIN.WITHDRAWALS}
            />
            <QuickActionCard
              index={1}
              title="Modération utilisateurs"
              description="Suspendre, bannir ou lever une sanction par ID"
              icon={Shield}
              onClick={() => setUserActionOpen(true)}
            />
            <QuickActionCard
              index={2}
              title="Historique d'audit"
              description="Consulter toutes les actions administratives"
              icon={ClipboardList}
              onClick={() => setTab("audit")}
            />
            <QuickActionCard
              index={3}
              title="Validation KYC"
              description="Approuver ou rejeter les profils en attente de vérification"
              icon={UserCheck}
              onClick={() => setTab("kyc")}
            />
            <QuickActionCard
              index={4}
              title="Litiges"
              description="Résoudre les litiges ouverts entre clients et prestataires"
              icon={Scale}
              badge={stats ? stats.disputes.open + stats.disputes.under_review : undefined}
              badgeColor={stats && stats.disputes.open > 0 ? "bg-red-100 text-red-700" : undefined}
              onClick={() => setTab("litiges")}
            />
            <QuickActionCard
              index={5}
              title="Actions contrats"
              description="Clôturer ou annuler un contrat bloqué par ID"
              icon={FileCheck2}
              onClick={() => setTab("contrats")}
            />
            <QuickActionCard
              index={6}
              title="Maintenance classement"
              description="Recalculer les scores, snapshots et ajustements manuels"
              icon={Trophy}
              onClick={() => setTab("classement")}
            />
          </div>
        </div>

        {/* ── Tab Nav ── */}
        <div className="flex items-center gap-1 p-1 bg-muted rounded-xl w-fit border border-border/50">
          {tabs.map((t) => {
            const TabIcon = t.icon;
            return (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  tab === t.key
                    ? "bg-background shadow-sm text-foreground ring-1 ring-border/50"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <TabIcon size={14} />
                {t.label}
              </button>
            );
          })}
        </div>

        {/* ── Tab Content ── */}
        <AnimatePresence mode="wait">
          {tab === "overview" && stats && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="grid lg:grid-cols-2 gap-5"
            >
              {/* Activity this week */}
              <SectionCard title="Activité cette semaine" icon={Activity}>
                <StatRow label="Nouveaux projets" value={fmt(stats.projects.new_this_week)} highlight="success" />
                <StatRow label="Propositions envoyées" value={fmt(stats.projects.proposals_this_week)} />
                <StatRow label="Nouveaux utilisateurs" value={fmt(stats.users.new_this_week)} highlight="success" />
                <StatRow
                  label="Contrats complétés ce mois"
                  value={fmt(stats.projects.contracts_completed_this_month)}
                />
              </SectionCard>

              {/* Payments this month */}
              <SectionCard
                title="Paiements ce mois"
                icon={CreditCard}
                action={
                  <span className="text-xs font-semibold text-primary">
                    {(stats.payments.volume_this_month / 1_000_000).toFixed(2)}M GNF
                  </span>
                }
              >
                <StatRow
                  label="Volume total"
                  value={`${fmt(stats.payments.volume_this_month)} GNF`}
                  highlight="success"
                />
                <StatRow
                  label="Paiements réussis"
                  value={
                    <span className="flex items-center gap-1">
                      <CheckCircle2 size={12} className="text-emerald-500" />
                      {fmt(stats.payments.success_count_this_month)}
                    </span>
                  }
                  highlight="success"
                />
                <StatRow
                  label="Paiements échoués"
                  value={
                    <span className="flex items-center gap-1">
                      <XCircle size={12} className={stats.payments.failed_count_this_month > 0 ? "text-red-500" : "text-muted-foreground"} />
                      {fmt(stats.payments.failed_count_this_month)}
                    </span>
                  }
                  highlight={stats.payments.failed_count_this_month > 0 ? "danger" : "muted"}
                />
              </SectionCard>

              {/* Disputes */}
              <SectionCard title="Litiges" icon={AlertTriangle}>
                <StatRow
                  label="Ouverts"
                  value={
                    <span className="flex items-center gap-1">
                      {stats.disputes.open > 0 && <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />}
                      {fmt(stats.disputes.open)}
                    </span>
                  }
                  highlight={stats.disputes.open > 0 ? "danger" : "muted"}
                />
                <StatRow label="En revue" value={fmt(stats.disputes.under_review)} highlight="warning" />
                <StatRow label="Résolus ce mois" value={fmt(stats.disputes.resolved_this_month)} highlight="success" />
              </SectionCard>

              {/* Subscriptions by tier */}
              <SectionCard
                title="Abonnements actifs par tier"
                icon={Crown}
                action={
                  <Badge variant="secondary" className="text-xs">
                    Total : {fmt(stats.subscriptions.active_total)}
                  </Badge>
                }
              >
                {Object.keys(stats.subscriptions.by_tier).length === 0 ? (
                  <p className="text-sm text-muted-foreground py-2">Aucun abonnement actif.</p>
                ) : (
                  <div className="space-y-3">
                    {Object.entries(stats.subscriptions.by_tier).map(([tier, count]) => {
                      const pct = stats.subscriptions.active_total
                        ? Math.round(((count as number) / stats.subscriptions.active_total) * 100)
                        : 0;
                      return (
                        <div key={tier}>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium capitalize">
                              {tier.replace(/_/g, " ")}
                            </span>
                            <span className="text-sm font-bold">{count as number}</span>
                          </div>
                          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                            <motion.div
                              className="h-full bg-gradient-to-r from-primary to-primary/70 rounded-full"
                              initial={{ width: 0 }}
                              animate={{ width: `${pct}%` }}
                              transition={{ delay: 0.4, duration: 0.6, ease: "easeOut" }}
                            />
                          </div>
                          <p className="text-[10px] text-muted-foreground mt-0.5">{pct}% des abonnements</p>
                        </div>
                      );
                    })}
                  </div>
                )}
              </SectionCard>
            </motion.div>
          )}

          {tab === "audit" && (
            <motion.div
              key="audit"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <Card className="p-6">
                <div className="flex items-center gap-2 mb-5">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <ClipboardList size={15} className="text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm">Journal d'audit</h3>
                    <p className="text-xs text-muted-foreground">Historique de toutes les actions administratives</p>
                  </div>
                </div>
                <AuditLogsTab />
              </Card>
            </motion.div>
          )}

          {tab === "kyc" && (
            <motion.div
              key="kyc"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <Card className="p-6">
                <div className="flex items-center gap-2 mb-5">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <UserCheck size={15} className="text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm">Validation KYC</h3>
                    <p className="text-xs text-muted-foreground">Approuver ou rejeter les profils en attente de vérification d'identité</p>
                  </div>
                </div>
                <AdminKycTab />
              </Card>
            </motion.div>
          )}

          {tab === "litiges" && (
            <motion.div
              key="litiges"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <Card className="p-6">
                <div className="flex items-center gap-2 mb-5">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Scale size={15} className="text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm">Litiges</h3>
                    <p className="text-xs text-muted-foreground">Résoudre les litiges ouverts entre clients et prestataires</p>
                  </div>
                </div>
                <AdminDisputesTab />
              </Card>
            </motion.div>
          )}

          {tab === "contrats" && (
            <motion.div
              key="contrats"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <Card className="p-6">
                <div className="flex items-center gap-2 mb-5">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <FileCheck2 size={15} className="text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm">Actions contrats</h3>
                    <p className="text-xs text-muted-foreground">Clôturer ou annuler un contrat bloqué</p>
                  </div>
                </div>
                <AdminContractsTab />
              </Card>
            </motion.div>
          )}
          {tab === "classement" && (
            <motion.div
              key="classement"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <Card className="p-6">
                <div className="flex items-center gap-2 mb-5">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Trophy size={15} className="text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm">Maintenance classement</h3>
                    <p className="text-xs text-muted-foreground">Recalcul des scores, snapshots et ajustements manuels</p>
                  </div>
                </div>
                <AdminRankingTab />
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <UserActionDialog open={userActionOpen} onOpenChange={setUserActionOpen} />
    </div>
  );
};

export default AdminDashboard;
