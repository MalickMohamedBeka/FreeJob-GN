import { motion } from "framer-motion";
import { useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plus,
  Loader2,
  Pencil,
  Trash2,
  SendHorizonal,
  Briefcase,
} from "lucide-react";
import {
  useProjects,
  useMyProjects,
  useCreateProject,
  useUpdateProject,
  useDeleteProject,
  useSubmitProjectForReview,
} from "@/hooks/useProjects";
import { useAuth } from "@/contexts/AuthContext";
import { ApiError } from "@/services/api.service";
import type { ApiProjectList, ApiProjectCreateRequest, BudgetBandEnum } from "@/types";

const budgetBands: { value: BudgetBandEnum; label: string }[] = [
  { value: "BAND_25_50", label: "25M – 50M GNF" },
  { value: "BAND_50_100", label: "50M – 100M GNF" },
  { value: "BAND_100_PLUS", label: "100M GNF et plus" },
];

const statusConfig: Record<string, { label: string; class: string }> = {
  DRAFT: { label: "Brouillon", class: "bg-muted text-foreground" },
  PENDING_REVIEW: { label: "En revue", class: "bg-yellow-500 text-white" },
  PUBLISHED: { label: "Publié", class: "bg-primary text-white" },
  IN_PROGRESS: { label: "En cours", class: "bg-secondary text-white" },
  CLOSED: { label: "Fermé", class: "bg-muted text-foreground" },
  REJECTED: { label: "Rejeté", class: "bg-destructive text-white" },
  CANCELLED: { label: "Annulé", class: "bg-muted text-foreground" },
};

// ── Project Form Dialog ───────────────────────────────────────────────────────

interface ProjectFormValues {
  title: string;
  description: string;
  category_id: string;
  budget_band: BudgetBandEnum | "";
  budget_amount: string;
  deadline: string;
}

