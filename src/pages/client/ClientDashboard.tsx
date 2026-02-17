import { motion } from "framer-motion";
import { Plus, Briefcase, Users, Clock, CheckCircle, Eye, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useMyProjects } from "@/hooks/useProjects";
import { useContracts } from "@/hooks/useContracts";

const ClientDashboard = () => {
  const { user } = useAuth();
  const { data: projectsData, isLoading: loadingProjects } = useMyProjects();
  const { data: contractsData, isLoading: loadingContracts } = useContracts();

  const projects = projectsData?.results ?? [];
  const contracts = contractsData?.results ?? [];

  const publishedCount = projects.length;
  const inProgressCount = contracts.filter((c) => c.status === "IN_PROGRESS").length;
  const completedCount = contracts.filter((c) => c.status === "COMPLETED").length;

  const stats = [
    {
      icon: Briefcase,
      label: "Projets Publiés",
      value: String(publishedCount),
    },
    {
      icon: Users,
      label: "Propositions Reçues",
      value: "—",
    },
    {
      icon: CheckCircle,
      label: "Projets Terminés",
      value: String(completedCount),
    },
    {
      icon: Clock,
      label: "Projets En Cours",
      value: String(inProgressCount),
    },
  ];

  const isLoading = loadingProjects || loadingContracts;

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <div className="bg-secondary text-white p-6 lg:p-8">
        <div className="container mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Dashboard Client</h1>
              <p className="text-white/80">Bienvenue, {user?.username || "Client"}</p>
            </div>
            <div className="flex gap-3">
              <Link to="/">
                <Button variant="secondary">
                  Retour à l'accueil
                </Button>
              </Link>
              <Button className="bg-primary hover:bg-primary/90">
                <Plus size={18} className="mr-2" />
                Publier un Projet
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto p-6 lg:p-8">
        {/* Stats Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 rounded-xl bg-primary">
                      <Icon className="text-white" size={24} />
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                    <p className="text-2xl font-bold mb-2">
                      {isLoading ? "..." : stat.value}
                    </p>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* My Projects */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-2"
          >
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Briefcase size={20} className="text-secondary" />
                  Mes Projets
                </h3>
                <Button variant="ghost" size="sm">Voir tout</Button>
              </div>

              {loadingProjects ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="animate-spin text-muted-foreground" size={24} />
                </div>
              ) : projects.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">
                  Aucun projet publié.
                </p>
              ) : (
                <div className="space-y-4">
                  {projects.slice(0, 3).map((project) => {
                    const statusLabel =
                      project.status === "IN_PROGRESS" ? "En cours" :
                      project.status === "COMPLETED" || project.status === "CLOSED" ? "Terminé" :
                      project.status_display;
                    const statusClass =
                      project.status === "IN_PROGRESS" ? "bg-secondary text-white" :
                      project.status === "COMPLETED" || project.status === "CLOSED" ? "bg-primary text-white" :
                      "bg-muted text-foreground";

                    return (
                      <div key={project.id} className="p-4 rounded-lg border border-border hover:border-secondary/50 transition-colors">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h4 className="font-semibold mb-1">{project.title}</h4>
                            <p className="text-sm text-muted-foreground">
                              {project.category.name}
                            </p>
                          </div>
                          <Badge className={statusClass}>
                            {statusLabel}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-3 text-sm">
                          <div>
                            <p className="text-muted-foreground">Budget</p>
                            <p className="font-semibold text-primary">{project.budget_band_display}</p>
                          </div>
                          {project.deadline && (
                            <div>
                              <p className="text-muted-foreground">Échéance</p>
                              <p className="font-medium">
                                {new Date(project.deadline).toLocaleDateString("fr-FR")}
                              </p>
                            </div>
                          )}
                        </div>

                        <div className="flex gap-2">
                          <Link to={`/projects/${project.id}`} className="flex-1">
                            <Button size="sm" variant="outline" className="w-full">
                              <Eye size={14} className="mr-1" />
                              Voir détails
                            </Button>
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </Card>
          </motion.div>

          {/* Active Contracts */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Users size={20} className="text-primary" />
                  Contrats En Cours
                </h3>
              </div>

              {loadingContracts ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="animate-spin text-muted-foreground" size={24} />
                </div>
              ) : contracts.filter((c) => c.status === "IN_PROGRESS").length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">
                  Aucun contrat en cours.
                </p>
              ) : (
                <div className="space-y-4">
                  {contracts
                    .filter((c) => c.status === "IN_PROGRESS")
                    .slice(0, 3)
                    .map((contract) => (
                      <div key={contract.id} className="p-4 rounded-lg border border-border hover:border-primary/50 transition-colors">
                        <h4 className="font-semibold text-sm mb-1">
                          {contract.project.title}
                        </h4>
                        <p className="text-sm text-muted-foreground mb-2">
                          Prestataire: {contract.provider.username}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-semibold text-primary">
                            {parseFloat(contract.total_amount).toLocaleString("fr-FR")} GNF
                          </span>
                          <span className="text-xs text-muted-foreground">
                            Depuis le {new Date(contract.start_at).toLocaleDateString("fr-FR")}
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </Card>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-8"
        >
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Actions Rapides</h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button className="h-auto py-4 flex-col gap-2 bg-secondary hover:bg-secondary/90">
                <Plus size={24} />
                <span>Publier un Projet</span>
              </Button>
              <Link to="/freelancers">
                <Button variant="outline" className="h-auto py-4 flex-col gap-2 w-full">
                  <Users size={24} />
                  <span>Trouver des Freelancers</span>
                </Button>
              </Link>
              <Button variant="outline" className="h-auto py-4 flex-col gap-2">
                <Briefcase size={24} />
                <span>Gérer mes Projets</span>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex-col gap-2">
                <CheckCircle size={24} />
                <span>Historique</span>
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default ClientDashboard;
