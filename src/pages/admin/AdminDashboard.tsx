import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Users, Briefcase, CreditCard, AlertTriangle, Crown, FileText,
  Loader2, ChevronLeft, ChevronRight, Shield, Ban,
  UserCheck, RefreshCw, TrendingUp, TrendingDown, LayoutDashboard,
  ClipboardList, Wallet, CheckCircle2, XCircle, Clock, Activity,
  Home, Scale, FileCheck2, Trophy, Search, Bell, LogOut,
  MoreHorizontal, ExternalLink, ChevronDown, Download, Phone,
  MapPin, Globe, Linkedin, Calendar, Star, FileIcon, User,
} from "lucide-react";
import { ROUTES } from "@/constants/routes";
import {
  useAdminStats, useAuditLogs, useSuspendUser, useUnsuspendUser,
  useBanUser, useUnbanUser, useResolveDispute, useAdminKycPending,
  useAdminKycReview, useAdminKycDetail, useAdminDisputeList,
  useAdminCompleteContract, useAdminCancelContract,
  useAdminRankingRecalculate, useAdminRankingSnapshot,
  useAdminRankingAdjust, useAdminUserList,
  type AuditLogFilters, type AdminUserItem, type AdminKycDetail,
} from "@/hooks/useAdmin";
import { useAdminPendingWithdrawals } from "@/hooks/useWallet";
import { useToast } from "@/hooks/use-toast";
import { ApiError } from "@/services/api.service";
import { useAuth } from "@/contexts/AuthContext";

// ── Logo version dark (texte blanc, formes conservées) ────────────────────────

function FreeJobGNLogoDark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 900 260"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <g>
        <rect fill="#002e8a" height="200" transform="rotate(-12,120.0,130.0)" width="200" x="20.0" y="30.0" />
        <rect fill="#2eb9c7" height="200" transform="rotate(3,140.0,130.0)" width="200" x="20.0" y="30.0" />
        <rect fill="#fa6400" height="150" rx="20" ry="20" width="180" x="490" y="60.0" />
      </g>
      <g>
        <text fill="#ffffff" fontFamily="Liberation Sans, DejaVu Sans, Arial" fontSize="140" fontWeight="bold" x="70.0" y="176.67">F</text>
        <text fill="#ffffff" fontFamily="Liberation Sans, DejaVu Sans, Arial" fontSize="100" fontWeight="bold" x="140" y="168.0">reejob</text>
        <text fill="#ffffff" fontFamily="Liberation Sans, DejaVu Sans, Arial" fontSize="110" fontWeight="bold" textAnchor="middle" x="580.0" y="170.0">gn</text>
      </g>
    </svg>
  );
}

// ── Section keys ───────────────────────────────────────────────────────────────

type Section = "overview" | "users" | "kyc" | "disputes" | "contracts" | "ranking" | "audit";

// ── Helpers ────────────────────────────────────────────────────────────────────

function fmt(n: number) {
  return n.toLocaleString("fr-FR");
}

function fmtDate(s: string) {
  return new Date(s).toLocaleDateString("fr-FR", {
    day: "2-digit", month: "short", year: "numeric",
  });
}

// ── Sidebar ────────────────────────────────────────────────────────────────────

const NAV_ITEMS: {
  key: Section;
  label: string;
  icon: React.ElementType;
}[] = [
  { key: "overview",  label: "Vue d'ensemble", icon: LayoutDashboard },
  { key: "users",     label: "Utilisateurs",   icon: Users },
  { key: "kyc",       label: "Vérification KYC", icon: UserCheck },
  { key: "disputes",  label: "Litiges",         icon: Scale },
  { key: "contracts", label: "Contrats",        icon: FileCheck2 },
  { key: "ranking",   label: "Classement",      icon: Trophy },
  { key: "audit",     label: "Logs d'audit",    icon: ClipboardList },
];

interface SidebarProps {
  active: Section;
  onNavigate: (s: Section) => void;
  pendingWithdrawals: number;
  openDisputes: number;
  pendingKyc: number;
}

function AdminSidebar({
  active,
  onNavigate,
  pendingWithdrawals,
  openDisputes,
  pendingKyc,
}: SidebarProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const badges: Partial<Record<Section | "withdrawals", number>> = {
    disputes: openDisputes,
    kyc: pendingKyc,
  };

  const initials = user?.username
    ? user.username.slice(0, 2).toUpperCase()
    : "AD";

  const handleLogout = async () => {
    await logout();
    navigate(ROUTES.ADMIN_LOGIN);
  };

  return (
    <aside
      className="w-64 flex-shrink-0 flex flex-col h-screen border-r border-white/10"
      style={{ background: "hsl(231, 68%, 18%)" }}
    >
      {/* Logo */}
      <div className="flex items-center px-5 border-b border-white/10 flex-shrink-0" style={{ height: "64px" }}>
        <FreeJobGNLogoDark className="h-11 w-auto" />
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-5 px-3 space-y-0.5">
        <p className="text-white/30 text-[10px] font-bold uppercase tracking-widest px-3 pb-2">
          Tableau de bord
        </p>

        {NAV_ITEMS.slice(0, 2).map((item) => (
          <SidebarNavItem
            key={item.key}
            item={item}
            active={active}
            onNavigate={onNavigate}
            badge={badges[item.key]}
          />
        ))}

        <p className="text-white/30 text-[10px] font-bold uppercase tracking-widest px-3 pt-5 pb-2">
          Opérations
        </p>

        {NAV_ITEMS.slice(2, 7).map((item) => (
          <SidebarNavItem
            key={item.key}
            item={item}
            active={active}
            onNavigate={onNavigate}
            badge={badges[item.key]}
          />
        ))}

        <p className="text-white/30 text-[10px] font-bold uppercase tracking-widest px-3 pt-5 pb-2">
          Finances
        </p>

        <Link
          to={ROUTES.ADMIN.WITHDRAWALS}
          className="flex items-center justify-between gap-2.5 px-3 py-2 rounded-lg text-white/60 hover:text-white hover:bg-white/8 transition-all group text-sm"
        >
          <div className="flex items-center gap-2.5">
            <Wallet size={15} className="flex-shrink-0" />
            <span>Retraits</span>
          </div>
          {pendingWithdrawals > 0 && (
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-red-500/80 text-white min-w-[18px] text-center">
              {pendingWithdrawals}
            </span>
          )}
        </Link>
        <Link
          to={ROUTES.ADMIN.COMPTABILITE}
          className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-white/60 hover:text-white hover:bg-white/8 transition-all text-sm"
        >
          <TrendingUp size={15} className="flex-shrink-0" />
          <span>Comptabilité</span>
        </Link>
      </nav>

      {/* User footer */}
      <div className="border-t border-white/10 p-3 flex-shrink-0">
        <Link
          to="/"
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-white/50 hover:text-white/80 hover:bg-white/8 transition-all text-xs mb-1"
        >
          <Home size={13} />
          Retour au site
        </Link>
        <div className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/5 transition-colors group">
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
            style={{ background: "hsl(32,91%,54%)" }}>
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-xs font-semibold truncate">
              {user?.username ?? "Administrateur"}
            </p>
            <p className="text-white/40 text-[10px] truncate">{user?.email ?? ""}</p>
          </div>
          <button
            onClick={handleLogout}
            className="text-white/30 hover:text-white/70 transition-colors opacity-0 group-hover:opacity-100"
          >
            <LogOut size={13} />
          </button>
        </div>
      </div>
    </aside>
  );
}

