import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Target, Users, Rocket } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { mockProjects } from "@/lib/mockData";
import ProjectsHero3D from "@/components/projects/ProjectsHero3D";
import FilterBar3D from "@/components/projects/FilterBar3D";
import ProjectCard3D from "@/components/projects/ProjectCard3D";
import { LiquidGradientMesh } from "@/components/backgrounds/LiquidGradientMesh";

const skillFilters = ["Tous", "React", "Node.js", "Python", "Design", "Marketing", "Mobile", "SEO", "Data Science"];

const Projects = () => {
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("Tous");

  const filtered = mockProjects.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase());
    const matchesFilter =
      activeFilter === "Tous" || p.skills.some((s) => s.toLowerCase().includes(activeFilter.toLowerCase()));
    return matchesSearch && matchesFilter;
  });

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

          {/* Projects Count with Animation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="inline-flex items-center gap-3 glass rounded-full px-6 py-3 shadow-elevation-2 border border-white/30"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              >
                <Rocket className="text-primary" size={20} />
              </motion.div>
              <span className="font-bold">
                <span className="text-gradient-hero text-2xl">{filtered.length}</span>
                <span className="text-muted-foreground ml-2">
                  {filtered.length === 1 ? "projet trouvé" : "projets trouvés"}
                </span>
              </span>
            </motion.div>
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
                    project={project} 
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
                <motion.div
                  animate={{ 
                    y: [0, -20, 0],
                    rotate: [0, 10, -10, 0]
                  }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="inline-block mb-6"
                >
                  <div className="w-32 h-32 rounded-full bg-gradient-hero opacity-20 blur-2xl mx-auto mb-4" />
                  <Search className="mx-auto text-muted-foreground" size={64} />
                </motion.div>
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

          {/* Load More Button (if needed) */}
          {filtered.length > 0 && filtered.length >= 9 && (
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
                className="glass rounded-2xl px-10 py-4 font-bold text-lg shadow-elevation-3 border-2 border-white/30 relative overflow-hidden group"
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-hero opacity-0 group-hover:opacity-100"
                  transition={{ duration: 0.3 }}
                />
                <span className="relative z-10 group-hover:text-white transition-colors">
                  Charger Plus de Projets
                </span>
              </motion.button>
            </motion.div>
          )}
        </div>
      </main>
      
      <Footer />
      </div>
    </div>
  );
};

export default Projects;
