import { useState } from "react";
import { motion } from "framer-motion";
import { Search, SlidersHorizontal, Clock, DollarSign, Users } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { mockProjects } from "@/lib/mockData";
import { Link } from "react-router-dom";

const skillFilters = ["Tous", "React", "Node.js", "Python", "Design", "Marketing", "Mobile"];

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
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-10"
          >
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              Projets <span className="text-gradient-hero">Disponibles</span>
            </h1>
            <p className="text-muted-foreground text-lg">
              Trouvez le projet qui correspond à vos compétences.
            </p>
          </motion.div>

          {/* Search & Filters */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8 space-y-4"
          >
            <div className="relative max-w-xl">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
              <input
                type="text"
                placeholder="Rechercher un projet..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full h-12 pl-12 pr-4 rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
              />
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

          {/* Projects Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -6 }}
                className="bg-card rounded-xl border border-border/50 p-6 shadow-elevation-1 hover:shadow-elevation-3 hover:border-primary/30 transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-3">
                  <Badge variant="secondary" className="bg-primary/10 text-primary border-0 text-xs">
                    {project.status === "open" ? "Ouvert" : "En cours"}
                  </Badge>
                  <span className="text-xs text-muted-foreground">{project.postedAt}</span>
                </div>

                <h3 className="text-lg font-semibold mb-2 line-clamp-1">{project.title}</h3>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{project.description}</p>

                <div className="flex flex-wrap gap-1.5 mb-4">
                  {project.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-2.5 py-1 rounded-full bg-secondary/10 text-secondary text-xs font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                  <span className="flex items-center gap-1">
                    <DollarSign size={14} />
                    {project.budget.min.toLocaleString()} - {project.budget.max.toLocaleString()} GNF
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock size={14} />
                    {project.duration}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-gradient-hero flex items-center justify-center text-[10px] font-bold text-primary-foreground">
                      {project.client.name.split(" ").map((n) => n[0]).join("")}
                    </div>
                    <span className="text-sm font-medium">{project.client.name}</span>
                  </div>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Users size={12} />
                    {project.proposalsCount} propositions
                  </span>
                </div>
              </motion.div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-20">
              <SlidersHorizontal className="mx-auto mb-4 text-muted-foreground" size={48} />
              <h3 className="text-xl font-semibold mb-2">Aucun projet trouvé</h3>
              <p className="text-muted-foreground">Essayez de modifier vos filtres.</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Projects;
