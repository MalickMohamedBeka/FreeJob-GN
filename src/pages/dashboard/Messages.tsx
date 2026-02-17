import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { UnderConstruction } from "@/components/common";

const Messages = () => {
  return (
    <DashboardLayout userType="freelancer">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Messages</h1>
          <p className="text-muted-foreground">Communiquez avec vos clients</p>
        </div>

        <UnderConstruction
          title="Messagerie"
          description="La messagerie intégrée sera disponible prochainement. En attendant, utilisez les coordonnées de vos clients pour les contacter."
        />
      </div>
    </DashboardLayout>
  );
};

export default Messages;
