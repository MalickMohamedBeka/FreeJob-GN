import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Loader2,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Clock,
} from "lucide-react";
import {
  useAdminPendingWithdrawals,
  useApproveWithdrawal,
  useRejectWithdrawal,
} from "@/hooks/useWallet";
import { toast } from "@/hooks";
import { ApiError } from "@/services/api.service";
import { ROUTES } from "@/constants/routes";
import type { ApiWithdrawalRequest } from "@/types";

// ── Helpers ────────────────────────────────────────────────────────────────────

function fmtAmount(amount: string) {
  return parseFloat(amount).toLocaleString("fr-FR");
}

function fmtDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const PAYOUT_LABELS: Record<string, string> = {
  MOBILE_MONEY: "Mobile Money",
  BANK_TRANSFER: "Virement bancaire",
};

// ── Reject Dialog ──────────────────────────────────────────────────────────────

function RejectDialog({
  withdrawal,
  onClose,
}: {
  withdrawal: ApiWithdrawalRequest | null;
  onClose: () => void;
}) {
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");
  const reject = useRejectWithdrawal();

  const handleClose = () => {
    setReason("");
    setError("");
    onClose();
  };

  const handleSubmit = async () => {
    setError("");
    if (!reason.trim()) {
      setError("Le motif de rejet est obligatoire.");
      return;
    }
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
          <DialogTitle>Rejeter la demande</DialogTitle>
        </DialogHeader>
        <div className="space-y-3 py-1">
          <p className="text-sm text-muted-foreground">
            Montant :{" "}
            <strong>
              {withdrawal ? fmtAmount(withdrawal.amount) : "—"}
            </strong>
          </p>
          <div className="space-y-1.5">
            <Label htmlFor="reject-reason">Motif du rejet *</Label>
            <Input
              id="reject-reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Expliquer la raison du rejet…"
              maxLength={255}
            />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Annuler
          </Button>
          <Button variant="destructive" onClick={handleSubmit} disabled={reject.isPending}>
            {reject.isPending && <Loader2 size={14} className="animate-spin mr-1.5" />}
            Rejeter
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ── Withdrawal Row ─────────────────────────────────────────────────────────────

function WithdrawalRow({
  w,
  onReject,
}: {
  w: ApiWithdrawalRequest;
  onReject: (w: ApiWithdrawalRequest) => void;
}) {
  const approve = useApproveWithdrawal();

  const handleApprove = async () => {
    try {
      await approve.mutateAsync(w.id);
      toast({ title: "Demande approuvée." });
    } catch (err) {
      toast({
        title: "Erreur",
        description: err instanceof ApiError ? err.message : "Une erreur est survenue.",
        variant: "destructive",
      });
    }
  };

  const details = w.payout_details as Record<string, string>;

  return (
    <div className="py-4 px-2 space-y-2">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="space-y-0.5">
          <p className="text-sm font-semibold">
            {fmtAmount(w.amount)}{" "}
            <span className="text-muted-foreground font-normal text-xs">GNF</span>
          </p>
          <p className="text-xs text-muted-foreground">
            {PAYOUT_LABELS[w.payout_method] ?? w.payout_method} · Soumise le{" "}
            {fmtDate(w.created_at)}
          </p>
          {details && (
            <p className="text-xs text-muted-foreground">
              {details.phone
                ? `Tél : ${details.phone}`
                : details.bank_name
                ? `Banque : ${details.bank_name} — Compte : ${details.account_number}`
                : null}
            </p>
          )}
          {w.comment && (
            <p className="text-xs italic text-muted-foreground">« {w.comment} »</p>
          )}
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <Button
            size="sm"
            variant="outline"
            className="text-destructive border-destructive/40 hover:bg-destructive/5 h-8"
            onClick={() => onReject(w)}
            disabled={approve.isPending}
          >
            <XCircle size={13} className="mr-1" />
            Rejeter
          </Button>
          <Button
            size="sm"
            className="h-8 bg-green-600 hover:bg-green-700 text-white"
            onClick={handleApprove}
            disabled={approve.isPending}
          >
            {approve.isPending ? (
              <Loader2 size={13} className="animate-spin mr-1" />
            ) : (
              <CheckCircle2 size={13} className="mr-1" />
            )}
            Approuver
          </Button>
        </div>
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
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <div className="bg-primary text-white p-6 lg:p-8">
        <div className="container mx-auto">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold">Demandes de retrait en attente</h1>
              <p className="text-white/70 text-sm mt-0.5">
                {isLoading ? "Chargement…" : `${total} demande${total !== 1 ? "s" : ""} en attente`}
              </p>
            </div>
            <Link to={ROUTES.ADMIN.DASHBOARD}>
              <Button variant="secondary" size="sm" className="gap-1.5">
                <ArrowLeft size={14} />
                Retour
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto p-6 lg:p-8 max-w-3xl">
        {isLoading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="animate-spin text-primary" size={32} />
          </div>
        ) : withdrawals.length === 0 ? (
          <Card className="p-10 text-center">
            <Clock size={36} className="mx-auto mb-3 text-muted-foreground/40" />
            <p className="text-sm text-muted-foreground">
              Aucune demande de retrait en attente.
            </p>
          </Card>
        ) : (
          <Card className={`divide-y divide-border transition-opacity ${isFetching ? "opacity-60" : ""}`}>
            {withdrawals.map((w) => (
              <WithdrawalRow key={w.id} w={w} onReject={setRejectTarget} />
            ))}
          </Card>
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-4">
            <p className="text-xs text-muted-foreground">
              Page {page} sur {totalPages} ({total} au total)
            </p>
            <div className="flex items-center gap-1">
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

      <RejectDialog
        withdrawal={rejectTarget}
        onClose={() => setRejectTarget(null)}
      />
    </div>
  );
};

export default AdminWithdrawals;
