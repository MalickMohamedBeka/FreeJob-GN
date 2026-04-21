import { useState } from "react";
import { Search, Loader2, X, ChevronDown, Building2, LayoutGrid, List } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AgenciesHero3D from "@/components/agencies/AgenciesHero3D";
import AgencyCard3D from "@/components/agencies/AgencyCard3D";
import { useAgencies } from "@/hooks/useAgency";
import { useAllSpecialities, useAllSkills } from "@/hooks/useTaxonomy";
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

const Agencies = () => {
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedSpeciality, setSelectedSpeciality] = useState<number | null>(null);
  const [selectedSkillId, setSelectedSkillId] = useState<number | null>(null);
  const [skillsOpen, setSkillsOpen] = useState(false);
  const [page, setPage] = useState(1);

  const { data: specialitiesData } = useAllSpecialities();
  const { data: skillsData } = useAllSkills();

  const allSpecialities = specialitiesData?.results ?? [];
  const selectedSpecialityObj = allSpecialities.find((s) => s.id === selectedSpeciality);
  const visibleSkills =
    selectedSpeciality && selectedSpecialityObj?.skills?.length
      ? selectedSpecialityObj.skills
      : (skillsData?.results ?? []);
  const selectedSkillObj = visibleSkills.find((s) => s.id === selectedSkillId);

  const { data, isLoading } = useAgencies({
    page,
    speciality_id: selectedSpeciality ?? undefined,
    skill_id: selectedSkillId ?? undefined,
  });

  const results = data?.results ?? [];
  const PAGE_SIZE = results.length > 0 && data?.next ? results.length : 10;
  const totalPages = data ? Math.ceil(data.count / PAGE_SIZE) : 0;

  const filtered = search
    ? results.filter((a) => {
        const name = a.agency_details?.agency_name || a.username;
        return (
          name.toLowerCase().includes(search.toLowerCase()) ||
          a.bio?.toLowerCase().includes(search.toLowerCase())
        );
      })
    : results;

  const hasActiveFilters = selectedSpeciality !== null || selectedSkillId !== null;

  const handleSpecialityChange = (value: string) => {
    const next = value === "__all__" ? null : Number(value);
    setSelectedSpeciality(next);
    if (next !== null) {
      const sp = allSpecialities.find((s) => s.id === next);
      const allowed = new Set((sp?.skills ?? []).map((s) => s.id));
      if (selectedSkillId !== null && !allowed.has(selectedSkillId)) setSelectedSkillId(null);
    }
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
        <AgenciesHero3D />

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
                      placeholder="Rechercher par nom, spécialité..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="w-full h-11 pl-10 pr-10 rounded-lg border border-border bg-white text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                    />
                    {search && (
                      <button
                        onClick={() => setSearch("")}
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
                <Building2 size={14} className="text-secondary" />
                <span>
                  <strong className="text-foreground">{data?.count ?? 0}</strong>{" "}
                  {(data?.count ?? 0) === 1 ? "agence trouvée" : "agences trouvées"}
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

                {/* Compétence */}
                <Popover open={skillsOpen} onOpenChange={setSkillsOpen}>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="h-10 w-[220px] justify-between font-normal">
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
                              onSelect={() => {
                                setSelectedSkillId((p) => (p === skill.id ? null : skill.id));
                                setSkillsOpen(false);
                                setPage(1);
                              }}
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

          {/* ── Results ── */}
          {isLoading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="animate-spin text-secondary" size={36} />
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
                {filtered.map((agency, index) => (
                  <AgencyCard3D key={agency.id} agency={agency} index={index} />
                ))}
              </div>

              <PagePagination page={page} totalPages={totalPages} onPageChange={setPage} />

              {/* CTA banner */}
              <div className="mt-16 bg-secondary rounded-2xl p-10 text-center">
                <h2 className="text-2xl font-bold text-white mb-3">
                  Vous êtes une Agence ?
                </h2>
                <p className="text-white/80 mb-6 max-w-xl mx-auto">
                  Rejoignez notre réseau d'agences et accédez à des projets de qualité pour développer votre activité.
                </p>
                <Button variant="outline" className="bg-white text-secondary hover:bg-white/90 border-white" asChild>
                  <Link to="/signup">Inscrire votre Agence Gratuitement</Link>
                </Button>
              </div>
            </>
          ) : (
            <div className="text-center py-20">
              <Building2 className="mx-auto text-muted-foreground mb-4" size={48} />
              <h3 className="text-xl font-bold mb-2">Aucune agence trouvée</h3>
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

export default Agencies;
