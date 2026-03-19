import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, CheckCircle2, User } from "lucide-react";
import { useProjects, useCreateProject, useSubmitProjectForReview } from "@/hooks/useProjects";
import { useToast } from "@/hooks/use-toast";
import { ApiError } from "@/services/api.service";
import type { BudgetBandEnum } from "@/types";

const budgetBands: { value: BudgetBandEnum; label: string }[] = [
  { value: "BAND_25_50", label: "2.5M – 5M GNF" },
  { value: "BAND_50_100", label: "5M – 10M GNF" },
  { value: "BAND_100_PLUS", label: "10M GNF et plus" },
];

interface FormValues {
  title: string;
  description: string;
  category_id: string;
  speciality_id: number | null;
  skill_ids: number[];
  budget_band: BudgetBandEnum | "";
  budget_amount: string;
  deadline: string;
}

const empty: FormValues = {
  title: "",
  description: "",
  category_id: "",
  speciality_id: null,
  skill_ids: [],
  budget_band: "",
  budget_amount: "",
  deadline: "",
};

interface Props {
  open: boolean;
  onClose: () => void;
  providerUsername: string;
}

export default function DirectProjectModal({ open, onClose, providerUsername }: Props) {
  const [form, setForm] = useState<FormValues>(empty);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const { toast } = useToast();
  const createProject = useCreateProject();
  const submitForReview = useSubmitProjectForReview();

  // Derive categories, specialities, skills from published projects (no dedicated endpoint)
  const { data: allProjects } = useProjects();
  const allResults = allProjects?.results ?? [];

  const categories = Array.from(
    new Map(allResults.map((p) => [p.category.id, p.category])).values()
  );
  const specialities = Array.from(
    new Map(
      allResults
        .filter((p) => p.speciality?.id)
        .map((p) => [p.speciality.id, p.speciality])
    ).values()
  );
  const skills = Array.from(
    new Map(
      allResults.flatMap((p) => p.skills).map((s) => [s.id, s])
    ).values()
  );

  const isPending = createProject.isPending || submitForReview.isPending;

  const set =
    (field: keyof FormValues) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [field]: e.target.value }));

  const toggleSkill = (id: number) =>
    setForm((f) => ({
      ...f,
      skill_ids: f.skill_ids.includes(id)
        ? f.skill_ids.filter((s) => s !== id)
        : [...f.skill_ids, id],
    }));

  const handleSubmit = async () => {
    if (!form.title || !form.description || !form.category_id || !form.budget_band || !form.budget_amount) {
      setError("Titre, description, catégorie, tranche budgétaire et montant sont obligatoires.");
      return;
    }
    setError("");
    try {
      const project = await createProject.mutateAsync({
        title: form.title,
        description: form.description,
        category_id: form.category_id,
        budget_band: form.budget_band as BudgetBandEnum,
        budget_amount: form.budget_amount,
        deadline: form.deadline || null,
        speciality_id: form.speciality_id,
        skill_ids: form.skill_ids.length > 0 ? form.skill_ids : undefined,
      });
      await submitForReview.mutateAsync(project.id);
      setSubmitted(true);
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : "Une erreur est survenue.";
      setError(msg);
      toast({ title: "Erreur", description: msg, variant: "destructive" });
    }
  };

  const handleClose = () => {
    setForm(empty);
    setError("");
    setSubmitted(false);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Proposer un projet à {providerUsername}</DialogTitle>
        </DialogHeader>

        {submitted ? (
          <div className="py-8 text-center space-y-3">
            <CheckCircle2 className="mx-auto text-primary" size={48} />
            <p className="text-lg font-semibold">Projet soumis avec succès !</p>
            <p className="text-sm text-muted-foreground">
              Votre projet est en cours de validation. Une fois approuvé,{" "}
              <span className="font-medium text-foreground">{providerUsername}</span> pourra
              soumettre une offre directement.
            </p>
            <Button className="mt-4" onClick={handleClose}>Fermer</Button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Context banner */}
            <div className="flex items-center gap-2.5 p-3 rounded-lg bg-primary/5 border border-primary/20 text-sm">
              <User size={15} className="text-primary flex-shrink-0" />
              <span>
                Ce projet sera soumis pour validation puis proposé à{" "}
                <span className="font-semibold">{providerUsername}</span>.
              </span>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="dp-title">Titre *</Label>
              <Input
                id="dp-title"
                value={form.title}
                onChange={set("title")}
                placeholder="Ex: Développement site e-commerce"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="dp-desc">Description *</Label>
              <Textarea
                id="dp-desc"
                rows={4}
                value={form.description}
                onChange={set("description")}
                placeholder="Décrivez votre besoin en détail…"
              />
            </div>

            <div className="space-y-1.5">
              <Label>Catégorie *</Label>
              <Select
                value={form.category_id}
                onValueChange={(v) => setForm((f) => ({ ...f, category_id: v }))}
                disabled={categories.length === 0}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={categories.length === 0 ? "Chargement…" : "Sélectionner une catégorie"}
                  />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((c) => (
                    <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label>Spécialité</Label>
              <Select
                value={form.speciality_id ? String(form.speciality_id) : "none"}
                onValueChange={(v) =>
                  setForm((f) => ({ ...f, speciality_id: v === "none" ? null : Number(v) }))
                }
                disabled={specialities.length === 0}
              >
                <SelectTrigger>
                  <SelectValue placeholder={specialities.length === 0 ? "Aucune spécialité disponible" : "Sélectionner une spécialité"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Aucune</SelectItem>
                  {specialities.map((s) => (
                    <SelectItem key={s.id} value={String(s.id)}>{s.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {skills.length > 0 && (
              <div className="space-y-1.5">
                <Label>Compétences requises *</Label>
                <div className="flex flex-wrap gap-2 p-3 border border-border rounded-md min-h-[44px]">
                  {skills.map((skill) => {
                    const selected = form.skill_ids.includes(skill.id);
                    return (
                      <button
                        key={skill.id}
                        type="button"
                        onClick={() => toggleSkill(skill.id)}
                        className={`px-2.5 py-1 rounded-full text-xs font-medium border transition-colors ${
                          selected
                            ? "bg-primary text-white border-primary"
                            : "border-border text-muted-foreground hover:border-primary hover:text-foreground"
                        }`}
                      >
                        {skill.name}
                      </button>
                    );
                  })}
                </div>
                {form.skill_ids.length > 0 && (
                  <p className="text-xs text-muted-foreground">
                    {form.skill_ids.length} compétence{form.skill_ids.length > 1 ? "s" : ""} sélectionnée{form.skill_ids.length > 1 ? "s" : ""}
                  </p>
                )}
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Tranche budgétaire *</Label>
                <Select
                  value={form.budget_band}
                  onValueChange={(v) => setForm((f) => ({ ...f, budget_band: v as BudgetBandEnum }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner" />
                  </SelectTrigger>
                  <SelectContent>
                    {budgetBands.map((b) => (
                      <SelectItem key={b.value} value={b.value}>{b.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="dp-amount">Montant (GNF) *</Label>
                <Input
                  id="dp-amount"
                  type="number"
                  min="1"
                  value={form.budget_amount}
                  onChange={set("budget_amount")}
                  placeholder="Ex: 3000000"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="dp-deadline">
                Date limite{" "}
                <span className="text-muted-foreground text-xs">(optionnelle)</span>
              </Label>
              <Input
                id="dp-deadline"
                type="date"
                value={form.deadline}
                onChange={set("deadline")}
              />
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}

            <div className="flex gap-2 pt-2">
              <Button variant="outline" className="flex-1" onClick={handleClose} disabled={isPending}>
                Annuler
              </Button>
              <Button className="flex-1 gap-2" onClick={handleSubmit} disabled={isPending}>
                {isPending ? <Loader2 size={14} className="animate-spin" /> : null}
                Envoyer le projet
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
