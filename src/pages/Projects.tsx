import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Search, Loader2, Rocket, X, ChevronDown,
  LayoutGrid, List,
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProjectsHero3D from "@/components/projects/ProjectsHero3D";
import ProjectCard3D from "@/components/projects/ProjectCard3D";
import { useProjects } from "@/hooks/useProjects";
import { useAllSkills, useAllSpecialities } from "@/hooks/useTaxonomy";
import { useDebounce } from "@/hooks";
import { useAuth } from "@/contexts/AuthContext";
import { ROUTES } from "@/constants/routes";
import type { Project } from "@/types";
import type { ApiProjectList } from "@/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PagePagination } from "@/components/ui/page-pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Checkbox } from "@/components/ui/checkbox";

function mapApiProjectToUI(p: ApiProjectList): Project {
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
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedSkills, setSelectedSkills] = useState<number[]>([]);
  const [selectedSpeciality, setSelectedSpeciality] = useState<number | null>(null);
  const [skillsOpen, setSkillsOpen] = useState(false);
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebounce(search, 300);
  const navigate = useNavigate();
  const { user } = useAuth();

  const { data: specialitiesData } = useAllSpecialities();
  const { data: skillsData } = useAllSkills();

  const allSpecialities = specialitiesData?.results ?? [];
  const selectedSpecialityObj = allSpecialities.find((s) => s.id === selectedSpeciality);
  const visibleSkills =
    selectedSpeciality && selectedSpecialityObj?.skills?.length
      ? selectedSpecialityObj.skills
      : (skillsData?.results ?? []);

  const { data, isLoading } = useProjects({
    search: debouncedSearch || undefined,
    skill_ids: selectedSkills.length > 0 ? selectedSkills : undefined,
    speciality_id: selectedSpeciality ?? undefined,
    page,
  });

  const results = data?.results ?? [];
  const PAGE_SIZE = results.length > 0 && data?.next ? results.length : 10;
  const totalPages = data ? Math.ceil(data.count / PAGE_SIZE) : 0;

  const hasActiveFilters = selectedSkills.length > 0 || selectedSpeciality !== null;

  const handleApply = (projectId: string) => {
    navigate(`/dashboard/find-projects/${projectId}`);
  };

  const toggleSkill = (id: number) => {
    setSelectedSkills((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
    setPage(1);
  };

  const handleSpecialityChange = (value: string) => {
    const next = value === "__all__" ? null : Number(value);
    setSelectedSpeciality(next);
    if (next !== null) {
      const newSp = allSpecialities.find((s) => s.id === next);
      const allowed = new Set((newSp?.skills ?? []).map((s) => s.id));
      setSelectedSkills((prev) => prev.filter((sid) => allowed.has(sid)));
    }
    setPage(1);
  };

  const resetFilters = () => {
    setSelectedSkills([]);
    setSelectedSpeciality(null);
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <Navbar />
      <main className="pt-16">
        <ProjectsHero3D />

        <div className="container mx-auto px-4 lg:px-8 py-10 pb-24">

          {/* ── Search bar + view toggle ── */}
          <div className="mb-6">
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-xl border border-border p-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className="flex-1 relative">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Rechercher par titre, compétence..."
                      value={search}
                      onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                      className="w-full h-11 pl-10 pr-10 rounded-lg border border-border bg-white text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                    />
                    {search && (
                      <button
                        onClick={() => { setSearch(""); setPage(1); }}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <X size={14} />
                      </button>
                    )}
                  </div>
                  <div className="flex gap-1 bg-muted rounded-lg p-1">
                    <button
                      onClick={() => setViewMode("grid")}
                      className={`p-2 rounded-md transition-colors ${
                        viewMode === "grid"
                          ? "bg-white text-foreground shadow-sm"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <LayoutGrid size={16} />
                    </button>
                    <button
                      onClick={() => setViewMode("list")}
                      className={`p-2 rounded-md transition-colors ${
                        viewMode === "list"
                          ? "bg-white text-foreground shadow-sm"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <List size={16} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Results count */}
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Rocket size={14} className="text-primary" />
                <span>
                  <strong className="text-foreground">{data?.count ?? 0}</strong>{" "}
                  {(data?.count ?? 0) === 1 ? "projet trouvé" : "projets trouvés"}
                </span>
              </div>
            </div>
          </div>

          {/* ── Taxonomy filters ── */}
          <div className="max-w-4xl mx-auto mb-8">
            <div className="bg-white rounded-xl border border-border p-4">
              <div className="flex flex-wrap gap-3 items-end">

                {/* Spécialité */}
                <Select
                  value={selectedSpeciality !== null ? String(selectedSpeciality) : "__all__"}
                  onValueChange={handleSpecialityChange}
                >
                  <SelectTrigger className="h-10 w-[200px]">
                    <SelectValue placeholder="Toutes les spécialités" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__all__">Toutes les spécialités</SelectItem>
                    {allSpecialities.map((sp) => (
                      <SelectItem key={sp.id} value={String(sp.id)}>
                        {sp.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Compétences multi-select */}
                <Popover open={skillsOpen} onOpenChange={setSkillsOpen}>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="h-10 w-[220px] justify-between font-normal">
                      <span className="truncate text-sm">
                        {selectedSkills.length === 0
                          ? "Toutes les compétences"
                          : `${selectedSkills.length} compétence${selectedSkills.length > 1 ? "s" : ""}`}
                      </span>
                      <ChevronDown size={14} className="ml-2 flex-shrink-0 text-muted-foreground" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[240px] p-0" align="start">
                    <Command>
                      <CommandInput placeholder="Rechercher…" />
                      <CommandList>
                        <CommandEmpty>Aucune compétence trouvée.</CommandEmpty>
                        <CommandGroup>
                          {visibleSkills.map((skill) => {
                            const checked = selectedSkills.includes(skill.id);
                            return (
                              <CommandItem
                                key={skill.id}
                                onSelect={() => toggleSkill(skill.id)}
                                className="flex items-center gap-2 cursor-pointer"
                              >
                                <Checkbox checked={checked} className="pointer-events-none" />
                                <span>{skill.name}</span>
                              </CommandItem>
                            );
                          })}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>

                {/* Reset */}
                {(hasActiveFilters || search) && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-10 text-destructive hover:text-destructive gap-1"
                    onClick={() => { setSearch(""); resetFilters(); }}
                  >
                    <X size={14} />
                    Réinitialiser
                  </Button>
                )}
              </div>

              {/* Active filter badges */}
              {hasActiveFilters && (
                <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-border">
                  {selectedSpecialityObj && (
                    <Badge
                      variant="secondary"
                      className="gap-1 cursor-pointer"
                      onClick={() => { setSelectedSpeciality(null); setPage(1); }}
                    >
                      {selectedSpecialityObj.name}
                      <X size={11} />
                    </Badge>
                  )}
                  {selectedSkills.map((id) => {
                    const skill = visibleSkills.find((s) => s.id === id);
                    if (!skill) return null;
                    return (
                      <Badge
                        key={id}
                        variant="secondary"
                        className="gap-1 cursor-pointer"
                        onClick={() => toggleSkill(id)}
                      >
                        {skill.name}
                        <X size={11} />
                      </Badge>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* ── Results ── */}
          {isLoading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="animate-spin text-primary" size={36} />
            </div>
          ) : results.length > 0 ? (
            <>
              <div
                className={
                  viewMode === "grid"
                    ? "grid md:grid-cols-2 lg:grid-cols-3 gap-6"
                    : "flex flex-col gap-4 max-w-3xl mx-auto"
                }
              >
                {results.map((project, index) => (
                  <ProjectCard3D
                    key={project.id}
                    project={mapApiProjectToUI(project)}
                    index={index}
                    onApply={handleApply}
                  />
                ))}
              </div>

              <PagePagination page={page} totalPages={totalPages} onPageChange={setPage} />

              {/* CTA banner */}
              <div className="mt-16 bg-primary rounded-2xl p-10 text-center">
                <h2 className="text-2xl font-bold text-white mb-3">
                  Vous avez un projet ?
                </h2>
                <p className="text-white/80 mb-6 max-w-xl mx-auto">
                  Publiez votre projet gratuitement et recevez des propositions de nos meilleurs talents
                </p>
                <Button variant="cta" asChild>
                  <Link to="/signup">Publier un Projet Gratuitement</Link>
                </Button>
              </div>
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
                onClick={() => { setSearch(""); resetFilters(); }}
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
