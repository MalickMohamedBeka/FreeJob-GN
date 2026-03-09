import { motion } from "framer-motion";
import { useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Search,
  MapPin,
  Clock,
  Coins,
  Briefcase,
  Loader2,
  SendHorizonal,
  ChevronDown,
  X,
  CreditCard,
} from "lucide-react";
import { useProjects } from "@/hooks/useProjects";
import { useCreateProposal } from "@/hooks/useProposals";
import { useAllSkills, useAllSpecialities } from "@/hooks/useTaxonomy";
import { useDebounce } from "@/hooks";
import { ApiError } from "@/services/api.service";
import type { ApiProjectList } from "@/types";
import { ROUTES } from "@/constants/routes";
import { Link } from "react-router-dom";


// ── Submit Proposal Dialog ────────────────────────────────────────────────────

function SubmitProposalDialog({
  project,
  open,
  onOpenChange,
}: {
  project: ApiProjectList | null;
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const [price, setPrice] = useState("");
  const [durationDays, setDurationDays] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [errorCode, setErrorCode] = useState<string | null>(null);
  const create = useCreateProposal();

  const reset = () => {
    setPrice("");
    setDurationDays("");
    setMessage("");
    setError("");
    setErrorCode(null);
  };

  const handleOpenChange = (v: boolean) => {
    if (!v) reset();
    onOpenChange(v);
  };

  const handleSubmit = async () => {
    if (!project) return;
    if (!price || !durationDays || !message.trim()) {
      setError("Tous les champs sont obligatoires.");
      setErrorCode(null);
      return;
    }
    setError("");
    setErrorCode(null);
    try {
      await create.mutateAsync({
        project_id: project.id,
        price,
        duration_days: parseInt(durationDays, 10),
        message: message.trim(),
      });
      handleOpenChange(false);
    } catch (err) {
      if (err instanceof ApiError) {
        const code = (err.data as { code?: string })?.code ?? null;
        setErrorCode(code);
        setError(err.message);
      } else {
        setError("Une erreur est survenue.");
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Soumettre une proposition</DialogTitle>
        </DialogHeader>

        {project && (
          <div className="p-3 rounded-lg bg-muted/50 text-sm mb-2">
            <p className="font-medium">{project.title}</p>
            <p className="text-muted-foreground">{project.client.username} · {project.budget_band_display}</p>
          </div>
        )}

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="prop-price">Montant proposé (GNF) *</Label>
              <Input
                id="prop-price"
                type="number"
                min="1"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="Ex: 5000000"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="prop-duration">Durée (jours) *</Label>
              <Input
                id="prop-duration"
                type="number"
                min="1"
                value={durationDays}
                onChange={(e) => setDurationDays(e.target.value)}
                placeholder="Ex: 30"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="prop-message">Lettre de motivation *</Label>
            <Textarea
              id="prop-message"
              rows={5}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Décrivez pourquoi vous êtes le meilleur candidat pour ce projet…"
            />
          </div>

          {error && (
            <div className={`rounded-lg p-3 text-sm ${
              errorCode === 'active_subscription_required'
                ? 'bg-primary/5 border border-primary/20'
                : 'bg-destructive/5 border border-destructive/20'
            }`}>
              <p className={errorCode === 'active_subscription_required' ? 'text-primary font-medium' : 'text-destructive'}>
                {errorCode === 'monthly_credits_exhausted'
                  ? 'Quota mensuel atteint — vos crédits du mois sont épuisés.'
                  : errorCode === 'annual_credits_exhausted'
                  ? 'Quota annuel atteint — vos crédits annuels sont épuisés.'
                  : errorCode === 'monthly_credits_not_allowed'
                  ? 'Votre abonnement ne permet pas de crédits mensuels.'
                  : error}
              </p>
              {errorCode === 'active_subscription_required' && (
                <Link
                  to={ROUTES.DASHBOARD.EARNINGS}
                  className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium text-primary underline underline-offset-2"
                  onClick={() => handleOpenChange(false)}
                >
                  <CreditCard size={12} />
                  Souscrire un abonnement
                </Link>
              )}
              {(errorCode === 'monthly_credits_exhausted' || errorCode === 'annual_credits_exhausted') && (
                <Link
                  to={ROUTES.DASHBOARD.EARNINGS}
                  className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground underline underline-offset-2"
                  onClick={() => handleOpenChange(false)}
                >
                  <CreditCard size={12} />
                  Voir mon abonnement
                </Link>
              )}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => handleOpenChange(false)}>Annuler</Button>
          <Button onClick={handleSubmit} disabled={create.isPending} className="gap-2">
            {create.isPending
              ? <Loader2 size={16} className="animate-spin" />
              : <SendHorizonal size={16} />
            }
            Envoyer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────

const FindProjects = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSkills, setSelectedSkills] = useState<number[]>([]);
  const [selectedSpeciality, setSelectedSpeciality] = useState<number | null>(null);
  const [skillsOpen, setSkillsOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [proposalProject, setProposalProject] = useState<ApiProjectList | null>(null);
  const debouncedSearch = useDebounce(searchQuery, 300);

  // Taxonomy from dedicated endpoints
  const { data: skillsData } = useAllSkills();
  const { data: specialitiesData } = useAllSpecialities();

  const allSpecialities = specialitiesData?.results ?? [];
  const selectedSpecialityObj = allSpecialities.find((s) => s.id === selectedSpeciality);
  // When a speciality is selected, show only its skills; otherwise all skills
  const visibleSkills =
    selectedSpeciality && selectedSpecialityObj?.skills?.length
      ? selectedSpecialityObj.skills
      : (skillsData?.results ?? []);

  const toggleSkill = (id: number) => {
    setSelectedSkills((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
    setPage(1);
  };

  const handleSpecialityChange = (value: string) => {
    const next = value === "__all__" ? null : Number(value);
    setSelectedSpeciality(next);
    // Drop skills that don't belong to the newly selected speciality
    if (next !== null) {
      const newSp = allSpecialities.find((s) => s.id === next);
      const allowed = new Set((newSp?.skills ?? []).map((s) => s.id));
      setSelectedSkills((prev) => prev.filter((sid) => allowed.has(sid)));
    }
    setPage(1);
  };

  const hasActiveFilters = selectedSkills.length > 0 || selectedSpeciality !== null;

  const { data, isLoading } = useProjects({
    search: debouncedSearch || undefined,
    skill_ids: selectedSkills.length > 0 ? selectedSkills : undefined,
    speciality_id: selectedSpeciality ?? undefined,
    page,
  });

  const projects = data?.results ?? [];

  return (
    <DashboardLayout userType="freelancer">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold mb-2">Trouver des Projets</h1>
          <p className="text-muted-foreground">
            Découvrez les opportunités qui correspondent à vos compétences
          </p>
        </div>

        {/* Search & Filters */}
        <Card className="p-4">
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
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
              />
            </div>

            {/* Spécialité — single select */}
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
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                className="h-10 text-destructive hover:text-destructive gap-1"
                onClick={() => {
                  setSelectedSkills([]);
                  setSelectedSpeciality(null);
                  setPage(1);
                }}
              >
                <X size={14} />
                Réinitialiser
              </Button>
            )}
          </div>

          {/* Selected skills badges */}
          {selectedSkills.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-border">
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
        </Card>

        {/* Results Count */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">{data?.count ?? 0}</span> projets
            disponibles
          </p>
        </div>

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
                        <h3 className="text-xl font-semibold">{project.title}</h3>
                        <p className="text-muted-foreground font-medium">{project.client.username}</p>
                      </div>
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
                        <span className="font-medium text-foreground">
                          {Number(project.budget_amount).toLocaleString()} GNF
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock size={16} />
                        <span>
                          {project.deadline
                            ? new Date(project.deadline).toLocaleDateString("fr-FR")
                            : "Non défini"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin size={16} />
                        <span>Remote</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Briefcase size={16} />
                        <span>{project.category.name}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-border">
                      <span className="text-sm text-muted-foreground">
                        {new Date(project.created_at).toLocaleDateString("fr-FR")}
                      </span>
                      <Button
                        className="gap-2"
                        onClick={() => setProposalProject(project)}
                      >
                        <SendHorizonal size={16} />
                        Soumettre une proposition
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>

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

      <SubmitProposalDialog
        project={proposalProject}
        open={proposalProject !== null}
        onOpenChange={(v) => { if (!v) setProposalProject(null); }}
      />
    </DashboardLayout>
  );
};

export default FindProjects;
