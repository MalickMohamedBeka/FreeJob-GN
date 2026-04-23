import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import {
  Loader2, ChevronLeft, ChevronRight, ArrowLeft, CheckCircle2,
  XCircle, Clock, Wallet, Briefcase, Phone, Building2, MapPin,
  ShieldCheck, ShieldAlert, ShieldX, Shield, TrendingUp, ArrowUpRight,
  CalendarDays, AlertTriangle, Ban, UserCheck,
} from "lucide-react";
import {
  useAdminPendingWithdrawals, useApproveWithdrawal, useRejectWithdrawal,
} from "@/hooks/useWallet";
import { toast } from "@/hooks";
import { ApiError } from "@/services/api.service";
import { ROUTES } from "@/constants/routes";
import type { ApiWithdrawalRequest } from "@/types";

// ── Helpers ────────────────────────────────────────────────────────────────────

const fmt = (v: string | number) => parseFloat(String(v)).toLocaleString("fr-FR");

const fmtDate = (s: string, short = false) =>
  new Date(s).toLocaleDateString("fr-FR", short
    ? { day: "2-digit", month: "short", year: "numeric" }
    : { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }
  );

const PAYOUT_LABELS: Record<string, string> = {
  MOBILE_MONEY: "Mobile Money",
  BANK_TRANSFER: "Virement bancaire",
};

const KIND_LABELS: Record<string, string> = {
  FREELANCE: "Freelance",
  AGENCY: "Agence",
};

// ── KYC Badge ─────────────────────────────────────────────────────────────────

