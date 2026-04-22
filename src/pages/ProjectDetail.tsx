import { useParams, Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Loader2,
  AlertCircle,
  Tag,
  Clock,
  Calendar,
  Briefcase,
  User,
  CheckCircle2,
  Rocket,
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useProject } from "@/hooks/useProjects";
import { useAuth } from "@/contexts/AuthContext";
import { ROUTES } from "@/constants/routes";

function daysLeft(deadline: string | null): string {
  if (!deadline) return "Non définie";
  const diff = Math.ceil(
    (new Date(deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  );
  if (diff <= 0) return "Délai expiré";
  return `${diff} jour${diff > 1 ? "s" : ""} restant${diff > 1 ? "s" : ""}`;
}

const ProjectDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const { data: project, isLoading, isError } = useProject(id ?? "");

  const handleApply = () => {
    if (!isAuthenticated) {
      navigate(ROUTES.LOGIN);
      return;
    }
    if (user?.role === "PROVIDER") {
      navigate(ROUTES.DASHBOARD.FIND_PROJECTS);
    } else if (user?.role === "AGENCY") {
      navigate(ROUTES.AGENCY.FIND_PROJECTS);
    } else {
      navigate(ROUTES.LOGIN);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1 container mx-auto px-4 lg:px-8 py-8 max-w-3xl">
        {/* Back */}
        <Link
          to={ROUTES.PROJECTS}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft size={16} />
          Retour aux projets
        </Link>

        {/* Loading */}
        {isLoading && (
          <div className="flex justify-center py-32">
            <Loader2 className="animate-spin text-primary" size={40} />
          </div>
        )}

        {/* Error */}
        {(isError || (!isLoading && !project)) && (
          <div className="text-center py-32 text-muted-foreground">
            <AlertCircle className="mx-auto mb-4" size={48} />
            <p className="text-lg font-medium">Projet introuvable</p>
            <p className="text-sm mt-1">Ce projet n'existe pas ou n'est plus disponible.</p>
            <Button variant="outline" className="mt-6" onClick={() => navigate(ROUTES.PROJECTS)}>
              Voir tous les projets
            </Button>
          </div>
        )}

        {/* Content */}
        {project && !isLoading && (
          <div className="space-y-5">
            {/* Header card */}
            <Card className="p-6">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge
                      variant={project.status === "PUBLISHED" ? "default" : "secondary"}
                      className="text-xs"
                    >
                      {project.status_display}
                    </Badge>
                    {project.category && (
                      <Badge variant="outline" className="text-xs">
                        {project.category.name}
                      </Badge>
                    )}
                  </div>
                  <h1 className="text-2xl font-bold text-foreground leading-snug">
                    {project.title}
                  </h1>
                  <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                    <User size={13} />
                    <span>
                      Client :{" "}
                      <Link
                        to={`/clients/${project.client.id}`}
                        className="text-foreground font-medium hover:text-primary transition-colors"
                      >
                        {project.client.username}
                      </Link>
                    </span>
                    <CheckCircle2 size={13} className="text-secondary" />
                  </div>
                </div>

                <Button onClick={handleApply} variant="cta" size="lg" className="flex-shrink-0">
                  <Rocket size={16} />
                  Postuler
                </Button>
              </div>

              {/* Key metrics */}
              <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="bg-muted/50 rounded-xl p-3">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                    <Tag size={11} />
                    Budget
                  </div>
                  <p className="font-bold text-foreground text-sm">
                    {project.budget_amount
                      ? `${Number(project.budget_amount).toLocaleString("fr-GN")} GNF`
                      : project.budget_band_display}
                  </p>
                </div>

                <div className="bg-muted/50 rounded-xl p-3">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                    <Clock size={11} />
                    Délai
                  </div>
                  <p className="font-bold text-foreground text-sm">{daysLeft(project.deadline)}</p>
                </div>

                <div className="bg-muted/50 rounded-xl p-3">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                    <Calendar size={11} />
                    Publié le
                  </div>
                  <p className="font-bold text-foreground text-sm">
                    {new Date(project.created_at).toLocaleDateString("fr-FR")}
                  </p>
                </div>
              </div>
            </Card>

            {/* Description */}
            <Card className="p-6">
              <h2 className="font-semibold text-base text-foreground mb-3 flex items-center gap-2">
                <Briefcase size={15} />
                Description du projet
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                {project.description}
              </p>
            </Card>

            {/* Skills & speciality */}
            {(project.skills?.length > 0 || project.speciality) && (
              <Card className="p-6">
                <h2 className="font-semibold text-base text-foreground mb-3">
                  Compétences recherchées
                </h2>
                <div className="flex flex-wrap gap-2">
                  {project.speciality && (
                    <Badge variant="secondary" className="text-sm px-3 py-1">
                      {project.speciality.name}
                    </Badge>
                  )}
                  {project.skills?.map((sk) => (
                    <Badge key={sk.id} variant="outline" className="text-sm px-3 py-1">
                      {sk.name}
                    </Badge>
                  ))}
                </div>
              </Card>
            )}

            {/* CTA bottom */}
            <div className="flex justify-center pt-2 pb-6">
              <Button onClick={handleApply} variant="cta" size="lg">
                <Rocket size={16} />
                Postuler à ce projet
              </Button>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default ProjectDetail;
