import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  Loader2,
  AlertCircle,
  Tag,
  Clock,
  Calendar,
  Briefcase,
  User,
  MapPin,
  SendHorizonal,
  CreditCard,
  Paperclip,
  FileText,
} from "lucide-react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useProject, useProjectDocuments } from "@/hooks/useProjects";
import { useCreateProposal } from "@/hooks/useProposals";
import { ApiError } from "@/services/api.service";
import { ROUTES } from "@/constants/routes";

function daysLeft(deadline: string | null): string {
  if (!deadline) return "Non définie";
  const diff = Math.ceil(
    (new Date(deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  );
  if (diff <= 0) return "Délai expiré";
  return `${diff} jour${diff > 1 ? "s" : ""} restant${diff > 1 ? "s" : ""}`;
}

function ProjectDocumentsList({ projectId }: { projectId: string }) {
  const { data: docs } = useProjectDocuments(projectId);
  if (!docs || docs.length === 0) return null;
  return (
    <div className="mt-4 pt-4 border-t border-border space-y-2">
      <p className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
        <Paperclip size={12} />
        Documents joints ({docs.length})
      </p>
      {docs.map((doc) => (
        <a
          key={doc.id}
          href={doc.file}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-sm text-primary hover:underline"
        >
          <FileText size={13} className="flex-shrink-0" />
          <span className="truncate">{doc.title}</span>
          <span className="text-muted-foreground text-xs">({doc.doc_type_display})</span>
        </a>
      ))}
    </div>
  );
}

function SubmitProposalDialog({
  projectId,
  projectTitle,
  open,
  onOpenChange,
}: {
  projectId: string;
  projectTitle: string;
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
    if (!price || !durationDays || !message.trim()) {
      setError("Tous les champs sont obligatoires.");
      setErrorCode(null);
      return;
    }
    setError("");
    setErrorCode(null);
    try {
      await create.mutateAsync({
        project_id: projectId,
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

        <div className="p-3 rounded-lg bg-muted/50 text-sm mb-2">
          <p className="font-medium line-clamp-2">{projectTitle}</p>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="dp-price">Montant proposé (GNF) *</Label>
              <Input
                id="dp-price"
                type="number"
                min="1"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="Ex: 5000000"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="dp-duration">Durée (jours) *</Label>
              <Input
                id="dp-duration"
                type="number"
                min="1"
                value={durationDays}
                onChange={(e) => setDurationDays(e.target.value)}
                placeholder="Ex: 30"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="dp-message">Lettre de motivation *</Label>
            <Textarea
              id="dp-message"
              rows={5}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Décrivez pourquoi vous êtes le meilleur candidat pour ce projet…"
            />
          </div>

          {error && (
            <div className={`rounded-lg p-3 text-sm ${
              errorCode === "active_subscription_required" || errorCode === "proposal_quota_exhausted"
                ? "bg-primary/5 border border-primary/20"
                : "bg-destructive/5 border border-destructive/20"
            }`}>
              <p className={
                errorCode === "active_subscription_required" || errorCode === "proposal_quota_exhausted"
                  ? "text-primary font-medium"
                  : "text-destructive"
              }>
                {errorCode === "proposal_quota_exhausted"
                  ? "Quota de propositions atteint pour ce mois."
                  : errorCode === "monthly_credits_exhausted"
                  ? "Quota mensuel atteint — vos crédits du mois sont épuisés."
                  : errorCode === "annual_credits_exhausted"
                  ? "Quota annuel atteint — vos crédits annuels sont épuisés."
                  : errorCode === "monthly_credits_not_allowed"
                  ? "Votre abonnement ne permet pas de crédits mensuels."
                  : error}
              </p>
              {(errorCode === "active_subscription_required" || errorCode === "proposal_quota_exhausted") && (
                <Link
                  to={ROUTES.DASHBOARD.SUBSCRIPTION}
                  className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium text-primary underline underline-offset-2"
                  onClick={() => handleOpenChange(false)}
                >
                  <CreditCard size={12} />
                  {errorCode === "proposal_quota_exhausted" ? "Améliorer mon abonnement" : "Souscrire un abonnement"}
                </Link>
              )}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => handleOpenChange(false)}>Annuler</Button>
          <Button onClick={handleSubmit} disabled={create.isPending} className="gap-2">
            {create.isPending ? <Loader2 size={16} className="animate-spin" /> : <SendHorizonal size={16} />}
            Envoyer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

const DashboardProjectDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [proposalOpen, setProposalOpen] = useState(false);
  const { data: project, isLoading, isError } = useProject(id ?? "");

  return (
    <DashboardLayout userType="freelancer">
      <div className="max-w-3xl mx-auto space-y-5">
        {/* Back */}
        <button
          onClick={() => navigate(ROUTES.DASHBOARD.FIND_PROJECTS)}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft size={16} />
          Retour aux projets
        </button>

        {/* Loading */}
        {isLoading && (
          <div className="flex justify-center py-32">
            <Loader2 className="animate-spin text-primary" size={40} />
          </div>
        )}

        {/* Error */}
        {(isError || (!isLoading && !project)) && (
          <div className="text-center py-32 text-muted-foreground">
            <AlertCircle className="mx-auto mb-4" size={48} />
            <p className="text-lg font-medium">Projet introuvable</p>
            <p className="text-sm mt-1">Ce projet n'existe pas ou n'est plus disponible.</p>
            <Button variant="outline" className="mt-6" onClick={() => navigate(ROUTES.DASHBOARD.FIND_PROJECTS)}>
              Retour aux projets
            </Button>
          </div>
        )}

        {project && !isLoading && (
          <>
            {/* Header */}
            <Card className="p-6">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <Badge variant={project.status === "PUBLISHED" ? "default" : "secondary"} className="text-xs">
                      {project.status_display}
                    </Badge>
                    {project.category && (
                      <Badge variant="outline" className="text-xs">{project.category.name}</Badge>
                    )}
                  </div>
                  <h1 className="text-2xl font-bold text-foreground leading-snug">{project.title}</h1>
                  <div className="flex items-center gap-1.5 mt-2 text-sm text-muted-foreground">
                    <User size={13} />
                    <span>Client : <span className="text-foreground font-medium">{project.client.username}</span></span>
                  </div>
                </div>

                <Button
                  onClick={() => setProposalOpen(true)}
                  className="gap-2 flex-shrink-0"
                >
                  <SendHorizonal size={16} />
                  Soumettre une proposition
                </Button>
              </div>

              {/* Métriques */}
              <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-muted/50 rounded-xl p-3">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                    <Tag size={11} /> Budget
                  </div>
                  <p className="font-bold text-foreground text-sm">
                    {project.budget_amount
                      ? `${Number(project.budget_amount).toLocaleString("fr-GN")} GNF`
                      : project.budget_band_display}
                  </p>
                </div>

                <div className="bg-muted/50 rounded-xl p-3">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                    <Clock size={11} /> Délai
                  </div>
                  <p className="font-bold text-foreground text-sm">{daysLeft(project.deadline)}</p>
                </div>

                <div className="bg-muted/50 rounded-xl p-3">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                    <MapPin size={11} /> Lieu
                  </div>
                  <p className="font-bold text-foreground text-sm">Remote</p>
                </div>

                <div className="bg-muted/50 rounded-xl p-3">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                    <Calendar size={11} /> Publié le
                  </div>
                  <p className="font-bold text-foreground text-sm">
                    {new Date(project.created_at).toLocaleDateString("fr-FR")}
                  </p>
                </div>
              </div>
            </Card>

            {/* Description */}
            <Card className="p-6">
              <h2 className="font-semibold text-base mb-3 flex items-center gap-2">
                <Briefcase size={15} />
                Description du projet
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                {project.description}
              </p>
              <ProjectDocumentsList projectId={project.id} />
            </Card>

            {/* Compétences */}
            {(project.skills?.length > 0 || project.speciality) && (
              <Card className="p-6">
                <h2 className="font-semibold text-base mb-3">Compétences recherchées</h2>
                <div className="flex flex-wrap gap-2">
                  {project.speciality && (
                    <Badge variant="secondary" className="text-sm px-3 py-1">
                      {project.speciality.name}
                    </Badge>
                  )}
                  {project.skills?.map((sk) => (
                    <Badge key={sk.id} variant="outline" className="text-sm px-3 py-1">
                      {sk.name}
                    </Badge>
                  ))}
                </div>
              </Card>
            )}

            {/* CTA bas */}
            <div className="flex justify-center pb-6">
              <Button onClick={() => setProposalOpen(true)} size="lg" className="gap-2">
                <SendHorizonal size={16} />
                Soumettre une proposition
              </Button>
            </div>
          </>
        )}
      </div>

      {project && (
        <SubmitProposalDialog
          projectId={project.id}
          projectTitle={project.title}
          open={proposalOpen}
          onOpenChange={setProposalOpen}
        />
      )}
    </DashboardLayout>
  );
};

export default DashboardProjectDetail;