function KycBadge({ status }: { status?: string | null }) {
  if (!status) return null;
  const cfg: Record<string, { label: string; className: string; icon: React.ElementType }> = {
    VERIFIED:   { label: "KYC Vérifié",    className: "bg-emerald-50 text-emerald-700 border-emerald-200", icon: ShieldCheck },
    PENDING:    { label: "KYC En attente", className: "bg-amber-50 text-amber-700 border-amber-200",     icon: Shield },
    UNVERIFIED: { label: "Non vérifié",    className: "bg-slate-100 text-slate-600 border-slate-200",    icon: ShieldAlert },
    REJECTED:   { label: "KYC Rejeté",    className: "bg-red-50 text-red-700 border-red-200",           icon: ShieldX },
  };
  const c = cfg[status] ?? cfg.UNVERIFIED;
  const Icon = c.icon;
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[11px] font-semibold ${c.className}`}>
      <Icon size={11} /> {c.label}
    </span>
  );
}

// ── Account Status Alert ───────────────────────────────────────────────────────

function AccountAlert({ w }: { w: ApiWithdrawalRequest }) {
  if (w.is_banned) return (
    <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700 font-medium">
      <Ban size={13} className="flex-shrink-0" />
      Ce compte est banni — vérifier avant d'approuver.
    </div>
  );
  if (w.is_suspended) return (
    <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-700 font-medium">
      <AlertTriangle size={13} className="flex-shrink-0" />
      Ce compte est suspendu temporairement.
    </div>
  );
  if (w.kyc_status && w.kyc_status !== "VERIFIED") return (
    <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-50 border border-blue-200 text-xs text-blue-700 font-medium">
      <ShieldAlert size={13} className="flex-shrink-0" />
      KYC non vérifié — identité non confirmée.
    </div>
  );
  return null;
}

// ── Stat Chip ─────────────────────────────────────────────────────────────────

function StatChip({
  icon: Icon, label, value, sub, accent,
}: {
  icon: React.ElementType; label: string; value: string; sub?: string; accent?: string;
}) {
  return (
    <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-100">
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${accent ?? "bg-slate-200"}`}>
        <Icon size={14} className="text-white" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[10px] text-slate-400 uppercase tracking-wide font-medium leading-none mb-0.5">{label}</p>
        <p className="text-sm font-bold text-slate-900 leading-tight break-all">{value}</p>
        {sub && <p className="text-[10px] text-slate-400 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

// ── Reject Dialog ──────────────────────────────────────────────────────────────

function RejectDialog({ withdrawal, onClose }: {
  withdrawal: ApiWithdrawalRequest | null;
  onClose: () => void;
}) {
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");
  const reject = useRejectWithdrawal();

  const handleClose = () => { setReason(""); setError(""); onClose(); };

  const handleSubmit = async () => {
    setError("");
    if (!reason.trim()) { setError("Le motif de rejet est obligatoire."); return; }
    if (!withdrawal) return;
    try {
      await reject.mutateAsync({ id: withdrawal.id, data: { reason: reason.trim() } });
      toast({ title: "Demande rejetée." });
      handleClose();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Une erreur est survenue.");
    }
  };

  return (
    <Dialog open={!!withdrawal} onOpenChange={(v) => !v && handleClose()}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-sm flex items-center gap-2">
            <XCircle size={15} className="text-destructive" /> Rejeter la demande
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-3 py-1">
          {withdrawal?.username && (
            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200">
              <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary flex-shrink-0">
                {withdrawal.username.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-800">{withdrawal.username}</p>
                <p className="text-xs text-slate-500">{fmt(withdrawal.amount)} GNF demandés</p>
              </div>
            </div>
          )}
          <div className="space-y-1.5">
            <Label htmlFor="reject-reason" className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
              Motif du rejet *
            </Label>
            <Input
              id="reject-reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Expliquer la raison du rejet…"
              maxLength={255}
              className="h-9"
            />
          </div>
          {error && (
            <div className="flex items-center gap-2 text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              <XCircle size={12} /> {error}
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" size="sm" onClick={handleClose}>Annuler</Button>
          <Button variant="destructive" size="sm" onClick={handleSubmit} disabled={reject.isPending}>
            {reject.isPending && <Loader2 size={13} className="animate-spin mr-1.5" />}
            Confirmer le rejet
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ── Withdrawal Card ────────────────────────────────────────────────────────────

function WithdrawalCard({ w, onReject }: {
  w: ApiWithdrawalRequest;
  onReject: (w: ApiWithdrawalRequest) => void;
}) {
  const approve = useApproveWithdrawal();
  const details = w.payout_details as Record<string, string>;

  const handleApprove = async () => {
    try {
      await approve.mutateAsync(w.id);
      toast({ title: "Retrait approuvé avec succès." });
    } catch (err) {
      toast({
        title: "Erreur",
        description: err instanceof ApiError ? err.message : "Une erreur est survenue.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

      {/* ══ EN-TÊTE : identité + montant ══════════════════════ */}
      <div className="flex items-center gap-4 p-5 border-b border-slate-100">
        {/* Avatar */}
        <div className="relative flex-shrink-0">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center text-base font-extrabold text-primary">
            {(w.username ?? "?").slice(0, 2).toUpperCase()}
          </div>
          {w.kyc_status === "VERIFIED" && (
            <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center">
              <ShieldCheck size={9} className="text-white" />
            </div>
          )}
        </div>

        {/* Nom + badges */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-base font-bold text-slate-900 truncate">{w.username ?? "—"}</p>
            {w.provider_kind && (
              <span className="px-2 py-0.5 rounded-full bg-primary/8 text-primary text-[11px] font-semibold border border-primary/15">
                {KIND_LABELS[w.provider_kind] ?? w.provider_kind}
              </span>
            )}
            <KycBadge status={w.kyc_status} />
          </div>
          <p className="text-xs text-slate-500 truncate mt-0.5">{w.email ?? "—"}</p>
          {w.date_joined && (
            <p className="text-[10px] text-slate-400 flex items-center gap-1 mt-1">
              <CalendarDays size={10} />
              Membre depuis {fmtDate(w.date_joined, true)}
            </p>
          )}
        </div>

        {/* Montant demandé */}
        <div className="text-right flex-shrink-0">
          <p className="text-2xl font-extrabold text-slate-900 leading-none">
            {fmt(w.amount)}
          </p>
          <p className="text-xs text-slate-400 font-medium mt-0.5">GNF demandés</p>
          <p className="text-[10px] text-slate-400 mt-1">{fmtDate(w.created_at)}</p>
        </div>
      </div>

      {/* ══ ALERTE STATUT (si problème) ═══════════════════════ */}
      {(w.is_banned || w.is_suspended || (w.kyc_status && w.kyc_status !== "VERIFIED")) && (
        <div className="px-5 pt-4">
          <AccountAlert w={w} />
        </div>
      )}

      {/* ══ STATS FINANCIÈRES ═════════════════════════════════ */}
      <div className="px-5 pt-4">
        <p className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold mb-2.5">
          Récapitulatif financier
        </p>
        <div className="grid grid-cols-2 gap-2">
          <StatChip
            icon={Wallet}
            label="Solde actuel"
            value={`${w.wallet_balance != null ? fmt(w.wallet_balance) : "—"} GNF`}
            accent="bg-primary"
          />
          <StatChip
            icon={TrendingUp}
            label="Total encaissé"
            value={`${w.total_earned != null ? fmt(w.total_earned) : "—"} GNF`}
            sub="tous contrats"
            accent="bg-emerald-500"
          />
          <StatChip
            icon={ArrowUpRight}
            label="Déjà retiré"
            value={`${w.total_withdrawn != null ? fmt(w.total_withdrawn) : "—"} GNF`}
            sub="retraits approuvés"
            accent="bg-amber-500"
          />
          <StatChip
            icon={Briefcase}
            label="Contrats terminés"
            value={String(w.completed_contracts_count ?? "—")}
            sub="projets livrés"
            accent="bg-violet-500"
          />
        </div>
      </div>

      {/* ══ DERNIER PROJET ENCAISSÉ ═══════════════════════════ */}
      {w.last_escrow && (
        <div className="px-5 pt-4">
          <p className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold mb-2">
            Dernier contrat encaissé
          </p>
          <div className="flex items-center gap-3 p-3 rounded-xl bg-emerald-50 border border-emerald-100">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center flex-shrink-0">
              <Briefcase size={13} className="text-emerald-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-800 truncate">
                {w.last_escrow.project_title ?? `Contrat #${w.last_escrow.contract_id.slice(0, 8)}`}
              </p>
              <p className="text-xs text-slate-500">{fmtDate(w.last_escrow.released_at, true)}</p>
            </div>
            <p className="text-sm font-bold text-emerald-600 flex-shrink-0">
              +{fmt(w.last_escrow.amount)} GNF
            </p>
          </div>
        </div>
      )}

      {/* ══ PROFIL CONTACT ════════════════════════════════════ */}
      <div className="px-5 pt-4">
        <p className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold mb-2">
          Informations de contact
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {w.location && (
            <div className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-50 border border-slate-100 text-xs text-slate-700">
              <MapPin size={12} className="text-slate-400 flex-shrink-0" />
              <span className="truncate">{w.location}</span>
            </div>
          )}
          {w.profile_phone && (
            <div className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-50 border border-slate-100 text-xs text-slate-700">
              <Phone size={12} className="text-slate-400 flex-shrink-0" />
              <span>{w.profile_phone}</span>
              <span className="text-slate-400 text-[10px]">(profil)</span>
            </div>
          )}
        </div>
      </div>

      {/* ══ COORDONNÉES DE PAIEMENT ═══════════════════════════ */}
      <div className="px-5 pt-4">
        <p className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold mb-2">
          Coordonnées de paiement
        </p>
        <div className={`flex items-start gap-3 p-3 rounded-xl border ${
          w.payout_method === "MOBILE_MONEY"
            ? "bg-orange-50 border-orange-100"
            : "bg-blue-50 border-blue-100"
        }`}>
          {w.payout_method === "MOBILE_MONEY"
            ? <Phone size={15} className="text-orange-500 mt-0.5 flex-shrink-0" />
            : <Building2 size={15} className="text-blue-500 mt-0.5 flex-shrink-0" />
          }
          <div>
            <p className="text-xs font-semibold text-slate-700">
              {PAYOUT_LABELS[w.payout_method] ?? w.payout_method}
            </p>
            {w.payout_method === "MOBILE_MONEY" && details.phone && (
              <p className="text-base font-bold text-slate-900 mt-0.5">{details.phone}</p>
            )}
            {w.payout_method === "BANK_TRANSFER" && (
              <div className="mt-0.5 space-y-0.5">
                {details.bank_name && <p className="text-sm font-semibold text-slate-800">{details.bank_name}</p>}
                {details.account_number && <p className="text-xs text-slate-600 font-mono">{details.account_number}</p>}
                {details.account_name && <p className="text-xs text-slate-500">{details.account_name}</p>}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Commentaire */}
      {w.comment && (
        <div className="px-5 pt-3">
          <p className="text-xs italic text-slate-500 bg-slate-50 rounded-lg px-3 py-2 border border-slate-100">
            « {w.comment} »
          </p>
        </div>
      )}

      {/* ══ ACTIONS ═══════════════════════════════════════════ */}
      <div className="flex items-center justify-end gap-2.5 px-5 py-4 mt-4 bg-slate-50 border-t border-slate-100">
        <Button
          size="sm"
          variant="outline"
          className="h-9 px-4 text-destructive border-destructive/30 hover:bg-destructive/5 hover:border-destructive/50 gap-1.5"
          onClick={() => onReject(w)}
          disabled={approve.isPending}
        >
          <XCircle size={13} /> Rejeter
        </Button>
        <Button
          size="sm"
          className="h-9 px-4 bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5"
          onClick={handleApprove}
          disabled={approve.isPending}
        >
          {approve.isPending
            ? <Loader2 size={13} className="animate-spin" />
            : <CheckCircle2 size={13} />
          }
          Approuver le retrait
        </Button>
      </div>
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────────

const AdminWithdrawals = () => {
  const [page, setPage] = useState(1);
  const [rejectTarget, setRejectTarget] = useState<ApiWithdrawalRequest | null>(null);

  const { data, isLoading, isFetching } = useAdminPendingWithdrawals(page);
  const withdrawals = data?.results ?? [];
  const total = data?.count ?? 0;
  const pageSize = 25;
  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="min-h-screen bg-slate-50/70">

      {/* Header */}
      <div className="bg-primary text-white px-6 py-5 lg:px-8 shadow-sm">
        <div className="container mx-auto flex items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-white/15 flex items-center justify-center">
                <ArrowUpRight size={15} />
              </div>
              Retraits en attente
            </h1>
            <p className="text-white/60 text-sm mt-0.5">
              {isLoading
                ? "Chargement…"
                : `${total} demande${total !== 1 ? "s" : ""} à traiter`}
            </p>
          </div>
          <Link to={ROUTES.ADMIN.DASHBOARD}>
            <Button variant="secondary" size="sm" className="gap-1.5">
              <ArrowLeft size={14} /> Retour
            </Button>
          </Link>
        </div>
      </div>

      <div className="container mx-auto p-6 lg:p-8 max-w-2xl">
        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-primary" size={32} />
          </div>
        ) : withdrawals.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
              <Clock size={24} className="text-slate-300" />
            </div>
            <p className="text-sm font-medium text-slate-500">Aucune demande de retrait en attente.</p>
          </div>
        ) : (
          <div className={`space-y-5 transition-opacity ${isFetching ? "opacity-60" : ""}`}>
            {withdrawals.map((w) => (
              <WithdrawalCard key={w.id} w={w} onReject={setRejectTarget} />
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-200">
            <p className="text-xs text-slate-500">Page {page} / {totalPages} · {total} au total</p>
            <div className="flex gap-1">
              <Button variant="outline" size="sm" className="h-8 w-8 p-0"
                onClick={() => setPage((p) => p - 1)} disabled={page === 1 || isFetching}>
                <ChevronLeft size={14} />
              </Button>
              <Button variant="outline" size="sm" className="h-8 w-8 p-0"
                onClick={() => setPage((p) => p + 1)} disabled={page >= totalPages || isFetching}>
                <ChevronRight size={14} />
              </Button>
            </div>
          </div>
        )}
      </div>

      <RejectDialog withdrawal={rejectTarget} onClose={() => setRejectTarget(null)} />
    </div>
  );
};

export default AdminWithdrawals;
