import { useState } from "react";
import { Search, Loader2, X, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import FreelancersHero3D from "@/components/freelancers/FreelancersHero3D";
import SearchBar3D from "@/components/freelancers/SearchBar3D";
import FreelancerCard3D from "@/components/freelancers/FreelancerCard3D";
import { useFreelancers } from "@/hooks/useFreelancers";
import { useAllSkills, useAllSpecialities } from "@/hooks/useTaxonomy";
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
import type { Freelancer } from "@/types";
import type { ApiFreelancerProfile } from "@/types";

function mapApiFreelancerToUI(f: ApiFreelancerProfile): Freelancer {
  const fullName = f.freelance_details
    ? `${f.freelance_details.first_name} ${f.freelance_details.last_name}`
    : f.username;
  return {
    id: String(f.id),
    name: fullName,
    title: f.speciality?.name || "Freelancer",
    avatar: f.profile_picture || "",
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
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedSpeciality, setSelectedSpeciality] = useState<number | null>(null);
  const [selectedSkillId, setSelectedSkillId] = useState<number | null>(null);
  const [skillsOpen, setSkillsOpen] = useState(false);
  const [page, setPage] = useState(1);

  // Taxonomy
  const { data: specialitiesData } = useAllSpecialities();
  const { data: skillsData } = useAllSkills();

  const allSpecialities = specialitiesData?.results ?? [];
  const selectedSpecialityObj = allSpecialities.find((s) => s.id === selectedSpeciality);
  // When speciality is selected, show only its skills; otherwise all skills
  const visibleSkills =
    selectedSpeciality && selectedSpecialityObj?.skills?.length
      ? selectedSpecialityObj.skills
      : (skillsData?.results ?? []);

  const selectedSkillObj = visibleSkills.find((s) => s.id === selectedSkillId);

  const { data, isLoading } = useFreelancers({
    page,
    skill_id: selectedSkillId ?? undefined,
    speciality_id: selectedSpeciality ?? undefined,
  });

  const results = data?.results ?? [];
  const PAGE_SIZE = results.length > 0 && data?.next ? results.length : 10;
  const totalPages = data ? Math.ceil(data.count / PAGE_SIZE) : 0;

  // Text search is client-side (API doesn't support search on freelancers endpoint)
  const filtered = search
    ? results.filter((f) => {
        const ui = mapApiFreelancerToUI(f);
        return (
          ui.name.toLowerCase().includes(search.toLowerCase()) ||
          ui.title.toLowerCase().includes(search.toLowerCase())
        );
      })
    : results;

  const hasActiveFilters = selectedSkillId !== null || selectedSpeciality !== null;

  const handleSpecialityChange = (value: string) => {
    const next = value === "__all__" ? null : Number(value);
    setSelectedSpeciality(next);
    // Drop skill if it doesn't belong to the new speciality
    if (next !== null) {
      const newSp = allSpecialities.find((s) => s.id === next);
      const allowed = new Set((newSp?.skills ?? []).map((s) => s.id));
      if (selectedSkillId !== null && !allowed.has(selectedSkillId)) {
        setSelectedSkillId(null);
      }
    }
    setPage(1);
  };

  const handleSkillSelect = (id: number) => {
    setSelectedSkillId((prev) => (prev === id ? null : id));
    setSkillsOpen(false);
    setPage(1);
  };

  const resetFilters = () => {
    setSelectedSpeciality(null);
    setSelectedSkillId(null);
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <Navbar />
      <main className="pt-16">
        <FreelancersHero3D />

        <div className="container mx-auto px-4 lg:px-8 py-10 pb-24">
          <SearchBar3D
            search={search}
            setSearch={setSearch}
            viewMode={viewMode}
            setViewMode={setViewMode}
            resultsCount={filtered.length}
          />

          {/* Taxonomy Filters */}
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

                {/* Compétence — single select popover */}
                <Popover open={skillsOpen} onOpenChange={setSkillsOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="h-10 w-[220px] justify-between font-normal"
                    >
                      <span className="truncate text-sm">
                        {selectedSkillObj ? selectedSkillObj.name : "Toutes les compétences"}
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
                          {visibleSkills.map((skill) => (
                            <CommandItem
                              key={skill.id}
                              onSelect={() => handleSkillSelect(skill.id)}
                              className="flex items-center gap-2 cursor-pointer"
                            >
                              <Checkbox
                                checked={selectedSkillId === skill.id}
                                className="pointer-events-none"
                              />
                              <span>{skill.name}</span>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>

                {/* Reset */}
                {hasActiveFilters && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-10 text-destructive hover:text-destructive gap-1"
                    onClick={resetFilters}
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
                  {selectedSkillObj && (
                    <Badge
                      variant="secondary"
                      className="gap-1 cursor-pointer"
                      onClick={() => { setSelectedSkillId(null); setPage(1); }}
                    >
                      {selectedSkillObj.name}
                      <X size={11} />
                    </Badge>
                  )}
                </div>
              )}
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="animate-spin text-primary" size={36} />
            </div>
          ) : filtered.length > 0 ? (
            <>
              <div
                className={
                  viewMode === "grid"
                    ? "grid md:grid-cols-2 lg:grid-cols-3 gap-6"
                    : "flex flex-col gap-4 max-w-3xl mx-auto"
                }
              >
                {filtered.map((freelancer, index) => (
                  <FreelancerCard3D
                    key={freelancer.id}
                    freelancer={mapApiFreelancerToUI(freelancer)}
                    index={index}
                  />
                ))}
              </div>

              <PagePagination page={page} totalPages={totalPages} onPageChange={setPage} />

              <div className="mt-16 bg-primary rounded-2xl p-10 text-center">
                <h2 className="text-2xl font-bold text-white mb-3">
                  Vous êtes un Talent ?
                </h2>
                <p className="text-white/80 mb-6 max-w-xl mx-auto">
                  Rejoignez notre communauté de freelancers et accédez à des projets exceptionnels
                </p>
                <Button variant="cta" asChild>
                  <Link to="/signup">Créer Mon Profil Gratuitement</Link>
                </Button>
              </div>
            </>
          ) : (
            <div className="text-center py-20">
              <Search className="mx-auto text-muted-foreground mb-4" size={48} />
              <h3 className="text-xl font-bold mb-2">Aucun talent trouvé</h3>
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

export default Freelancers;
