import { motion } from "framer-motion";
import { useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Bookmark, MapPin, Clock, Coins, Briefcase, Loader2 } from "lucide-react";
import { useProjects } from "@/hooks/useProjects";
import { useDebounce } from "@/hooks";

const categories = ["Tous", "Développement Web", "Mobile", "Design", "Marketing", "Rédaction"];

const FindProjects = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tous");
  const [savedProjects, setSavedProjects] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebounce(searchQuery, 300);

  const { data, isLoading } = useProjects({
    search: debouncedSearch || undefined,
    category: selectedCategory !== "Tous" ? selectedCategory : undefined,
    page,
  });

  const projects = data?.results ?? [];

  const toggleSave = (projectId: string) => {
    setSavedProjects(prev =>
      prev.includes(projectId)
        ? prev.filter(id => id !== projectId)
        : [...prev, projectId]
    );
  };

  return (
    <DashboardLayout userType="freelancer">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold mb-2">Trouver des Projets</h1>
          <p className="text-muted-foreground">Découvrez les opportunités qui correspondent à vos compétences</p>
        </div>

        {/* Search & Filters */}
        <Card className="p-6">
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
              <Input
                placeholder="Rechercher par titre, compétence, entreprise..."
                className="pl-10 h-12"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <Filter size={18} className="text-muted-foreground" />
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </Card>

        {/* Results Count */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">{data?.count ?? 0}</span> projets disponibles
          </p>
          <Button variant="outline" size="sm">
            <Filter size={16} className="mr-2" />
            Plus de filtres
          </Button>
        </div>

        {/* Loading */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="animate-spin text-primary" size={40} />
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <Search className="mx-auto mb-4" size={48} />
            <p className="text-lg font-medium">Aucun projet trouvé</p>
          </div>
        ) : (
          <>
            {/* Projects List */}
            <div className="space-y-4">
              {projects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-xl font-semibold">{project.title}</h3>
                        </div>
                        <p className="text-muted-foreground font-medium">{project.client.username}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => toggleSave(project.id)}
                      >
                        <Bookmark
                          size={20}
                          fill={savedProjects.includes(project.id) ? "currentColor" : "none"}
                          className={savedProjects.includes(project.id) ? "text-primary" : ""}
                        />
                      </Button>
                    </div>

                    <p className="text-muted-foreground mb-4">{project.description}</p>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.skills.map((skill) => (
                        <Badge key={skill.id} variant="secondary">
                          {skill.name}
                        </Badge>
                      ))}
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Coins size={16} />
                        <span className="font-medium text-foreground">{Number(project.budget_amount).toLocaleString()} GNF</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock size={16} />
                        <span>{project.deadline ? new Date(project.deadline).toLocaleDateString('fr-FR') : 'Non défini'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin size={16} />
                        <span>Remote</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Briefcase size={16} />
                        <span>{project.status_display}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-border">
                      <span className="text-sm text-muted-foreground">{new Date(project.created_at).toLocaleDateString('fr-FR')}</span>
                      <Button>Soumettre une proposition</Button>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Pagination */}
            {data?.next && (
              <div className="text-center mt-6">
                <Button variant="outline" onClick={() => setPage((p) => p + 1)}>
                  Charger plus de projets
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default FindProjects;
