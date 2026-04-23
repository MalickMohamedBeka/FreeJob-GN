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

// ── Helpers ───────────────────────────────────────────────────────────────────

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
  const excerpt = project.description?.length > 110
    ? project.description.slice(0, 110).trimEnd() + "…"
    : project.description;

  return (
    <Link
      to={`/dashboard/find-projects/${project.id}`}
      className="group block h-full"
    >
      <Card className="h-full flex flex-col p-5 border-border/70 hover:border-primary/35 hover:shadow-md transition-all duration-200 cursor-pointer">

        {/* ── Header ── */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex flex-wrap gap-1.5">
            <Badge className="bg-secondary/12 text-secondary border-0 font-semibold text-[10px] py-0.5">
              Publié
            </Badge>
            {project.category && (
              <Badge variant="outline" className="text-[10px] font-medium bg-transparent">
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
        <h3 className="font-semibold text-[0.92rem] leading-snug text-foreground line-clamp-2 mb-2 group-hover:text-primary transition-colors">
          {project.title}
        </h3>

        {/* ── Description ── */}
        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2 mb-3 flex-1">
          {excerpt}
        </p>

        {/* ── Skills ── */}
        {topSkills.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
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

        {/* ── Footer ── */}
        <div className="flex items-center justify-between pt-3 border-t border-border/50 mt-auto">
          <div className="flex items-center gap-1.5">
            <Tag size={11} className="text-primary flex-shrink-0" />
            <span className="text-sm font-bold text-primary">{budget}</span>
          </div>
          <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
            <span className="flex items-center gap-1">
              <Users size={11} />
              <span className="font-medium">{project.proposals_count}</span>
            </span>
            <span className="flex items-center gap-1">
              <Eye size={11} />
              <span className="font-medium">{project.views_count}</span>
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
    <Card className="p-5 border-border/70 animate-pulse flex flex-col gap-3">
      <div className="flex justify-between items-start">
        <div className="flex gap-1.5">
          <div className="h-4 w-14 bg-muted rounded-full" />
          <div className="h-4 w-20 bg-muted rounded-full" />
        </div>
        <div className="h-3 w-16 bg-muted rounded" />
      </div>
      <div className="space-y-1.5">
        <div className="h-4 w-3/4 bg-muted rounded" />
        <div className="h-4 w-1/2 bg-muted rounded" />
      </div>
      <div className="space-y-1">
        <div className="h-3 w-full bg-muted rounded" />
        <div className="h-3 w-5/6 bg-muted rounded" />
      </div>
      <div className="flex gap-1.5">
        <div className="h-4 w-14 bg-muted rounded-full" />
        <div className="h-4 w-16 bg-muted rounded-full" />
        <div className="h-4 w-12 bg-muted rounded-full" />
      </div>
      <div className="flex justify-between items-center pt-3 border-t border-border/50">
        <div className="h-4 w-28 bg-muted rounded" />
        <div className="flex gap-3">
          <div className="h-3 w-8 bg-muted rounded" />
          <div className="h-3 w-8 bg-muted rounded" />
        </div>
      </div>
    </Card>
  );
}

// ── Section principale ────────────────────────────────────────────────────────

const RecentProjects = () => {
  const { data, isLoading } = useRecentProjects();
  const projects = data?.results ?? [];

  return (
    <section className="py-20 lg:py-28 bg-muted/25 border-y border-border/40">
      <div className="container mx-auto px-4 lg:px-8">

        {/* ── Section header ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10"
        >
          <div>
            <span className="inline-block text-xs font-bold text-primary tracking-widest uppercase px-3 py-1 rounded-full bg-primary/10 mb-4">
              Opportunités
            </span>
            <h2 className="text-3xl md:text-4xl font-bold leading-tight mb-2">
              Projets récemment{" "}
              <span className="text-secondary">publiés</span>
            </h2>
            <p className="text-muted-foreground">
              Les dernières opportunités postées par des clients sur la plateforme.
            </p>
          </div>
          <Button variant="outline" size="sm" className="gap-2 flex-shrink-0 self-start sm:self-auto" asChild>
            <Link to="/projects">
              Voir tous les projets
              <ArrowRight size={14} />
            </Link>
          </Button>
        </motion.div>

        {/* ── Grille ── */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {[...Array(8)].map((_, i) => <ProjectCardSkeleton key={i} />)}
          </div>
        ) : projects.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-24 gap-4 text-center"
          >
            <span className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center">
              <FolderOpen size={28} className="text-muted-foreground" />
            </span>
            <p className="font-semibold text-foreground">Aucun projet publié pour le moment</p>
            <p className="text-sm text-muted-foreground max-w-xs">
              Les projets apparaîtront ici dès qu'un client en publiera un.
            </p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {projects.map((project, i) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ duration: 0.38, ease: "easeOut", delay: Math.min(i * 0.05, 0.3) }}
              >
                <ProjectCard project={project} />
              </motion.div>
            ))}
          </div>
        )}

        {/* ── CTA bottom ── */}
        {!isLoading && projects.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="text-center mt-10"
          >
            <Button asChild size="lg" className="gap-2">
              <Link to="/projects">
                <Briefcase size={17} />
                Explorer tous les projets
              </Link>
            </Button>
          </motion.div>
        )}

      </div>
    </section>
  );
};

export default RecentProjects;
