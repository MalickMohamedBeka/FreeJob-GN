import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Target, Users, Award } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { mockFreelancers } from "@/lib/mockData";
import FreelancersHero3D from "@/components/freelancers/FreelancersHero3D";
import SearchBar3D from "@/components/freelancers/SearchBar3D";
import FreelancerCard3D from "@/components/freelancers/FreelancerCard3D";
import { LiquidGradientMesh } from "@/components/backgrounds/LiquidGradientMesh";

const skillFilters = ["Tous", "React", "Design", "Marketing", "Mobile", "Python", "SEO", "Data Science", "Blockchain"];

const Freelancers = () => {
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("Tous");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const filtered = mockFreelancers.filter((f) => {
    const matchesSearch =
      f.name.toLowerCase().includes(search.toLowerCase()) ||
      f.title.toLowerCase().includes(search.toLowerCase());
    const matchesFilter =
      activeFilter === "Tous" || f.skills.some((s) => s.toLowerCase().includes(activeFilter.toLowerCase()));
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen relative overflow-hidden bg-white">
      <LiquidGradientMesh />
      <div className="relative z-10">
        <Navbar />
      
      <main className="relative z-10">
        {/* Hero Section */}
        <FreelancersHero3D />

        {/* Main Content */}
        <div className="container mx-auto px-4 lg:px-8 pb-24">
          {/* Search & Filters */}
          <SearchBar3D
            search={search}
            setSearch={setSearch}
            activeFilter={activeFilter}
            setActiveFilter={setActiveFilter}
            filters={skillFilters}
            viewMode={viewMode}
            setViewMode={setViewMode}
            resultsCount={filtered.length}
          />

          {/* Freelancers Grid */}
          <AnimatePresence mode="wait">
            {filtered.length > 0 ? (
              <motion.div
                key="freelancers-grid"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className={
                  viewMode === "grid"
                    ? "grid md:grid-cols-2 lg:grid-cols-3 gap-8 lg:perspective-container"
                    : "flex flex-col gap-6 max-w-4xl mx-auto"
                }
                style={{ perspective: "2500px" }}
              >
                {filtered.map((freelancer, index) => (
                  <FreelancerCard3D 
                    key={freelancer.id} 
                    freelancer={freelancer} 
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
                className="text-center py-24"
              >
                {/* Animated Empty State */}
                <motion.div
                  animate={{ 
                    y: [0, -25, 0],
                    rotate: [0, 10, -10, 0]
                  }}
                  transition={{ duration: 5, repeat: Infinity }}
                  className="inline-block mb-8"
                >
                  <div className="relative">
                    <motion.div
                      className="w-40 h-40 rounded-full bg-gradient-hero opacity-20 blur-3xl mx-auto mb-6"
                      animate={{
                        scale: [1, 1.3, 1],
                        opacity: [0.2, 0.4, 0.2],
                      }}
                      transition={{ duration: 3, repeat: Infinity }}
                    />
                    <Search className="mx-auto text-muted-foreground relative -mt-32" size={80} />
                  </div>
                </motion.div>

                <motion.h3 
                  className="text-3xl font-bold mb-4"
                  animate={{ opacity: [0.7, 1, 0.7] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  Aucun talent trouvé
                </motion.h3>
                <p className="text-muted-foreground text-xl mb-8 max-w-md mx-auto">
                  Essayez de modifier vos critères de recherche pour découvrir plus de talents
                </p>

                <motion.button
                  whileHover={{ 
                    scale: 1.08, 
                    y: -5,
                    boxShadow: "0 25px 50px rgba(0, 0, 0, 0.25)"
                  }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setSearch("");
                    setActiveFilter("Tous");
                  }}
                  className="glass rounded-2xl px-10 py-4 font-bold text-lg shadow-elevation-3 border-2 border-white/40 relative overflow-hidden group"
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-hero opacity-0 group-hover:opacity-100"
                    transition={{ duration: 0.3 }}
                  />
                  <span className="relative z-10 group-hover:text-white transition-colors flex items-center gap-2">
                    <Target size={20} />
                    Réinitialiser les filtres
                  </span>
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Load More Section */}
          {filtered.length > 0 && filtered.length >= 9 && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="text-center mt-20"
            >
              <motion.button
                whileHover={{ 
                  scale: 1.08, 
                  y: -8,
                  boxShadow: "0 30px 60px rgba(0, 0, 0, 0.3), 0 0 60px rgba(255, 122, 61, 0.3)"
                }}
                whileTap={{ scale: 0.95 }}
                className="glass rounded-3xl px-12 py-5 font-black text-xl shadow-elevation-4 border-2 border-white/40 relative overflow-hidden group"
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-hero opacity-0 group-hover:opacity-100"
                  transition={{ duration: 0.4 }}
                />
                <span className="relative z-10 group-hover:text-white transition-colors flex items-center gap-3">
                  <Users size={24} />
                  Découvrir Plus de Talents
                  <Award size={24} />
                </span>

                {/* Animated Border */}
                <motion.div
                  className="absolute inset-0 rounded-3xl"
                  animate={{
                    boxShadow: [
                      "0 0 0 0 rgba(255, 122, 61, 0.4)",
                      "0 0 0 8px rgba(255, 122, 61, 0)",
                      "0 0 0 0 rgba(255, 122, 61, 0.4)",
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </motion.button>
            </motion.div>
          )}

          {/* Bottom CTA Banner */}
          {filtered.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="mt-24"
            >
              <motion.div
                whileHover={{ scale: 1.02, y: -5 }}
                className="glass rounded-[2rem] p-12 shadow-elevation-5 border-2 border-white/40 text-center relative overflow-hidden"
              >
                {/* Animated Background */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-primary/20 via-secondary/20 to-success/20"
                  animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 180, 360],
                  }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                />

                <div className="relative z-10">
                  <motion.h2 
                    className="text-4xl font-black mb-4"
                    animate={{ 
                      textShadow: [
                        "0 0 20px rgba(255, 122, 61, 0.3)",
                        "0 0 40px rgba(255, 122, 61, 0.5)",
                        "0 0 20px rgba(255, 122, 61, 0.3)"
                      ]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    Vous êtes un <span className="text-gradient-hero">Talent</span> ?
                  </motion.h2>
                  <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                    Rejoignez notre communauté de freelancers d'exception et accédez à des projets extraordinaires
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.1, y: -5 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-gradient-hero text-white px-10 py-4 rounded-2xl font-bold text-lg shadow-elevation-4 hover:shadow-elevation-5"
                  >
                    Créer Mon Profil Gratuitement
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </div>
      </main>
      
      <Footer />
      </div>
    </div>
  );
};

export default Freelancers;
