import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Rocket, Loader2 } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProjectsHero3D from "@/components/projects/ProjectsHero3D";
import FilterBar3D from "@/components/projects/FilterBar3D";
import ProjectCard3D from "@/components/projects/ProjectCard3D";
import { LiquidGradientMesh } from "@/components/backgrounds/LiquidGradientMesh";
import { useProjects } from "@/hooks/useProjects";
import { useDebounce } from "@/hooks";
import type { Project } from "@/types";
import type { ApiProjectList } from "@/types";

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
    duration: p.deadline ? `Avant le ${new Date(p.deadline).toLocaleDateString('fr-FR')}` : "Non défini",
    postedAt: new Date(p.created_at).toLocaleDateString('fr-FR'),
    client: {
      name: p.client.username,
      avatar: "/avatars/profile-main.jpg",
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

  // Client-side skill filter on top of API results
  const filtered = activeFilter === "Tous"
    ? results
    : results.filter((p) => p.skills.some((s) => s.name.toLowerCase().includes(activeFilter.toLowerCase())));

  return (
    <div className="min-h-screen relative overflow-hidden bg-white">
      <LiquidGradientMesh />
      <div className="relative z-10">
        <Navbar />

      <main className="relative z-10">
        {/* Hero Section with 3D */}
        <ProjectsHero3D />

        {/* Main Content */}
        <div className="container mx-auto px-4 lg:px-8 pb-20">
          {/* Filter Bar */}
          <FilterBar3D
            search={search}
            setSearch={setSearch}
            activeFilter={activeFilter}
            setActiveFilter={setActiveFilter}
            filters={skillFilters}
          />

          {/* Loading State */}
          {isLoading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="animate-spin text-primary" size={48} />
            </div>
          ) : (
            <>
              {/* Projects Count */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-12"
              >
                <div className="inline-flex items-center gap-3 glass rounded-full px-6 py-3 shadow-elevation-2 border border-white/30">
                  <Rocket className="text-primary" size={20} />
                  <span className="font-bold">
                    <span className="text-primary text-2xl">{filtered.length}</span>
                    <span className="text-muted-foreground ml-2">
                      {filtered.length === 1 ? "projet trouvé" : "projets trouvés"}
                    </span>
                  </span>
                </div>
              </motion.div>

              {/* Projects Grid with 3D Cards */}
              <AnimatePresence mode="wait">
                {filtered.length > 0 ? (
                  <motion.div
                    key="projects-grid"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 lg:perspective-container"
                    style={{ perspective: "2000px" }}
                  >
                    {filtered.map((project, index) => (
                      <ProjectCard3D
                        key={project.id}
                        project={mapApiProjectToUI(project, index)}
                        index={index}
                      />
                    ))}
                  </motion.div>
                ) : (
                  <motion.div
                    key="no-results"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="text-center py-20"
                  >
                    <div className="inline-block mb-6">
                      <Search className="mx-auto text-muted-foreground" size={64} />
                    </div>
                    <h3 className="text-2xl font-bold mb-3">Aucun projet trouvé</h3>
                    <p className="text-muted-foreground text-lg mb-6">
                      Essayez de modifier vos critères de recherche
                    </p>
                    <motion.button
                      whileHover={{ scale: 1.05, y: -3 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        setSearch("");
                        setActiveFilter("Tous");
                      }}
                      className="glass rounded-full px-8 py-3 font-semibold shadow-elevation-2 hover:shadow-elevation-3 border border-white/30"
                    >
                      Réinitialiser les filtres
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Pagination */}
              {data && data.next && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="text-center mt-16"
                >
                  <motion.button
                    whileHover={{
                      scale: 1.05,
                      y: -5,
                      boxShadow: "0 20px 40px rgba(0, 0, 0, 0.2)"
                    }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setPage((p) => p + 1)}
                    className="glass rounded-2xl px-10 py-4 font-bold text-lg shadow-elevation-3 border-2 border-white/30 relative overflow-hidden group hover:bg-primary hover:text-white transition-colors"
                  >
                    <span className="transition-colors">
                      Charger Plus de Projets
                    </span>
                  </motion.button>
                </motion.div>
              )}
            </>
          )}
        </div>
      </main>

      <Footer />
      </div>
    </div>
  );
};

export default Projects;
