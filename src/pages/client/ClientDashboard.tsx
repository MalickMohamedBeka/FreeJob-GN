import { motion } from "framer-motion";
import { Plus, Briefcase, Users, Clock, CheckCircle, Eye, Loader2, Heart, ExternalLink } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { useAuth } from "@/contexts/AuthContext";
import { useMyProjects } from "@/hooks/useProjects";
import { useContracts } from "@/hooks/useContracts";
import { useFavorites, useRemoveFavorite } from "@/hooks/useProfile";
import { ROUTES } from "@/constants";

const ClientDashboard = () => {
  const { user } = useAuth();
  const { data: projectsData, isLoading: loadingProjects } = useMyProjects();
  const { data: contractsData, isLoading: loadingContracts } = useContracts();

  // Filter to only the current user's own projects (API returns public + client's own)
  const projects = (projectsData?.results ?? []).filter((p) => p.client.id === user?.id);
  const contracts = contractsData?.results ?? [];

  const publishedCount = projects.length;
  const inProgressCount = contracts.filter((c) => c.status === "IN_PROGRESS").length;
  const completedCount = contracts.filter((c) => c.status === "COMPLETED").length;

  const stats = [
    { icon: Briefcase, label: "Projets Publiés", value: String(publishedCount) },
    { icon: Users, label: "En Cours", value: String(inProgressCount) },
    { icon: CheckCircle, label: "Projets Terminés", value: String(completedCount) },
    { icon: Clock, label: "Total Contrats", value: String(contracts.length) },
  ];

  const isLoading = loadingProjects || loadingContracts;

  const { data: favoritesData } = useFavorites();
  const removeFavorite = useRemoveFavorite();
  const favorites = favoritesData?.results ?? [];

  return (
    <DashboardLayout userType="client">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Tableau de bord</h1>
            <p className="text-muted-foreground">Bienvenue, {user?.username || "Client"}</p>
          </div>
          <Link to={ROUTES.CLIENT.PROJECTS}>
            <Button className="gap-2">
              <Plus size={18} />
              Publier un Projet
            </Button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 rounded-xl bg-primary/10">
                      <Icon className="text-primary" size={24} />
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold">{isLoading ? "..." : stat.value}</p>
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
                  <Briefcase size={20} className="text-primary" />
                  Mes Projets Récents
                </h3>
                <Link to={ROUTES.CLIENT.PROJECTS}>
                  <Button variant="ghost" size="sm">Voir tout</Button>
                </Link>
              </div>

              {loadingProjects ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="animate-spin text-muted-foreground" size={24} />
                </div>
              ) : projects.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Briefcase className="mx-auto mb-3" size={40} />
                  <p className="text-sm">Aucun projet publié.</p>
                  <Link to={ROUTES.CLIENT.PROJECTS}>
                    <Button className="mt-4" size="sm">
                      <Plus size={14} className="mr-1" />
                      Créer mon premier projet
                    </Button>
                  </Link>
                </div>
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
                      <div key={project.id} className="p-4 rounded-lg border border-border">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h4 className="font-semibold mb-1">{project.title}</h4>
                            <p className="text-sm text-muted-foreground">{project.category.name}</p>
                          </div>
                          <Badge className={statusClass}>{statusLabel}</Badge>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-semibold text-primary">{project.budget_band_display}</span>
                          <Link to={ROUTES.CLIENT.PROJECTS}>
                            <Button size="sm" variant="outline" className="gap-1">
                              <Eye size={14} />
                              Détails
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
                  <Users size={20} className="text-secondary" />
                  Contrats En Cours
                </h3>
                <Link to={ROUTES.CLIENT.CONTRACTS}>
                  <Button variant="ghost" size="sm">Voir tout</Button>
                </Link>
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
                      <div key={contract.id} className="p-4 rounded-lg border border-border">
                        <h4 className="font-semibold text-sm mb-1">{contract.project.title}</h4>
                        <p className="text-sm text-muted-foreground mb-2">
                          Prestataire: {contract.provider.username}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-semibold text-primary">
                            {parseFloat(contract.total_amount).toLocaleString("fr-FR")} GNF
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {new Date(contract.start_at).toLocaleDateString("fr-FR")}
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </Card>
          </motion.div>
        </div>
        {/* Favoris */}
        {favorites.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card className="p-6">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Heart size={18} className="text-red-500 fill-red-500" />
                  Freelancers favoris
                </h3>
                <span className="text-xs text-muted-foreground bg-muted px-2.5 py-1 rounded-full">
                  {favorites.length} favori{favorites.length > 1 ? "s" : ""}
                </span>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {favorites.map((fav) => (
                  <div
                    key={fav.id}
                    className="flex items-center justify-between p-3 rounded-xl border border-border hover:border-primary/30 hover:bg-muted/30 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 text-sm font-bold text-primary">
                        {fav.provider_username[0]?.toUpperCase() ?? "?"}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate">@{fav.provider_username}</p>
                        <p className="text-[10px] text-muted-foreground">
                          Ajouté le {new Date(fav.created_at).toLocaleDateString("fr-FR")}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <Link to={`/freelancers/${fav.provider_id}`}>
                        <button
                          type="button"
                          className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-primary transition-colors"
                          title="Voir le profil"
                        >
                          <ExternalLink size={13} />
                        </button>
                      </Link>
                      <button
                        type="button"
                        onClick={() => removeFavorite.mutate(fav.provider_id)}
                        className="p-1.5 rounded-lg hover:bg-red-50 text-muted-foreground hover:text-red-500 transition-colors"
                        title="Retirer des favoris"
                      >
                        <Heart size={13} className="fill-current" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ClientDashboard;
