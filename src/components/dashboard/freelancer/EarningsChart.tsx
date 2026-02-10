import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";

const monthlyData = [
  { month: "Jan", earnings: 8500 },
  { month: "Fév", earnings: 10200 },
  { month: "Mar", earnings: 12450 },
];

const EarningsChart = () => {
  const maxEarnings = Math.max(...monthlyData.map((d) => d.earnings));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
    >
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold mb-1">Revenus Mensuels</h3>
            <p className="text-sm text-muted-foreground">Évolution des 3 derniers mois</p>
          </div>
          <div className="flex items-center gap-2 text-green-600">
            <TrendingUp size={20} />
            <span className="font-semibold">+18%</span>
          </div>
        </div>

        <div className="flex items-end justify-between gap-4 h-48">
          {monthlyData.map((data, index) => {
            const height = (data.earnings / maxEarnings) * 100;
            return (
              <motion.div
                key={data.month}
                initial={{ height: 0 }}
                animate={{ height: `${height}%` }}
                transition={{ delay: 0.6 + index * 0.1, duration: 0.5 }}
                className="flex-1 flex flex-col items-center"
              >
                <div className="w-full bg-gradient-to-t from-primary to-secondary rounded-t-lg relative group">
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-foreground text-background text-xs px-2 py-1 rounded whitespace-nowrap">
                    {data.earnings.toLocaleString()} GNF
                  </div>
                </div>
                <span className="text-sm font-medium mt-2">{data.month}</span>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-6 pt-6 border-t border-border">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Total</p>
              <p className="text-lg font-bold">31,150 GNF</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Moyenne</p>
              <p className="text-lg font-bold">10,383 GNF</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Meilleur</p>
              <p className="text-lg font-bold">12,450 GNF</p>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default EarningsChart;
