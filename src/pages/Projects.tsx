import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Loader2, Rocket, X, ChevronDown } from "lucide-react";
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
import { Input } from "@/components/ui/input";
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
  const [selectedSkills, setSelectedSkills] = useState<number[]>([]);
  const [selectedSpeciality, setSelectedSpeciality] = useState<number | null>(null);
  const [skillsOpen, setSkillsOpen] = useState(false);
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebounce(search, 300);
  const navigate = useNavigate();
  const { user } = useAuth();

  // Taxonomy
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

  const handleApply = () => {
    if (user?.role === "PROVIDER") {
      navigate(ROUTES.DASHBOARD.FIND_PROJECTS);
    } else {
      navigate(ROUTES.LOGIN);
    }
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

  const hasActiveFilters = selectedSkills.length > 0 || selectedSpeciality !== null;

  const resetFilters = () => {
    setSelectedSkills([]);
    setSelectedSpeciality(null);
    setPage(1);
  };

  const results = data?.results ?? [];
  const PAGE_SIZE = results.length > 0 && data?.next ? results.length : 10;
  const totalPages = data ? Math.ceil(data.count / PAGE_SIZE) : 0;

  return (
    <div className="min-h-screen bg-muted/30">
      <Navbar />
      <main className="pt-16">
        <ProjectsHero3D />

        <div className="container mx-auto px-4 lg:px-8 py-10 pb-20">
          {/* Search + Filters */}
          <div className="mb-8">
            <div className="bg-white rounded-xl border border-border p-4 mb-4">
              <div className="flex flex-wrap gap-3 items-end">
                {/* Search */}
                <div className="relative flex-1 min-w-[200px]">
                  <Search
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                    size={16}
                  />
                  <Input
                    placeholder="Rechercher un projet…"
                    className="pl-9 h-10"
                    value={search}
                    onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                  />
                </div>

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

                {/* Compétences — multi-select popover */}
                <Popover open={skillsOpen} onOpenChange={setSkillsOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="h-10 w-[220px] justify-between font-normal"
                    >
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

              {/* Active skill badges */}
              {selectedSkills.length > 0 && (
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

            {/* Results count */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Rocket size={14} className="text-primary" />
              <span>
                <strong className="text-foreground">{data?.count ?? 0}</strong>{" "}
                {(data?.count ?? 0) === 1 ? "projet trouvé" : "projets trouvés"}
              </span>
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="animate-spin text-primary" size={36} />
            </div>
          ) : results.length > 0 ? (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
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
