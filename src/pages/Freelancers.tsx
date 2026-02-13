import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Target, Users, Award, Loader2 } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import FreelancersHero3D from "@/components/freelancers/FreelancersHero3D";
import SearchBar3D from "@/components/freelancers/SearchBar3D";
import FreelancerCard3D from "@/components/freelancers/FreelancerCard3D";
import { LiquidGradientMesh } from "@/components/backgrounds/LiquidGradientMesh";
import { useFreelancers } from "@/hooks/useFreelancers";
import type { Freelancer } from "@/types";
import type { ApiFreelancerProfile } from "@/types";

const skillFilters = ["Tous", "React", "Design", "Marketing", "Mobile", "Python", "SEO", "Data Science", "Blockchain"];

function mapApiFreelancerToUI(f: ApiFreelancerProfile): Freelancer {
  const fullName = f.freelance_details
    ? `${f.freelance_details.first_name} ${f.freelance_details.last_name}`
    : f.username;
  return {
    id: String(f.id),
    name: fullName,
    title: f.speciality?.name || "Freelancer",
    avatar: f.profile_picture || "/avatars/profile-main.jpg",
    rating: 5,
    reviewsCount: 0,
    hourlyRate: f.hourly_rate ? Number(f.hourly_rate) : 0,
    currency: "GNF",
    skills: f.skills.map((s) => s.name),
    completedProjects: 0,
    location: [f.city_or_region, f.country].filter(Boolean).join(", "),
    available: true,
    bio: f.bio || "",
  };
}

const Freelancers = () => {
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("Tous");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [page, setPage] = useState(1);

  const { data, isLoading } = useFreelancers({ page });

  const results = data?.results ?? [];

  // Client-side filtering on search + skill filter
  const filtered = results.filter((f) => {
    const uiFreelancer = mapApiFreelancerToUI(f);
    const matchesSearch = !search ||
      uiFreelancer.name.toLowerCase().includes(search.toLowerCase()) ||
      uiFreelancer.title.toLowerCase().includes(search.toLowerCase());
    const matchesFilter =
      activeFilter === "Tous" || f.skills.some((s) => s.name.toLowerCase().includes(activeFilter.toLowerCase()));
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

          {/* Loading State */}
          {isLoading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="animate-spin text-primary" size={48} />
            </div>
          ) : (
            <>
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
                        freelancer={mapApiFreelancerToUI(freelancer)}
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
                    <div className="inline-block mb-8">
                      <Search className="mx-auto text-muted-foreground" size={80} />
                    </div>

                    <h3 className="text-3xl font-bold mb-4">
                      Aucun talent trouvé
                    </h3>
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
                      className="glass rounded-2xl px-10 py-4 font-bold text-lg shadow-elevation-3 border-2 border-white/40 relative overflow-hidden group hover:bg-primary hover:text-white transition-colors"
                    >
                      <span className="flex items-center gap-2">
                        <Target size={20} />
                        Réinitialiser les filtres
                      </span>
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Load More Section */}
              {data && data.next && (
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
                    onClick={() => setPage((p) => p + 1)}
                    className="glass rounded-3xl px-12 py-5 font-black text-xl shadow-elevation-4 border-2 border-white/40 relative overflow-hidden group hover:bg-primary hover:text-white transition-colors"
                  >
                    <span className="flex items-center gap-3">
                      <Users size={24} />
                      Découvrir Plus de Talents
                      <Award size={24} />
                    </span>
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
                    <div className="relative z-10">
                      <h2 className="text-4xl font-black mb-4">
                        Vous êtes un <span className="text-primary">Talent</span> ?
                      </h2>
                      <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                        Rejoignez notre communauté de freelancers d'exception et accédez à des projets extraordinaires
                      </p>
                      <motion.button
                        whileHover={{ scale: 1.1, y: -5 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-primary text-white px-10 py-4 rounded-2xl font-bold text-lg shadow-elevation-4 hover:shadow-elevation-5"
                      >
                        Créer Mon Profil Gratuitement
                      </motion.button>
                    </div>
                  </motion.div>
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

export default Freelancers;
