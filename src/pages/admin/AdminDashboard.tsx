import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
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
} from "lucide-react";
import { ROUTES } from "@/constants/routes";
import {
  useAdminStats,
  useAuditLogs,
  useSuspendUser,
  useUnsuspendUser,
  useBanUser,
  useUnbanUser,
  type AuditLogFilters,
} from "@/hooks/useAdmin";
import { useAdminPendingWithdrawals } from "@/hooks/useWallet";
import { useToast } from "@/hooks/use-toast";
import { ApiError } from "@/services/api.service";

// ── Stats Cards ────────────────────────────────────────────────────────────────

function StatCard({
  label,
  value,
  sub,
  icon: Icon,
  color,
  index,
}: {
  label: string;
  value: string | number;
  sub?: string;
  icon: React.ElementType;
  color: string;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Card className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium mb-1">
              {label}
            </p>
            <p className="text-3xl font-extrabold leading-none">{value}</p>
            {sub && <p className="text-xs text-muted-foreground mt-1.5">{sub}</p>}
          </div>
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
            <Icon size={20} />
          </div>
        </div>
      </Card>
    </motion.div>
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

  return (
    <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield size={16} />
            Action sur un utilisateur
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-1">
          <div className="space-y-1.5">
            <Label htmlFor="ua-userid">ID utilisateur *</Label>
            <Input
              id="ua-userid"
              type="number"
              placeholder="Ex: 42"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <Label>Action *</Label>
            <Select value={action} onValueChange={(v) => setAction(v as ActionType)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="suspend">Suspendre</SelectItem>
                <SelectItem value="unsuspend">Lever la suspension</SelectItem>
                <SelectItem value="ban">Bannir</SelectItem>
                <SelectItem value="unban">Débannir</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {needsReason && (
            <div className="space-y-1.5">
              <Label htmlFor="ua-reason">Raison *</Label>
              <Textarea
                id="ua-reason"
                rows={2}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Motif de la sanction…"
              />
            </div>
          )}

          {needsUntil && (
            <div className="space-y-1.5">
              <Label htmlFor="ua-until">Fin de suspension *</Label>
              <Input
                id="ua-until"
                type="datetime-local"
                value={until}
                onChange={(e) => setUntil(e.target.value)}
              />
            </div>
          )}

          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={isPending}>
            Annuler
          </Button>
          <Button onClick={handleSubmit} disabled={isPending} className="gap-2">
            {isPending ? <Loader2 size={14} className="animate-spin" /> : <Shield size={14} />}
            Confirmer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ── Audit Logs Tab ─────────────────────────────────────────────────────────────

const ACTION_LABELS: Record<string, string> = {
  USER_SUSPENDED: "Suspension",
  USER_UNSUSPENDED: "Levée suspension",
  USER_BANNED: "Bannissement",
  USER_UNBANNED: "Débannissement",
  KYC_APPROVED: "KYC approuvé",
  KYC_REJECTED: "KYC rejeté",
  PAYMENT_RELEASED: "Paiement libéré",
  DISPUTE_RESOLVED: "Litige résolu",
  WITHDRAWAL_APPROVED: "Retrait approuvé",
  WITHDRAWAL_REJECTED: "Retrait rejeté",
};

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
      <div className="flex items-center gap-3 flex-wrap">
        <Select value={actionFilter} onValueChange={handleActionFilter}>
          <SelectTrigger className="w-[200px] h-9 text-sm">
            <SelectValue placeholder="Toutes les actions" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__all__">Toutes les actions</SelectItem>
            {Object.entries(ACTION_LABELS).map(([k, v]) => (
              <SelectItem key={k} value={k}>{v}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {isFetching && <Loader2 size={16} className="animate-spin text-muted-foreground" />}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="animate-spin text-primary" size={28} />
        </div>
      ) : logs.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-8">Aucun log d'audit.</p>
      ) : (
        <div className="divide-y divide-border">
          {logs.map((log) => (
            <div key={log.id} className="py-3 px-1 flex items-start gap-3 text-sm">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-medium">
                    {ACTION_LABELS[log.action] ?? log.action}
                  </span>
                  {log.resource_type && (
                    <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                      {log.resource_type}
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Par <strong>{log.username ?? `user#${log.user}`}</strong>
                  {log.resource_id && ` · Ressource #${log.resource_id}`}
                  {log.ip_address && ` · ${log.ip_address}`}
                </p>
              </div>
              <span className="text-xs text-muted-foreground flex-shrink-0">
                {new Date(log.created_at).toLocaleDateString("fr-FR", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-3 border-t border-border">
          <p className="text-xs text-muted-foreground">
            Page {page} sur {totalPages} ({data?.count} entrées)
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

// ── Main Page ──────────────────────────────────────────────────────────────────

const AdminDashboard = () => {
  const [tab, setTab] = useState<"overview" | "audit">("overview");
  const [userActionOpen, setUserActionOpen] = useState(false);

  const { data: stats, isLoading: statsLoading, refetch: refetchStats } = useAdminStats();
  const { data: pendingData } = useAdminPendingWithdrawals();
  const pendingCount = pendingData?.count ?? 0;
  const { toast } = useToast();

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <div className="bg-primary text-white p-6 lg:p-8">
        <div className="container mx-auto">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <h1 className="text-3xl font-bold mb-1">Dashboard Administrateur</h1>
              <p className="text-white/70 text-sm">
                {stats
                  ? `Mis à jour ${new Date(stats.generated_at).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}`
                  : "Chargement…"}
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="secondary"
                size="sm"
                className="gap-1.5"
                onClick={() => {
                  refetchStats();
                  toast({ title: "Stats actualisées." });
                }}
              >
                <RefreshCw size={14} />
                Actualiser
              </Button>
              <Link to="/">
                <Button variant="outline" size="sm" className="border-white/30 text-white hover:bg-white/10">
                  Retour à l'accueil
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto p-6 lg:p-8 space-y-6">

        {/* ── Stats Grid ── */}
        {statsLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="animate-spin text-primary" size={32} />
          </div>
        ) : stats ? (
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            <StatCard
              index={0}
              label="Utilisateurs"
              value={stats.users.total.toLocaleString("fr-FR")}
              sub={`+${stats.users.new_today} aujourd'hui`}
              icon={Users}
              color="bg-blue-100 text-blue-600"
            />
            <StatCard
              index={1}
              label="Projets publiés"
              value={stats.projects.total_published.toLocaleString("fr-FR")}
              sub={`+${stats.projects.new_this_week} cette semaine`}
              icon={Briefcase}
              color="bg-secondary/10 text-secondary"
            />
            <StatCard
              index={2}
              label="Contrats actifs"
              value={stats.projects.contracts_active.toLocaleString("fr-FR")}
              sub={`${stats.projects.contracts_completed_this_month} terminés ce mois`}
              icon={FileText}
              color="bg-green-100 text-green-600"
            />
            <StatCard
              index={3}
              label="Volume ce mois"
              value={`${(stats.payments.volume_this_month / 1_000_000).toFixed(1)}M GNF`}
              sub={`${stats.payments.success_count_this_month} paiements réussis`}
              icon={CreditCard}
              color="bg-primary/10 text-primary"
            />
            <StatCard
              index={4}
              label="Litiges ouverts"
              value={stats.disputes.open + stats.disputes.under_review}
              sub={`${stats.disputes.open} ouverts · ${stats.disputes.under_review} en revue`}
              icon={AlertTriangle}
              color={
                stats.disputes.open > 0
                  ? "bg-red-100 text-red-600"
                  : "bg-muted text-muted-foreground"
              }
            />
            <StatCard
              index={5}
              label="Abonnements actifs"
              value={stats.subscriptions.active_total.toLocaleString("fr-FR")}
              sub={Object.entries(stats.subscriptions.by_tier)
                .map(([tier, count]) => `${tier}: ${count}`)
                .join(" · ") || "—"}
              icon={Crown}
              color="bg-purple-100 text-purple-600"
            />
          </div>
        ) : null}

        {/* ── Quick Actions ── */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link to={ROUTES.ADMIN.WITHDRAWALS}>
            <Card className="p-5 hover:shadow-md transition-shadow cursor-pointer group">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">
                    Retraits en attente
                  </p>
                  <p className="text-3xl font-extrabold mt-1">{pendingCount}</p>
                </div>
                <ArrowUpRight size={18} className="text-muted-foreground group-hover:text-primary transition-colors mt-0.5" />
              </div>
              <p className="text-xs text-muted-foreground mt-2">Gérer les demandes</p>
            </Card>
          </Link>

          <Card
            className="p-5 hover:shadow-md transition-shadow cursor-pointer group"
            onClick={() => setUserActionOpen(true)}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">
                  Modération utilisateurs
                </p>
                <p className="text-sm font-semibold mt-2">Suspendre · Bannir</p>
              </div>
              <Shield size={18} className="text-muted-foreground group-hover:text-primary transition-colors mt-0.5" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">Actions par ID utilisateur</p>
          </Card>

          <Card
            className="p-5 hover:shadow-md transition-shadow cursor-pointer group"
            onClick={() => setTab("audit")}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">
                  Logs d'audit
                </p>
                <p className="text-sm font-semibold mt-2">Historique des actions</p>
              </div>
              <FileText size={18} className="text-muted-foreground group-hover:text-primary transition-colors mt-0.5" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">Paiements · Sanctions · KYC</p>
          </Card>
        </div>

        {/* ── Tabs ── */}
        <div className="flex items-center bg-muted rounded-xl p-1 w-fit text-sm">
          {(["overview", "audit"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-1.5 rounded-lg font-medium transition-colors ${
                tab === t
                  ? "bg-white shadow-sm text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t === "overview" ? "Vue d'ensemble" : "Logs d'audit"}
            </button>
          ))}
        </div>

        {/* ── Tab content ── */}
        {tab === "overview" && stats && (
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Propositions & contrats */}
            <Card className="p-5">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Briefcase size={16} className="text-primary" />
                Activité cette semaine
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Nouveaux projets</span>
                  <span className="font-semibold">{stats.projects.new_this_week}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Propositions envoyées</span>
                  <span className="font-semibold">{stats.projects.proposals_this_week}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Nouveaux utilisateurs</span>
                  <span className="font-semibold">{stats.users.new_this_week}</span>
                </div>
              </div>
            </Card>

            {/* Paiements */}
            <Card className="p-5">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <CreditCard size={16} className="text-primary" />
                Paiements ce mois
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Volume total</span>
                  <span className="font-semibold text-primary">
                    {stats.payments.volume_this_month.toLocaleString("fr-FR")} GNF
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Paiements réussis</span>
                  <span className="font-semibold text-green-600">
                    {stats.payments.success_count_this_month}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Paiements échoués</span>
                  <span className={`font-semibold ${stats.payments.failed_count_this_month > 0 ? "text-red-500" : ""}`}>
                    {stats.payments.failed_count_this_month}
                  </span>
                </div>
              </div>
            </Card>

            {/* Litiges */}
            <Card className="p-5">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <AlertTriangle size={16} className="text-primary" />
                Litiges
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Ouverts</span>
                  <span className={`font-semibold ${stats.disputes.open > 0 ? "text-red-500" : ""}`}>
                    {stats.disputes.open}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">En revue</span>
                  <span className="font-semibold text-orange-500">{stats.disputes.under_review}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Résolus ce mois</span>
                  <span className="font-semibold text-green-600">{stats.disputes.resolved_this_month}</span>
                </div>
              </div>
            </Card>

            {/* Abonnements par tier */}
            <Card className="p-5">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Crown size={16} className="text-primary" />
                Abonnements actifs par tier
              </h3>
              {Object.keys(stats.subscriptions.by_tier).length === 0 ? (
                <p className="text-sm text-muted-foreground">Aucun abonnement actif.</p>
              ) : (
                <div className="space-y-3 text-sm">
                  {Object.entries(stats.subscriptions.by_tier).map(([tier, count]) => (
                    <div key={tier} className="flex justify-between items-center">
                      <span className="text-muted-foreground capitalize">{tier.replace(/_/g, " ")}</span>
                      <Badge variant="secondary">{count}</Badge>
                    </div>
                  ))}
                  <div className="flex justify-between font-semibold pt-2 border-t border-border">
                    <span>Total</span>
                    <span>{stats.subscriptions.active_total}</span>
                  </div>
                </div>
              )}
            </Card>
          </div>
        )}

        {tab === "audit" && (
          <Card className="p-5">
            <AuditLogsTab />
          </Card>
        )}
      </div>

      <UserActionDialog open={userActionOpen} onOpenChange={setUserActionOpen} />
    </div>
  );
};

export default AdminDashboard;
