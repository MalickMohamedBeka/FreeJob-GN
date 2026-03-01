import { useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Wallet as WalletIcon,
  ArrowDownLeft,
  ArrowUpRight,
  ArrowLeftRight,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock,
  CheckCircle2,
  XCircle,
  Lock,
  Unlock,
  RefreshCw,
} from "lucide-react";
import {
  useWallet,
  useWalletTransactions,
  useWithdrawals,
  useCreateWithdrawal,
} from "@/hooks/useWallet";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks";
import { ApiError } from "@/services/api.service";
import type {
  TransactionTypeEnum,
  WithdrawalStatusEnum,
  PayoutMethodEnum,
  WithdrawalRequestCreateRequest,
} from "@/types";

// ── Helpers ────────────────────────────────────────────────────────────────────

function fmtAmount(amount: string, currency: string) {
  return `${parseFloat(amount).toLocaleString("fr-FR")} ${currency}`;
}

function fmtDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

const TX_CONFIG: Record<
  TransactionTypeEnum,
  { label: string; icon: React.ElementType; color: string; sign: "+" | "-" | "" }
> = {
  DEPOSIT:         { label: "Dépôt",            icon: ArrowDownLeft,  color: "text-green-600",  sign: "+" },
  WITHDRAWAL:      { label: "Retrait",           icon: ArrowUpRight,   color: "text-red-500",    sign: "-" },
  TRANSFER_IN:     { label: "Transfert reçu",    icon: ArrowDownLeft,  color: "text-green-600",  sign: "+" },
  TRANSFER_OUT:    { label: "Transfert envoyé",  icon: ArrowUpRight,   color: "text-red-500",    sign: "-" },
  PAYMENT:         { label: "Paiement",          icon: ArrowUpRight,   color: "text-red-500",    sign: "-" },
  REFUND:          { label: "Remboursement",     icon: RefreshCw,      color: "text-blue-500",   sign: "+" },
  ESCROW_LOCK:     { label: "Escrow bloqué",     icon: Lock,           color: "text-orange-500", sign: "-" },
  ESCROW_RELEASE:  { label: "Escrow libéré",     icon: Unlock,         color: "text-green-600",  sign: "+" },
};

const WITHDRAWAL_STATUS: Record<
  WithdrawalStatusEnum,
  { label: string; className: string; icon: React.ElementType }
> = {
  PENDING:  { label: "En attente",  className: "bg-orange-100 text-orange-700", icon: Clock },
  APPROVED: { label: "Approuvée",  className: "bg-green-100 text-green-700",   icon: CheckCircle2 },
  REJECTED: { label: "Rejetée",    className: "bg-red-100 text-red-700",       icon: XCircle },
};

const PAYOUT_LABELS: Record<string, string> = {
  MOBILE_MONEY: "Mobile Money",
  BANK_TRANSFER: "Virement bancaire",
};

// ── Withdrawal Dialog ──────────────────────────────────────────────────────────

