import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { UnderConstruction } from "@/components/common";
import { ArrowUpRight } from "lucide-react";
import { ROUTES } from "@/constants/routes";
import { useAdminPendingWithdrawals } from "@/hooks/useWallet";

const AdminDashboard = () => {
  const { data: pendingData } = useAdminPendingWithdrawals();
  const pendingCount = pendingData?.count ?? 0;

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

      <div className="container mx-auto p-6 lg:p-8 space-y-6">
        {/* Quick actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link to={ROUTES.ADMIN.WITHDRAWALS}>
            <Card className="p-5 hover:shadow-md transition-shadow cursor-pointer group">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">
                    Retraits en attente
                  </p>
                  <p className="text-3xl font-extrabold mt-1 text-foreground">
                    {pendingCount}
                  </p>
                </div>
                <ArrowUpRight
                  size={18}
                  className="text-muted-foreground group-hover:text-primary transition-colors mt-0.5"
                />
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Gérer les demandes de retrait
              </p>
            </Card>
          </Link>
        </div>

        <UnderConstruction
          title="Panneau d'administration"
          description="Le panneau d'administration sera disponible prochainement. Les fonctionnalités de gestion des utilisateurs, projets et transactions sont en cours de développement."
        />
      </div>
    </div>
  );
};

export default AdminDashboard;
