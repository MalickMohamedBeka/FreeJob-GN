import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { UnderConstruction } from "@/components/common";

const AdminDashboard = () => {
  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <div className="bg-primary text-white p-6 lg:p-8">
        <div className="container mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Dashboard Administrateur</h1>
              <p className="text-white/80">Bienvenue, Admin</p>
            </div>
            <Link to="/">
              <Button variant="secondary">
                Retour à l'accueil
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto p-6 lg:p-8">
        <UnderConstruction
          title="Panneau d'administration"
          description="Le panneau d'administration sera disponible prochainement. Les fonctionnalités de gestion des utilisateurs, projets et transactions sont en cours de développement."
        />
      </div>
    </div>
  );
};

export default AdminDashboard;