function SidebarNavItem({
  item,
  active,
  onNavigate,
  badge,
}: {
  item: (typeof NAV_ITEMS)[number];
  active: Section;
  onNavigate: (s: Section) => void;
  badge?: number;
}) {
  const isActive = active === item.key;
  const Icon = item.icon;
  return (
    <button
      onClick={() => onNavigate(item.key)}
      className={`w-full flex items-center justify-between gap-2.5 px-3 py-2 rounded-lg text-sm transition-all ${
        isActive
          ? "bg-white/12 text-white font-medium border-l-2"
          : "text-white/60 hover:text-white hover:bg-white/8 border-l-2 border-transparent"
      }`}
      style={isActive ? { borderLeftColor: "hsl(32,91%,54%)" } : undefined}
    >
      <div className="flex items-center gap-2.5">
        <Icon size={15} className="flex-shrink-0" />
        <span>{item.label}</span>
      </div>
      {badge !== undefined && badge > 0 && (
        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-red-500/80 text-white min-w-[18px] text-center">
          {badge}
        </span>
      )}
    </button>
  );
}

// ── Topbar ─────────────────────────────────────────────────────────────────────

const SECTION_LABELS: Record<Section, string> = {
  overview:  "Vue d'ensemble",
  users:     "Gestion des utilisateurs",
  kyc:       "Vérification KYC",
  disputes:  "Litiges",
  contracts: "Actions contrats",
  ranking:   "Classement",
  audit:     "Logs d'audit",
};

