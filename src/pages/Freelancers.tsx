import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Star, MapPin, CheckCircle, LayoutGrid, List } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { mockFreelancers } from "@/lib/mockData";

const skillFilters = ["Tous", "React", "Design", "Marketing", "Mobile", "Python", "SEO"];

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
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-10"
          >
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              Nos <span className="text-gradient-hero">Freelancers</span>
            </h1>
            <p className="text-muted-foreground text-lg">
              Des experts talentueux prêts à réaliser vos projets.
            </p>
          </motion.div>

          {/* Search & Filters */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8 space-y-4"
          >
            <div className="flex gap-4 items-center">
              <div className="relative flex-1 max-w-xl">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                <input
                  type="text"
                  placeholder="Rechercher un freelancer..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full h-12 pl-12 pr-4 rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                />
              </div>
              <div className="hidden md:flex gap-1 border border-border rounded-lg p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-md transition-colors ${viewMode === "grid" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}
                  aria-label="Vue grille"
                >
                  <LayoutGrid size={18} />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-md transition-colors ${viewMode === "list" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}
                  aria-label="Vue liste"
                >
                  <List size={18} />
                </button>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {skillFilters.map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    activeFilter === filter
                      ? "bg-primary text-primary-foreground shadow-elevation-1"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Freelancers Grid */}
          <div className={viewMode === "grid" ? "grid md:grid-cols-2 lg:grid-cols-3 gap-6" : "flex flex-col gap-4"}>
            {filtered.map((freelancer, index) => (
              <motion.div
                key={freelancer.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -6 }}
                className={`bg-card rounded-xl border border-border/50 p-6 shadow-elevation-1 hover:shadow-elevation-3 hover:border-primary/30 transition-all duration-300 ${
                  viewMode === "list" ? "flex items-center gap-6" : ""
                }`}
              >
                <div className={`${viewMode === "list" ? "flex items-center gap-4 flex-1" : "text-center mb-4"}`}>
                  <div className={`bg-gradient-hero rounded-full flex items-center justify-center font-bold text-primary-foreground mx-auto ${
                    viewMode === "list" ? "w-14 h-14 text-lg mx-0 shrink-0" : "w-20 h-20 text-xl mb-3"
                  }`}>
                    {freelancer.name.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div className={viewMode === "list" ? "" : "text-center"}>
                    <div className="flex items-center gap-2 justify-center">
                      <h3 className="text-lg font-semibold">{freelancer.name}</h3>
                      {freelancer.available && (
                        <CheckCircle size={16} className="text-success" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{freelancer.title}</p>
                  </div>
                </div>

                <div className={viewMode === "list" ? "flex items-center gap-6 shrink-0" : ""}>
                  <div className={`flex items-center gap-1 ${viewMode === "list" ? "" : "justify-center mb-3"}`}>
                    <Star size={16} className="fill-warning text-warning" />
                    <span className="font-semibold text-sm">{freelancer.rating}</span>
                    <span className="text-xs text-muted-foreground">({freelancer.reviewsCount})</span>
                  </div>

                  {viewMode !== "list" && (
                    <>
                      <div className="flex flex-wrap gap-1.5 justify-center mb-4">
                        {freelancer.skills.slice(0, 3).map((skill) => (
                          <span
                            key={skill}
                            className="px-2.5 py-1 rounded-full bg-secondary/10 text-secondary text-xs font-medium"
                          >
                            {skill}
                          </span>
                        ))}
                        {freelancer.skills.length > 3 && (
                          <span className="px-2.5 py-1 rounded-full bg-muted text-muted-foreground text-xs">
                            +{freelancer.skills.length - 3}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                        <span className="flex items-center gap-1">
                          <MapPin size={14} />
                          {freelancer.location}
                        </span>
                        <span className="font-semibold text-foreground">
                          ${freelancer.hourlyRate}/h
                        </span>
                      </div>
                    </>
                  )}

                  <Button variant="outline" size="sm" className="w-full">
                    Voir le Profil
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-20">
              <Search className="mx-auto mb-4 text-muted-foreground" size={48} />
              <h3 className="text-xl font-semibold mb-2">Aucun freelancer trouvé</h3>
              <p className="text-muted-foreground">Essayez de modifier vos critères.</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Freelancers;
