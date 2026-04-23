import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import {
  TrendingUp, TrendingDown, Wallet, ArrowDownRight, ArrowUpRight,
  RefreshCw, Loader2, ChevronLeft, ChevronRight, AlertCircle,
  CheckCircle2, Clock, XCircle, BarChart2, CreditCard, Layers,
  DollarSign, ArrowLeft, Crown, Minus, Plus, Equal, Activity,
} from "lucide-react";
import { ROUTES } from "@/constants/routes";
import {
  useAdminFinanceOverview, useAdminEscrows, useAdminPayments,
  type AdminEscrowItem, type AdminPaymentItem, type FinancePeriod,
} from "@/hooks/useAdmin";

// ── Helpers ────────────────────────────────────────────────────────────────────

function n(v: string | number | null | undefined): number {
  if (v == null) return 0;
  const x = typeof v === "string" ? parseFloat(v) : v;
  return isNaN(x) ? 0 : x;
}

function fmtGNF(v: string | number | null | undefined): string {
  const x = n(v);
  return x.toLocaleString("fr-FR", { maximumFractionDigits: 0 }) + " GNF";
}

function fmtShort(v: string | number | null | undefined): string {
  const x = n(v);
  if (x >= 1_000_000_000) return (x / 1_000_000_000).toFixed(1) + " Md";
  if (x >= 1_000_000) return (x / 1_000_000).toFixed(1) + " M";
  if (x >= 1_000) return (x / 1_000).toFixed(0) + " k";
  return x.toFixed(0);
}

function fmtDate(s: string | null | undefined): string {
  if (!s) return "—";
  return new Date(s).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" });
}

function pct(a: string, b: string): number | null {
  const ca = n(a), cb = n(b);
  if (!cb) return null;
  return Math.round(((ca - cb) / cb) * 100);
}

// ── Types ──────────────────────────────────────────────────────────────────────

type PeriodKey = "current_month" | "last_month" | "all_time";

const PERIOD_LABELS: Record<PeriodKey, string> = {
  current_month: "Ce mois",
  last_month:    "Mois dernier",
  all_time:      "Tout le temps",
};

const TIER_LABELS: Record<string, string> = {
  FREE: "Gratuit", PRO: "Pro", PRO_MAX: "Pro Max", AGENCY: "Agence",
};
const TIER_COLORS: Record<string, string> = {
  FREE: "#64748b", PRO: "#6366f1", PRO_MAX: "#8b5cf6", AGENCY: "#f59e0b",
};

// ── Motion presets ─────────────────────────────────────────────────────────────

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.07, duration: 0.38, ease: [0.22, 1, 0.36, 1] } }),
};

// ── Skeleton ───────────────────────────────────────────────────────────────────

function Skel({ className }: { className?: string }) {
  return <div className={`bg-slate-100 animate-pulse rounded-lg ${className ?? ""}`} />;
}

// ── Period selector ────────────────────────────────────────────────────────────

function PeriodSelector({
  value, onChange,
}: { value: PeriodKey; onChange: (p: PeriodKey) => void }) {
  return (
    <div className="inline-flex items-center gap-0.5 bg-slate-100 rounded-xl p-1">
      {(Object.keys(PERIOD_LABELS) as PeriodKey[]).map((k) => (
        <button
          key={k}
          onClick={() => onChange(k)}
          className={`relative px-4 py-1.5 text-sm font-medium rounded-lg transition-colors ${
            value === k ? "text-slate-900" : "text-slate-500 hover:text-slate-700"
          }`}
        >
          {value === k && (
            <motion.span
              layoutId="period-pill"
              className="absolute inset-0 bg-white rounded-lg shadow-sm"
              transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
            />
          )}
          <span className="relative">{PERIOD_LABELS[k]}</span>
        </button>
      ))}
    </div>
  );
}

// ── KPI card ───────────────────────────────────────────────────────────────────

function KpiCard({
  label, value, sub, trend, icon: Icon, accent, loading, index = 0,
}: {
  label: string; value: string; sub?: string; trend?: number | null;
  icon: React.ElementType; accent: string; loading?: boolean; index?: number;
}) {
  const TrendIcon = trend != null ? (trend >= 0 ? TrendingUp : TrendingDown) : null;
  const trendColor = trend != null ? (trend >= 0 ? "#10b981" : "#ef4444") : "#94a3b8";

  return (
    <motion.div
      custom={index}
      variants={fadeUp}
      initial="hidden"
      animate="show"
      className="bg-white rounded-2xl border border-slate-200/70 p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col gap-3"
      style={{ borderLeftWidth: 3, borderLeftColor: accent }}
    >
      <div className="flex items-start justify-between">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: `${accent}18` }}
        >
          <Icon size={16} style={{ color: accent }} />
        </div>
        {TrendIcon && trend != null && (
          <span
            className="flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full"
            style={{ color: trendColor, background: `${trendColor}14` }}
          >
            <TrendIcon size={10} />
            {Math.abs(trend)}%
          </span>
        )}
      </div>
      {loading ? (
        <Skel className="h-7 w-32" />
      ) : (
        <div>
          <p className="text-[22px] font-bold text-slate-800 leading-tight tracking-tight">{value}</p>
          {sub && <p className="text-[11px] text-slate-400 mt-0.5">{sub}</p>}
        </div>
      )}
      <p className="text-xs font-medium text-slate-500">{label}</p>
    </motion.div>
  );
}

// ── P&L Income Statement ───────────────────────────────────────────────────────