function AdminTopbar({
  section,
  onRefresh,
  isRefreshing,
  pendingWithdrawals,
  searchValue,
  onSearch,
}: {
  section: Section;
  onRefresh: () => void;
  isRefreshing: boolean;
  pendingWithdrawals: number;
  searchValue: string;
  onSearch: (v: string) => void;
}) {
  return (
    <header className="h-14 flex items-center justify-between px-6 bg-white border-b border-slate-200 flex-shrink-0">
      <div>
        <h1 className="text-sm font-bold text-slate-900">{SECTION_LABELS[section]}</h1>
        <p className="text-[11px] text-slate-400">
          Admin / {SECTION_LABELS[section]}
        </p>
      </div>

      <div className="flex items-center gap-2">
        {/* Search — visible in users/audit */}
        {(section === "users" || section === "audit") && (
          <div className="relative">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              value={searchValue}
              onChange={(e) => onSearch(e.target.value)}
              className="pl-8 pr-3 h-8 bg-slate-50 rounded-lg border border-slate-200 text-xs w-48 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all"
              placeholder={section === "users" ? "Rechercher un utilisateur…" : "Filtrer les logs…"}
            />
          </div>
        )}

        <button
          onClick={onRefresh}
          className="h-8 w-8 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-colors"
        >
          <RefreshCw size={13} className={`text-slate-500 ${isRefreshing ? "animate-spin" : ""}`} />
        </button>

        <button className="relative h-8 w-8 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-colors">
          <Bell size={13} className="text-slate-500" />
          {pendingWithdrawals > 0 && (
            <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-red-500 rounded-full text-white text-[8px] font-bold flex items-center justify-center">
              {pendingWithdrawals > 9 ? "9+" : pendingWithdrawals}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}

// ── KPI Card ───────────────────────────────────────────────────────────────────

interface KpiCardProps {
  label: string;
  value: string | number;
  sub?: string;
  icon: React.ElementType;
  borderColor: string;
  iconBg: string;
  iconColor: string;
  trend?: "up" | "down" | "neutral";
  trendLabel?: string;
  index: number;
}

function KpiCard({
  label, value, sub, icon: Icon,
  borderColor, iconBg, iconColor,
  trend, trendLabel, index,
}: KpiCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.055, ease: "easeOut" }}
    >
      <Card className={`p-5 border-l-[3px] ${borderColor} shadow-sm hover:shadow-md transition-all bg-white`}>
        <div className="flex items-start justify-between mb-3">
          <div className={`w-9 h-9 rounded-xl ${iconBg} flex items-center justify-center`}>
            <Icon size={17} className={iconColor} />
          </div>
          {trend && trend !== "neutral" && (
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-0.5 ${
              trend === "up"
                ? "bg-emerald-50 text-emerald-600"
                : "bg-red-50 text-red-500"
            }`}>
              {trend === "up" ? <TrendingUp size={9} /> : <TrendingDown size={9} />}
              {trendLabel}
            </span>
          )}
        </div>
        <p className="text-2xl font-bold text-slate-900 tabular-nums leading-none">{value}</p>
        <p className="text-xs font-medium text-slate-500 mt-1.5">{label}</p>
        {sub && <p className="text-[10px] text-slate-400 mt-0.5">{sub}</p>}
      </Card>
    </motion.div>
  );
}

// ── Section wrapper ────────────────────────────────────────────────────────────

function SectionCard({
  title, icon: Icon, children, action,
}: {
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <Card className="overflow-hidden shadow-sm bg-white">
      <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center">
            <Icon size={14} className="text-slate-600" />
          </div>
          <h3 className="font-semibold text-sm text-slate-800">{title}</h3>
        </div>
        {action}
      </div>
      <div className="p-5">{children}</div>
    </Card>
  );
}

// ── Stat Row ───────────────────────────────────────────────────────────────────

function StatRow({
  label, value, highlight,
}: {
  label: string;
  value: React.ReactNode;
  highlight?: "success" | "danger" | "warning" | "muted";
}) {
  const cls: Record<string, string> = {
    success: "text-emerald-600 font-bold",
    danger:  "text-red-500 font-bold",
    warning: "text-amber-500 font-bold",
    muted:   "text-slate-400",
  };
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-slate-100 last:border-0">
      <span className="text-sm text-slate-500">{label}</span>
      <span className={`text-sm font-medium text-slate-800 ${highlight ? cls[highlight] : ""}`}>
        {value}
      </span>
    </div>
  );
}

// ── User status badge ──────────────────────────────────────────────────────────

function UserStatusBadge({ user }: { user: AdminUserItem }) {
  if (user.is_banned)
    return <Badge className="bg-red-100 text-red-700 border-0 text-[10px]">Banni</Badge>;
  if (user.is_suspended)
    return <Badge className="bg-amber-100 text-amber-700 border-0 text-[10px]">Suspendu</Badge>;
  if (!user.is_active)
    return <Badge className="bg-slate-100 text-slate-500 border-0 text-[10px]">Inactif</Badge>;
  return <Badge className="bg-emerald-100 text-emerald-700 border-0 text-[10px]">Actif</Badge>;
}

function RoleBadge({ user }: { user: AdminUserItem }) {
  if (user.provider_kind === "AGENCY")
    return <Badge className="bg-violet-100 text-violet-700 border-0 text-[10px]">Agence</Badge>;
  if (user.provider_kind === "FREELANCE")
    return <Badge className="bg-blue-100 text-blue-700 border-0 text-[10px]">Freelance</Badge>;
  return <Badge className="bg-slate-100 text-slate-600 border-0 text-[10px]">Client</Badge>;
}

// ── Users Section ─────────────────────────────────────────────────────────────

function UsersSection() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [moderating, setModerating] = useState<AdminUserItem | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 400);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [search]);

  const { data, isLoading, isError, isFetching } = useAdminUserList({
    page,
    search: debouncedSearch || undefined,
  });

  const users = data?.results ?? [];
  const totalPages = data ? Math.ceil(data.count / 20) : 0;

  return (
    <div className="space-y-4">
      {/* Search bar */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher par nom, email…"
            className="pl-8 h-9 text-sm bg-white"
          />
        </div>
        {isFetching && <Loader2 size={14} className="animate-spin text-slate-400" />}
        {data && (
          <span className="text-xs text-slate-500 ml-auto">
            {fmt(data.count)} utilisateur{data.count !== 1 ? "s" : ""}
          </span>
        )}
      </div>

      {isError ? (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-50 border border-amber-200">
          <AlertTriangle size={15} className="text-amber-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-semibold text-amber-800 text-sm">Liste utilisateurs non disponible</p>
            <p className="text-amber-700 mt-0.5 text-xs">
              L'endpoint <code className="bg-amber-100 px-1 rounded">GET /users/admin/users/</code> n'est pas
              encore implémenté. Utilisez la modération depuis la section Vue d'ensemble.
            </p>
          </div>
        </div>
      ) : isLoading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="animate-spin text-primary" size={28} />
        </div>
      ) : users.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-14 text-slate-400">
          <Users size={32} className="mb-3 opacity-40" />
          <p className="text-sm">Aucun utilisateur trouvé.</p>
        </div>
      ) : (
        <Card className="overflow-hidden shadow-sm">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/80 hover:bg-slate-50/80">
                <TableHead className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide w-12">#</TableHead>
                <TableHead className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">Utilisateur</TableHead>
                <TableHead className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">Rôle</TableHead>
                <TableHead className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">Statut</TableHead>
                <TableHead className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">Inscription</TableHead>
                <TableHead className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((u, i) => (
                <motion.tr
                  key={u.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.03 }}
                  className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors"
                >
                  <TableCell className="text-xs text-slate-400 font-mono">{u.id}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600 flex-shrink-0">
                        {u.username.slice(0, 2).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-slate-800 truncate">{u.username}</p>
                        <p className="text-[11px] text-slate-400 truncate">{u.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell><RoleBadge user={u} /></TableCell>
                  <TableCell><UserStatusBadge user={u} /></TableCell>
                  <TableCell className="text-xs text-slate-500">{fmtDate(u.date_joined)}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 px-2.5 text-xs gap-1.5 border-slate-200"
                      onClick={() => setModerating(u)}
                    >
                      <Shield size={11} />
                      Gérer
                    </Button>
                  </TableCell>
                </motion.tr>
              ))}
            </TableBody>
          </Table>

          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100 bg-slate-50/50">
              <p className="text-xs text-slate-400">Page {page} / {totalPages}</p>
              <div className="flex gap-1">
                <Button variant="outline" size="sm" className="h-7 w-7 p-0 border-slate-200"
                  onClick={() => setPage((p) => p - 1)} disabled={page === 1 || isFetching}>
                  <ChevronLeft size={13} />
                </Button>
                <Button variant="outline" size="sm" className="h-7 w-7 p-0 border-slate-200"
                  onClick={() => setPage((p) => p + 1)} disabled={page >= totalPages || isFetching}>
                  <ChevronRight size={13} />
                </Button>
              </div>
            </div>
          )}
        </Card>
      )}

      {/* Moderation dialog */}
      <UserModerationDialog
        open={!!moderating}
        user={moderating}
        onClose={() => setModerating(null)}
      />
    </div>
  );
}

// ── User Moderation Dialog ─────────────────────────────────────────────────────

type ActionType = "suspend" | "unsuspend" | "ban" | "unban";

function UserModerationDialog({
  open, user, onClose,
}: {
  open: boolean;
  user: AdminUserItem | null;
  onClose: () => void;
}) {
  const [userId, setUserId] = useState("");
  const [action, setAction] = useState<ActionType>("suspend");
  const [reason, setReason] = useState("");
  const [until, setUntil] = useState("");
  const [error, setError] = useState("");

  const suspend   = useSuspendUser();
  const unsuspend = useUnsuspendUser();
  const ban       = useBanUser();
  const unban     = useUnbanUser();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      setUserId(String(user.id));
      if (user.is_banned)       setAction("unban");
      else if (user.is_suspended) setAction("unsuspend");
      else                        setAction("suspend");
    }
  }, [user]);

  const isPending = suspend.isPending || unsuspend.isPending || ban.isPending || unban.isPending;

  const reset = () => { setReason(""); setUntil(""); setError(""); };
  const handleClose = () => { reset(); onClose(); };

  const handleSubmit = async () => {
    setError("");
    const id = parseInt(userId, 10);
    if (!userId || isNaN(id)) { setError("ID utilisateur invalide."); return; }
    if ((action === "suspend" || action === "ban") && !reason.trim()) { setError("La raison est obligatoire."); return; }
    if (action === "suspend" && !until) { setError("La date de fin de suspension est obligatoire."); return; }

    try {
      if (action === "suspend")        { await suspend.mutateAsync({ userId: id, reason: reason.trim(), until }); toast({ title: "Utilisateur suspendu." }); }
      else if (action === "unsuspend") { await unsuspend.mutateAsync(id); toast({ title: "Suspension levée." }); }
      else if (action === "ban")       { await ban.mutateAsync({ userId: id, reason: reason.trim() }); toast({ title: "Utilisateur banni." }); }
      else                             { await unban.mutateAsync(id); toast({ title: "Bannissement levé." }); }
      handleClose();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Une erreur est survenue.");
    }
  };

  const needsReason = action === "suspend" || action === "ban";
  const needsUntil  = action === "suspend";

  const actionVariant: Record<ActionType, { label: string; color: string }> = {
    suspend:   { label: "Suspendre",           color: "text-amber-600" },
    unsuspend: { label: "Lever la suspension", color: "text-emerald-600" },
    ban:       { label: "Bannir",              color: "text-red-600" },
    unban:     { label: "Débannir",            color: "text-blue-600" },
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2.5 text-sm">
            <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
              <Shield size={15} className="text-slate-600" />
            </div>
            Modération — {user ? user.username : "Utilisateur"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-1">
          {user ? (
            <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 border border-slate-200">
              <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary flex-shrink-0">
                {user.username.slice(0, 2).toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-slate-800 truncate">{user.username}</p>
                <p className="text-xs text-slate-500 truncate">{user.email} · ID #{user.id}</p>
              </div>
            </div>
          ) : (
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">ID utilisateur *</Label>
              <Input
                type="number"
                placeholder="Ex: 42"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                className="h-9"
              />
            </div>
          )}

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Action *</Label>
            <Select value={action} onValueChange={(v) => setAction(v as ActionType)}>
              <SelectTrigger className="h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="suspend">
                  <span className="text-amber-600 font-medium">Suspendre</span>
                </SelectItem>
                <SelectItem value="unsuspend">
                  <span className="text-emerald-600 font-medium">Lever la suspension</span>
                </SelectItem>
                <SelectItem value="ban">
                  <span className="text-red-600 font-medium">Bannir</span>
                </SelectItem>
                <SelectItem value="unban">
                  <span className="text-blue-600 font-medium">Débannir</span>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {needsReason && (
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Raison *</Label>
              <Textarea
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
              <Label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Fin de suspension *</Label>
              <Input
                type="datetime-local"
                value={until}
                onChange={(e) => setUntil(e.target.value)}
                className="h-9"
              />
            </div>
          )}

          {error && (
            <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              <XCircle size={14} className="flex-shrink-0" /> {error}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={isPending}>Annuler</Button>
          <Button onClick={handleSubmit} disabled={isPending} className="gap-1.5">
            {isPending ? <Loader2 size={13} className="animate-spin" /> : <Shield size={13} />}
            {actionVariant[action].label}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ── Audit Logs Section ─────────────────────────────────────────────────────────

const ACTION_META: Record<string, { label: string; color: string; dot: string }> = {
  USER_SUSPENDED:     { label: "Suspension",       color: "bg-amber-100 text-amber-700",   dot: "bg-amber-400" },
  USER_UNSUSPENDED:   { label: "Levée suspension", color: "bg-emerald-100 text-emerald-700", dot: "bg-emerald-400" },
  USER_BANNED:        { label: "Bannissement",     color: "bg-red-100 text-red-600",       dot: "bg-red-500" },
  USER_UNBANNED:      { label: "Débannissement",   color: "bg-blue-100 text-blue-700",     dot: "bg-blue-400" },
  KYC_APPROVED:       { label: "KYC approuvé",     color: "bg-emerald-100 text-emerald-700", dot: "bg-emerald-400" },
  KYC_REJECTED:       { label: "KYC rejeté",       color: "bg-red-100 text-red-600",       dot: "bg-red-500" },
  PAYMENT_RELEASED:   { label: "Paiement libéré",  color: "bg-primary/10 text-primary",   dot: "bg-primary" },
  DISPUTE_RESOLVED:   { label: "Litige résolu",    color: "bg-emerald-100 text-emerald-700", dot: "bg-emerald-400" },
  WITHDRAWAL_APPROVED:{ label: "Retrait approuvé", color: "bg-emerald-100 text-emerald-700", dot: "bg-emerald-400" },
  WITHDRAWAL_REJECTED:{ label: "Retrait rejeté",   color: "bg-red-100 text-red-600",       dot: "bg-red-500" },
};
const DEFAULT_META = { label: "Action", color: "bg-slate-100 text-slate-600", dot: "bg-slate-400" };

function AuditLogsSection({ search }: { search: string }) {
  const [page, setPage] = useState(1);
  const [actionFilter, setActionFilter] = useState("__all__");
  const [filters, setFilters] = useState<AuditLogFilters>({});
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
          <SelectTrigger className="w-[220px] h-9 text-sm bg-white">
            <SelectValue placeholder="Toutes les actions" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__all__">Toutes les actions</SelectItem>
            {Object.entries(ACTION_META).map(([k, v]) => (
              <SelectItem key={k} value={k}>{v.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {isFetching && <Loader2 size={14} className="animate-spin text-slate-400" />}
        <span className="text-xs text-slate-500 ml-auto">
          {data ? `${fmt(data.count)} entrée${data.count !== 1 ? "s" : ""}` : ""}
        </span>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="animate-spin text-primary" size={28} />
        </div>
      ) : logs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-14 text-slate-400">
          <ClipboardList size={32} className="mb-3 opacity-40" />
          <p className="text-sm">Aucun log d'audit pour ce filtre.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {logs.map((log, i) => {
            const meta = ACTION_META[log.action] ?? DEFAULT_META;
            return (
              <motion.div
                key={log.id}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.025 }}
                className="flex items-start gap-3 p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm transition-all"
              >
                <div className={`w-2.5 h-2.5 rounded-full mt-1.5 flex-shrink-0 ${meta.dot}`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-2">
                      <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${meta.color}`}>
                        {meta.label}
                      </span>
                      {log.resource_type && (
                        <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4 bg-slate-100 text-slate-500 border-0">
                          {log.resource_type}
                        </Badge>
                      )}
                    </div>
                    <span className="text-[11px] text-slate-400">
                      {new Date(log.created_at).toLocaleDateString("fr-FR", {
                        day: "2-digit", month: "short", year: "numeric",
                        hour: "2-digit", minute: "2-digit",
                      })}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Par{" "}
                    <span className="font-medium text-slate-700">
                      {log.username ?? `user#${log.user}`}
                    </span>
                    {log.resource_id && (
                      <span> · Ressource <span className="font-medium text-slate-700">#{log.resource_id}</span></span>
                    )}
                    {log.ip_address && (
                      <span className="ml-2 bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded text-[10px] font-mono">
                        {log.ip_address}
                      </span>
                    )}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-2 border-t border-slate-200">
          <p className="text-xs text-slate-400">Page {page} / {totalPages}</p>
          <div className="flex gap-1">
            <Button variant="outline" size="sm" className="h-8 w-8 p-0 border-slate-200"
              onClick={() => setPage((p) => p - 1)} disabled={page === 1 || isFetching}>
              <ChevronLeft size={13} />
            </Button>
            <Button variant="outline" size="sm" className="h-8 w-8 p-0 border-slate-200"
              onClick={() => setPage((p) => p + 1)} disabled={page >= totalPages || isFetching}>
              <ChevronRight size={13} />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── KYC Detail Modal ──────────────────────────────────────────────────────────

function KycDetailModal({
  profileId,
  open,
  onClose,
}: {
  profileId: number | null;
  open: boolean;
  onClose: () => void;
}) {
  const [decision, setDecision] = useState<"approve" | "reject">("approve");
  const [rejectionReason, setRejectionReason] = useState("");
  const [error, setError] = useState("");

  const { data: detail, isLoading } = useAdminKycDetail(open ? profileId : null);
  const { mutate: review, isPending } = useAdminKycReview();
  const { toast } = useToast();

  const handleClose = () => {
    setDecision("approve");
    setRejectionReason("");
    setError("");
    onClose();
  };

  const handleReview = () => {
    if (!profileId) return;
    if (decision === "reject" && !rejectionReason.trim()) {
      setError("Le motif de rejet est obligatoire.");
      return;
    }
    setError("");
    review(
      { profileId, decision, rejection_reason: rejectionReason.trim() || undefined },
      {
        onSuccess: () => {
          toast({ title: decision === "approve" ? "KYC approuvé." : "KYC rejeté." });
          handleClose();
        },
        onError: (err) => setError(err instanceof ApiError ? err.message : "Une erreur est survenue."),
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-0">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
              <UserCheck size={15} className="text-emerald-600" />
            </div>
            <div>
              <h2 className="font-semibold text-sm text-slate-800">Dossier KYC</h2>
              {detail && (
                <p className="text-xs text-slate-400">
                  {detail.provider_kind === "AGENCY" ? "Agence" : "Freelance"} · Profil #{detail.id}
                </p>
              )}
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="animate-spin text-primary" size={28} />
          </div>
        ) : detail ? (
          <div className="p-6 space-y-6">

            {/* Identité */}
            <div className="flex items-start gap-4">
              {detail.profile_picture ? (
                <img
                  src={detail.profile_picture}
                  alt={detail.username}
                  className="w-16 h-16 rounded-xl object-cover border border-slate-200 flex-shrink-0"
                />
              ) : (
                <div className="w-16 h-16 rounded-xl bg-slate-100 flex items-center justify-center text-xl font-bold text-slate-500 flex-shrink-0">
                  {detail.username.slice(0, 2).toUpperCase()}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-bold text-slate-900 text-base">
                    {detail.freelance_first_name
                      ? `${detail.freelance_first_name} ${detail.freelance_last_name}`
                      : detail.agency_name ?? detail.username}
                  </h3>
                  <Badge className={`text-[10px] border-0 ${detail.provider_kind === "AGENCY" ? "bg-violet-100 text-violet-700" : "bg-blue-100 text-blue-700"}`}>
                    {detail.provider_kind === "AGENCY" ? "Agence" : "Freelance"}
                  </Badge>
                  <Badge className={`text-[10px] border-0 ${
                    detail.kyc_status === "PENDING" ? "bg-amber-100 text-amber-700" :
                    detail.kyc_status === "VERIFIED" ? "bg-emerald-100 text-emerald-700" :
                    detail.kyc_status === "REJECTED" ? "bg-red-100 text-red-600" :
                    "bg-slate-100 text-slate-500"
                  }`}>
                    {detail.kyc_status}
                  </Badge>
                </div>
                <p className="text-sm text-slate-500 mt-0.5">@{detail.username} · {detail.email}</p>
                {detail.freelance_business_name && (
                  <p className="text-xs text-slate-400 mt-0.5">Entreprise : {detail.freelance_business_name}</p>
                )}
                {detail.agency_founded_at && (
                  <p className="text-xs text-slate-400 mt-0.5">Fondée le {fmtDate(detail.agency_founded_at)}</p>
                )}
              </div>
            </div>

            {/* Coordonnées */}
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">Coordonnées</p>
              <div className="grid grid-cols-2 gap-2">
                {detail.city_or_region && (
                  <div className="flex items-center gap-2 text-sm text-slate-600 p-3 rounded-lg bg-slate-50">
                    <MapPin size={14} className="text-slate-400 flex-shrink-0" />
                    {detail.city_or_region}, {detail.country}
                  </div>
                )}
                {detail.phone && (
                  <div className="flex items-center gap-2 text-sm text-slate-600 p-3 rounded-lg bg-slate-50">
                    <Phone size={14} className="text-slate-400 flex-shrink-0" />
                    {detail.phone}
                  </div>
                )}
                {detail.linkedin_url && (
                  <a href={detail.linkedin_url} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-blue-600 p-3 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors">
                    <Linkedin size={14} className="flex-shrink-0" />
                    LinkedIn
                    <ExternalLink size={11} className="ml-auto" />
                  </a>
                )}
                {detail.website_url && (
                  <a href={detail.website_url} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-slate-600 p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors">
                    <Globe size={14} className="text-slate-400 flex-shrink-0" />
                    Site web
                    <ExternalLink size={11} className="ml-auto" />
                  </a>
                )}
              </div>
            </div>

            {/* Profil professionnel */}
            {(detail.bio || detail.years_of_experience || detail.hourly_rate) && (
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">Profil professionnel</p>
                <div className="space-y-2">
                  {detail.years_of_experience && (
                    <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50">
                      <span className="text-sm text-slate-500">Expérience</span>
                      <span className="text-sm font-medium text-slate-800">{detail.years_of_experience} ans</span>
                    </div>
                  )}
                  {detail.hourly_rate && (
                    <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50">
                      <span className="text-sm text-slate-500">Taux horaire</span>
                      <span className="text-sm font-medium text-slate-800">{parseFloat(detail.hourly_rate).toLocaleString("fr-FR")} GNF/h</span>
                    </div>
                  )}
                  {detail.bio && (
                    <div className="p-3 rounded-lg bg-slate-50">
                      <p className="text-xs text-slate-400 mb-1">Bio</p>
                      <p className="text-sm text-slate-700 leading-relaxed">{detail.bio}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Documents provider (freelance) */}
            {detail.documents.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">
                  Documents soumis ({detail.documents.length})
                </p>
                <div className="space-y-2">
                  {detail.documents.map((doc) => (
                    <div key={doc.id} className="flex items-center justify-between p-3 rounded-lg border border-slate-200 bg-white hover:border-slate-300 transition-colors">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                          <FileIcon size={14} className="text-blue-600" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-slate-800 truncate">
                            {doc.title || doc.doc_type_display}
                          </p>
                          <p className="text-[11px] text-slate-400">
                            {doc.doc_type_display}
                            {doc.reference_number && ` · Réf: ${doc.reference_number}`}
                            {doc.issued_at && ` · Émis le ${fmtDate(doc.issued_at)}`}
                          </p>
                        </div>
                      </div>
                      {doc.file && (
                        <a href={doc.file} target="_blank" rel="noopener noreferrer">
                          <Button size="sm" variant="outline" className="gap-1.5 h-7 text-xs border-slate-200 flex-shrink-0">
                            <Download size={11} /> Voir
                          </Button>
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Documents agence */}
            {detail.agency_documents.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">
                  Documents agence ({detail.agency_documents.length})
                </p>
                <div className="space-y-2">
                  {detail.agency_documents.map((doc) => (
                    <div key={doc.id} className="flex items-center justify-between p-3 rounded-lg border border-slate-200 bg-white hover:border-slate-300 transition-colors">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-violet-50 flex items-center justify-center flex-shrink-0">
                          <FileIcon size={14} className="text-violet-600" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-slate-800">{doc.doc_type_display}</p>
                          {doc.reference_number && (
                            <p className="text-[11px] text-slate-400">Réf: {doc.reference_number}</p>
                          )}
                        </div>
                      </div>
                      {doc.file && (
                        <a href={doc.file} target="_blank" rel="noopener noreferrer">
                          <Button size="sm" variant="outline" className="gap-1.5 h-7 text-xs border-slate-200 flex-shrink-0">
                            <Download size={11} /> Voir
                          </Button>
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {detail.documents.length === 0 && detail.agency_documents.length === 0 && (
              <div className="flex items-center gap-2 p-4 rounded-lg bg-amber-50 border border-amber-200">
                <AlertTriangle size={14} className="text-amber-600 flex-shrink-0" />
                <p className="text-sm text-amber-700">Aucun document soumis par ce prestataire.</p>
              </div>
            )}

            {/* Décision KYC */}
            <div className="border-t border-slate-200 pt-5 space-y-4">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Décision</p>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setDecision("approve")}
                  className={`flex items-center gap-2 p-3 rounded-lg border text-sm font-medium transition-all ${
                    decision === "approve"
                      ? "border-emerald-300 bg-emerald-50 text-emerald-700"
                      : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                  }`}
                >
                  <CheckCircle2 size={15} /> Approuver
                </button>
                <button
                  onClick={() => setDecision("reject")}
                  className={`flex items-center gap-2 p-3 rounded-lg border text-sm font-medium transition-all ${
                    decision === "reject"
                      ? "border-red-300 bg-red-50 text-red-700"
                      : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                  }`}
                >
                  <XCircle size={15} /> Rejeter
                </button>
              </div>

              {decision === "reject" && (
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Motif de rejet *</Label>
                  <Textarea
                    rows={3}
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    placeholder="Expliquez pourquoi le KYC est rejeté…"
                    className="resize-none"
                  />
                </div>
              )}

              {error && (
                <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                  <XCircle size={14} /> {error}
                </div>
              )}

              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={handleClose} disabled={isPending}>Annuler</Button>
                <Button
                  onClick={handleReview}
                  disabled={isPending}
                  className={`gap-1.5 ${decision === "reject" ? "bg-red-600 hover:bg-red-700" : "bg-emerald-600 hover:bg-emerald-700"}`}
                >
                  {isPending ? <Loader2 size={13} className="animate-spin" /> : decision === "approve" ? <CheckCircle2 size={13} /> : <XCircle size={13} />}
                  {decision === "approve" ? "Approuver le KYC" : "Rejeter le KYC"}
                </Button>
              </div>
            </div>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}

// ── KYC Section ───────────────────────────────────────────────────────────────

function KycSection() {
  const [selectedProfileId, setSelectedProfileId] = useState<number | null>(null);
  const [manualProfileId, setManualProfileId] = useState("");

  const { data, isLoading, isError } = useAdminKycPending();
  const profiles = data?.results ?? [];

  return (
    <div className="space-y-4">
      {isError && (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-50 border border-amber-200">
          <AlertTriangle size={15} className="text-amber-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-semibold text-amber-800 text-sm">Endpoint liste KYC non disponible</p>
            <p className="text-amber-700 mt-0.5 text-xs">
              Vous pouvez néanmoins réviser un profil par ID.
            </p>
          </div>
        </div>
      )}

      {isLoading && (
        <div className="flex items-center gap-2 text-sm text-slate-400 py-4">
          <Loader2 size={14} className="animate-spin" /> Chargement…
        </div>
      )}

      {!isLoading && !isError && (
        profiles.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-14 text-slate-400">
            <CheckCircle2 size={28} className="mb-2 opacity-40" />
            <p className="text-sm">Aucun profil en attente de validation KYC.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {profiles.map((profile) => (
              <div key={profile.id} className="flex items-center justify-between p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm transition-all">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-sm font-bold text-slate-600">
                    {profile.username.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{profile.username}</p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {profile.email} · Soumis le {fmtDate(profile.submitted_at ?? "")}
                    </p>
                  </div>
                </div>
                <Button
                  size="sm"
                  className="gap-1.5 bg-primary hover:bg-primary/90"
                  onClick={() => setSelectedProfileId(profile.id)}
                >
                  <UserCheck size={13} /> Voir le dossier
                </Button>
              </div>
            ))}
          </div>
        )
      )}

      {/* Accès manuel par ID */}
      <div className="flex items-center gap-2 pt-2 border-t border-slate-200">
        <Input
          placeholder="ID profil…"
          value={manualProfileId}
          onChange={(e) => setManualProfileId(e.target.value)}
          className="h-8 w-32 text-sm"
          type="number"
        />
        <Button
          size="sm"
          variant="outline"
          className="gap-1.5 border-slate-200"
          disabled={!manualProfileId}
          onClick={() => {
            const id = parseInt(manualProfileId, 10);
            if (!isNaN(id)) { setSelectedProfileId(id); setManualProfileId(""); }
          }}
        >
          <UserCheck size={13} /> Ouvrir par ID
        </Button>
      </div>

      {/* Modal détail */}
      <KycDetailModal
        profileId={selectedProfileId}
        open={selectedProfileId !== null}
        onClose={() => setSelectedProfileId(null)}
      />
    </div>
  );
}

// ── Disputes Section ──────────────────────────────────────────────────────────

function DisputesSection() {
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
        onSuccess: () => { toast({ title: "Litige résolu." }); setResolveOpen(false); },
        onError: (err) => setError(err instanceof ApiError ? err.message : "Une erreur est survenue."),
      }
    );
  };

  return (
    <div className="space-y-4">
      {isError && (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-50 border border-amber-200">
          <AlertTriangle size={15} className="text-amber-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-semibold text-amber-800 text-sm">Endpoint liste litiges non disponible</p>
            <p className="text-amber-700 text-xs mt-0.5">
              Vous pouvez résoudre un litige en saisissant l'ID de contrat manuellement.
            </p>
          </div>
        </div>
      )}

      {isLoading && (
        <div className="flex items-center gap-2 text-sm text-slate-400 py-4">
          <Loader2 size={14} className="animate-spin" /> Chargement…
        </div>
      )}

      {!isLoading && !isError && (
        <>
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">{data?.count ?? 0} litige(s)</span>
            {isFetching && <Loader2 size={13} className="animate-spin text-slate-400" />}
          </div>
          {(data?.results ?? []).length === 0 ? (
            <div className="flex flex-col items-center justify-center py-14 text-slate-400">
              <CheckCircle2 size={28} className="mb-2 opacity-40" />
              <p className="text-sm">Aucun litige en attente.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {data!.results.map((d) => (
                <div key={d.id} className="flex items-center justify-between p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm transition-all">
                  <div className="min-w-0 flex-1 mr-4">
                    <p className="text-sm font-semibold text-slate-800 truncate">{d.contract_title ?? `Contrat #${d.contract}`}</p>
                    <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-2">
                      <span>Par {d.raised_by_username}</span>
                      <span>·</span>
                      <span>{fmtDate(d.created_at)}</span>
                      <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-700 text-[10px] font-medium">
                        {d.status_display}
                      </span>
                    </p>
                    {d.reason && <p className="text-xs text-slate-400 mt-1 italic truncate">{d.reason}</p>}
                  </div>
                  <Button size="sm" variant="outline" className="gap-1.5 flex-shrink-0 border-slate-200"
                    onClick={() => openResolve(d.contract)}>
                    <Scale size={13} /> Résoudre
                  </Button>
                </div>
              ))}
            </div>
          )}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-2 border-t border-slate-200">
              <p className="text-xs text-slate-400">Page {page} / {totalPages}</p>
              <div className="flex gap-1">
                <Button variant="outline" size="sm" className="h-7 w-7 p-0 border-slate-200"
                  onClick={() => setPage((p) => p - 1)} disabled={page === 1 || isFetching}>
                  <ChevronLeft size={13} />
                </Button>
                <Button variant="outline" size="sm" className="h-7 w-7 p-0 border-slate-200"
                  onClick={() => setPage((p) => p + 1)} disabled={page >= totalPages || isFetching}>
                  <ChevronRight size={13} />
                </Button>
              </div>
            </div>
          )}
        </>
      )}

      <div className="flex justify-end pt-2 border-t border-slate-200">
        <Button size="sm" className="gap-1.5" onClick={() => openResolve()}>
          <Scale size={13} /> Résoudre un litige par ID
        </Button>
      </div>

      <Dialog open={resolveOpen} onOpenChange={(v) => !v && setResolveOpen(false)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2.5 text-sm">
              <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
                <Scale size={15} className="text-slate-600" />
              </div>
              Résoudre un litige
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-1">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">ID contrat *</Label>
              <Input placeholder="UUID du contrat" value={contractId}
                onChange={(e) => setContractId(e.target.value)} className="h-9 font-mono text-sm" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Résolution *</Label>
              <Select value={resolution} onValueChange={(v) => setResolution(v as "client" | "provider" | "close")}>
                <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="client">En faveur du client</SelectItem>
                  <SelectItem value="provider">En faveur du prestataire</SelectItem>
                  <SelectItem value="close">Clore sans décision</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Note de résolution</Label>
              <Textarea rows={3} value={resolutionNote} onChange={(e) => setResolutionNote(e.target.value)}
                placeholder="Explication de la décision…" className="resize-none" />
            </div>
            {error && (
              <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                <XCircle size={14} /> {error}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setResolveOpen(false)} disabled={isPending}>Annuler</Button>
            <Button onClick={handleResolve} disabled={isPending} className="gap-1.5">
              {isPending ? <Loader2 size={13} className="animate-spin" /> : <CheckCircle2 size={13} />}
              Confirmer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ── Contracts Section ─────────────────────────────────────────────────────────

function ContractsSection() {
  const [contractId, setContractId] = useState("");
  const [action, setAction] = useState<"complete" | "cancel">("complete");
  const [error, setError] = useState("");

  const complete = useAdminCompleteContract();
  const cancel   = useAdminCancelContract();
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
    <div className="max-w-lg space-y-5">
      <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-3">
        <AlertTriangle size={15} className="text-amber-600 mt-0.5 flex-shrink-0" />
        <p className="text-sm text-amber-800">
          Ces actions sont <strong>irréversibles</strong>. À utiliser uniquement en cas de nécessité
          opérationnelle (litige non résolu, contrat bloqué…).
        </p>
      </div>

      <div className="space-y-4 p-5 rounded-xl border border-slate-200 bg-white">
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">ID contrat *</Label>
          <Input
            placeholder="UUID du contrat"
            value={contractId}
            onChange={(e) => { setContractId(e.target.value); setError(""); }}
            className="h-9 font-mono text-sm"
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Action *</Label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setAction("complete")}
              className={`flex items-center gap-2 p-3 rounded-lg border text-sm font-medium transition-all ${
                action === "complete"
                  ? "border-emerald-300 bg-emerald-50 text-emerald-700"
                  : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
              }`}
            >
              <CheckCircle2 size={15} />
              Clôturer
            </button>
            <button
              onClick={() => setAction("cancel")}
              className={`flex items-center gap-2 p-3 rounded-lg border text-sm font-medium transition-all ${
                action === "cancel"
                  ? "border-red-300 bg-red-50 text-red-700"
                  : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
              }`}
            >
              <XCircle size={15} />
              Annuler
            </button>
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
            <XCircle size={14} /> {error}
          </div>
        )}

        <Button
          onClick={handleSubmit}
          disabled={isPending || !contractId.trim()}
          className={`gap-1.5 w-full ${action === "cancel" ? "bg-red-600 hover:bg-red-700" : ""}`}
        >
          {isPending
            ? <Loader2 size={13} className="animate-spin" />
            : action === "complete" ? <CheckCircle2 size={13} /> : <XCircle size={13} />
          }
          {action === "complete" ? "Clôturer le contrat" : "Annuler le contrat"}
        </Button>
      </div>
    </div>
  );
}

// ── Ranking Section ───────────────────────────────────────────────────────────

function RankingSection() {
  const [providerId, setProviderId] = useState("");
  const [adjustment, setAdjustment] = useState("");
  const [adjustReason, setAdjustReason] = useState("");
  const [error, setError] = useState("");

  const recalculate = useAdminRankingRecalculate();
  const snapshot    = useAdminRankingSnapshot();
  const adjust      = useAdminRankingAdjust();
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
    const id  = parseInt(providerId, 10);
    const val = parseFloat(adjustment);
    if (!providerId || isNaN(id))     { setError("ID provider invalide."); return; }
    if (adjustment === "" || isNaN(val)) { setError("Valeur d'ajustement invalide."); return; }
    if (!adjustReason.trim())         { setError("La raison est obligatoire."); return; }
    setError("");
    adjust.mutate(
      { providerId: id, score_adjustment: val, reason: adjustReason.trim() },
      {
        onSuccess: () => {
          toast({ title: "Score ajusté.", description: `Provider #${id} mis à jour.` });
          setProviderId(""); setAdjustment(""); setAdjustReason("");
        },
        onError: (err) => setError(err instanceof ApiError ? err.message : "Une erreur est survenue."),
      }
    );
  };

  return (
    <div className="space-y-6">
      {/* Global actions */}
      <div>
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">Actions globales</p>
        <div className="grid sm:grid-cols-2 gap-3">
          <div className="p-5 rounded-xl border border-slate-200 bg-white space-y-3">
            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                <RefreshCw size={15} className="text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-800">Recalculer tous les classements</p>
                <p className="text-xs text-slate-400 mt-0.5">Recalcule les scores de tous les providers.</p>
              </div>
            </div>
            <Button size="sm" className="gap-1.5 w-full" onClick={handleRecalculate} disabled={recalculate.isPending}>
              {recalculate.isPending ? <Loader2 size={13} className="animate-spin" /> : <RefreshCw size={13} />}
              Lancer le recalcul
            </Button>
          </div>
          <div className="p-5 rounded-xl border border-slate-200 bg-white space-y-3">
            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-8 h-8 rounded-lg bg-violet-50 flex items-center justify-center">
                <Trophy size={15} className="text-violet-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-800">Calculer un snapshot</p>
                <p className="text-xs text-slate-400 mt-0.5">Photo de la situation pour l'historique.</p>
              </div>
            </div>
            <Button size="sm" variant="outline" className="gap-1.5 w-full border-slate-200" onClick={handleSnapshot} disabled={snapshot.isPending}>
              {snapshot.isPending ? <Loader2 size={13} className="animate-spin" /> : <Trophy size={13} />}
              Calculer le snapshot
            </Button>
          </div>
        </div>
      </div>

      {/* Manual adjustment */}
      <div>
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">Ajustement manuel d'un score</p>
        <div className="max-w-md p-5 rounded-xl border border-slate-200 bg-white space-y-4">
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">User ID du provider *</Label>
            <Input type="number" placeholder="Ex: 42" value={providerId}
              onChange={(e) => { setProviderId(e.target.value); setError(""); }} className="h-9" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Ajustement de score *</Label>
            <Input type="number" step="0.1" placeholder="Ex: 5 ou -3.5" value={adjustment}
              onChange={(e) => { setAdjustment(e.target.value); setError(""); }} className="h-9" />
            <p className="text-xs text-slate-400">Valeur positive = bonus · Valeur négative = malus</p>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Raison *</Label>
            <Textarea rows={2} value={adjustReason} onChange={(e) => setAdjustReason(e.target.value)}
              placeholder="Motif de l'ajustement…" className="resize-none" />
          </div>
          {error && (
            <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              <XCircle size={14} /> {error}
            </div>
          )}
          <Button onClick={handleAdjust} disabled={adjust.isPending} className="gap-1.5 w-full">
            {adjust.isPending ? <Loader2 size={13} className="animate-spin" /> : <Trophy size={13} />}
            Appliquer l'ajustement
          </Button>
        </div>
      </div>
    </div>
  );
}

// ── Overview Section ──────────────────────────────────────────────────────────

function OverviewSection({
  stats,
  isLoading,
}: {
  stats: ReturnType<typeof useAdminStats>["data"];
  isLoading: boolean;
}) {
  if (isLoading) {
    return (
      <div className="flex justify-center py-24">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="animate-spin text-primary" size={32} />
          <p className="text-sm text-slate-400">Chargement des statistiques…</p>
        </div>
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="space-y-6">
      {/* KPI Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        <KpiCard
          index={0} label="Utilisateurs" value={fmt(stats.users.total)}
          sub={`+${stats.users.new_today} auj.`}
          icon={Users} borderColor="border-l-blue-500"
          iconBg="bg-blue-50" iconColor="text-blue-600"
          trend="up" trendLabel={`+${stats.users.new_this_week}`}
        />
        <KpiCard
          index={1} label="Projets publiés" value={fmt(stats.projects.total_published)}
          sub={`+${stats.projects.new_this_week} sem.`}
          icon={Briefcase} borderColor="border-l-violet-500"
          iconBg="bg-violet-50" iconColor="text-violet-600"
          trend="up" trendLabel={`+${stats.projects.new_this_week}`}
        />
        <KpiCard
          index={2} label="Contrats actifs" value={fmt(stats.projects.contracts_active)}
          sub={`${stats.projects.contracts_completed_this_month} complétés`}
          icon={FileText} borderColor="border-l-emerald-500"
          iconBg="bg-emerald-50" iconColor="text-emerald-600"
          trend="neutral"
        />
        <KpiCard
          index={3} label="Volume mensuel"
          value={`${(stats.payments.volume_this_month / 1_000_000).toFixed(1)}M`}
          sub={`${stats.payments.success_count_this_month} paiements`}
          icon={CreditCard} borderColor="border-l-primary"
          iconBg="bg-primary/8" iconColor="text-primary"
          trend="up" trendLabel={`${stats.payments.success_count_this_month}`}
        />
        <KpiCard
          index={4} label="Litiges ouverts"
          value={stats.disputes.open + stats.disputes.under_review}
          sub={`${stats.disputes.open} ouverts`}
          icon={AlertTriangle}
          borderColor={stats.disputes.open > 0 ? "border-l-red-500" : "border-l-slate-300"}
          iconBg={stats.disputes.open > 0 ? "bg-red-50" : "bg-slate-50"}
          iconColor={stats.disputes.open > 0 ? "text-red-500" : "text-slate-400"}
          trend={stats.disputes.open > 0 ? "down" : "neutral"}
        />
        <KpiCard
          index={5} label="Abonnements" value={fmt(stats.subscriptions.active_total)}
          sub={`${Object.keys(stats.subscriptions.by_tier).length} tier(s)`}
          icon={Crown} borderColor="border-l-amber-500"
          iconBg="bg-amber-50" iconColor="text-amber-600"
          trend="up" trendLabel={`${stats.subscriptions.active_total}`}
        />
      </div>

      {/* Stats cards */}
      <div className="grid lg:grid-cols-2 gap-5">
        <SectionCard title="Activité cette semaine" icon={Activity}>
          <StatRow label="Nouveaux projets"       value={fmt(stats.projects.new_this_week)}    highlight="success" />
          <StatRow label="Propositions envoyées"  value={fmt(stats.projects.proposals_this_week)} />
          <StatRow label="Nouveaux utilisateurs"  value={fmt(stats.users.new_this_week)}       highlight="success" />
          <StatRow label="Contrats complétés (mois)" value={fmt(stats.projects.contracts_completed_this_month)} />
        </SectionCard>

        <SectionCard
          title="Paiements ce mois"
          icon={CreditCard}
          action={
            <span className="text-xs font-bold text-primary tabular-nums">
              {(stats.payments.volume_this_month / 1_000_000).toFixed(2)}M GNF
            </span>
          }
        >
          <StatRow label="Volume total"
            value={`${fmt(stats.payments.volume_this_month)} GNF`}
            highlight="success" />
          <StatRow label="Paiements réussis"
            value={
              <span className="flex items-center gap-1">
                <CheckCircle2 size={12} className="text-emerald-500" />
                {fmt(stats.payments.success_count_this_month)}
              </span>
            }
            highlight="success" />
          <StatRow label="Paiements échoués"
            value={
              <span className="flex items-center gap-1">
                <XCircle size={12} className={stats.payments.failed_count_this_month > 0 ? "text-red-500" : "text-slate-300"} />
                {fmt(stats.payments.failed_count_this_month)}
              </span>
            }
            highlight={stats.payments.failed_count_this_month > 0 ? "danger" : "muted"} />
        </SectionCard>

        <SectionCard title="Litiges" icon={AlertTriangle}>
          <StatRow label="Ouverts"
            value={
              <span className="flex items-center gap-1.5">
                {stats.disputes.open > 0 && <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />}
                {fmt(stats.disputes.open)}
              </span>
            }
            highlight={stats.disputes.open > 0 ? "danger" : "muted"} />
          <StatRow label="En revue"         value={fmt(stats.disputes.under_review)}       highlight="warning" />
          <StatRow label="Résolus ce mois"  value={fmt(stats.disputes.resolved_this_month)} highlight="success" />
        </SectionCard>

        <SectionCard
          title="Abonnements actifs par tier"
          icon={Crown}
          action={
            <Badge variant="secondary" className="text-xs bg-slate-100 text-slate-600 border-0">
              Total : {fmt(stats.subscriptions.active_total)}
            </Badge>
          }
        >
          {Object.keys(stats.subscriptions.by_tier).length === 0 ? (
            <p className="text-sm text-slate-400 py-2">Aucun abonnement actif.</p>
          ) : (
            <div className="space-y-3">
              {Object.entries(stats.subscriptions.by_tier).map(([tier, count]) => {
                const pct = stats.subscriptions.active_total
                  ? Math.round(((count as number) / stats.subscriptions.active_total) * 100)
                  : 0;
                return (
                  <div key={tier}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm font-medium text-slate-700 capitalize">
                        {tier.replace(/_/g, " ")}
                      </span>
                      <span className="text-sm font-bold text-slate-900 tabular-nums">{count as number}</span>
                    </div>
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ delay: 0.5, duration: 0.6, ease: "easeOut" }}
                      />
                    </div>
                    <p className="text-[10px] text-slate-400 mt-0.5">{pct}% des abonnements</p>
                  </div>
                );
              })}
            </div>
          )}
        </SectionCard>
      </div>
    </div>
  );
}

// ── Main Dashboard ─────────────────────────────────────────────────────────────

const AdminDashboard = () => {
  const [section, setSection] = useState<Section>("overview");
  const [search, setSearch] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const { data: stats, isLoading: statsLoading, refetch: refetchStats } = useAdminStats();
  const { data: pendingData } = useAdminPendingWithdrawals();
  const { data: kycData } = useAdminKycPending();
  const { data: disputeData } = useAdminDisputeList();

  const pendingWithdrawals = pendingData?.count ?? 0;
  const openDisputes       = disputeData ? (disputeData.count ?? 0) : (stats?.disputes.open ?? 0);
  const pendingKyc         = kycData?.count ?? 0;

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetchStats();
    setIsRefreshing(false);
  };

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "#f1f5f9" }}>
      {/* Sidebar */}
      <AdminSidebar
        active={section}
        onNavigate={(s) => { setSection(s); setSearch(""); }}
        pendingWithdrawals={pendingWithdrawals}
        openDisputes={openDisputes}
        pendingKyc={pendingKyc}
      />

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <AdminTopbar
          section={section}
          onRefresh={handleRefresh}
          isRefreshing={isRefreshing}
          pendingWithdrawals={pendingWithdrawals}
          searchValue={search}
          onSearch={setSearch}
        />

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={section}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18 }}
            >
              {section === "overview" && (
                <OverviewSection stats={stats} isLoading={statsLoading} />
              )}

              {section === "users" && (
                <UsersSection />
              )}

              {section === "kyc" && (
                <Card className="p-6 shadow-sm bg-white">
                  <div className="flex items-center gap-2.5 mb-5">
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
                      <UserCheck size={15} className="text-emerald-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm text-slate-800">Validation KYC</h3>
                      <p className="text-xs text-slate-400">Approuver ou rejeter les profils en attente</p>
                    </div>
                  </div>
                  <KycSection />
                </Card>
              )}

              {section === "disputes" && (
                <Card className="p-6 shadow-sm bg-white">
                  <div className="flex items-center gap-2.5 mb-5">
                    <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center">
                      <Scale size={15} className="text-amber-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm text-slate-800">Litiges</h3>
                      <p className="text-xs text-slate-400">Résoudre les litiges entre clients et prestataires</p>
                    </div>
                  </div>
                  <DisputesSection />
                </Card>
              )}

              {section === "contracts" && (
                <Card className="p-6 shadow-sm bg-white">
                  <div className="flex items-center gap-2.5 mb-5">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                      <FileCheck2 size={15} className="text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm text-slate-800">Actions contrats</h3>
                      <p className="text-xs text-slate-400">Clôturer ou annuler un contrat bloqué</p>
                    </div>
                  </div>
                  <ContractsSection />
                </Card>
              )}

              {section === "ranking" && (
                <Card className="p-6 shadow-sm bg-white">
                  <div className="flex items-center gap-2.5 mb-5">
                    <div className="w-8 h-8 rounded-lg bg-violet-50 flex items-center justify-center">
                      <Trophy size={15} className="text-violet-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm text-slate-800">Maintenance classement</h3>
                      <p className="text-xs text-slate-400">Recalcul des scores, snapshots et ajustements manuels</p>
                    </div>
                  </div>
                  <RankingSection />
                </Card>
              )}

              {section === "audit" && (
                <Card className="p-6 shadow-sm bg-white">
                  <div className="flex items-center gap-2.5 mb-5">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
                      <ClipboardList size={15} className="text-slate-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm text-slate-800">Journal d'audit</h3>
                      <p className="text-xs text-slate-400">Historique de toutes les actions administratives</p>
                    </div>
                  </div>
                  <AuditLogsSection search={search} />
                </Card>
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