function WithdrawalDialog({
  open,
  onOpenChange,
  walletBalance,
  currency,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  walletBalance: string;
  currency: string;
}) {
  const [amount, setAmount] = useState("");
  const [comment, setComment] = useState("");
  const [method, setMethod] = useState<PayoutMethodEnum>("MOBILE_MONEY");
  const [phone, setPhone] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [bankName, setBankName] = useState("");
  const [error, setError] = useState("");
  const create = useCreateWithdrawal();

  const reset = () => {
    setAmount("");
    setComment("");
    setMethod("MOBILE_MONEY");
    setPhone("");
    setAccountNumber("");
    setBankName("");
    setError("");
  };

  const handleClose = (v: boolean) => {
    if (!v) reset();
    onOpenChange(v);
  };

  const handleSubmit = async () => {
    setError("");
    const parsed = parseFloat(amount);
    if (!amount || isNaN(parsed) || parsed <= 0) {
      setError("Montant invalide.");
      return;
    }
    if (parsed > parseFloat(walletBalance)) {
      setError("Solde insuffisant.");
      return;
    }

    const payout_details: Record<string, string> =
      method === "MOBILE_MONEY"
        ? { phone: phone.trim() }
        : { account_number: accountNumber.trim(), bank_name: bankName.trim() };

    if (method === "MOBILE_MONEY" && !phone.trim()) {
      setError("Le numéro de téléphone est requis.");
      return;
    }
    if (method === "BANK_TRANSFER" && (!accountNumber.trim() || !bankName.trim())) {
      setError("Numéro de compte et nom de la banque requis.");
      return;
    }

    const payload: WithdrawalRequestCreateRequest = {
      amount: parsed.toFixed(2),
      payout_method: method,
      payout_details,
    };
    if (comment.trim()) payload.comment = comment.trim();

    try {
      await create.mutateAsync(payload);
      toast({ title: "Demande de retrait soumise avec succès." });
      handleClose(false);
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "Une erreur est survenue.",
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Demande de retrait</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-1">
          <p className="text-xs text-muted-foreground">
            Solde disponible :{" "}
            <strong>
              {fmtAmount(walletBalance, currency)}
            </strong>
          </p>

          <div className="space-y-1.5">
            <Label htmlFor="wd-amount">Montant *</Label>
            <Input
              id="wd-amount"
              type="number"
              min="0"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder={`Max ${fmtAmount(walletBalance, currency)}`}
            />
          </div>

          <div className="space-y-1.5">
            <Label>Mode de paiement *</Label>
            <Select value={method} onValueChange={(v) => setMethod(v as PayoutMethodEnum)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="MOBILE_MONEY">Mobile Money</SelectItem>
                <SelectItem value="BANK_TRANSFER">Virement bancaire</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {method === "MOBILE_MONEY" ? (
            <div className="space-y-1.5">
              <Label htmlFor="wd-phone">Numéro de téléphone *</Label>
              <Input
                id="wd-phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+224 6XX XXX XXX"
              />
            </div>
          ) : (
            <div className="space-y-3">
              <div className="space-y-1.5">
                <Label htmlFor="wd-bank">Nom de la banque *</Label>
                <Input
                  id="wd-bank"
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  placeholder="Ex: Banque Centrale de Guinée"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="wd-account">Numéro de compte *</Label>
                <Input
                  id="wd-account"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  placeholder="Ex: GN00 0000 0000 0000"
                />
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <Label htmlFor="wd-comment">
              Commentaire{" "}
              <span className="text-muted-foreground text-xs">(optionnel)</span>
            </Label>
            <Textarea
              id="wd-comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={2}
              maxLength={255}
              placeholder="Informations complémentaires…"
            />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => handleClose(false)}>
            Annuler
          </Button>
          <Button onClick={handleSubmit} disabled={create.isPending}>
            {create.isPending && (
              <Loader2 size={14} className="animate-spin mr-1.5" />
            )}
            Soumettre
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ── Transactions Tab ───────────────────────────────────────────────────────────

function TransactionsTab({ currency }: { currency: string }) {
  const [page, setPage] = useState(1);
  const { data, isLoading, isFetching } = useWalletTransactions(page);
  const transactions = data?.results ?? [];
  const total = data?.count ?? 0;
  const pageSize = 20;
  const totalPages = Math.ceil(total / pageSize);

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="animate-spin text-primary" size={28} />
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <ArrowLeftRight size={32} className="mx-auto mb-3 opacity-30" />
        <p className="text-sm">Aucune transaction pour le moment.</p>
      </div>
    );
  }

  return (
    <div className={`transition-opacity ${isFetching ? "opacity-60" : ""}`}>
      <div className="divide-y divide-border">
        {transactions.map((tx) => {
          const cfg = TX_CONFIG[tx.transaction_type] ?? {
            label: tx.transaction_type,
            icon: ArrowLeftRight,
            color: "text-muted-foreground",
            sign: "",
          };
          const Icon = cfg.icon;
          const positive = cfg.sign === "+";
          return (
            <div key={tx.id} className="flex items-center gap-3 py-3.5 px-1">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${
                  positive ? "bg-green-100" : "bg-red-50"
                }`}
              >
                <Icon size={16} className={cfg.color} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{cfg.label}</p>
                <p className="text-xs text-muted-foreground truncate">
                  {tx.description || fmtDate(tx.created_at)}
                </p>
              </div>
              <div className="text-right flex-shrink-0">
                <p
                  className={`text-sm font-semibold ${
                    positive ? "text-green-600" : "text-red-500"
                  }`}
                >
                  {cfg.sign}
                  {fmtAmount(tx.amount, currency)}
                </p>
                <p className="text-xs text-muted-foreground">
                  {fmtDate(tx.created_at)}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-4 mt-2 border-t border-border">
          <p className="text-xs text-muted-foreground">
            Page {page} sur {totalPages}
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
  );
}

// ── Withdrawals Tab ────────────────────────────────────────────────────────────

function WithdrawalsTab({ currency }: { currency: string }) {
  const { data: withdrawals, isLoading } = useWithdrawals();
  const list = withdrawals ?? [];

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="animate-spin text-primary" size={28} />
      </div>
    );
  }

  if (list.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <ArrowUpRight size={32} className="mx-auto mb-3 opacity-30" />
        <p className="text-sm">Aucune demande de retrait.</p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-border">
      {list.map((w) => {
        const cfg = WITHDRAWAL_STATUS[w.status] ?? {
          label: w.status,
          className: "bg-muted text-muted-foreground",
          icon: Clock,
        };
        const StatusIcon = cfg.icon;
        return (
          <div key={w.id} className="py-4 px-1 space-y-1.5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold">
                  {fmtAmount(w.amount, currency)}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {PAYOUT_LABELS[w.payout_method] ?? w.payout_method} ·{" "}
                  {fmtDate(w.created_at)}
                </p>
              </div>
              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${cfg.className}`}
              >
                <StatusIcon size={11} />
                {cfg.label}
              </span>
            </div>
            {w.comment && (
              <p className="text-xs text-muted-foreground italic">{w.comment}</p>
            )}
            {w.status === "REJECTED" && w.rejection_reason && (
              <p className="text-xs text-destructive">
                Motif : {w.rejection_reason}
              </p>
            )}
            {w.status === "APPROVED" && w.processed_at && (
              <p className="text-xs text-muted-foreground">
                Traitée le {fmtDate(w.processed_at)}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────────

const Wallet = () => {
  const { user } = useAuth();
  const userType = user?.role === "CLIENT" ? "client" : "freelancer";
  const [tab, setTab] = useState<"transactions" | "withdrawals">("transactions");
  const [wdOpen, setWdOpen] = useState(false);

  const { data: wallet, isLoading } = useWallet();

  return (
    <DashboardLayout userType={userType}>
      <div className="space-y-5">

        {/* ── Header ── */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold">Mon Portefeuille</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Solde, transactions et retraits
            </p>
          </div>
          {wallet && (
            <Button className="gap-1.5" onClick={() => setWdOpen(true)}>
              <Plus size={15} />
              Demander un retrait
            </Button>
          )}
        </div>

        {/* ── Balance card ── */}
        {isLoading ? (
          <Card className="p-6">
            <div className="flex items-center gap-3">
              <Loader2 className="animate-spin text-primary" size={24} />
              <span className="text-sm text-muted-foreground">
                Chargement du portefeuille…
              </span>
            </div>
          </Card>
        ) : !wallet ? (
          <Card className="p-6">
            <p className="text-sm text-muted-foreground">
              Impossible de charger le portefeuille.
            </p>
          </Card>
        ) : (
          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <WalletIcon size={24} className="text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium mb-0.5">
                  Solde disponible
                </p>
                <p className="text-3xl font-extrabold text-foreground leading-none">
                  {parseFloat(wallet.balance).toLocaleString("fr-FR")}
                  <span className="text-lg font-semibold text-muted-foreground ml-1.5">
                    {wallet.currency}
                  </span>
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* ── Tabs ── */}
        <div className="flex items-center bg-muted rounded-xl p-1 w-fit text-sm">
          {(["transactions", "withdrawals"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-1.5 rounded-lg font-medium transition-colors ${
                tab === t
                  ? "bg-white shadow-sm text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t === "transactions" ? "Transactions" : "Retraits"}
            </button>
          ))}
        </div>

        {/* ── Content ── */}
        <Card className="p-4">
          {tab === "transactions" ? (
            <TransactionsTab currency={wallet?.currency ?? "GNF"} />
          ) : (
            <WithdrawalsTab currency={wallet?.currency ?? "GNF"} />
          )}
        </Card>
      </div>

      {/* ── Withdrawal dialog ── */}
      {wallet && (
        <WithdrawalDialog
          open={wdOpen}
          onOpenChange={setWdOpen}
          walletBalance={wallet.balance}
          currency={wallet.currency}
        />
      )}
    </DashboardLayout>
  );
};

export default Wallet;
