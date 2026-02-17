import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { UnderConstruction } from "@/components/common";

const Earnings = () => {
  return (
    <DashboardLayout userType="freelancer">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Mes Revenus</h1>
          <p className="text-muted-foreground">Suivez vos gains et transactions</p>
        </div>

        <UnderConstruction
          title="Gestion des revenus"
          description="Le suivi des revenus et l'historique des transactions seront disponibles prochainement."
        />
      </div>
    </DashboardLayout>
  );
};

export default Earnings;
