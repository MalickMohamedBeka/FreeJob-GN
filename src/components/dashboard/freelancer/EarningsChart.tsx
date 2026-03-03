import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Loader2, TrendingUp, ArrowDownLeft } from "lucide-react";
import { useWalletTransactions, useWallet } from "@/hooks/useWallet";
import type { TransactionTypeEnum } from "@/types";

// Transaction types that count as income for the provider
const INCOME_TYPES = new Set<TransactionTypeEnum>([
  "DEPOSIT",
  "ESCROW_RELEASE",
  "TRANSFER_IN",
  "REFUND",
]);

function formatMonth(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("fr-FR", {
    month: "long",
    year: "numeric",
  });
}

const EarningsChart = () => {
  const { data: txData, isLoading } = useWalletTransactions(1);
  const { data: wallet } = useWallet();
  const currency = wallet?.currency ?? "GNF";

  const income = (txData?.results ?? []).filter((tx) =>
    INCOME_TYPES.has(tx.transaction_type)
  );

  // Group by month (yyyy-mm key for correct ordering)
  const byMonth = income.reduce<Record<string, { label: string; total: number }>>(
    (acc, tx) => {
      const d = new Date(tx.created_at);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      if (!acc[key]) acc[key] = { label: formatMonth(tx.created_at), total: 0 };
      acc[key].total += parseFloat(tx.amount);
      return acc;
    },
    {}
  );

  const months = Object.entries(byMonth)
    .sort(([a], [b]) => b.localeCompare(a)) // most recent first
    .slice(0, 6);

  const maxTotal = months.length > 0 ? Math.max(...months.map(([, v]) => v.total)) : 1;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
    >
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-5">
          <TrendingUp size={20} className="text-primary" />
          <h3 className="text-lg font-semibold">Revenus Mensuels</h3>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="animate-spin text-primary" size={24} />
          </div>
        ) : months.length === 0 ? (
          <div className="text-center py-10 text-muted-foreground">
            <ArrowDownLeft size={32} className="mx-auto mb-3 opacity-30" />
            <p className="text-sm">Aucun revenu enregistré pour le moment.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {months.map(([key, { label, total }]) => {
              const pct = Math.round((total / maxTotal) * 100);
              return (
                <div key={key}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="capitalize text-muted-foreground">{label}</span>
                    <span className="font-semibold tabular-nums">
                      {total.toLocaleString("fr-FR")} {currency}
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-full bg-primary transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </motion.div>
  );
};

export default EarningsChart;
