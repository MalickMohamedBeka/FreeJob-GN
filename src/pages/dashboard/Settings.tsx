import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { UnderConstruction } from "@/components/common";

const Settings = () => {
  return (
    <DashboardLayout userType="freelancer">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Paramètres</h1>
          <p className="text-muted-foreground">Gérez vos préférences et votre compte</p>
        </div>

        <UnderConstruction
          title="Paramètres du compte"
          description="La gestion des paramètres sera disponible prochainement."
        />
      </div>
    </DashboardLayout>
  );
};

export default Settings;