function PLStatement({ p, loading }: { p: FinancePeriod | undefined; loading: boolean }) {
  const rows: {
    label: string;
    value: string | number | null | undefined;
    color: string;
    bg: string;
    prefix?: string;
    size?: "sm" | "md" | "lg";
    divider?: boolean;
    icon?: React.ElementType;
  }[] = [
    { label: "Commissions contrats (brut)", value: p?.contracts_commission_gross, color: "#1e40af", bg: "#eff6ff", prefix: "+", icon: Plus },
    { label: "Revenus abonnements (brut)",  value: p?.sub_gross, color: "#6d28d9", bg: "#f5f3ff", prefix: "+", icon: Plus },
    { label: "Revenu brut total", value: p?.total_gross_revenue, color: "#1e3a8a", bg: "#e0e7ff", size: "md", divider: true, icon: Equal },
    { label: "PSP contrats · stocké BD",    value: p?.contracts_psp_costs, color: "#b91c1c", bg: "#fef2f2", prefix: "−", icon: Minus },
    { label: "PSP abonnements · calculé 1,5 %", value: p?.sub_psp_costs, color: "#b91c1c", bg: "#fef2f2", prefix: "−", icon: Minus },
    { label: "Total frais PSP Djomy", value: p?.total_psp_costs, color: "#991b1b", bg: "#fee2e2", size: "md", divider: true, icon: Equal },
    { label: "Net contrats", value: p?.contracts_net, color: "#1d4ed8", bg: "#eff6ff", prefix: "=", icon: Equal },
    { label: "Net abonnements", value: p?.sub_net, color: "#5b21b6", bg: "#f5f3ff", prefix: "=", icon: Equal },
    { label: "RÉSULTAT NET TOTAL", value: p?.total_net_revenue, color: "#065f46", bg: "#ecfdf5", size: "lg", divider: true, icon: Equal },
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200/70 shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2">
        <Activity size={15} className="text-slate-400" />
        <h3 className="text-sm font-semibold text-slate-700">Compte de résultat</h3>
      </div>
      <div className="p-4 space-y-0.5">
        {rows.map((row, i) => {
          const isLg = row.size === "lg";
          const isMd = row.size === "md";
          const RowIcon = row.icon;
          return (
            <div key={i}>
              {row.divider && <div className="h-px bg-slate-100 my-2" />}
              <div
                className={`flex items-center justify-between px-3 rounded-xl transition-colors ${
                  isLg ? "py-3" : isMd ? "py-2" : "py-1.5"
                }`}
                style={{ background: isLg || isMd ? row.bg : "transparent" }}
              >
                <div className="flex items-center gap-2">
                  {RowIcon && (
                    <span
                      className="w-4 h-4 rounded flex items-center justify-center shrink-0"
                      style={{ background: `${row.color}20`, color: row.color }}
                    >
                      <RowIcon size={9} />
                    </span>
                  )}
                  <span
                    className={`${isLg ? "text-sm font-bold" : isMd ? "text-[13px] font-semibold" : "text-xs text-slate-500"}`}
                    style={isLg || isMd ? { color: row.color } : undefined}
                  >
                    {row.label}
                  </span>
                </div>
                {loading ? (
                  <Skel className={isLg ? "h-6 w-28" : "h-4 w-20"} />
                ) : (
                  <span
                    className={`font-bold tabular-nums ${isLg ? "text-base" : isMd ? "text-[13px]" : "text-xs"}`}
                    style={{ color: row.color }}
                  >
                    {row.prefix && row.prefix !== "=" ? `${row.prefix} ` : ""}
                    {fmtGNF(row.value)}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Revenue donut ──────────────────────────────────────────────────────────────

function RevenueDonut({ p, loading }: { p: FinancePeriod | undefined; loading: boolean }) {
  const totalNet = n(p?.total_net_revenue);
  const contractsNet = n(p?.contracts_net);
  const subNet = n(p?.sub_net);
  const pspCosts = n(p?.total_psp_costs);

  const slices = [
    { name: "Net contrats", value: Math.max(0, contractsNet), color: "#4f46e5" },
    { name: "Net abonnements", value: Math.max(0, subNet), color: "#7c3aed" },
    { name: "Frais PSP", value: Math.max(0, pspCosts), color: "#ef4444" },
  ];

  const hasData = slices.some((s) => s.value > 0);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/70 shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2">
        <BarChart2 size={15} className="text-slate-400" />
        <h3 className="text-sm font-semibold text-slate-700">Composition des revenus</h3>
      </div>
      <div className="p-4">
        {loading ? (
          <div className="flex flex-col items-center gap-4">
            <Skel className="h-40 w-40 rounded-full" />
            <div className="space-y-2 w-full">
              {[1, 2, 3].map((i) => <Skel key={i} className="h-4 w-full" />)}
            </div>
          </div>
        ) : !hasData ? (
          <div className="flex flex-col items-center justify-center py-10 text-slate-400 text-sm">
            <BarChart2 size={32} className="mb-2 opacity-30" />
            Pas encore de données
          </div>
        ) : (
          <>
            <div className="relative h-44">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={slices}
                    cx="50%"
                    cy="50%"
                    innerRadius={52}
                    outerRadius={76}
                    strokeWidth={2}
                    stroke="#fff"
                    dataKey="value"
                    paddingAngle={3}
                  >
                    {slices.map((s) => (
                      <Cell key={s.name} fill={s.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(v: number) => [fmtGNF(v), ""]}
                    contentStyle={{
                      background: "#fff", border: "1px solid #e2e8f0",
                      borderRadius: 12, fontSize: 12, boxShadow: "0 4px 20px #0000001a",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <p className="text-[10px] text-slate-400 uppercase tracking-widest">Net total</p>
                <p className="text-base font-bold text-slate-800">{fmtShort(totalNet)}</p>
                <p className="text-[10px] text-slate-400">GNF</p>
              </div>
            </div>

            <div className="mt-2 space-y-2">
              {slices.map((s) => {
                const pctVal = totalNet > 0 ? Math.round((s.value / (totalNet + pspCosts)) * 100) : 0;
                return (
                  <div key={s.name} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ background: s.color }} />
                      <span className="text-slate-600">{s.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-800">{fmtShort(s.value)} GNF</span>
                      <span className="text-slate-400 w-9 text-right">{pctVal}%</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ── Revenue area chart ─────────────────────────────────────────────────────────

function RevenueChart({ chartData, loading }: { chartData: Record<string, unknown>[]; loading: boolean }) {
  if (loading) return <Skel className="h-64 w-full" />;
  if (!chartData.length) {
    return (
      <div className="h-48 flex flex-col items-center justify-center text-slate-400 text-sm gap-1">
        <Activity size={28} className="opacity-30" />
        Pas encore de données sur 12 mois
      </div>
    );
  }

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="gContracts" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#4f46e5" stopOpacity={0.25} />
              <stop offset="100%" stopColor="#4f46e5" stopOpacity={0.02} />
            </linearGradient>
            <linearGradient id="gSubs" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#7c3aed" stopOpacity={0.25} />
              <stop offset="100%" stopColor="#7c3aed" stopOpacity={0.02} />
            </linearGradient>
            <linearGradient id="gTotal" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#059669" stopOpacity={0.2} />
              <stop offset="100%" stopColor="#059669" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 11, fill: "#94a3b8" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tickFormatter={(v) => fmtShort(v)}
            tick={{ fontSize: 11, fill: "#94a3b8" }}
            axisLine={false}
            tickLine={false}
            width={68}
          />
          <Tooltip
            contentStyle={{
              background: "#fff", border: "1px solid #e2e8f0",
              borderRadius: 12, fontSize: 12, boxShadow: "0 4px 24px #0000001a",
            }}
            formatter={(v: number) => [fmtGNF(v), ""]}
          />
          <Area
            type="monotone"
            dataKey="Net total"
            name="Net total"
            stroke="#059669"
            strokeWidth={2}
            fill="url(#gTotal)"
            dot={false}
            activeDot={{ r: 4, strokeWidth: 0 }}
          />
          <Area
            type="monotone"
            dataKey="Net contrats"
            name="Net contrats"
            stroke="#4f46e5"
            strokeWidth={1.5}
            fill="url(#gContracts)"
            dot={false}
            activeDot={{ r: 3, strokeWidth: 0 }}
          />
          <Area
            type="monotone"
            dataKey="Net abonnements"
            name="Net abonnements"
            stroke="#7c3aed"
            strokeWidth={1.5}
            fill="url(#gSubs)"
            dot={false}
            activeDot={{ r: 3, strokeWidth: 0 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

// ── Status badge ───────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; color: string; bg: string; icon: React.ElementType }> = {
    RELEASED: { label: "Libéré",    color: "#059669", bg: "#d1fae5", icon: CheckCircle2 },
    FUNDED:   { label: "Financé",   color: "#4f46e5", bg: "#e0e7ff", icon: Clock },
    REFUNDED: { label: "Remboursé", color: "#d97706", bg: "#fef3c7", icon: ArrowUpRight },
    SUCCESS:  { label: "Succès",    color: "#059669", bg: "#d1fae5", icon: CheckCircle2 },
    FAILED:   { label: "Échoué",    color: "#dc2626", bg: "#fee2e2", icon: XCircle },
    PENDING:  { label: "En attente",color: "#d97706", bg: "#fef3c7", icon: Clock },
  };
  const c = map[status] ?? { label: status, color: "#64748b", bg: "#f1f5f9", icon: AlertCircle };
  const Icon = c.icon;
  return (
    <span
      className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap"
      style={{ color: c.color, background: c.bg }}
    >
      <Icon size={10} />
      {c.label}
    </span>
  );
}

// ── Pagination ─────────────────────────────────────────────────────────────────

function Pagination({ page, count, pageSize, onChange }: {
  page: number; count: number; pageSize: number; onChange: (p: number) => void;
}) {
  const total = Math.ceil(count / pageSize);
  if (total <= 1) return null;
  return (
    <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-3">
      <p className="text-xs text-slate-400">{count} résultats · page {page}/{total}</p>
      <div className="flex gap-1">
        {[{ disabled: page <= 1, onClick: () => onChange(page - 1), icon: ChevronLeft },
          { disabled: page >= total, onClick: () => onChange(page + 1), icon: ChevronRight },
        ].map((btn, i) => (
          <button
            key={i}
            disabled={btn.disabled}
            onClick={btn.onClick}
            className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <btn.icon size={14} />
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Escrow table ───────────────────────────────────────────────────────────────

function EscrowTable() {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");
  const { data, isLoading } = useAdminEscrows({ page, status: statusFilter || undefined });
  const rows: AdminEscrowItem[] = data?.results ?? [];

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2 mb-5">
        <span className="text-xs text-slate-400 font-medium">Filtrer :</span>
        {["", "FUNDED", "RELEASED", "REFUNDED"].map((s) => (
          <button
            key={s}
            onClick={() => { setStatusFilter(s); setPage(1); }}
            className={`text-xs px-3 py-1.5 rounded-full border transition-all font-medium ${
              statusFilter === s
                ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                : "border-slate-200 text-slate-500 hover:border-slate-400 bg-white"
            }`}
          >
            {s === "" ? "Tous" : s === "FUNDED" ? "Financés" : s === "RELEASED" ? "Libérés" : "Remboursés"}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {[1,2,3,4,5].map((i) => <Skel key={i} className="h-12 w-full" />)}
        </div>
      ) : rows.length === 0 ? (
        <div className="text-center py-14 text-slate-400 text-sm">
          <Layers size={28} className="mx-auto mb-2 opacity-30" />
          Aucun escrow trouvé.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100">
                {["Contrat / Projet", "Client → Provider", "Montant brut", "Commission", "PSP Djomy", "Net provider", "Net plateforme", "Statut", "Date"].map((h) => (
                  <th key={h} className="text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wide pb-3 pr-4 last:pr-0 whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id} className="border-b border-slate-50 hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 pr-4">
                    <p className="text-[10px] font-mono text-slate-400 truncate max-w-[80px]">
                      {row.contract_id?.slice(0, 8)}…
                    </p>
                    <p className="text-sm font-medium text-slate-700 truncate max-w-[140px]">
                      {row.project_title ?? "—"}
                    </p>
                  </td>
                  <td className="py-3 pr-4 text-xs text-slate-500 whitespace-nowrap">
                    <span className="text-slate-700 font-medium">{row.client_username ?? "—"}</span>
                    <span className="mx-1 text-slate-300">→</span>
                    <span className="text-indigo-600">{row.provider_username ?? "—"}</span>
                  </td>
                  <td className="py-3 pr-4 font-semibold text-slate-800 whitespace-nowrap">{fmtGNF(row.gross_amount)}</td>
                  <td className="py-3 pr-4 whitespace-nowrap">
                    <span className="text-amber-700 font-medium">{fmtGNF(row.fee_amount)}</span>
                    <span className="text-slate-400 text-xs ml-1">({row.fee_percent}%)</span>
                  </td>
                  <td className="py-3 pr-4 text-red-500 text-xs font-medium whitespace-nowrap">−{fmtGNF(row.psp_fee_amount)}</td>
                  <td className="py-3 pr-4 text-emerald-700 font-semibold whitespace-nowrap">{fmtGNF(row.net_amount)}</td>
                  <td className="py-3 pr-4 text-indigo-700 font-semibold whitespace-nowrap">{fmtGNF(row.platform_net_revenue)}</td>
                  <td className="py-3 pr-4"><StatusBadge status={row.status} /></td>
                  <td className="py-3 text-xs text-slate-400 whitespace-nowrap">{fmtDate(row.funded_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <Pagination page={page} count={data?.count ?? 0} pageSize={20} onChange={setPage} />
    </div>
  );
}

// ── Payments table ─────────────────────────────────────────────────────────────

function PaymentsTable() {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");
  const { data, isLoading } = useAdminPayments({ page, status: statusFilter || undefined });
  const rows: AdminPaymentItem[] = data?.results ?? [];

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2 mb-5">
        <span className="text-xs text-slate-400 font-medium">Filtrer :</span>
        {["", "SUCCESS", "PENDING", "FAILED"].map((s) => (
          <button
            key={s}
            onClick={() => { setStatusFilter(s); setPage(1); }}
            className={`text-xs px-3 py-1.5 rounded-full border transition-all font-medium ${
              statusFilter === s
                ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                : "border-slate-200 text-slate-500 hover:border-slate-400 bg-white"
            }`}
          >
            {s === "" ? "Tous" : s === "SUCCESS" ? "Succès" : s === "PENDING" ? "En attente" : "Échoués"}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {[1,2,3,4,5].map((i) => <Skel key={i} className="h-12 w-full" />)}
        </div>
      ) : rows.length === 0 ? (
        <div className="text-center py-14 text-slate-400 text-sm">
          <CreditCard size={28} className="mx-auto mb-2 opacity-30" />
          Aucune transaction trouvée.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100">
                {["Référence", "Payeur", "Projet", "Montant", "PSP", "Statut", "Date"].map((h) => (
                  <th key={h} className="text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wide pb-3 pr-4 last:pr-0 whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id} className="border-b border-slate-50 hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 pr-4">
                    <p className="text-[10px] font-mono text-slate-400">{row.reference}</p>
                  </td>
                  <td className="py-3 pr-4 text-slate-700 font-medium">{row.username ?? "—"}</td>
                  <td className="py-3 pr-4 text-slate-500 max-w-[160px] truncate">
                    {row.project_title ?? (row.contract_id ? `#${row.contract_id.slice(0, 8)}` : "—")}
                  </td>
                  <td className="py-3 pr-4 font-semibold text-slate-800 whitespace-nowrap">
                    {row.amount ? fmtGNF(row.amount) : "—"}
                  </td>
                  <td className="py-3 pr-4 text-xs text-slate-400">{row.provider}</td>
                  <td className="py-3 pr-4"><StatusBadge status={row.status} /></td>
                  <td className="py-3 text-xs text-slate-400 whitespace-nowrap">{fmtDate(row.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <Pagination page={page} count={data?.count ?? 0} pageSize={25} onChange={setPage} />
    </div>
  );
}

// ── Main page ──────────────────────────────────────────────────────────────────

const DATA_TABS = [
  { id: "escrows",       label: "Escrows",        icon: Layers },
  { id: "paiements",     label: "Paiements",      icon: CreditCard },
  { id: "abonnements",   label: "Abonnements",    icon: Crown },
  { id: "retraits",      label: "Retraits",       icon: ArrowDownRight },
];

export default function AdminComptabilite() {
  const [period, setPeriod] = useState<PeriodKey>("current_month");
  const [dataTab, setDataTab] = useState("escrows");
  const { data, isLoading, refetch, isFetching } = useAdminFinanceOverview();

  const overview = data;
  const p: FinancePeriod | undefined = overview?.[period];
  const prev: FinancePeriod | undefined = period === "current_month" ? overview?.last_month : undefined;

  const netTrend = prev ? pct(p?.total_net_revenue ?? "0", prev.total_net_revenue) : null;
  const grossTrend = prev ? pct(p?.contracts_gross_volume ?? "0", prev.contracts_gross_volume) : null;
  const subTrend = prev ? pct(p?.sub_gross ?? "0", prev.sub_gross) : null;
  const pspTrend = prev ? pct(p?.total_psp_costs ?? "0", prev.total_psp_costs) : null;

  const chartData = (overview?.monthly_revenue ?? []).map((m) => ({
    name: m.month_label,
    "Net total":       Math.round(parseFloat(m.total_net)),
    "Net contrats":    Math.round(parseFloat(m.contracts_net)),
    "Net abonnements": Math.round(parseFloat(m.sub_net)),
    "Retraits":        Math.round(parseFloat(m.withdrawals)),
  }));

  const subBarData = (overview?.monthly_revenue ?? []).map((m) => ({
    name: m.month_label,
    "Brut abonnements": Math.round(parseFloat(m.sub_gross)),
    "Net abonnements":  Math.round(parseFloat(m.sub_net)),
    "PSP abonnements":  Math.round(parseFloat(m.sub_psp)),
  }));

  return (
    <div className="min-h-screen" style={{ background: "#f0f2f5" }}>

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <header
        className="sticky top-0 z-40 h-14 flex items-center justify-between px-6 border-b border-white/8"
        style={{ background: "hsl(231,68%,18%)" }}
      >
        <div className="flex items-center gap-3">
          <Link
            to={ROUTES.ADMIN.DASHBOARD}
            className="flex items-center gap-1.5 text-white/50 hover:text-white/80 transition-colors text-sm"
          >
            <ArrowLeft size={14} />
            <span>Dashboard</span>
          </Link>
          <span className="text-white/20 text-xs">/</span>
          <div className="flex items-center gap-1.5">
            <DollarSign size={14} className="text-amber-400" />
            <span className="text-white text-sm font-semibold">Comptabilité</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {overview && (
            <span className="text-white/30 text-[11px]">
              PSP Djomy · {overview.psp_rate}%
            </span>
          )}
          <button
            onClick={() => refetch()}
            disabled={isFetching}
            className="flex items-center gap-1.5 text-white/50 hover:text-white/70 text-xs transition-colors"
          >
            <RefreshCw size={12} className={isFetching ? "animate-spin" : ""} />
            Actualiser
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-7 space-y-6">

        {/* ── Hero banner ────────────────────────────────────────────────── */}
        <div
          className="rounded-2xl overflow-hidden shadow-sm relative"
          style={{ background: "linear-gradient(140deg, hsl(231,68%,22%) 0%, hsl(231,68%,29%) 60%, hsl(250,60%,32%) 100%)" }}
        >
          {/* decorative ring */}
          <div
            className="absolute -top-20 -right-20 w-72 h-72 rounded-full opacity-10"
            style={{ background: "radial-gradient(circle, #fff 0%, transparent 70%)" }}
          />
          <div className="relative px-7 py-6 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <p className="text-white/50 text-[11px] font-semibold uppercase tracking-widest mb-1">
                Revenu net total · Cumulé
              </p>
              {isLoading ? (
                <Skel className="h-12 w-56 bg-white/10" />
              ) : (
                <p className="text-5xl font-bold text-white tracking-tight leading-none">
                  {fmtShort(overview?.all_time.total_net_revenue)}
                  <span className="text-2xl font-normal text-white/40 ml-2">GNF</span>
                </p>
              )}
              <p className="text-white/35 text-xs mt-2">
                Commissions nettes contrats + revenus nets abonnements, après déduction PSP Djomy
              </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 shrink-0">
              {[
                { label: "Contrats libérés", value: String(overview?.all_time.contracts_released ?? 0), isCount: true, color: "text-white" },
                { label: "Abonnements payés", value: String(overview?.subscriptions?.revenue_count ?? 0), isCount: true, color: "text-purple-300" },
                { label: "Net contrats", value: overview?.all_time.contracts_net, color: "text-indigo-300" },
                { label: "Net abonnements", value: overview?.all_time.sub_net, color: "text-violet-300" },
              ].map((item) => (
                <div key={item.label} className="text-center px-3 py-2 rounded-xl bg-white/8 backdrop-blur-sm">
                  <p className="text-white/40 text-[9px] font-semibold uppercase tracking-wider mb-0.5">
                    {item.label}
                  </p>
                  {isLoading ? (
                    <Skel className="h-5 w-16 mx-auto bg-white/10" />
                  ) : (
                    <p className={`text-sm font-bold ${item.color}`}>
                      {item.isCount ? item.value : fmtShort(item.value ?? "0")}
                      {!item.isCount && <span className="text-xs font-normal ml-0.5 text-white/30">GNF</span>}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Period selector ─────────────────────────────────────────────── */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-700">Analyse par période</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              {period === "current_month" ? "Mois en cours" : period === "last_month" ? "Mois précédent" : "Données cumulées depuis le début"}
            </p>
          </div>
          <PeriodSelector value={period} onChange={setPeriod} />
        </div>

        {/* ── 4 KPI cards ─────────────────────────────────────────────────── */}
        <AnimatePresence mode="wait">
          <div key={period} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <KpiCard
              index={0}
              label="Revenu net total"
              value={fmtShort(p?.total_net_revenue ?? "0") + " GNF"}
              sub={prev ? `Mois dernier : ${fmtShort(prev.total_net_revenue)} GNF` : undefined}
              trend={netTrend}
              icon={TrendingUp}
              accent="#4f46e5"
              loading={isLoading}
            />
            <KpiCard
              index={1}
              label="Volume brut contrats"
              value={fmtShort(p?.contracts_gross_volume ?? "0") + " GNF"}
              sub={`${p?.contracts_released ?? 0} contrat(s) libéré(s)`}
              trend={grossTrend}
              icon={BarChart2}
              accent="#0ea5e9"
              loading={isLoading}
            />
            <KpiCard
              index={2}
              label="Revenus abonnements (brut)"
              value={fmtShort(p?.sub_gross ?? "0") + " GNF"}
              sub={`${p?.sub_count ?? 0} paiement(s)`}
              trend={subTrend}
              icon={Crown}
              accent="#7c3aed"
              loading={isLoading}
            />
            <KpiCard
              index={3}
              label="Frais PSP Djomy absorbés"
              value={fmtShort(p?.total_psp_costs ?? "0") + " GNF"}
              sub="1,5% sur contrats + abonnements"
              trend={pspTrend != null ? -pspTrend : null}
              icon={CreditCard}
              accent="#ef4444"
              loading={isLoading}
            />
          </div>
        </AnimatePresence>

        {/* ── P&L + Donut ─────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
          <div className="lg:col-span-3">
            <PLStatement p={p} loading={isLoading} />
          </div>
          <div className="lg:col-span-2">
            <RevenueDonut p={p} loading={isLoading} />
          </div>
        </div>

        {/* ── 12-month trend ──────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.4 }}
          className="bg-white rounded-2xl border border-slate-200/70 shadow-sm p-6"
        >
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <Activity size={15} className="text-slate-400" />
              <h3 className="text-sm font-semibold text-slate-700">Tendance sur 12 mois</h3>
            </div>
            <div className="flex items-center gap-4 text-xs">
              {[
                { color: "#059669", label: "Net total" },
                { color: "#4f46e5", label: "Net contrats" },
                { color: "#7c3aed", label: "Net abonnements" },
              ].map((l) => (
                <div key={l.label} className="flex items-center gap-1.5 text-slate-500">
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ background: l.color }} />
                  {l.label}
                </div>
              ))}
            </div>
          </div>
          <RevenueChart chartData={chartData} loading={isLoading} />
        </motion.div>

        {/* ── Liquidity KPIs ──────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <KpiCard index={0} label="Wallets providers" value={fmtShort(overview?.wallets.total_balance ?? "0") + " GNF"} sub={`${overview?.wallets.wallet_count ?? 0} wallet(s)`} icon={Wallet} accent="#8b5cf6" loading={isLoading} />
          <KpiCard index={1} label="Escrows en cours" value={fmtShort(overview?.escrow.funded_amount ?? "0") + " GNF"} sub={`${overview?.escrow.funded_count ?? 0} contrat(s) financé(s)`} icon={Layers} accent="#6366f1" loading={isLoading} />
          <KpiCard index={2} label="Retraits en attente" value={fmtShort(overview?.withdrawals.pending_total ?? "0") + " GNF"} sub={`${overview?.withdrawals.pending_count ?? 0} demande(s)`} icon={Clock} accent="#f59e0b" loading={isLoading} />
          <KpiCard index={3} label="Retraits approuvés (cumul)" value={fmtShort(overview?.withdrawals.approved_total ?? "0") + " GNF"} sub={`${overview?.withdrawals.approved_count ?? 0} versements`} icon={ArrowDownRight} accent="#10b981" loading={isLoading} />
        </div>

        {/* ── Data tabs ───────────────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-slate-200/70 shadow-sm">
          {/* Tab bar */}
          <div className="flex gap-0.5 border-b border-slate-100 px-4 pt-2">
            {DATA_TABS.map((t) => {
              const Icon = t.icon;
              const isActive = dataTab === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setDataTab(t.id)}
                  className={`relative flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium rounded-t-lg border-b-2 -mb-px transition-colors ${
                    isActive
                      ? "border-indigo-600 text-indigo-700"
                      : "border-transparent text-slate-500 hover:text-slate-700"
                  }`}
                >
                  <Icon size={14} />
                  {t.label}
                </button>
              );
            })}
          </div>

          <div className="p-6">
            <AnimatePresence mode="wait">

              {/* Escrows */}
              {dataTab === "escrows" && (
                <motion.div key="escrows" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                  <EscrowTable />
                </motion.div>
              )}

              {/* Paiements */}
              {dataTab === "paiements" && (
                <motion.div key="paiements" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                  <PaymentsTable />
                </motion.div>
              )}

              {/* Abonnements */}
              {dataTab === "abonnements" && (
                <motion.div key="abonnements" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="space-y-7">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <KpiCard index={0} label="Brut total encaissé" value={fmtShort(overview?.subscriptions?.gross_total ?? "0") + " GNF"} sub={`${overview?.subscriptions?.revenue_count ?? 0} paiements cumulés`} icon={Crown} accent="#8b5cf6" loading={isLoading} />
                    <KpiCard index={1} label="Net après PSP Djomy" value={fmtShort(overview?.subscriptions?.net_total ?? "0") + " GNF"} icon={TrendingUp} accent="#4f46e5" loading={isLoading} />
                    <KpiCard index={2} label="PSP absorbé (1,5%)" value={fmtShort(overview?.subscriptions?.psp_total ?? "0") + " GNF"} icon={Minus} accent="#ef4444" loading={isLoading} />
                    <KpiCard index={3} label="Remboursés / Échoués" value={fmtShort(overview?.subscriptions?.refunded_total ?? "0") + " GNF"} sub={`${overview?.subscriptions?.failed_count ?? 0} paiement(s) échoué(s)`} icon={XCircle} accent="#f59e0b" loading={isLoading} />
                  </div>

                  {/* By tier */}
                  {!isLoading && (overview?.subscriptions?.by_tier?.length ?? 0) > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">Répartition par plan</p>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {overview!.subscriptions.by_tier.map((t, i) => {
                          const color = TIER_COLORS[t.tier] ?? "#64748b";
                          const pctVal = n(overview?.subscriptions?.gross_total) > 0
                            ? Math.round((n(t.gross) / n(overview!.subscriptions.gross_total)) * 100)
                            : 0;
                          return (
                            <motion.div
                              key={t.tier}
                              custom={i}
                              variants={fadeUp}
                              initial="hidden"
                              animate="show"
                              className="rounded-2xl border border-slate-200/70 p-4 bg-white shadow-sm"
                            >
                              <div className="flex items-center gap-2 mb-2">
                                <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: `${color}18` }}>
                                  <Crown size={13} style={{ color }} />
                                </div>
                                <span className="text-sm font-semibold text-slate-700">{TIER_LABELS[t.tier] ?? t.tier}</span>
                              </div>
                              <p className="text-lg font-bold text-slate-800">{fmtGNF(t.gross)}</p>
                              <p className="text-[11px] text-red-500 font-medium">PSP : −{fmtGNF(t.psp_cost)}</p>
                              <p className="text-sm font-semibold text-emerald-700">Net : {fmtGNF(t.net)}</p>
                              <p className="text-[11px] text-slate-400 mt-1">{t.count} abonnement(s)</p>
                              <div className="mt-2">
                                <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
                                  <div className="h-full rounded-full transition-all" style={{ width: `${pctVal}%`, background: color }} />
                                </div>
                                <p className="text-[10px] text-slate-400 mt-0.5">{pctVal}% du brut total</p>
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Monthly sub chart */}
                  {subBarData.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">Abonnements par mois</p>
                      <div className="h-52">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={subBarData} barGap={3} barCategoryGap="30%">
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                            <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                            <YAxis tickFormatter={(v) => fmtShort(v)} tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} width={68} />
                            <Tooltip contentStyle={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, fontSize: 12 }} formatter={(v: number) => [fmtGNF(v), ""]} />
                            <Bar dataKey="Brut abonnements" fill="#c4b5fd" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="Net abonnements"  fill="#7c3aed" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="PSP abonnements"  fill="#fca5a5" radius={[4, 4, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  )}

                  {/* Pending / failed note */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      { label: "En attente de paiement", value: overview?.subscriptions?.pending_total, icon: Clock, color: "#d97706", bg: "#fef3c7" },
                      { label: "Remboursés", value: overview?.subscriptions?.refunded_total, icon: ArrowUpRight, color: "#dc2626", bg: "#fee2e2" },
                    ].map((item) => {
                      const Icon = item.icon;
                      return (
                        <div key={item.label} className="rounded-xl border border-slate-200/70 p-4 flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: item.bg }}>
                            <Icon size={16} style={{ color: item.color }} />
                          </div>
                          <div>
                            <p className="text-xs text-slate-500">{item.label}</p>
                            <p className="text-base font-bold text-slate-800">{fmtGNF(item.value)}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {/* Retraits */}
              {dataTab === "retraits" && overview && (
                <motion.div key="retraits" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {[
                      { label: "Approuvés", total: overview.withdrawals.approved_total, count: overview.withdrawals.approved_count, color: "#059669", bg: "#d1fae5", icon: CheckCircle2 },
                      { label: "En attente", total: overview.withdrawals.pending_total,  count: overview.withdrawals.pending_count,  color: "#d97706", bg: "#fef3c7", icon: Clock },
                      { label: "Rejetés",   total: overview.withdrawals.rejected_total, count: overview.withdrawals.rejected_count, color: "#dc2626", bg: "#fee2e2", icon: XCircle },
                    ].map((r) => {
                      const Icon = r.icon;
                      return (
                        <div key={r.label} className="rounded-2xl border border-slate-200/70 p-5 bg-white shadow-sm flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: r.bg }}>
                            <Icon size={16} style={{ color: r.color }} />
                          </div>
                          <div>
                            <p className="text-xs text-slate-500 font-medium">{r.label}</p>
                            <p className="text-lg font-bold text-slate-800">{fmtGNF(r.total)}</p>
                            <p className="text-[11px] text-slate-400">{r.count} demande{r.count > 1 ? "s" : ""}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="rounded-xl border border-slate-100 p-4 flex items-center justify-between bg-slate-50">
                    <div>
                      <p className="text-sm font-semibold text-slate-600">Remboursements clients (escrows)</p>
                      <p className="text-xl font-bold text-slate-800 mt-0.5">{fmtGNF(overview.escrow.refunded_amount)}</p>
                      <p className="text-xs text-slate-400">{overview.escrow.refunded_count} contrat(s) remboursé(s) intégralement</p>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center">
                      <ArrowUpRight size={20} className="text-amber-500" />
                    </div>
                  </div>

                  {/* Monthly withdrawal chart */}
                  {chartData.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">Retraits approuvés par mois</p>
                      <div className="h-44">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={chartData} barCategoryGap="30%">
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                            <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                            <YAxis tickFormatter={(v) => fmtShort(v)} tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} width={68} />
                            <Tooltip contentStyle={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, fontSize: 12 }} formatter={(v: number) => [fmtGNF(v), ""]} />
                            <Bar dataKey="Retraits" fill="#10b981" radius={[4, 4, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  )}

                  <div className="flex justify-end">
                    <Link
                      to={ROUTES.ADMIN.WITHDRAWALS}
                      className="flex items-center gap-1.5 text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
                    >
                      Gérer les retraits en attente
                      <ArrowDownRight size={14} />
                    </Link>
                  </div>
                </motion.div>
              )}

            </AnimatePresence>
          </div>
        </div>

        {/* ── Bilan simplifié ─────────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-slate-200/70 shadow-sm">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2">
            <Layers size={15} className="text-slate-400" />
            <h3 className="text-sm font-semibold text-slate-700">Bilan simplifié · Cumulé</h3>
          </div>
          <div className="p-6 grid grid-cols-1 sm:grid-cols-3 gap-6">
            {/* Actif */}
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3">ACTIF</p>
              <div className="space-y-0.5">
                {[
                  { label: "Wallets providers",   value: overview?.wallets.total_balance ?? "0", color: "text-slate-700" },
                  { label: "Escrows en cours",     value: overview?.escrow.funded_amount ?? "0", color: "text-indigo-600" },
                ].map((r) => (
                  <div key={r.label} className="flex items-center justify-between py-2.5 border-b border-slate-50">
                    <span className="text-sm text-slate-500">{r.label}</span>
                    <span className={`text-sm font-semibold ${r.color}`}>
                      {isLoading ? <Skel className="h-4 w-20 inline-block" /> : fmtGNF(r.value)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            {/* Passif */}
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3">PASSIF / ENGAGEMENTS</p>
              <div className="space-y-0.5">
                {[
                  { label: "Retraits approuvés", value: overview?.withdrawals.approved_total ?? "0", color: "text-red-600" },
                  { label: "Retraits en attente", value: overview?.withdrawals.pending_total  ?? "0", color: "text-amber-600" },
                  { label: "Remboursements",      value: overview?.escrow.refunded_amount     ?? "0", color: "text-orange-500" },
                ].map((r) => (
                  <div key={r.label} className="flex items-center justify-between py-2.5 border-b border-slate-50">
                    <span className="text-sm text-slate-500">{r.label}</span>
                    <span className={`text-sm font-semibold ${r.color}`}>
                      {isLoading ? <Skel className="h-4 w-20 inline-block" /> : fmtGNF(r.value)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            {/* Résultat */}
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3">RÉSULTAT PLATEFORME</p>
              <div className="space-y-0.5">
                {[
                  { label: "Commissions contrats (brut)", value: overview?.all_time.contracts_commission_gross ?? "0", color: "text-amber-600" },
                  { label: "PSP contrats (BD)",           value: overview?.all_time.contracts_psp_costs        ?? "0", color: "text-red-500", prefix: "−" },
                  { label: "Net contrats",                value: overview?.all_time.contracts_net              ?? "0", color: "text-indigo-600" },
                  { label: "Brut abonnements",            value: overview?.subscriptions?.gross_total          ?? "0", color: "text-purple-600", prefix: "+" },
                  { label: "PSP abonnements (calculé)",   value: overview?.subscriptions?.psp_total            ?? "0", color: "text-red-500", prefix: "−" },
                  { label: "Net abonnements",             value: overview?.subscriptions?.net_total            ?? "0", color: "text-purple-700" },
                  { label: "RÉSULTAT NET TOTAL",          value: overview?.all_time.total_net_revenue          ?? "0", color: "text-emerald-700", bold: true },
                ].map((r) => (
                  <div key={r.label} className={`flex items-center justify-between py-2.5 border-b border-slate-50 ${(r as { bold?: boolean }).bold ? "border-slate-200" : ""}`}>
                    <span className={`text-sm ${(r as { bold?: boolean }).bold ? "font-bold text-slate-800" : "text-slate-500"}`}>{r.label}</span>
                    <span className={`text-sm font-semibold ${r.color}`}>
                      {isLoading ? <Skel className="h-4 w-20 inline-block" /> : (
                        <>
                          {(r as { prefix?: string }).prefix && (r as { prefix?: string }).prefix !== "=" && (r as { prefix?: string }).prefix}
                          {fmtGNF(r.value)}
                        </>
                      )}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}
