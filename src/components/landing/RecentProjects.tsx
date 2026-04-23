import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Clock, Tag, Users, Eye, ArrowRight, Briefcase, FolderOpen,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useRecentProjects } from "@/hooks/useProjects";
import type { ApiProjectList } from "@/types";

// ── Helper ────────────────────────────────────────────────────────────────────

function timeAgo(dateStr: string): string {
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (diff < 60) return "à l'instant";
  if (diff < 3600) return `il y a ${Math.floor(diff / 60)} min`;
  if (diff < 86400) return `il y a ${Math.floor(diff / 3600)} h`;
  if (diff < 604800) return `il y a ${Math.floor(diff / 86400)} j`;
  return new Date(dateStr).toLocaleDateString("fr-FR");
}

// ── Carte projet ──────────────────────────────────────────────────────────────

function ProjectCard({ project }: { project: ApiProjectList }) {
  const budget = project.budget_amount && Number(project.budget_amount) > 0
    ? `${Number(project.budget_amount).toLocaleString("fr-GN")} GNF`
    : project.budget_band_display;

  const topSkills = project.skills?.slice(0, 3) ?? [];
  const extraSkills = (project.skills?.length ?? 0) - topSkills.length;

  return (
    <Link to={`/dashboard/find-projects/${project.id}`} className="group block">
      <Card className="p-4 border-border/60 hover:border-primary/30 hover:shadow-md transition-all duration-200">

        {/* ── Badges + heure ── */}
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <div className="flex flex-wrap gap-1.5">
            <Badge className="bg-secondary/10 text-secondary border-secondary/20 font-semibold text-[10px] py-0.5">
              Ouvert
            </Badge>
            {project.category && (
              <Badge variant="outline" className="text-[10px] font-medium">
                {project.category.name}
              </Badge>
            )}
          </div>
          <span className="flex items-center gap-1 text-[10px] text-muted-foreground flex-shrink-0">
            <Clock size={9} />
            {timeAgo(project.created_at)}
          </span>
        </div>

        {/* ── Titre ── */}
        <h3 className="font-semibold text-[0.9rem] leading-snug text-foreground line-clamp-2 mb-2 group-hover:text-primary transition-colors">
          {project.title}
        </h3>

        {/* ── Description — 3 lignes pour couvrir l'espace ── */}
        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3 mb-3">
          {project.description}
        </p>

        {/* ── Skills ── */}
        {topSkills.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {topSkills.map((s) => (
              <span
                key={s.id}
                className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground border border-border"
              >
                {s.name}
              </span>
            ))}
            {extraSkills > 0 && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground border border-border">
                +{extraSkills}
              </span>
            )}
          </div>
        )}

        {/* ── Footer : budget + stats ── */}
        <div className="flex items-center justify-between pt-2.5 border-t border-border/50">
          <div className="flex items-center gap-1.5">
            <Tag size={10} className="text-primary flex-shrink-0" />
            <span className="text-sm font-bold text-primary leading-none">{budget}</span>
          </div>
          <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
            <span className="flex items-center gap-1">
              <Users size={10} />
              <span className="font-semibold">{project.proposals_count}</span>
              <span className="hidden sm:inline">offre{project.proposals_count > 1 ? "s" : ""}</span>
            </span>
            <span className="flex items-center gap-1">
              <Eye size={10} />
              <span className="font-semibold">{project.views_count}</span>
              <span className="hidden sm:inline">vue{project.views_count > 1 ? "s" : ""}</span>
            </span>
          </div>
        </div>
      </Card>
    </Link>
  );
}

// ── Skeleton ──────────────────────────────────────────────────────────────────

function ProjectCardSkeleton() {
  return (
    <Card className="p-4 border-border/60 animate-pulse">
      <div className="flex justify-between items-center mb-2.5">
        <div className="flex gap-1.5">
          <div className="h-4 w-12 bg-muted rounded-full" />
          <div className="h-4 w-18 bg-muted rounded-full" />
        </div>
        <div className="h-3 w-14 bg-muted rounded" />
      </div>
      <div className="space-y-1.5 mb-2">
        <div className="h-4 w-3/4 bg-muted rounded" />
        <div className="h-4 w-1/2 bg-muted rounded" />
      </div>
      <div className="space-y-1 mb-3">
        <div className="h-3 w-full bg-muted rounded" />
        <div className="h-3 w-5/6 bg-muted rounded" />
        <div className="h-3 w-4/6 bg-muted rounded" />
      </div>
      <div className="flex gap-1 mb-3">
        <div className="h-4 w-12 bg-muted rounded-full" />
        <div className="h-4 w-14 bg-muted rounded-full" />
      </div>
      <div className="flex justify-between items-center pt-2.5 border-t border-border/50">
        <div className="h-4 w-24 bg-muted rounded" />
        <div className="flex gap-3">
          <div className="h-3 w-10 bg-muted rounded" />
          <div className="h-3 w-10 bg-muted rounded" />
        </div>
      </div>
    </Card>
  );
}

// ── Section ───────────────────────────────────────────────────────────────────

const RecentProjects = () => {
  const { data, isLoading } = useRecentProjects();
  const projects = data?.results ?? [];

  return (
    <section className="py-14 lg:py-20 bg-muted/30 border-y border-border/40">
      <div className="container mx-auto px-4 lg:px-8">

        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-8"
        >
          <div>
            <span className="inline-block text-xs font-bold text-primary tracking-widest uppercase px-3 py-1 rounded-full bg-primary/10 mb-3">
              Opportunités
            </span>
            <h2 className="text-2xl md:text-3xl font-bold leading-tight mb-1">
              Projets récemment{" "}
              <span className="text-secondary">publiés</span>
            </h2>
            <p className="text-sm text-muted-foreground">
              Les dernières opportunités postées par des clients sur la plateforme.
            </p>
          </div>
          <Button variant="outline" size="sm" className="gap-1.5 flex-shrink-0 self-start sm:self-auto" asChild>
            <Link to="/projects">
              Voir tous
              <ArrowRight size={13} />
            </Link>
          </Button>
        </motion.div>

        {/* ── Grille ── */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[...Array(8)].map((_, i) => <ProjectCardSkeleton key={i} />)}
          </div>
        ) : projects.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
            <span className="w-14 h-14 rounded-xl bg-muted flex items-center justify-center">
              <FolderOpen size={24} className="text-muted-foreground" />
            </span>
            <div>
              <p className="font-semibold text-foreground text-sm">Aucun projet publié pour le moment</p>
              <p className="text-xs text-muted-foreground mt-1">Les projets apparaîtront ici dès qu'un client en publiera un.</p>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link to="/login">Rejoindre la plateforme</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {projects.map((project, i) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-20px" }}
                transition={{ duration: 0.35, ease: "easeOut", delay: Math.min(i * 0.04, 0.25) }}
              >
                <ProjectCard project={project} />
              </motion.div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
};

export default RecentProjects;
