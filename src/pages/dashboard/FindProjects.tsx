import { motion } from "framer-motion";
import { useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  Search,
  Filter,
  Bookmark,
  MapPin,
  Clock,
  Coins,
  Briefcase,
  Loader2,
  SendHorizonal,
} from "lucide-react";
import { useProjects } from "@/hooks/useProjects";
import { useCreateProposal } from "@/hooks/useProposals";
import { useDebounce } from "@/hooks";
import { ApiError } from "@/services/api.service";
import type { ApiProjectList } from "@/types";

const categories = ["Tous", "Développement Web", "Mobile", "Design", "Marketing", "Rédaction"];

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
  const create = useCreateProposal();

  const reset = () => {
    setPrice("");
    setDurationDays("");
    setMessage("");
    setError("");
  };

  const handleOpenChange = (v: boolean) => {
    if (!v) reset();
    onOpenChange(v);
  };

  const handleSubmit = async () => {
    if (!project) return;
    if (!price || !durationDays || !message.trim()) {
      setError("Tous les champs sont obligatoires.");
      return;
    }
    setError("");
    try {
      await create.mutateAsync({
        project_id: project.id,
        price,
        duration_days: parseInt(durationDays, 10),
        message: message.trim(),
      });
      handleOpenChange(false);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Une erreur est survenue.");
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

          {error && <p className="text-sm text-destructive">{error}</p>}
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
  const [selectedCategory, setSelectedCategory] = useState("Tous");
  const [savedProjects, setSavedProjects] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [proposalProject, setProposalProject] = useState<ApiProjectList | null>(null);
  const debouncedSearch = useDebounce(searchQuery, 300);

  const { data, isLoading } = useProjects({
    search: debouncedSearch || undefined,
    category: selectedCategory !== "Tous" ? selectedCategory : undefined,
    page,
  });

  const projects = data?.results ?? [];

  const toggleSave = (projectId: string) => {
    setSavedProjects((prev) =>
      prev.includes(projectId) ? prev.filter((id) => id !== projectId) : [...prev, projectId],
    );
  };

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
        <Card className="p-6">
          <div className="space-y-4">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                size={20}
              />
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
                      <Button variant="ghost" size="icon" onClick={() => toggleSave(project.id)}>
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
