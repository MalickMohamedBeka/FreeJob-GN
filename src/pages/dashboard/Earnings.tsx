import { motion } from "framer-motion";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Coins, TrendingUp, Download, Calendar } from "lucide-react";

const transactions = [
  { id: 1, project: "Application Mobile E-commerce", client: "Orange Guinée", amount: "8,500 GNF", date: "5 Fév 2026", status: "Payé", type: "Paiement final" },
  { id: 2, project: "Dashboard Analytics", client: "MTN Guinée", amount: "15,000 GNF", date: "1 Fév 2026", status: "Payé", type: "Paiement final" },
  { id: 3, project: "Site Web Corporate", client: "Ecobank Guinée", amount: "3,100 GNF", date: "28 Jan 2026", status: "Payé", type: "Acompte 50%" },
  { id: 4, project: "Système Gestion Inventaire", client: "UBA Guinée", amount: "6,000 GNF", date: "20 Jan 2026", status: "Payé", type: "Acompte 50%" },
  { id: 5, project: "Application Livraison", client: "BICIGUI", amount: "10,500 GNF", date: "15 Jan 2026", status: "Payé", type: "Paiement final" },
  { id: 6, project: "Site Web Corporate", client: "Ecobank Guinée", amount: "3,100 GNF", date: "En attente", status: "En attente", type: "Solde 50%" },
  { id: 7, project: "Système Gestion Inventaire", client: "UBA Guinée", amount: "6,000 GNF", date: "10 Mar 2026", status: "À venir", type: "Solde 50%" },
];

const monthlyEarnings = [
  { month: "Sep 2025", amount: 8200 },
  { month: "Oct 2025", amount: 9500 },
  { month: "Nov 2025", amount: 11200 },
  { month: "Déc 2025", amount: 10800 },
  { month: "Jan 2026", amount: 13100 },
  { month: "Fév 2026", amount: 15500 },
];

const Earnings = () => {
  const totalEarned = transactions.filter(t => t.status === "Payé").reduce((sum, t) => sum + parseFloat(t.amount.replace(/,/g, '')), 0);
  const pending = transactions.filter(t => t.status === "En attente").reduce((sum, t) => sum + parseFloat(t.amount.replace(/,/g, '')), 0);
  const upcoming = transactions.filter(t => t.status === "À venir").reduce((sum, t) => sum + parseFloat(t.amount.replace(/,/g, '')), 0);

  return (
    <DashboardLayout userType="freelancer">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Mes Revenus</h1>
            <p className="text-muted-foreground">Suivez vos gains et transactions</p>
          </div>
          <Button>
            <Download size={16} className="mr-2" />
            Exporter
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Total Gagné</p>
              <div className="p-2 rounded-lg bg-primary/10">
                <Coins className="text-primary" size={20} />
              </div>
            </div>
            <p className="text-3xl font-bold">{totalEarned.toLocaleString()} GNF</p>
            <p className="text-xs text-primary mt-1">+18% vs mois dernier</p>
          </Card>
          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">En Attente</p>
              <div className="p-2 rounded-lg bg-secondary/10">
                <Calendar className="text-secondary" size={20} />
              </div>
            </div>
            <p className="text-3xl font-bold">{pending.toLocaleString()} GNF</p>
            <p className="text-xs text-muted-foreground mt-1">1 paiement</p>
          </Card>
          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">À Venir</p>
              <div className="p-2 rounded-lg bg-secondary/10">
                <TrendingUp className="text-secondary" size={20} />
              </div>
            </div>
            <p className="text-3xl font-bold">{upcoming.toLocaleString()} GNF</p>
            <p className="text-xs text-muted-foreground mt-1">1 paiement prévu</p>
          </Card>
          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Ce Mois</p>
              <div className="p-2 rounded-lg bg-primary/10">
                <Coins className="text-primary" size={20} />
              </div>
            </div>
            <p className="text-3xl font-bold">15,500 GNF</p>
            <p className="text-xs text-primary mt-1">+18% vs Jan</p>
          </Card>
        </div>

        {/* Chart */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-6">Évolution des Revenus</h3>
          <div className="flex items-end justify-between gap-2 h-64">
            {monthlyEarnings.map((data, index) => {
              const maxAmount = Math.max(...monthlyEarnings.map(d => d.amount));
              const height = (data.amount / maxAmount) * 100;
              return (
                <motion.div
                  key={data.month}
                  initial={{ height: 0 }}
                  animate={{ height: `${height}%` }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className="flex-1 flex flex-col items-center group"
                >
                  <div className="w-full bg-gradient-to-t from-primary to-secondary rounded-t-lg relative">
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-foreground text-background text-xs px-3 py-1.5 rounded whitespace-nowrap font-medium">
                      {data.amount.toLocaleString()} GNF
                    </div>
                  </div>
                  <span className="text-xs font-medium mt-3 text-center">{data.month}</span>
                </motion.div>
              );
            })}
          </div>
        </Card>

        {/* Transactions */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Historique des Transactions</h3>
          <div className="space-y-3">
            {transactions.map((transaction, index) => (
              <motion.div
                key={transaction.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center justify-between p-4 rounded-lg border border-border hover:border-primary/50 transition-colors"
              >
                <div className="flex-1">
                  <h4 className="font-semibold mb-1">{transaction.project}</h4>
                  <p className="text-sm text-muted-foreground">{transaction.client} • {transaction.type}</p>
                </div>
                <div className="text-right mr-4">
                  <p className="font-bold text-lg">{transaction.amount}</p>
                  <p className="text-sm text-muted-foreground">{transaction.date}</p>
                </div>
                <Badge className={
                  transaction.status === "Payé" ? "bg-primary text-white" :
                  transaction.status === "En attente" ? "bg-secondary text-white" :
                  "bg-secondary text-white"
                }>
                  {transaction.status}
                </Badge>
              </motion.div>
            ))}
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Earnings;
