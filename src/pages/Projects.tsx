import { useState } from "react";
import { Search, Loader2, Rocket } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProjectsHero3D from "@/components/projects/ProjectsHero3D";
import FilterBar3D from "@/components/projects/FilterBar3D";
import ProjectCard3D from "@/components/projects/ProjectCard3D";
import { useProjects } from "@/hooks/useProjects";
import { useDebounce } from "@/hooks";
import type { Project } from "@/types";
import type { ApiProjectList } from "@/types";
import { Button } from "@/components/ui/button";

const skillFilters = ["Tous", "React", "Node.js", "Python", "Design", "Marketing", "Mobile", "SEO", "Data Science"];

function mapApiProjectToUI(p: ApiProjectList, index: number): Project {
  return {
    id: p.id,
    title: p.title,
    description: p.description,
    budget: {
      min: Number(p.budget_amount),
      max: Number(p.budget_amount),
      currency: "GNF",
    },
    skills: p.skills.map((s) => s.name),
    proposalsCount: 0,
    duration: p.deadline ? `Avant le ${new Date(p.deadline).toLocaleDateString("fr-FR")}` : "Non défini",
    postedAt: new Date(p.created_at).toLocaleDateString("fr-FR"),
    client: {
      name: p.client.username,
      avatar: "",
      verified: true,
    },
    status: p.status === "PUBLISHED" ? "open" : p.status === "IN_PROGRESS" ? "in_progress" : "completed",
  };
}

const Projects = () => {
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("Tous");
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebounce(search, 300);

  const { data, isLoading } = useProjects({
    search: debouncedSearch || undefined,
    page,
  });

  const results = data?.results ?? [];

  const filtered =
    activeFilter === "Tous"
      ? results
      : results.filter((p) => p.skills.some((s) => s.name.toLowerCase().includes(activeFilter.toLowerCase())));

  return (
    <div className="min-h-screen bg-muted/30">
      <Navbar />
      <main className="pt-16">
        <ProjectsHero3D />

        <div className="container mx-auto px-4 lg:px-8 py-10 pb-20">
          <FilterBar3D
            search={search}
            setSearch={setSearch}
            activeFilter={activeFilter}
            setActiveFilter={setActiveFilter}
            filters={skillFilters}
          />

          {isLoading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="animate-spin text-primary" size={36} />
            </div>
          ) : filtered.length > 0 ? (
            <>
              <div className="flex items-center gap-2 mb-6 text-sm text-muted-foreground">
                <Rocket size={14} className="text-primary" />
                <span>
                  <strong className="text-foreground">{filtered.length}</strong>{" "}
                  {filtered.length === 1 ? "projet trouvé" : "projets trouvés"}
                </span>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map((project, index) => (
                  <ProjectCard3D
                    key={project.id}
                    project={mapApiProjectToUI(project, index)}
                    index={index}
                  />
                ))}
              </div>

              {data?.next && (
                <div className="text-center mt-12">
                  <Button
                    variant="outline"
                    onClick={() => setPage((p) => p + 1)}
                  >
                    Charger Plus de Projets
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-20">
              <Search className="mx-auto text-muted-foreground mb-4" size={48} />
              <h3 className="text-xl font-bold mb-2">Aucun projet trouvé</h3>
              <p className="text-muted-foreground mb-6">
                Essayez de modifier vos critères de recherche
              </p>
              <Button
                variant="outline"
                onClick={() => { setSearch(""); setActiveFilter("Tous"); }}
              >
                Réinitialiser les filtres
              </Button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Projects;