function ProjectFormDialog({
  open,
  onOpenChange,
  initial,
  projectId,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  initial?: ApiProjectList | null;
  projectId?: string;
}) {
  const isEdit = !!projectId;
  const createProject = useCreateProject();
  const updateProject = useUpdateProject();
  const { data: allProjects } = useProjects();

  // Derive unique categories from published projects (no dedicated categories endpoint)
  const categories = Array.from(
    new Map(
      (allProjects?.results ?? []).map((p) => [p.category.id, p.category])
    ).values()
  );

  const [form, setForm] = useState<ProjectFormValues>({
    title: initial?.title ?? "",
    description: initial?.description ?? "",
    category_id: initial?.category.id ?? "",
    budget_band: (initial?.budget_band as BudgetBandEnum) ?? "",
    budget_amount: initial?.budget_amount ?? "",
    deadline: initial?.deadline ?? "",
  });
  const [error, setError] = useState("");

  const isPending = createProject.isPending || updateProject.isPending;

  const handleClose = () => {
    setError("");
    onOpenChange(false);
  };

  const handleSubmit = async () => {
    if (!form.title || !form.description || !form.category_id || !form.budget_band || !form.budget_amount) {
      setError("Titre, description, catégorie, tranche budgétaire et montant sont obligatoires.");
      return;
    }
    setError("");
    try {
      const payload: ApiProjectCreateRequest = {
        title: form.title,
        description: form.description,
        category_id: form.category_id,
        budget_band: form.budget_band as BudgetBandEnum,
        budget_amount: form.budget_amount,
        deadline: form.deadline || null,
      };

      if (isEdit && projectId) {
        await updateProject.mutateAsync({ id: projectId, data: payload });
      } else {
        await createProject.mutateAsync(payload);
      }
      handleClose();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Une erreur est survenue.");
    }
  };

  const set = (field: keyof ProjectFormValues) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setForm((f) => ({ ...f, [field]: e.target.value }));

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Modifier le projet" : "Nouveau projet"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="proj-title">Titre *</Label>
            <Input id="proj-title" value={form.title} onChange={set("title")} placeholder="Ex: Développement site e-commerce" />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="proj-desc">Description *</Label>
            <Textarea id="proj-desc" rows={4} value={form.description} onChange={set("description")} placeholder="Décrivez votre projet en détail…" />
          </div>

          <div className="space-y-1.5">
            <Label>Catégorie *</Label>
            <Select
              value={form.category_id}
              onValueChange={(v) => setForm((f) => ({ ...f, category_id: v }))}
              disabled={categories.length === 0}
            >
              <SelectTrigger>
                <SelectValue placeholder={categories.length === 0 ? "Aucune catégorie disponible" : "Sélectionner une catégorie"} />
              </SelectTrigger>
              <SelectContent>
                {categories.map((c) => (
                  <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

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
              <Label htmlFor="proj-amount">Montant (GNF) *</Label>
              <Input id="proj-amount" type="number" min="1" value={form.budget_amount} onChange={set("budget_amount")} placeholder="Ex: 30000000" />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="proj-deadline">Date limite</Label>
            <Input id="proj-deadline" type="date" value={form.deadline} onChange={set("deadline")} />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>Annuler</Button>
          <Button onClick={handleSubmit} disabled={isPending} className="gap-2">
            {isPending ? <Loader2 size={16} className="animate-spin" /> : null}
            {isEdit ? "Enregistrer" : "Créer"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

const ClientProjects = () => {
  const [showCreate, setShowCreate] = useState(false);
  const [editProject, setEditProject] = useState<ApiProjectList | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data, isLoading } = useMyProjects();
  const { user } = useAuth();
  const deleteProject = useDeleteProject();
  const submitForReview = useSubmitProjectForReview();

  // The API returns both published projects from everyone AND the client's own projects.
  // Filter to only show the current user's own projects.
  const projects = (data?.results ?? []).filter((p) => p.client.id === user?.id);

  return (
    <DashboardLayout userType="client">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Mes Projets</h1>
            <p className="text-muted-foreground">Créez et gérez vos offres de projets</p>
          </div>
          <Button className="gap-2" onClick={() => setShowCreate(true)}>
            <Plus size={18} />
            Nouveau Projet
          </Button>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="animate-spin text-primary" size={40} />
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <Briefcase className="mx-auto mb-4" size={48} />
            <p className="text-lg font-medium mb-4">Aucun projet pour le moment</p>
            <Button onClick={() => setShowCreate(true)} className="gap-2">
              <Plus size={18} />
              Créer mon premier projet
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {projects.map((project, index) => {
              const sc = statusConfig[project.status] ?? {
                label: project.status_display,
                class: "bg-muted",
              };

              return (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold mb-1">{project.title}</h3>
                        <p className="text-sm text-muted-foreground">{project.category.name}</p>
                      </div>
                      <Badge className={sc.class}>{sc.label}</Badge>
                    </div>

                    <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                      {project.description}
                    </p>

                    <div className="grid sm:grid-cols-3 gap-4 mb-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Budget</p>
                        <p className="font-semibold text-primary">{project.budget_band_display}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Montant</p>
                        <p className="font-semibold">
                          {Number(project.budget_amount).toLocaleString("fr-FR")} GNF
                        </p>
                      </div>
                      {project.deadline && (
                        <div>
                          <p className="text-muted-foreground">Échéance</p>
                          <p className="font-medium">
                            {new Date(project.deadline).toLocaleDateString("fr-FR")}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-2 pt-4 border-t border-border">
                      {/* Submit for review — DRAFT only */}
                      {project.status === "DRAFT" && (
                        <Button
                          size="sm"
                          className="gap-2"
                          disabled={submitForReview.isPending}
                          onClick={() => submitForReview.mutate(project.id)}
                        >
                          {submitForReview.isPending ? (
                            <Loader2 size={14} className="animate-spin" />
                          ) : (
                            <SendHorizonal size={14} />
                          )}
                          Soumettre pour révision
                        </Button>
                      )}

                      {/* Edit — DRAFT only */}
                      {project.status === "DRAFT" && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="gap-2"
                          onClick={() => setEditProject(project)}
                        >
                          <Pencil size={14} />
                          Modifier
                        </Button>
                      )}

                      {/* Delete — DRAFT only */}
                      {project.status === "DRAFT" && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-destructive gap-2"
                          onClick={() => setDeleteId(project.id)}
                        >
                          <Trash2 size={14} />
                          Supprimer
                        </Button>
                      )}
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Create dialog */}
      <ProjectFormDialog
        open={showCreate}
        onOpenChange={setShowCreate}
      />

      {/* Edit dialog */}
      {editProject && (
        <ProjectFormDialog
          open={!!editProject}
          onOpenChange={(v) => { if (!v) setEditProject(null); }}
          initial={editProject}
          projectId={editProject.id}
        />
      )}

      {/* Delete confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={(v) => { if (!v) setDeleteId(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer ce projet ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. Le projet et ses données associées seront définitivement supprimés.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive hover:bg-destructive/90"
              onClick={() => {
                if (deleteId) deleteProject.mutate(deleteId);
                setDeleteId(null);
              }}
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
};

export default ClientProjects;
