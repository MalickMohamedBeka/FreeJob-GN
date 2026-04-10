import { useState } from "react";
import { Search, Loader2, MapPin, Globe, X, ChevronDown, Building2, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
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
import type { ApiAgencyProfile } from "@/types";

// ── Agency Card ────────────────────────────────────────────────────────────────

function AgencyCard({ agency, index }: { agency: ApiAgencyProfile; index: number }) {
  const agencyName = agency.agency_details?.agency_name || agency.username;
  const location = [agency.city_or_region, agency.country].filter(Boolean).join(", ");
  const initial = agencyName.charAt(0).toUpperCase();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Link to={`/agencies/${agency.id}`} className="block h-full">
        <div className="bg-white rounded-2xl border border-border hover:border-secondary/40 hover:shadow-md transition-all p-5 h-full flex flex-col">
          {/* Header */}
          <div className="flex items-start gap-4 mb-4">
            {agency.profile_picture ? (
              <img
                src={agency.profile_picture}
                alt={agencyName}
                className="w-14 h-14 rounded-xl object-cover flex-shrink-0 border border-border"
              />
            ) : (
              <div className="w-14 h-14 rounded-xl bg-secondary/10 flex items-center justify-center flex-shrink-0 text-2xl font-bold text-secondary">
                {initial}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-base truncate">{agencyName}</h3>
              {location && (
                <p className="text-sm text-muted-foreground flex items-center gap-1 mt-0.5">
                  <MapPin size={12} />
                  {location}
                </p>
              )}
              {agency.agency_details?.founded_at && (
                <p className="text-xs text-muted-foreground mt-0.5">
                  Fondée en {new Date(agency.agency_details.founded_at).getFullYear()}
                </p>
              )}
            </div>
          </div>

          {/* Bio */}
          {agency.bio && (
            <p className="text-sm text-muted-foreground line-clamp-2 mb-3 flex-1">
              {agency.bio}
            </p>
          )}

          {/* Speciality */}
          {agency.speciality && (
            <Badge className="bg-secondary/10 text-secondary border-secondary/20 text-xs w-fit mb-3">
              {agency.speciality.name}
            </Badge>
          )}

          {/* Skills */}
          {agency.skills && agency.skills.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-auto">
              {agency.skills.slice(0, 4).map((s) => (
                <Badge key={s.id} variant="outline" className="text-xs">{s.name}</Badge>
              ))}
              {agency.skills.length > 4 && (
                <Badge variant="outline" className="text-xs text-muted-foreground">
                  +{agency.skills.length - 4}
                </Badge>
              )}
            </div>
          )}

          {/* Rate */}
          {agency.hourly_rate && (
            <div className="mt-3 pt-3 border-t border-border">
              <p className="text-sm font-semibold text-primary">
                {parseFloat(agency.hourly_rate).toLocaleString("fr-FR")} GNF/h
              </p>
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────────

export default function Agencies() {
  const [search, setSearch] = useState("");
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
        return name.toLowerCase().includes(search.toLowerCase()) ||
               a.bio?.toLowerCase().includes(search.toLowerCase());
      })
    : results;

  const hasFilters = selectedSpeciality !== null || selectedSkillId !== null;

  const resetFilters = () => {
    setSelectedSpeciality(null);
    setSelectedSkillId(null);
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <Navbar />
      <main className="pt-16">
        {/* Hero */}
        <section className="bg-gradient-to-br from-secondary/5 via-background to-primary/5 py-20 border-b border-border">
          <div className="container mx-auto px-4 text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 text-secondary text-sm font-medium mb-6">
                <Building2 size={16} />
                Agences partenaires
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Trouvez l'agence{" "}
                <span className="text-secondary">idéale</span>
              </h1>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Découvrez nos agences certifiées et confiez vos projets à des équipes expertes.
              </p>
              <div className="flex items-center gap-4 justify-center mt-6 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Users size={15} />
                  {data?.count ?? 0} agence{(data?.count ?? 0) !== 1 ? "s" : ""} disponible{(data?.count ?? 0) !== 1 ? "s" : ""}
                </span>
              </div>
            </motion.div>
          </div>
        </section>

        <div className="container mx-auto px-4 lg:px-8 py-10 pb-24">
          {/* Search + Filters */}
          <div className="max-w-4xl mx-auto mb-8">
            {/* Search bar */}
            <div className="relative mb-4">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Rechercher une agence…"
                className="w-full h-12 pl-11 pr-4 rounded-xl border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all"
              />
              {search && (
                <button onClick={() => setSearch("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  <X size={16} />
                </button>
              )}
            </div>

            {/* Filter row */}
            <div className="bg-white rounded-xl border border-border p-4">
              <div className="flex flex-wrap gap-3 items-center">
                {/* Spécialité */}
                <Select
                  value={selectedSpeciality !== null ? String(selectedSpeciality) : "__all__"}
                  onValueChange={(v) => {
                    const next = v === "__all__" ? null : Number(v);
                    setSelectedSpeciality(next);
                    if (next !== null) {
                      const sp = allSpecialities.find((s) => s.id === next);
                      const allowed = new Set((sp?.skills ?? []).map((s) => s.id));
                      if (selectedSkillId !== null && !allowed.has(selectedSkillId)) setSelectedSkillId(null);
                    }
                    setPage(1);
                  }}
                >
                  <SelectTrigger className="h-10 w-[200px]">
                    <SelectValue placeholder="Toutes les spécialités" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__all__">Toutes les spécialités</SelectItem>
                    {allSpecialities.map((sp) => (
                      <SelectItem key={sp.id} value={String(sp.id)}>{sp.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Compétence */}
                <Popover open={skillsOpen} onOpenChange={setSkillsOpen}>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="h-10 w-[200px] justify-between font-normal">
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
                              onSelect={() => { setSelectedSkillId((p) => (p === skill.id ? null : skill.id)); setSkillsOpen(false); setPage(1); }}
                              className="flex items-center gap-2 cursor-pointer"
                            >
                              <Checkbox checked={selectedSkillId === skill.id} className="pointer-events-none" />
                              <span>{skill.name}</span>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>

                {hasFilters && (
                  <Button variant="ghost" size="sm" className="h-10 gap-1 text-destructive hover:text-destructive" onClick={resetFilters}>
                    <X size={14} />
                    Réinitialiser
                  </Button>
                )}
              </div>

              {/* Active filter badges */}
              {hasFilters && (
                <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-border">
                  {selectedSpecialityObj && (
                    <Badge variant="secondary" className="gap-1 cursor-pointer" onClick={() => { setSelectedSpeciality(null); setPage(1); }}>
                      {selectedSpecialityObj.name}<X size={11} />
                    </Badge>
                  )}
                  {selectedSkillObj && (
                    <Badge variant="secondary" className="gap-1 cursor-pointer" onClick={() => { setSelectedSkillId(null); setPage(1); }}>
                      {selectedSkillObj.name}<X size={11} />
                    </Badge>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Results */}
          {isLoading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="animate-spin text-secondary" size={36} />
            </div>
          ) : filtered.length > 0 ? (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filtered.map((agency, i) => (
                  <AgencyCard key={agency.id} agency={agency} index={i} />
                ))}
              </div>
              <PagePagination page={page} totalPages={totalPages} onPageChange={setPage} />

              <div className="mt-16 bg-secondary rounded-2xl p-10 text-center">
                <h2 className="text-2xl font-bold text-white mb-3">Vous êtes une agence ?</h2>
                <p className="text-white/80 mb-6 max-w-xl mx-auto">
                  Rejoignez notre réseau d'agences et accédez à des projets de qualité pour développer votre activité.
                </p>
                <Button variant="outline" className="bg-white text-secondary hover:bg-white/90 border-white" asChild>
                  <Link to="/signup">Inscrivez votre agence</Link>
                </Button>
              </div>
            </>
          ) : (
            <div className="text-center py-20">
              <Building2 className="mx-auto text-muted-foreground mb-4" size={48} />
              <h3 className="text-xl font-bold mb-2">Aucune agence trouvée</h3>
              <p className="text-muted-foreground mb-6">Essayez de modifier vos critères de recherche.</p>
              <Button variant="outline" onClick={() => { setSearch(""); resetFilters(); }}>Réinitialiser les filtres</Button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
